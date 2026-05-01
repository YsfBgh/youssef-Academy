import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getTrack, getLesson } from '../data/courses';
import { getExercise, hasExercise } from '../data/exercises';
import { useProgress } from '../utils/ProgressContext';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  Copy,
  Flag,
  Lightbulb,
  Play,
  RotateCcw,
  Shield,
  Terminal,
  Trophy,
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';

// ── Phase definitions ─────────────────────────────────────────
const PHASES = [
  { id: 'briefing',  label: 'Briefing',  icon: Shield    },
  { id: 'concept',   label: 'Concept',   icon: BookOpen  },
  { id: 'code',      label: 'Code',      icon: Code2     },
  { id: 'challenge', label: 'Challenge', icon: Zap       },
  { id: 'complete',  label: 'Complete',  icon: Trophy    },
];

// ── JS sandbox runner ─────────────────────────────────────────
function runJavaScript(code) {
  return new Promise((resolve) => {
    const logs = [];
    const errors = [];

    const id = `sandbox-${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.style.display = 'none';
    iframe.sandbox = 'allow-scripts';

    const wrapped = `
      <html><body><script>
        (function() {
          var __logs = [];
          var __orig = { log: console.log, error: console.error, warn: console.warn };
          console.log   = function() { __logs.push(['log',   Array.from(arguments).map(function(a){ return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' ')]); };
          console.error = function() { __logs.push(['error', Array.from(arguments).map(function(a){ return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' ')]); };
          console.warn  = function() { __logs.push(['warn',  Array.from(arguments).map(function(a){ return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' ')]); };
          try {
            ${code}
          } catch(e) {
            __logs.push(['error', 'Runtime Error: ' + e.message]);
          }
          window.parent.postMessage({ type: 'sandbox-result', id: '${id}', logs: __logs }, '*');
        })();
      <\/script></body></html>
    `;

    const timeout = setTimeout(() => {
      document.body.removeChild(iframe);
      window.removeEventListener('message', handler);
      resolve({ logs: [['error', 'Execution timed out after 5 seconds']] });
    }, 5000);

    function handler(e) {
      if (e.data?.type === 'sandbox-result' && e.data.id === id) {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        resolve({ logs: e.data.logs });
      }
    }

    window.addEventListener('message', handler);
    document.body.appendChild(iframe);
    iframe.srcdoc = wrapped;
  });
}

// ── C# pattern checker ────────────────────────────────────────
function checkCSharp(code, patterns) {
  const results = patterns.map(p => {
    const regex = new RegExp(p.regex, 'is');
    const passed = regex.test(code);
    return { label: p.label, passed };
  });
  return results;
}

// ── Helper components ─────────────────────────────────────────
function PhaseBreadcrumb({ currentPhase, onNavigate, unlockedUpTo }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {PHASES.map((phase, idx) => {
        const unlocked  = idx <= unlockedUpTo;
        const isCurrent = phase.id === currentPhase;
        const isDone    = idx < PHASES.findIndex(p => p.id === currentPhase);
        const Icon = phase.icon;
        return (
          <React.Fragment key={phase.id}>
            <button
              onClick={() => unlocked && onNavigate(phase.id)}
              disabled={!unlocked}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : isDone
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  : unlocked
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-900/40 text-slate-700 border border-slate-800 cursor-not-allowed'
              }`}
            >
              {isDone ? <CheckCircle2 size={11} /> : <Icon size={11} />}
              {phase.label}
            </button>
            {idx < PHASES.length - 1 && (
              <ChevronRight size={12} className="text-slate-700 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function KeyPointCard({ kp, idx, track }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border border-white/10 bg-slate-900/80 overflow-hidden transition-all duration-200`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${track.gradient} flex items-center justify-center text-xs text-white font-black flex-shrink-0 mt-0.5`}>
          {idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white">{kp.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{kp.body}</p>
        </div>
        <span className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      {open && kp.code && (
        <div className="border-t border-white/8 bg-slate-950/80">
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{kp.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function HintPanel({ hints }) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div className="space-y-2">
      {hints.slice(0, revealed + 1).map((hint, i) => (
        <div key={i} className="callout-info flex items-start gap-2">
          <Lightbulb size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="text-xs">{hint}</span>
        </div>
      ))}
      {revealed < hints.length - 1 && (
        <button
          onClick={() => setRevealed(r => r + 1)}
          className="btn-secondary text-xs py-1.5"
        >
          <Lightbulb size={12} /> Hint {revealed + 2}/{hints.length}
        </button>
      )}
    </div>
  );
}

function OutputPanel({ output, language }) {
  if (!output) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/90 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8 bg-slate-900/60">
        <Terminal size={12} className="text-slate-500" />
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Output</span>
      </div>
      <div className="p-3 space-y-1 max-h-48 overflow-y-auto">
        {output.map((line, i) => {
          const [type, text] = Array.isArray(line) ? line : ['log', line];
          return (
            <div key={i} className={`font-mono text-xs leading-relaxed ${
              type === 'error' ? 'text-red-400' :
              type === 'warn'  ? 'text-amber-400' :
              'text-emerald-300'
            }`}>
              {type === 'error' ? '✗ ' : '› '}{text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckPanel({ results }) {
  if (!results) return null;
  const allPass = results.every(r => r.passed);
  return (
    <div className={`rounded-lg border overflow-hidden ${allPass ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-slate-950/60'}`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/8">
        <Shield size={12} className={allPass ? 'text-emerald-400' : 'text-slate-500'} />
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Code Check — {results.filter(r => r.passed).length}/{results.length} passed
        </span>
      </div>
      <div className="p-3 space-y-1.5">
        {results.map((r, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs ${r.passed ? 'text-emerald-400' : 'text-slate-500'}`}>
            {r.passed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
            {r.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Fallback theory parser (from existing lesson.theory) ──────
function TheoryContent({ content }) {
  if (!content) return <p className="text-slate-500 text-sm">No content yet.</p>;
  const lines = content.split('\n');
  const elements = [];
  let inCode = false, codeLines = [], codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre key={`c${i}`} className="code-block text-xs overflow-x-auto my-3">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        inCode = false; codeLines = []; codeLang = '';
      } else { inCode = true; codeLang = line.slice(3).trim(); }
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-base font-bold text-white mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-sm font-semibold text-blue-400 mt-3 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 text-xs text-slate-300 ml-2 mb-1">
          <ChevronRight size={11} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.+?)`/g, '<code class="bg-slate-700 text-blue-300 px-1 rounded text-xs font-mono">$1</code>') }} />
        </div>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="text-xs text-slate-300 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.+?)`/g, '<code class="bg-slate-700 text-blue-300 px-1 rounded text-xs font-mono">$1</code>') }}
        />
      );
    }
  });
  return <div>{elements}</div>;
}

// ── Main LessonView ───────────────────────────────────────────
export default function LessonView() {
  const { trackId, lessonId } = useParams();
  const { isLessonComplete, markLessonComplete } = useProgress();

  const track   = getTrack(trackId);
  const lesson  = getLesson(trackId, lessonId);
  const exercise = hasExercise(trackId, lessonId) ? getExercise(trackId, lessonId) : null;

  // Phase navigation
  const [phase, setPhase]               = useState('briefing');
  const [unlockedUpTo, setUnlockedUpTo] = useState(0);

  // Editor state
  const [codeValue, setCodeValue]       = useState('');
  const [chalValue, setChalValue]       = useState('');
  const [output, setOutput]             = useState(null);
  const [checkResults, setCheckResults] = useState(null);
  const [running, setRunning]           = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Challenge state
  const [chalOutput, setChalOutput]     = useState(null);
  const [chalCheck, setChalCheck]       = useState(null);
  const [chalRunning, setChalRunning]   = useState(false);

  // Legacy tab fallback state
  const [copied, setCopied]             = useState(false);

  const done = isLessonComplete(trackId, lessonId);

  // Init editor values when exercise loads
  useEffect(() => {
    if (exercise) {
      setCodeValue(exercise.exercise.starterCode ?? '');
      setChalValue(exercise.challenge?.starterCode ?? '');
    }
    setOutput(null);
    setCheckResults(null);
    setShowSolution(false);
  }, [trackId, lessonId, exercise]);

  if (!track || !lesson) {
    return (
      <div className="text-center py-20">
        <Terminal size={32} className="text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 mb-4">Mission not found.</p>
        <Link to="/courses" className="btn-primary inline-flex">← Back to Mission Control</Link>
      </div>
    );
  }

  const allLessons = track.lessons;
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];

  const phaseIdx = PHASES.findIndex(p => p.id === phase);

  function advancePhase() {
    const next = PHASES[phaseIdx + 1];
    if (next) {
      setPhase(next.id);
      setUnlockedUpTo(u => Math.max(u, phaseIdx + 1));
    }
  }

  function goPhase(id) {
    const idx = PHASES.findIndex(p => p.id === id);
    if (idx <= unlockedUpTo) setPhase(id);
  }

  // ── Run JS code ──────────────────────────────────────────────
  async function handleRunCode() {
    setRunning(true);
    setOutput(null);
    setCheckResults(null);
    const result = await runJavaScript(codeValue);
    setOutput(result.logs);
    setRunning(false);
  }

  // ── Check C# code ────────────────────────────────────────────
  function handleCheckCode() {
    if (!exercise?.exercise?.patterns) return;
    const results = checkCSharp(codeValue, exercise.exercise.patterns);
    setCheckResults(results);
    const allPass = results.every(r => r.passed);
    if (allPass) {
      setTimeout(() => setOutput([['log', '✓ All checks passed!']]), 200);
    }
  }

  async function handleRunChallenge() {
    setChalRunning(true);
    setChalOutput(null);
    setChalCheck(null);
    if (exercise.exercise.language === 'javascript') {
      const result = await runJavaScript(chalValue);
      setChalOutput(result.logs);
    } else {
      const results = checkCSharp(chalValue, exercise.challenge?.patterns ?? exercise.exercise.patterns);
      setChalCheck(results);
    }
    setChalRunning(false);
  }

  function handleComplete() {
    markLessonComplete(trackId, lessonId);
    setPhase('complete');
    setUnlockedUpTo(4);
  }

  const lang        = exercise?.exercise?.language ?? 'csharp';
  const isJS        = lang === 'javascript';
  const monacoLang  = isJS ? 'javascript' : 'csharp';

  // Track color helpers
  const trackGrad = track.gradient;

  // ════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* Breadcrumb nav */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/courses" className="hover:text-slate-300 transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Mission Control
        </Link>
        <ChevronRight size={12} className="text-slate-700" />
        <Link to={`/courses?track=${trackId}`} className="hover:text-slate-300 transition-colors">{track.title}</Link>
        <ChevronRight size={12} className="text-slate-700" />
        <span className="text-slate-300 truncate">{lesson.title}</span>
      </div>

      {/* Mission header */}
      <div className="terminal-panel">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${trackGrad} flex items-center justify-center text-lg flex-shrink-0`}>
            {track.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="terminal-header text-blue-400">◈ MISSION</span>
              <span className="terminal-header text-slate-600">|</span>
              <span className="terminal-header text-slate-400">{track.title?.toUpperCase()}</span>
              <span className="terminal-header text-slate-600">|</span>
              <span className="terminal-header text-slate-500">{lesson.difficulty?.toUpperCase() ?? 'INTERMEDIATE'}</span>
              {exercise && (
                <>
                  <span className="terminal-header text-slate-600">|</span>
                  <span className="terminal-header text-violet-400">LIVE CODING</span>
                </>
              )}
              {done && <span className="terminal-header text-emerald-400">| ✓ COMPLETE</span>}
            </div>
            <h1 className="text-xl font-black text-white leading-tight">{lesson.title}</h1>
          </div>
          {done && (
            <span className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex-shrink-0">
              <CheckCircle2 size={11} /> Complete
            </span>
          )}
        </div>
        {/* Track progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <span className="terminal-header text-slate-600 whitespace-nowrap">{currentIdx + 1}/{allLessons.length}</span>
          <div className="threat-bar-wrap flex-1">
            <div className={`h-full rounded-full bg-gradient-to-r ${trackGrad} transition-all duration-500`}
              style={{ width: `${((currentIdx + 1) / allLessons.length) * 100}%` }} />
          </div>
          <span className="terminal-header text-slate-600 whitespace-nowrap">track</span>
        </div>
      </div>

      {/* Phase breadcrumb */}
      <PhaseBreadcrumb
        currentPhase={phase}
        onNavigate={goPhase}
        unlockedUpTo={unlockedUpTo}
      />

      {/* ── Phase content ─────────────────────────────────────── */}
      <div className="animate-fadeIn min-h-[400px]">

        {/* ═══════ PHASE 0: BRIEFING ═══════ */}
        {phase === 'briefing' && (
          <div className="space-y-4">
            {exercise ? (
              <>
                {/* Scenario card */}
                <div className="card border border-rose-500/30 bg-rose-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="terminal-header text-rose-400">◈ {exercise.briefing.tag}</span>
                  </div>
                  <h2 className="text-xl font-black text-white mb-3 leading-tight">
                    {exercise.briefing.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{exercise.briefing.scenario}</p>
                  <div className="callout-danger mb-3">
                    <span className="font-semibold text-rose-300">THE PROBLEM: </span>
                    {exercise.briefing.problem}
                  </div>
                  <div className="callout-warn">
                    <span className="font-semibold text-amber-300">STAKES: </span>
                    {exercise.briefing.stakes}
                  </div>
                </div>

                {/* Mission objective */}
                <div className="card border border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-start gap-3">
                    <Flag size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="terminal-header text-blue-400 mb-1">YOUR MISSION</div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {exercise.exercise.description}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Fallback: use generated scenario from lesson data */
              <div className="space-y-4">
                <div className="card border border-blue-500/20 bg-blue-500/5">
                  <div className="terminal-header text-blue-400 mb-2">◈ MISSION BRIEF</div>
                  <h2 className="text-lg font-black text-white mb-2">{lesson.title}</h2>
                  {lesson.theory && <TheoryContent content={lesson.theory.slice(0, 800)} />}
                </div>
                {lesson.keyPoints?.length > 0 && (
                  <div className="card">
                    <div className="terminal-header text-slate-400 mb-3">◈ KEY INTEL</div>
                    <ul className="space-y-2">
                      {lesson.keyPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-white/6">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${trackGrad} flex items-center justify-center text-xs text-white font-black flex-shrink-0 mt-0.5`}>
                            {i + 1}
                          </div>
                          <p className="text-sm text-slate-300">{pt}</p>
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button onClick={advancePhase} className="btn-primary w-full justify-center text-sm">
              {exercise ? 'Accept Mission → Study the Concepts' : 'Start Learning'} <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ═══════ PHASE 1: CONCEPT ═══════ */}
        {phase === 'concept' && (
          <div className="space-y-4">
            <div className="callout-info">
              <span className="font-semibold text-blue-300">STUDY THESE CONCEPTS: </span>
              Read each one. Click to see the code example. You'll need these in the next phase.
            </div>

            <div className="space-y-3">
              {exercise?.keyPoints.map((kp, i) => (
                <KeyPointCard key={kp.id} kp={kp} idx={i} track={track} />
              )) ?? (lesson.keyPoints?.length > 0 ? (
                lesson.keyPoints.map((pt, i) => (
                  <div key={i} className="card">
                    <div className={`flex items-start gap-3`}>
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${trackGrad} flex items-center justify-center text-xs text-white font-black flex-shrink-0`}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{pt}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card">
                  <p className="text-sm text-slate-400">Study the theory in the Briefing phase, then proceed to code.</p>
                </div>
              ))}
            </div>

            {lesson.codeExample && !exercise && (
              <div className="card">
                <div className="terminal-header text-cyan-400 mb-3">◈ CODE EXAMPLE</div>
                <pre className="code-block text-xs overflow-x-auto">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => goPhase('briefing')} className="btn-secondary text-sm">
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={advancePhase} className="btn-primary flex-1 justify-center text-sm">
                {exercise ? "I'm Ready to Code" : 'Continue'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ═══════ PHASE 2: CODE ═══════ */}
        {phase === 'code' && (
          <div className="space-y-4">
            {exercise ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

                {/* Editor column */}
                <div className="space-y-3">
                  {/* Language badge + run/check */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`badge text-xs ${isJS ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border-violet-500/30'}`}>
                        {isJS ? 'JavaScript' : 'C#'}
                      </span>
                      <span className="text-xs text-slate-500">Monaco Editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCodeValue(exercise.exercise.starterCode)}
                        className="btn-secondary text-xs py-1.5"
                        title="Reset to starter code"
                      >
                        <RotateCcw size={11} /> Reset
                      </button>
                      <button
                        onClick={() => setShowSolution(s => !s)}
                        className="btn-secondary text-xs py-1.5"
                      >
                        {showSolution ? <EyeOff size={11} /> : <Eye size={11} />}
                        {showSolution ? 'Hide' : 'Solution'}
                      </button>
                      {isJS ? (
                        <button onClick={handleRunCode} disabled={running} className="btn-primary text-xs py-1.5">
                          <Play size={11} /> {running ? 'Running…' : 'Run Code'}
                        </button>
                      ) : (
                        <button onClick={handleCheckCode} className="btn-primary text-xs py-1.5">
                          <CheckCircle2 size={11} /> Check Code
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Monaco editor */}
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/40"
                    style={{ height: '320px' }}>
                    <Editor
                      height="100%"
                      language={monacoLang}
                      value={showSolution ? exercise.exercise.solution : codeValue}
                      onChange={v => !showSolution && setCodeValue(v ?? '')}
                      theme="vs-dark"
                      options={{
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineNumbers: 'on',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        readOnly: showSolution,
                        padding: { top: 12, bottom: 12 },
                        scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                        overviewRulerLanes: 0,
                      }}
                      loading={
                        <div className="flex items-center justify-center h-full bg-slate-950 text-slate-500 text-sm">
                          Loading editor…
                        </div>
                      }
                    />
                  </div>

                  {showSolution && (
                    <div className="callout-warn text-xs">
                      Solution revealed. Study it, then hide it and write it from scratch.
                    </div>
                  )}

                  {/* Output / check panel */}
                  <OutputPanel output={output} language={lang} />
                  <CheckPanel results={checkResults} />
                </div>

                {/* Sidebar */}
                <div className="space-y-3">
                  {/* Task description */}
                  <div className="card">
                    <div className="terminal-header text-amber-400 mb-2">◈ TASK</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{exercise.exercise.description}</p>
                  </div>

                  {/* Hints */}
                  {exercise.exercise.hints?.length > 0 && (
                    <div className="card">
                      <div className="terminal-header text-amber-400 mb-2">◈ HINTS</div>
                      <HintPanel hints={exercise.exercise.hints} />
                    </div>
                  )}

                  {/* Proceed button */}
                  <button
                    onClick={advancePhase}
                    className="btn-primary w-full justify-center text-xs"
                  >
                    Move to Challenge <ArrowRight size={12} />
                  </button>
                  <p className="text-[10px] text-slate-600 text-center">
                    You can always come back to fix this code
                  </p>
                </div>
              </div>
            ) : (
              /* No exercise — show code example */
              <div className="space-y-4">
                <div className="callout-info">
                  <span className="font-semibold text-blue-300">NO LIVE EXERCISE YET: </span>
                  Study the code example below, then proceed to the challenge phase.
                </div>
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="terminal-header text-cyan-400">◈ CODE EXAMPLE</div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(lesson.codeExample ?? ''); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="btn-secondary text-xs py-1.5"
                    >
                      <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-block text-xs overflow-x-auto">
                    <code>{lesson.codeExample ?? 'No code example for this lesson.'}</code>
                  </pre>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => goPhase('concept')} className="btn-secondary text-sm">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={advancePhase} className="btn-primary flex-1 justify-center text-sm">
                    Continue to Challenge <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ PHASE 3: CHALLENGE ═══════ */}
        {phase === 'challenge' && (
          <div className="space-y-4">
            {exercise?.challenge ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                <div className="space-y-3">
                  <div className="card border border-amber-500/30 bg-amber-500/5">
                    <div className="terminal-header text-amber-400 mb-1">◈ CHALLENGE — HARDER VARIANT</div>
                    <p className="text-sm text-white font-semibold">{exercise.challenge.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`badge text-xs ${isJS ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border-violet-500/30'}`}>
                        {isJS ? 'JavaScript' : 'C#'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChalValue(exercise.challenge.starterCode ?? '')}
                        className="btn-secondary text-xs py-1.5"
                      >
                        <RotateCcw size={11} /> Reset
                      </button>
                      {isJS ? (
                        <button onClick={handleRunChallenge} disabled={chalRunning} className="btn-primary text-xs py-1.5">
                          <Play size={11} /> {chalRunning ? 'Running…' : 'Run'}
                        </button>
                      ) : (
                        <button onClick={handleRunChallenge} className="btn-primary text-xs py-1.5">
                          <CheckCircle2 size={11} /> Check
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/40"
                    style={{ height: '300px' }}>
                    <Editor
                      height="100%"
                      language={monacoLang}
                      value={chalValue}
                      onChange={v => setChalValue(v ?? '')}
                      theme="vs-dark"
                      options={{
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineNumbers: 'on',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                      }}
                      loading={
                        <div className="flex items-center justify-center h-full bg-slate-950 text-slate-500 text-sm">
                          Loading editor…
                        </div>
                      }
                    />
                  </div>

                  <OutputPanel output={chalOutput} />
                  <CheckPanel results={chalCheck} />
                </div>

                <div className="space-y-3">
                  {exercise.challenge.hints?.length > 0 && (
                    <div className="card">
                      <div className="terminal-header text-amber-400 mb-2">◈ HINTS</div>
                      <HintPanel hints={exercise.challenge.hints} />
                    </div>
                  )}
                  <div className="card border border-emerald-500/20 bg-emerald-500/5">
                    <p className="text-xs text-slate-300 mb-3">
                      Finished the challenge? Claim your XP and complete this mission.
                    </p>
                    <button onClick={handleComplete} className="btn-success w-full justify-center text-xs">
                      <Trophy size={13} /> Complete Mission — +50 XP
                    </button>
                  </div>
                  <button
                    onClick={() => goPhase('code')}
                    className="btn-secondary text-xs w-full justify-center"
                  >
                    <ArrowLeft size={12} /> Back to Code Phase
                  </button>
                </div>
              </div>
            ) : (
              /* No challenge — completion screen */
              <div className="space-y-4">
                <div className="callout-success">
                  <span className="font-semibold text-emerald-300">MISSION READY: </span>
                  You've reviewed the concept and code. Mark this mission complete to earn your XP.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => goPhase('code')} className="btn-secondary text-sm">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={handleComplete} className="btn-success flex-1 justify-center text-sm">
                    <Trophy size={14} /> Complete Mission — +50 XP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ PHASE 4: COMPLETE ═══════ */}
        {phase === 'complete' && (
          <div className="space-y-4">
            <div className={`card border bg-gradient-to-br ${trackGrad}/10 ${track.border} text-center py-8`}>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${trackGrad} flex items-center justify-center text-3xl mx-auto mb-4`}>
                🎯
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Mission Complete!</h2>
              <p className="text-slate-400 text-sm mb-4">{lesson.title}</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                  <Zap size={20} /> +50 XP
                </div>
                <div className="badge bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
                  <CheckCircle2 size={13} /> Lesson Completed
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="card text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-xs text-slate-400">Concept studied</div>
              </div>
              {exercise && (
                <>
                  <div className="card text-center">
                    <div className="text-2xl mb-1">💻</div>
                    <div className="text-xs text-slate-400">Code written</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs text-slate-400">Challenge tackled</div>
                  </div>
                </>
              )}
            </div>

            {/* Spaced review prompt */}
            <div className="card border border-violet-500/20 bg-violet-500/5">
              <div className="terminal-header text-violet-400 mb-2">◈ DEBRIEF QUESTION</div>
              <p className="text-sm text-slate-300">
                Without looking at the code — explain in one sentence what you just learned and when you'd use it in production.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {prevLesson && (
                <Link to={`/courses/${trackId}/lesson/${prevLesson.id}`} className="btn-secondary flex-1 justify-center text-sm">
                  <ArrowLeft size={14} /> {prevLesson.title}
                </Link>
              )}
              {nextLesson ? (
                <Link to={`/courses/${trackId}/lesson/${nextLesson.id}`} className="btn-primary flex-1 justify-center text-sm">
                  Next: {nextLesson.title} <ArrowRight size={14} />
                </Link>
              ) : (
                <Link to={`/quiz/${trackId}`} className="btn-success flex-1 justify-center text-sm">
                  <Trophy size={14} /> Take Track Quiz
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav — always shown for quick jumps */}
      {phase !== 'complete' && (
        <div className="flex gap-3 pt-2 border-t border-white/6">
          {prevLesson && (
            <Link to={`/courses/${trackId}/lesson/${prevLesson.id}`} className="btn-secondary text-xs">
              <ArrowLeft size={12} /> Prev
            </Link>
          )}
          <div className="flex-1" />
          {!done && phase === 'challenge' && !exercise && (
            <button onClick={handleComplete} className="btn-success text-xs">
              ✓ Mark Complete
            </button>
          )}
          {nextLesson && (
            <Link to={`/courses/${trackId}/lesson/${nextLesson.id}`} className="btn-secondary text-xs">
              Skip <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
