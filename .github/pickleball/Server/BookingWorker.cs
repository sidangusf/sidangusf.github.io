using System.Globalization;
using System.Threading.Channels;
using Microsoft.Playwright;

namespace CourtClub;

public sealed class BookingWorker(Store store,Member[] members)
{
    public const string ReservationUrl="https://anc.apm.activecommunities.com/fremont/reservation/landing/quick?groupId=6";
    private readonly Channel<string> queue=Channel.CreateUnbounded<string>(new(){SingleReader=true});
    public void Enqueue(string id)=>queue.Writer.TryWrite(id);
    public IAsyncEnumerable<string> Pending(CancellationToken token)=>queue.Reader.ReadAllAsync(token);
    public List<string> Blockers(Member member)
    {
        List<string> result=[];
        if(Environment.GetEnvironmentVariable("CLUB_SITE_PERMISSION_CONFIRMED")!="true")result.Add("Host setup: confirm permission to automate this booking site.");
        if(Environment.GetEnvironmentVariable("CLUB_RULES_CONFIRMED")!="true")result.Add("Host setup: verify resident eligibility, 7:30 AM Pacific release, and two-hour bookings.");
        if(member.CanManage && (string.IsNullOrEmpty(member.CdpUrl)||string.IsNullOrEmpty(member.LiveViewUrl)))result.Add("Host setup: connect a private booking browser with interactive access.");
        return result;
    }
    private void Status(string id,string status,string message,string? court=null)=>store.Update(id,j=>j with{Status=status,Message=message,Court=court??j.Court});
    private bool Paused(string id)
    {
        if(store.Read().Schedule.Enabled)return false;
        Status(id,"paused","Schedule paused. No further automatic actions will run.");return true;
    }
    public async Task Run(string id,CancellationToken token)
    {
        var job=store.Get(id);if(job is null)return;
        var member=members.FirstOrDefault(m=>m.Id==job.OwnerId);
        if(member is null||!member.CanManage||Blockers(member).Count>0){Status(id,"setup_required","Host setup is incomplete; no website actions were performed.");return;}
        if(Paused(id))return;
        using var playwright=await Playwright.CreateAsync();
        await using var browser=await playwright.Chromium.ConnectOverCDPAsync(member.CdpUrl,new(){Timeout=30000});
        if(browser.Contexts.Count!=1){Status(id,"setup_required","Expected exactly one isolated browser context for this member.");return;}
        var context=browser.Contexts[0];
        var page=context.Pages.FirstOrDefault(p=>p.Url.StartsWith("https://anc.apm.activecommunities.com/fremont/",StringComparison.Ordinal))??await context.NewPageAsync();
        page.SetDefaultTimeout(15000);
        await page.GotoAsync(ReservationUrl,new(){WaitUntil=WaitUntilState.DOMContentLoaded});
        // Stop on challenge/error pages; do not attempt to bypass any site controls.
        try { await page.GetByRole(AriaRole.Combobox,new(){Name="Date picker, current date",Exact=true}).WaitForAsync(new(){Timeout=20000}); }
        catch(PlaywrightException){Status(id,"unverified","The booking page did not load normally. Inspect the booking browser; no automatic retry will run.");return;}
        if(await page.GetByRole(AriaRole.Link,new(){Name="Sign In",Exact=true}).CountAsync()>0)
        {Status(id,"login_required","Sign in in the booking browser, then press resume here. Credentials stay on Fremont's site.");return;}
        if(job.Release>DateTimeOffset.UtcNow)
        {
            Status(id,"preparing","Browser is ready. Waiting until the scheduled release time.");
            while(DateTimeOffset.UtcNow<job.Release)
            {
                token.ThrowIfCancellationRequested();if(Paused(id))return;
                var remaining=job.Release-DateTimeOffset.UtcNow;
                if(remaining>TimeSpan.Zero)await Task.Delay(remaining<TimeSpan.FromSeconds(1)?remaining:TimeSpan.FromSeconds(1),token);
            }
        }
        if(DateTimeOffset.UtcNow>=job.Release.AddMinutes(10)){Status(id,"missed","The booking attempt window expired. No late reservation was attempted.");return;}
        if(Paused(id))return;
        Status(id,"checking","Checking A, B, C and D for all four half-hour slots.");
        await page.ReloadAsync(new(){WaitUntil=WaitUntilState.DOMContentLoaded});
        await page.GetByRole(AriaRole.Combobox,new(){Name="Date picker, current date",Exact=true}).ClickAsync();
        var target=DateOnly.ParseExact(job.PlayDate,"yyyy-MM-dd",CultureInfo.InvariantCulture);
        var label=target.ToString("MMM d, yyyy",CultureInfo.InvariantCulture);
        var day=page.GetByRole(AriaRole.Gridcell,new(){Name=label,Exact=true});
        if(await day.CountAsync()==0)await page.GetByRole(AriaRole.Button,new(){Name="Switch calendar to next month right arrow",Exact=true}).ClickAsync();
        await day.ClickAsync();
        var table=page.GetByRole(AriaRole.Table,new(){Name=$"Schedule for Pickleball Courts on {label}.",Exact=false});
        await table.WaitForAsync();
        await page.GetByRole(AriaRole.Status).Filter(new(){HasText="loading"}).WaitForAsync(new(){State=WaitForSelectorState.Hidden});
        await table.GetByRole(AriaRole.Gridcell,new(){Name="FTC Pickleball Court A 7:00 PM - 7:30 PM",Exact=false}).WaitForAsync();
        List<string> labels=[];
        foreach(var candidate in Rules.Courts)
            foreach(var slot in Rules.Slots)
            {
                var available=$"FTC Pickleball Court {candidate} {slot} Available";
                if(await table.GetByRole(AriaRole.Gridcell,new(){Name=available,Exact=true}).CountAsync()==1)labels.Add(available);
            }
        var court=Rules.PickCourt(labels);
        if(court is null){Status(id,"no_availability","No single court A–D was available for the full 7–9 PM session. Nothing was booked.");return;}
        if(Paused(id))return;
        foreach(var slot in Rules.Slots)
        {
            token.ThrowIfCancellationRequested();if(Paused(id))return;
            await table.GetByRole(AriaRole.Gridcell,new(){Name=$"FTC Pickleball Court {court} {slot} Available",Exact=true}).ClickAsync();
        }
        await page.GetByRole(AriaRole.Rowheader,new(){Name=$"FTC Pickleball Court {court} 7:00 PM - 9:00 PM Selected",Exact=true}).WaitForAsync();
        await page.GetByRole(AriaRole.Textbox,new(){Name="Event name",Exact=true}).FillAsync("Wednesday pickleball");
        if(Paused(id))return;
        await page.GetByRole(AriaRole.Button,new(){Name="1 Resource(s), 1 Booking(s) selected Confirm bookings",Exact=true}).ClickAsync();
        await page.GetByRole(AriaRole.Dialog,new(){Name="Answer questions, read disclaimers and sign waivers",Exact=true}).WaitForAsync();
        Status(id,"review_required","Court selection is ready, not reserved. Open the booking browser, review/sign the waivers, review the price, and complete checkout. Then record your confirmation here.",court);
        // Never sign, pay, or click Reserve without a validated checkout integration.
        // CDP disconnect leaves the remote browser for the human to operate.
    }
}

