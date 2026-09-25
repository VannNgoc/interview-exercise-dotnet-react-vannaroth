namespace CourseTracker.Api.Models;

// A course whose syllabus is synced to an external system (e.g. SimpleSyllabus).
public record Course
{
    public int Id { get; init; }
    public string Code { get; init; } = "";        // e.g. "CS 101"
    public string Title { get; init; } = "";        // e.g. "Intro to Computer Science"
    public string Department { get; init; } = "";    // e.g. "Computer Science"
    public string Term { get; init; } = "";          // e.g. "Fall 2026"

    // Where the syllabus stands relative to the external system.
    // One of: "InSync" | "OutOfDate" | "NotSubmitted"
    public string SyllabusStatus { get; set; } = "NotSubmitted";

    // Last time the syllabus was pushed to the external system (UTC).
    // Null means it has never synced.
    public DateTime? LastSyncedUtc { get; set; }
}

// Shape returned by the list endpoint. Combines a course with a derived
// "out of date" flag so the UI doesn't have to compute staleness itself.
public record CourseSummary
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
    public string Title { get; init; } = "";
    public string Department { get; init; } = "";
    public string Term { get; init; } = "";
    public string SyllabusStatus { get; init; } = "";
    public DateTime? LastSyncedUtc { get; init; }
    public bool IsOutOfDate { get; init; }
}
