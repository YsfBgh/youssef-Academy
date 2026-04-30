import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TRACKS } from '../data/courses';
import { MASTERY_METHOD, TECH_AREAS, getTrackCapstone } from '../data/masteryCurriculum';
import { useProgress } from '../utils/ProgressContext';

const ROLES = ['All', 'Backend', 'Frontend', 'Full-Stack', 'DevOps'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// Static metadata per track — skill level, role, prerequisites, estimated hours
const TRACK_META = {
  csharp:    { level: 'Beginner', role: 'Backend',    prereqs: [],               hours: 40, skillLevel: 'Foundational' },
  react:     { level: 'Intermediate', role: 'Frontend', prereqs: ['JavaScript'],  hours: 35, skillLevel: 'Practical' },
  nextjs:    { level: 'Intermediate', role: 'Full-Stack', prereqs: ['React'],     hours: 30, skillLevel: 'Practical' },
  apis:      { level: 'Intermediate', role: 'Backend',  prereqs: ['C# & .NET'],   hours: 30, skillLevel: 'Production' },
  oop:       { level: 'Intermediate', role: 'Backend',  prereqs: ['C# & .NET'],   hours: 20, skillLevel: 'Foundational' },
  refactor:  { level: 'Advanced',    role: 'Full-Stack', prereqs: ['OOP'],        hours: 25, skillLevel: 'Interview-Ready' },
};

const SKILL_LEVEL_COLORS = {
  Foundational:     'bg-blue-500/20 text-blue-300',
  Practical:        'bg-emerald-500/20 text-emerald-300',
  Production:       'bg-violet-500/20 text-violet-300',
  'Interview-Ready':'bg-amber-500/20 text-amber-300',
};

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTrack = searchParams.get('track') || TRACKS[0].id;
  const { isLessonComplete, getTrackProgress } = useProgress();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const track = TRACKS.find(t => t.id === selectedTrack) ?? TRACKS[0];
  const capstone = getTrackCapstone(track);

  const filteredTracks = TRACKS.filter(t => {
    const meta = TRACK_META[t.id] ?? {};
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle?.toLowerCase().includes(search.toLowerCase());
    const matchRole  = filterRole === 'All' || meta.role === filterRole;
    const matchLevel = filterLevel === 'All' || meta.level === filterLevel;
    return matchSearch && matchRole && matchLevel;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">Courses</h1>
        <p className="section-subtitle">
          Every track follows the same mastery system: explain → model → example → exercise → project → review.
          Work through a track sequentially or jump to the skill you need.
        </p>
      </div>

      {/* Coverage stats */}
      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Full-Stack Curriculum Coverage</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
              Tracks span backend, frontend, data, testing, and deployment — aligned with what real engineering teams expect from a mid-to-senior developer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4 shrink-0">
            <Stat label="Tracks" value={TRACKS.length} />
            <Stat label="Lessons" value={TRACKS.reduce((s, t) => s + t.lessons.length, 0)} />
            <Stat label="Tech areas" value={TECH_AREAS.length} />
            <Stat label="Hours est." value={Object.values(TRACK_META).reduce((s, m) => s + m.hours, 0) + '+'} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TECH_AREAS.slice(0, 6).map(area => (
            <div key={area.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white leading-tight">{area.title}</h3>
                <span className="badge bg-white/5 text-slate-400 text-[10px] shrink-0">{area.level}</span>
              </div>
              <p className="text-xs leading-5 text-slate-400">{area.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mastery method */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">How to Study Each Lesson</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {MASTERY_METHOD.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-950/50 p-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-slate-400">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-white">{capstone.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400 text-xs">
            Complete each track by building a production-style slice.
          </p>
          <div className="mt-4 space-y-2">
            {capstone.milestones.slice(0, 5).map((item, i) => (
              <div key={item} className="flex gap-3 rounded-lg bg-slate-950/50 p-2 text-sm text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                  {i + 1}
                </span>
                <span className="text-xs leading-5">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="card space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            className="input flex-1 min-w-0"
            placeholder="Search tracks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`btn-secondary text-sm shrink-0 ${showFilters ? 'border-blue-500/40 text-blue-300' : ''}`}
          >
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {showFilters && (
          <div className="grid gap-4 sm:grid-cols-2 pt-1">
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Role</label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      filterRole === r
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Level</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setFilterLevel(l)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      filterLevel === l
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(search || filterRole !== 'All' || filterLevel !== 'All') && (
          <p className="text-xs text-slate-500">
            {filteredTracks.length} of {TRACKS.length} tracks shown.{' '}
            <button
              onClick={() => { setSearch(''); setFilterRole('All'); setFilterLevel('All'); }}
              className="text-blue-400 hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </div>

      {/* Track Selector */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.map(t => {
          const meta = TRACK_META[t.id] ?? {};
          const progress = getTrackProgress(t.id);
          return (
            <button
              key={t.id}
              onClick={() => setSearchParams({ track: t.id })}
              className={`card card-hover text-left transition-all ${
                selectedTrack === t.id
                  ? `border ${t.border} bg-gradient-to-r ${t.gradient}/10`
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xl shrink-0`}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-bold text-white leading-tight">{t.title}</h3>
                    <span className={`text-xs font-semibold shrink-0 ${t.badge?.split(' ')[1] ?? 'text-slate-300'}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {meta.skillLevel && (
                      <span className={`badge text-[10px] ${SKILL_LEVEL_COLORS[meta.skillLevel] ?? ''}`}>
                        {meta.skillLevel}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{t.lessons?.length} lessons</span>
                    <span className="text-[10px] text-slate-500">{meta.hours}h est.</span>
                  </div>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="progress-bar mt-3">
                <div
                  className={`progress-fill bg-gradient-to-r ${t.gradient}`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Prerequisites */}
              {meta.prereqs?.length > 0 && (
                <div className="mt-2 flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] text-slate-500">Prereq:</span>
                  {meta.prereqs.map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredTracks.length === 0 && (
        <div className="card text-center py-10">
          <p className="text-slate-400">No tracks match your filters.</p>
        </div>
      )}

      {/* Selected Track Detail */}
      <div>
        <div className={`card border mb-4 bg-gradient-to-r ${track.gradient}/15 ${track.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center text-2xl shrink-0`}>
              {track.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{track.title}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{track.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {TRACK_META[track.id]?.skillLevel && (
                  <span className={`badge text-xs ${SKILL_LEVEL_COLORS[TRACK_META[track.id].skillLevel]}`}>
                    {TRACK_META[track.id].skillLevel}
                  </span>
                )}
                {TRACK_META[track.id]?.prereqs?.length > 0 && (
                  <span className="text-xs text-slate-400">
                    Prereqs: {TRACK_META[track.id].prereqs.join(', ')}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  ~{TRACK_META[track.id]?.hours ?? '?'}h estimated
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-3xl font-bold ${track.badge?.split(' ')[1] ?? 'text-white'}`}>
                {getTrackProgress(track.id)}%
              </div>
              <div className="text-xs text-slate-500">{track.lessons.length} lessons</div>
            </div>
          </div>
          <div className="progress-bar mt-4">
            <div
              className={`progress-fill bg-gradient-to-r ${track.gradient}`}
              style={{ width: `${getTrackProgress(track.id)}%` }}
            />
          </div>
        </div>

        {/* Lessons list */}
        <div className="space-y-2">
          {track.lessons.map((lesson, idx) => {
            const done = isLessonComplete(track.id, lesson.id);
            return (
              <Link
                key={lesson.id}
                to={`/courses/${track.id}/lesson/${lesson.id}`}
                className={`card card-hover flex items-center gap-4 ${done ? `${track.border} bg-gradient-to-r ${track.gradient}/5` : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  done
                    ? `bg-gradient-to-br ${track.gradient} text-white`
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {done ? '✓' : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500">⏱ {lesson.duration}</span>
                    <DifficultyBadge level={lesson.difficulty} />
                    {lesson.keyPoints?.length > 0 && (
                      <span className="text-xs text-slate-500">{lesson.keyPoints.length} key points</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {done ? (
                    <span className="badge bg-emerald-500/20 text-emerald-400 text-xs">Done</span>
                  ) : (
                    <span className="badge bg-slate-700 text-slate-400 text-xs">Start</span>
                  )}
                  <span className="text-slate-500 text-sm">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Track CTA */}
        <div className="mt-4 flex items-center gap-3">
          <Link to={`/quiz/${track.id}`} className="btn-secondary text-sm">
            Take Track Quiz
          </Link>
          <Link to="/practice" className="btn-secondary text-sm">
            Practice Exercises
          </Link>
          <Link to="/interview" className="btn-secondary text-sm">
            Interview Questions
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2">
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function DifficultyBadge({ level }) {
  const colors = {
    Beginner:     'bg-emerald-500/20 text-emerald-400',
    Intermediate: 'bg-amber-500/20 text-amber-400',
    Advanced:     'bg-rose-500/20 text-rose-400',
  };
  return <span className={`badge text-xs ${colors[level] ?? colors.Beginner}`}>{level}</span>;
}
