// Thin API client for the Course Tracker backend.
// The backend runs on http://localhost:5088 (see backend/Properties/launchSettings.json).

import type { CourseSummary } from "./types";

const BASE_URL = "http://localhost:5088";

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
  const url : string = `${BASE_URL}/api/courses/${id}/sync`;
    const response = await fetch(url,
        {
          method: 'POST'
        }
    );
    if (!response.ok) {
      throw new Error(`Failed to sync course (HTTP ${response.status})`);
    }
    return response.json();
}
