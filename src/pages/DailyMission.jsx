import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDailyMission, MISSION_ITEMS } from '../data/dailymission';
import { useProgress } from '../utils/ProgressContext';

export default function DailyMission() {
  const today = new Date().toDateString();
  const mission = useMemo(() => getDailyMission(today), [today]);

  const { markDailyMissionComplete, getDailyMissionProgress, getStreak, getXP } = useProgress();
  const dayProgress = getDailyMissionProgress(today);

  const completedCount = MISSION_ITEMS.filter(item => dayProgress[item.key]).length;
  const allDone = completedCount === MISSION_ITEMS.length;
  const totalXP = MISSION_ITEMS.reduce((s, item) => s + (dayProgress[item.key] ? item.xp : 0), 0)
    + (allDone ? mission.xpReward : 0);

  const ROUTE_MAP = {
    lesson: `/courses/${mission.lesson.trackId}/lesson/${mission.lesson.lessonId}`,
    quiz: `/quiz/${mission.quiz.trackId}`,
    challenge: '/codelab',
    workflow: mission.workflow.type === 'enterprise' ? '/enterprise' : '/workflows',
  };

  const CONTENT_MAP = {
    lesson: { label: mission.lesson.title, sub: mission.lesson.track },
    quiz: { label: mission.quiz.title, sub: `${mission.quiz.questions} questions` },
    challenge: { label: mission.challenge.title, sub: `${mission.challenge.difficulty} • ${mission.challenge.topic}` },
    workflow: { label: mission.workflow.title, sub: mission.workflow.type },
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="section-title">⚡ Daily Mission</h1>
        <p className="section-subtitle">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — Complete all 4 tasks for a bonus XP reward.
        </p>
      </div>

      {/* Tip of the day */}
      <div className="card border-blue-500/30 bg-gradient-to-r from-blue-600/10 to-violet-600/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{mission.tip.icon}</span>
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Today's Dev Insight</div>
            <p className="text-sm text-slate-200">{mission.tip.tip}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{completedCount}/4</div>
          <div className="text-xs text-slate-400 mt-0.5">Tasks done</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-amber-400">{totalXP}</div>
          <div className="text-xs text-slate-400 mt-0.5">XP earned today</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-rose-400">{getStreak()} 🔥</div>
          <div className="text-xs text-slate-400 mt-0.5">Day streak</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Daily completion</span>
          <span>{Math.round((completedCount / 4) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="card border-emerald-500/40 bg-emerald-600/10 text-center py-6">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-lg font-bold text-white">Daily Mission Complete!</div>
          <div className="text-emerald-400 font-semibold mt-1">+{mission.xpReward} Bonus XP earned!</div>
          <div className="text-sm text-slate-400 mt-1">Come back tomorrow for a new mission.</div>
        </div>
      )}

      {/* Mission tasks */}
      <div className="space-y-3">
        {MISSION_ITEMS.map(item => {
          const done = !!dayProgress[item.key];
          const content = CONTENT_MAP[item.key];
          const route = ROUTE_MAP[item.key];

          return (
            <div
              key={item.key}
              className={`card transition-all ${done ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-slate-700 hover:border-slate-500'}`}
            >
              <div className="flex items-center gap-4">
                {/* Check circle */}
                <button
                  onClick={() => !done && markDailyMissionComplete(today, item.key)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    done
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-600 hover:border-blue-500 text-transparent hover:text-blue-400'
                  }`}
                >
                  ✓
                </button>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`badge ${item.badge} text-xs`}>{item.icon} {item.label}</span>
                  </div>
                  <div className="font-medium text-white text-sm truncate">{content.label}</div>
                  <div className="text-xs text-slate-400">{content.sub}</div>
                </div>

                {/* XP + action */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-semibold ${done ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {done ? `+${item.xp} XP ✓` : `+${item.xp} XP`}
                  </span>
                  {!done && (
                    <Link
                      to={route}
                      className="btn-secondary py-1 px-3 text-xs"
                      onClick={() => markDailyMissionComplete(today, item.key)}
                    >
                      Go →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus reward */}
      {!allDone && (
        <div className="card border-dashed border-amber-500/30 text-center py-5">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-semibold text-white">Complete All 4 Tasks</div>
          <div className="text-amber-400 text-sm font-semibold mt-1">Earn +{mission.xpReward} Bonus XP</div>
          <div className="text-xs text-slate-400 mt-1">{4 - completedCount} task{4 - completedCount !== 1 ? 's' : ''} remaining</div>
        </div>
      )}

      {/* Recent missions */}
      <div className="card">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Mission History (Last 7 Days)</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(Date.now() - (6 - i) * 86400000).toDateString();
            const dp = getDailyMissionProgress(d);
            const count = MISSION_ITEMS.filter(item => dp[item.key]).length;
            const isToday = d === today;
            return (
              <div key={d} className="text-center">
                <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  count === 4 ? 'bg-emerald-600 text-white' :
                  count > 0 ? 'bg-blue-600/40 text-blue-300' :
                  'bg-slate-800 text-slate-600'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                  {count === 4 ? '✓' : count > 0 ? count : '—'}
                </div>
                <div className={`text-xs mt-0.5 ${isToday ? 'text-blue-400' : 'text-slate-600'}`}>
                  {new Date(d).toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
