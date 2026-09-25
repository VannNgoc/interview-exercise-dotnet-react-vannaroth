// Shared types for the Course Tracker frontend.
// These mirror the shapes returned by the backend API.

export type SyllabusStatus = "InSync" | "OutOfDate" | "NotSubmitted";

// One row from GET /api/courses (and the body returned by the sync endpoint).
export interface CourseSummary {
  id: number;
  code: string;
  title: string;
  department: string;
  term: string;
  syllabusStatus: SyllabusStatus;
  // ISO-8601 timestamp, or null if the syllabus has never synced.
  lastSyncedUtc: string | null;
  isOutOfDate: boolean;
}
