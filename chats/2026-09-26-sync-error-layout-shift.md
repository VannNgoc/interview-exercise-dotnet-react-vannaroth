# AI Chat Export: Stopping the Table From Shifting on a Sync Error

- **Tool:** Claude Code (desktop app), model Claude Opus 5.5
- **Date:** 2026-09-26
- **Purpose:** Stop a failed sync from re-flowing the whole table.
- **Files changed by the AI in this session:** `frontend/src/CourseTable.tsx` and `frontend/src/styles.css`. The AI did not commit anything. This ran alongside `2026-09-26-sync-button-accessibility.md` and `2026-09-26-retry-and-busy-button-states.md`, and all three went into 3f894a1 ("[AI] Add loading and error states for Sync button").

---

## 1. My prompt

> is it a good idea to have the table contents shift that much if it comes across an error?

Claude read `SyncButton.tsx`, `CourseTable.tsx` and the uncommitted `styles.css` diff.

### Claude's answer: no

Some movement is fine because the user just clicked that button, but the error was changing the layout of the whole table, not just one cell.

**Why it moved so much:**

1. **The Sync column got wider.** `.sync-error` could be up to `14rem` wide, wider than the button. The table sizes columns automatically, so every other column shrank and titles re-wrapped in every row.
2. **The button label changed width.** "Sync Now" → "Syncing…" → "Retry sync" resized the button, and the column with it, even when nothing failed.
3. **The row got taller.** Claude said this part is reasonable: it's local, and it's where the user is looking.

**What Claude suggested:**

- Give the Sync column a fixed width and let the error wrap inside it.
- Give the button a `min-width` that fits its longest label.
- Keep the inline error short.

It advised against hiding the error in a tooltip or icon, since tooltips work poorly for keyboard, touch and screen-reader users.

---

## 2. My prompt

> yes

Claude read the table and button styles and the live-region code in `App.tsx`, then made the changes:

```css
/* Fixed width so a row's error message wraps inside this column instead of
   widening it and re-flowing every other column in the table. */
.course-table .sync-col {
  width: 11rem;
}
```

- **Sync header:** now `<th scope="col" className="sync-col">Sync</th>`, which also gives it the `scope="col"` the other headers had.
- **Button:** `min-width` went from `7.5rem` to `8.5rem`, enough for the spinner plus "Syncing…", so all three labels render at the same width.
- **Error text:** removed its own `max-width: 14rem` and added `overflow-wrap: anywhere`, so a long unbroken string can't widen the column.

**What Claude left out on purpose:** shortening the inline error. The page-level alert region in `App` is screen-reader-only, so if the visible text became just "Sync failed", sighted users would never see why. The messages from `api.ts` are short and wrap to about two lines in the fixed column.

`tsc` passed. Claude said it hadn't looked at the error state in a browser, because that needs the backend running and a sync made to fail.

---

## 3. What happened afterwards

All of these changes (the `sync-col` width, the `8.5rem` button minimum and `overflow-wrap: anywhere`) are in 3f894a1.
