using Microsoft.Playwright;
using System.Text.RegularExpressions;

namespace CourtClub;

public sealed record BrowserCheckResult(bool Passed,string Message,string? Schedule,List<CourtCheck> Courts);
public sealed record CourtCheck(string Court,int RecognizedSlots,int AvailableSlots);

// Inspect only the page the host already opened. No navigation, clicks, form writes,
// reservation requests, or changes to the booking store belong in this class.
public sealed class BrowserCheck
{
    private readonly SemaphoreSlim gate=new(1,1);
    public async Task<BrowserCheckResult> Run(Member member)
    {
        if(!await gate.WaitAsync(0))return new(false,"A browser check is already running. Try again shortly.",null,[]);
        try
        {
            if(string.IsNullOrEmpty(member.CdpUrl))return new(false,"The host browser is not configured.",null,[]);
            using var playwright=await Playwright.CreateAsync();
            await using var browser=await playwright.Chromium.ConnectOverCDPAsync(member.CdpUrl,new(){Timeout=5000});
            if(browser.Contexts.Count!=1)return new(false,"Expected one private browser context.",null,[]);
            var pages=browser.Contexts[0].Pages.Where(p=>IsReservationPage(p.Url)).ToArray();
            if(pages.Length!=1)return new(false,"Open exactly one Fremont pickleball quick-reservation tab in the booking browser, then try again.",null,[]);
            return await Inspect(pages[0]);
        }
        catch(PlaywrightException)
        {
            // Exception details can expose CDP credentials or private page content.
            return new(false,"The browser could not be inspected. Check the remote Chrome window, finish any login or challenge, and try again.",null,[]);
        }
        finally{gate.Release();}
    }

    public static bool IsReservationPage(string url)=>Uri.TryCreate(url,UriKind.Absolute,out var uri)
        && uri.Scheme=="https" && uri.Host=="anc.apm.activecommunities.com"
        && uri.AbsolutePath=="/fremont/reservation/landing/quick" && uri.Query=="?groupId=6";

    public static async Task<BrowserCheckResult> Inspect(IPage page)
    {
        if(await page.GetByRole(AriaRole.Link,new(){Name="Sign Out",Exact=true}).CountAsync()!=1
            || await page.GetByRole(AriaRole.Link,new(){Name="Sign In",Exact=true}).CountAsync()>0)
            return new(false,"A signed-in session was not confirmed. Sign in on Fremont in the booking browser and leave the schedule open.",null,[]);
        var picker=page.GetByRole(AriaRole.Combobox,new(){Name="Date picker, current date",Exact=true});
        var table=page.GetByRole(AriaRole.Table,new(){NameRegex=new Regex(@"^Schedule for Pickleball Courts on ")});
        if(await picker.CountAsync()!=1 || await table.CountAsync()!=1)
            return new(false,"The date picker or pickleball schedule was not recognized. Return to the quick-reservation schedule and close any popup.",null,[]);
        // Only return the schedule label, never names, cookies, tokens or page HTML.
        var label=await table.GetAttributeAsync("aria-label",new(){Timeout=1000});
        if(label is null || label.Length>120)label="Current displayed date";
        List<CourtCheck> courts=[];
        foreach(var court in Rules.Courts)
        {
            var recognized=0;var available=0;
            foreach(var slot in Rules.Slots)
            {
                var prefix=$"FTC Pickleball Court {court} {slot}";
                if(await table.GetByRole(AriaRole.Gridcell,new(){NameRegex=new Regex("^"+Regex.Escape(prefix)+@"(?:\s|$)")}).CountAsync()==1)recognized++;
                if(await table.GetByRole(AriaRole.Gridcell,new(){Name=prefix+" Available",Exact=true}).CountAsync()==1)available++;
            }
            courts.Add(new(court,recognized,available));
        }
        var passed=courts.All(c=>c.RecognizedSlots==Rules.Slots.Length);
        return new(passed,passed
            ? "Signed-in browser, date picker and all 16 evening slots recognized. Availability is for the displayed date only. Nothing was selected or booked."
            : "Signed-in browser detected, but some evening slots were not recognized. Show 7–9 PM in the schedule and try again. This does not mean the courts are sold out.",label,courts);
    }
}
