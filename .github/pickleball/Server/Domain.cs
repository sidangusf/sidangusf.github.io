using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace CourtClub;

public record Member(string Id, string Name, string TokenHash, string CdpUrl, string LiveViewUrl, bool CanManage);
public record Schedule(bool Enabled = false, string OwnerId = "");
public record Job(string Id, string OwnerId, string PlayDate, DateTimeOffset Release, string Status, string Message, string Court = "", string Reference = "");
public record ClubState(Schedule Schedule, List<Job> Jobs);
public record ScheduleInput(bool Enabled);
public record ConfirmationInput(string Reference);

public static class Rules
{
    public static bool ValidCdpEndpoint(string value, bool allowLocal)
    {
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri)) return false;
        if (uri.Scheme == "wss") return true;
        return allowLocal && value == "http://127.0.0.1:9222";
    }
    public static readonly TimeZoneInfo Pacific = TimeZoneInfo.FindSystemTimeZoneById("America/Los_Angeles");
    public static readonly string[] Courts = ["A", "B", "C", "D"];
    public static readonly string[] Slots = ["7:00 PM - 7:30 PM", "7:30 PM - 8:00 PM", "8:00 PM - 8:30 PM", "8:30 PM - 9:00 PM"];
    public static DateTimeOffset ReleaseOn(DateOnly day) => new(TimeZoneInfo.ConvertTimeToUtc(day.ToDateTime(new TimeOnly(7, 30)), Pacific));
    public static DateTimeOffset NextRelease(DateTimeOffset now)
    {
        var local = TimeZoneInfo.ConvertTime(now, Pacific);
        var day = DateOnly.FromDateTime(local.DateTime);
        day = day.AddDays(((int)DayOfWeek.Wednesday - (int)day.DayOfWeek + 7) % 7);
        var release = ReleaseOn(day);
        return release > now ? release : ReleaseOn(day.AddDays(7));
    }
    public static DateOnly PlayDate(DateTimeOffset release) => DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(release, Pacific).DateTime).AddDays(7);
    public static bool IsDue(DateTimeOffset now, DateTimeOffset release) => now >= release.AddMinutes(-2) && now < release.AddMinutes(2);
    public static bool CanResume(Job job, DateTimeOffset now) => job.Status == "login_required" && now < job.Release.AddMinutes(10);
    public static string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    public static bool Matches(string token, string expected)
    {
        try { return CryptographicOperations.FixedTimeEquals(Convert.FromHexString(Hash(token)), Convert.FromHexString(expected)); }
        catch (FormatException) { return false; }
    }
    public static string? PickCourt(IEnumerable<string> labels)
    {
        var available = labels.ToHashSet(StringComparer.Ordinal);
        return Courts.FirstOrDefault(c => Slots.All(s => available.Contains($"FTC Pickleball Court {c} {s} Available")));
    }
}

public sealed class Store : IDisposable
{
    private readonly object gate = new();
    private readonly string path;
    private readonly FileStream lease;
    private ClubState state;
    public Store(string directory)
    {
        Directory.CreateDirectory(directory);
        lease = new FileStream(Path.Combine(directory, "instance.lock"), FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None);
        path = Path.Combine(directory, "club.json");
        state = File.Exists(path) ? JsonSerializer.Deserialize<ClubState>(File.ReadAllText(path)) ?? throw new InvalidDataException("Invalid state") : new(new(), []);
        // A crash leaves an ambiguous external outcome. Never replay an attempt.
        Commit(state with { Jobs = state.Jobs.Select(j => j.Status is "preparing" or "checking" ? j with {Status="interrupted", Message="Worker restarted. Inspect the booking browser before any further action."} : j).ToList() });
    }
    private void Commit(ClubState next)
    {
        var temp = path + ".tmp";
        using (var file = new FileStream(temp, FileMode.Create, FileAccess.Write, FileShare.None))
        { JsonSerializer.Serialize(file, next); file.Flush(true); }
        File.Move(temp, path, true);
        state = next;
    }
    public ClubState Read() { lock (gate) return state with { Jobs = state.Jobs.ToList() }; }
    public void SetSchedule(Schedule value) { lock(gate) Commit(state with { Schedule=value }); }
    public bool TryAdd(Job job)
    {
        lock(gate)
        {
            if(state.Jobs.Any(j=>j.PlayDate==job.PlayDate))return false;
            Commit(state with {Jobs=state.Jobs.Append(job).ToList()}); return true;
        }
    }
    public Job? Get(string id) { lock(gate) return state.Jobs.FirstOrDefault(j=>j.Id==id); }
    public void Update(string id, Func<Job,Job> update)
    { lock(gate) Commit(state with {Jobs=state.Jobs.Select(j=>j.Id==id?update(j):j).ToList()}); }
    public bool TryResume(string id, DateTimeOffset now)
    {
        lock(gate)
        {
            var job=state.Jobs.FirstOrDefault(j=>j.Id==id);
            if(job is null || !Rules.CanResume(job,now))return false;
            Commit(state with {Jobs=state.Jobs.Select(j=>j.Id==id?j with {Status="preparing",Message="Resuming after human sign-in."}:j).ToList()});return true;
        }
    }
    public bool ReportConfirmation(string id, string reference)
    {
        lock(gate)
        {
            var job=state.Jobs.FirstOrDefault(j=>j.Id==id);
            if(job is null || job.Status is not ("review_required" or "interrupted" or "unverified")) return false;
            Commit(state with {Jobs=state.Jobs.Select(j=>j.Id==id?j with {Status="reported_confirmed",Reference=reference,Message="Host reported a completed reservation. Verify the receipt in Fremont."}:j).ToList()});return true;
        }
    }
    public void Dispose()=>lease.Dispose();
}
