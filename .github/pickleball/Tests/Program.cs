using CourtClub;

static void Check(bool condition,string name){if(!condition)throw new Exception(name);Console.WriteLine("PASS "+name);}
Check(Rules.ValidCdpEndpoint("wss://browser.example/session",false),"Remote browser still requires TLS");
Check(!Rules.ValidCdpEndpoint("http://127.0.0.1:9222",false),"Local browser is opt-in");
Check(Rules.ValidCdpEndpoint("http://127.0.0.1:9222",true),"Exact local endpoint allowed when enabled");
Check(new[]{"http://example.com:9222","http://127.0.0.1:8080","http://localhost:9222","http://127.0.0.1:9222@evil.example","ws://example.com:9222","http://127.0.0.1:9222/other"}.All(s=>!Rules.ValidCdpEndpoint(s,true)),"Local opt-in does not allow arbitrary insecure endpoints");
Check(Rules.ReleaseOn(new(2026,10,28)).UtcDateTime==new DateTime(2026,10,28,14,30,0,DateTimeKind.Utc),"PDT release");
Check(Rules.ReleaseOn(new(2026,11,4)).UtcDateTime==new DateTime(2026,11,4,15,30,0,DateTimeKind.Utc),"PST release after fall transition");
Check(Rules.ReleaseOn(new(2027,3,17)).UtcDateTime==new DateTime(2027,3,17,14,30,0,DateTimeKind.Utc),"Spring transition");
Check(Rules.PlayDate(Rules.ReleaseOn(new(2026,10,28)))==new DateOnly(2026,11,4),"Seven local calendar days across DST");
var now=DateTimeOffset.Parse("2026-10-26T17:00:00Z");
Check(Rules.NextRelease(now)==DateTimeOffset.Parse("2026-10-28T14:30:00Z"),"Next Wednesday");
Check(Rules.NextRelease(DateTimeOffset.Parse("2026-10-28T14:30:00Z"))==DateTimeOffset.Parse("2026-11-04T15:30:00Z"),"Exact boundary advances next display");
var release=Rules.ReleaseOn(new(2026,10,28));
Check(!Rules.IsDue(release.AddMinutes(-3),release)&&Rules.IsDue(release.AddMinutes(-2),release)&&!Rules.IsDue(release.AddMinutes(2),release),"Bounded preparation window");
var labels=Rules.Slots.Select(s=>$"FTC Pickleball Court B {s} Available").Concat(Rules.Slots.Take(3).Select(s=>$"FTC Pickleball Court A {s} Available"));
Check(Rules.PickCourt(labels)=="B","Skip partial court A, use full B");
Check(Rules.PickCourt(Rules.Slots.Select(s=>$"FTC Pickleball Court A {s} Unavailable")) is null,"Unavailable is not Available");
Check(Rules.PickCourt(Rules.Slots.Select(s=>$"FTC Orange Ball/Pickleball Court 1 {s} Available")) is null,"Exclude Orange courts");
Check(Rules.Matches("a private invitation",Rules.Hash("a private invitation"))&&!Rules.Matches("wrong",Rules.Hash("a private invitation")),"Invite key verification");
var directory=Path.Combine(Path.GetTempPath(),"court-tests-"+Guid.NewGuid().ToString("N"));
try{
    using(var store=new Store(directory)){
        var added=0;
        Parallel.For(0,30,i=>{if(store.TryAdd(new(i.ToString(),"host","2026-11-04",release,"preparing","")))Interlocked.Increment(ref added);});
        Check(added==1&&store.Read().Jobs.Count==1,"Concurrent attempts create one group job");
        store.SetSchedule(new(true,"host"));var id=store.Read().Jobs[0].Id;
        Check(!store.ReportConfirmation(id,"test"),"Cannot report an in-progress attempt as confirmed");
        store.Update(id,j=>j with{Status="login_required"});
        Check(!store.TryResume(id,release.AddMinutes(11)),"Expired handoff cannot resume");
        Check(store.TryResume(id,release)&&!store.TryResume(id,release),"Resume is atomic");
    }
    using(var store=new Store(directory)){
        Check(store.Read().Schedule.Enabled,"Schedule survives restart");
        Check(store.Read().Jobs.Single().Status=="interrupted","Interrupted attempt never auto-replays");
        Check(!store.TryAdd(new("duplicate","friend","2026-11-04",release,"preparing","")),"Restart preserves group idempotency");
        var id=store.Read().Jobs.Single().Id;
        Check(store.ReportConfirmation(id,"test-receipt")&&!store.ReportConfirmation(id,"replacement"),"Confirmation transition is atomic");
        Check(store.Read().Jobs.Single().Status=="reported_confirmed","Human report is distinct from verified booking");
    }
}finally{Directory.Delete(directory,true);}
Console.WriteLine("All checks passed.");
