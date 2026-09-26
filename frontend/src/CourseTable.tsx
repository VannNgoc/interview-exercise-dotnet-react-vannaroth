import type { CourseSummary, SyncState } from "./types";
import StatusPill from "./StatusPill";
import SyncButton from "./SyncButton";

interface CourseTableProps {
  courses: CourseSummary[];
  syncStates: Record<number, SyncState>;
  onSync: (id: number) => void | Promise<void>;
}

// Presentational component: renders the list of courses in a table.
//
// The read-only columns are done. Two things are left for you to build:
//   1. Visibly highlight courses whose syllabus is out of date (see
//      `course.isOutOfDate`) so an instructor can spot them at a glance.
//   2. Add a "Sync Now" button per row that calls `onSync(course.id)`, with
//      an accessible in-progress / disabled state while the request runs.
export default function CourseTable({ courses, syncStates, onSync }: CourseTableProps) {
  if (courses.length === 0) {
    return <p className="empty">No courses to show.</p>;
  }

  // `onSync` is intentionally referenced here so the wiring is in place; wire it
  // to your Sync button when you add it below.
  // void onSync;

  return (
    <table className="course-table">
      <caption className={'screen-reader-only'}>Courses and their Syllabus sync status.</caption>
      <thead>
        <tr>
          <th scope="col">Code</th>
          <th scope="col">Title</th>
          <th scope="col">Department</th>
          <th scope="col">Term</th>
          <th scope="col">Syllabus Status</th>
          <th scope="col">Last Synced</th>
          {/* TODO(candidate): a column for the "Sync Now" action */}
          <th scope="col" className="sync-col">Sync</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr className={course.isOutOfDate ? "out-of-date" : "in-sync"} key={course.id}>
            <th scope="row">{course.code}</th>
            <td>{course.title}</td>
            <td>{course.department}</td>
            <td>{course.term}</td>
            <td>
              <StatusPill id={`status-${course.id}`} status={course.syllabusStatus} />
            </td>
            <td>{formatLastSynced(course.lastSyncedUtc)}</td>
            {/* TODO(candidate): a "Sync Now" button that calls onSync(course.id) */}
            <td>
              <SyncButton
                courseId={course.id}
                courseCode={course.code}
                syncState={syncStates[course.id]}
                onSync={onSync}
              />
            </td>
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
