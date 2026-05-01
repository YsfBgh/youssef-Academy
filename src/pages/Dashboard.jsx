import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bot,
  BookOpen,
  Brain,
  Bug,
  Building2,
  CheckCircle2,
  Code2,
  Flame,
  FolderKanban,
  Gamepad2,
  GitPullRequest,
  Map,
  Mic,
  Network,
  Route,
  Shield,
  Sparkles,
  Star,
  Target,
  Terminal,
  Trophy,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { useProgress } from '../utils/ProgressContext';
import { useAuth } from '../utils/AuthContext';
import { TRACKS } from '../data/courses';

const DAILY_BRIEFINGS = [
  {
    id: 0,
    classification: 'PRIORITY-1 // INCIDENT',
    color: 'red',
    scenario: 'Production API throwing NullReferenceExceptions under load',
    context:
      "NexaCore's authentication service is crashing at 08:47 UTC. The JWT middleware is not guarding against missing claims. Sofia escalated. 3 clients impacted.",
    objective:
      'Reproduce the null-reference path, add null-guard, write a regression test before the next deploy.',
    skill: 'C# defensive coding · async error handling · unit testing',
    link: '/debugging',
    cta: 'Investigate Bug',
  },
  {
    id: 1,
    classification: 'SPRINT-14 // TICKET',
    color: 'blue',
    scenario: 'Implement cursor-based pagination for /api/projects',
    context:
      'The endpoint returns all projects in one shot. With 50+ clients this averages 4.2s. Marcus wants cursor-based pagination before the sprint review Friday.',
    objective:
      'Design the PagedResult<T> envelope, update the controller, write unit tests, update Swagger.',
    skill: 'ASP.NET Core · EF Core · REST API design',
    link: '/enterprise',
    cta: 'Open Ticket',
  },
  {
    id: 2,
    classification: 'PR-REVIEW // SECURITY',
    color: 'amber',
    scenario: 'PR #47 — Authentication controller is dangerously insecure',
    context:
      'Junior dev opened PR #47. Login endpoint compares plain-text passwords. No null checks. No rate limiting. Ship it and you own the breach.',
    objective:
      'Find all security issues. Write a blocking review with each issue, severity, and required fix.',
    skill: 'Security · OWASP Top 10 · code review mindset',
    link: '/codereview',
    cta: 'Review PR',
  },
  {
    id: 3,
    classification: 'ARCHITECTURE // ADR',
    color: 'violet',
    scenario: 'Monolith is at 90% CPU during report generation — split or scale?',
    context:
      'NexaCore handles auth, billing, and analytics in one service. Report generation spikes CPU every hour. C-suite wants a decision by EOD.',
    objective:
      'Evaluate vertical scaling vs extraction. Write an ADR with your recommendation and tradeoffs.',
    skill: 'System design · distributed systems · architectural thinking',
    link: '/architecture',
    cta: 'Design Session',
  },
  {
    id: 4,
    classification: 'LEARNING-OPS // MISSION',
    color: 'emerald',
    scenario: 'Master async/await — the engine behind .NET performance',
    context:
      'Every production .NET service is async. Confuse Thread.Sleep with Task.Delay or miss ConfigureAwait and you will deadlock under load.',
    objective:
      'Complete the async lesson, run the examples, answer the practice prompts, ship the mini project.',
    skill: 'C# async · Task Parallel Library · deadlock prevention',
    link: '/courses',
    cta: 'Start Mission',
  },
  {
    id: 5,
    classification: 'WORKFLOW // CI-CD',
    color: 'cyan',
    scenario: 'Merge conflict blocking the sprint deployment pipeline',
    context:
      'Two devs edited the same DI registration file. Conflict is live in the CI pipeline. Deploy is blocked. Sprint retrospective in 2 hours.',
    objective:
      'Resolve the conflict correctly, ensure tests pass, merge and trigger the deploy workflow.',
    skill: 'Git conflict resolution · CI/CD · pipeline health',
    link: '/workflows',
    cta: 'Run Workflow',
  },
  {
    id: 6,
    classification: 'INTERVIEW-PREP // SENIOR',
    color: 'rose',
    scenario: 'System design round in 48 hours — design a scalable notification service',
    context:
      'Senior-round interview at a Series B SaaS. They will ask you to design push/email/SMS notifications for 10M users with sub-second delivery guarantees.',
    objective:
      'Practice the framework: clarify → estimate → high-level design → deep dive → bottlenecks → tradeoffs.',
    skill: 'System design · distributed messaging · interview communication',
    link: '/interview',
    cta: 'Practice Now',
  },
];

