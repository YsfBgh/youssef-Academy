// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Skill Tree Data
// ═══════════════════════════════════════════════════════════

export const SKILL_NODES = [
  // ─── Row 0 — Entry ─────────────────────────────────────────
  { id: 'st-start', label: 'Start Here', icon: '🚀', x: 50, y: 4, type: 'root', unlockRequires: [], color: 'blue', description: 'Your journey begins' },

  // ─── Row 1 — Absolute Basics ───────────────────────────────
  { id: 'st-cs-vars', label: 'C# Variables', icon: '📦', x: 15, y: 14, type: 'skill', unlockRequires: ['st-start'], color: 'blue', xpRequired: 0, description: 'Value types, reference types, var, const, nullable' },
  { id: 'st-cs-flow', label: 'Control Flow', icon: '🔀', x: 40, y: 14, type: 'skill', unlockRequires: ['st-start'], color: 'blue', xpRequired: 0, description: 'if/else, switch, loops, break/continue, pattern matching' },
  { id: 'st-git-init', label: 'Git Basics', icon: '🌿', x: 65, y: 14, type: 'skill', unlockRequires: ['st-start'], color: 'emerald', xpRequired: 0, description: 'init, clone, add, commit, push, pull' },
  { id: 'st-html-css', label: 'HTML & CSS', icon: '🎨', x: 88, y: 14, type: 'skill', unlockRequires: ['st-start'], color: 'amber', xpRequired: 0, description: 'Semantic HTML, Flexbox, Grid, responsive design' },

  // ─── Row 2 ─────────────────────────────────────────────────
  { id: 'st-cs-oop', label: 'OOP Basics', icon: '🏗️', x: 10, y: 28, type: 'skill', unlockRequires: ['st-cs-vars', 'st-cs-flow'], color: 'blue', xpRequired: 100, description: 'Classes, objects, constructors, access modifiers, properties' },
  { id: 'st-cs-collections', label: 'Collections & LINQ', icon: '📋', x: 35, y: 28, type: 'skill', unlockRequires: ['st-cs-vars'], color: 'blue', xpRequired: 100, description: 'List, Dictionary, IEnumerable, LINQ operators, lambda expressions' },
  { id: 'st-sql-basics', label: 'SQL Basics', icon: '🗄️', x: 58, y: 28, type: 'skill', unlockRequires: ['st-cs-flow'], color: 'amber', xpRequired: 100, description: 'SELECT, WHERE, JOINs, GROUP BY, aggregate functions' },
  { id: 'st-git-branches', label: 'Git Branching', icon: '🌳', x: 80, y: 28, type: 'skill', unlockRequires: ['st-git-init'], color: 'emerald', xpRequired: 50, description: 'branches, merge, rebase, pull requests, conflicts' },

  // ─── Row 3 ─────────────────────────────────────────────────
  { id: 'st-cs-solid', label: 'SOLID Principles', icon: '🏛️', x: 8, y: 43, type: 'milestone', unlockRequires: ['st-cs-oop', 'st-cs-collections'], color: 'violet', xpRequired: 250, description: 'Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion' },
  { id: 'st-async', label: 'Async / Await', icon: '⚡', x: 32, y: 43, type: 'skill', unlockRequires: ['st-cs-oop'], color: 'blue', xpRequired: 200, description: 'Task, async methods, await, ConfigureAwait, async streams' },
  { id: 'st-efcore', label: 'EF Core', icon: '🗃️', x: 55, y: 43, type: 'skill', unlockRequires: ['st-sql-basics', 'st-cs-oop'], color: 'amber', xpRequired: 200, description: 'DbContext, migrations, queries, relationships, loading strategies' },
  { id: 'st-react-basics', label: 'React Basics', icon: '⚛️', x: 80, y: 43, type: 'skill', unlockRequires: ['st-html-css'], color: 'emerald', xpRequired: 150, description: 'Components, JSX, useState, useEffect, props, event handling' },

  // ─── Row 4 ─────────────────────────────────────────────────
  { id: 'st-aspnet', label: 'ASP.NET Core API', icon: '🔌', x: 15, y: 58, type: 'milestone', unlockRequires: ['st-cs-solid', 'st-async', 'st-efcore'], color: 'blue', xpRequired: 400, description: 'Controllers, routing, middleware, DI, model validation, Swagger' },
  { id: 'st-patterns', label: 'Design Patterns', icon: '♟️', x: 40, y: 58, type: 'skill', unlockRequires: ['st-cs-solid'], color: 'violet', xpRequired: 350, description: 'Repository, Factory, Strategy, Observer, Decorator, CQRS' },
  { id: 'st-react-adv', label: 'React Advanced', icon: '🚀', x: 65, y: 58, type: 'skill', unlockRequires: ['st-react-basics'], color: 'emerald', xpRequired: 300, description: 'Custom hooks, useMemo, useCallback, Context, React Query' },
  { id: 'st-docker', label: 'Docker', icon: '🐳', x: 88, y: 58, type: 'skill', unlockRequires: ['st-git-branches'], color: 'cyan', xpRequired: 300, description: 'Dockerfile, images, containers, volumes, Docker Compose' },

  // ─── Row 5 ─────────────────────────────────────────────────
  { id: 'st-auth', label: 'Auth & Security', icon: '🔐', x: 8, y: 72, type: 'skill', unlockRequires: ['st-aspnet'], color: 'rose', xpRequired: 500, description: 'JWT, Identity, OAuth 2.0, RBAC, HTTPS, OWASP Top 10' },
  { id: 'st-clean-arch', label: 'Clean Architecture', icon: '🏰', x: 30, y: 72, type: 'milestone', unlockRequires: ['st-aspnet', 'st-patterns'], color: 'violet', xpRequired: 600, description: 'Layered architecture, domain model, application services, infrastructure' },
  { id: 'st-nextjs', label: 'Next.js', icon: '▲', x: 55, y: 72, type: 'skill', unlockRequires: ['st-react-adv'], color: 'emerald', xpRequired: 450, description: 'App Router, server components, SSR, SSG, API routes, deployment' },
  { id: 'st-cicd', label: 'CI/CD', icon: '🔄', x: 80, y: 72, type: 'skill', unlockRequires: ['st-docker', 'st-git-branches'], color: 'cyan', xpRequired: 450, description: 'GitHub Actions, automated testing, build pipelines, deployment stages' },

  // ─── Row 6 — Advanced ──────────────────────────────────────
  { id: 'st-microservices', label: 'Microservices', icon: '🧩', x: 15, y: 85, type: 'milestone', unlockRequires: ['st-clean-arch', 'st-docker', 'st-cicd'], color: 'rose', xpRequired: 800, description: 'Service boundaries, API gateway, message queues, distributed tracing' },
  { id: 'st-fullstack', label: 'Full-Stack Dev', icon: '🌐', x: 45, y: 85, type: 'milestone', unlockRequires: ['st-auth', 'st-nextjs', 'st-docker'], color: 'emerald', xpRequired: 900, description: 'End-to-end: .NET API + Next.js + PostgreSQL + Docker Compose' },
  { id: 'st-ai-agents', label: 'AI Agent Workflows', icon: '🤖', x: 75, y: 85, type: 'milestone', unlockRequires: ['st-clean-arch', 'st-cicd'], color: 'violet', xpRequired: 1000, description: 'Prompt engineering, multi-agent workflows, AI-assisted development' },

  // ─── Row 7 — Final Boss ────────────────────────────────────
  { id: 'st-senior', label: 'Senior Developer', icon: '🏆', x: 50, y: 96, type: 'legendary', unlockRequires: ['st-microservices', 'st-fullstack', 'st-ai-agents'], color: 'amber', xpRequired: 2000, description: 'You have mastered the full stack. Architect, lead, and ship production software.' },
];

