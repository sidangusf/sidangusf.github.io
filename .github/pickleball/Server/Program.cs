using CourtClub;
using System.Text.Json;
using System.Threading.RateLimiting;

var builder=WebApplication.CreateBuilder(args);
var members=JsonSerializer.Deserialize<Member[]>(Environment.GetEnvironmentVariable("CLUB_MEMBERS_JSON") ?? "[]", new JsonSerializerOptions {PropertyNameCaseInsensitive=true}) ?? [];
if(members.Length==0 || members.Select(m=>m.Id).Distinct().Count()!=members.Length || members.Any(m=>string.IsNullOrWhiteSpace(m.Id)||string.IsNullOrEmpty(m.TokenHash)||m.TokenHash.Length!=64||!m.TokenHash.All(Uri.IsHexDigit)))
    throw new InvalidOperationException("Configure unique members and SHA256 invite-key hashes in CLUB_MEMBERS_JSON.");
foreach(var member in members)
{
    if(!string.IsNullOrEmpty(member.CdpUrl) && (!Uri.TryCreate(member.CdpUrl,UriKind.Absolute,out var cdp)||cdp.Scheme!="wss"))throw new InvalidOperationException("CDP endpoints must use wss.");
    if(!string.IsNullOrEmpty(member.LiveViewUrl) && (!Uri.TryCreate(member.LiveViewUrl,UriKind.Absolute,out var live)||live.Scheme!="https"||!string.IsNullOrEmpty(live.UserInfo)))throw new InvalidOperationException("Live views must use https without userinfo.");
}
if(members.Where(m=>!string.IsNullOrEmpty(m.CdpUrl)).GroupBy(m=>m.CdpUrl).Any(g=>g.Count()>1))throw new InvalidOperationException("Each member needs an isolated browser session.");
var allowedOrigin=Environment.GetEnvironmentVariable("CLUB_WEB_ORIGIN")??"https://www.995studio.com";
builder.Services.AddCors(o=>o.AddDefaultPolicy(p=>p.WithOrigins(allowedOrigin).WithMethods("GET","POST").WithHeaders("Authorization","Content-Type")));
builder.Services.AddRateLimiter(o=>{o.RejectionStatusCode=429;o.GlobalLimiter=PartitionedRateLimiter.Create<HttpContext,string>(c=>RateLimitPartition.GetFixedWindowLimiter(c.Connection.RemoteIpAddress?.ToString()??"unknown",_=>new(){PermitLimit=120,Window=TimeSpan.FromMinutes(1),QueueLimit=0}));});
builder.WebHost.ConfigureKestrel(o=>o.Limits.MaxRequestBodySize=4096);
builder.Services.AddSingleton(members);
builder.Services.AddSingleton(new Store(Environment.GetEnvironmentVariable("CLUB_DATA_DIR")??"/data"));
builder.Services.AddSingleton<BookingWorker>();
builder.Services.AddHostedService<Scheduler>();
var app=builder.Build();
app.UseCors();app.UseRateLimiter();
app.Use(async(context,next)=>{
    context.Response.Headers.CacheControl="no-store";
    context.Response.Headers["X-Content-Type-Options"]="nosniff";
    if(context.Request.Path.StartsWithSegments("/api"))
    {
        var authorization=context.Request.Headers.Authorization.ToString();
        var token=authorization.StartsWith("Bearer ",StringComparison.Ordinal)?authorization[7..]:"";
        var member=token.Length is >=32 and <=256?members.FirstOrDefault(m=>Rules.Matches(token,m.TokenHash)):null;
        if(member is null){context.Response.StatusCode=401;await context.Response.WriteAsJsonAsync(new{error="Invalid invite key."});return;}
        context.Items["member"]=member;
    }
    await next();
});
Member Current(HttpContext c)=>(Member)c.Items["member"]!;
app.MapGet("/health",()=>Results.Ok(new{status="ok"}));
app.MapGet("/api/status",(HttpContext c,Store store,BookingWorker worker)=>{
    var me=Current(c);var state=store.Read();var blockers=worker.Blockers(me);
    return Results.Ok(new{
        member=new{me.Id,me.Name},canManage=me.CanManage,ready=blockers.Count==0,blockers,
        schedule=new{state.Schedule.Enabled,ownerName=members.FirstOrDefault(m=>m.Id==state.Schedule.OwnerId)?.Name??""},
        nextRelease=Rules.NextRelease(DateTimeOffset.UtcNow),
        jobs=state.Jobs.OrderByDescending(j=>j.Release).Take(30).Select(j=>new{j.Id,j.PlayDate,j.Status,j.Message,j.Court,
            canAct=j.OwnerId==me.Id && (Rules.CanResume(j,DateTimeOffset.UtcNow) || j.Status is "review_required" or "interrupted" or "unverified"),
            liveViewUrl=j.OwnerId==me.Id?me.LiveViewUrl:null})});
});
app.MapPost("/api/schedule",(ScheduleInput input,HttpContext c,Store store,BookingWorker worker)=>{
    var me=Current(c);if(!me.CanManage)return Results.Json(new{error="Only a designated host can manage the group schedule."},statusCode:403);
    var blockers=worker.Blockers(me);if(input.Enabled&&blockers.Count>0)return Results.BadRequest(new{error=string.Join(" ",blockers)});
    store.SetSchedule(new(input.Enabled,me.Id));return Results.Ok(new{saved=true});
});
app.MapPost("/api/jobs/{id}/resume",(string id,HttpContext c,Store store,BookingWorker worker)=>{
    var me=Current(c);var job=store.Get(id);if(job is null||job.OwnerId!=me.Id)return Results.NotFound(new{error="Attempt not found."});
    if(!store.Read().Schedule.Enabled)return Results.Conflict(new{error="The schedule is paused."});
    if(!store.TryResume(id,DateTimeOffset.UtcNow))return Results.Conflict(new{error="This attempt cannot be resumed, or its ten-minute window expired."});
    worker.Enqueue(id);return Results.Ok(new{resuming=true});
});
app.MapPost("/api/jobs/{id}/confirmation",(string id,ConfirmationInput input,HttpContext c,Store store)=>{
    var me=Current(c);var job=store.Get(id);if(job is null||job.OwnerId!=me.Id)return Results.NotFound(new{error="Attempt not found."});
    var reference=input.Reference?.Trim()??"";if(reference.Length is <1 or >100 || reference.Any(char.IsControl))return Results.BadRequest(new{error="Enter a valid confirmation number."});
    if(!store.ReportConfirmation(id,reference))return Results.Conflict(new{error="This attempt is not awaiting a confirmation."});
    return Results.Ok(new{recorded=true});
});
app.Run();
