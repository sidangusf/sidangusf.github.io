using CourtClub;
using Microsoft.Playwright;

public static class BrowserChecks
{
    public static async Task Run()
    {
        static void Check(bool condition,string name){if(!condition)throw new Exception(name);Console.WriteLine("PASS "+name);}
        Check(BrowserCheck.IsReservationPage(BookingWorker.ReservationUrl),"Recognize Fremont reservation URL");
        Check(!BrowserCheck.IsReservationPage("https://anc.apm.activecommunities.com.evil.test/fremont/reservation/landing/quick?groupId=6")
            && !BrowserCheck.IsReservationPage("https://anc.apm.activecommunities.com/fremont/reservation/landing/quick?groupId=7"),"Reject other hosts and court groups");
        using var playwright=await Playwright.CreateAsync();
        await using var browser=await playwright.Chromium.LaunchAsync(new(){Headless=true});
        var page=await browser.NewPageAsync();
        string Fixture(bool signedIn=true,bool missing=false,bool available=false)=>
            $"<a href='#'>{(signedIn?"Sign Out":"Sign In")}</a><button role='combobox' aria-label='Date picker, current date'>Oct 28</button>"+
            "<div role='table' aria-label='Schedule for Pickleball Courts on Oct 28, 2026.'><div role='row'>"+
            string.Join("",Rules.Courts.SelectMany(c=>Rules.Slots.Select((s,i)=>missing&&c=="D"&&i==3?"":$"<div role='gridcell' aria-label='FTC Pickleball Court {c} {s} {(available?"Available":"Unavailable")}'></div>")))+"</div></div>";
        await page.SetContentAsync(Fixture());
        var before=await page.ContentAsync();
        var result=await BrowserCheck.Inspect(page);
        Check(result.Passed && result.Courts.All(c=>c.AvailableSlots==0),"Unavailable courts still pass connection check");
        Check(before==await page.ContentAsync(),"Inspection leaves page markup unchanged");
        await page.SetContentAsync(Fixture(available:true));
        result=await BrowserCheck.Inspect(page);
        Check(result.Passed && result.Courts.All(c=>c.AvailableSlots==4),"Recognize all available half-hour slots");
        await page.SetContentAsync(Fixture(missing:true));
        result=await BrowserCheck.Inspect(page);
        Check(!result.Passed && result.Courts.Single(c=>c.Court=="D").RecognizedSlots==3,"Missing slot fails instead of reporting sold out");
        await page.SetContentAsync(Fixture(signedIn:false));
        Check(!(await BrowserCheck.Inspect(page)).Passed,"Signed-out session fails");
        await page.SetContentAsync("<a href='#'>Sign Out</a><p>Verify you are human</p>");
        Check(!(await BrowserCheck.Inspect(page)).Passed,"Unrecognized page fails without interacting");

        var html=File.ReadAllText("pickleball/index.html");
        html=System.Text.RegularExpressions.Regex.Replace(html,@"<script\b[^>]*>.*?</script>","",System.Text.RegularExpressions.RegexOptions.Singleline);
        await page.SetContentAsync(html);
        await page.AddScriptTagAsync(new(){Content="""
            window.COURT_CLUB_CONFIG={apiOrigin:'https://api.example.test'};
            window.fetch=async(url)=>{
              const data=url.endsWith('/api/status')
                ? {member:{name:'Host'},canManage:true,ready:false,blockers:['Permission not confirmed'],schedule:{enabled:false},nextRelease:'2026-10-28T14:30:00Z',jobs:[]}
                : {passed:true,message:'Read-only test passed.',schedule:'Oct 28',courts:[{court:'A',recognizedSlots:4,availableSlots:0}]};
              if(window.delayCheck && url.endsWith('/api/browser-check'))await new Promise(resolve=>window.finishCheck=resolve);
              return {ok:true,json:async()=>data};
            };
            """});
        await page.AddScriptTagAsync(new(){Content=File.ReadAllText("pickleball/app.js")});
        await page.Locator("#invite").FillAsync("fixture-key");
        await page.Locator("#connect").ClickAsync();
        await page.Locator("#identity").WaitForAsync();
        Check(await page.Locator("#browser-check").IsEnabledAsync() && await page.Locator("#enable").IsDisabledAsync(),"Host can inspect while booking permission remains blocked");
        await page.Locator("#browser-check").ClickAsync();
        await page.WaitForFunctionAsync("document.getElementById('browser-check-result').textContent.startsWith('PASS:')");
        Check((await page.Locator("#browser-check-result").InnerTextAsync()).Contains("4/4 slots recognized, 0 available"),"Dashboard renders recognized but unavailable slots");
        await page.EvaluateAsync("window.delayCheck=true");
        await page.Locator("#browser-check").ClickAsync();
        await page.WaitForFunctionAsync("typeof window.finishCheck === 'function'");
        await page.Locator("#disconnect").ClickAsync();
        await page.EvaluateAsync("window.finishCheck()");
        await page.EvaluateAsync("() => new Promise(resolve => setTimeout(resolve, 50))");
        Check(await page.Locator("#browser-check-panel").IsHiddenAsync() && await page.Locator("#browser-check-result").InnerTextAsync()=="","Late diagnostic result cannot repopulate disconnected dashboard");
    }
}