const MISSION_MODULES = [
  { to: '/courses',      label: 'Courses',        caption: 'Missions & lessons',   icon: BookOpen,      color: 'blue',    status: 'active' },
  { to: '/codelab',      label: 'Code Lab',       caption: 'Coding challenges',    icon: Code2,         color: 'violet',  status: 'active' },
  { to: '/debugging',    label: 'Debug Lab',      caption: 'Evidence-driven bugs', icon: Bug,           color: 'red',     status: 'hot' },
  { to: '/codereview',   label: 'PR Review',      caption: 'Senior code review',   icon: GitPullRequest,color: 'amber',   status: 'active' },
  { to: '/architecture', label: 'Arch Lab',       caption: 'System design',        icon: Route,         color: 'emerald', status: 'active' },
  { to: '/enterprise',   label: 'Enterprise',     caption: 'Fake company sim',     icon: Building2,     color: 'slate',   status: 'active' },
  { to: '/workflows',    label: 'Workflows',      caption: 'Git, CI/CD, Docker',   icon: Workflow,      color: 'cyan',    status: 'active' },
  { to: '/simulations',  label: 'Simulations',    caption: 'Scenario challenges',  icon: Gamepad2,      color: 'violet',  status: 'active' },
  { to: '/projects',     label: 'Project Lab',    caption: 'Portfolio projects',   icon: FolderKanban,  color: 'blue',    status: 'active' },
  { to: '/aiagents',     label: 'AI Agents',      caption: 'Prompt engineering',   icon: Sparkles,      color: 'violet',  status: 'active' },
  { to: '/interview',    label: 'Interview',      caption: 'Practice rounds',      icon: Mic,           color: 'rose',    status: 'active' },
  { to: '/daily',        label: 'Daily Mission',  caption: 'One objective/day',    icon: Target,        color: 'amber',   status: 'hot' },
  { to: '/skilltree',    label: 'Skill Tree',     caption: 'XP-gated skills',      icon: Network,       color: 'emerald', status: 'active' },
  { to: '/roadmap',      label: 'Roadmap',        caption: 'Structured path',      icon: Map,           color: 'blue',    status: 'active' },
  { to: '/aicoach',      label: 'AI Coach',       caption: 'Your senior mentor',   icon: Bot,           color: 'cyan',    status: 'online' },
  { to: '/quiz',         label: 'Quizzes',        caption: 'Retention checks',     icon: Brain,         color: 'amber',   status: 'active' },
];

const COLOR_CLASSES = {
  blue:    { border: 'border-blue-500/30',    icon: 'bg-blue-500/15 text-blue-400' },
  violet:  { border: 'border-violet-500/30',  icon: 'bg-violet-500/15 text-violet-400' },
  red:     { border: 'border-red-500/30',     icon: 'bg-red-500/15 text-red-400' },
  amber:   { border: 'border-amber-500/30',   icon: 'bg-amber-500/15 text-amber-400' },
  emerald: { border: 'border-emerald-500/30', icon: 'bg-emerald-500/15 text-emerald-400' },
  slate:   { border: 'border-slate-500/30',   icon: 'bg-slate-700 text-slate-300' },
  cyan:    { border: 'border-cyan-500/30',    icon: 'bg-cyan-500/15 text-cyan-400' },
  rose:    { border: 'border-rose-500/30',    icon: 'bg-rose-500/15 text-rose-400' },
};

