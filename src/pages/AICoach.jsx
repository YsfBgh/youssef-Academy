import React, { useState } from 'react';
import { useProgress } from '../utils/ProgressContext';
import { useAuth } from '../utils/AuthContext';

const SETTINGS_KEY = 'jadev_ai_settings';

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export default function AICoach() {
  const { currentUser } = useAuth();
  const { getXP, getTotalProgress, progress } = useProgress();
  const [settings, setSettings] = useState(() => ({
    endpoint: '',
    model: 'qwen3.5:cloud',
    apiKey: '',
    ...loadSettings(),
  }));
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

    if (!settings.endpoint || !settings.model || !settings.apiKey) {
      setError('Add endpoint, model, and API key first. For friends, use a backend proxy instead of sharing your key.');
      setLoading(false);
      return;
    }

    const system = [
      'You are JaDev Academy AI Coach.',
      'Coach an engineer from junior to senior with practical, direct advice.',
      'Prefer concrete next actions, projects, debugging, code review, architecture, and DevOps practice.',
      'Keep answers focused and actionable.',
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

    try {
      const res = await fetch(settings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: `Progress: ${JSON.stringify(progressSummary)}\n\nRequest: ${prompt}` },
          ],
        }),
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
          Connect an OpenAI-compatible Qwen endpoint or your own backend proxy to get personalized learning advice.
        </p>
      </div>

      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
        Do not hardcode or share API keys in frontend code. The key is stored only in this browser localStorage for testing. For friends, create a backend proxy and put the API key on the server.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="card space-y-4">
          <h2 className="font-bold text-white">Connection</h2>
          <div>
            <label className="text-xs text-slate-400">Chat Completions Endpoint</label>
            <input
              className="input mt-1"
              value={settings.endpoint}
              onChange={e => updateSetting('endpoint', e.target.value)}
              placeholder="https://your-proxy.example.com/v1/chat/completions"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Model</label>
            <input
              className="input mt-1"
              value={settings.model}
              onChange={e => updateSetting('model', e.target.value)}
              placeholder="qwen3.5:cloud"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">API Key</label>
            <input
              className="input mt-1"
              type="password"
              value={settings.apiKey}
              onChange={e => updateSetting('apiKey', e.target.value)}
              placeholder="Paste key locally for testing"
            />
          </div>
          <div className="text-xs text-slate-500">
            Expected response shape: OpenAI-compatible `choices[0].message.content`.
          </div>
        </section>

        <section className="lg:col-span-2 card space-y-4">
          <h2 className="font-bold text-white">Ask Your Coach</h2>
          <textarea
            className="input min-h-[150px] resize-y"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask for a plan, explain a concept, review your next step..."
          />
          <div className="flex gap-2 flex-wrap">
            {[
              'Create a 7-day plan.',
              'What should I build next?',
              'Act like a senior reviewer.',
              'Prepare me for a .NET interview.',
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
