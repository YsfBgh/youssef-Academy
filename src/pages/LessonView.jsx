import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrack, getLesson } from '../data/courses';
import { buildLessonMastery } from '../data/masteryCurriculum';
import { getExercisesForTrack } from '../data/practiceExercises';
import { useProgress } from '../utils/ProgressContext';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  Copy,
  ExternalLink,
  FolderKanban,
  Lightbulb,
  RefreshCw,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';

// ── Scenario framing per lesson prefix ────────────────────
function buildScenario(lesson, track) {
  const base = lesson.title ?? 'Mission Briefing';
  const scenarios = [
    {
      match: /(async|await|task|thread)/i,
      classification: 'INCIDENT-RESPONSE',
      color: 'red',
      scenario: `Production deadlock traced to synchronous blocking in the ${base} module.`,
      context: `An engineer called .Result on an async method inside an ASP.NET request pipeline. The thread pool is starved and the API is returning 503s. You are on-call.`,
      objective: `Understand how ${base} works, identify the deadlock pattern, refactor to full async/await, and add defensive comments.`,
    },
    {
      match: /(solid|principle|dependency|inject)/i,
      classification: 'ARCHITECTURE-REVIEW',
      color: 'violet',
      scenario: `Sofia flagged a 600-line service class that violates multiple principles covered in ${base}.`,
      context: `The UserService is doing authentication, email sending, logging, and data access all in one place. It is impossible to test and every change breaks something else.`,
      objective: `Learn the ${base} principles, identify which are violated in the scenario, and sketch a refactored class structure.`,
    },
    {
      match: /(sql|query|database|ef|entity)/i,
      classification: 'PERFORMANCE-INCIDENT',
      color: 'amber',
      scenario: `The /api/orders endpoint is taking 8 seconds. Profiler shows a classic ${base} anti-pattern.`,
      context: `A LINQ query loads all orders from the database and filters them in memory. With 200K rows this is a full table scan. DBA has set a 1-second SLA.`,
      objective: `Understand how ${base} generates SQL, push filters to the database, and confirm the query plan improved.`,
    },
    {
      match: /(react|component|hook|state)/i,
      classification: 'SPRINT-TASK',
      color: 'blue',
      scenario: `Marcus opened a ticket: the dashboard re-renders 40 times on each keystroke due to ${base} misuse.`,
      context: `A parent component passes new object literals as props on every render. Child components re-render unnecessarily. Users notice lag on slower machines.`,
      objective: `Master ${base}, identify unnecessary re-renders, apply memoization correctly, and verify in React DevTools.`,
    },
    {
      match: /(pattern|design|factory|strategy|observer|repository)/i,
      classification: 'CODE-REVIEW',
      color: 'emerald',
      scenario: `PR #52 duplicates business logic in three controllers. ${base} solves this.`,
      context: `Three controllers implement the same discount calculation logic inline. Change the business rule and you must change it in three places — and inevitably miss one.`,
      objective: `Learn ${base}, identify where it applies in the PR, refactor to extract the pattern, and write the blocking review comment.`,
    },
  ];

  const match = scenarios.find(s => s.match.test(base));
  if (match) return match;

  return {
    classification: 'LEARNING-OPS',
    color: 'cyan',
    scenario: `New mission: master ${base} to unblock the ${track.title} track.`,
    context: `This concept appears in real codebases every week. Engineers who skip it hit walls in code review, debugging, and architecture discussions.`,
    objective: `Complete this mission: understand the concept, run the code, answer the practice questions, and ship the project slice.`,
  };
}

// ── Tab definitions ────────────────────────────────────────
const TABS = [
  { id: 'briefing',  label: '⬡ Briefing',   icon: Shield },
  { id: 'code',      label: '⌥ Code Intel',  icon: Code2 },
  { id: 'practice',  label: '◎ Practice',    icon: Zap },
  { id: 'exercises', label: 'Exercises',     icon: Code2 },
  { id: 'mission',   label: '🎯 Live Mission', icon: FolderKanban },
  { id: 'debrief',   label: '◈ Debrief',     icon: RefreshCw },
  { id: 'resources', label: '◇ Resources',   icon: ExternalLink },
];

// ── Helper components ──────────────────────────────────────
function ObjectiveItem({ text, done = false, onToggle }) {
  return (
    <button
      className={`mission-obj-item w-full text-left ${done ? 'done' : ''}`}
      onClick={onToggle}
    >
      {done
        ? <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        : <Circle      size={14} className="text-slate-600    flex-shrink-0 mt-0.5" />
      }
      <span>{text}</span>
    </button>
  );
}

