import React, { useState } from 'react';
import { CHALLENGES } from '../data/challenges';
import { TRACKS } from '../data/courses';
import { useProgress } from '../utils/ProgressContext';

const DIFF_COLORS = {
  Beginner:     'bg-emerald-500/20 text-emerald-400',
  Intermediate: 'bg-amber-500/20 text-amber-400',
  Advanced:     'bg-rose-500/20 text-rose-400',
};

export default function CodeLab() {
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const [filterTrack, setFilterTrack] = useState('all');
  const { isChallengeComplete, markChallengeComplete } = useProgress();

  const filtered = filterTrack === 'all'
    ? CHALLENGES
    : CHALLENGES.filter(c => c.track === filterTrack);

  const selectChallenge = (ch) => {
    setSelected(ch);
    setCode(ch.starterCode);
    setShowSolution(false);
    setShowHints(false);
    setHintIdx(0);
  };

  const handleRevealHint = () => {
    setShowHints(true);
    setHintIdx(0);
  };

  const handleNextHint = () => {
    if (hintIdx < (selected?.hints?.length ?? 0) - 1) setHintIdx(h => h + 1);
  };

  const handleComplete = () => {
    if (selected) markChallengeComplete(selected.id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="section-title">💻 Code Lab</h1>
        <p className="section-subtitle">Practice real coding challenges across all tracks</p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Challenge List — Left Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterTrack('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filterTrack === 'all'
                  ? 'bg-slate-600 text-white border-slate-500'
                  : 'text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {TRACKS.map(t => (
              <button
                key={t.id}
                onClick={() => setFilterTrack(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  filterTrack === t.id
                    ? `${t.badge} border-current`
                    : 'text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.map(ch => {
            const done = isChallengeComplete(ch.id);
            const track = TRACKS.find(t => t.id === ch.track);
            return (
              <div
                key={ch.id}
                onClick={() => selectChallenge(ch)}
                className={`card cursor-pointer transition-all duration-150 ${
                  selected?.id === ch.id
                    ? `${track?.border ?? 'border-blue-500'} bg-blue-600/5`
                    : 'hover:border-slate-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{track?.icon ?? '💡'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm truncate">{ch.title}</h3>
                      {done && <span className="text-emerald-400 text-xs">✓</span>}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className={`badge text-xs ${DIFF_COLORS[ch.difficulty]}`}>{ch.difficulty}</span>
                      <span className="text-xs text-slate-500">⏱ {ch.timeLimit}min</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Detail — Right Panel */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {!selected ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">💻</span>
              <h3 className="text-white font-semibold mb-1">Select a Challenge</h3>
              <p className="text-slate-400 text-sm">Pick any challenge from the left to start coding</p>
            </div>
          ) : (
            <>
              {/* Challenge Info */}
              <div className="card">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-white">{selected.title}</h2>
                      <span className={`badge ${DIFF_COLORS[selected.difficulty]}`}>{selected.difficulty}</span>
                      <span className="text-xs text-slate-500">⏱ {selected.timeLimit} min</span>
                      {isChallengeComplete(selected.id) && (
                        <span className="badge bg-emerald-500/20 text-emerald-400">✓ Solved</span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm">{selected.description}</p>
                  </div>
                </div>

                {/* Concepts */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selected.concepts?.map(c => (
                    <span key={c} className="badge bg-slate-700 text-slate-300 text-xs">{c}</span>
                  ))}
                </div>

                {/* Test Cases */}
                {selected.testCases?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Cases</p>
                    {selected.testCases.map((tc, i) => (
                      <div key={i} className="flex gap-4 text-xs bg-slate-900 rounded-lg p-2">
                        <span className="text-slate-500">Input:</span>
                        <code className="text-slate-300 font-mono">{tc.input}</code>
                        <span className="text-slate-500">→</span>
                        <code className="text-emerald-400 font-mono">{tc.expected}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Code Editor */}
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-sm">Your Solution</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRevealHint}
                      className="btn-secondary text-xs py-1.5"
                    >
                      💡 Hint
                    </button>
                    <button
                      onClick={() => setShowSolution(s => !s)}
                      className="btn-secondary text-xs py-1.5"
                    >
                      {showSolution ? '🙈 Hide' : '👁 Solution'}
                    </button>
                    {!isChallengeComplete(selected.id) && (
                      <button onClick={handleComplete} className="btn-success text-xs py-1.5">
                        ✓ Mark Solved
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  className="code-editor w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 resize-none focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ minHeight: '280px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.6' }}
                />
              </div>

              {/* Hints */}
              {showHints && (
                <div className="card border-amber-500/30 bg-amber-900/10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-amber-400 uppercase">Hint {hintIdx + 1} of {selected.hints?.length}</p>
                    {hintIdx < (selected.hints?.length ?? 0) - 1 && (
                      <button onClick={handleNextHint} className="text-xs text-amber-400 hover:text-amber-300">
                        Next hint →
                      </button>
                    )}
                  </div>
                  <p className="text-amber-200 text-sm">{selected.hints?.[hintIdx]}</p>
                </div>
              )}

              {/* Solution */}
              {showSolution && (
                <div className="card border-emerald-500/30 bg-emerald-900/10 animate-fadeIn">
                  <p className="text-xs font-semibold text-emerald-400 uppercase mb-3">✓ Solution</p>
                  <pre className="code-block text-sm overflow-x-auto">
                    <code>{selected.solution}</code>
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
