import React, { useState } from 'react';
import { MISSIONS, COMPANY, MISSION_TYPE_LABELS } from '../data/enterprise';
import { useProgress } from '../utils/ProgressContext';

const PRIORITY_COLORS = {
  Critical: 'bg-red-500/20 text-red-300 border-red-500/40',
  High: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Low: 'bg-slate-600/50 text-slate-400',
};

export default function EnterpriseSim() {
  const [view, setView] = useState('board');
  const [selectedMission, setSelectedMission] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepAnswer, setStepAnswer] = useState('');
  const [stepRevealed, setStepRevealed] = useState(false);
  const [stepsDone, setStepsDone] = useState([]);
  const [filter, setFilter] = useState('all');

  const { isEnterpriseMissionComplete, markEnterpriseMissionComplete } = useProgress();

  const filtered = filter === 'all' ? MISSIONS : MISSIONS.filter(m => m.type === filter);

  function openMission(mission) {
    setSelectedMission(mission);
    setActiveStep(0);
    setStepAnswer('');
    setStepRevealed(false);
    setStepsDone([]);
    setView('mission');
  }

  function handleReveal() {
    setStepRevealed(true);
  }

  function handleNextStep() {
    const newDone = [...stepsDone, activeStep];
    setStepsDone(newDone);
    if (activeStep < selectedMission.steps.length - 1) {
      setActiveStep(activeStep + 1);
      setStepAnswer('');
      setStepRevealed(false);
    } else {
      // Mission complete
      const totalPoints = selectedMission.steps.reduce((s, st) => s + st.points, 0);
      markEnterpriseMissionComplete(selectedMission.id, selectedMission.xpReward);
      setView('complete');
    }
  }

  if (view === 'complete') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-white">Mission Complete!</h2>
        <p className="text-slate-400">
          You completed <span className="text-white font-semibold">{selectedMission.title}</span>
        </p>
        <div className="card border-emerald-500/30 bg-emerald-600/10">
          <div className="text-4xl font-bold text-emerald-400">+{selectedMission.xpReward} XP</div>
          <div className="text-slate-400 mt-1">Added to your profile</div>
        </div>
        <div className="flex gap-3 justify-center">
          <button className="btn-primary" onClick={() => setView('board')}>Back to Sprint Board</button>
          <button className="btn-secondary" onClick={() => openMission(selectedMission)}>Try Again</button>
        </div>
      </div>
    );
  }

  if (view === 'mission' && selectedMission) {
    const step = selectedMission.steps[activeStep];
    const progress = Math.round(((activeStep) / selectedMission.steps.length) * 100);
    const typeInfo = MISSION_TYPE_LABELS[selectedMission.type];

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-1.5 px-3 text-sm" onClick={() => setView('board')}>
            ← Back
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge bg-slate-700 text-slate-300">{typeInfo.icon} {typeInfo.label}</span>
              <span className={`badge border ${PRIORITY_COLORS[selectedMission.priority]}`}>{selectedMission.priority}</span>
              {isEnterpriseMissionComplete(selectedMission.id) && (
                <span className="badge bg-emerald-500/20 text-emerald-300">✓ Completed</span>
              )}
            </div>
            <h1 className="text-lg font-bold text-white mt-1">{selectedMission.title}</h1>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Step {activeStep + 1} of {selectedMission.steps.length}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Ticket description */}
          <div className="card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">📋 Ticket Description</div>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{selectedMission.description}</div>
            {selectedMission.codeSnippet && (
              <div className="mt-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Code to Review</div>
                <pre className="code-block text-xs overflow-x-auto">{selectedMission.codeSnippet}</pre>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1">
              {selectedMission.tags.map(t => (
                <span key={t} className="badge bg-slate-700/60 text-slate-400 text-xs">{t}</span>
              ))}
            </div>
          </div>

          {/* Active step */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {activeStep + 1}
                </div>
                <div className="font-semibold text-white">{step.instruction}</div>
              </div>

              <textarea
                className="input min-h-[100px] font-mono text-sm mb-3 resize-y"
                placeholder="Write your answer here..."
                value={stepAnswer}
                onChange={e => setStepAnswer(e.target.value)}
              />

              <div className="flex gap-2">
                {!stepRevealed ? (
                  <>
                    <button className="btn-secondary text-sm py-1.5" onClick={handleReveal}>
                      💡 Show Hint
                    </button>
                    <button className="btn-primary text-sm py-1.5" onClick={handleNextStep}>
                      Submit & Continue →
                    </button>
                  </>
                ) : (
                  <button className="btn-success text-sm py-1.5" onClick={handleNextStep}>
                    ✓ Got it — Next Step →
                  </button>
                )}
              </div>

              {stepRevealed && (
                <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <div className="text-xs font-semibold text-emerald-400 mb-2">✓ Model Answer ({step.points} pts)</div>
                  <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">{step.answer}</pre>
                </div>
              )}

              {!stepRevealed && (
                <div className="mt-3 p-3 bg-slate-900/40 border border-slate-700 rounded-lg">
                  <div className="text-xs font-semibold text-amber-400 mb-1">💡 Hint</div>
                  <div className="text-sm text-slate-400">{step.hint}</div>
                </div>
              )}
            </div>

            {/* Completed steps */}
            {stepsDone.length > 0 && (
              <div className="card">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Completed Steps</div>
                {stepsDone.map(idx => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-emerald-400 py-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-xs">✓</span>
                    {selectedMission.steps[idx].instruction}
                    <span className="ml-auto text-xs text-emerald-600">+{selectedMission.steps[idx].points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Board view
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="section-title">🏢 Enterprise Simulator</h1>
        <p className="section-subtitle">
          Work at {COMPANY.name} — complete real-world tickets, debug production incidents, review PRs, and ship features.
        </p>
      </div>

      {/* Company info */}
      <div className="card border-violet-500/30 bg-gradient-to-r from-violet-600/10 to-blue-600/10">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🏢</div>
          <div className="flex-1">
            <div className="font-bold text-white text-lg">{COMPANY.name}</div>
            <div className="text-sm text-slate-400 mb-3">{COMPANY.description}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge bg-blue-500/20 text-blue-300">🏃 {COMPANY.currentSprint}</span>
              <span className="text-xs text-slate-500">{COMPANY.sprintGoal}</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Team</div>
            <div className="flex flex-wrap gap-1">
              {COMPANY.team.map(m => (
                <div key={m.name} title={`${m.name} — ${m.role}`} className="text-xl cursor-default">{m.avatar}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-400">Filter:</span>
        {['all', 'ticket', 'bug', 'pr-review', 'incident', 'deployment'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`badge cursor-pointer transition-all ${
              filter === f ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {f === 'all' ? '📋 All' : `${MISSION_TYPE_LABELS[f]?.icon} ${MISSION_TYPE_LABELS[f]?.label}`}
          </button>
        ))}
      </div>

      {/* Missions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(mission => {
          const typeInfo = MISSION_TYPE_LABELS[mission.type];
          const completed = isEnterpriseMissionComplete(mission.id);

          return (
            <div
              key={mission.id}
              className={`card card-hover ${completed ? 'border-emerald-500/30' : 'border-slate-700'} cursor-pointer`}
              onClick={() => openMission(mission)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{typeInfo.icon}</span>
                  <span className={`badge border ${PRIORITY_COLORS[mission.priority]}`}>{mission.priority}</span>
                  {completed && <span className="badge bg-emerald-500/20 text-emerald-300">✓ Done</span>}
                </div>
                <span className="text-xs text-amber-400 font-semibold flex-shrink-0">+{mission.xpReward} XP</span>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{mission.title}</h3>
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {mission.description.slice(0, 120)}...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {mission.tags.slice(0, 3).map(t => (
                    <span key={t} className="badge bg-slate-700/60 text-slate-400 text-xs">{t}</span>
                  ))}
                </div>
                <div className="text-xs text-slate-500">{mission.steps.length} steps</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
