// Thin API client for the Course Tracker backend.
// The backend runs on http://localhost:5088 (see backend/Properties/launchSettings.json).

import type { CourseSummary } from "./types";

const BASE_URL = "http://localhost:5088";
const SYNC_TIMEOUT_MS = 10_000;

// GET /api/courses — load every course with its syllabus sync status.
export async function fetchCourses(): Promise<CourseSummary[]> {
  const response = await fetch(`${BASE_URL}/api/courses`);
  if (!response.ok) {
    throw new Error(`Failed to load courses (HTTP ${response.status})`);
  }
  return response.json();
}

// POST /api/courses/{id}/sync — trigger a resync for one course and return the
// updated record.
//
// TODO(candidate): implement this. It should POST to the sync endpoint for the
// given course id and return the updated CourseSummary from the response body.
// Remember to handle a non-OK response the same way fetchCourses does.
export async function syncCourse(id: number): Promise<CourseSummary> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/courses/${id}/sync`, {
      method: "POST",
      // Without a timeout a stalled request would leave the row "Syncing…"
      // forever, and the in-flight guard would block any retry.
      signal: AbortSignal.timeout(SYNC_TIMEOUT_MS),
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new Error("Sync timed out. Please try again.");
    }
    throw err;
  }
  if (!response.ok) {
    throw new Error(`Failed to sync course (HTTP ${response.status})`);
  }
  return response.json();
}
