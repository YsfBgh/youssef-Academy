import React, { useState } from 'react';
import { ROADMAP_PHASES } from '../data/roadmap';
import { useProgress } from '../utils/ProgressContext';

const COLOR_CLASSES = {
  blue:   { border: 'border-blue-500/40',   bg: 'bg-blue-600/10',   badge: 'bg-blue-500/20 text-blue-300',   icon: 'text-blue-400', dot: 'bg-blue-500' },
  violet: { border: 'border-violet-500/40', bg: 'bg-violet-600/10', badge: 'bg-violet-500/20 text-violet-300', icon: 'text-violet-400', dot: 'bg-violet-500' },
  emerald:{ border: 'border-emerald-500/40',bg: 'bg-emerald-600/10',badge: 'bg-emerald-500/20 text-emerald-300',icon: 'text-emerald-400',dot: 'bg-emerald-500' },
  rose:   { border: 'border-rose-500/40',   bg: 'bg-rose-600/10',   badge: 'bg-rose-500/20 text-rose-300',   icon: 'text-rose-400', dot: 'bg-rose-500' },
  cyan:   { border: 'border-cyan-500/40',   bg: 'bg-cyan-600/10',   badge: 'bg-cyan-500/20 text-cyan-300',   icon: 'text-cyan-400', dot: 'bg-cyan-500' },
  amber:  { border: 'border-amber-500/40',  bg: 'bg-amber-600/10',  badge: 'bg-amber-500/20 text-amber-300',  icon: 'text-amber-400', dot: 'bg-amber-500' },
};

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState('phase-1');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const { getXP } = useProgress();
  const xp = getXP();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">🗺️ Learning Roadmap</h1>
        <p className="section-subtitle">
          Your structured path from zero to senior developer — follow the phases in order.
        </p>
      </div>

      {/* XP Progress */}
      <div className="card border-blue-500/30 bg-gradient-to-r from-blue-600/10 to-violet-600/10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-bold text-white">Your XP Progress</div>
            <div className="text-sm text-slate-400">{xp} XP earned — keep building momentum</div>
          </div>
          <div className="text-3xl font-bold text-blue-400">{xp} <span className="text-sm font-normal text-slate-400">XP</span></div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-gradient-to-r from-blue-500 to-violet-500"
            style={{ width: `${Math.min(100, (xp / 5000) * 100)}%` }} />
        </div>
        <div className="text-xs text-slate-500 mt-1">Goal: 5,000 XP to complete full roadmap</div>
      </div>

      {/* Phase list */}
      <div className="space-y-4">
        {ROADMAP_PHASES.map((phase, phaseIdx) => {
          const c = COLOR_CLASSES[phase.color] ?? COLOR_CLASSES.blue;
          const isOpen = expandedPhase === phase.id;
          const isUnlocked = phaseIdx === 0 || xp >= ROADMAP_PHASES[phaseIdx - 1].xpReward;

          return (
            <div key={phase.id} className={`card ${c.border} ${!isUnlocked ? 'opacity-50' : ''}`}>
              {/* Phase header */}
              <button
                className="w-full flex items-center gap-4 text-left"
                onClick={() => isUnlocked && setExpandedPhase(isOpen ? null : phase.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${c.bg} flex-shrink-0`}>
                  {isUnlocked ? phase.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">Phase {phase.phase}: {phase.title}</span>
                    <span className={`badge ${c.badge}`}>+{phase.xpReward} XP</span>
                    {!isUnlocked && <span className="badge bg-slate-600/50 text-slate-400">Locked</span>}
                  </div>
                  <div className="text-sm text-slate-400">{phase.subtitle}</div>
                </div>
                <span className="text-slate-500 text-lg flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Phase tracks */}
              {isOpen && isUnlocked && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {phase.tracks.map(track => {
                    const tc = COLOR_CLASSES[track.color] ?? COLOR_CLASSES.blue;
                    return (
                      <button
                        key={track.id}
                        onClick={() => setSelectedTrack(selectedTrack?.id === track.id ? null : track)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedTrack?.id === track.id
                            ? `${tc.border} ${tc.bg}`
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{track.icon}</span>
                          <span className="font-semibold text-white text-sm">{track.title}</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">~{track.estimatedHours}h estimated</div>
                        <div className="flex flex-wrap gap-1">
                          {track.skills.slice(0, 3).map(s => (
                            <span key={s} className={`badge ${tc.badge} text-xs`}>{s}</span>
                          ))}
                          {track.skills.length > 3 && (
                            <span className="badge bg-slate-600/50 text-slate-400 text-xs">+{track.skills.length - 3}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Track detail panel */}
              {isOpen && selectedTrack && phase.tracks.find(t => t.id === selectedTrack.id) && (
                <div className="mt-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{selectedTrack.icon}</span>
                    <div>
                      <div className="font-bold text-white">{selectedTrack.title}</div>
                      <div className="text-sm text-slate-400">~{selectedTrack.estimatedHours} hours to complete</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills You'll Learn</div>
                      <div className="space-y-1">
                        {selectedTrack.skills.map(s => (
                          <div key={s} className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resources</div>
                      <div className="space-y-1">
                        {selectedTrack.resources.map(r => (
                          <div key={r} className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="text-base">📌</span>
                            {r}
                          </div>
                        ))}
                      </div>
                      {selectedTrack.unlocks.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unlocks</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedTrack.unlocks.map(u => (
                              <span key={u} className="badge bg-amber-500/20 text-amber-300 text-xs">→ {u.replace('rt-', '')}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
