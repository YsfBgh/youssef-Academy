import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Bot,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Bug,
  Building2,
  CalendarCheck,
  Code2,
  FolderKanban,
  Gamepad2,
  GitPullRequest,
  Home,
  LogOut,
  Map,
  Menu,
  Mic,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Sparkles,
  Trophy,
  Workflow,
  X,
} from 'lucide-react';
import { useProgress } from '../utils/ProgressContext';
import { useAuth } from '../utils/AuthContext';

const NAV_SECTIONS = [
  {
    label: 'Home',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/career', label: 'Career OS', icon: BriefcaseBusiness },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/aicoach', label: 'AI Coach', icon: Bot },
      { to: '/daily', label: 'Daily Mission', icon: CalendarCheck },
      { to: '/roadmap', label: 'Roadmap', icon: Map },
      { to: '/skilltree', label: 'Skill Tree', icon: Network },
    ],
  },
  {
    label: 'Learn',
    items: [
      { to: '/courses', label: 'Courses', icon: BookOpen },
      { to: '/quiz', label: 'Quizzes', icon: Brain },
      { to: '/codelab', label: 'Code Lab', icon: Code2 },
      { to: '/codereview', label: 'Code Review Lab', icon: GitPullRequest },
      { to: '/debugging', label: 'Debugging Lab', icon: Bug },
      { to: '/architecture', label: 'Architecture Lab', icon: Route },
      { to: '/interview', label: 'Interview Mode', icon: Mic },
    ],
  },
  {
    label: 'Build',
    items: [
      { to: '/projects', label: 'Project Lab', icon: FolderKanban },
      { to: '/workflows', label: 'Workflow Lab', icon: Workflow },
      { to: '/simulations', label: 'Simulations', icon: Gamepad2 },
      { to: '/enterprise', label: 'Enterprise Sim', icon: Building2 },
      { to: '/aiagents', label: 'AI Agents Lab', icon: Sparkles },
    ],
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getXP, getStreak, updateStreak } = useProgress();
  const { currentUser, logout } = useAuth();

  useEffect(() => { updateStreak(); }, []);

  const xp = getXP();
  const level = Math.floor(xp / 500) + 1;
  const levelProgress = (xp % 500) / 500 * 100;
  const userName = currentUser?.name ?? 'Developer';
  const showSidebarLabels = sidebarOpen || mobileOpen;

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-slate-100 lg:flex">
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/85 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 text-sm font-black text-white shadow-lg shadow-blue-950/40">
            J
          </div>
          <div>
            <div className="text-sm font-bold text-white">JaDev Academy</div>
            <div className="text-xs text-slate-400">Level {level} Dev</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="icon-tile"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside className={`${sidebarOpen ? 'lg:w-64' : 'lg:w-20'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed inset-y-0 left-0 z-40 flex w-72 flex-shrink-0 flex-col border-r border-white/10 bg-slate-950/90 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 lg:relative lg:shadow-none`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 text-sm font-black text-white shadow-lg shadow-blue-950/40">
            J
          </div>
          {showSidebarLabels && (
            <div className="min-w-0 overflow-hidden">
              <div className="truncate text-sm font-bold leading-tight text-white">JaDev Academy</div>
              <div className="truncate text-xs text-slate-400">Zero to Hero Platform</div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              {showSidebarLabels && (
                <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {section.label}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={!showSidebarLabels ? item.label : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? 'border border-blue-400/30 bg-blue-500/15 text-white shadow-sm shadow-blue-950/40'
                            : 'border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-slate-100'
                        } ${showSidebarLabels ? '' : 'lg:justify-center lg:px-0'}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-slate-100'}`}>
                            <Icon size={16} />
                          </span>
                          {showSidebarLabels && <span className="truncate">{item.label}</span>}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {showSidebarLabels && (
          <div className="border-t border-white/10 p-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{userName}</div>
                  <div className="text-xs text-slate-400">Level {level} Developer</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-300">{xp} XP</div>
                  <div className="text-xs text-amber-300">{getStreak()}d streak</div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-slate-500">{Math.round(levelProgress)}% to Lv {level + 1}</div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(o => !o)}
            className="hidden w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-200 lg:flex"
          >
            {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            {sidebarOpen && 'Collapse'}
          </button>
          <button
            type="button"
            onClick={logout}
            className={`${showSidebarLabels ? 'justify-center' : 'lg:justify-center'} mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300`}
          >
            <LogOut size={15} />
            {showSidebarLabels && 'Logout'}
          </button>
        </div>
      </aside>

      <main className="h-screen flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="mx-auto min-h-full w-full px-4 py-5 sm:px-6 lg:px-8 animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
