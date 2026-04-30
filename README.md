# 🎓 JaDev Academy

**Your personal full-stack learning platform to become the Top 1 Developer at Jadev.**

---

## 🚀 Quick Start

```bash
cd "Internchip 2026/jadev-academy"
npm install
npm run dev
```

Then open → **http://localhost:3000**

---

## 📚 What's Inside

### 6 Learning Tracks
| Track | Topics |
|-------|--------|
| ⚙️ **C# & .NET** | Type system, OOP, LINQ, async/await, ASP.NET Core, Entity Framework |
| ⚛️ **React Mastery** | Hooks, Context, Reducer, performance (memo/useMemo/useCallback) |
| **▲ Next.js Pro** | App Router, SSR/SSG/ISR, Server Actions, data fetching strategies |
| 🌐 **REST API Design** | HTTP methods, status codes, authentication (JWT/OAuth), versioning |
| 🏗️ **OOP & Patterns** | SOLID, Repository, Factory, Observer, Strategy patterns |
| ✨ **Clean Code** | Code smells, refactoring techniques, DRY/KISS/YAGNI |

### Features
- 📖 **Lessons** — Theory + code examples + key takeaways per lesson
- 🧠 **Quizzes** — Multiple choice with explanations, retakeable, score tracking
- 💻 **Code Lab** — 8 coding challenges with hints, test cases, and solutions
- 🔄 **Workflows** — Step-by-step professional guides (build an API, auth flow, Git workflow)
- 🎮 **Simulations** — Scenario-based problem solving (debug production bugs, code review, system design)
- 📈 **Progress Tracking** — XP system, level up, completion tracking, day streaks, and shared leaderboard through Supabase

---

## 🗂️ Project Structure

```
jadev-academy/
├── src/
│   ├── data/
│   │   ├── courses.js       ← All lesson content (6 tracks, 20+ lessons)
│   │   ├── quizzes.js       ← 50+ quiz questions with explanations
│   │   ├── challenges.js    ← 8 coding challenges with solutions
│   │   └── workflows.js     ← 4 workflows + 3 simulations
│   ├── pages/
│   │   ├── Dashboard.jsx    ← Home + stats + progress
│   │   ├── Courses.jsx      ← Track selector + lesson list
│   │   ├── LessonView.jsx   ← Theory | Code | Key Points tabs
│   │   ├── QuizPage.jsx     ← Interactive quiz with results review
│   │   ├── CodeLab.jsx      ← Code challenge editor
│   │   ├── WorkflowPage.jsx ← Step-by-step guides
│   │   └── Simulations.jsx  ← Scenario challenges
│   ├── components/
│   │   └── Layout.jsx       ← Sidebar + XP bar
│   ├── utils/
│   │   ├── AuthContext.jsx     ← Supabase auth + leaderboard
│   │   ├── ProgressContext.jsx ← Progress state synced to Supabase
│   │   └── supabaseClient.js   ← Supabase browser client
│   ├── App.jsx              ← Routes
│   ├── main.jsx             ← Entry point
│   └── index.css            ← Tailwind + custom styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🏆 Learning Strategy

1. **Start with C# fundamentals** — this is Jadev's core language
2. **Complete each lesson** → take the track quiz → retry until 80%+
3. **Do Code Lab challenges** — write the code yourself before looking at solutions
4. **Run the simulations** — write your answer before revealing
5. **Follow the workflows** — practice them until they feel natural
6. **Repeat daily** — the streak counter keeps you accountable

---

## 🛠️ Tech Stack

- **React 18** + **Vite** — fast development
- **React Router v6** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Supabase** — shared auth, progress storage, and leaderboard data

---

## 🗄️ Database Setup

JaDev Academy now stores accounts and progress in Supabase so friends can see each other's XP and progress.

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In Supabase **Authentication → Providers → Email**, keep email/password enabled. For quick friend testing, disable email confirmations.
4. Copy `.env.example` to `.env` and fill in:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

On Netlify, add the same variables in **Site configuration → Environment variables**.

---

## 🌍 Deploy on Netlify

This repo includes `netlify.toml` for Netlify builds and React Router fallback routing.

Recommended Netlify settings:

```text
Build command: npm run build
Publish directory: dist
```

After deployment, friends can open the Netlify URL, create accounts, and see each other's leaderboard progress through Supabase.

---

Built for Youssef Boughanem — JaDev Academy © 2026
