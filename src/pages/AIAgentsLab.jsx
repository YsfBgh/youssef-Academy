import React, { useState } from 'react';
import { AGENT_ROLES, AGENT_LESSONS, AGENT_SIMULATIONS } from '../data/aiagents';
import { useProgress } from '../utils/ProgressContext';

export default function AIAgentsLab() {
  const [view, setView] = useState('home');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSim, setSelectedSim] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [simAnswer, setSimAnswer] = useState('');
  const [simRevealed, setSimRevealed] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const { markAgentLessonComplete, isAgentLessonComplete, markAgentSimComplete, isAgentSimComplete } = useProgress();

  // ─── Lesson view ──────────────────────────────────────────
  if (view === 'lesson' && selectedLesson) {
    const lesson = AGENT_LESSONS.find(l => l.id === selectedLesson);
    const done = isAgentLessonComplete(lesson.id);

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <button className="btn-secondary py-1.5 px-3 text-sm" onClick={() => setView('home')}>← Back</button>

        <div className="card border-violet-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{lesson.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>⏱️ {lesson.duration}</span>
                {done && <span className="badge bg-emerald-500/20 text-emerald-300">✓ Completed</span>}
              </div>
            </div>
          </div>
          <div className="lesson-content prose-sm">
            {lesson.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
              if (line.startsWith('```')) return null;
              if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1rem' }}>{line.slice(2)}</li>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i}><strong>{line.slice(2, -2)}</strong></p>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>

        {/* Quiz */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <div className="card border-blue-500/30">
            <div className="font-bold text-white mb-3">📝 Quick Check</div>
            {lesson.quiz.map((q, qi) => (
              <div key={qi} className="mb-4">
                <div className="text-sm font-medium text-slate-200 mb-2">{q.q}</div>
                <div className="space-y-1">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setQuizAnswer({ qi, oi })}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                        quizAnswer?.qi === qi && quizAnswer?.oi === oi
                          ? oi === q.answer
                            ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-red-600/20 border-red-500/40 text-red-300'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {oi === q.answer && quizAnswer?.qi === qi ? '✓ ' : ''}{opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!done && (
          <button className="btn-success" onClick={() => { markAgentLessonComplete(lesson.id); setView('home'); }}>
            ✓ Mark Complete (+60 XP)
          </button>
        )}
      </div>
    );
  }

  // ─── Simulation view ──────────────────────────────────────
  if (view === 'sim' && selectedSim) {
    const sim = AGENT_SIMULATIONS.find(s => s.id === selectedSim);
    const step = sim.steps[simStep];
    const done = isAgentSimComplete(sim.id);

    if (simStep >= sim.steps.length) {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-6xl">🤖</div>
          <h2 className="text-2xl font-bold text-white">Simulation Complete!</h2>
          <div className="card border-violet-500/30 bg-violet-600/10">
            <div className="text-4xl font-bold text-violet-400">+{sim.xpReward} XP</div>
          </div>
          <button className="btn-primary" onClick={() => { markAgentSimComplete(sim.id); setView('home'); }}>
            Claim XP & Return
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-1.5 px-3 text-sm" onClick={() => setView('home')}>← Back</button>
          <div>
            <h1 className="font-bold text-white">{sim.title}</h1>
            <div className="text-sm text-slate-400">Step {simStep + 1} of {sim.steps.length}</div>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill bg-gradient-to-r from-violet-500 to-blue-500"
            style={{ width: `${(simStep / sim.steps.length) * 100}%` }} />
        </div>

        {/* Scenario */}
        <div className="card border-slate-600">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Scenario</div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{sim.scenario}</pre>
        </div>

        {/* Agent action */}
        <div className="card border-violet-500/30 bg-violet-900/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-sm">🤖</div>
            <div className="text-sm font-semibold text-violet-300">{step.agentAction}</div>
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{step.agentResponse}</pre>
        </div>

        {/* Your task */}
        <div className="card border-blue-500/30">
          <div className="text-sm font-semibold text-blue-400 mb-2">🎯 Your Task</div>
          <div className="text-sm text-slate-200 mb-3">{step.yourTask}</div>

          <textarea
            className="input min-h-[80px] font-mono text-sm mb-3 resize-y"
            placeholder="Your answer..."
            value={simAnswer}
            onChange={e => setSimAnswer(e.target.value)}
          />

          {!simRevealed ? (
            <button className="btn-secondary text-sm" onClick={() => setSimRevealed(true)}>
              💡 Show Expected Insight
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <div className="text-xs font-semibold text-emerald-400 mb-1">Expected Insight (+{step.points} pts)</div>
                <div className="text-sm text-slate-200">{step.expectedInsight}</div>
              </div>
              <button
                className="btn-primary text-sm"
                onClick={() => { setSimStep(simStep + 1); setSimAnswer(''); setSimRevealed(false); }}
              >
                Next Step →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Home view ────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="section-title">🤖 AI Agents Lab</h1>
        <p className="section-subtitle">
          Learn to work with AI agents for design, coding, testing, review, and deployment workflows.
        </p>
      </div>

      {/* Agent roles */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Meet the Agents</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {AGENT_ROLES.map(role => (
            <div key={role.id} className={`card text-center py-4 border ${role.badge.replace('bg-', 'border-').replace('/20', '/30').replace('text-', '')}`}>
              <div className="text-2xl mb-2">{role.icon}</div>
              <div className="text-xs font-semibold text-white">{role.name.replace(' Agent', '')}</div>
              <div className={`badge ${role.badge} text-xs mt-1`}>{role.name.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">📚 Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENT_LESSONS.map(lesson => {
            const done = isAgentLessonComplete(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`card card-hover cursor-pointer ${done ? 'border-emerald-500/30' : 'border-slate-700'}`}
                onClick={() => { setSelectedLesson(lesson.id); setView('lesson'); setQuizAnswer(null); }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{lesson.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{lesson.title}</h3>
                      {done && <span className="badge bg-emerald-500/20 text-emerald-300 text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-slate-400">{lesson.duration}</div>
                    {lesson.agentRole && (
                      <div className="mt-2">
                        <span className="badge bg-violet-500/20 text-violet-300 text-xs">
                          {AGENT_ROLES.find(r => r.id === lesson.agentRole)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-amber-400">+60 XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulations */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">🎮 Agent Simulations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENT_SIMULATIONS.map(sim => {
            const done = isAgentSimComplete(sim.id);
            const role = AGENT_ROLES.find(r => r.id === sim.agentRole);
            return (
              <div
                key={sim.id}
                className={`card card-hover cursor-pointer ${done ? 'border-emerald-500/30' : 'border-violet-500/30'}`}
                onClick={() => { setSelectedSim(sim.id); setSimStep(0); setSimAnswer(''); setSimRevealed(false); setView('sim'); }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{sim.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-white text-sm">{sim.title}</h3>
                      {done && <span className="badge bg-emerald-500/20 text-emerald-300 text-xs">✓</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {role && <span className={`badge ${role.badge} text-xs`}>{role.name}</span>}
                      <span className={`badge text-xs ${sim.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>{sim.difficulty}</span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400">+{sim.xpReward} XP</span>
                </div>
                <p className="text-xs text-slate-400">{sim.description}</p>
                <div className="mt-2 text-xs text-slate-500">{sim.steps.length} interactive steps</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
