# AI Chat Export: Project Review and the Endless Syncing Bug

- **Tool:** Claude Code (desktop app), model Claude Opus 5.5
- **Date:** 2026-09-26
- **Purpose:** Check whether everything outside the submission write-up was done, clean up the git history, and get two independent reviews (senior developer, and UI/UX accessibility) before submitting.
- **Files changed by the AI in this session:** `frontend/src/api.ts`, `frontend/src/App.tsx`, `frontend/src/CourseTable.tsx` and `frontend/src/styles.css` (section 6). Both reviewers were read-only. The AI did not commit anything; I committed the changes myself afterwards, including the sync timeout as 898365c ("[AI-caught] Add timeout so a stalled sync can't hang forever").

---

## 1. My prompt: did I do everything?

> okay look at the project outside the submission portion, did I do everything?

Claude listed the tracked files, read the README and every source file, diffed the work against the scaffold commit (3177a5f), ran `npm run typecheck` (passed) and `dotnet build` (0 warnings, 0 errors). It only read code and ran those two checks; it didn't click through the app.

### Task checklist

| Task | Status |
|---|---|
| 1. Highlight out-of-date rows | ✅ Tinted row, a left-edge bar, and the pill's icon and text, so it doesn't rely on color alone. |
| 2. Sync Now end to end | ✅ `syncCourse` checks the response before using it, `handleSync` swaps the row in place, and each row has its own syncing and error state. The `inFlight` ref stops double-clicks from sending two requests. |
| 3. Accessibility | ✅ Table caption and row headers, `aria-disabled`/`aria-busy` (focus stays on the button), live regions for status and errors, the course code in each button's name, `aria-describedby`, reduced-motion and high-contrast support. |
| 4. Trust but verify | ✅ Caught the `DateTime.Now` vs `DateTime.UtcNow` staleness bug (CourseEndpoints.cs:65) and the pill showing `syllabusStatus` instead of `isOutOfDate`. |

### Loose ends Claude raised

1. **Leftover scaffold comments:** `TODO(candidate)` blocks in api.ts, App.tsx and CourseTable.tsx, the "Two things are left for you to build" header, and the `// void onSync;` note.
2. **Formatting in `syncCourse`:** 4-space indents, single quotes and `const url : string`, unlike the rest of the file.

---

## 2. Keeping the scaffold comments

> I'm leaving in the leftover scaffold comments due to the reviewer knowing where to look where I implemented things

Claude agreed that was a good reason and suggested two tweaks:

1. Say so in the README, so reviewers don't read the markers as forgotten cleanup.
2. Remove or reword the `// void onSync;` note (CourseTable.tsx:23-25). Unlike the TODO markers, it doesn't point anywhere useful and is out of date.

---

## 3. My prompt: two reviewers

> sub agents:
> -look at my code from a senior dev code review
> -UI/UX and accessibility auditor

Claude started two read-only subagents in parallel, each with a role-specific brief:

| Subagent | Brief (summarized) |
|---|---|
| Senior full-stack dev | Diff against the scaffold (3177a5f). Look for correctness bugs, race conditions in `handleSync` and `SyncButton`, type quality, separation of concerns, error handling and scaffold issues missed. Cite file:line with a failure scenario, rank by severity, and list 3–5 things done well. Don't flag the intentional `TODO(candidate)` markers. |
| UI/UX and accessibility auditor | Audit against WCAG 2.2 AA: recompute the contrast ratios claimed in styles.css, screen-reader behavior, keyboard and focus, forced colors, reduced motion, reflow at 320px, target size, loading/error/empty states, and whether out-of-date rows stand out. Include UX judgment on wording, success feedback and timestamps. |

---

## 4. Subagent reports

The reports below are reproduced as the subagents returned them, lightly formatted.



**Completeness (blocking)**

- The README "Submission" section is still the template: no AI-usage note, no "two more hours" section and no chat-export pointer.
- There is no `chats/` folder. Two of the three required deliverables are missing, and many reviewers would stop reading here.

**Scope (right-sized, slightly heavy on polish)**

- Commit timestamps show about 15:34 to 18:14 of core work, plus about 5 minutes of bug fixes at 21:36. That fits the 2–3 hour guidance.
- The diff is about 500 lines, about 200 of them CSS.
- The dense WCAG-citation comments, forced-colors and reduced-motion media queries, and three hand-drawn SVG icons read as AI-generated polish. A reviewer may ask "which of this do *you* understand?" Be ready to defend it.

