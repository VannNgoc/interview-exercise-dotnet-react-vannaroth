import { useEffect, useRef, useState } from "react";
import { fetchCourses, syncCourse } from "./api";
import CourseTable from "./CourseTable";
import type { CourseSummary, SyncState } from "./types";

export default function App() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStates, setSyncStates] = useState<Record<number, SyncState>>({});
  // Text for the screen-reader live regions (WCAG 4.1.3 Status Messages).
  // Errors get their own region so a concurrent success on another row can't
  // overwrite a failure before it's announced.
  const [announcement, setAnnouncement] = useState("");
  const [errorAnnouncement, setErrorAnnouncement] = useState("");
  // Synchronous guard against double-clicks: state updates are async, so two
  // fast clicks could both see "idle" before a re-render.
  const inFlight = useRef(new Set<number>());

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Something went wrong")
      )
      .finally(() => setLoading(false));
  }, []);

  function setSyncState(id: number, state: SyncState | null): void {
    setSyncStates((prev) => {
      const next = { ...prev };
      if (state) {
        next[id] = state;
      } else {
        delete next[id];
      }
      return next;
    });
  }

  // TODO(candidate): implement "Sync Now".
  // When a course is synced, call the API and update that row in `courses`
  // with the returned record. Think about how to reflect the in-progress and
  // error states for the specific row being synced.
  async function handleSync(id: number): Promise<void> {
    if (inFlight.current.has(id)) {
      return;
    }
    inFlight.current.add(id);

    const code = courses.find((course) => course.id === id)?.code ?? "course";
    setSyncState(id, { status: "syncing" });
    setAnnouncement(`Syncing ${code}…`);
    setErrorAnnouncement("");

    try {
      const updatedCourse = await syncCourse(id);
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? updatedCourse : course))
      );
      setSyncState(id, null);
      setAnnouncement(`${code} synced successfully.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setSyncState(id, { status: "error", message });
      setErrorAnnouncement(`Sync failed for ${code}: ${message}`);
    } finally {
      inFlight.current.delete(id);
    }
  }

  return (
    <div className="page">
      <h1>Course Tracker</h1>
      <p className="subtitle">
        OSU Learning Systems — syllabus sync status
      </p>

      {/* Always rendered so screen readers register them before content changes. */}
      <div className="screen-reader-only" role="status" aria-live="polite">
        {announcement}
      </div>
      <div className="screen-reader-only" role="alert">
        {errorAnnouncement}
      </div>

      {loading && <p>Loading courses…</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && (
        <CourseTable courses={courses} syncStates={syncStates} onSync={handleSync} />
      )}
    </div>
  );
}