function SectionLabel({ children, color = 'blue' }) {
  const c = { blue:'text-blue-400', emerald:'text-emerald-400', amber:'text-amber-400', violet:'text-violet-400', red:'text-red-400', cyan:'text-cyan-400' }[color] ?? 'text-blue-400';
  return (
    <div className={`terminal-header ${c} mb-2`}>◈ {children}</div>
  );
}

function ItemList({ items = [], tone = 'blue' }) {
  const c = { blue:'text-blue-400', emerald:'text-emerald-400', amber:'text-amber-400', violet:'text-violet-400' }[tone] ?? 'text-blue-400';
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
          <ChevronRight size={14} className={`${c} flex-shrink-0 mt-0.5`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TheoryContent({ content }) {
  if (!content) return <p className="text-slate-500 text-sm">No briefing content yet.</p>;
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-4">
            {codeLang && (
              <div className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-t-lg px-3 py-1.5 border-b-0">
                <span className="terminal-header text-slate-400">{codeLang}</span>
              </div>
            )}
            <pre className={`code-block text-sm overflow-x-auto ${codeLang ? 'rounded-t-none' : ''}`}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        inCodeBlock = false; codeLines = []; codeLang = '';
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
    } else if (inCodeBlock) {
      codeLines.push(line);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-blue-500 rounded-full" />{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold text-blue-400 mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-sm font-semibold text-slate-300 mt-3 mb-1">{line.slice(5)}</h4>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2);
      elements.push(
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300 ml-2 mb-1">
          <ChevronRight size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.+?)`/g, '<code class="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>') }} />
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-slate-300 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.+?)`/g, '<code class="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>') }}
        />
      );
    }
  });

  return <div className="space-y-0.5">{elements}</div>;
}