export const SKILL_CONNECTIONS = [
  ['st-start', 'st-cs-vars'],
  ['st-start', 'st-cs-flow'],
  ['st-start', 'st-git-init'],
  ['st-start', 'st-html-css'],
  ['st-cs-vars', 'st-cs-oop'],
  ['st-cs-vars', 'st-cs-collections'],
  ['st-cs-flow', 'st-cs-oop'],
  ['st-cs-flow', 'st-sql-basics'],
  ['st-git-init', 'st-git-branches'],
  ['st-html-css', 'st-react-basics'],
  ['st-cs-oop', 'st-cs-solid'],
  ['st-cs-oop', 'st-async'],
  ['st-cs-collections', 'st-cs-solid'],
  ['st-sql-basics', 'st-efcore'],
  ['st-cs-oop', 'st-efcore'],
  ['st-git-branches', 'st-docker'],
  ['st-cs-solid', 'st-aspnet'],
  ['st-async', 'st-aspnet'],
  ['st-efcore', 'st-aspnet'],
  ['st-cs-solid', 'st-patterns'],
  ['st-react-basics', 'st-react-adv'],
  ['st-aspnet', 'st-auth'],
  ['st-aspnet', 'st-clean-arch'],
  ['st-patterns', 'st-clean-arch'],
  ['st-react-adv', 'st-nextjs'],
  ['st-docker', 'st-cicd'],
  ['st-git-branches', 'st-cicd'],
  ['st-clean-arch', 'st-microservices'],
  ['st-docker', 'st-microservices'],
  ['st-cicd', 'st-microservices'],
  ['st-auth', 'st-fullstack'],
  ['st-nextjs', 'st-fullstack'],
  ['st-docker', 'st-fullstack'],
  ['st-clean-arch', 'st-ai-agents'],
  ['st-cicd', 'st-ai-agents'],
  ['st-microservices', 'st-senior'],
  ['st-fullstack', 'st-senior'],
  ['st-ai-agents', 'st-senior'],
];

export const SKILL_TYPE_STYLES = {
  root: 'border-2 border-blue-400 bg-blue-900/50',
  skill: 'border border-slate-600 bg-slate-800',
  milestone: 'border-2 border-violet-400 bg-violet-900/40',
  legendary: 'border-2 border-amber-400 bg-amber-900/50 shadow-lg shadow-amber-500/20',
};

export function getNodeById(id) {
  return SKILL_NODES.find(n => n.id === id);
}

export function getUnlockedNodes(xp, completedSkillIds = []) {
  return SKILL_NODES.filter(node => {
    if (node.type === 'root') return true;
    if (node.xpRequired && xp < node.xpRequired) return false;
    if (node.unlockRequires.length === 0) return true;
    return node.unlockRequires.every(req => completedSkillIds.includes(req));
  });
}
