// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Daily Mission Data
// ═══════════════════════════════════════════════════════════

// Generate a deterministic daily mission based on the date
// so the same day always yields the same mission

export const DAILY_MISSION_POOLS = {
  lessons: [
    { trackId: 'csharp', lessonId: 'cs-01', title: 'C# Syntax & Type System', track: 'C# & .NET' },
    { trackId: 'csharp', lessonId: 'cs-02', title: 'OOP Fundamentals', track: 'C# & .NET' },
    { trackId: 'csharp', lessonId: 'cs-03', title: 'LINQ & Collections', track: 'C# & .NET' },
    { trackId: 'react', lessonId: 'r-01', title: 'React Components & Hooks', track: 'React' },
    { trackId: 'react', lessonId: 'r-02', title: 'State Management', track: 'React' },
    { trackId: 'apis', lessonId: 'api-01', title: 'REST API Design', track: 'REST APIs' },
    { trackId: 'oop', lessonId: 'oop-01', title: 'SOLID Principles', track: 'OOP & Patterns' },
    { trackId: 'refactoring', lessonId: 'ref-01', title: 'Clean Code Rules', track: 'Clean Code' },
  ],

  quizzes: [
    { trackId: 'csharp', title: 'C# & .NET Quiz', questions: 5 },
    { trackId: 'react', title: 'React Quiz', questions: 5 },
    { trackId: 'apis', title: 'REST APIs Quiz', questions: 5 },
    { trackId: 'oop', title: 'OOP & Patterns Quiz', questions: 5 },
    { trackId: 'sql', title: 'SQL Quiz', questions: 5 },
    { trackId: 'refactoring', title: 'Clean Code Quiz', questions: 5 },
  ],

  challenges: [
    { id: 'ch-001', title: 'FizzBuzz Pro', difficulty: 'Easy', topic: 'Loops & Conditions' },
    { id: 'ch-002', title: 'Reverse a String', difficulty: 'Easy', topic: 'Strings' },
    { id: 'ch-003', title: 'Find Duplicates in Array', difficulty: 'Easy', topic: 'Collections' },
    { id: 'ch-004', title: 'Two Sum', difficulty: 'Medium', topic: 'Hash Maps' },
    { id: 'ch-005', title: 'Valid Parentheses', difficulty: 'Medium', topic: 'Stack' },
    { id: 'ch-006', title: 'Longest Substring', difficulty: 'Medium', topic: 'Sliding Window' },
    { id: 'ch-007', title: 'Binary Search', difficulty: 'Medium', topic: 'Algorithms' },
    { id: 'ch-008', title: 'Fibonacci Memoized', difficulty: 'Medium', topic: 'Dynamic Programming' },
  ],

  workflows: [
    { id: 'wf-001', title: 'Git Branch & PR Flow', type: 'workflow' },
    { id: 'wf-002', title: 'Docker Build & Run', type: 'workflow' },
    { id: 'wf-003', title: 'REST API Design Session', type: 'workflow' },
    { id: 'wf-004', title: 'SQL Query Optimization', type: 'workflow' },
    { id: 'sim-001', title: 'Bug Triage Simulation', type: 'simulation' },
    { id: 'sim-002', title: 'Code Review Session', type: 'simulation' },
    { id: 'ent-001', title: 'Enterprise Ticket', type: 'enterprise' },
    { id: 'ent-004', title: 'Production Incident', type: 'enterprise' },
  ],
};

export const DAILY_TIPS = [
  { tip: 'Master SOLID principles — they come up in every senior dev interview.', icon: '🎯' },
  { tip: 'Practice async/await daily — production .NET code is almost always async.', icon: '⚡' },
  { tip: 'Read code more than you write — review others\' PRs actively.', icon: '🔍' },
  { tip: 'LINQ is your superpower in C# — learn every operator cold.', icon: '💡' },
  { tip: 'Design patterns are vocabulary — know them to communicate with seniors.', icon: '🏗️' },
  { tip: 'Refactoring = writing code twice. First time to solve, second time to explain.', icon: '✨' },
  { tip: 'REST is about nouns, not verbs — /products not /getProducts.', icon: '🌐' },
  { tip: 'In React, keep state as high as needed, but no higher.', icon: '⚛️' },
  { tip: 'Always add indexes on foreign key columns — unindexed JOINs will haunt you.', icon: '🗄️' },
  { tip: 'Write the test first — TDD forces you to design a better API.', icon: '🧪' },
  { tip: 'Docker Compose is your local environment contract — treat it like code.', icon: '🐳' },
  { tip: 'Use IQueryable for DB filters, IEnumerable for in-memory. Never confuse the two.', icon: '🔧' },
  { tip: 'A PR description is a cover letter for your code — write it well.', icon: '📝' },
  { tip: 'ConfigureAwait(false) in library code avoids deadlocks in sync contexts.', icon: '⚙️' },
  { tip: 'Lean on the compiler — enable nullable reference types and fix every warning.', icon: '🛡️' },
  { tip: 'Every production incident is a chance to add a test that prevents it forever.', icon: '🚨' },
  { tip: 'Naming things correctly is 80% of software design. Spend time on it.', icon: '💬' },
  { tip: 'Cache invalidation is hard. Design your cache keys so they\'re easy to purge.', icon: '🔄' },
  { tip: 'AI can write the code — your job is to know what to ask for and verify the output.', icon: '🤖' },
  { tip: 'The best code review is the one you do before you push.', icon: '👁️' },
];

export function getDailyMission(dateString) {
  // Deterministic seed from date
  const seed = dateString.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const pick = (arr, offset = 0) => arr[(seed + offset) % arr.length];

  return {
    date: dateString,
    lesson: pick(DAILY_MISSION_POOLS.lessons, 0),
    quiz: pick(DAILY_MISSION_POOLS.quizzes, 3),
    challenge: pick(DAILY_MISSION_POOLS.challenges, 7),
    workflow: pick(DAILY_MISSION_POOLS.workflows, 11),
    tip: pick(DAILY_TIPS, 0),
    xpReward: 100, // bonus XP for completing all 4
  };
}

export const MISSION_ITEMS = [
  {
    key: 'lesson',
    label: 'Daily Lesson',
    icon: '📚',
    color: 'blue',
    badge: 'bg-blue-500/20 text-blue-300',
    xp: 50,
    description: 'Complete one lesson from any track',
  },
  {
    key: 'quiz',
    label: 'Daily Quiz',
    icon: '🧠',
    color: 'violet',
    badge: 'bg-violet-500/20 text-violet-300',
    xp: 25,
    description: 'Score at least 60% on a track quiz',
  },
  {
    key: 'challenge',
    label: 'Daily Challenge',
    icon: '💻',
    color: 'emerald',
    badge: 'bg-emerald-500/20 text-emerald-300',
    xp: 100,
    description: 'Solve today\'s coding challenge',
  },
  {
    key: 'workflow',
    label: 'Daily Workflow',
    icon: '🔄',
    color: 'amber',
    badge: 'bg-amber-500/20 text-amber-300',
    xp: 75,
    description: 'Complete a workflow or simulation task',
  },
];
