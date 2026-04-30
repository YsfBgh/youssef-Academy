import React, { useState } from 'react';
import { ARCHITECTURE_SCENARIOS } from '../data/engineeringLabs';
import { useProgress } from '../utils/ProgressContext';

export default function ArchitectureLab() {
  const [selectedId, setSelectedId] = useState(ARCHITECTURE_SCENARIOS[0]?.id);
  const [design, setDesign] = useState('');
  const [revealed, setRevealed] = useState(false);
  const { markArchitectureScenarioComplete, isArchitectureScenarioComplete } = useProgress();

  const selected = ARCHITECTURE_SCENARIOS.find(s => s.id === selectedId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="section-title">Architecture Lab</h1>
        <p className="section-subtitle">
          Practice system design like an engineer: requirements, boundaries, data, risk, and tradeoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <aside className="space-y-3">
          {ARCHITECTURE_SCENARIOS.map(item => {
            const active = item.id === selectedId;
            const done = isArchitectureScenarioComplete(item.id);
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedId(item.id); setDesign(''); setRevealed(false); }}
                className={`card w-full text-left ${active ? 'border-blue-500/50 bg-blue-600/10' : ''} ${done ? 'border-emerald-500/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-slate-700 text-slate-300">{item.level}</span>
                  {done && <span className="text-emerald-400 text-xs">Done</span>}
                </div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-xs text-slate-500 mt-1">{item.rubric.slice(0, 2).join(', ')}</div>
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-3 space-y-4">
          <section className="card border-violet-500/30">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <div className="text-sm text-slate-400">Design level: {selected.level}</div>
              </div>
              <span className="badge bg-amber-500/20 text-amber-300">+120 XP</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selected.requirements.map(req => (
                <div key={req} className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300">
                  {req}
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-bold text-white mb-2">Your Architecture Notes</h3>
              <textarea
                className="input min-h-[320px] resize-y font-mono text-sm"
                value={design}
                onChange={e => setDesign(e.target.value)}
                placeholder="Cover: core entities, API boundaries, database, auth, cache/queue needs, failure modes, deployment, and tradeoffs."
              />
              <div className="flex gap-2 mt-3">
                <button className="btn-secondary text-sm" onClick={() => setRevealed(true)}>Reveal Senior Design</button>
                {!isArchitectureScenarioComplete(selected.id) && (
                  <button className="btn-success text-sm" onClick={() => markArchitectureScenarioComplete(selected.id)}>Mark Complete</button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="card">
                <h3 className="font-bold text-white mb-3">Rubric</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.rubric.map(item => (
                    <span key={item} className="badge bg-blue-500/20 text-blue-300">{item}</span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-bold text-white mb-3">Senior Design Review</h3>
                {!revealed ? (
                  <div className="text-sm text-slate-500">Write your design first, then reveal the tradeoffs.</div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">Good Decisions</div>
                      <div className="space-y-2">
                        {selected.decisions.map(decision => (
                          <div key={decision} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span>{decision}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-red-300 font-semibold mb-2">Risks To Call Out</div>
                      <div className="space-y-2">
                        {selected.risks.map(risk => (
                          <div key={risk} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-red-300 mt-0.5">!</span>
                            <span>{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
