import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TRACKS } from '../data/courses';
import { useProgress } from '../utils/ProgressContext';
import { hasExercise } from '../data/exercises';
import {
  Lock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Zap,
  Target,
  BookOpen,
  Play,
  Star,
} from 'lucide-react';

// ── Track metadata ────────────────────────────────────────────
const TRACK_META = {
  csharp:   { level: 'Beginner',     role: 'Backend',     hours: 40, xpPerLesson: 50 },
  react:    { level: 'Intermediate', role: 'Frontend',    hours: 35, xpPerLesson: 50 },
  nextjs:   { level: 'Intermediate', role: 'Full-Stack',  hours: 30, xpPerLesson: 50 },
  apis:     { level: 'Intermediate', role: 'Backend',     hours: 30, xpPerLesson: 50 },
  oop:      { level: 'Intermediate', role: 'Backend',     hours: 20, xpPerLesson: 50 },
  refactor: { level: 'Advanced',     role: 'Full-Stack',  hours: 25, xpPerLesson: 50 },
};

const LEVEL_COLORS = {
  Beginner:     'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Intermediate: 'bg-amber-500/20   text-amber-300   border-amber-500/30',
  Advanced:     'bg-rose-500/20    text-rose-300    border-rose-500/30',
};

const DIFF_COLORS = {
  Beginner:     'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced:     'text-rose-400',
};

// ── Mission node component ────────────────────────────────────
function MissionNode({ lesson, idx, trackId, status, track }) {
  const navigate = useNavigate();
  const isLocked    = status === 'locked';
  const isComplete  = status === 'complete';
  const isCurrent   = status === 'current';
  const hasEx       = hasExercise(trackId, lesson.id);

  const nodeColors = isComplete
    ? `bg-gradient-to-br ${track.gradient} border-transparent shadow-lg`
    : isCurrent
    ? 'bg-slate-800 border-blue-500/60 shadow-blue-500/20 shadow-lg'
    : 'bg-slate-900/80 border-slate-700/50';

  const textColor  = isLocked ? 'text-slate-600' : 'text-white';
  const subColor   = isLocked ? 'text-slate-700' : 'text-slate-400';

  return (
    <div className="relative flex gap-4 items-start">
      {/* Vertical connector line */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => !isLocked && navigate(`/courses/${trackId}/lesson/${lesson.id}`)}
          disabled={isLocked}
          className={`relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-200 ${nodeColors} ${
            isCurrent ? 'animate-glow ring-2 ring-blue-500/30' : ''
          } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
        >
          {isComplete
            ? <CheckCircle2 size={18} className="text-white" />
            : isLocked
            ? <Lock size={14} className="text-slate-600" />
            : <span className={textColor}>{idx + 1}</span>
          }
        </button>
        {/* line below node — last node has no line */}
        <div className={`w-0.5 h-8 mt-1 ${isComplete ? `bg-gradient-to-b ${track.gradient}` : 'bg-slate-800'}`} />
      </div>

      {/* Card */}
      <button
        onClick={() => !isLocked && navigate(`/courses/${trackId}/lesson/${lesson.id}`)}
        disabled={isLocked}
        className={`flex-1 mb-2 text-left rounded-xl border p-4 transition-all duration-200 ${
          isLocked
            ? 'border-slate-800/60 bg-slate-900/30 cursor-not-allowed opacity-50'
            : isCurrent
            ? 'border-blue-500/40 bg-slate-900/90 hover:border-blue-400/60 hover:bg-slate-900 cursor-pointer'
            : isComplete
            ? `border-white/10 bg-gradient-to-r ${track.gradient}/10 hover:${track.gradient}/20 cursor-pointer`
            : 'border-white/10 bg-slate-900/60 cursor-not-allowed opacity-60'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Status label */}
            {isCurrent && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Current Mission</span>
              </div>
            )}
            {isComplete && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Complete</span>
              </div>
            )}
            <h3 className={`font-bold text-sm leading-tight ${textColor}`}>{lesson.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${DIFF_COLORS[lesson.difficulty] ?? DIFF_COLORS.Beginner}`}>
                {lesson.difficulty ?? 'Beginner'}
              </span>
              <span className="text-[10px] text-slate-600">•</span>
              <span className={`text-[10px] ${subColor}`}>{lesson.duration}</span>
              {hasEx && (
                <>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[10px] text-violet-400 font-semibold flex items-center gap-0.5">
                    <Zap size={8} /> Coding Mission
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-xs font-bold ${isComplete ? 'text-emerald-400' : isLocked ? 'text-slate-700' : 'text-amber-400'}`}>
              +50 XP
            </span>
            {!isLocked && (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isComplete
                  ? `bg-gradient-to-br ${track.gradient}`
                  : isCurrent
                  ? 'bg-blue-500/20'
                  : 'bg-slate-800'
              }`}>
                {isComplete
                  ? <CheckCircle2 size={13} className="text-white" />
                  : <Play size={11} className={isCurrent ? 'text-blue-400' : 'text-slate-500'} />
                }
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

// ── Track card for selector ───────────────────────────────────
function TrackCard({ track, isSelected, progress, onClick }) {
  const meta = TRACK_META[track.id] ?? {};
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-3.5 transition-all duration-200 ${
        isSelected
          ? `border bg-gradient-to-br ${track.gradient}/10 ${track.border} shadow-lg`
          : 'border-white/8 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${track.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
          {track.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white leading-tight truncate">{track.title}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            {meta.level && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${LEVEL_COLORS[meta.level]}`}>
                {meta.level}
              </span>
            )}
            <span className="text-[9px] text-slate-600">{track.lessons?.length} missions</span>
          </div>
        </div>
        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
          {progress}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${track.gradient} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────
