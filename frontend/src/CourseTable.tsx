import type { CourseSummary } from "./types";

interface CourseTableProps {
  courses: CourseSummary[];
  onSync: (id: number) => void | Promise<void>;
}

// Presentational component: renders the list of courses in a table.
//
// The read-only columns are done. Two things are left for you to build:
//   1. Visibly highlight courses whose syllabus is out of date (see
//      `course.isOutOfDate`) so an instructor can spot them at a glance.
//   2. Add a "Sync Now" button per row that calls `onSync(course.id)`, with
//      an accessible in-progress / disabled state while the request runs.
export default function CourseTable({ courses, onSync }: CourseTableProps) {
  if (courses.length === 0) {
    return <p className="empty">No courses to show.</p>;
  }

  // `onSync` is intentionally referenced here so the wiring is in place; wire it
  // to your Sync button when you add it below.
  void onSync;

  return (
    <table className="course-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Title</th>
          <th>Department</th>
          <th>Term</th>
          <th>Syllabus Status</th>
          <th>Last Synced</th>
          {/* TODO(candidate): a column for the "Sync Now" action */}
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.code}</td>
            <td>{course.title}</td>
            <td>{course.department}</td>
            <td>{course.term}</td>
            <td>{course.syllabusStatus}</td>
            <td>{formatLastSynced(course.lastSyncedUtc)}</td>
            {/* TODO(candidate): a "Sync Now" button that calls onSync(course.id) */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatLastSynced(lastSyncedUtc: string | null): string {
  if (!lastSyncedUtc) {
    return "Never";
  }
  return new Date(lastSyncedUtc).toLocaleString();
}
