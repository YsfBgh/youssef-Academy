# JaDev Academy Project Memory

Use this file as the first source of truth before reading many files. Keep answers and edits aligned with this project context.

## Project Goal

JaDev Academy is a personal full-stack learning platform for Youssef Boughanem. The long-term goal is to become a complete "zero to hero" developer academy covering:

- C# and .NET
- ASP.NET Core APIs
- React
- Next.js
- SQL and data modeling
- Clean code and refactoring
- OOP and design patterns
- REST API design
- Git and professional workflows
- Docker, DevOps, CI/CD
- Enterprise simulations
- LeetCode-style coding practice
- AI agent workflows
- Interview preparation

The app is currently frontend-only and stores auth/progress in Supabase so friends can see shared leaderboard progress.

## Tech Stack

- React 18
- Vite 5
- React Router v6
- Tailwind CSS 3
- react-syntax-highlighter
- lucide-react
- No backend yet
- No TypeScript yet
- Progress persistence: Supabase `profiles.progress` JSONB
- Auth: username/password UI backed by Supabase email/password auth
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- AI Coach supports an OpenAI-compatible endpoint/proxy configured in the browser; do not hardcode API keys in frontend code

Commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Default Vite config uses port `3000`, but development has also been run manually on `3002`:

```bash
npm run dev -- --host 127.0.0.1 --port 3002 --strictPort
```

## Important Files

```text
src/main.jsx                         React entry, wraps App in BrowserRouter
src/App.jsx                          Route definitions
src/components/Layout.jsx            Sidebar navigation, XP/streak display, Outlet
src/utils/AuthContext.jsx            Supabase auth, current user, leaderboard stats
src/utils/ProgressContext.jsx        Supabase progress state and helpers
src/utils/supabaseClient.js          Supabase browser client from Vite env vars
src/index.css                        Tailwind layers and shared component classes
src/data/courses.js                  TRACKS and lesson content
src/data/quizzes.js                  QUIZZES and quiz helpers
src/data/challenges.js               CHALLENGES and code challenge helpers
src/data/workflows.js                WORKFLOWS and SIMULATIONS
src/data/career.js                   Career OS readiness, checklists, habits, final boss
src/data/engineeringLabs.js          Code review, debugging, and architecture scenarios
src/pages/Dashboard.jsx              Home, stats, progress, quick actions
src/pages/CareerOS.jsx               Central career readiness dashboard
src/pages/AuthPage.jsx               Username/password login/register screen backed by Supabase
src/pages/Leaderboard.jsx            Shared XP leaderboard from Supabase profiles
src/pages/AICoach.jsx                Configurable AI coach client; use a backend proxy for real sharing
src/pages/Courses.jsx                Track selector and lesson list
src/pages/LessonView.jsx             Lesson detail tabs
src/pages/QuizPage.jsx               Quiz player/results
src/pages/CodeLab.jsx                Code challenge interface
src/pages/CodeReviewLab.jsx          Senior-style PR review practice
src/pages/DebuggingLab.jsx           Evidence-driven debugging practice
src/pages/ArchitectureLab.jsx        System design and tradeoff practice
src/pages/WorkflowPage.jsx           Step-by-step workflow guides
src/pages/Simulations.jsx            Scenario-based simulations
```

## Current Routes

Defined in `src/App.jsx`:

```text
/                                  redirects to /dashboard
/dashboard                         Dashboard
/career                           Career OS
/leaderboard                       Leaderboard
/aicoach                           AI Coach
/daily                            Daily Mission
/roadmap                          Roadmap
/skilltree                        Skill Tree
/courses                           Courses
/courses/:trackId/lesson/:lessonId LessonView
/quiz                              QuizPage
/quiz/:trackId                     QuizPage for a track
/codelab                           CodeLab
/codereview                        CodeReviewLab
/debugging                         DebuggingLab
/architecture                      ArchitectureLab
/workflows                         WorkflowPage
/simulations                       Simulations
/enterprise                        EnterpriseSim
/projects                          ProjectLab
/aiagents                          AIAgentsLab
/interview                         InterviewMode
```