**What impresses**

1. Task 4 was actually done: the `DateTime.Now` vs `UtcNow` staleness bug was found and fixed minimally.
2. `pillStatus()` follows `isOutOfDate` rather than the raw `syllabusStatus`, which catches the "InSync but stale" case.
3. The state model is clean: `SyncState` is a discriminated union, state is tracked per row with an `inFlight` ref as a double-click guard, and the row is replaced with the record the server returns.
4. The accessibility judgment is real: `aria-disabled` instead of `disabled`, separate status and alert live regions, `<caption>`, `scope` and a row header, icon plus text.
5. The commit messages openly label AI-generated code and "Bug Caught by AI".

**Concerns**

1. The `// void onSync;` leftover.
2. Style in `api.ts` doesn't match the rest of the repo.
3. Typo in a commit message: "USed".
4. A `NotSubmitted` course with a null sync date returns `isOutOfDate: false`, so it isn't highlighted. Is that correct? It belongs in the write-up.
5. No mention of verification (typecheck/build, or a manual test of the error path).

**Before submitting, in priority order**

1. Fill in the README Submission section.
2. Export the AI chats to `chats/*.md` and commit them.
3. Finish the history cleanup: delete the stale remote branches, the local `master` and `backup/*` branches, and the stash.
4. Delete `// void onSync;` and format `api.ts` to match the repo.
5. Run typecheck and build, do one click-through of the success and error paths, and mention it in the README.
6. Optionally cut some of the WCAG comment verbosity.

### 5.1 UI/UX and accessibility auditor (WCAG 2.2 AA)

The auditor found my backend and frontend already running on ports 5088 and 5173 and didn't start or stop any servers. Every row in the live data had already been synced, so it reviewed the out-of-date styling from the code.

**Contrast claims: all verified by calculation.**

| Element | Ratio |
|---|---|
| Busy button | 8.54:1 |
| Scarlet on white | 6.67:1 |
| Scarlet on the out-of-date row | 6.12:1 (5.75:1 hovered) |
| Pill text | 8.02, 8.04 and 8.87:1 |
| Pill borders | 4.31 to 7.56:1 |
| Focus ring | 5.73:1 on white, 5.26:1 on the tinted row |
| Subtitle | 5.27:1 |

**High**

1. **1.4.10 Reflow** (styles.css:28, CourseTable.tsx:28). At 320px the page is 761px wide, so the whole page scrolls sideways. *Fix:* wrap the table in `<div role="region" aria-labelledby=… tabindex="0" style="overflow-x:auto">`, or show stacked cards below about 40rem.
2. **Out-of-date rows are hard to spot at a glance** (styles.css:52-63). The tint `#fff4e0` is only 1.09:1 against white, and every row's scarlet "Sync Now" button draws the eye more than the highlight. *Fix:* stronger tint or full-width left border; make the button outlined on in-sync rows.

**Medium**

3. **Forced colors** (styles.css:61-63). Windows High Contrast removes box-shadows and backgrounds, so the row highlight disappears. *Fix:* a real `border-left` on the row header cell.
4. **Mixed signal on the "Not submitted" row.** *(Claude corrected this one; see section 5.4.)*
5. **No visible success feedback** (App.tsx:61). Only screen readers hear "synced successfully". *Fix:* a brief "Synced ✓" or a row flash; consider showing "Syncing…" for at least about 400ms.
6. **Raw error text** (api.ts:12, api.ts:32). "Failed to sync course (HTTP 500)" or "Failed to fetch". The page-load error has no retry and isn't announced. *Fix:* plain-language messages, a Retry button, `role="alert"`.

**Low**

7. **Timestamps** (CourseTable.tsx:82). `toLocaleString()` is noisy and has no time zone. *Fix:* `Intl.DateTimeFormat` with `dateStyle: "medium", timeStyle: "short"` inside `<time dateTime>`, ideally with relative time.
8. **`aria-busy` on a button** (SyncButton.tsx:44). Harmless, but it's meant for regions.
9. **Repeated announcements get skipped** (App.tsx:53,62). Identical live-region text may not be read again.
10. **Caption hidden from sighted users** (CourseTable.tsx:29), and no loading spinner or skeleton.