const INTEL_FEED = [
  { author: 'Sofia Chen · Tech Lead',   msg: "Every line of production code will be read 10x more than it is written. Optimize for the reader, not the compiler." },
  { author: 'Marcus Webb · Senior Dev', msg: "async/await is not about speed — it is about not blocking threads. Get that mental model right before anything else." },
  { author: 'James Torres · DevOps',    msg: "If your Dockerfile runs as root in production, you have a privilege escalation waiting to happen. Use USER directive." },
  { author: 'Sofia Chen · Tech Lead',   msg: "A PR that takes 30 minutes to review should have been two PRs. Scope discipline is a senior engineer habit." },
  { author: 'Priya Patel · Frontend',  msg: "useEffect dependency arrays are a contract. Lie about dependencies and you silently create stale closures in production." },
  { author: 'Marcus Webb · Senior Dev', msg: "Test the behavior, not the implementation. Tests that verify internals are maintenance debt with a time-bomb fuse." },
  { author: 'James Torres · DevOps',    msg: "Health checks + structured logging + distributed tracing = production visibility. Miss one and you debug in the dark." },
  { author: 'Lena Fischer · QA',       msg: "The bug you fixed without a regression test will come back in three months. That is not a prediction — it is a pattern." },
];

function getThreatLevel(pct) {
  if (pct >= 80) return { label: 'SECURE',   color: 'text-emerald-400', fill: 'threat-fill-good',     dot: 'status-dot-online' };
  if (pct >= 50) return { label: 'NOMINAL',  color: 'text-amber-400',   fill: 'threat-fill-medium',   dot: 'status-dot-warn' };
  if (pct >= 20) return { label: 'EXPOSED',  color: 'text-orange-400',  fill: 'threat-fill-high',     dot: 'status-dot-warn' };
  return               { label: 'CRITICAL',  color: 'text-red-400',     fill: 'threat-fill-critical', dot: 'status-dot-danger' };
}

function StatChip({ icon: Icon, label, value, sub, tone }) {
  const toneClass = { blue:'text-blue-400', amber:'text-amber-400', emerald:'text-emerald-400', rose:'text-rose-400', violet:'text-violet-400', cyan:'text-cyan-400' }[tone] ?? 'text-blue-400';
  return (
    <div className="card flex items-center gap-3 py-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${toneClass} bg-white/5`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</div>
        <div className="text-lg font-black text-white leading-tight">{value}</div>
        {sub && <div className="text-xs text-slate-500 truncate">{sub}</div>}
      </div>
    </div>
  );
}

function MissionLauncher({ module }) {
  const c = COLOR_CLASSES[module.color] ?? COLOR_CLASSES.blue;
  const Icon = module.icon;
  return (
    <Link to={module.to} className={`card card-hover border ${c.border} group flex items-center gap-3 py-3`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.icon}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-white truncate">{module.label}</span>
          {module.status === 'hot'    && <span className="text-xs font-bold text-red-400 animate-threat">● HOT</span>}
          {module.status === 'online' && <span className="text-xs font-bold text-emerald-400">● LIVE</span>}
        </div>
        <div className="text-xs text-slate-500 truncate">{module.caption}</div>
      </div>
      <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
    </Link>
  );
}

