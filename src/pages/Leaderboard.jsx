import React from 'react';
import { useAuth } from '../utils/AuthContext';

export default function Leaderboard() {
  const { leaderboard, currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">Leaderboard</h1>
        <p className="section-subtitle">
          Shared competition for everyone using this academy. XP updates when learners complete lessons, labs, projects, and missions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((user, index) => (
          <div key={user.id} className={`card ${index === 0 ? 'border-amber-500/40 bg-amber-600/10' : 'border-slate-700'}`}>
            <div className="text-3xl font-black text-white mb-2">#{index + 1}</div>
            <div className="font-bold text-white">{user.name}</div>
            <div className="text-sm text-slate-400">{user.stats?.xp ?? 0} XP</div>
            <div className="text-xs text-blue-400 mt-1">Level {user.stats?.level ?? 1}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="grid grid-cols-[48px_1fr_100px_100px_100px] gap-3 px-3 py-2 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-700">
          <div>Rank</div>
          <div>Learner</div>
          <div className="text-right">XP</div>
          <div className="text-right">Progress</div>
          <div className="text-right">Streak</div>
        </div>
        <div className="divide-y divide-slate-800">
          {leaderboard.map((user, index) => {
            const isMe = user.id === currentUser?.id;
            return (
              <div key={user.id} className={`grid grid-cols-[48px_1fr_100px_100px_100px] gap-3 px-3 py-3 items-center ${isMe ? 'bg-blue-600/10' : ''}`}>
                <div className="text-sm font-bold text-slate-300">#{index + 1}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{user.name} {isMe && <span className="text-blue-400">(you)</span>}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="text-right text-sm text-amber-300 font-semibold">{user.stats?.xp ?? 0}</div>
                <div className="text-right text-sm text-blue-300">{user.stats?.totalProgress ?? 0}%</div>
                <div className="text-right text-sm text-emerald-300">{user.stats?.streak ?? 1}d</div>
              </div>
            );
          })}
        </div>
        {leaderboard.length === 0 && (
          <div className="text-center text-slate-500 py-10">No profiles yet.</div>
        )}
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-200">
        Progress is synced through Supabase. Current XP is still calculated by the frontend, so stricter anti-cheat rules would need server-validated events later.
      </div>
    </div>
  );
}
