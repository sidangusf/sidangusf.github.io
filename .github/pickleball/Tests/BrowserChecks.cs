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
    }
}
