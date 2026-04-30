import React, { useState } from 'react';
import { SKILL_NODES, SKILL_CONNECTIONS, getUnlockedNodes } from '../data/skilltree';
import { useProgress } from '../utils/ProgressContext';

const COLOR_MAP = {
  blue:    { node: 'border-blue-500/60 bg-blue-900/30',    locked: 'border-slate-700 bg-slate-800/40',    label: 'text-blue-300',    badge: 'bg-blue-500/20 text-blue-300' },
  violet:  { node: 'border-violet-500/60 bg-violet-900/30', locked: 'border-slate-700 bg-slate-800/40',   label: 'text-violet-300',  badge: 'bg-violet-500/20 text-violet-300' },
  emerald: { node: 'border-emerald-500/60 bg-emerald-900/30', locked: 'border-slate-700 bg-slate-800/40', label: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300' },
  amber:   { node: 'border-amber-500/60 bg-amber-900/30',   locked: 'border-slate-700 bg-slate-800/40',   label: 'text-amber-300',   badge: 'bg-amber-500/20 text-amber-300' },
  rose:    { node: 'border-rose-500/60 bg-rose-900/30',     locked: 'border-slate-700 bg-slate-800/40',   label: 'text-rose-300',    badge: 'bg-rose-500/20 text-rose-300' },
  cyan:    { node: 'border-cyan-500/60 bg-cyan-900/30',     locked: 'border-slate-700 bg-slate-800/40',   label: 'text-cyan-300',    badge: 'bg-cyan-500/20 text-cyan-300' },
  slate:   { node: 'border-slate-500/60 bg-slate-800/60',   locked: 'border-slate-700 bg-slate-800/40',   label: 'text-slate-300',   badge: 'bg-slate-500/20 text-slate-300' },
};

export default function SkillTree() {
  const [selectedNode, setSelectedNode] = useState(null);
  const { getXP, unlockSkillNode, isSkillNodeUnlocked, progress } = useProgress();
  const xp = getXP();
  const unlockedIds = progress.skillNodes ?? [];

  const isNodeUnlocked = (node) => {
    if (node.type === 'root') return true;
    if (node.xpRequired && xp < node.xpRequired) return false;
    return node.unlockRequires.every(req => isSkillNodeUnlocked(req));
  };

  const selected = selectedNode ? SKILL_NODES.find(n => n.id === selectedNode) : null;
  const canUnlock = selected && isNodeUnlocked(selected) && !isSkillNodeUnlocked(selected.id);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="section-title">🌳 Skill Tree</h1>
        <p className="section-subtitle">
          Your visual progress map — unlock skills as you earn XP and complete prerequisites.
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-slate-400">Skill</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500 ring-1 ring-violet-400"></div>
          <span className="text-xs text-slate-400">Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-400"></div>
          <span className="text-xs text-slate-400">Legendary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <span className="text-xs text-slate-400">Locked</span>
        </div>
        <div className="ml-auto text-sm text-blue-400 font-semibold">{xp} XP</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Tree canvas */}
        <div className="flex-1 card p-4 overflow-x-auto" style={{ minHeight: '600px' }}>
          <div className="relative" style={{ width: '100%', height: '680px', minWidth: '700px' }}>
            {/* SVG connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {SKILL_CONNECTIONS.map(([from, to]) => {
                const fromNode = SKILL_NODES.find(n => n.id === from);
                const toNode = SKILL_NODES.find(n => n.id === to);
                if (!fromNode || !toNode) return null;
                const x1 = `${fromNode.x}%`;
                const y1 = `${fromNode.y + 3}%`;
                const x2 = `${toNode.x}%`;
                const y2 = `${toNode.y - 3}%`;
                const bothUnlocked = isSkillNodeUnlocked(from) && isSkillNodeUnlocked(to);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={bothUnlocked ? '#3b82f6' : '#334155'}
                    strokeWidth={bothUnlocked ? '2' : '1'}
                    strokeDasharray={bothUnlocked ? 'none' : '4,4'}
                    opacity={bothUnlocked ? '0.6' : '0.3'}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {SKILL_NODES.map(node => {
              const unlocked = isSkillNodeUnlocked(node.id) || node.type === 'root';
              const available = isNodeUnlocked(node) && !unlocked;
              const c = COLOR_MAP[node.color] ?? COLOR_MAP.blue;
              const isSelected = selectedNode === node.id;

              let nodeStyle = unlocked
                ? c.node
                : available
                  ? 'border-slate-500/50 bg-slate-800/70 cursor-pointer'
                  : c.locked;

              if (isSelected) nodeStyle += ' ring-2 ring-white/30';

              const sizeClass = node.type === 'legendary'
                ? 'w-16 h-16 text-2xl'
                : node.type === 'milestone'
                  ? 'w-14 h-14 text-xl'
                  : 'w-12 h-12 text-lg';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  className={`absolute flex flex-col items-center group`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                  title={node.label}
                >
                  <div className={`${sizeClass} rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${nodeStyle} ${(unlocked || available) ? 'hover:scale-110 hover:shadow-lg' : 'opacity-40'}`}>
                    {unlocked ? node.icon : available ? node.icon : '🔒'}
                  </div>
                  <div className={`text-center mt-1 text-xs font-medium leading-tight ${unlocked ? (c.label || 'text-white') : 'text-slate-600'} max-w-[80px] truncate`}>
                    {node.label}
                  </div>
                  {unlocked && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:w-72 space-y-3">
          {selected ? (
            <div className="card border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl ${
                  isSkillNodeUnlocked(selected.id) ? COLOR_MAP[selected.color]?.node : 'border-slate-600 bg-slate-800'
                }`}>
                  {selected.icon}
                </div>
                <div>
                  <div className="font-bold text-white">{selected.label}</div>
                  <div className="text-xs text-slate-400 capitalize">{selected.type}</div>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{selected.description}</p>

              {selected.xpRequired > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>⭐ Requires {selected.xpRequired} XP</span>
                  {xp >= selected.xpRequired
                    ? <span className="text-emerald-400">✓ You have enough XP</span>
                    : <span className="text-amber-400">Need {selected.xpRequired - xp} more XP</span>}
                </div>
              )}

              {selected.unlockRequires.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Prerequisites</div>
                  {selected.unlockRequires.map(req => {
                    const reqNode = SKILL_NODES.find(n => n.id === req);
                    const done = isSkillNodeUnlocked(req);
                    return (
                      <div key={req} className={`flex items-center gap-1 text-xs py-0.5 ${done ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span>{done ? '✓' : '○'}</span>
                        {reqNode?.label ?? req}
                      </div>
                    );
                  })}
                </div>
              )}

              {isSkillNodeUnlocked(selected.id) && (
                <div className="flex items-center gap-1 text-emerald-400 text-sm">
                  <span>✓</span> Unlocked
                </div>
              )}

              {canUnlock && (
                <button className="btn-primary w-full text-sm mt-2" onClick={() => { unlockSkillNode(selected.id); }}>
                  🔓 Unlock Skill
                </button>
              )}

              {!isSkillNodeUnlocked(selected.id) && !canUnlock && selected.type !== 'root' && (
                <div className="text-xs text-slate-500">Complete prerequisites to unlock</div>
              )}
            </div>
          ) : (
            <div className="card border-dashed border-slate-600 text-center py-8">
              <div className="text-3xl mb-2">👆</div>
              <div className="text-sm text-slate-400">Click a node to see details</div>
            </div>
          )}

          {/* Stats */}
          <div className="card">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Progress</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Skills unlocked</span>
                <span className="text-white font-semibold">{unlockedIds.length} / {SKILL_NODES.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">XP earned</span>
                <span className="text-blue-400 font-semibold">{xp}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Level</span>
                <span className="text-amber-400 font-semibold">Lv {Math.floor(xp / 500) + 1}</span>
              </div>
            </div>
            <div className="mt-3 progress-bar">
              <div className="progress-fill bg-gradient-to-r from-blue-500 to-violet-500"
                style={{ width: `${Math.min(100, (unlockedIds.length / SKILL_NODES.length) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
