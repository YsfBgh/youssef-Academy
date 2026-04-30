import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Flame,
  Gamepad2,
  Lightbulb,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import { useProgress } from '../utils/ProgressContext';
import { useAuth } from '../utils/AuthContext';
import { TRACKS } from '../data/courses';

const TIPS = [
  'Master SOLID principles. They show up in real reviews and senior interviews.',
  'Practice async and await daily. Production .NET code is almost always async.',
  'Read code more than you write code. Good review habits compound quickly.',
  'LINQ is a C# force multiplier. Learn the operators until they feel natural.',
  'Design patterns are shared vocabulary. Use them to explain tradeoffs clearly.',
  'Refactoring is writing code twice: once to solve it, once to make it obvious.',
  'REST is about nouns and resources. Prefer /products over /getProducts.',
  'In React, keep state as high as needed, but no higher.',
];

const QUICK_ACTIONS = [
  { to: '/quiz', label: 'Take a Quiz', caption: 'Test retention', icon: Brain, tone: 'blue' },
  { to: '/codelab', label: 'Code Challenge', caption: 'Practice problem solving', icon: Code2, tone: 'violet' },
  { to: '/workflows', label: 'Workflow Guide', caption: 'Build like a pro', icon: Workflow, tone: 'emerald' },
  { to: '/simulations', label: 'Simulation', caption: 'Handle scenarios', icon: Gamepad2, tone: 'amber' },
];

export default function Dashboard() {
  const {
    getTotalProgress,
    getTrackProgress,
    getXP,
    getStreak,
    progress,
  } = useProgress();
  const { currentUser } = useAuth();

  const totalProgress = getTotalProgress();
  const xp = getXP();
  const level = Math.floor(xp / 500) + 1;
  const dailyTip = TIPS[new Date().getDay() % TIPS.length];

  const completedLessons = Object.keys(progress.lessons ?? {}).length;
  const completedQuizzes = Object.keys(progress.quizzes ?? {}).length;
  const completedChallenges = Object.keys(progress.challenges ?? {}).length;
  const nextTrack = [...TRACKS].sort((a, b) => getTrackProgress(a.id) - getTrackProgress(b.id))[0] ?? TRACKS[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="glass-panel overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-7">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <Sparkles size={14} />
              Career-ready full-stack training
            </div>
            <div>
              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Welcome back, {currentUser?.name?.split(' ')[0] ?? 'Youssef'}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep the loop tight: learn one concept, test it, build with it, then review the result like a professional engineer.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <HeroMetric icon={Target} label="Overall" value={`${totalProgress}%`} />
              <HeroMetric icon={Star} label="Level" value={level} />
              <HeroMetric icon={Flame} label="Streak" value={`${getStreak()}d`} />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Path to Top 1</p>
                <h2 className="mt-1 text-xl font-bold text-white">{totalProgress}% complete</h2>
              </div>
              <TrendingUp className="text-emerald-300" size={24} />
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {totalProgress < 30 ? 'Build momentum with the core tracks first.' :
               totalProgress < 60 ? 'Good pace. Add projects and review labs now.' :
               totalProgress < 90 ? 'You are close. Focus on weak areas and interviews.' :
               'Top 1 pace. Keep the habit loop alive.'}
            </p>
            <Link to={`/courses?track=${nextTrack.id}`} className="btn-primary mt-5 w-full justify-center">
              Continue {nextTrack.title}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Lessons Done"
          value={completedLessons}
          icon={BookOpen}
          tone="blue"
          sub={`${totalProgress}% total progress`}
        />
        <StatCard
          label="Experience"
          value={`${xp} XP`}
          icon={Star}
          tone="amber"
          sub={`Level ${level} developer`}
        />
        <StatCard
          label="Completed Work"
          value={completedLessons + completedQuizzes + completedChallenges}
          icon={CheckCircle2}
          tone="emerald"
          sub={`${completedQuizzes} quizzes, ${completedChallenges} challenges`}
        />
        <StatCard
          label="Daily Streak"
          value={`${getStreak()} days`}
          icon={Flame}
          tone="rose"
          sub="Consistency beats intensity"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Learning Tracks</h2>
              <p className="text-sm text-slate-400">Pick the weakest track and move it forward today.</p>
            </div>
            <Link to="/courses" className="hidden text-sm font-semibold text-blue-300 hover:text-blue-200 sm:inline-flex">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TRACKS.map(track => {
              const trackPct = getTrackProgress(track.id);
              return (
                <Link
                  key={track.id}
                  to={`/courses?track=${track.id}`}
                  className={`card card-hover ${track.border}`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${track.gradient} text-xl shadow-lg shadow-black/20`}>
                      {track.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white">{track.title}</h3>
                      <p className="text-xs text-slate-400">{track.lessons.length} lessons</p>
                    </div>
                    <span className={`ml-auto badge ${track.badge}`}>{trackPct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill bg-gradient-to-r ${track.gradient}`}
                      style={{ width: `${trackPct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card border-blue-400/20 bg-blue-500/10">
            <div className="mb-3 flex items-center gap-3">
              <span className="icon-tile bg-blue-500/15 text-blue-200">
                <Lightbulb size={18} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Daily Insight</p>
                <h2 className="text-sm font-bold text-white">One thing to remember</h2>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-300">{dailyTip}</p>
          </div>

          <div className="card">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Quick Actions</h2>
              <p className="text-sm text-slate-400">Jump directly into practice.</p>
            </div>
            <div className="space-y-2">
              {QUICK_ACTIONS.map(action => (
                <QuickAction key={action.to} {...action} />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function HeroMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Icon size={15} />
        {label}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone, sub }) {
  const tones = {
    blue: 'from-blue-500/20 to-cyan-500/5 text-blue-200',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-200',
    rose: 'from-rose-500/20 to-red-500/5 text-rose-200',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-200',
  };

  return (
    <div className={`card bg-gradient-to-br ${tones[tone]}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400">{label}</span>
        <span className="icon-tile h-9 w-9 bg-white/5">
          <Icon size={17} />
        </span>
      </div>
      <div className="text-xl font-black text-white sm:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, caption, tone }) {
  const tones = {
    blue: 'hover:border-blue-400/40 hover:bg-blue-500/10 text-blue-200',
    violet: 'hover:border-violet-400/40 hover:bg-violet-500/10 text-violet-200',
    emerald: 'hover:border-emerald-400/40 hover:bg-emerald-500/10 text-emerald-200',
    amber: 'hover:border-amber-400/40 hover:bg-amber-500/10 text-amber-200',
  };

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-all ${tones[tone]}`}
    >
      <span className="icon-tile h-9 w-9">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-white">{label}</span>
        <span className="block truncate text-xs text-slate-500">{caption}</span>
      </span>
      <ArrowRight className="ml-auto text-slate-500" size={16} />
    </Link>
  );
}