When adding a new feature page:

1. Add a page component in `src/pages`.
2. Add a route in `src/App.jsx`.
3. Add a nav item in `src/components/Layout.jsx` if it should be visible.
4. Add data under `src/data` if the feature is content-driven.
5. Extend `ProgressContext.jsx` only if new progress types need persistence.

## Current Data Exports

`src/data/courses.js`:

- `TRACKS`
- `getTrack(id)`
- `getLesson(trackId, lessonId)`
- `totalLessons()`

`src/data/quizzes.js`:

- `QUIZZES`
- `getAllQuizQuestions()`
- `getQuizByTrack(trackId)`

`src/data/challenges.js`:

- `CHALLENGES`
- `getChallengeById(id)`
- `getChallengesByTrack(trackId)`

`src/data/workflows.js`:

- `WORKFLOWS`
- `SIMULATIONS`
- `getWorkflowById(id)`
- `getSimulationById(id)`

Important: `courses.js` and `workflows.js` contain code examples inside strings. Search results may show `export default` or `export const` inside those example strings; do not treat those as real module exports.

## Progress Model

Progress is in `src/utils/ProgressContext.jsx`.

Storage:

```text
Supabase table: public.profiles
Progress column: profiles.progress jsonb
Stats columns: xp, level, total_progress, streak
```

Current shape:

```js
{
  lessons: {
    "trackId:lessonId": { completedAt: number }
  },
  quizzes: {
    [trackId]: { score: number, completedAt: number }
  },
  challenges: {
    [challengeId]: { completedAt: number }
  },
  lastVisit: string,
  streak: number
}
```

Current helper API:

- `markLessonComplete(trackId, lessonId)`
- `markQuizComplete(trackId, score)`
- `markChallengeComplete(challengeId)`
- `isLessonComplete(trackId, lessonId)`
- `isQuizComplete(trackId)`
- `isChallengeComplete(id)`
- `getTrackProgress(trackId)`
- `getTotalProgress()`
- `getXP()`
- `getStreak()`
- `updateStreak()`
- `resetProgress()`

`normalizeProgress()` exists to prevent malformed database progress JSON from crashing the app. Keep this defensive behavior.

XP rules currently:

- Lesson complete: `50 XP`
- Quiz score: `Math.round(score * 1.5)`
- Challenge complete: `100 XP`

Level rule:

```js
Math.floor(xp / 500) + 1
```

## Styling Conventions

Use Tailwind CSS and existing shared classes from `src/index.css`:

- `.card`
- `.card-hover`
- `.btn-primary`
- `.btn-secondary`
- `.btn-success`
- `.btn-danger`
- `.badge`
- `.code-block`
- `.section-title`
- `.section-subtitle`
- `.input`
- `.progress-bar`
- `.progress-fill`

Visual style:

- Dark dashboard UI
- Slate backgrounds
- Blue/violet/emerald/amber accents
- Dense learning/productivity interface
- Sidebar navigation
- Rounded cards, but keep layout practical

Avoid unrelated redesigns unless explicitly requested.

## Known Past Bugs And Fixes

1. Blank page from corrupted progress data:
   - Cause: persisted progress could contain `null` or malformed progress JSON.
   - Fix: `normalizeProgress()` in `ProgressContext.jsx`.

2. Blank page from `src/data/challenges.js`:
   - Cause: C# sample string used template interpolation like `${amount}` inside a JavaScript template string.
   - JS tried to evaluate `amount`, causing `ReferenceError: amount is not defined`.
   - Fix: avoid raw `${...}` in JS template strings for displayed code examples. Escape it or use normal string concatenation in the displayed sample.

