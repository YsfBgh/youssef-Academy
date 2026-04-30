export const READINESS_AREAS = [
  {
    id: 'backend',
    label: 'Backend',
    target: 85,
    sources: ['courses', 'projects', 'enterprise'],
    description: 'C#, ASP.NET Core, APIs, auth, EF Core, testing, reliability.',
  },
  {
    id: 'frontend',
    label: 'Frontend',
    target: 80,
    sources: ['courses', 'projects'],
    description: 'React, Next.js, state, forms, rendering, performance, UX polish.',
  },
  {
    id: 'database',
    label: 'Database',
    target: 75,
    sources: ['courses', 'architecture'],
    description: 'SQL design, indexes, transactions, migrations, query performance.',
  },
  {
    id: 'devops',
    label: 'DevOps',
    target: 75,
    sources: ['workflows', 'projects', 'debugging'],
    description: 'Docker, CI/CD, env vars, deployments, health checks, rollback.',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    target: 80,
    sources: ['architecture', 'enterprise'],
    description: 'System design, tradeoffs, boundaries, scaling, failure modes.',
  },
  {
    id: 'testing',
    label: 'Testing',
    target: 75,
    sources: ['codeReview', 'debugging', 'projects'],
    description: 'Unit, integration, E2E, mocks, test strategy, regression safety.',
  },
  {
    id: 'ai',
    label: 'AI Agents',
    target: 70,
    sources: ['agents'],
    description: 'Prompting, delegation, review, debugging, multi-agent workflows.',
  },
  {
    id: 'communication',
    label: 'Communication',
    target: 80,
    sources: ['interview', 'codeReview', 'architecture'],
    description: 'PR comments, design docs, product tradeoffs, senior explanations.',
  },
];

export const ENGINEER_LEVELS = [
  { id: 'junior', label: 'Junior', min: 0, max: 34, focus: 'Build fundamentals and finish guided work.' },
  { id: 'mid', label: 'Mid-Level', min: 35, max: 64, focus: 'Ship features independently and explain tradeoffs.' },
  { id: 'senior', label: 'Senior', min: 65, max: 84, focus: 'Own systems, reduce risk, mentor, and design for change.' },
  { id: 'tech-lead', label: 'Tech Lead', min: 85, max: 100, focus: 'Set direction, align teams, and make architecture decisions.' },
];

export const CAREER_CHECKLISTS = [
  {
    id: 'portfolio',
    title: 'Portfolio Readiness',
    items: [
      'One production-style .NET API with auth and tests',
      'One polished React or Next.js dashboard',
      'One Dockerized full-stack project',
      'README files with architecture, setup, screenshots, and decisions',
      'At least one project with CI/CD pipeline documentation',
    ],
  },
  {
    id: 'interview',
    title: 'Interview Readiness',
    items: [
      'Explain C# async, LINQ, OOP, SOLID, and dependency injection',
      'Solve common coding patterns without hints',
      'Design a small system with API, database, cache, and deployment plan',
      'Explain one production bug you debugged end to end',
      'Answer behavioral questions using concrete project stories',
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise Readiness',
    items: [
      'Convert requirements into tickets and acceptance criteria',
      'Open a small PR with tests and a clear description',
      'Review code for bugs, design risks, naming, and missing tests',
      'Handle a production incident with logs, rollback, and postmortem',
      'Write an architecture decision record for a real tradeoff',
    ],
  },
];

export const SENIOR_HABITS = [
  { id: 'habit-design', label: 'Write a design note before coding risky work' },
  { id: 'habit-tests', label: 'Add or update tests for every behavior change' },
  { id: 'habit-review', label: 'Review one PR or code sample with actionable notes' },
  { id: 'habit-debug', label: 'Practice one debugging workflow with evidence' },
  { id: 'habit-communicate', label: 'Explain one tradeoff in simple product language' },
  { id: 'habit-refactor', label: 'Refactor small code smells without changing behavior' },
];

export const FINAL_BOSS = {
  id: 'final-boss-enterprise-saas',
  title: 'Final Boss: Enterprise SaaS Platform',
  description: 'Build a Dockerized .NET API, SQL database, React/Next.js frontend, auth, tests, CI/CD, observability, and deployment runbook.',
  phases: [
    'Requirements and domain model',
    'Database schema and migrations',
    '.NET API with clean architecture',
    'Authentication and authorization',
    'React or Next.js dashboard',
    'Unit and integration test suite',
    'Docker and docker-compose environment',
    'GitHub Actions CI pipeline',
    'Deployment checklist and rollback plan',
    'Architecture decision records and final README',
  ],
};

export const NEXT_ACTIONS = [
  { area: 'backend', action: 'Complete one .NET project milestone and one API design quiz.' },
  { area: 'frontend', action: 'Build one React feature with state, forms, loading, and error states.' },
  { area: 'database', action: 'Design a schema, add indexes, and explain transaction boundaries.' },
  { area: 'devops', action: 'Dockerize one app and write a CI pipeline checklist.' },
  { area: 'architecture', action: 'Complete one Architecture Lab scenario with tradeoffs.' },
  { area: 'testing', action: 'Review a bad PR and identify missing test coverage.' },
  { area: 'ai', action: 'Run one AI Agents Lab simulation and compare agent roles.' },
  { area: 'communication', action: 'Write a senior-level PR review comment and design summary.' },
];
