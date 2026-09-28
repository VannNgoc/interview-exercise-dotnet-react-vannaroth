# AI Chat Export: Accessible Loading and Error States for the Sync Button

- **Tool:** Claude Code (desktop app), model Claude Opus 5.5
- **Date:** 2026-09-26
- **Purpose:** Give the Sync Now button an in-progress state with a spinner, block repeat presses while syncing, and add an error state that screen readers announce, all to WCAG 2.2.
- **Files changed by the AI in this session:** `frontend/src/SyncButton.tsx` (new), `frontend/src/App.tsx`, `frontend/src/CourseTable.tsx`, `frontend/src/styles.css` and `frontend/src/types.ts`. The AI did not commit anything. This ran alongside `2026-09-26-sync-error-layout-shift.md` and `2026-09-26-retry-and-busy-button-states.md`, and all three went into 3f894a1 ("[AI] Add loading and error states for Sync button").

---

## 1. My prompt

> Look at the readme.md file and generate a in-progress button state with a spinner,
> -make it so it adheres to WCAG.2.2 standards
> -make it so user cannot keep pressing the button in-progress of syncing
> -have an ecounter error state
> -have an error outputted that is screen reader accessible

Claude read the README, all frontend source files (`App.tsx`, `CourseTable.tsx`, `StatusPill.tsx`, `api.ts`, `types.ts`, `styles.css`) and `CourseEndpoints.cs`.

It pointed out a bug in my existing `handleSync`: a failed sync went into the page-level `error`, and since the table only renders when `error` is empty, one failed sync hid the whole table.

---

## 2. What Claude built

### 2.1 `types.ts`

A per-row sync state. Rows with no entry are idle:

```ts
export type SyncState =
  | { status: "syncing" }
  | { status: "error"; message: string };
```

### 2.2 `App.tsx`

- **Per-row state:** `syncStates: Record<number, SyncState>` replaces putting sync failures into the page-level `error`. The page-level error is now only for the initial load.
- **Double-click guard:** a `useRef` set of in-flight IDs, checked before anything else. State updates are async, so two fast clicks could both see "idle" before a re-render; the ref updates immediately.
- **Screen-reader announcements:** always-rendered, visually hidden live regions (WCAG 4.1.3 Status Messages):

```tsx
{/* Always rendered so screen readers register them before content changes. */}
<div className="screen-reader-only" role="status" aria-live="polite">
  {announcement}
</div>
<div className="screen-reader-only" role="alert">
  {errorAnnouncement}
</div>
```

The status region says "Syncing CS 101…" and "CS 101 synced successfully."; the alert region says "Sync failed for CS 225: …".

### 2.3 `SyncButton.tsx`

A new component for one row's button, so the row markup in `CourseTable.tsx` stays readable. It has three states:

| State | Visible label | Extras |
|---|---|---|
| Idle | Sync Now | |
| Syncing | Syncing… | Spinner, `aria-disabled="true"`, `aria-busy="true"` |
| Error | Retry sync | Error icon and message under the button, linked with `aria-describedby` |

```tsx
// While syncing we use aria-disabled rather than the `disabled` attribute:
// `disabled` removes the button from the tab order, so a keyboard user who just
// pressed it would lose focus (WCAG 2.4.3 / 2.4.7). aria-disabled keeps focus in
// place, and the click handler ignores activations while busy.
```

- **Accessible name:** the visible label plus a visually hidden course code ("Sync Now CS 101"), so seven identical buttons can be told apart, and the visible text is still part of the name (WCAG 2.5.3).
- **Icons:** the spinner and error icon are SVGs with `aria-hidden="true"` and `focusable="false"`.
- **Error text:** icon plus words, so the error isn't shown by color alone (WCAG 1.4.1).

### 2.4 `CourseTable.tsx`

The inline `<button>` was replaced with `<SyncButton courseId courseCode syncState onSync />`, and `syncStates` was added to the table's props.

### 2.5 `styles.css`

- **Busy state:** kept the same red (white on `#b00` is 6.6:1) with `cursor: progress`.
- **Spinner:** a CSS rotation, slowed to 3s under `prefers-reduced-motion` (WCAG 2.3.3). The "Syncing…" text still shows progress.
- **Error:** `#b71234` text, at least 6:1 on white and on the highlighted out-of-date rows, plus a `forced-colors` fallback for Windows High Contrast.

---

## 3. How Claude tested it

`tsc --noEmit` passed. Claude then opened the app in the browser pane against my running servers and replaced `fetch` so sync requests were slowed down and the one for row 2 returned HTTP 500.

- **Double clicks:** three quick clicks on row 1 plus one on row 2 sent 2 requests, not 4.
- **Busy state:** row 1 showed the spinner with `aria-disabled` and `aria-busy` set.
- **Error state:** row 2 changed to "Retry sync", and its `aria-describedby` pointed at "Sync failed: Failed to sync course (HTTP 500)".
- **Focus:** keyboard focus stayed on the button while it was syncing.

### The bug testing caught

Claude's first version had a single announcement region. When row 2 failed and row 1 succeeded at almost the same time, "CS 101 synced successfully." replaced the error before a screen reader could read it. Claude split errors into their own `role="alert"` region and reran the test: the status region said "CS 101 synced successfully." and the alert region said "Sync failed for CS 225: Failed to sync course (HTTP 500)".

---

## 4. What happened afterwards

- **Kept:** the `SyncState` type, the in-flight guard, both live regions, `aria-disabled` instead of `disabled`, and the hidden course code all went into 3f894a1.
- **Changed before committing:** the busy button turned grey and the error state got its own outlined "Retry sync" style (`2026-09-26-retry-and-busy-button-states.md`). The `14rem` error width was replaced with a fixed Sync column so errors don't re-flow the table (`2026-09-26-sync-error-layout-shift.md`).
- **Later:** in f9fe44d ("Announce row status when Sync button is focused") I added the row's status pill to the button's `aria-describedby`, so a screen-reader user tabbing between buttons hears each row's status too.
