using CourseTracker.Api.Models;

namespace CourseTracker.Api.Data;

// Simple in-memory data store seeded with sample courses.
// No database — this keeps the exercise self-contained. Because the store is a
// singleton, edits made via the sync endpoint persist until the API restarts.
public class CourseStore
{
    // A syllabus is considered stale if it hasn't synced within this many days.
    public const int StalenessThresholdDays = 30;

    private readonly List<Course> _courses;

    public CourseStore()
    {
        // Seed relative to "now" so the staleness window is meaningful no matter
        // when the app is run. Timestamps are stored in UTC.
        var now = DateTime.UtcNow;

        _courses = new List<Course>
        {
            new Course
            {
                Id = 1, Code = "CS 101", Title = "Intro to Computer Science",
                Department = "Computer Science", Term = "Fall 2026",
                SyllabusStatus = "InSync", LastSyncedUtc = now.AddDays(-2),
            },
            new Course
            {
                Id = 2, Code = "CS 225", Title = "Data Structures",
                Department = "Computer Science", Term = "Fall 2026",
                SyllabusStatus = "OutOfDate", LastSyncedUtc = now.AddDays(-45),
            },
            new Course
            {
                Id = 3, Code = "MATH 151", Title = "Calculus I",
                Department = "Mathematics", Term = "Fall 2026",
                SyllabusStatus = "InSync", LastSyncedUtc = now.AddHours(-6),
            },
            new Course
            {
                Id = 4, Code = "ENG 110", Title = "Composition",
                Department = "English", Term = "Spring 2026",
                SyllabusStatus = "NotSubmitted", LastSyncedUtc = null,
            },
            new Course
            {
                Id = 5, Code = "HIST 200", Title = "World History",
                Department = "History", Term = "Spring 2026",
                SyllabusStatus = "OutOfDate", LastSyncedUtc = now.AddDays(-90),
            },
            new Course
            {
                Id = 6, Code = "CS 340", Title = "Databases",
                Department = "Computer Science", Term = "Spring 2026",
                SyllabusStatus = "InSync", LastSyncedUtc = now.AddDays(-10),
            },
        };
    }

    public IReadOnlyList<Course> Courses => _courses;

    public Course? GetCourse(int id) => _courses.FirstOrDefault(c => c.Id == id);
}
