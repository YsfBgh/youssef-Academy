import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TRACKS } from '../data/courses';
import { useProgress } from '../utils/ProgressContext';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTrack = searchParams.get('track') || TRACKS[0].id;
  const { isLessonComplete, getTrackProgress } = useProgress();

  const track = TRACKS.find(t => t.id === selectedTrack) ?? TRACKS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">Courses</h1>
        <p className="section-subtitle">Master each track to become the top developer at Jadev</p>
      </div>

      {/* Track Selector */}
      <div className="flex gap-2 flex-wrap">
        {TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => setSearchParams({ track: t.id })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              selectedTrack === t.id
                ? `${t.badge} border-current`
                : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.title}</span>
            <span className="text-xs opacity-70">{getTrackProgress(t.id)}%</span>
          </button>
        ))}
      </div>

      {/* Selected Track */}
      <div>
        {/* Track Header */}
        <div className={`card border mb-4 bg-gradient-to-r ${track.gradient}/20 ${track.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center text-2xl`}>
              {track.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{track.title}</h2>
              <p className="text-slate-400 text-sm">{track.subtitle}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${track.badge.split(' ')[1]}`}>
                {getTrackProgress(track.id)}%
              </div>
              <div className="text-xs text-slate-500">{track.lessons.length} lessons</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="progress-bar mt-3">
            <div
              className={`progress-fill bg-gradient-to-r ${track.gradient}`}
              style={{ width: `${getTrackProgress(track.id)}%` }}
            />
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-2">
          {track.lessons.map((lesson, idx) => {
            const done = isLessonComplete(track.id, lesson.id);
            return (
              <Link
                key={lesson.id}
                to={`/courses/${track.id}/lesson/${lesson.id}`}
                className={`card card-hover flex items-center gap-4 ${done ? `${track.border} bg-gradient-to-r ${track.gradient}/5` : ''}`}
              >
                {/* Step number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  done
                    ? `bg-gradient-to-br ${track.gradient} text-white`
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {done ? '✓' : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">⏱ {lesson.duration}</span>
                    <DifficultyBadge level={lesson.difficulty} />
                    <span className="text-xs text-slate-500">{lesson.keyPoints?.length ?? 0} key points</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {done && <span className="badge bg-emerald-500/20 text-emerald-400">✓ Done</span>}
                  <span className="text-slate-500">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ level }) {
  const colors = {
    Beginner:     'bg-emerald-500/20 text-emerald-400',
    Intermediate: 'bg-amber-500/20 text-amber-400',
    Advanced:     'bg-rose-500/20 text-rose-400',
  };
  return <span className={`badge ${colors[level] ?? colors.Beginner}`}>{level}</span>;
}