// ── Main LessonView ────────────────────────────────────────
export default function LessonView() {
  const { trackId, lessonId } = useParams();
  const [tab, setTab] = useState('briefing');
  const [copied, setCopied] = useState(false);
  const [checkedObjs, setCheckedObjs] = useState({});
  const { isLessonComplete, markLessonComplete } = useProgress();

  const track  = getTrack(trackId);
  const lesson = getLesson(trackId, lessonId);

  if (!track || !lesson) {
    return (
      <div className="text-center py-20">
        <Terminal size={32} className="text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 mb-4">Lesson not found.</p>
        <Link to="/courses" className="btn-primary inline-flex">← Back to Courses</Link>
      </div>
    );
  }

  const allLessons  = track.lessons;
  const currentIdx  = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson  = allLessons[currentIdx - 1];
  const nextLesson  = allLessons[currentIdx + 1];
  const done        = isLessonComplete(trackId, lessonId);
  const mastery     = buildLessonMastery(track, lesson);
  const scenario    = buildScenario(lesson, track);
  const relatedExercises = getExercisesForTrack(trackId).slice(0, 4);

  const scenarioBorder = {
    red:'border-red-500/40 bg-red-500/5', blue:'border-blue-500/40 bg-blue-500/5',
    amber:'border-amber-500/40 bg-amber-500/5', violet:'border-violet-500/40 bg-violet-500/5',
    emerald:'border-emerald-500/40 bg-emerald-500/5', cyan:'border-cyan-500/40 bg-cyan-500/5',
  }[scenario.color] ?? 'border-blue-500/40 bg-blue-500/5';

  const scenarioText = {
    red:'text-red-400', blue:'text-blue-400', amber:'text-amber-400',
    violet:'text-violet-400', emerald:'text-emerald-400', cyan:'text-cyan-400',
  }[scenario.color] ?? 'text-blue-400';

  const trackColor = {
    blue:'text-blue-400', violet:'text-violet-400', emerald:'text-emerald-400',
    amber:'text-amber-400', rose:'text-rose-400',
  }[track.color] ?? 'text-blue-400';

  const toggleObj = (key) => setCheckedObjs(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCopy = () => {
    navigator.clipboard.writeText(lesson.codeExample ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <Link to="/courses" className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Courses
        </Link>
        <ChevronRight size={12} className="text-slate-700" />
        <Link to={`/courses?track=${trackId}`} className="text-slate-500 hover:text-slate-300 transition-colors">{track.title}</Link>
        <ChevronRight size={12} className="text-slate-700" />
        <span className="text-slate-300 truncate">{lesson.title}</span>
      </div>

      {/* Mission Header */}
      <div className="terminal-panel">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
            {track.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`terminal-header ${scenarioText}`}>◈ MISSION</span>
              <span className="terminal-header text-slate-600">|</span>
              <span className={`terminal-header ${trackColor}`}>{track.title?.toUpperCase()}</span>
              <span className="terminal-header text-slate-600">|</span>
              <span className="terminal-header text-slate-500">{lesson.difficulty?.toUpperCase() ?? 'INTERMEDIATE'}</span>
              <span className="terminal-header text-slate-600">|</span>
              <span className="terminal-header text-slate-500">{lesson.duration?.toUpperCase()}</span>
              {done && <span className="terminal-header text-emerald-400">| ✓ COMPLETE</span>}
            </div>
            <h1 className="text-xl font-black text-white leading-tight">{lesson.title}</h1>
          </div>
          {!done && (
            <button onClick={() => markLessonComplete(trackId, lessonId)} className="btn-success text-sm flex-shrink-0">
              ✓ Complete
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="terminal-header text-slate-500 whitespace-nowrap">
            {currentIdx + 1}/{allLessons.length}
          </span>
          <div className="threat-bar-wrap flex-1">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / allLessons.length) * 100}%` }} />
          </div>
          <span className="terminal-header text-slate-500 whitespace-nowrap">track progress</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/80 rounded-lg p-1 border border-white/8 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-2 px-3 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              tab === t.id
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">

        {/* BRIEFING */}
        {tab === 'briefing' && (
          <div className="space-y-4">
            {/* Scenario card */}
            <div className={`card border ${scenarioBorder}`}>
              <div className="flex items-start gap-3 mb-4">
                <Shield size={18} className={`flex-shrink-0 ${scenarioText} mt-0.5`} />
                <div>
                  <div className={`terminal-header ${scenarioText} mb-1`}>◈ {scenario.classification}</div>
                  <h2 className="text-lg font-black text-white leading-tight">{scenario.scenario}</h2>
                </div>
              </div>
              <div className="space-y-3">
                <div className="callout-info">
                  <span className="font-semibold text-blue-300">SITUATION: </span>{scenario.context}
                </div>
                <div className="callout-warn">
                  <span className="font-semibold text-amber-300">YOUR OBJECTIVE: </span>{scenario.objective}
                </div>
              </div>
            </div>

            {/* Learning objectives checklist */}
            <div className="card">
              <SectionLabel color="blue">MISSION OBJECTIVES</SectionLabel>
              <div className="space-y-1.5">
                {mastery.objectives?.map((obj, i) => (
                  <ObjectiveItem
                    key={i}
                    text={obj}
                    done={!!checkedObjs[`obj-${i}`]}
                    onToggle={() => toggleObj(`obj-${i}`)}
                  />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {Object.values(checkedObjs).filter(Boolean).length} / {mastery.objectives?.length ?? 0} objectives checked
                  </span>
                  <button onClick={() => setTab('code')} className="btn-primary text-xs py-1.5">
                    Read Code Intel <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Theory */}
            <div className="card">
              <SectionLabel color="cyan">KNOWLEDGE BRIEF</SectionLabel>
              <TheoryContent content={lesson.theory} />
            </div>

            {/* Key points */}
            {lesson.keyPoints?.length > 0 && (
              <div className="card">
                <SectionLabel color="emerald">INTEL SUMMARY — KEY TAKEAWAYS</SectionLabel>
                <div className="space-y-2">
                  {lesson.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-white/6">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${track.gradient} flex items-center justify-center text-xs text-white font-black flex-shrink-0 mt-0.5`}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CODE INTEL */}
        {tab === 'code' && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <SectionLabel color="cyan">CODE INTEL — PRODUCTION EXAMPLE</SectionLabel>
                  <p className="text-xs text-slate-500">Study how this pattern is written in a real codebase.</p>
                </div>
                <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="code-block text-sm overflow-x-auto">
                <code>{lesson.codeExample}</code>
              </pre>
            </div>
            <div className="callout-info">
              <span className="font-semibold text-blue-300">INTEL NOTE: </span>
              Read the code carefully before running it. Ask yourself: what would break if this code ran in production under load? What is missing? What would you add in a real PR?
            </div>
            <div className="card">
              <SectionLabel color="violet">MENTAL MODEL</SectionLabel>
              <div className="space-y-1.5">
                {mastery.mentalModel?.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded bg-slate-900/60 text-sm text-slate-300">
                    <span className="text-violet-400 font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRACTICE */}
        {tab === 'practice' && (
          <div className="space-y-4">
            <div className="callout-warn">
              <span className="font-semibold text-amber-300">FIELD EXERCISE: </span>
              Work through each item below without looking at the answer first. The goal is to struggle productively — that is where real learning happens.
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="card">
                <SectionLabel color="blue">GUIDED PRACTICE</SectionLabel>
                <ItemList items={mastery.guidedPractice} tone="blue" />
              </div>
              <div className="card">
                <SectionLabel color="emerald">MASTERY CHECKLIST</SectionLabel>
                <div className="space-y-1.5">
                  {mastery.masteryChecklist?.map((item, i) => (
                    <ObjectiveItem
                      key={i}
                      text={item}
                      done={!!checkedObjs[`mastery-${i}`]}
                      onToggle={() => toggleObj(`mastery-${i}`)}
                    />
                  ))}
                </div>
              </div>
              <div className="card lg:col-span-2">
                <SectionLabel color="amber">AI COACH PROMPTS — USE THESE WITH YOUR MENTOR</SectionLabel>
                <div className="space-y-2">
                  {mastery.aiCoachPrompts?.map((prompt, i) => (
                    <div key={i} className="terminal-panel py-2 px-3 flex items-start gap-2">
                      <Bot size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="terminal-text text-xs leading-relaxed">{prompt}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Link to="/aicoach" className="btn-secondary text-xs py-1.5 w-full justify-center">
                    Open AI Coach <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'exercises' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-white mb-1">Related Practice Exercises</h3>
              <p className="text-sm text-slate-400 mb-4">
                Hands-on exercises tied to this track. Each has progressive hints, starter code, and a full solution.
              </p>

              {relatedExercises.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-3">No exercises mapped to this track yet.</p>
                  <Link to="/practice" className="btn-primary text-sm">Browse All Exercises</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedExercises.map(ex => (
                    <div key={ex.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-semibold text-white text-sm">{ex.title}</h4>
                          <DiffBadge level={ex.difficulty} />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{ex.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {ex.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-semibold text-amber-400">+{ex.xpReward} XP</span>
                        <Link to="/practice" className="btn-secondary text-xs py-1.5 px-3">
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Link to="/practice" className="btn-primary text-sm w-fit">
                      View All Exercises →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="card border border-blue-500/20 bg-blue-500/5">
              <h3 className="font-bold text-white mb-2">AI-Generated Practice</h3>
              <p className="text-sm text-slate-400 mb-3">
                Ask the AI Coach to generate more exercises tailored to this topic.
              </p>
              <Link
                to={'/aicoach'}
                className="btn-secondary text-sm w-fit"
              >
                Ask AI Coach for exercises →
              </Link>
            </div>
          </div>
        )}

        {/* LIVE MISSION */}
        {tab === 'mission' && (
          <div className="space-y-4">
            <div className={`card border ${scenarioBorder}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className={`terminal-header ${scenarioText} mb-1`}>◈ LIVE MISSION — PRODUCTION-STYLE TASK</div>
                  <h3 className="text-lg font-black text-white">{mastery.projectTask?.title}</h3>
                </div>
                <span className="badge bg-emerald-500/20 text-emerald-300">+50 XP</span>
              </div>
              <div className="mt-3 callout-info">
                <span className="font-semibold text-blue-300">BRIEF: </span>{mastery.projectTask?.brief}
              </div>
            </div>
            <div className="card">
              <SectionLabel color="emerald">ACCEPTANCE CRITERIA</SectionLabel>
              <div className="space-y-1.5">
                {mastery.projectTask?.acceptance?.map((item, i) => (
                  <ObjectiveItem
                    key={i}
                    text={item}
                    done={!!checkedObjs[`ac-${i}`]}
                    onToggle={() => toggleObj(`ac-${i}`)}
                  />
                ))}
              </div>
            </div>
            <div className="card border-slate-600/50 bg-slate-900/40">
              <SectionLabel color="amber">HOW A SENIOR ENGINEER SHIPS THIS</SectionLabel>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-2"><ChevronRight size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />Create a feature branch named <code className="bg-slate-700 text-blue-300 px-1.5 rounded text-xs font-mono">feat/{lessonId}-implementation</code></div>
                <div className="flex items-start gap-2"><ChevronRight size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />Implement the slice. Keep commits small and each commit message should say <em>why</em>, not what.</div>
                <div className="flex items-start gap-2"><ChevronRight size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />Write one unit test per acceptance criterion.</div>
                <div className="flex items-start gap-2"><ChevronRight size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />Write a short PR description: what you built, what you left out, and why.</div>
                <div className="flex items-start gap-2"><ChevronRight size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />Review it yourself before marking complete. Would you approve this if a colleague opened it?</div>
              </div>
            </div>
            {!done && (
              <button onClick={() => markLessonComplete(trackId, lessonId)}
                className="btn-success w-full justify-center">
                ✓ Mission Complete — Claim XP
              </button>
            )}
            {done && (
              <div className="callout-success text-center font-semibold">
                ✓ Mission completed — 50 XP credited to your profile.
              </div>
            )}
          </div>
        )}

        {/* DEBRIEF */}
        {tab === 'debrief' && (
          <div className="space-y-4">
            <div className="callout-info">
              <span className="font-semibold text-blue-300">DEBRIEF PROTOCOL: </span>
              Answer these prompts from memory before re-reading the lesson. Spaced retrieval practice is the highest-ROI study technique.
            </div>
            <div className="card">
              <SectionLabel color="blue">SPACED REVIEW PROMPTS</SectionLabel>
              <div className="space-y-2">
                {mastery.reviewPrompts?.map((prompt, i) => (
                  <div key={i} className="p-3 bg-slate-900/60 rounded-lg border border-white/6">
                    <div className="flex items-start gap-2">
                      <span className="terminal-header text-slate-500 flex-shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                      <span className="text-sm text-slate-300">{prompt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="card">
                <SectionLabel color="violet">SENIOR ENGINEER QUESTIONS</SectionLabel>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="p-2 rounded bg-slate-900/60 border border-white/6">What would break if someone misused this pattern under high concurrency?</div>
                  <div className="p-2 rounded bg-slate-900/60 border border-white/6">How would you explain this to a junior engineer in 60 seconds?</div>
                  <div className="p-2 rounded bg-slate-900/60 border border-white/6">In a code review, what would you specifically look for?</div>
                  <div className="p-2 rounded bg-slate-900/60 border border-white/6">What is the most common mistake engineers make with this concept?</div>
                </div>
              </div>
              <div className="card">
                <SectionLabel color="emerald">NEXT MISSION PREP</SectionLabel>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="p-2 rounded bg-slate-900/60 border border-white/6 flex items-start gap-2">
                    <Lightbulb size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    Apply what you learned immediately — find this pattern in open-source .NET code and read a real implementation.
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-white/6 flex items-start gap-2">
                    <BookOpen size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    Review the checklist above — can you tick every item from memory?
                  </div>
                </div>
                {nextLesson && (
                  <Link to={`/courses/${trackId}/lesson/${nextLesson.id}`}
                    className="btn-primary mt-3 w-full justify-center text-sm">
                    Next Mission: {nextLesson.title} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES */}
        {tab === 'resources' && (
          <div className="space-y-4">
            <div className="callout-info">
              <span className="font-semibold text-blue-300">INTEL SOURCES: </span>
              Use these as supplements after completing the mission. Do not read documentation passively — have a specific question in mind before opening any link.
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {mastery.resources?.map(resource => (
                <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer"
                  className="card card-hover border border-white/10 group">
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge bg-blue-500/20 text-blue-300">{resource.type}</span>
                    <ExternalLink size={13} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                  <div className="mt-2 font-semibold text-white text-sm">{resource.label}</div>
                  <div className="mt-1 truncate text-xs text-slate-500 font-mono">{resource.url}</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {prevLesson && (
          <Link to={`/courses/${trackId}/lesson/${prevLesson.id}`} className="btn-secondary flex-1 justify-center text-sm">
            <ArrowLeft size={14} /> {prevLesson.title}
          </Link>
        )}
        {!done && (
          <button onClick={() => markLessonComplete(trackId, lessonId)} className="btn-success flex-1 justify-center text-sm">
            ✓ Complete Mission
          </button>
        )}
        {nextLesson && (
          <Link to={`/courses/${trackId}/lesson/${nextLesson.id}`} className="btn-primary flex-1 justify-center text-sm">
            {nextLesson.title} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
function DiffBadge({ level }) {
  const colors = {
    Beginner:     'bg-emerald-500/20 text-emerald-400',
    Intermediate: 'bg-amber-500/20 text-amber-400',
    Advanced:     'bg-rose-500/20 text-rose-400',
  };
  return <span className={`badge text-xs ${colors[level] ?? colors.Beginner}`}>{level}</span>;
}
