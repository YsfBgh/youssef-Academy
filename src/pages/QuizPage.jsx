import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QUIZZES } from '../data/quizzes';
import { TRACKS } from '../data/courses';
import { useProgress } from '../utils/ProgressContext';

export default function QuizPage() {
  const { trackId } = useParams();
  const [selectedTrack, setSelectedTrack] = useState(trackId ?? null);
  const [phase, setPhase] = useState('select'); // select | quiz | results
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalResult, setFinalResult] = useState({ score: 0, pct: 0 });
  const { markQuizComplete, isQuizComplete, progress } = useProgress();

  const quiz = selectedTrack ? QUIZZES[selectedTrack] : null;
  const questions = quiz?.questions ?? [];

  const startQuiz = (trackId) => {
    setSelectedTrack(trackId);
    setPhase('quiz');
    setCurrentQ(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers([]);
  };

  const handleSelect = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = questions[currentQ].correct === selected;
    setAnswers(prev => [...prev, { selected, correct }]);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      // Build complete answers array (state update is async — compute synchronously here)
      const allAnswers = [...answers, { selected, correct: questions[currentQ].correct === selected }];
      const score = allAnswers.filter(a => a.correct).length;
      const pct = Math.round((score / questions.length) * 100);
      setAnswers(allAnswers);           // save for results review
      setFinalResult({ score, pct });   // save synchronously for display
      markQuizComplete(selectedTrack, pct);
      setPhase('results');
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const finalScore = finalResult.score;
  const finalPct   = finalResult.pct;

  if (phase === 'select') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="section-title">🧠 Quizzes</h1>
          <p className="section-subtitle">Test your knowledge across all tracks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(QUIZZES).map(([id, q]) => {
            const track = TRACKS.find(t => t.id === id);
            const completed = isQuizComplete(id);
            const bestScore = progress.quizzes?.[id]?.score;

            return (
              <div key={id} className={`card card-hover ${track?.border ?? ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{q.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm">{q.title}</h3>
                    <p className="text-xs text-slate-400">{q.questions.length} questions</p>
                  </div>
                  {completed && (
                    <span className={`ml-auto badge ${track?.badge}`}>{bestScore}%</span>
                  )}
                </div>

                <div className="text-xs text-slate-500 mb-3">
                  {q.questions.slice(0, 2).map(qn => (
                    <div key={qn.id} className="truncate">• {qn.question.slice(0, 50)}...</div>
                  ))}
                </div>

                <button
                  onClick={() => startQuiz(id)}
                  className="btn-primary w-full justify-center text-sm"
                >
                  {completed ? '🔄 Retake' : '▶ Start Quiz'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <div className="card">
          <div className="text-6xl mb-4">
            {finalPct >= 80 ? '🏆' : finalPct >= 60 ? '🎯' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {finalPct >= 80 ? 'Excellent!' : finalPct >= 60 ? 'Good Job!' : 'Keep Studying!'}
          </h2>
          <p className="text-slate-400 mb-4">
            You scored {finalScore} out of {questions.length}
          </p>

          <div className="text-5xl font-bold mb-4">
            <span className={finalPct >= 80 ? 'text-emerald-400' : finalPct >= 60 ? 'text-amber-400' : 'text-rose-400'}>
              {finalPct}%
            </span>
          </div>

          {/* Answer review */}
          <div className="text-left space-y-3 mb-6">
            {questions.map((q, i) => {
              const ans = answers[i] ?? { selected: -1, correct: false };
              return (
                <div key={q.id} className={`p-3 rounded-lg text-sm ${ans.correct ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-rose-900/30 border border-rose-500/30'}`}>
                  <div className="flex items-start gap-2">
                    <span>{ans.correct ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-medium text-white mb-1">{q.question}</p>
                      {!ans.correct && (
                        <p className="text-slate-400 text-xs">
                          ✓ Correct: {q.options[q.correct]}
                        </p>
                      )}
                      <p className="text-slate-500 text-xs mt-1">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => startQuiz(selectedTrack)} className="btn-primary">
              🔄 Retry Quiz
            </button>
            <button onClick={() => setPhase('select')} className="btn-secondary">
              ← All Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz phase
  const question = questions[currentQ];
  const track = TRACKS.find(t => t.id === selectedTrack);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPhase('select')} className="text-slate-400 hover:text-slate-200 text-sm">
          ← Back
        </button>
        <span className="text-sm text-slate-400">Question {currentQ + 1} / {questions.length}</span>
        <span className={`badge ${track?.badge}`}>{quiz?.title}</span>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div
          className={`progress-fill bg-gradient-to-r ${track?.gradient ?? 'from-blue-500 to-violet-500'}`}
          style={{ width: `${((currentQ) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <span className={`badge ${question.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' : question.difficulty === 'Advanced' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-white font-semibold text-base leading-relaxed">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let style = 'card cursor-pointer border-slate-700 hover:border-slate-500';
          if (confirmed) {
            if (i === question.correct) style = 'card border border-emerald-500 bg-emerald-900/20';
            else if (i === selected && i !== question.correct) style = 'card border border-rose-500 bg-rose-900/20';
            else style = 'card border-slate-700 opacity-50';
          } else if (i === selected) {
            style = `card border ${track?.border ?? 'border-blue-500'} ${track?.badge?.split(' ')[0] ?? 'bg-blue-500/10'}`;
          }

          return (
            <div
              key={i}
              className={`${style} transition-all duration-150`}
              onClick={() => handleSelect(i)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                  confirmed && i === question.correct
                    ? 'border-emerald-500 text-emerald-400'
                    : confirmed && i === selected
                    ? 'border-rose-500 text-rose-400'
                    : i === selected
                    ? 'border-blue-500 text-blue-400'
                    : 'border-slate-600 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <p className="text-slate-200 text-sm">{opt}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {confirmed && (
        <div className="card border-slate-600 bg-slate-900/50 animate-fadeIn">
          <p className="text-xs text-slate-400 mb-1">💡 Explanation</p>
          <p className="text-slate-300 text-sm">{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className="btn-primary w-full justify-center"
        >
          Confirm Answer
        </button>
      ) : (
        <button onClick={handleNext} className="btn-primary w-full justify-center">
          {currentQ + 1 >= questions.length ? 'See Results 🏁' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
