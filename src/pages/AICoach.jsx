import React, { useState } from 'react';
import { useProgress } from '../utils/ProgressContext';
import { useAuth } from '../utils/AuthContext';

const SETTINGS_KEY = 'jadev_ai_settings';

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
    if (saved.endpoint === '/.netlify/functions/ai-coach' && !saved.provider) {
      return {};
    }
    return saved;
  } catch {
    return {};
  }
}

export default function AICoach() {
  const { currentUser } = useAuth();
  const { getXP, getTotalProgress, progress } = useProgress();
  const [settings, setSettings] = useState(() => ({
    provider: import.meta.env.VITE_AI_COACH_PROVIDER ?? 'ollama',
    endpoint: import.meta.env.VITE_AI_COACH_ENDPOINT ?? '/ollama/api/chat',
    model: import.meta.env.VITE_AI_COACH_MODEL ?? 'qwen3:latest',
    apiKey: '',
    ...loadSettings(),
  }));
  const [coachMode, setCoachMode] = useState('tutor');
  const [prompt, setPrompt] = useState('Create a 7-day learning plan for me based on my progress.');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  async function askCoach() {
    setLoading(true);
    setError('');
    setAnswer('');

    const provider = settings.provider ?? 'ollama';
    const usesServerProxy = settings.endpoint.startsWith('/');
    const usesOllama = provider === 'ollama' || settings.endpoint.includes('/api/chat');

    if (!settings.endpoint || !settings.model || (!usesOllama && !usesServerProxy && !settings.apiKey)) {
      setError('Add endpoint and model first. Native Ollama does not need an API key. Direct OpenAI-compatible endpoints usually do.');
      setLoading(false);
      return;
    }

    const system = [
      'You are JaDev Academy AI Coach.',
      'Coach an engineer from junior to senior through clear explanations, deliberate practice, projects, debugging, code review, architecture, and DevOps.',
      'Do not only give answers. Teach with a hint ladder: mental model, small hint, stronger hint, then full solution only when needed.',
      'When explaining a technology, include: problem solved, simple explanation, real-world example, common mistake, mini exercise, and mastery check.',
      `Current mode: ${coachMode}.`,
      'Keep answers focused, practical, and honest about what the learner should practice next.',
    ].join(' ');

    const progressSummary = {
      learner: currentUser?.name,
      xp: getXP(),
      totalProgress: getTotalProgress(),
      completedLessons: Object.keys(progress.lessons ?? {}).length,
      completedChallenges: Object.keys(progress.challenges ?? {}).length,
      completedProjects: Object.keys(progress.projects ?? {}).length,
      completedInterviews: Object.keys(progress.interviews ?? {}).length,
    };

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: `Progress: ${JSON.stringify(progressSummary)}\n\nRequest: ${prompt}` },
    ];

    const body = usesOllama
      ? {
          model: settings.model,
          messages,
          stream: false,
          options: { temperature: 0.3 },
        }
      : {
          model: settings.model,
          messages,
          temperature: 0.3,
        };

    try {
      const res = await fetch(settings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.apiKey && !usesOllama ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`AI request failed with ${res.status}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content
        ?? data?.message?.content
        ?? data?.response
        ?? JSON.stringify(data, null, 2);
      setAnswer(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="section-title">AI Coach</h1>
        <p className="section-subtitle">
          Connect local Ollama or an optional OpenAI-compatible backend proxy to get personalized learning advice.
        </p>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
        Native Ollama runs locally and usually needs no API key. If you use a hosted provider, keep its key on a backend proxy instead of frontend code.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="card space-y-4">
          <h2 className="font-bold text-white">Connection</h2>
          <div>
            <label className="text-xs text-slate-400">Provider</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                ['ollama', 'Ollama'],
                ['openai-compatible', 'OpenAI-compatible'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={settings.provider === id ? 'btn-primary text-xs justify-center' : 'btn-secondary text-xs justify-center'}
                  onClick={() => {
                    const endpoint = id === 'ollama'
                      ? '/ollama/api/chat'
                      : '/.netlify/functions/ai-coach';
                    const model = id === 'ollama' ? 'qwen3:latest' : 'qwen3.5';
                    const next = { ...settings, provider: id, endpoint, model, apiKey: '' };
                    setSettings(next);
                    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Endpoint</label>
            <input
              className="input mt-1"
              value={settings.endpoint}
              onChange={e => updateSetting('endpoint', e.target.value)}
              placeholder="/ollama/api/chat"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Model</label>
            <input
              className="input mt-1"
              value={settings.model}
              onChange={e => updateSetting('model', e.target.value)}
              placeholder="qwen3:latest"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">API Key for hosted providers only</label>
            <input
              className="input mt-1"
              type="password"
              value={settings.apiKey}
              onChange={e => updateSetting('apiKey', e.target.value)}
              placeholder="Not needed for local Ollama"
            />
          </div>
          <div className="text-xs text-slate-500">
            Ollama uses `/api/chat` with `stream: false`. OpenAI-compatible providers use `choices[0].message.content`.
          </div>
        </section>

        <section className="lg:col-span-2 card space-y-4">
          <h2 className="font-bold text-white">Ask Your Coach</h2>
          <div>
            <label className="text-xs text-slate-400">Mode</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ['tutor', 'Tutor'],
                ['diagnostic', 'Diagnostic'],
                ['project', 'Project Builder'],
                ['reviewer', 'Code Reviewer'],
                ['interview', 'Interview Prep'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={coachMode === id ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
                  onClick={() => setCoachMode(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="input min-h-[150px] resize-y"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask for a plan, explain a concept, review your next step..."
          />
          <div className="flex gap-2 flex-wrap">
            {[
              'Diagnose my weak areas and create a 7-day plan.',
              'Teach me React hooks with examples, mistakes, and exercises.',
              'Design a C# + ASP.NET Core project path from beginner to production.',
              'Act like a senior reviewer and give me a code review checklist.',
              'Prepare me for a .NET interview with questions and model answers.',
            ].map(item => (
              <button key={item} className="btn-secondary text-xs" onClick={() => setPrompt(item)}>
                {item}
              </button>
            ))}
          </div>
          <button className="btn-primary w-fit" onClick={askCoach} disabled={loading}>
            {loading ? 'Thinking...' : 'Ask AI Coach'}
          </button>

          {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
          {answer && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-2">Coach Response</div>
              <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">{answer}</pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
