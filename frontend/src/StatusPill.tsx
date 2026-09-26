import type { SyllabusStatus } from "./types";

interface StatusPillProps {
  status: SyllabusStatus;
}

// Human-readable labels for each status (the API sends PascalCase enum names).
const STATUS_LABELS: Record<SyllabusStatus, string> = {
  InSync: "In sync",
  OutOfDate: "Out of date",
  NotSubmitted: "Not submitted",
};

// Pill showing a syllabus status with a decorative icon. The icon is hidden
// from assistive tech and never focusable; the visible text carries the meaning.
export default function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={`status-pill status-pill--${status}`}>
      <StatusIcon status={status} />
      <span>{STATUS_LABELS[status]}</span>
    </span>
  );
}

function StatusIcon({ status }: StatusPillProps) {
  return (
    <svg
      className="status-pill__icon"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {status === "InSync" && (
        <>
          <circle cx="8" cy="8" r="6.5" />
          <path d="M5 8.25 7 10.25 11 6" />
        </>
      )}
      {status === "OutOfDate" && (
        <>
          <path d="M8 1.75 14.75 13.75H1.25Z" />
          <path d="M8 6.25v3.25" />
          <path d="M8 11.75h.01" />
        </>
      )}
      {status === "NotSubmitted" && (
        <>
          <circle cx="8" cy="8" r="6.5" strokeDasharray="2.5 2" />
          <path d="M5.5 8h5" />
        </>
      )}
    </svg>
  );
}
