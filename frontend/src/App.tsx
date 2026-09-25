import { useEffect, useState } from "react";
import { fetchCourses } from "./api";
import CourseTable from "./CourseTable";
import type { CourseSummary } from "./types";

export default function App() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Something went wrong")
      )
      .finally(() => setLoading(false));
  }, []);

  // TODO(candidate): implement "Sync Now".
  // When a course is synced, call the API and update that row in `courses`
  // with the returned record. Think about how to reflect the in-progress and
  // error states for the specific row being synced.
  async function handleSync(id: number): Promise<void> {
    console.warn(`handleSync(${id}) is not implemented yet`);
  }

  return (
    <div className="page">
      <h1>Course Tracker</h1>
      <p className="subtitle">
        OSU Learning Systems — syllabus sync status
      </p>

      {loading && <p>Loading courses…</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && (
        <CourseTable courses={courses} onSync={handleSync} />
      )}
    </div>
  );
}