export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTrackId = searchParams.get('track') || TRACKS[0].id;
  const { isLessonComplete, getTrackProgress } = useProgress();

  const track    = TRACKS.find(t => t.id === selectedTrackId) ?? TRACKS[0];
  const meta     = TRACK_META[track.id] ?? {};
  const progress = getTrackProgress(track.id);

  // Figure out lesson states
  const lessonStates = track.lessons.map((lesson, idx) => {
    const done = isLessonComplete(track.id, lesson.id);
    if (done) return 'complete';
    // First incomplete lesson is "current"
    const prevDone = idx === 0 || isLessonComplete(track.id, track.lessons[idx - 1].id);
    if (prevDone) return 'current';
    return 'locked';
  });

  // Stats
  const completedCount = lessonStates.filter(s => s === 'complete').length;
  const totalXP        = completedCount * 50;
  const currentMission = track.lessons.find((_, i) => lessonStates[i] === 'current');

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-title">Mission Control</h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose a track, follow the path. Each mission builds on the last.
          </p>
        </div>
        {currentMission && (
          <Link
            to={`/courses/${track.id}/lesson/${currentMission.id}`}
            className="btn-primary text-sm flex-shrink-0"
          >
            <Play size={14} /> Resume Mission
          </Link>
        )}
      </div>

      {/* Track selector grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map(t => (
          <TrackCard
            key={t.id}
            track={t}
            isSelected={t.id === selectedTrackId}
            progress={getTrackProgress(t.id)}
            onClick={() => setSearchParams({ track: t.id })}
          />
        ))}
      </div>

      {/* Selected track detail */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* Mission Map */}
        <div className="space-y-1">
          {/* Track header */}
          <div className={`rounded-xl border p-4 mb-5 bg-gradient-to-r ${track.gradient}/10 ${track.border}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                {track.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-white">{track.title}</h2>
                <p className="text-slate-400 text-xs mt-0.5">{track.subtitle}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500">
                  {meta.level && (
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${LEVEL_COLORS[meta.level]}`}>
                      {meta.level}
                    </span>
                  )}
                  <span className="flex items-center gap-1"><BookOpen size={11} /> {track.lessons.length} missions</span>
                  <span className="flex items-center gap-1"><Target size={11} /> {meta.hours}h est.</span>
                  <span className="flex items-center gap-1"><Zap size={11} /> {totalXP} XP earned</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-black text-white">{progress}%</div>
                <div className="text-xs text-slate-500">{completedCount}/{track.lessons.length} done</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-900/80 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${track.gradient} transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Mission nodes */}
          <div className="space-y-0">
            {track.lessons.map((lesson, idx) => (
              <MissionNode
                key={lesson.id}
                lesson={lesson}
                idx={idx}
                trackId={track.id}
                status={lessonStates[idx]}
                track={track}
              />
            ))}
            {/* End cap */}
            <div className="flex gap-4 items-center pt-2">
              <div className="w-11 flex justify-center">
                <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center ${
                  progress === 100
                    ? `bg-gradient-to-br ${track.gradient} border-transparent`
                    : 'border-dashed border-slate-700 bg-slate-900/40'
                }`}>
                  {progress === 100
                    ? <Star size={18} className="text-white" />
                    : <Star size={16} className="text-slate-700" />
                  }
                </div>
              </div>
              <div className={`text-sm font-bold ${progress === 100 ? 'text-amber-400' : 'text-slate-700'}`}>
                {progress === 100 ? '🎉 Track Complete! Take the quiz.' : 'Track Complete — Unlock with all missions'}
              </div>
              {progress === 100 && (
                <Link to={`/quiz/${track.id}`} className="btn-primary text-xs ml-auto">
                  Take Quiz →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-white">Track Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Missions', value: track.lessons.length },
                { label: 'Completed', value: completedCount },
                { label: 'XP Earned', value: totalXP },
                { label: 'Est. Hours', value: `${meta.hours}h` },
              ].map(s => (
                <div key={s.label} className="rounded-lg bg-slate-950/60 border border-white/8 p-2.5 text-center">
                  <div className="text-lg font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next up */}
          {currentMission && (
            <div className="card border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Up Next</span>
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{currentMission.title}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span>{currentMission.duration}</span>
                <span>•</span>
                <span className={DIFF_COLORS[currentMission.difficulty] ?? DIFF_COLORS.Beginner}>
                  {currentMission.difficulty}
                </span>
                {hasExercise(track.id, currentMission.id) && (
                  <>
                    <span>•</span>
                    <span className="text-violet-400 flex items-center gap-0.5"><Zap size={9} /> Coding</span>
                  </>
                )}
              </div>
              <Link
                to={`/courses/${track.id}/lesson/${currentMission.id}`}
                className="btn-primary text-xs w-full justify-center"
              >
                <Play size={12} /> Start Mission
              </Link>
            </div>
          )}

          {/* Quick actions */}
          <div className="card space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Quick Actions</h3>
            <Link to={`/quiz/${track.id}`} className="btn-secondary text-xs w-full justify-start">
              <ChevronRight size={12} /> Take Track Quiz
            </Link>
            <Link to="/codelab" className="btn-secondary text-xs w-full justify-start">
              <ChevronRight size={12} /> Code Lab
            </Link>
            <Link to="/aicoach" className="btn-secondary text-xs w-full justify-start">
              <ChevronRight size={12} /> Ask AI Coach
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
