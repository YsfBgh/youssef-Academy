import React from 'react';
import { Link } from 'react-router-dom';
import { CAREER_CHECKLISTS, ENGINEER_LEVELS, FINAL_BOSS, NEXT_ACTIONS, READINESS_AREAS, SENIOR_HABITS } from '../data/career';
import { PROJECTS } from '../data/projects';
import { MISSIONS } from '../data/enterprise';
import { AGENT_LESSONS, AGENT_SIMULATIONS } from '../data/aiagents';
import { INTERVIEW_QUESTIONS } from '../data/interview';
import { CODE_REVIEW_CASES, DEBUG_SCENARIOS, ARCHITECTURE_SCENARIOS } from '../data/engineeringLabs';
import { useProgress } from '../utils/ProgressContext';

function pct(done, total) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

export default function CareerOS() {
  const {
    progress,
    getTotalProgress,
    getXP,
    toggleCareerCheck,
    isCareerCheckComplete,
    toggleSeniorHabit,
    isSeniorHabitDone,
  } = useProgress();

  const today = new Date().toISOString().slice(0, 10);
  const xp = getXP();

  const completedProjectMilestones = Object.values(progress.projects ?? {})
    .reduce((sum, project) => sum + (project.completedMilestones?.length ?? 0), 0);
  const totalProjectMilestones = PROJECTS.reduce((sum, project) => sum + project.milestones.length, 0);

  const metrics = {
    courses: getTotalProgress(),
    projects: pct(completedProjectMilestones, totalProjectMilestones),
    enterprise: pct(Object.keys(progress.enterpriseMissions ?? {}).length, MISSIONS.length),
    agents: pct(
      Object.keys(progress.agentLessons ?? {}).length + Object.keys(progress.agentSims ?? {}).length,
      AGENT_LESSONS.length + AGENT_SIMULATIONS.length,
    ),
    interview: pct(Object.keys(progress.interviews ?? {}).length, INTERVIEW_QUESTIONS.length),
    codeReview: pct(Object.keys(progress.codeReviews ?? {}).length, CODE_REVIEW_CASES.length),
    debugging: pct(Object.keys(progress.debugScenarios ?? {}).length, DEBUG_SCENARIOS.length),
    architecture: pct(Object.keys(progress.architectureScenarios ?? {}).length, ARCHITECTURE_SCENARIOS.length),
    workflows: pct(Object.keys(progress.dailyMissions ?? {}).length, 30),
  };

  const readiness = READINESS_AREAS.map(area => {
    const score = area.sources.reduce((sum, source) => sum + (metrics[source] ?? 0), 0) / area.sources.length;
    return { ...area, score: clamp(Math.round(score)) };
  });

  const averageReadiness = Math.round(readiness.reduce((sum, area) => sum + area.score, 0) / readiness.length);
  const level = ENGINEER_LEVELS.find(l => averageReadiness >= l.min && averageReadiness <= l.max) ?? ENGINEER_LEVELS[0];
  const weakAreas = [...readiness].sort((a, b) => a.score - b.score).slice(0, 3);
  const recommended = weakAreas.map(area => NEXT_ACTIONS.find(action => action.area === area.id)).filter(Boolean);

  const bossCompleted = FINAL_BOSS.phases.filter((_, index) => isCareerCheckComplete(FINAL_BOSS.id, index)).length;
  const bossPct = pct(bossCompleted, FINAL_BOSS.phases.length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="section-title">Career OS</h1>
          <p className="section-subtitle">
            Your engineering command center: readiness, weak areas, habits, portfolio, interviews, and final boss progress.
          </p>
        </div>
        <div className="card py-3 px-4 min-w-[180px]">
          <div className="text-xs text-slate-400">Current Level</div>
          <div className="text-xl font-bold text-white">{level.label}</div>
          <div className="text-xs text-blue-400 mt-1">{averageReadiness}% readiness</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card border-blue-500/30 bg-blue-600/10">
          <div className="text-xs text-slate-400">Engineer XP</div>
          <div className="text-2xl font-bold text-white">{xp}</div>
          <div className="text-xs text-slate-500 mt-1">{level.focus}</div>
        </div>
        <div className="card border-emerald-500/30 bg-emerald-600/10">
          <div className="text-xs text-slate-400">Portfolio</div>
          <div className="text-2xl font-bold text-white">{metrics.projects}%</div>
          <div className="text-xs text-slate-500 mt-1">{completedProjectMilestones}/{totalProjectMilestones} milestones</div>
        </div>
        <div className="card border-violet-500/30 bg-violet-600/10">
          <div className="text-xs text-slate-400">Enterprise</div>
          <div className="text-2xl font-bold text-white">{metrics.enterprise}%</div>
          <div className="text-xs text-slate-500 mt-1">{Object.keys(progress.enterpriseMissions ?? {}).length}/{MISSIONS.length} missions</div>
        </div>
        <div className="card border-amber-500/30 bg-amber-600/10">
          <div className="text-xs text-slate-400">Final Boss</div>
          <div className="text-2xl font-bold text-white">{bossPct}%</div>
          <div className="text-xs text-slate-500 mt-1">{bossCompleted}/{FINAL_BOSS.phases.length} phases</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Skill Readiness</h2>
            <span className="badge bg-blue-500/20 text-blue-300">Target: senior-ready</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {readiness.map(area => (
              <div key={area.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm">{area.label}</span>
                  <span className={area.score >= area.target ? 'text-emerald-400 text-sm font-bold' : 'text-amber-400 text-sm font-bold'}>
                    {area.score}%
                  </span>
                </div>
                <div className="progress-bar mb-2">
                  <div
                    className={`progress-fill ${area.score >= area.target ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${area.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{area.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="text-lg font-bold text-white mb-4">Recommended Next</h2>
          <div className="space-y-3">
            {recommended.map(action => (
              <div key={action.area} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">{action.area}</div>
                <div className="text-sm text-slate-300">{action.action}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link className="btn-secondary text-xs justify-center" to="/codereview">Review Lab</Link>
            <Link className="btn-secondary text-xs justify-center" to="/debugging">Debug Lab</Link>
            <Link className="btn-secondary text-xs justify-center" to="/architecture">Architecture</Link>
            <Link className="btn-secondary text-xs justify-center" to="/projects">Projects</Link>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="card">
          <h2 className="text-lg font-bold text-white mb-4">Senior Habits Today</h2>
          <div className="space-y-2">
            {SENIOR_HABITS.map(habit => {
              const done = isSeniorHabitDone(today, habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleSeniorHabit(today, habit.id)}
                  className={`w-full flex items-center gap-3 text-left p-3 rounded-lg border transition-all ${
                    done ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900/40 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className={`w-5 h-5 rounded border flex items-center justify-center text-xs ${done ? 'border-emerald-400' : 'border-slate-500'}`}>
                    {done ? '✓' : ''}
                  </span>
                  <span className="text-sm">{habit.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card">
          <h2 className="text-lg font-bold text-white mb-2">{FINAL_BOSS.title}</h2>
          <p className="text-sm text-slate-400 mb-4">{FINAL_BOSS.description}</p>
          <div className="progress-bar mb-4">
            <div className="progress-fill bg-gradient-to-r from-amber-500 to-emerald-500" style={{ width: `${bossPct}%` }} />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {FINAL_BOSS.phases.map((phase, index) => {
              const done = isCareerCheckComplete(FINAL_BOSS.id, index);
              return (
                <button
                  key={phase}
                  onClick={() => toggleCareerCheck(FINAL_BOSS.id, index)}
                  className={`w-full flex items-center gap-3 text-left p-2.5 rounded-lg border ${
                    done ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-slate-900/40 border-slate-700'
                  }`}
                >
                  <span className="text-xs text-slate-500 w-5">{index + 1}</span>
                  <span className={done ? 'text-emerald-300 text-sm' : 'text-slate-300 text-sm'}>{phase}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {CAREER_CHECKLISTS.map(list => {
          const doneCount = list.items.filter((_, index) => isCareerCheckComplete(list.id, index)).length;
          return (
            <div key={list.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-white">{list.title}</h2>
                <span className="text-xs text-blue-400">{doneCount}/{list.items.length}</span>
              </div>
              <div className="space-y-2">
                {list.items.map((item, index) => {
                  const done = isCareerCheckComplete(list.id, index);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleCareerCheck(list.id, index)}
                      className="flex items-start gap-2 text-left w-full"
                    >
                      <span className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 text-xs flex items-center justify-center ${done ? 'border-emerald-400 text-emerald-400' : 'border-slate-600'}`}>
                        {done ? '✓' : ''}
                      </span>
                      <span className={done ? 'text-sm text-emerald-300' : 'text-sm text-slate-400'}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
