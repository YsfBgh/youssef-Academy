import React, { useState, useRef } from 'react';
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

const COACH_MODES = [
  {
    id: 'tutor',
    label: 'Tutor',
    icon: '🎓',
    description: 'Explains concepts with mental models, examples, and mini exercises.',
    systemExtra: 'Teach using: problem it solves → simple explanation → real-world example → mini exercise → mastery check.',
  },
  {
    id: 'diagnostic',
    label: 'Diagnose',
    icon: '🔍',
    description: 'Identifies your weak areas and builds a targeted learning plan.',
    systemExtra: 'Analyze the learner\'s progress, identify gaps, and produce a concrete day-by-day plan with specific topics and exercises.',
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: '✏️',
    description: 'Generates practice exercises with hints and solutions.',
    systemExtra: 'Generate exercises with: clear problem statement, hints (progressive), starter code, full solution, and explanation of common mistakes.',
  },
  {
    id: 'reviewer',
    label: 'Code Review',
    icon: '👁️',
    description: 'Reviews code like a senior engineer — readability, bugs, patterns.',
    systemExtra: 'Review code as a senior engineer: identify bugs, code smells, naming issues, missing error handling, performance concerns, and SOLID violations. Give a prioritized list.',
  },
  {
    id: 'interview',
    label: 'Interview',
    icon: '💼',
    description: 'Conducts a mock technical interview with feedback.',
    systemExtra: 'Act as a technical interviewer. Ask one question at a time. After the learner answers, give honest feedback: what was strong, what was missing, what a great answer looks like.',
  },
  {
    id: 'debug',
    label: 'Debug',
    icon: '🐛',
    description: 'Walks through debugging with evidence-driven reasoning.',
    systemExtra: 'Help debug like a senior engineer: understand the symptom, form hypotheses, suggest diagnostic steps, rule out causes, and explain the fix and why it works.',
  },
  {
    id: 'plan',
    label: 'Study Plan',
    icon: '📅',
    description: 'Creates a structured study plan based on your current level.',
    systemExtra: 'Create a detailed study plan with daily tasks, estimated hours, specific topics, exercises, and projects. Make it realistic and actionable.',
  },
  {
    id: 'explain',
    label: 'Explain Concept',
    icon: '💡',
    description: 'Deep dives into a specific concept with real-world context.',
    systemExtra: 'Give a thorough explanation: what it is, why it exists, how it works internally, real use cases, what goes wrong without it, and a concrete code example.',
  },
];

