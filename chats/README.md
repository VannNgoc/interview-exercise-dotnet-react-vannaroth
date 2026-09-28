# AI chat exports

Each file is one Claude Code session, named `YYYY-MM-DD-topic.md`. The header of each file says which files the AI changed and which commit the work went into.

Commits whose message starts with `[AI]` contain AI-generated code. `[AI-caught]` means the AI found the bug. All other commits are my own work; the chats listed next to them are where the idea or a review came up.

## Commits → chats

| Commit | Message | Related chats |
|---|---|---|
| [`58dbf08`](https://github.com/VannNgoc/interview-exercise-dotnet-react-vannaroth/commit/58dbf08f12efd49be8e567e7a5ac77fed99a928c) | [AI] Add status pill component for syllabus status | [status-pill-component](2026-09-26-status-pill-component.md) |
| [`3f894a1`](https://github.com/VannNgoc/interview-exercise-dotnet-react-vannaroth/commit/3f894a1d006c09842b315e4e9c65421c73563a4f) | [AI] Add loading and error states for Sync button | [sync-button-accessibility](2026-09-26-sync-button-accessibility.md),[sync-error-layout-shift](2026-09-26-sync-error-layout-shift.md),[retry-and-busy-button-states](2026-09-26-retry-and-busy-button-states.md) |
| [`3b81ae3`](https://github.com/VannNgoc/interview-exercise-dotnet-react-vannaroth/commit/3b81ae3c5c3c422889d69553507b40caaed35ca6) | [AI-caught] Fix staleness check using local time instead of UTC | [time-bug-and-stale-pill-disagreement](2026-09-26-time-bug-and-stale-pill-disagreement.md) |
| [`898365c`](https://github.com/VannNgoc/interview-exercise-dotnet-react-vannaroth/commit/898365cbac398e97e2655b8c02c836f788617212) | [AI-caught] Add timeout so a stalled sync can't hang forever | [project-review-endless-sync](2026-09-26-project-review-endless-sync.md) |

Additional review when my time was up: [multi-agent-review.md](2026-09-26-multi-agent-review.md)