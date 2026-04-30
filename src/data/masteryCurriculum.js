export const TECH_AREAS = [
  {
    id: 'programming-foundations',
    title: 'Programming Foundations',
    level: 'Core',
    focus: 'Variables, control flow, functions, data structures, algorithms, debugging, Git basics.',
    outcomes: [
      'Read unfamiliar code without panic',
      'Solve small problems with clean functions',
      'Explain time and space tradeoffs in simple terms',
    ],
  },
  {
    id: 'csharp-dotnet',
    title: 'C# and .NET',
    level: 'Backend',
    focus: 'C# syntax, OOP, LINQ, async, exceptions, collections, testing, runtime behavior.',
    outcomes: [
      'Build console tools and service classes',
      'Use modern C# features intentionally',
      'Write testable domain logic',
    ],
  },
  {
    id: 'aspnet-api',
    title: 'ASP.NET Core APIs',
    level: 'Backend',
    focus: 'Minimal APIs, controllers, dependency injection, middleware, validation, auth, logging.',
    outcomes: [
      'Ship a CRUD API with validation and errors',
      'Protect endpoints with authentication and authorization',
      'Structure APIs like production services',
    ],
  },
  {
    id: 'database',
    title: 'SQL, PostgreSQL, and EF Core',
    level: 'Data',
    focus: 'Schema design, SQL queries, joins, indexes, migrations, transactions, EF Core performance.',
    outcomes: [
      'Design relational data models',
      'Write useful SQL without relying only on an ORM',
      'Avoid common EF Core performance traps',
    ],
  },
  {
    id: 'frontend-foundations',
    title: 'HTML, CSS, JavaScript, and TypeScript',
    level: 'Frontend',
    focus: 'Semantic HTML, responsive CSS, DOM, modern JavaScript, TypeScript types.',
    outcomes: [
      'Build accessible responsive pages',
      'Understand browser behavior and events',
      'Use TypeScript to prevent common frontend bugs',
    ],
  },
  {
    id: 'react-next',
    title: 'React and Next.js',
    level: 'Frontend',
    focus: 'Components, hooks, forms, data fetching, routing, server components, performance.',
    outcomes: [
      'Build real dashboards and forms',
      'Choose client, server, and cached rendering correctly',
      'Debug render and state problems',
    ],
  },
  {
    id: 'testing-quality',
    title: 'Testing and Code Quality',
    level: 'Professional',
    focus: 'Unit tests, integration tests, API tests, code review, refactoring, clean architecture.',
    outcomes: [
      'Add tests around risky behavior',
      'Review code for maintainability and defects',
      'Refactor without breaking behavior',
    ],
  },
  {
    id: 'devops-cloud',
    title: 'DevOps, Cloud, and Delivery',
    level: 'Professional',
    focus: 'Git workflow, CI/CD, Docker, deployment, logs, monitoring, environment variables.',
    outcomes: [
      'Deploy apps repeatedly without manual guesswork',
      'Debug production failures from logs and metrics',
      'Keep secrets out of frontend bundles and repos',
    ],
  },
  {
    id: 'security',
    title: 'Security and Reliability',
    level: 'Professional',
    focus: 'OWASP basics, authentication, authorization, input validation, rate limits, backups.',
    outcomes: [
      'Recognize common web security bugs',
      'Design safer auth and permission checks',
      'Plan for failure and recovery',
    ],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering Workflow',
    level: 'Advanced',
    focus: 'Prompting, code review with AI, retrieval, agents, evaluation, responsible API usage.',
    outcomes: [
      'Use AI as a tutor without skipping practice',
      'Build small AI-powered developer workflows',
      'Evaluate model output instead of trusting it blindly',
    ],
  },
];

