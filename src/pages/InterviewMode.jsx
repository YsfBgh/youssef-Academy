import React, { useState } from 'react';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS, getQuestionsByCategory, LEVEL_COLORS } from '../data/interview';
import { useProgress } from '../utils/ProgressContext';

export default function InterviewMode() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [mode, setMode] = useState('browse'); // 'browse' | 'practice'
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceRevealed, setPracticeRevealed] = useState(false);

  const { markInterviewComplete, isInterviewComplete } = useProgress();

  const categoryQuestions = selectedCategory ? getQuestionsByCategory(selectedCategory) : [];
  const completedCount = INTERVIEW_QUESTIONS.filter(q => isInterviewComplete(q.id)).length;

  // Practice mode
  if (mode === 'practice' && selectedCategory) {
    const qs = categoryQuestions;
    if (practiceIdx >= qs.length) {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-6xl">🎯</div>
          <h2 className="text-2xl font-bold text-white">Practice Complete!</h2>
          <p className="text-slate-400">You went through all {qs.length} questions in this category.</p>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary" onClick={() => { setMode('browse'); setPracticeIdx(0); }}>Back to Browse</button>
            <button className="btn-secondary" onClick={() => { setPracticeIdx(0); setPracticeAnswer(''); setPracticeRevealed(false); }}>Start Over</button>
          </div>
        </div>
      );
    }

    const q = qs[practiceIdx];
    const done = isInterviewComplete(q.id);

    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-1.5 px-3 text-sm" onClick={() => setMode('browse')}>← Browse</button>
          <div className="flex-1">
            <div className="text-sm text-slate-400">Question {practiceIdx + 1} / {qs.length}</div>
          </div>
          <span className={`badge ${LEVEL_COLORS[q.level]}`}>{q.level}</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill bg-gradient-to-r from-blue-500 to-violet-500"
            style={{ width: `${(practiceIdx / qs.length) * 100}%` }} />
        </div>

        <div className="card border-blue-500/30">
          <div className="text-lg font-bold text-white mb-4">{q.question}</div>

          <textarea
            className="input min-h-[100px] mb-3 resize-y"
            placeholder="Type your answer from memory first — then reveal the model answer..."
            value={practiceAnswer}
            onChange={e => setPracticeAnswer(e.target.value)}
          />

          {!practiceRevealed ? (
            <button className="btn-secondary text-sm" onClick={() => setPracticeRevealed(true)}>
              👁️ Reveal Answer
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/60 border border-slate-600 rounded-xl">
                <div className="text-xs font-semibold text-emerald-400 mb-2">Model Answer</div>
                <div className="text-sm font-semibold text-white mb-2">{q.shortAnswer}</div>
                <div className="text-xs text-slate-400 whitespace-pre-line">{q.fullAnswer}</div>
              </div>
              {q.followUps && q.followUps.length > 0 && (
                <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                  <div className="text-xs font-semibold text-amber-400 mb-1">Common Follow-Up Questions</div>
                  {q.followUps.map((fu, i) => (
                    <div key={i} className="text-xs text-slate-300 py-0.5">• {fu}</div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                {!done && (
                  <button className="btn-success text-sm" onClick={() => markInterviewComplete(q.id)}>
                    ✓ Mark as Reviewed (+30 XP)
                  </button>
                )}
                <button
                  className="btn-primary text-sm"
                  onClick={() => { setPracticeIdx(practiceIdx + 1); setPracticeAnswer(''); setPracticeRevealed(false); }}
                >
                  Next Question →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="section-title">🎤 Interview Mode</h1>
        <p className="section-subtitle">
          Practice real interview questions for .NET, React, SQL, system design, and behavioral rounds.
        </p>
      </div>

      {/* Progress */}
      <div className="card border-blue-500/30 bg-gradient-to-r from-blue-600/10 to-violet-600/10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-bold text-white">Interview Prep Progress</div>
            <div className="text-sm text-slate-400">{completedCount} of {INTERVIEW_QUESTIONS.length} questions reviewed</div>
          </div>
          <div className="text-2xl font-bold text-blue-400">{Math.round((completedCount / INTERVIEW_QUESTIONS.length) * 100)}%</div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-gradient-to-r from-blue-500 to-violet-500"
            style={{ width: `${(completedCount / INTERVIEW_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {INTERVIEW_CATEGORIES.map(cat => {
          const catQuestions = getQuestionsByCategory(cat.id);
          const doneCount = catQuestions.filter(q => isInterviewComplete(q.id)).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`card card-hover text-left transition-all ${
                isSelected ? `${cat.border} ${cat.badge.replace('text-', '').replace('bg-', 'bg-').replace('/20', '/10')}` : 'border-slate-700'
              }`}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{cat.title}</div>
              <div className="text-xs text-slate-400 mb-2">{cat.description}</div>
              <div className="flex items-center justify-between">
                <span className={`badge ${cat.badge} text-xs`}>{cat.questionCount} Qs</span>
                <span className="text-xs text-slate-500">{doneCount}/{catQuestions.length} done</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Questions list */}
      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {INTERVIEW_CATEGORIES.find(c => c.id === selectedCategory)?.title} Questions
            </h2>
            <button
              className="btn-primary text-sm py-1.5"
              onClick={() => { setMode('practice'); setPracticeIdx(0); setPracticeAnswer(''); setPracticeRevealed(false); }}
            >
              🎯 Practice Mode
            </button>
          </div>

          <div className="space-y-2">
            {categoryQuestions.map((q, i) => {
              const done = isInterviewComplete(q.id);
              const isExpanded = selectedQuestion === q.id;

              return (
                <div key={q.id} className={`card cursor-pointer ${done ? 'border-emerald-500/30' : 'border-slate-700'}`}>
                  <div
                    className="flex items-center gap-3"
                    onClick={() => { setSelectedQuestion(isExpanded ? null : q.id); setShowFull(false); }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      done ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{q.question}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge ${LEVEL_COLORS[q.level]} text-xs`}>{q.level}</span>
                      <span className="text-slate-500 text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                        <div className="text-xs font-semibold text-blue-400 mb-1">Quick Answer</div>
                        <div className="text-sm text-slate-200">{q.shortAnswer}</div>
                      </div>

                      {showFull ? (
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                          <div className="text-xs font-semibold text-violet-400 mb-2">Full Explanation</div>
                          <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{q.fullAnswer}</div>
                        </div>
                      ) : (
                        <button className="text-xs text-blue-400 hover:text-blue-300" onClick={() => setShowFull(true)}>
                          Show full explanation →
                        </button>
                      )}

                      {q.followUps && q.followUps.length > 0 && (
                        <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                          <div className="text-xs font-semibold text-amber-400 mb-1">Follow-Up Questions</div>
                          {q.followUps.map((fu, fi) => (
                            <div key={fi} className="text-xs text-slate-300 py-0.5">• {fu}</div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {q.tags.map(t => (
                          <span key={t} className="badge bg-slate-700/60 text-slate-400 text-xs">{t}</span>
                        ))}
                      </div>

                      {!done && (
                        <button className="btn-success text-xs py-1.5 px-3" onClick={() => markInterviewComplete(q.id)}>
                          ✓ Mark as Reviewed (+30 XP)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedCategory && (
        <div className="card border-dashed border-slate-600 text-center py-10">
          <div className="text-4xl mb-3">👆</div>
          <div className="text-slate-400">Select a category above to browse questions</div>
        </div>
      )}
    </div>
  );
}