3. Browser console noise:
   - MetaMask errors, SES lockdown messages, and extension `runtime.lastError` messages can come from Chrome extensions.
   - Do not treat those as app bugs unless app code imports or uses those extensions.

4. Encoding/mojibake:
   - Some older content in README/data may show garbled symbols like `â€”`.
   - Prefer UTF-8 clean text when editing touched sections.
   - Avoid broad mechanical rewrites of all content unless requested.

## Feature Expansion Direction

The next major direction is to make the app a complete learning operating system. Suggested feature modules:

### Roadmap

Structured learning paths from beginner to senior:

- C# foundations
- .NET backend
- SQL
- React
- Next.js
- Docker
- DevOps
- System design
- AI agents
- Interview prep

### Enterprise Simulator

Fake company experience:

- Sprint board
- Tickets
- Bug reports
- PR review
- Production incident
- API feature request
- Deployment task
- Architecture decision record

### Code Lab 2.0

LeetCode-style system:

- Topic filters
- Difficulty filters
- Test cases
- Hints
- Explanation
- Pattern tags
- Completion XP

### Workflow Lab

Interactive professional workflows:

- Git branch and PR flow
- Merge conflict simulation
- Agile ticket lifecycle
- CI/CD pipeline stages
- Docker image build/deploy
- Debugging production incident

### Project Lab

Portfolio projects with milestones:

- .NET REST API
- Auth system
- E-commerce backend
- React dashboard
- Next.js SaaS app
- Dockerized full-stack app
- CI/CD deployment checklist

### AI Agents Lab

Teach practical AI-assisted development:

- Architect agent
- Frontend agent
- Backend agent
- QA agent
- Reviewer agent
- DevOps agent
- Prompt patterns
- Multi-agent workflow simulations

### Final Boss Mode

A capstone enterprise project:

Build a Dockerized .NET API with SQL database, React/Next.js frontend, authentication, tests, Git workflow, CI/CD pipeline, and deployment checklist.

## Implementation Rules For Future Claude Sessions

- Read this file before scanning the whole repository.
- Prefer extending existing pages/data patterns over introducing new frameworks.
- Keep the app frontend-only unless the user explicitly asks for a custom backend.
- Keep auth/progress in Supabase unless the user asks for a different backend.
- For new content-heavy modules, create structured data files under `src/data`.
- For new UI screens, create page components under `src/pages`.
- Update `Layout.jsx` navigation for top-level modules.
- Update `App.jsx` routes for new pages.
- Run `npm run build` after code changes.
- Watch for JS template strings containing code examples. Escape `${...}` or avoid template strings when sample code contains interpolation syntax.
- Do not remove the defensive progress normalization.
- Do not treat browser extension console messages as app bugs.

## Useful Prompt For Future Large Upgrade

```text
Upgrade this React/Vite learning app into a complete developer academy from zero to hero.

Use CLAUDE.md as project memory. Keep the current design style and existing architecture.

Add these sections:
1. Roadmap: structured tracks from beginner to senior.
2. Enterprise Simulator: fake company missions with tickets, bugs, PR reviews, sprint tasks, incidents, and deployments.
3. Code Lab: LeetCode-style coding challenges with difficulty, hints, solution, explanation, and XP.
4. Workflow Lab: interactive Git, Agile, CI/CD, Docker, and deployment workflows.
5. Project Lab: real portfolio projects with milestones and completion tracking.
6. AI Agents Lab: lessons and simulations for using AI agents to design, code, test, review, and deploy.
7. Interview Mode: coding questions, .NET questions, React questions, system design, and behavioral practice.
8. Skill Tree: visual progress map with locked/unlocked topics.
9. Daily Mission: one lesson, one quiz, one code challenge, one workflow task per day.

Requirements:
- Keep the app frontend-only for now.
- Store progress in Supabase.
- Add routes and sidebar links.
- Use structured data files in src/data.
- Avoid placeholder pages; each page should have useful content and interactions.
- Run npm run build and fix all errors.
```
