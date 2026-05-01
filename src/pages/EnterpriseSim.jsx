import React, { useState, useRef, useEffect } from 'react';
import { MISSIONS, COMPANY, MISSION_TYPE_LABELS } from '../data/enterprise';
import { useProgress } from '../utils/ProgressContext';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Building2,
  CheckCircle2, ChevronRight, Code2, GitPullRequest,
  Hash, MessageSquare, Send, Terminal, User, Zap,
} from 'lucide-react';

const PRIORITY_COLORS = {
  Critical: 'mission-card-critical',
  High:     'mission-card-high',
  Medium:   'mission-card-medium',
  Low:      'mission-card-low',
};

const PRIORITY_BADGE = {
  Critical: 'bg-red-500/20 text-red-300 border-red-500/40',
  High:     'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Medium:   'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Low:      'bg-slate-600/50 text-slate-400',
};

// ── Slack-style team chat ──────────────────────────────────
function TeamChat({ mission }) {
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState(() => generateInitialChat(mission));
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  function send() {
    if (!msg.trim()) return;
    setHistory(h => [...h, { from: 'you', text: msg.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMsg('');
    // Auto-reply after 1.2s
    setTimeout(() => {
      const replies = [
        { from: 'Sofia Chen', text: "Good thinking. Make sure to check the edge cases too.", avatar: '👩‍💼' },
        { from: 'Marcus Webb', text: "Sounds right to me. Want me to pair on it?", avatar: '👨‍💻' },
        { from: 'Lena Fischer', text: "I'll add a test case for that scenario in the QA suite.", avatar: '👩‍🔬' },
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setHistory(h => [...h, { ...reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  }

  return (
    <div className="card border-slate-700/50 flex flex-col" style={{ height: 320 }}>
      <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-3">
        <Hash size={14} className="text-slate-500" />
        <span className="terminal-header text-slate-400">TEAM CHANNEL — {COMPANY.currentSprint.toUpperCase()}</span>
        <span className="ml-auto status-indicator text-emerald-400">
          <span className="status-dot status-dot-online" /> {COMPANY.team.length} ONLINE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {history.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'you' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${m.from === 'you' ? 'bg-blue-600' : 'bg-slate-700'}`}>
              {m.from === 'you' ? '🧑‍💻' : m.avatar ?? '👤'}
            </div>
            <div className={`max-w-[75%] ${m.from === 'you' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
              {m.from !== 'you' && <span className="text-xs text-slate-500 font-semibold">{m.from}</span>}
              <div className={`px-3 py-2 rounded-lg text-xs leading-relaxed ${
                m.from === 'you'
                  ? 'bg-blue-600/80 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/8'
              }`}>
                {m.text}
              </div>
              <span className="text-xs text-slate-600 font-mono">{m.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="input text-xs flex-1 py-2"
          placeholder="Message the team..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="btn-primary py-2 px-3">
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}

function generateInitialChat(mission) {
  const time = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const base = [
    { from: 'Sofia Chen', avatar: '👩‍💼', time: time(9, 2), text: `Sprint ${COMPANY.currentSprint} kickoff. Everyone focus on priority tickets first.` },
    { from: 'Marcus Webb', avatar: '👨‍💻', time: time(9, 5), text: `Picking up ${mission.title}. I'll pair with you on this one.` },
    { from: 'Priya Patel', avatar: '👩‍💻', time: time(9, 11), text: 'Frontend is unblocked. Let me know when the API contract is ready.' },
  ];
  if (mission.priority === 'Critical') {
    base.push({ from: 'James Torres', avatar: '🧑‍🔧', time: time(9, 14), text: '🚨 This one is blocking the deploy pipeline. Needs same-day resolution.' });
  }
  return base;
}

// ── PR Diff Viewer ─────────────────────────────────────────
function PRDiffView({ mission }) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentLine, setCommentLine] = useState(null);

  const files = [
    {
      name: `src/Controllers/${(mission.title.split(' ')[0])}Controller.cs`,
      additions: 24,
      deletions: 8,
      lines: buildDiffLines(mission),
    },
    {
      name: 'tests/UnitTests.cs',
      additions: 18,
      deletions: 2,
      lines: [
        { type: 'context', content: '[TestClass]' },
        { type: 'context', content: 'public class ControllerTests {' },
        { type: 'add',     content: '    [TestMethod]' },
        { type: 'add',     content: '    public async Task Should_Return_Paged_Result()' },
        { type: 'add',     content: '    {' },
        { type: 'add',     content: '        // Arrange' },
        { type: 'add',     content: '        var svc = new MockService();' },
        { type: 'add',     content: '        // Act' },
        { type: 'add',     content: '        var result = await svc.GetAsync(cursor: null, pageSize: 20);' },
        { type: 'add',     content: '        // Assert' },
        { type: 'add',     content: '        Assert.AreEqual(20, result.Data.Count);' },
        { type: 'add',     content: '    }' },
        { type: 'context', content: '}' },
      ],
    },
  ];

  const file = files[selectedFile];

  function addComment(lineIdx) {
    if (!newComment.trim()) return;
    setComments(c => ({
      ...c,
      [`${selectedFile}-${lineIdx}`]: [...(c[`${selectedFile}-${lineIdx}`] ?? []), { author: 'You', text: newComment.trim() }],
    }));
    setNewComment('');
    setCommentLine(null);
  }

  return (
    <div className="space-y-3">
      <div className="card p-3">
        <div className="terminal-header text-amber-400 mb-2">◈ PULL REQUEST DIFF VIEWER</div>
        <div className="flex gap-2 flex-wrap">
          {files.map((f, i) => (
            <button key={i} onClick={() => setSelectedFile(i)}
              className={`text-xs px-3 py-1.5 rounded border transition-all ${
                selectedFile === i
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
              }`}>
              {f.name.split('/').pop()}
              <span className="ml-2 text-emerald-400">+{f.additions}</span>
              <span className="ml-1 text-red-400">-{f.deletions}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/80 border-b border-white/10">
          <Code2 size={13} className="text-slate-400" />
          <span className="text-xs text-slate-300 font-mono">{file.name}</span>
        </div>
        <div className="overflow-x-auto">
          {file.lines.map((line, i) => (
            <div key={i}>
              <div
                className={`flex items-start group cursor-pointer text-xs font-mono ${
                  line.type === 'add'    ? 'bg-emerald-950/40 hover:bg-emerald-950/60' :
                  line.type === 'remove' ? 'bg-red-950/40 hover:bg-red-950/60' :
                  'hover:bg-slate-800/40'
                }`}
                onClick={() => setCommentLine(commentLine === i ? null : i)}
              >
                <span className="w-8 text-center text-slate-600 select-none flex-shrink-0 py-1">{i + 1}</span>
                <span className={`w-4 text-center flex-shrink-0 py-1 ${
                  line.type === 'add' ? 'text-emerald-400' : line.type === 'remove' ? 'text-red-400' : 'text-slate-600'
                }`}>
                  {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                </span>
                <span className={`flex-1 px-2 py-1 leading-relaxed ${
                  line.type === 'add' ? 'text-emerald-200' : line.type === 'remove' ? 'text-red-300' : 'text-slate-300'
                }`}>
                  {line.content}
                </span>
                <span className="opacity-0 group-hover:opacity-100 text-slate-600 py-1 px-2 text-xs transition-opacity">
                  + comment
                </span>
              </div>
              {commentLine === i && (
                <div className="bg-slate-900/80 border-y border-blue-500/30 px-4 py-3">
                  <textarea
                    className="input text-xs min-h-[60px] resize-none"
                    placeholder="Leave a code review comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => addComment(i)} className="btn-primary text-xs py-1.5">Comment</button>
                    <button onClick={() => setCommentLine(null)} className="btn-secondary text-xs py-1.5">Cancel</button>
                  </div>
                </div>
              )}
              {comments[`${selectedFile}-${i}`]?.map((c, j) => (
                <div key={j} className="bg-blue-950/30 border-l-2 border-blue-500/50 px-4 py-2 text-xs text-slate-300">
                  <span className="font-bold text-blue-300 mr-2">{c.author}:</span>{c.text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildDiffLines(mission) {
  const title = mission.title?.toLowerCase() ?? '';
  if (title.includes('pagination') || title.includes('paged')) {
    return [
      { type: 'context', content: '[HttpGet]' },
      { type: 'remove',  content: 'public async Task<List<ProjectDto>> GetProjects()' },
      { type: 'add',     content: 'public async Task<PagedResult<ProjectDto>> GetProjects(' },
      { type: 'add',     content: '    [FromQuery] string? cursor = null,' },
      { type: 'add',     content: '    [FromQuery] int pageSize = 20)' },
      { type: 'context', content: '{' },
      { type: 'remove',  content: '    return await _db.Projects.Select(p => p.ToDto()).ToListAsync();' },
      { type: 'add',     content: '    pageSize = Math.Clamp(pageSize, 1, 100);' },
      { type: 'add',     content: '    var lastId = DecodeCursor(cursor);' },
      { type: 'add',     content: '    var items = await _db.Projects' },
      { type: 'add',     content: '        .Where(p => lastId == null || p.Id > lastId)' },
      { type: 'add',     content: '        .OrderBy(p => p.Id)' },
      { type: 'add',     content: '        .Take(pageSize + 1)' },
      { type: 'add',     content: '        .Select(p => p.ToDto())' },
      { type: 'add',     content: '        .ToListAsync();' },
      { type: 'add',     content: '    var hasMore = items.Count > pageSize;' },
      { type: 'add',     content: '    return new PagedResult<ProjectDto> {' },
      { type: 'add',     content: '        Data = items.Take(pageSize).ToList(),' },
      { type: 'add',     content: '        NextCursor = hasMore ? EncodeCursor(items[pageSize - 1].Id) : null' },
      { type: 'add',     content: '    };' },
      { type: 'context', content: '}' },
    ];
  }
  return [
    { type: 'context', content: 'public class ServiceImplementation {' },
    { type: 'remove',  content: '    // TODO: implement' },
    { type: 'add',     content: '    private readonly IRepository _repo;' },
    { type: 'add',     content: '    private readonly ILogger<ServiceImplementation> _logger;' },
    { type: 'context', content: '' },
    { type: 'add',     content: '    public ServiceImplementation(IRepository repo, ILogger<ServiceImplementation> logger)' },
    { type: 'add',     content: '    {' },
    { type: 'add',     content: '        _repo = repo ?? throw new ArgumentNullException(nameof(repo));' },
    { type: 'add',     content: '        _logger = logger;' },
    { type: 'add',     content: '    }' },
    { type: 'context', content: '}' },
  ];
}

// ── Incident Command Panel ─────────────────────────────────
function IncidentPanel({ mission }) {
  const [phase, setPhase] = useState('triage');
  const phases = [
    { id: 'triage',      label: '① Triage',    color: 'text-red-400' },
    { id: 'contain',     label: '② Contain',   color: 'text-amber-400' },
    { id: 'diagnose',    label: '③ Diagnose',  color: 'text-blue-400' },
    { id: 'fix',         label: '④ Fix',       color: 'text-violet-400' },
    { id: 'postmortem',  label: '⑤ Postmortem', color: 'text-emerald-400' },
  ];
  const content = {
    triage:     { label: 'INCIDENT TRIAGE', body: `Severity: ${mission.priority}. Scope: production. Affected: all users hitting ${mission.title.split(' ').slice(-2).join(' ')}. Assign IC (Incident Commander), start the incident thread, and set a comms cadence.`, color: 'callout-danger' },
    contain:    { label: 'CONTAIN THE BLAST RADIUS', body: 'Can you toggle a feature flag? Revert the last deploy? Rate-limit the affected endpoint? The goal is to stop the bleeding before you understand the cause.', color: 'callout-warn' },
    diagnose:   { label: 'ROOT CAUSE ANALYSIS', body: 'Pull logs from the 30 minutes before the incident started. Identify the last change deployed. Form a hypothesis and verify it with evidence before assuming you found the cause.', color: 'callout-info' },
    fix:        { label: 'APPLY THE FIX', body: 'Write the minimal change. Review it with one other engineer. Deploy to staging first, verify, then deploy to production with rollback plan ready.', color: 'callout-info' },
    postmortem: { label: 'BLAMELESS POSTMORTEM', body: 'Document: timeline, root cause, impact duration, what went well, what failed, and action items with owners and due dates. Share with the whole team within 48 hours.', color: 'callout-success' },
  };
  const current = content[phase];

  return (
    <div className="card border-red-500/20 space-y-3">
      <div className="terminal-header text-red-400">🚨 INCIDENT COMMAND MODE</div>
      <div className="flex gap-1 flex-wrap">
        {phases.map(p => (
          <button key={p.id} onClick={() => setPhase(p.id)}
            className={`text-xs px-2.5 py-1.5 rounded border transition-all ${
              phase === p.id ? 'bg-slate-700 border-white/20 text-white' : `border-white/10 bg-white/5 ${p.color} hover:bg-white/10`
            }`}>
            {p.label}
          </button>
        ))}
      </div>
      <div className={current.color}>
        <div className="font-bold mb-1">{current.label}</div>
        {current.body}
      </div>
    </div>
  );
}

// ── Mission Detail View ────────────────────────────────────
function MissionDetail({ mission, onBack, isComplete, onComplete }) {
  const [activeStep, setActiveStep]   = useState(0);
  const [stepAnswer, setStepAnswer]   = useState('');
  const [revealed, setRevealed]       = useState(false);
  const [stepsDone, setStepsDone]     = useState([]);
  const [view, setView]               = useState('mission'); // mission | chat | pr | incident
  const [missionDone, setMissionDone] = useState(false);

  const step = mission.steps[activeStep];
  const pct  = Math.round((activeStep / mission.steps.length) * 100);
  const typeInfo = MISSION_TYPE_LABELS[mission.type] ?? { icon: '📋', label: mission.type };

  function handleNext() {
    const newDone = [...stepsDone, activeStep];
    setStepsDone(newDone);
    if (activeStep < mission.steps.length - 1) {
      setActiveStep(prev => prev + 1);
      setStepAnswer('');
      setRevealed(false);
    } else {
      onComplete(mission.id, mission.xpReward);
      setMissionDone(true);
    }
  }

  if (missionDone) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-5 py-8">
        <div className="text-5xl">🎉</div>
        <div className="terminal-header text-emerald-400 text-center">◈ MISSION COMPLETE</div>
        <h2 className="text-2xl font-black text-white">{mission.title}</h2>
        <div className="card border-emerald-500/30 bg-emerald-600/10">
          <div className="text-4xl font-black text-emerald-400">+{mission.xpReward} XP</div>
          <div className="text-slate-400 mt-1 text-sm">Credited to your profile</div>
        </div>
        <div className="flex gap-3 justify-center">
          <button className="btn-primary" onClick={onBack}>← Sprint Board</button>
          <button className="btn-secondary" onClick={() => { setMissionDone(false); setActiveStep(0); setStepAnswer(''); setRevealed(false); setStepsDone([]); }}>
            Replay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="terminal-panel">
        <div className="flex items-center gap-3 flex-wrap">
          <button className="btn-secondary py-1.5 px-3 text-xs" onClick={onBack}>← Board</button>
          <span className={`badge border ${PRIORITY_BADGE[mission.priority]}`}>{mission.priority}</span>
          <span className="badge bg-slate-700 text-slate-300">{typeInfo.icon} {typeInfo.label}</span>
          {isComplete && <span className="badge bg-violet-500/20 text-violet-300">✓ Completed</span>}
          <span className="ml-auto terminal-header text-slate-400">{typeInfo.icon} {mission.assignee}</span>
        </div>
        <h1 className="text-xl font-black text-white mt-2">{mission.title}</h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="terminal-header text-slate-500">STEP {activeStep + 1}/{mission.steps.length}</span>
          <div className="threat-bar-wrap flex-1">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all" style={{ width: `${Math.max(2, pct)}%` }} />
          </div>
          <span className="terminal-header text-emerald-400">{pct}%</span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-slate-900/80 rounded-lg p-1 border border-white/8 flex-wrap">
        {[
          { id: 'mission',  label: '⬡ Mission Steps', show: true },
          { id: 'chat',     label: '💬 Team Chat',   show: true },
          { id: 'pr',       label: '⌥ PR Diff',      show: mission.type === 'pr' || mission.type === 'ticket' },
          { id: 'incident', label: '🚨 Incident Cmd', show: mission.priority === 'Critical' },
        ].filter(t => t.show).map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`py-2 px-3 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
              view === t.id ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Mission description */}
      {view === 'mission' && (
        <div className="space-y-4">
          <div className="card">
            <div className="terminal-header text-blue-400 mb-2">◈ TICKET DESCRIPTION</div>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{mission.description}</p>
          </div>

          {/* Current step */}
          <div className="card border-blue-500/30 bg-blue-500/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="terminal-header text-blue-400 mb-1">
                  ◈ STEP {activeStep + 1} — {stepsDone.includes(activeStep) ? 'DONE' : 'IN PROGRESS'}
                </div>
                <p className="text-white font-semibold text-sm leading-relaxed">{step.instruction}</p>
              </div>
              <span className="badge bg-blue-500/20 text-blue-300 flex-shrink-0">+{step.points} pts</span>
            </div>

            <div className="mt-4">
              <textarea
                className="input min-h-[120px] resize-y text-sm"
                value={stepAnswer}
                onChange={e => setStepAnswer(e.target.value)}
                placeholder="Type your answer, approach, or code here..."
              />
            </div>

            {!revealed && (
              <div className="mt-2 callout-info">
                <span className="font-semibold text-blue-300">HINT: </span>{step.hint}
              </div>
            )}

            {revealed && (
              <div className="mt-2 space-y-2">
                <div className="callout-success">
                  <span className="font-semibold text-emerald-300">SENIOR ANSWER: </span>
                </div>
                <pre className="code-block text-xs overflow-x-auto">{step.answer}</pre>
              </div>
            )}

            <div className="mt-3 flex gap-2 flex-wrap">
              {!revealed && (
                <button className="btn-secondary text-xs py-1.5" onClick={() => setRevealed(true)}>
                  Reveal Answer
                </button>
              )}
              <button
                className="btn-primary text-xs py-1.5"
                onClick={handleNext}
                disabled={!stepAnswer.trim() && !revealed}
              >
                {activeStep < mission.steps.length - 1 ? 'Next Step →' : 'Complete Mission ✓'}
              </button>
            </div>
          </div>

          {/* Completed steps */}
          {stepsDone.length > 0 && (
            <div className="card bg-slate-900/40">
              <div className="terminal-header text-emerald-400 mb-2">◈ COMPLETED STEPS</div>
              {stepsDone.map(si => (
                <div key={si} className="flex items-center gap-2 text-xs text-slate-400 py-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Step {si + 1}: {mission.steps[si].instruction.slice(0, 60)}...
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'chat'     && <TeamChat     mission={mission} />}
      {view === 'pr'       && <PRDiffView   mission={mission} />}
      {view === 'incident' && <IncidentPanel mission={mission} />}
    </div>
  );
}

// ── Sprint Board ───────────────────────────────────────────
export default function EnterpriseSim() {
  const [view, setView]                     = useState('board');
  const [selectedMission, setSelectedMission] = useState(null);
  const [filter, setFilter]                 = useState('all');
  const { isEnterpriseMissionComplete, markEnterpriseMissionComplete } = useProgress();

  const filtered = filter === 'all' ? MISSIONS : MISSIONS.filter(m => m.type === filter);
  const typeKeys = ['all', ...new Set(MISSIONS.map(m => m.type))];

  function openMission(mission) {
    setSelectedMission(mission);
    setView('mission');
  }

  if (view === 'mission' && selectedMission) {
    return (
      <MissionDetail
        mission={selectedMission}
        onBack={() => setView('board')}
        isComplete={isEnterpriseMissionComplete(selectedMission.id)}
        onComplete={markEnterpriseMissionComplete}
      />
    );
  }

  const completedCount = MISSIONS.filter(m => isEnterpriseMissionComplete(m.id)).length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="terminal-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="terminal-header text-emerald-400">◈ NEXACORE SOLUTIONS // SPRINT BOARD</span>
            <span className="terminal-header text-slate-600">|</span>
            <span className="terminal-header text-slate-400">{COMPANY.currentSprint.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="status-indicator text-emerald-400">
              <span className="status-dot status-dot-online" /> DEV ENVIRONMENT
            </span>
            <span className="terminal-header text-slate-400">{completedCount}/{MISSIONS.length} CLOSED</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <span className="text-slate-400">SPRINT GOAL: </span>{COMPANY.sprintGoal}
        </p>
      </div>

      {/* Team Bar */}
      <div className="card py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="terminal-header text-slate-400">TEAM:</span>
          {COMPANY.team.map(member => (
            <div key={member.name} className="flex items-center gap-1.5 text-xs">
              <span className="text-base">{member.avatar}</span>
              <div>
                <div className="text-white font-semibold leading-tight">{member.name.split(' ')[0]}</div>
                <div className="text-slate-500 leading-tight">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-slate-900/80 rounded-lg p-1 border border-white/8 overflow-x-auto">
        {typeKeys.map(key => {
          const info = key === 'all' ? { icon: '◈', label: 'All Tickets' } : MISSION_TYPE_LABELS[key];
          return (
            <button key={key} onClick={() => setFilter(key)}
              className={`py-2 px-3 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                filter === key ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {info?.icon} {info?.label ?? key}
            </button>
          );
        })}
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(mission => {
          const done     = isEnterpriseMissionComplete(mission.id);
          const typeInfo = MISSION_TYPE_LABELS[mission.type] ?? { icon: '📋', label: mission.type };
          return (
            <button
              key={mission.id}
              onClick={() => openMission(mission)}
              className={`mission-card ${done ? 'mission-card-complete' : PRIORITY_COLORS[mission.priority] ?? 'mission-card-low'} w-full text-left group hover:shadow-lg hover:shadow-black/30 transition-shadow`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-500 font-mono">{typeInfo.icon}</span>
                  <span className="badge bg-slate-800 text-slate-400 text-xs border-0">{typeInfo.label}</span>
                  <span className={`badge border text-xs ${PRIORITY_BADGE[mission.priority]}`}>{mission.priority}</span>
                </div>
                {done && <CheckCircle2 size={14} className="text-violet-400 flex-shrink-0" />}
              </div>
              <h3 className="text-sm font-bold text-white leading-tight group-hover:text-blue-200 transition-colors mb-2">
                {mission.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {mission.description?.slice(0, 100)}...
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User size={11} />
                  <span>{mission.assignee}</span>
                  <span>·</span>
                  <span>{mission.points} pts</span>
                </div>
                <span className="text-xs font-bold text-blue-400">+{mission.xpReward} XP →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