export default function Dashboard() {
  const { getTotalProgress, getTrackProgress, getXP, getStreak, progress } = useProgress();
  const { currentUser } = useAuth();
  const [intelIdx, setIntelIdx] = useState(0);

  const totalProgress    = getTotalProgress();
  const xp               = getXP();
  const level            = Math.floor(xp / 500) + 1;
  const levelXp          = xp % 500;
  const levelPct         = (levelXp / 500) * 100;
  const streak           = getStreak();
  const briefing         = DAILY_BRIEFINGS[new Date().getDay() % DAILY_BRIEFINGS.length];
  const intel            = INTEL_FEED[intelIdx];
  const completedLessons    = Object.keys(progress.lessons    ?? {}).length;
  const completedChallenges = Object.keys(progress.challenges ?? {}).length;
  const completedReviews    = Object.keys(progress.codeReviews ?? {}).length;
  const completedDebugs     = Object.keys(progress.debugScenarios ?? {}).length;

  useEffect(() => {
    const id = setInterval(() => setIntelIdx(i => (i + 1) % INTEL_FEED.length), 8000);
    return () => clearInterval(id);
  }, []);

  const now     = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const briefingBorder = {
    red:'border-red-500/40 bg-red-500/5', blue:'border-blue-500/40 bg-blue-500/5',
    amber:'border-amber-500/40 bg-amber-500/5', violet:'border-violet-500/40 bg-violet-500/5',
    emerald:'border-emerald-500/40 bg-emerald-500/5', cyan:'border-cyan-500/40 bg-cyan-500/5', rose:'border-rose-500/40 bg-rose-500/5',
  }[briefing.color] ?? 'border-blue-500/40 bg-blue-500/5';

  const briefingText = {
    red:'text-red-400', blue:'text-blue-400', amber:'text-amber-400',
    violet:'text-violet-400', emerald:'text-emerald-400', cyan:'text-cyan-400', rose:'text-rose-400',
  }[briefing.color] ?? 'text-blue-400';

  return (
    <div className="mx-auto max-w-7xl space-y-5">

      {/* Command Bar */}
      <div className="terminal-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="terminal-header text-emerald-400">◈ JADEV ACADEMY // MISSION COMMAND</span>
            <span className="terminal-header text-slate-600">|</span>
            <span className="terminal-header text-slate-400">ENGINEER: <span className="text-white">{currentUser?.name?.split(' ')[0]?.toUpperCase() ?? 'YOUSSEF'}</span></span>
            <span className="terminal-header text-slate-600">|</span>
            <span className="terminal-header text-slate-400">LV-<span className="text-amber-400">{level}</span></span>
            <span className="terminal-header text-slate-600">|</span>
            <span className="terminal-header text-slate-400">XP: <span className="text-blue-400">{xp.toLocaleString()}</span></span>
            {streak > 0 && (
              <>
                <span className="terminal-header text-slate-600">|</span>
                <span className="terminal-header text-orange-400">🔥 STREAK: {streak}D</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="status-indicator text-emerald-400">
              <span className="status-dot status-dot-online" /> SYSTEMS ONLINE
            </span>
            <span className="terminal-header text-slate-500">{dateStr} {timeStr}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="terminal-header text-slate-500 whitespace-nowrap">LV {level} → LV {level + 1}</span>
          <div className="xp-bar-wrap flex-1">
            <div className="xp-bar-fill" style={{ width: `${levelPct}%` }} />
          </div>
          <span className="terminal-header text-slate-500 whitespace-nowrap">{levelXp}/500 XP</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatChip icon={Target}       label="Coverage"   value={`${totalProgress}%`}             sub="curriculum complete"                                              tone="blue" />
        <StatChip icon={Zap}          label="XP Earned"  value={xp.toLocaleString()}             sub={`Level ${level} developer`}                                       tone="amber" />
        <StatChip icon={CheckCircle2} label="Completed"  value={completedLessons + completedChallenges + completedReviews + completedDebugs} sub={`${completedLessons} lessons · ${completedChallenges} challenges`} tone="emerald" />
        <StatChip icon={Star}         label="Streak"     value={`${streak} days`}                sub="consistency beats intensity"                                      tone="rose" />
      </div>

      {/* Main Grid */}
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">

        {/* LEFT */}
        <div className="space-y-5">

          {/* Daily Briefing */}
          <div className={`card border ${briefingBorder}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`terminal-header ${briefingText}`}>◈ {briefing.classification}</span>
                  <span className="terminal-header text-slate-600">—</span>
                  <span className="terminal-header text-slate-400">TODAY'S BRIEFING</span>
                </div>
                <h2 className="text-xl font-black text-white leading-tight">{briefing.scenario}</h2>
              </div>
              <Shield size={20} className={`flex-shrink-0 ${briefingText}`} />
            </div>
            <div className="space-y-3">
              <div className="callout-info">
                <span className="font-semibold text-blue-300">CONTEXT: </span>{briefing.context}
              </div>
              <div className="callout-warn">
                <span className="font-semibold text-amber-300">OBJECTIVE: </span>{briefing.objective}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-mono">{briefing.skill}</span>
              </div>
              <Link to={briefing.link} className="btn-primary text-sm py-2">
                {briefing.cta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Mission Launcher Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">⬡ Mission Modules</h3>
                <p className="text-xs text-slate-500">Select an objective and execute</p>
              </div>
              <span className="terminal-header text-slate-500">{MISSION_MODULES.length} MODULES READY</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {MISSION_MODULES.map(m => <MissionLauncher key={m.to} module={m} />)}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          {/* Threat Assessment */}
          <div className="card">
            <div className="mb-4">
              <div className="terminal-header text-red-400 mb-1">◈ THREAT ASSESSMENT</div>
              <p className="text-xs text-slate-500">Weak tracks = highest XP gain per hour. Prioritize these.</p>
            </div>
            <div className="space-y-3">
              {TRACKS.map(track => {
                const pct    = getTrackProgress(track.id);
                const threat = getThreatLevel(pct);
                return (
                  <Link key={track.id} to={`/courses?track=${track.id}`}
                    className="block hover:bg-slate-800/50 rounded-lg p-2 -mx-2 transition-colors group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{track.icon}</span>
                        <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{track.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`status-dot ${threat.dot}`} />
                        <span className={`terminal-header ${threat.color}`}>{threat.label}</span>
                        <span className="terminal-header text-slate-500">{pct}%</span>
                      </div>
                    </div>
                    <div className="threat-bar-wrap">
                      <div className={`h-full rounded-full transition-all duration-500 ${threat.fill}`}
                        style={{ width: `${Math.max(2, pct)}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-500">Total coverage</span>
                <span className="text-sm font-bold text-white">{totalProgress}%</span>
              </div>
              <div className="threat-bar-wrap">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.max(2, totalProgress)}%` }} />
              </div>
            </div>
          </div>

          {/* Intel Feed */}
          <div className="terminal-panel">
            <div className="terminal-header text-emerald-400 mb-3">◈ SENIOR ENGINEER INTEL</div>
            <div key={intelIdx} className="animate-terminal-in">
              <p className="terminal-text leading-relaxed">&gt; {intel.msg}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="status-dot status-dot-online" />
                <span className="terminal-header text-slate-500">{intel.author}</span>
                <span className="terminal-text animate-blink">_</span>
              </div>
            </div>
            <div className="mt-3 flex gap-1">
              {INTEL_FEED.map((_, i) => (
                <button key={i} onClick={() => setIntelIdx(i)}
                  className={`h-1 rounded-full transition-all ${i === intelIdx ? 'w-4 bg-emerald-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`} />
              ))}
            </div>
          </div>

          {/* Mission Log */}
          <div className="card">
            <div className="terminal-header text-slate-400 mb-3">◈ MISSION LOG</div>
            <div className="space-y-2">
              {completedLessons > 0 && (
                <div className="mission-card mission-card-complete flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-violet-400 flex-shrink-0" />
                  {completedLessons} lesson{completedLessons !== 1 ? 's' : ''} completed
                </div>
              )}
              {completedChallenges > 0 && (
                <div className="mission-card mission-card-complete flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-violet-400 flex-shrink-0" />
                  {completedChallenges} code challenge{completedChallenges !== 1 ? 's' : ''} solved
                </div>
              )}
              {completedReviews > 0 && (
                <div className="mission-card mission-card-complete flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-violet-400 flex-shrink-0" />
                  {completedReviews} PR{completedReviews !== 1 ? 's' : ''} reviewed
                </div>
              )}
              {completedDebugs > 0 && (
                <div className="mission-card mission-card-complete flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-violet-400 flex-shrink-0" />
                  {completedDebugs} debug scenario{completedDebugs !== 1 ? 's' : ''} resolved
                </div>
              )}
              {completedLessons + completedChallenges + completedReviews + completedDebugs === 0 && (
                <div className="text-center py-4">
                  <Terminal size={20} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">No missions completed yet.</p>
                  <p className="text-xs text-slate-600">Start with today's briefing above.</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <Link to="/leaderboard" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <Trophy size={12} /> Leaderboard
              </Link>
              <Link to="/career" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <TrendingUp size={12} /> Career OS
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card bg-slate-900/40">
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { v: completedLessons,    l: 'LESSONS' },
                { v: completedChallenges, l: 'CHALLENGES' },
                { v: completedReviews,    l: 'PR REVIEWS' },
                { v: level,               l: 'LEVEL' },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
