import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register, authError, isDatabaseConfigured } = useAuth();

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
    setMessage('');
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        const result = await register(form);
        if (result?.needsConfirmation) {
          setMessage('Profile created. Confirm the email address, then log in.');
          setMode('login');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%)]" />
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 items-center justify-center font-bold text-white mb-5">
            J
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">JaDev Academy</h1>
          <p className="text-slate-300 text-lg mb-6">
            Personal engineer training with roadmaps, labs, enterprise missions, interviews, AI workflows, and a local leaderboard for your friends.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Career OS', 'Code Review', 'Debugging', 'Architecture', 'Projects', 'AI Coach'].map(item => (
              <div key={item} className="border border-slate-700 bg-slate-900/70 rounded-lg p-3 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="card border-blue-500/30 bg-slate-900/90">
          <div className="flex gap-2 mb-5">
            <button
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Login
            </button>
            <button
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === 'register' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Create Profile
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {(!isDatabaseConfigured || authError) && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                {authError || 'Database connection is not configured yet.'}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="text-xs text-slate-400">Name</label>
                <input className="input mt-1" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Youssef" />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-400">Email</label>
              <input className="input mt-1" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Password</label>
              <input className="input mt-1" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Supabase account password" />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <button className="btn-primary w-full justify-center" type="submit" disabled={submitting || !isDatabaseConfigured}>
              {submitting ? 'Please wait...' : mode === 'login' ? 'Enter Academy' : 'Create Profile'}
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            Accounts, progress, XP, and leaderboard data are stored in Supabase so friends can see each other's progress from different devices.
          </div>
        </section>
      </div>
    </div>
  );
}
