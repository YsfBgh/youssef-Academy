import React, { useState } from 'react';
import { DEBUG_SCENARIOS } from '../data/engineeringLabs';
import { useProgress } from '../utils/ProgressContext';

export default function DebuggingLab() {
  const [selectedId, setSelectedId] = useState(DEBUG_SCENARIOS[0]?.id);
  const [hypothesis, setHypothesis] = useState('');
  const [revealed, setRevealed] = useState(false);
  const { markDebugScenarioComplete, isDebugScenarioComplete } = useProgress();

  const selected = DEBUG_SCENARIOS.find(s => s.id === selectedId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="section-title">Debugging Lab</h1>
        <p className="section-subtitle">
          Practice evidence-driven debugging with symptoms, logs, hypotheses, root cause, and fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="space-y-3">
          {DEBUG_SCENARIOS.map(item => {
            const active = selectedId === item.id;
            const done = isDebugScenarioComplete(item.id);
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedId(item.id); setHypothesis(''); setRevealed(false); }}
                className={`card w-full text-left ${active ? 'border-blue-500/50 bg-blue-600/10' : ''} ${done ? 'border-emerald-500/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-slate-700 text-slate-300">{item.level}</span>
                  {done && <span className="text-emerald-400 text-xs">Done</span>}
                </div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-xs text-slate-500 mt-1">{item.symptoms[0]}</div>
              </button>
            );
          })}
        </section>

        <section className="lg:col-span-2 space-y-4">
          <div className="card border-red-500/30 bg-red-600/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <div className="text-sm text-slate-400">Incident severity: training scenario</div>
              </div>
              <span className="badge bg-amber-500/20 text-amber-300">+90 XP</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
              {selected.symptoms.map(symptom => (
                <div key={symptom} className="p-3 bg-slate-900/60 rounded-lg border border-slate-700 text-sm text-slate-300">
                  {symptom}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Logs / Evidence</div>
            <pre className="code-block overflow-x-auto">{selected.logs}</pre>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-bold text-white mb-2">Your Hypothesis</h3>
              <textarea
                className="input min-h-[180px] resize-y"
                value={hypothesis}
                onChange={e => setHypothesis(e.target.value)}
                placeholder="Write: what changed, what evidence supports it, what you would check next, and the likely fix."
              />
              <div className="flex gap-2 mt-3">
                <button className="btn-secondary text-sm" onClick={() => setRevealed(true)}>Reveal Runbook</button>
                {!isDebugScenarioComplete(selected.id) && (
                  <button className="btn-success text-sm" onClick={() => markDebugScenarioComplete(selected.id)}>Mark Complete</button>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-white mb-2">Runbook</h3>
              {!revealed ? (
                <div className="text-sm text-slate-500">Reveal after writing your hypothesis.</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">Investigation Steps</div>
                    <ol className="space-y-2">
                      {selected.investigation.map((step, index) => (
                        <li key={step} className="flex gap-2 text-sm text-slate-300">
                          <span className="text-slate-500">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="text-xs uppercase tracking-wider text-red-300 font-semibold mb-1">Root Cause</div>
                    <div className="text-sm text-slate-200">{selected.rootCause}</div>
                  </div>
                  <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                    <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">Fix</div>
                    <div className="text-sm text-slate-200">{selected.fix}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
