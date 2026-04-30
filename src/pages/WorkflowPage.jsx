import React, { useState } from 'react';
import { WORKFLOWS } from '../data/workflows';
import { TRACKS } from '../data/courses';

export default function WorkflowPage() {
  const [selected, setSelected] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const selectWorkflow = (wf) => {
    setSelected(wf);
    setActiveStep(0);
    setCompletedSteps(new Set());
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const colorMap = {
    blue:   'bg-blue-500',
    purple: 'bg-violet-500',
    emerald:'bg-emerald-500',
    amber:  'bg-amber-500',
    cyan:   'bg-cyan-500',
    rose:   'bg-rose-500',
    violet: 'bg-violet-500',
  };

  if (!selected) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="section-title">🔄 Workflows</h1>
          <p className="section-subtitle">Step-by-step professional guides — the way seniors actually work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKFLOWS.map(wf => {
            const track = TRACKS.find(t => t.id === wf.track);
            return (
              <div
                key={wf.id}
                onClick={() => selectWorkflow(wf)}
                className={`card card-hover ${track?.border ?? 'border-slate-600'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{wf.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{wf.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-slate-400">⏱ {wf.duration}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{wf.steps.length} steps</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{wf.description}</p>

                {/* Steps preview */}
                <div className="flex gap-1 mt-3">
                  {wf.steps.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${colorMap[wf.steps[i].color] ?? 'bg-slate-600'} opacity-40`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const step = selected.steps[activeStep];
  const progress = Math.round((completedSteps.size / selected.steps.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelected(null)}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-white text-lg">{selected.title}</h1>
          <p className="text-sm text-slate-400">{selected.steps.length} steps • {selected.duration}</p>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-bold">{progress}%</div>
          <div className="text-xs text-slate-500">{completedSteps.size}/{selected.steps.length} done</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="progress-bar">
        <div
          className="progress-fill bg-gradient-to-r from-emerald-500 to-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Steps sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {selected.steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(i)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                i === activeStep
                  ? 'border-blue-500/50 bg-blue-600/10 text-white'
                  : completedSteps.has(i)
                  ? 'border-emerald-500/30 bg-emerald-900/10 text-emerald-400'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colorMap[s.color] ?? 'bg-slate-600'} text-white`}>
                  {completedSteps.has(i) ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium truncate">{s.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="col-span-12 lg:col-span-9 space-y-4 animate-fadeIn">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${colorMap[step.color] ?? 'bg-slate-600'} flex items-center justify-center text-xl`}>
                {step.icon}
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">
                  Step {activeStep + 1}: {step.title}
                </h2>
                <p className="text-slate-400 text-sm">{step.details}</p>
              </div>
            </div>

            {/* Code */}
            <pre className="code-block text-xs overflow-x-auto mb-4">
              <code>{step.code}</code>
            </pre>

            {/* Checklist */}
            {step.checklist && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Checklist</p>
                <div className="space-y-1">
                  {step.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={completedSteps.has(activeStep) ? 'text-emerald-400' : 'text-slate-600'}>
                        {completedSteps.has(activeStep) ? '✓' : '○'}
                      </span>
                      <span className={completedSteps.has(activeStep) ? 'text-emerald-400 line-through' : 'text-slate-300'}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {activeStep > 0 && (
              <button onClick={() => setActiveStep(s => s - 1)} className="btn-secondary flex-1 justify-center">
                ← Previous
              </button>
            )}
            <button
              onClick={() => toggleStep(activeStep)}
              className={`flex-1 justify-center ${completedSteps.has(activeStep) ? 'btn-secondary' : 'btn-success'}`}
            >
              {completedSteps.has(activeStep) ? '↩ Undo' : '✓ Mark Done'}
            </button>
            {activeStep < selected.steps.length - 1 && (
              <button onClick={() => setActiveStep(s => s + 1)} className="btn-primary flex-1 justify-center">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