export const EXTERNAL_RESOURCE_LIBRARY = {
  csharp: [
    { label: 'Microsoft Learn: C# documentation', type: 'Docs', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
    { label: 'YouTube search: freeCodeCamp C# full course', type: 'Video course', url: 'https://www.youtube.com/results?search_query=freecodecamp+c%23+full+course' },
  ],
  react: [
    { label: 'React official learning path', type: 'Docs', url: 'https://react.dev/learn' },
    { label: 'YouTube search: freeCodeCamp React full course', type: 'Video course', url: 'https://www.youtube.com/results?search_query=freecodecamp+react+full+course' },
  ],
  nextjs: [
    { label: 'Next.js Learn', type: 'Docs', url: 'https://nextjs.org/learn' },
    { label: 'Next.js App Router docs', type: 'Docs', url: 'https://nextjs.org/docs/app' },
  ],
  rest: [
    { label: 'Microsoft Learn: ASP.NET Core', type: 'Docs', url: 'https://learn.microsoft.com/en-us/aspnet/core/' },
    { label: 'MDN: HTTP overview', type: 'Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
  ],
  oop: [
    { label: 'Microsoft Learn: Object-oriented programming in C#', type: 'Docs', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop' },
    { label: 'Refactoring Guru: Design patterns catalog', type: 'Reference', url: 'https://refactoring.guru/design-patterns/catalog' },
  ],
  clean: [
    { label: 'Refactoring Guru: Code smells', type: 'Reference', url: 'https://refactoring.guru/refactoring/smells' },
    { label: 'Microsoft Learn: Unit testing C#', type: 'Docs', url: 'https://learn.microsoft.com/en-us/dotnet/core/testing/' },
  ],
  default: [
    { label: 'MDN Web Docs', type: 'Docs', url: 'https://developer.mozilla.org/en-US/' },
    { label: 'GitHub Docs: Get started', type: 'Docs', url: 'https://docs.github.com/en/get-started' },
  ],
};

export const MASTERY_METHOD = [
  {
    title: '1. Diagnose',
    body: 'Start each track by identifying weak spots. Do not study everything equally; study the parts that block projects.',
  },
  {
    title: '2. Learn the mental model',
    body: 'Before memorizing syntax, explain the problem the concept solves and when it should not be used.',
  },
  {
    title: '3. Follow a worked example',
    body: 'Trace a correct solution line by line until the control flow, data shape, and failure cases are clear.',
  },
  {
    title: '4. Practice with constraints',
    body: 'Solve a smaller task with requirements, edge cases, and a time box. This converts passive reading into skill.',
  },
  {
    title: '5. Build a project slice',
    body: 'Apply the concept inside a real feature: API endpoint, form, database query, auth rule, or deployment step.',
  },
  {
    title: '6. Review later',
    body: 'Revisit the concept after 1, 3, 7, and 14 days with short recall prompts and bug-fix drills.',
  },
];

export function getResourcesForTrack(trackId) {
  return EXTERNAL_RESOURCE_LIBRARY[trackId] ?? EXTERNAL_RESOURCE_LIBRARY.default;
}

export function buildLessonMastery(track, lesson) {
  const concept = lesson?.title ?? 'this concept';
  const keyPoint = lesson?.keyPoints?.[0] ?? `Understand why ${concept} matters in real applications.`;
  const secondPoint = lesson?.keyPoints?.[1] ?? 'Practice the concept in code instead of only reading about it.';
  const thirdPoint = lesson?.keyPoints?.[2] ?? 'Connect the lesson to a small production-style feature.';

  return {
    objectives: [
      `Explain ${concept} in plain language without reading the lesson.`,
      `Recognize when ${concept} is the right tool and when it is not.`,
      `Use ${concept} inside a small feature with validation, error handling, and review notes.`,
    ],
    mentalModel: [
      `Problem: what pain does ${concept} remove for a working developer?`,
      `Input and output: what data enters the code, what changes, and what should stay stable?`,
      `Failure cases: what breaks when the concept is misunderstood?`,
    ],
    guidedPractice: [
      `Rebuild the lesson example from memory, then compare it with the provided code.`,
      `Change one requirement and update the solution without rewriting everything.`,
      `Add one failing case first, then fix the implementation until the case passes.`,
    ],
    projectTask: {
      title: `${track.title} project slice`,
      brief: `Add one real feature that uses ${concept}. Keep it small enough to finish in one focused session.`,
      acceptance: [
        'The feature has a clear user or developer outcome.',
        'The happy path works and at least two edge cases are handled.',
        'The code is named clearly enough that another developer can review it.',
      ],
    },
    masteryChecklist: [
      keyPoint,
      secondPoint,
      thirdPoint,
      'I can debug one broken example without looking at the answer.',
      'I can explain the tradeoff in less than two minutes.',
    ],
    reviewPrompts: [
      `What is the main problem ${concept} solves?`,
      `Name one bug that happens when ${concept} is used incorrectly.`,
      `Where would this appear in a production ${track.title} codebase?`,
      'What would you test before trusting this code?',
    ],
    aiCoachPrompts: [
      `Explain ${concept} like I am a junior developer, then quiz me with five questions.`,
      `Give me three practice tasks for ${concept}: easy, medium, and production-style.`,
      `Review my explanation of ${concept} and tell me what is missing.`,
    ],
    resources: getResourcesForTrack(track.id),
  };
}

export function getTrackCapstone(track) {
  const title = track?.title ?? 'Technology';
  return {
    title: `${title} mastery capstone`,
    milestones: [
      'Design the feature requirements and data model.',
      'Build the smallest working version.',
      'Add validation, error handling, and loading states.',
      'Add tests or a manual verification checklist.',
      'Refactor names, structure, and duplicated logic.',
      'Write a short README explaining decisions and tradeoffs.',
    ],
  };
}
