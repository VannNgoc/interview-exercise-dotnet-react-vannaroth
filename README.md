# Course Syllabus Status Dashboard

A small full-stack take-home for the OSU Learning Systems team.

Instructors need a lightweight portal to see whether each course's syllabus is
synced with an external system (think SimpleSyllabus) and to trigger a manual
resync when one is out of date. This repo is a **starter scaffold** — the backend
and a read-only frontend already run. Your job is to finish the sync feature.

- **Backend:** ASP.NET Core minimal API (.NET 8), in-memory data (no database)
- **Frontend:** React 18 + TypeScript + Vite

There's no login and no database. Data is seeded in memory when the API starts,
so you can restart anything at any time without losing setup.

---

## Getting started

You received this exercise as a zip. Put it in a Git repository on **your own** Git
provider (GitHub, GitLab, Bitbucket — whichever you prefer) so your commit history
and submission live in one place. We like seeing how the work progressed, so
commit incrementally as you go.

1. **Unzip** the archive and open the folder:

   ```bash
   unzip interview-exercise-dotnet-react.zip
   cd interview-exercise-dotnet-react
   ```

2. **Create a new, empty repository** in your own account on the Git provider of
   your choice. You can keep it **private** — just add the reviewer(s) named in
   your assignment email as collaborators so we can see it.

3. **Initialize and push** to your new repo (skip `git init` if the zip already
   contains a `.git` folder):

   ```bash
   git init                     # only if this isn't already a git repo
   git add .
   git commit -m "Initial scaffold"
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

4. Work on the tasks below, committing as you go. When you're done, follow
   **"Submitting your work"** at the bottom of this README.

---

## Time expectations

**This assignment is designed to take 2–3 hours. We value your time and do not
expect or encourage over-engineering beyond this scope.** If you find yourself
going long, stop and use the "If I had two more hours" section of this README to
describe what you *would* do instead of building it.

You are **encouraged to use AI tools** (GitHub Copilot, Cursor, ChatGPT, Claude,
etc.). See "AI usage" below for the short write-up we ask for in return.

---

## Prerequisites

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) (Node 20 or 22 recommended)

```bash
dotnet --version
node --version
```

---

## Running the app

You'll need **two terminals** — one for the API, one for the web app.

### 1. Backend (API)

```bash
cd backend
dotnet run --launch-profile http
```

The API starts on **http://localhost:5088**. Quick check:

```bash
curl http://localhost:5088/api/courses
```

### 2. Frontend (web app)

```bash
cd frontend
npm install      # installs React + TypeScript toolchain
npm run dev
```

The web app starts on **http://localhost:5173**. Open that URL in your browser.
The frontend calls the backend at `http://localhost:5088` (CORS is already
configured for the dev server).

Useful frontend scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run build       # type-check + production build
```

---

## Project layout

```
interview-exercise-dotnet-react/
├── backend/
│   ├── Program.cs                    # app startup, CORS, wiring
│   ├── Models/Models.cs              # Course, CourseSummary
│   ├── Data/CourseStore.cs           # in-memory seed data
│   └── Endpoints/CourseEndpoints.cs  # the /api/courses endpoints
└── frontend/
    ├── index.html
    └── src/
        ├── main.tsx                  # React entry point
        ├── App.tsx                   # loads data, handles loading/error
        ├── CourseTable.tsx           # renders the table of courses
        ├── api.ts                    # fetch wrapper for the backend
        ├── types.ts                  # shared TypeScript types
        └── styles.css
```

---

## API reference

| Method | Route                        | Description                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/api/courses`               | List all courses with syllabus sync status   |
| POST   | `/api/courses/{id}/sync`     | Mark a course's syllabus as freshly synced   |

Each course summary looks like:

```json
{
  "id": 1,
  "code": "CS 101",
  "title": "Intro to Computer Science",
  "department": "Computer Science",
  "term": "Fall 2026",
  "syllabusStatus": "InSync",
  "lastSyncedUtc": "2026-09-22T14:03:00Z",
  "isOutOfDate": false
}
```

`syllabusStatus` is one of `InSync`, `OutOfDate`, or `NotSubmitted`.
`isOutOfDate` is derived by the backend (an explicitly out-of-date status, or a
syllabus that hasn't synced within the staleness window).

---

## Your tasks

The read-only course list already loads and renders. Build the sync feature on
top of it:

1. **Highlight out-of-date syllabi.** Make courses where `isOutOfDate` is true
   visually stand out in the list so an instructor can spot them at a glance.

2. **Add a "Sync Now" action per course.** Wire up the write path end to end:
   - Implement `syncCourse(id)` in `frontend/src/api.ts` (calls
     `POST /api/courses/{id}/sync`).
   - Implement `handleSync` in `App.tsx` so the synced row updates with the
     record returned by the API.
   - Add the button in `CourseTable.tsx`, with a sensible in-progress and
     error experience for the row being synced.

3. **Make it accessible.** Basic WCAG hygiene: semantic HTML, accessible button
   states (disabled/busy), and a layout that's usable with a keyboard. Don't rely
   on color alone to convey "out of date."

4. **Trust but verify.** The scaffold is a starting point, not gospel. If
   something doesn't behave the way you'd expect, dig in — we're interested in how
   you reason about the whole stack, not just the code you add.

There's no single "right" implementation. We're looking for clean separation of
concerns, readable TypeScript types, sensible error/loading handling, and code
that fits the patterns already in the repo.

---

## Submitting your work

Push your work to your repo and make sure all three of the following are included.
Then reply to your assignment email with a link to the repo (if it's private, add
the reviewer(s) we named as collaborators first).

**1. Your code**, committed and pushed to your repo.

**2. Two short write-ups in this README** — add them under the "Submission" section
below (a template is already there for you to fill in):

- **AI usage (3 sentences).** Which AI tools you used; where the AI output needed
  human correction, refactoring, or a security/correctness review; and
  _(optional)_ anything the AI got confidently wrong that's worth flagging.
- **If I had two more hours.** What you'd add or improve next, and what you're
  least sure about. This is where senior-level thinking shows up — you don't have
  to build it.

**3. An export of your AI chat(s).** Export the conversation(s) you had with your
AI tool(s) and commit them to the repo as Markdown files (e.g. in a `chats/`
folder). If you didn't use AI, say so in the AI-usage note above.

---

## Submission

> _Fill this in before you submit. Delete these italic prompts as you go._

### AI usage

_Which tools, where you corrected/reviewed the AI output, and anything it got
confidently wrong._

### If I had two more hours

_What you'd add or improve next, and what you're least sure about._

### AI chat export

_Where your exported chat(s) live in the repo (e.g. `chats/`)._