public sealed class Scheduler(Store store,BookingWorker worker,ILogger<Scheduler> logger):BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken token)=>await Task.WhenAll(Tick(token),Consume(token));
    private async Task Tick(CancellationToken token)
    {
        while(!token.IsCancellationRequested)
        {
            var now=DateTimeOffset.UtcNow;var local=TimeZoneInfo.ConvertTime(now,Rules.Pacific);var day=DateOnly.FromDateTime(local.DateTime);
            if(day.DayOfWeek==DayOfWeek.Wednesday)
            {
                var release=Rules.ReleaseOn(day);var schedule=store.Read().Schedule;
                if(schedule.Enabled&&Rules.IsDue(now,release))
                {
                    var job=new Job(Guid.NewGuid().ToString("N"),schedule.OwnerId,Rules.PlayDate(release).ToString("yyyy-MM-dd"),release,"preparing","Preparing the private booking browser.");
                    if(store.TryAdd(job))worker.Enqueue(job.Id);
                }
            }
            await Task.Delay(TimeSpan.FromSeconds(1),token);
        }
    }
    private async Task Consume(CancellationToken token)
    {
        await foreach(var id in worker.Pending(token))
        {
            try{await worker.Run(id,token);}
            catch(OperationCanceledException)when(token.IsCancellationRequested){break;}
            catch(Exception ex)
            {
                // Full exception messages can contain a secret remote-browser URL.
                logger.LogWarning("Booking attempt stopped: {Type}",ex.GetType().Name);
                store.Update(id,j=>j with{Status="unverified",Message="The booking flow stopped unexpectedly. Inspect the same browser before taking further action. No automatic retry will run."});
            }
        }
    }
}
