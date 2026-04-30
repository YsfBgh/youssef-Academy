import React, { useState } from 'react';
import { SIMULATIONS } from '../data/workflows';
import { TRACKS } from '../data/courses';

const DIFF_COLORS = {
  Beginner:     'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Advanced:     'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function Simulations() {
  const [selected, setSelected] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState('reading'); // reading | answering | revealed
  const [userAnswer, setUserAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const startSim = (sim) => {
    setSelected(sim);
    setStepIdx(0);
    setPhase('reading');
    setUserAnswer('');
    setRevealed(false);
    setCompletedSteps([]);
  };

  const handleReveal = () => {
    setRevealed(true);
    setPhase('revealed');
  };

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, stepIdx]);
    if (stepIdx + 1 >= (selected?.steps?.length ?? 0)) {
      setPhase('done');
    } else {
      setStepIdx(s => s + 1);
      setPhase('reading');
      setUserAnswer('');
      setRevealed(false);
    }
  };

  if (!selected) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="section-title">🎮 Simulations</h1>
          <p className="section-subtitle">
            Scenario-based learning — solve real problems you'll face at Jadev
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SIMULATIONS.map(sim => {
            const track = TRACKS.find(t => t.id === sim.track);
            return (
              <div
                key={sim.id}
                onClick={() => startSim(sim)}
                className={`card card-hover border ${DIFF_COLORS[sim.difficulty]}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{sim.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{sim.title}</h3>
                    <span className={`badge mt-1 ${DIFF_COLORS[sim.difficulty]}`}>{sim.difficulty}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-3">{sim.scenario}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{sim.steps.length} challenges</span>
                  <span>{track?.icon} {track?.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* What are simulations? */}
        <div className="card border-blue-500/20 bg-blue-900/10">
          <h3 className="font-bold text-white mb-2">🎯 How Simulations Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div>
              <div className="text-blue-400 font-semibold mb-1">1. Read the scenario</div>
              <p>You're given a realistic work situation — a bug, a design question, or a code review.</p>
            </div>
            <div>
              <div className="text-amber-400 font-semibold mb-1">2. Think & answer</div>
              <p>Write your response or reasoning. Don't rush — this simulates real problem-solving.</p>
            </div>
            <div>
              <div className="text-emerald-400 font-semibold mb-1">3. Compare & learn</div>
              <p>Reveal the expert answer and see what to improve. Repeat until it's automatic.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="card">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Simulation Complete!</h2>
          <p className="text-slate-400 mb-4">
            You completed all {selected.steps.length} challenges in <strong className="text-white">{selected.title}</strong>
          </p>
          <p className="text-slate-300 text-sm">
            The ability to think through these scenarios quickly is what separates senior devs from juniors.
            Repeat this simulation until your answers come naturally.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => startSim(selected)} className="btn-primary">
              🔄 Redo Simulation
            </button>
            <button onClick={() => setSelected(null)} className="btn-secondary">
              ← All Simulations
            </button>
          </div>
        </div>
      </div>
    );
  }

  const step = selected.steps[stepIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-200">← Back</button>
        <div className="flex-1">
          <h1 className="font-bold text-white">{selected.icon} {selected.title}</h1>
        </div>
        <span className="text-sm text-slate-400">
          Step {stepIdx + 1} / {selected.steps.length}
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div
          className="progress-fill bg-gradient-to-r from-amber-500 to-rose-500"
          style={{ width: `${(stepIdx / selected.steps.length) * 100}%` }}
        />
      </div>

      {/* Scenario Context (first step only) */}
      {stepIdx === 0 && (
        <div className="card border-amber-500/30 bg-amber-900/10 animate-fadeIn">
          <p className="text-xs font-semibold text-amber-400 uppercase mb-2">🚨 Scenario</p>
          <p className="text-amber-100 font-medium mb-3">{selected.scenario}</p>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-900/60 rounded-lg p-3 overflow-x-auto">
            {selected.context}
          </pre>
        </div>
      )}

      {/* Challenge */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
            {step.step}
          </span>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Challenge {step.step}</p>
        </div>
        <h2 className="text-white font-semibold text-base mb-4 leading-relaxed">
          {step.prompt}
        </h2>

        {/* User Input */}
        {!revealed && (
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Write your answer here... Think it through before revealing."
            className="input min-h-[120px] resize-none code-editor text-sm mb-4"
          />
        )}

        {/* Expert Answer */}
        {revealed && (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-4 animate-fadeIn">
            <p className="text-xs font-semibold text-emerald-400 uppercase mb-2">✓ Expert Answer</p>
            <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {step.answer}
            </pre>
          </div>
        )}

        {/* User's answer comparison */}
        {revealed && userAnswer.trim() && (
          <div className="bg-slate-900/60 border border-slate-600 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Your Answer</p>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{userAnswer}</p>
          </div>
        )}

        {/* Hint */}
        {!revealed && (
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-500">💡 Hint: {step.hint}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!revealed ? (
            <button onClick={handleReveal} className="btn-primary flex-1 justify-center">
              Reveal Expert Answer
            </button>
          ) : (
            <button onClick={handleNext} className="btn-success flex-1 justify-center">
              {stepIdx + 1 >= selected.steps.length ? '🏁 Complete Simulation' : 'Next Challenge →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
