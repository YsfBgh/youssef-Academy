import React, { useState } from 'react';
import { CODE_REVIEW_CASES } from '../data/engineeringLabs';
import { useProgress } from '../utils/ProgressContext';

export default function CodeReviewLab() {
  const [selectedId, setSelectedId] = useState(CODE_REVIEW_CASES[0]?.id);
  const [notes, setNotes] = useState('');
  const [revealed, setRevealed] = useState(false);
  const { markCodeReviewComplete, isCodeReviewComplete } = useProgress();

  const selected = CODE_REVIEW_CASES.find(c => c.id === selectedId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="section-title">Code Review Lab</h1>
        <p className="section-subtitle">
          Practice senior-level PR review: bugs, risk, design, security, naming, and missing tests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <aside className="space-y-3">
          {CODE_REVIEW_CASES.map(item => {
            const active = item.id === selectedId;
            const done = isCodeReviewComplete(item.id);
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedId(item.id); setNotes(''); setRevealed(false); }}
                className={`card w-full text-left ${active ? 'border-blue-500/50 bg-blue-600/10' : ''} ${done ? 'border-emerald-500/30' : ''}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="badge bg-slate-700 text-slate-300">{item.level}</span>
                  {done && <span className="text-emerald-400 text-xs">Done</span>}
                </div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-xs text-slate-500 mt-1">{item.focus.join(', ')}</div>
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-3 space-y-4">
          <section className="card border-blue-500/30">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <p className="text-sm text-slate-400">{selected.summary}</p>
              </div>
              <span className="badge bg-amber-500/20 text-amber-300">+80 XP</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {selected.focus.map(tag => <span key={tag} className="badge bg-slate-700/60 text-slate-300">{tag}</span>)}
            </div>
            <pre className="code-block overflow-x-auto">{selected.code}</pre>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-bold text-white mb-2">Your Review Notes</h3>
              <textarea
                className="input min-h-[220px] font-mono text-sm resize-y"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Write what you would leave on the PR: blockers, suggestions, tests, and risk level."
              />
              <div className="flex gap-2 mt-3">
                <button className="btn-secondary text-sm" onClick={() => setRevealed(true)}>Reveal Senior Review</button>
                {!isCodeReviewComplete(selected.id) && (
                  <button className="btn-success text-sm" onClick={() => markCodeReviewComplete(selected.id)}>
                    Mark Complete
                  </button>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-white mb-2">Senior Rubric</h3>
              {!revealed ? (
                <div className="text-sm text-slate-500">
                  Write your review first. Then reveal the model findings and compare your notes.
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">Expected Findings</div>
                    <div className="space-y-2">
                      {selected.findings.map(finding => (
                        <div key={finding} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">Senior Comment</div>
                    <div className="text-sm text-slate-200">{selected.seniorComment}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
