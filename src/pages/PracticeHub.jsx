import React, { useState, useCallback } from 'react';
import { EXERCISES, EXERCISE_TOPICS } from '../data/practiceExercises';
import { useProgress } from '../utils/ProgressContext';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function scrollMainToTop() {
  // The scrollable element is <main> in Layout — find it and scroll to top
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' });
}

export default function PracticeHub() {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [activeExercise, setActiveExercise] = useState(null);

  const openExercise = useCallback((ex) => {
    setActiveExercise(ex);
    scrollMainToTop();
  }, []);

  const closeExercise = useCallback(() => {
    setActiveExercise(null);
    scrollMainToTop();
  }, []);

  const filtered = EXERCISES.filter(e => {
    const matchTopic = selectedTopic === 'all' || e.topic === selectedTopic;
    const matchDiff  = selectedDifficulty === 'All' || e.difficulty === selectedDifficulty;
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.tags?.some(t => t.includes(search.toLowerCase()));
    return matchTopic && matchDiff && matchSearch;
  });

  if (activeExercise) {
    return (
      <ExerciseDetail
        exercise={activeExercise}
        onBack={closeExercise}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">Practice Hub</h1>
        <p className="section-subtitle">
          Hands-on exercises with hints, starter code, full solutions, and explanations.
          Each exercise targets a real skill gap and builds toward production-level code.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Exercises" value={EXERCISES.length} color="blue" />
        <StatCard label="Topics" value={EXERCISE_TOPICS.length} color="emerald" />
        <StatCard
          label="Beginner"
          value={EXERCISES.filter(e => e.difficulty === 'Beginner').length}
          color="green"
        />
        <StatCard
          label="Intermediate+"
          value={EXERCISES.filter(e => e.difficulty !== 'Beginner').length}
          color="amber"
        />
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            className="input flex-1 min-w-0"
            placeholder="Search by title or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedDifficulty === d
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Topic filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              selectedTopic === 'all'
                ? 'border-slate-400 bg-slate-700 text-white'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            All Topics
          </button>
          {EXERCISE_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                selectedTopic === topic.id
                  ? `${topic.badge} border-current`
                  : 'border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">{filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Exercise grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 mb-2">No exercises match your filters.</p>
          <button
            onClick={() => { setSelectedTopic('all'); setSelectedDifficulty('All'); setSearch(''); }}
            className="btn-secondary text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onOpen={() => openExercise(exercise)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise, onOpen }) {
  const topic = EXERCISE_TOPICS.find(t => t.id === exercise.topic);
  const diffColors = {
    Beginner:     'bg-emerald-500/20 text-emerald-400',
    Intermediate: 'bg-amber-500/20 text-amber-400',
    Advanced:     'bg-rose-500/20 text-rose-400',
  };

  return (
    <button
      onClick={onOpen}
      className="card card-hover text-left w-full space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{topic?.icon ?? '📝'}</span>
          <span className={`badge text-xs ${topic?.badge ?? 'bg-slate-700 text-slate-300'}`}>
            {topic?.label ?? exercise.topic}
          </span>
        </div>
        <span className={`badge text-xs ${diffColors[exercise.difficulty] ?? diffColors.Beginner}`}>
          {exercise.difficulty}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-white">{exercise.title}</h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">{exercise.description}</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-wrap gap-1">
          {exercise.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-amber-400 font-semibold shrink-0">+{exercise.xpReward} XP</span>
      </div>
    </button>
  );
}

function ExerciseDetail({ exercise, onBack }) {
  const [tab, setTab] = useState('problem');
  const [showHint, setShowHint] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const { markChallengeComplete, isChallengeComplete } = useProgress();

  const topic = EXERCISE_TOPICS.find(t => t.id === exercise.topic);
  const done = isChallengeComplete(exercise.id);

  const diffColors = {
    Beginner:     'text-emerald-400',
    Intermediate: 'text-amber-400',
    Advanced:     'text-rose-400',
  };

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(''), 2000);
  }

  const TABS = [
    { id: 'problem', label: 'Problem' },
    { id: 'hints', label: `Hints (${exercise.hints?.length ?? 0})` },
    { id: 'starter', label: 'Starter Code' },
    { id: 'solution', label: 'Solution' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-slate-300 transition-colors">
          Practice Hub
        </button>
        <span>/</span>
        <span className="text-slate-300 truncate">{exercise.title}</span>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{topic?.icon ?? '📝'}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{exercise.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`badge text-xs ${topic?.badge ?? ''}`}>{topic?.label}</span>
                <span className={`text-sm font-medium ${diffColors[exercise.difficulty]}`}>
                  {exercise.difficulty}
                </span>
                <span className="text-xs text-slate-500">{exercise.subtopic}</span>
                {done && <span className="badge bg-emerald-500/20 text-emerald-400">Completed</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-amber-400">+{exercise.xpReward} XP</span>
            {!done && (
              <button
                onClick={() => markChallengeComplete(exercise.id)}
                className="btn-success text-sm"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {exercise.tags?.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
              tab === t.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tab === 'problem' && (
          <div className="space-y-4">
            <div className="card space-y-3">
              <h3 className="font-bold text-white">Problem Statement</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {exercise.description}
              </p>
            </div>

            <div className="card space-y-3">
              <h3 className="font-bold text-white">Objective</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{exercise.objective}</p>
            </div>

            {exercise.expectedOutput && (
              <div className="card space-y-3">
                <h3 className="font-bold text-white">Expected Output</h3>
                <pre className="code-block text-sm overflow-x-auto whitespace-pre-wrap">
                  {exercise.expectedOutput}
                </pre>
              </div>
            )}

            {exercise.commonMistakes?.length > 0 && (
              <div className="card border border-red-500/20 bg-red-500/5 space-y-3">
                <h3 className="font-bold text-red-300">Common Mistakes to Avoid</h3>
                <ul className="space-y-2">
                  {exercise.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'hints' && (
          <div className="card space-y-4">
            <h3 className="font-bold text-white">Progressive Hints</h3>
            <p className="text-sm text-slate-400">
              Try to solve the problem first. Reveal hints one at a time only when stuck.
            </p>
            <div className="space-y-3">
              {exercise.hints?.map((hint, i) => (
                <div key={i}>
                  {i < showHint ? (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-300">{hint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHint(i + 1)}
                      className="w-full p-3 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-amber-500/40 hover:text-slate-300 transition-all text-left"
                    >
                      Hint {i + 1} — click to reveal
                    </button>
                  )}
                </div>
              ))}
            </div>

            {showHint === exercise.hints?.length && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-300">
                You have revealed all hints. Try to code the solution now before looking at it.
              </div>
            )}
          </div>
        )}

        {tab === 'starter' && (
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Starter Code</h3>
              <button
                onClick={() => copy(exercise.starterCode ?? '', 'starter')}
                className="btn-secondary text-xs"
              >
                {copiedCode === 'starter' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="code-block text-sm overflow-x-auto">
              <code>{exercise.starterCode}</code>
            </pre>
            <p className="text-xs text-slate-500">
              Copy this into your editor. Do not look at the solution tab until you have made a genuine attempt.
            </p>
          </div>
        )}

        {tab === 'solution' && (
          <div className="space-y-4">
            {!showSolution ? (
              <div className="card text-center py-10 space-y-4">
                <p className="text-slate-300 font-medium">Have you made a genuine attempt?</p>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Looking at solutions before trying reduces learning. At minimum use all hints first.
                </p>
                <button
                  onClick={() => setShowSolution(true)}
                  className="btn-secondary"
                >
                  Show Solution
                </button>
              </div>
            ) : (
              <>
                <div className="card space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Full Solution</h3>
                    <button
                      onClick={() => copy(exercise.solution ?? '', 'solution')}
                      className="btn-secondary text-xs"
                    >
                      {copiedCode === 'solution' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-block text-sm overflow-x-auto">
                    <code>{exercise.solution}</code>
                  </pre>
                </div>

                {exercise.explanation && (
                  <div className="card border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                    <h3 className="font-bold text-emerald-300">Explanation</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{exercise.explanation}</p>
                  </div>
                )}

                {exercise.commonMistakes?.length > 0 && (
                  <div className="card border border-red-500/20 bg-red-500/5 space-y-2">
                    <h3 className="font-bold text-red-300">Common Mistakes</h3>
                    <ul className="space-y-1.5">
                      {exercise.commonMistakes.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-red-400 shrink-0">✗</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="card text-center py-4 space-y-3">
                  <p className="text-sm text-slate-300">Done with this exercise?</p>
                  <button
                    onClick={() => markChallengeComplete(exercise.id)}
                    disabled={done}
                    className={`btn-success ${done ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {done ? 'Completed ✓' : `Complete — Earn ${exercise.xpReward} XP`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Back button */}
      <button onClick={onBack} className="btn-secondary w-fit">
        ← Back to Practice Hub
      </button>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue:    'text-blue-400 border-blue-500/30 bg-blue-500/10',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    green:   'text-green-400 border-green-500/30 bg-green-500/10',
    amber:   'text-amber-400 border-amber-500/30 bg-amber-500/10',
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color] ?? colors.blue}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide opacity-70 mt-0.5">{label}</div>
    </div>
  );
}
