import type { SyncState } from "./types";

interface SyncButtonProps {
  courseId: number;
  courseCode: string;
  syncState: SyncState | undefined;
  onSync: (id: number) => void | Promise<void>;
}

// "Sync Now" button for one course row, with busy and error states.
//
// While syncing we use aria-disabled rather than the `disabled` attribute:
// `disabled` removes the button from the tab order, so a keyboard user who just
// pressed it would lose focus (WCAG 2.4.3 / 2.4.7). aria-disabled keeps focus in
// place, and the click handler ignores activations while busy.
export default function SyncButton({
  courseId,
  courseCode,
  syncState,
  onSync,
}: SyncButtonProps) {
  const isSyncing = syncState?.status === "syncing";
  const errorMessage = syncState?.status === "error" ? syncState.message : null;
  const errorId = `sync-error-${courseId}`;
  // The row's status pill (rendered by CourseTable) describes the button, so a
  // screen-reader user tabbing between rows hears the status alongside the action.
  const statusId = `status-${courseId}`;
  const describedBy = errorMessage ? `${statusId} ${errorId}` : statusId;

  function handleClick(): void {
    if (isSyncing) {
      return;
    }
    void onSync(courseId);
  }

  return (
    <div className="sync-cell">
      <button
        type="button"
        className={errorMessage && !isSyncing ? "sync-btn sync-btn--error" : "sync-btn"}
        onClick={handleClick}
        aria-disabled={isSyncing}
        aria-busy={isSyncing}
        aria-describedby={describedBy}
      >
        {isSyncing && <Spinner />}
        {!isSyncing && errorMessage && <RetryIcon />}
        {/* Visible label stays in the accessible name (WCAG 2.5.3); the course
            code tells screen-reader users which row's button this is. */}
        <span>{isSyncing ? "Syncing…" : errorMessage ? "Retry sync" : "Sync Now"}</span>
        <span className="screen-reader-only"> {courseCode}</span>
      </button>

      {errorMessage && (
        // Announced via the page-level live region in App; linked here with
        // aria-describedby so it's also read when the button is focused.
        <p id={errorId} className="sync-error">
          <ErrorIcon />
          <span>Sync failed: {errorMessage}</span>
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="sync-spinner"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="8" cy="8" r="6" opacity="0.3" />
      <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
    </svg>
  );
}

// Shape cue for the retry state so it differs from "Sync Now" beyond color and text.
function RetryIcon() {
  return (
    <svg
      className="sync-btn__icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
      <path d="M13.5 2.5v3h-3" />
    </svg>
  );
}

// Icon + text so the error isn't conveyed by color alone (WCAG 1.4.1).
function ErrorIcon() {
  return (
    <svg
      className="sync-error__icon"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.75v3.75" />
      <path d="M8 11.25h.01" />
    </svg>
  );
}