const QUICK_PROMPTS = {
  tutor: [
    'Explain dependency injection with a C# example I can use today.',
    'Teach me how React useState works under the hood.',
    'What is the N+1 problem in SQL and how do I fix it?',
    'Explain async/await in C# vs JavaScript — same idea, different behavior.',
  ],
  diagnostic: [
    'Diagnose my weak areas based on my progress and create a 7-day plan.',
    'What should I learn next given my completed lessons?',
    'I know C# basics — what gaps do I have before I can build a production API?',
  ],
  practice: [
    'Generate 3 C# LINQ exercises from beginner to intermediate.',
    'Give me a React hooks exercise with hints and solution.',
    'Create a SQL joins exercise with realistic data.',
    'Give me a refactoring exercise with a messy function to clean up.',
  ],
  reviewer: [
    'Review this code snippet for bugs and improvements.',
    'What SOLID principles am I violating in my controller?',
    'How would a senior dev improve this repository pattern?',
  ],
  interview: [
    'Start a mock .NET interview — junior to mid-level.',
    'Ask me 5 SQL questions at increasing difficulty.',
    'Give me a React interview with follow-up questions.',
    'Run a system design interview on a task manager API.',
  ],
  debug: [
    'My async endpoint returns null sometimes. Help me debug it.',
    'EF Core is running too many queries. Walk me through diagnosing it.',
    'My React component re-renders infinitely. Where should I look?',
  ],
  plan: [
    'Create a 2-week plan to go from C# basics to shipping a REST API.',
    'I have 1 hour a day. Plan my path from junior to mid-level React dev.',
    'Build a 30-day full-stack plan covering .NET, SQL, and React.',
  ],
  explain: [
    'Explain the CLR garbage collector and what it means for my code.',
    'What is middleware in ASP.NET Core and when should I write my own?',
    'Explain React\'s reconciliation algorithm simply.',
    'What is a database index and when should I add one?',
  ],
};

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
  const [prompt, setPrompt] = useState('Create a 7-day learning plan based on my current progress.');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const responseRef = useRef(null);

  function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  const activeMode = COACH_MODES.find(m => m.id === coachMode) ?? COACH_MODES[0];

  async function askCoach() {
    setLoading(true);
    setError('');
    setAnswer('');

    const provider = settings.provider ?? 'ollama';
    const usesServerProxy = settings.endpoint.startsWith('/');
    const usesOllama = provider === 'ollama' || settings.endpoint.includes('/api/chat');

    if (!settings.endpoint || !settings.model || (!usesOllama && !usesServerProxy && !settings.apiKey)) {
      setError('Add endpoint and model first. Native Ollama does not need an API key.');
      setLoading(false);
      return;
    }

    const progressSummary = {
      learner: currentUser?.name,
      xp: getXP(),
      totalProgress: getTotalProgress(),
      completedLessons: Object.keys(progress.lessons ?? {}).length,
      completedChallenges: Object.keys(progress.challenges ?? {}).length,
      completedProjects: Object.keys(progress.projects ?? {}).length,
      completedInterviews: Object.keys(progress.interviews ?? {}).length,
    };

    const system = [
      'You are JaDev Academy AI Coach — a senior full-stack engineer and mentor.',
      'Your goal: help a junior developer become a senior-level engineer through deliberate practice.',
      'Always be concrete and practical. Avoid vague advice.',
      'When teaching, use: problem → explanation → real example → exercise → mastery check.',
      'Format your response clearly: use ## headings, bullet points, and code blocks (```language).',
      `Current coaching mode: ${activeMode.label}. ${activeMode.systemExtra}`,
      'Learner context: ' + JSON.stringify(progressSummary),
    ].join(' ');

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ];

    const body = usesOllama
      ? { model: settings.model, messages, stream: false, options: { temperature: 0.3 } }
      : { model: settings.model, messages, temperature: 0.3 };

    try {
      const res = await fetch(settings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.apiKey && !usesOllama ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`AI request failed with ${res.status}`);

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content
        ?? data?.message?.content
        ?? data?.response
        ?? JSON.stringify(data, null, 2);
      setAnswer(content);

      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
          Local Qwen/Ollama by default. Switch modes to get tutoring, diagnostics, practice, code review, or mock interviews.
        </p>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
        Local Ollama runs privately on your machine — no API key needed. Hosted providers require a backend proxy for security. Never put API keys in frontend code.
      </div>

      {/* Mode selector */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white">Coaching Mode</h2>
          <button
            onClick={() => setShowSettings(s => !s)}
            className="btn-secondary text-xs"
          >
            {showSettings ? 'Hide Settings' : 'Connection Settings'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COACH_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                setCoachMode(mode.id);
                setPrompt(QUICK_PROMPTS[mode.id]?.[0] ?? '');
              }}
              className={`p-3 rounded-lg border text-left transition-all ${
                coachMode === mode.id
                  ? 'border-blue-500/60 bg-blue-500/10 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <div className="text-xl mb-1">{mode.icon}</div>
              <div className="text-sm font-medium">{mode.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                {mode.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Connection settings (collapsed by default) */}
      {showSettings && (
        <section className="card space-y-4 border border-slate-600">
          <h2 className="font-bold text-white text-sm">Connection</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Provider</label>
              <div className="mt-2 flex gap-2">
                {[['ollama', 'Ollama (local)'], ['openai-compatible', 'OpenAI-compatible']].map(([id, label]) => (
                  <button
                    key={id}
                    className={settings.provider === id ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
                    onClick={() => {
                      const endpoint = id === 'ollama' ? '/ollama/api/chat' : '/.netlify/functions/ai-coach';
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
              <label className="text-xs text-slate-400">Model</label>
              <input
                className="input mt-1"
                value={settings.model}
                onChange={e => updateSetting('model', e.target.value)}
                placeholder="qwen3:latest"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Endpoint URL</label>
              <input
                className="input mt-1"
                value={settings.endpoint}
                onChange={e => updateSetting('endpoint', e.target.value)}
                placeholder="/ollama/api/chat"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">API Key (hosted providers only)</label>
              <input
                className="input mt-1"
                type="password"
                value={settings.apiKey}
                onChange={e => updateSetting('apiKey', e.target.value)}
                placeholder="Not needed for local Ollama"
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
            Local Ollama: start with <code className="bg-slate-800 px-1 rounded">ollama serve</code> and{' '}
            <code className="bg-slate-800 px-1 rounded">ollama pull qwen3:latest</code>.
            Vite proxies <code className="bg-slate-800 px-1 rounded">/ollama</code> → <code className="bg-slate-800 px-1 rounded">localhost:11434</code>.
          </div>
        </section>
      )}

      {/* Main prompt area */}
      <section className="card space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{activeMode.icon}</span>
          <div>
            <h2 className="font-bold text-white">{activeMode.label}</h2>
            <p className="text-xs text-slate-400">{activeMode.description}</p>
          </div>
        </div>

        <textarea
          className="input min-h-[140px] resize-y text-sm"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask your question or paste code for review..."
        />

        <div className="flex flex-wrap gap-2">
          {(QUICK_PROMPTS[coachMode] ?? []).map(item => (
            <button
              key={item}
              className="btn-secondary text-xs max-w-xs text-left truncate"
              onClick={() => setPrompt(item)}
              title={item}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="btn-primary w-fit"
          onClick={askCoach}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Thinking...' : `Ask Coach — ${activeMode.label}`}
        </button>
      </section>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 space-y-1">
          <div className="font-semibold">Error</div>
          <div>{error}</div>
          <div className="text-xs text-slate-400 mt-2">
            If using Ollama, make sure it is running: <code className="bg-slate-800 px-1 rounded">ollama serve</code>
          </div>
        </div>
      )}

      {answer && (
        <section ref={responseRef} className="card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeMode.icon}</span>
              <div className="text-sm font-semibold text-white">Coach Response — {activeMode.label}</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(answer)}
              className="btn-secondary text-xs"
            >
              Copy
            </button>
          </div>
          <div className="border-t border-slate-700 pt-3">
            <MarkdownResponse content={answer} />
          </div>
        </section>
      )}
    </div>
  );
}

function MarkdownResponse({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inCode = false;
  let codeLang = '';
  let codeLines = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <div key={key++} className="relative group my-3">
            {codeLang && (
              <div className="absolute top-2 right-2 text-[10px] text-slate-500 uppercase tracking-widest">
                {codeLang}
              </div>
            )}
            <pre className="code-block text-sm overflow-x-auto pr-16">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        codeLines = [];
        codeLang = '';
        inCode = false;
      } else {
        codeLang = line.slice(3).trim();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-xl font-bold text-white mt-6 mb-3">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-blue-300 mt-5 mb-2 border-b border-slate-700 pb-1">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold text-emerald-300 mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={key++} className="text-sm font-semibold text-slate-200 mt-3 mb-1">
          {line.slice(5)}
        </h4>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="border-l-4 border-blue-500 pl-4 py-1 my-3 text-slate-400 italic text-sm bg-blue-500/5 rounded-r">
          <InlineMarkdown text={line.slice(2)} />
        </blockquote>
      );
    } else if (line.match(/^(\*|-|\d+\.) /)) {
      const text = line.replace(/^(\*|-|\d+\.) /, '');
      const isOrdered = /^\d+\./.test(line);
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2 mb-1">
          <span className="text-blue-400 shrink-0 mt-0.5 text-sm">{isOrdered ? line.match(/^(\d+)/)[0] + '.' : '•'}</span>
          <p className="text-slate-300 text-sm leading-relaxed">
            <InlineMarkdown text={text} />
          </p>
        </div>
      );
    } else if (line.startsWith('---') || line.startsWith('***')) {
      elements.push(<hr key={key++} className="border-slate-700 my-4" />);
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="text-slate-300 text-sm leading-relaxed mb-2">
          <InlineMarkdown text={line} />
        </p>
      );
    } else {
      elements.push(<div key={key++} className="h-2" />);
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function InlineMarkdown({ text }) {
  // Handle **bold**, *italic*, and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={i} className="italic text-slate-200">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
