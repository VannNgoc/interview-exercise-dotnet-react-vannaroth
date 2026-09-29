using CourseTracker.Api.Data;
using CourseTracker.Api.Models;

namespace CourseTracker.Api.Endpoints;

public static class CourseEndpoints
{
    public static void MapCourseEndpoints(this WebApplication app)
    {
        // GET /api/courses -> list of course summaries with a derived "out of date" flag.
        app.MapGet("/api/courses", (CourseStore store) =>
        {
            var summaries = store.Courses.Select(course => new CourseSummary
            {
                Id = course.Id,
                Code = course.Code,
                Title = course.Title,
                Department = course.Department,
                Term = course.Term,
                SyllabusStatus = course.SyllabusStatus,
                LastSyncedUtc = course.LastSyncedUtc,
                IsOutOfDate = IsOutOfDate(course),
            });

            return Results.Ok(summaries);
        });

        // POST /api/courses/{id}/sync -> marks the syllabus as freshly synced
        // and returns the updated course summary.
        app.MapPost("/api/courses/{id:int}/sync", (int id, CourseStore store) =>
        {
            var course = store.GetCourse(id);
            if (course is null)
                return Results.NotFound();

            // Nothing to sync until a syllabus is submitted; otherwise the course
            // would be marked InSync with nothing sent.
            if (course.SyllabusStatus == "NotSubmitted")
                return Results.Conflict();

            course.LastSyncedUtc = DateTime.UtcNow;
            course.SyllabusStatus = "InSync";

            var updated = new CourseSummary
            {
                Id = course.Id,
                Code = course.Code,
                Title = course.Title,
                Department = course.Department,
                Term = course.Term,
                SyllabusStatus = course.SyllabusStatus,
                LastSyncedUtc = course.LastSyncedUtc,
                IsOutOfDate = IsOutOfDate(course),
            };

            return Results.Ok(updated);
        });
    }

    // A syllabus is "out of date" if it was explicitly flagged as such, or if it
    // hasn't synced within the staleness window.
    private static bool IsOutOfDate(Course course)
    {
        if (course.SyllabusStatus == "OutOfDate")
            return true;

        // Nothing can go stale until a syllabus has been submitted.
        if (course.SyllabusStatus == "NotSubmitted")
            return false;

        // A submitted syllabus that has never been synced can't be current.
        if (course.LastSyncedUtc is null)
            return true;

        var age = DateTime.UtcNow - course.LastSyncedUtc.Value;
        return age.TotalDays > CourseStore.StalenessThresholdDays;
    }
}