**Done well:** native buttons and table semantics, `aria-disabled` keeping focus, the `inFlight` guard, accessible names that start with the visible label (2.5.3), two live regions, `aria-describedby`, nothing relying on color alone, a visible 3px focus ring, reduced-motion and forced-colors support, 136×36px targets (2.5.8), a fixed button width, and the pill following `isOutOfDate`.

### 5.2 Senior full-stack developer

**Verification:** `npm run typecheck` passes. `dotnet build` compiled, but copying the output failed with MSB3021 because the running API held the .exe open. There were no C# compile errors.

**No blocking bugs.** The sync flow works end to end, and the two scaffold fixes are correct.

**Medium**

1. **A hung request never ends (api.ts:23-33, App.tsx:57).** There is no timeout or AbortController. If the POST stalls, the row stays on "Syncing…" forever and the guards (the `inFlight` ref and `aria-disabled`) block any retry. *Fix:* an AbortController with a timeout, surfaced as the row error. **(This is the endless syncing bug.)**
2. **Starting a sync clears another row's error message for screen readers (App.tsx:54).** `setErrorAnnouncement("")` runs whenever any row starts syncing, so row B starting can wipe row A's alert before it is read out.
3. **The CORS origin is hard-coded but the Vite port isn't fixed (Program.cs:12, vite.config.ts).** If 5173 is taken, Vite moves to 5174 and every call fails with "Failed to fetch". *Fix:* `strictPort: true`.
4. **Syncing a `NotSubmitted` course sets it to `InSync` (CourseEndpoints.cs:36-37).** Block it on the server (409), or hide or disable the button.

**Low**

5. The singleton `List<Course>` is changed without a lock, and the two field writes aren't atomic.
6. Error handling is thin (api.ts:29): raw "HTTP 404" or "Failed to fetch", and a 404'd row stays in the list.
7. The summary mapping is duplicated (CourseEndpoints.cs:13-22 and 39-48).

**Nitpicks**

- `api.ts:24-28`: redundant `: string`, odd indentation, single quotes.
- `CourseTable.tsx:29`: `className={'screen-reader-only'}` should be a plain string; the dead `// void onSync;` should go.
- `handleSync` has two double-click guards; one is enough.
- `response.json()` isn't checked at runtime (matches the scaffold's pattern).
- The README Submission section is still the template, and there is no `chats/` folder.

**Done well**

1. Clean types: `SyncState` is a discriminated union, and "no entry means idle".
2. Good separation of concerns between the API client, `App` and the display-only components.
3. Solid accessibility, with clear comments on why `aria-disabled` is used.
4. Race handling: the synchronous `inFlight` ref and functional `setCourses(prev => …)` updates.
5. Good "trust but verify" fixes.

### 5.4 What Claude checked itself

Claude didn't just relay the subagents' claims:

- It checked the senior developer's two bugs (the missing timeout and the cleared error announcement) against the code and confirmed both.
- It corrected the UI/UX auditor's finding 4. The auditor said the "Not submitted" row gets the amber highlight with a grey pill, but `IsOutOfDate` returns `false` when `LastSyncedUtc` is null (CourseEndpoints.cs:62), so that row isn't highlighted at all.

### 5.5 Claude's combined summary

| # | Item | Size |
|---|---|---|
| 1 | Fill in the README Submission section and add `chats/` | Required |
| 2 | Delete App.tsx:54 (the error-announcement bug) | 1 line |
| 3 | Add a timeout to `syncCourse` | ~5 lines |
| 4 | Tidy `api.ts` formatting, the `void onSync` line and the `className` string | Trivial |
| 5 | Wrap the table in a scrollable container (narrow screens) | ~3 lines |
| 6 | Put the rest in "If I had two more hours": syncing a `NotSubmitted` course, `strictPort`, locking, visible success feedback, plain-language errors, a stronger out-of-date highlight | Write-up only |

---

## 6. Fixing small items

> yes do 2 and 4. I'll implement 3 and 5 myself


Fixed the formatting in `syncCourse` (2-space indents, double quotes).

**Error announcement.** Removed `setErrorAnnouncement("")` from `handleSync` in App.tsx, so starting a sync on one row no longer erases another row's failure before a screen reader reads it.

**Tidy-up.** Removed the `// void onSync;` leftover and changed `className={'screen-reader-only'}` to a plain string. All the `TODO(candidate)` markers and the "Two things are left for you to build" header were kept.

### How Claude verified it

- `npm run typecheck` and `npm run build` both passed.

---
