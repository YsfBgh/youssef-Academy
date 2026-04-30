import React, { useState } from 'react';
import { PROJECTS } from '../data/projects';
import { useProgress } from '../utils/ProgressContext';

const DIFF_COLORS = {
  Beginner: 'bg-emerald-500/20 text-emerald-300',
  Intermediate: 'bg-blue-500/20 text-blue-300',
  Advanced: 'bg-violet-500/20 text-violet-300',
};

export default function ProjectLab() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const { markProjectMilestoneComplete, isProjectMilestoneComplete, getProjectProgress } = useProgress();

  if (selectedProject) {
    const proj = PROJECTS.find(p => p.id === selectedProject);
    const progressPct = getProjectProgress(proj.id, proj.milestones.length);

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Back + header */}
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-1.5 px-3 text-sm" onClick={() => setSelectedProject(null)}>
            ← All Projects
          </button>
        </div>

        <div className={`card ${proj.border}`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${proj.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
              {proj.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-white">{proj.title}</h1>
                <span className={`badge ${DIFF_COLORS[proj.difficulty]}`}>{proj.difficulty}</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">{proj.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {proj.techStack.map(t => (
                  <span key={t} className="badge bg-slate-700/60 text-slate-300 text-xs">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">⏱️ ~{proj.estimatedHours}h</span>
                <span className="text-amber-400 font-semibold">+{proj.xpReward} XP on completion</span>
                <span className="text-slate-400">{progressPct}% done</span>
              </div>
            </div>
          </div>
          <div className="mt-4 progress-bar">
            <div className={`progress-fill bg-gradient-to-r ${proj.gradient}`}
              style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          {proj.milestones.map((milestone, idx) => {
            const done = isProjectMilestoneComplete(proj.id, milestone.id);
            const isOpen = expandedMilestone === milestone.id;
            const prevDone = idx === 0 || isProjectMilestoneComplete(proj.id, proj.milestones[idx - 1].id);

            return (
              <div key={milestone.id} className={`card ${done ? 'border-emerald-500/30' : 'border-slate-700'} ${!prevDone && !done ? 'opacity-60' : ''}`}>
                <button
                  className="w-full flex items-center gap-4 text-left"
                  onClick={() => setExpandedMilestone(isOpen ? null : milestone.id)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    done ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{milestone.title}</div>
                    <div className="text-xs text-slate-400">{milestone.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400">+{milestone.xpReward} XP</span>
                    <span className="text-slate-500">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-4">
                    {/* Tasks checklist */}
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tasks</div>
                      <div className="space-y-1.5">
                        {milestone.tasks.map((task, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {done ? <span className="text-emerald-400 text-xs">✓</span> : ''}
                            </span>
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Code hint */}
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Code Reference</div>
                      <pre className="code-block text-xs overflow-x-auto">{milestone.codeHint}</pre>
                    </div>

                    {/* Mark done button */}
                    {!done && prevDone && (
                      <button
                        className="btn-success text-sm"
                        onClick={() => markProjectMilestoneComplete(proj.id, milestone.id)}
                      >
                        ✓ Mark Milestone Complete (+{milestone.xpReward} XP)
                      </button>
                    )}
                    {done && (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <span>✓</span> Milestone completed
                      </div>
                    )}
                    {!done && !prevDone && (
                      <div className="text-xs text-slate-500">Complete previous milestone first</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="section-title">🛠️ Project Lab</h1>
        <p className="section-subtitle">
          Build real portfolio projects with step-by-step milestones. Each project earns XP and adds a piece to your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PROJECTS.map(proj => {
          const progressPct = getProjectProgress(proj.id, proj.milestones.length);
          const completedMilestones = proj.milestones.filter(m => isProjectMilestoneComplete(proj.id, m.id)).length;

          return (
            <div
              key={proj.id}
              className={`card card-hover cursor-pointer ${proj.border}`}
              onClick={() => setSelectedProject(proj.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${proj.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                  {proj.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{proj.title}</h3>
                  <span className={`badge ${DIFF_COLORS[proj.difficulty]} text-xs`}>{proj.difficulty}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{proj.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {proj.techStack.slice(0, 3).map(t => (
                  <span key={t} className="badge bg-slate-700/60 text-slate-300 text-xs">{t}</span>
                ))}
                {proj.techStack.length > 3 && (
                  <span className="badge bg-slate-600/50 text-slate-400 text-xs">+{proj.techStack.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>⏱️ ~{proj.estimatedHours}h</span>
                <span className="text-amber-400">+{proj.xpReward} XP</span>
                <span>{completedMilestones}/{proj.milestones.length} milestones</span>
              </div>

              <div className="progress-bar">
                <div className={`progress-fill bg-gradient-to-r ${proj.gradient}`}
                  style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
