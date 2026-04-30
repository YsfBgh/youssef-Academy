import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrack, getLesson } from '../data/courses';
import { buildLessonMastery } from '../data/masteryCurriculum';
import { getExercisesForTrack } from '../data/practiceExercises';
import { useProgress } from '../utils/ProgressContext';

export default function LessonView() {
  const { trackId, lessonId } = useParams();
  const [tab, setTab] = useState('theory');
  const [copied, setCopied] = useState(false);
  const { isLessonComplete, markLessonComplete } = useProgress();

  const track = getTrack(trackId);
  const lesson = getLesson(trackId, lessonId);

  if (!track || !lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Lesson not found.</p>
        <Link to="/courses" className="btn-primary mt-4 inline-flex">Back to Courses</Link>
      </div>
    );
  }

  const allLessons = track.lessons;
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];
  const done = isLessonComplete(trackId, lessonId);
  const mastery = buildLessonMastery(track, lesson);
  const relatedExercises = getExercisesForTrack(trackId).slice(0, 4);

  const handleComplete = () => {
    markLessonComplete(trackId, lessonId);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(lesson.codeExample ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { id: 'theory', label: 'Theory' },
    { id: 'code', label: 'Code' },
    { id: 'practice', label: 'Practice' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'project', label: 'Project' },
    { id: 'review', label: 'Review' },
    { id: 'resources', label: 'Resources' },
    { id: 'keypoints', label: 'Key Points' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/courses" className="hover:text-slate-300">Courses</Link>
        <span>/</span>
        <Link to={`/courses?track=${trackId}`} className="hover:text-slate-300">{track.title}</Link>
        <span>/</span>
        <span className="text-slate-300 truncate">{lesson.title}</span>
      </div>

      <div className={`card border bg-gradient-to-r ${track.gradient}/10 ${track.border}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
            {track.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-xs text-slate-400">{lesson.duration}</span>
              <span className="text-xs text-slate-400">{lesson.difficulty}</span>
              <span className="text-xs text-slate-400">{track.title}</span>
              {done && <span className="badge bg-emerald-500/20 text-emerald-400">Completed</span>}
            </div>
          </div>
          {!done && (
            <button onClick={handleComplete} className="btn-success text-sm flex-shrink-0">
              Mark Done
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-500">Lesson {currentIdx + 1} of {allLessons.length}</span>
          <div className="flex-1 progress-bar">
            <div
              className={`progress-fill bg-gradient-to-r ${track.gradient}`}
              style={{ width: `${((currentIdx + 1) / allLessons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700 sm:grid-cols-4 lg:grid-cols-8">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fadeIn">
        {tab === 'theory' && (
          <div className="card lesson-content">
            <TheoryContent content={lesson.theory} />
          </div>
        )}

        {tab === 'code' && (
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Code Example</h3>
              <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="code-block text-sm overflow-x-auto">
              <code>{lesson.codeExample}</code>
            </pre>
          </div>
        )}

        {tab === 'practice' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <ListPanel title="Learning Objectives" items={mastery.objectives} tone="blue" />
            <ListPanel title="Mental Model" items={mastery.mentalModel} tone="emerald" />
            <ListPanel title="Guided Practice" items={mastery.guidedPractice} tone="amber" className="lg:col-span-2" />
          </div>
        )}

        {tab === 'exercises' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-white mb-1">Related Practice Exercises</h3>
              <p className="text-sm text-slate-400 mb-4">
                Hands-on exercises tied to this track. Each has progressive hints, starter code, and a full solution.
              </p>

              {relatedExercises.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-3">No exercises mapped to this track yet.</p>
                  <Link to="/practice" className="btn-primary text-sm">Browse All Exercises</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedExercises.map(ex => (
                    <div key={ex.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-semibold text-white text-sm">{ex.title}</h4>
                          <DiffBadge level={ex.difficulty} />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{ex.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {ex.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-semibold text-amber-400">+{ex.xpReward} XP</span>
                        <Link to="/practice" className="btn-secondary text-xs py-1.5 px-3">
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Link to="/practice" className="btn-primary text-sm w-fit">
                      View All Exercises →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="card border border-blue-500/20 bg-blue-500/5">
              <h3 className="font-bold text-white mb-2">AI-Generated Practice</h3>
              <p className="text-sm text-slate-400 mb-3">
                Ask the AI Coach to generate more exercises tailored to this topic.
              </p>
              <Link
                to={'/aicoach'}
                className="btn-secondary text-sm w-fit"
              >
                Ask AI Coach for exercises →
              </Link>
            </div>
          </div>
        )}

        {tab === 'project' && (
          <div className="card space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Production-style application</div>
              <h3 className="mt-1 text-lg font-bold text-white">{mastery.projectTask.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{mastery.projectTask.brief}</p>
            </div>
            <ListPanel title="Acceptance Criteria" items={mastery.projectTask.acceptance} tone="emerald" compact />
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
              <h4 className="font-semibold text-white">How to submit it to yourself</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create a branch, implement the slice, write a short note explaining tradeoffs, then review it like a teammate would.
              </p>
            </div>
          </div>
        )}

        {tab === 'review' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <ListPanel title="Mastery Checklist" items={mastery.masteryChecklist} tone="emerald" />
            <ListPanel title="Spaced Review Prompts" items={mastery.reviewPrompts} tone="blue" />
            <ListPanel title="AI Coach Prompts" items={mastery.aiCoachPrompts} tone="amber" className="lg:col-span-2" />
          </div>
        )}

        {tab === 'resources' && (
          <div className="card">
            <h3 className="font-bold text-white mb-2">External Resources</h3>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Use videos and documentation as supplements. The mastery work still happens in the practice, project, and review tabs.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {mastery.resources.map(resource => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/10 bg-slate-950/60 p-4 transition hover:border-blue-400/50 hover:bg-slate-900"
                >
                  <span className="badge bg-blue-500/20 text-blue-300">{resource.type}</span>
                  <div className="mt-2 font-semibold text-white">{resource.label}</div>
                  <div className="mt-1 truncate text-xs text-slate-500">{resource.url}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {tab === 'keypoints' && (
          <div className="card">
            <h3 className="font-bold text-white mb-4">Key Takeaways</h3>
            <div className="space-y-3">
              {lesson.keyPoints?.map((point, i) => (
                <div key={point} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${track.gradient} flex items-center justify-center text-xs text-white font-bold flex-shrink-0 mt-0.5`}>
                    {i + 1}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {prevLesson && (
          <Link
            to={`/courses/${trackId}/lesson/${prevLesson.id}`}
            className="btn-secondary flex-1 justify-center"
          >
            Previous
          </Link>
        )}
        {!done && (
          <button onClick={handleComplete} className="btn-success flex-1 justify-center">
            Complete and Continue
          </button>
        )}
        {nextLesson && (
          <Link
            to={`/courses/${trackId}/lesson/${nextLesson.id}`}
            className="btn-primary flex-1 justify-center"
          >
            Next
          </Link>
        )}
        {!nextLesson && done && (
          <Link to={`/quiz/${trackId}`} className="btn-primary flex-1 justify-center">
            Take Track Quiz
          </Link>
        )}
      </div>
    </div>
  );
}

function DiffBadge({ level }) {
  const colors = {
    Beginner:     'bg-emerald-500/20 text-emerald-400',
    Intermediate: 'bg-amber-500/20 text-amber-400',
    Advanced:     'bg-rose-500/20 text-rose-400',
  };
  return <span className={`badge text-xs ${colors[level] ?? colors.Beginner}`}>{level}</span>;
}

function ListPanel({ title, items, tone = 'blue', compact = false, className = '' }) {
  const tones = {
    blue: 'bg-blue-500/20 text-blue-300',
    emerald: 'bg-emerald-500/20 text-emerald-300',
    amber: 'bg-amber-500/20 text-amber-300',
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="font-bold text-white mb-4">{title}</h3>
      <div className={compact ? 'space-y-2' : 'space-y-3'}>
        {items.map((item, index) => (
          <div key={`${title}-${item}`} className="flex items-start gap-3 rounded-lg bg-slate-950/50 p-3">
            <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${tones[tone] ?? tones.blue}`}>
              {index + 1}
            </div>
            <p className="text-sm leading-6 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TheoryContent({ content }) {
  if (!content) return <p className="text-slate-400">No content yet.</p>;

  const lines = content.split('\n');
  const elements = [];
  let inCode = false;
  let codeLines = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre key={key++} className="code-block text-sm my-3 overflow-x-auto">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-lg font-semibold text-blue-400 mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="border-l-4 border-blue-500 pl-4 py-1 my-3 text-slate-400 italic text-sm">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={key++} className="text-slate-300 text-sm ml-4 mb-1 list-disc">
          <InlineCode text={line.slice(2)} />
        </li>
      );
    } else if (line.startsWith('| ')) {
      const cells = line.split('|').filter(c => c.trim() && c.trim() !== '---');
      if (cells.length > 1) {
        elements.push(
          <div key={key++} className="flex gap-4 text-sm border-b border-slate-700 py-1">
            {cells.map((cell, ci) => (
              <span key={ci} className="text-slate-300 flex-1">{cell.trim()}</span>
            ))}
          </div>
        );
      }
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="text-slate-300 leading-relaxed mb-3 text-sm">
          <InlineCode text={line} />
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}

function InlineCode({ text }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`')
          ? <code key={i} className="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>
          : <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>') }} />
      )}
    </>
  );
}
