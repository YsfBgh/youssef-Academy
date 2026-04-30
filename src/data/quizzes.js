// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Quiz Bank
// ═══════════════════════════════════════════════════════════

export const QUIZZES = {
  csharp: {
    title: 'C# & .NET Quiz',
    icon: '⚙️',
    color: 'blue',
    questions: [
      {
        id: 'cs-q1',
        question: 'What is the difference between a value type and a reference type in C#?',
        options: [
          'Value types are faster; reference types are slower',
          'Value types store data on the stack directly; reference types store a pointer to heap memory',
          'Value types can be null; reference types cannot',
          'There is no practical difference'
        ],
        correct: 1,
        explanation: 'Value types (int, bool, struct) store their data directly on the stack. Reference types (class, string, array) store a reference (pointer) on the stack that points to data allocated on the heap.',
        difficulty: 'Beginner'
      },
      {
        id: 'cs-q2',
        question: 'What happens when you call .Result on a Task in an ASP.NET Core controller?',
        options: [
          'It runs the task on a background thread safely',
          'It throws a NotSupportedException',
          'It can cause a deadlock by blocking the thread while waiting for a SynchronizationContext',
          'It returns null if the task is not complete'
        ],
        correct: 2,
        explanation: 'In ASP.NET Core, calling .Result or .Wait() on a Task synchronously blocks the current thread. This can cause a deadlock when combined with the SynchronizationContext. Always use await instead.',
        difficulty: 'Intermediate'
      },
      {
        id: 'cs-q3',
        question: 'Which LINQ method triggers immediate execution (not deferred)?',
        options: [
          '.Where()',
          '.Select()',
          '.OrderBy()',
          '.ToList()'
        ],
        correct: 3,
        explanation: 'ToList(), ToArray(), Count(), First(), Single() and other terminal operations cause immediate execution. Where(), Select(), OrderBy() etc. use deferred execution — the query is built but not run until iterated.',
        difficulty: 'Intermediate'
      },
      {
        id: 'cs-q4',
        question: 'What is the purpose of AsNoTracking() in Entity Framework Core?',
        options: [
          'It disables logging for the query',
          'It returns entities that EF will not track for change detection — faster for read-only queries',
          'It prevents the entity from being saved to the database',
          'It marks the entity as deleted'
        ],
        correct: 1,
        explanation: 'AsNoTracking() tells EF Core not to track the returned entities in the ChangeTracker. This is significantly faster for read-only scenarios because EF skips the overhead of tracking state changes.',
        difficulty: 'Intermediate'
      },
      {
        id: 'cs-q5',
        question: 'What is the difference between interface and abstract class in C#?',
        options: [
          'Interfaces cannot have methods; abstract classes can',
          'Abstract classes support multiple inheritance; interfaces do not',
          'Interfaces define a contract with no instance fields or constructors; a class can implement many interfaces but inherit from only one abstract class',
          'There is no difference since C# 8'
        ],
        correct: 2,
        explanation: 'A class can implement multiple interfaces but can only inherit from one abstract class. Interfaces cannot have instance fields or constructors. Since C# 8, interfaces can have default method implementations, but the core distinction remains.',
        difficulty: 'Beginner'
      },
      {
        id: 'cs-q6',
        question: 'What does the init accessor do on a property?',
        options: [
          'Makes the property read-only from all contexts',
          'Allows setting the property only during object initialization (constructor or object initializer)',
          'Makes the property virtual and overridable',
          'Prevents the property from being serialized'
        ],
        correct: 1,
        explanation: 'The init accessor (C# 9+) allows a property to be set only during object initialization — in the constructor or object initializer expression. After the object is created, the property becomes read-only.',
        difficulty: 'Intermediate'
      },
      {
        id: 'cs-q7',
        question: 'What is the purpose of CancellationToken in async methods?',
        options: [
          'To limit memory usage of async operations',
          'To set a timeout on the async method automatically',
          'To allow cooperative cancellation — the caller signals cancellation, and the callee can check and stop early',
          'To prevent race conditions in async code'
        ],
        correct: 2,
        explanation: 'CancellationToken enables cooperative cancellation. The caller creates a CancellationTokenSource and passes its Token to async methods. Those methods periodically check ct.IsCancellationRequested or pass the token to sub-calls like ToListAsync(ct).',
        difficulty: 'Intermediate'
      },
      {
        id: 'cs-q8',
        question: 'Which DI lifetime creates a new instance for every class that requests it?',
        options: [
          'Singleton',
          'Scoped',
          'Transient',
          'Request'
        ],
        correct: 2,
        explanation: 'Transient creates a new instance every time the service is requested. Scoped creates one per HTTP request (or scope). Singleton creates one for the lifetime of the application.',
        difficulty: 'Beginner'
      },
      {
        id: 'cs-q9',
        question: 'What does the ?? operator (null-coalescing) do?',
        options: [
          'Returns true if the left operand is null',
          'Throws an exception if the left operand is null',
          'Returns the left operand if it is not null; otherwise returns the right operand',
          'Converts null to an empty string'
        ],
        correct: 2,
        explanation: 'The null-coalescing operator ?? returns the left-hand operand if it is not null; otherwise it returns the right-hand operand. Example: string name = input ?? "Default";',
        difficulty: 'Beginner'
      },
      {
        id: 'cs-q10',
        question: 'In a C# record type, what is automatically generated for you?',
        options: [
          'Only ToString()',
          'Equality members (Equals, GetHashCode), ToString(), and a deconstruct method',
          'A constructor and serialization support only',
          'An interface implementation'
        ],
        correct: 1,
        explanation: 'Records automatically generate: value-based equality (Equals and GetHashCode based on properties), a ToString() that prints all properties, a positional deconstructor, and a copy constructor via the with expression.',
        difficulty: 'Intermediate'
      },
    ]
  },

  react: {
    title: 'React Quiz',
    icon: '⚛️',
    color: 'cyan',
    questions: [
      {
        id: 'rx-q1',
        question: 'When should you use the functional update form `setCount(prev => prev + 1)` instead of `setCount(count + 1)`?',
        options: [
          'Only inside useEffect',
          'When multiple state updates may be batched and the new value depends on the previous value',
          'When updating objects or arrays only',
          'Always — the functional form is always preferred'
        ],
        correct: 1,
        explanation: 'React may batch state updates. If the new state depends on the old state (like incrementing), use the functional form (prev => prev + 1) to guarantee you\'re working with the most recent state, not a stale closure.',
        difficulty: 'Intermediate'
      },
      {
        id: 'rx-q2',
        question: 'What does the cleanup function in useEffect do?',
        options: [
          'It clears all state in the component',
          'It runs before the component mounts to initialize',
          'It runs before the next effect or when the component unmounts — used to cancel subscriptions, timers, etc.',
          'It automatically garbage-collects unused variables'
        ],
        correct: 2,
        explanation: 'Returning a function from useEffect registers it as a cleanup. It runs: (1) before the component unmounts, and (2) before the effect runs again due to dependency changes. Use it to cancel timers, unsubscribe, abort fetches.',
        difficulty: 'Intermediate'
      },
      {
        id: 'rx-q3',
        question: 'What is the key difference between useMemo and useCallback?',
        options: [
          'useMemo is for objects; useCallback is for arrays',
          'useMemo memoizes the return value of a function; useCallback memoizes the function itself',
          'useCallback is faster than useMemo',
          'There is no difference — they are aliases'
        ],
        correct: 1,
        explanation: 'useMemo(() => compute(a, b), [a, b]) returns the memoized result of the computation. useCallback((arg) => fn(arg), []) returns a memoized stable function reference. useCallback(fn, deps) === useMemo(() => fn, deps).',
        difficulty: 'Intermediate'
      },
      {
        id: 'rx-q4',
        question: 'Why does React.memo sometimes NOT prevent re-renders even when props appear the same?',
        options: [
          'React.memo is only for class components',
          'React.memo only works with primitive props',
          'Object and function props are new references on each render — shallow comparison treats them as changed',
          'memo only works once per component lifetime'
        ],
        correct: 2,
        explanation: 'React.memo does a shallow comparison. If a parent passes a new object literal or inline function as prop on each render, the reference changes each time, so memo sees them as different even if the content is the same. Use useMemo and useCallback to stabilize references.',
        difficulty: 'Advanced'
      },
      {
        id: 'rx-q5',
        question: 'What happens if you call useContext in a component that is NOT inside the corresponding Provider?',
        options: [
          'It throws an error automatically',
          'It returns undefined if no default value was set in createContext',
          'It returns null always',
          'React redirects to the nearest parent Provider'
        ],
        correct: 1,
        explanation: 'If there is no matching Provider above the component in the tree, useContext returns the default value passed to createContext(). If no default was set (createContext(null)), it returns null — which is why custom hooks should throw an error if context is null.',
        difficulty: 'Intermediate'
      },
      {
        id: 'rx-q6',
        question: 'In which case should you prefer useReducer over useState?',
        options: [
          'When you have more than 2 state variables',
          'When state transitions are complex, interdependent, or involve multiple sub-values that change together',
          'When you need to share state across components',
          'When state must persist across page refreshes'
        ],
        correct: 1,
        explanation: 'useReducer is preferred when state logic is complex — multiple sub-values, state transitions that depend on previous state in non-trivial ways, or when next state is determined by action type. It also separates state logic from the component.',
        difficulty: 'Intermediate'
      },
      {
        id: 'rx-q7',
        question: 'What is the correct way to update a nested property in a React state object?',
        options: [
          'state.user.name = "Youssef"; setState(state);',
          'setState({ ...state, user: { ...state.user, name: "Youssef" } })',
          'setState(state.user.name = "Youssef")',
          'setState(prev => prev.user.name = "Youssef")'
        ],
        correct: 1,
        explanation: 'React state must be updated immutably. Never mutate the existing state object. Always spread the existing state at each level and override the changed properties.',
        difficulty: 'Beginner'
      },
      {
        id: 'rx-q8',
        question: 'What is a potential problem with this code: useEffect(() => { setData(fetch(...)) }, []);',
        options: [
          'fetch() is not allowed inside useEffect',
          'The empty dependency array causes infinite renders',
          'fetch() returns a Promise — you cannot directly assign a Promise to state; you must await it',
          'setData cannot be called inside effects'
        ],
        correct: 2,
        explanation: 'fetch() returns a Promise, not the resolved value. You must use an async IIFE or a helper function: useEffect(() => { const load = async () => { const data = await fetch(...).then(r => r.json()); setData(data); }; load(); }, []);',
        difficulty: 'Intermediate'
      },
    ]
  },

  nextjs: {
    title: 'Next.js Quiz',
    icon: '▲',
    color: 'violet',
    questions: [
      {
        id: 'nx-q1',
        question: 'What is the default rendering mode for components in the Next.js App Router?',
        options: [
          'Client Components (CSR)',
          'Server Components (SSR)',
          'Static Generation (SSG)',
          'Incremental Static Regeneration'
        ],
        correct: 1,
        explanation: 'In the App Router, all components are React Server Components by default. They render on the server, have no client-side JS, and can access databases directly. Add "use client" to opt into client-side interactivity.',
        difficulty: 'Beginner'
      },
      {
        id: 'nx-q2',
        question: 'Which fetch cache option is equivalent to Incremental Static Regeneration (ISR)?',
        options: [
          'cache: "no-store"',
          'cache: "force-cache"',
          'next: { revalidate: 60 }',
          'cache: "revalidate"'
        ],
        correct: 2,
        explanation: 'Using next: { revalidate: N } tells Next.js to serve the cached response and regenerate it in the background after N seconds — this is ISR. no-store = SSR (fresh every request), force-cache = SSG (never revalidate automatically).',
        difficulty: 'Intermediate'
      },
      {
        id: 'nx-q3',
        question: 'What is the purpose of the layout.tsx file in the App Router?',
        options: [
          'It defines the HTML document structure for a single page',
          'It wraps child routes and persists across navigation within its segment',
          'It acts as a 404 fallback page',
          'It handles API route logic'
        ],
        correct: 1,
        explanation: 'A layout.tsx wraps all pages within its route segment. The layout persists (does not unmount) across navigations within that segment — perfect for sidebars, headers, and shared providers.',
        difficulty: 'Beginner'
      },
      {
        id: 'nx-q4',
        question: 'How do you create a dynamic API route in the App Router that handles GET requests?',
        options: [
          'Create a file called api.tsx and export a default function',
          'Create app/api/[...]/route.ts and export a named async function GET(request)',
          'Create pages/api/handler.js and export default handler',
          'Add a getServerSideProps function to the page'
        ],
        correct: 1,
        explanation: 'In the App Router, API routes are created in app/api/**/route.ts files. You export named functions for each HTTP method: GET, POST, PUT, PATCH, DELETE. Example: export async function GET(request: NextRequest) { ... }',
        difficulty: 'Intermediate'
      },
      {
        id: 'nx-q5',
        question: 'What is a Server Action in Next.js?',
        options: [
          'A middleware function that runs before page rendering',
          'An async function marked with "use server" that runs on the server and can be called from client components or forms',
          'A server-side caching mechanism for API calls',
          'A special hook available only in Server Components'
        ],
        correct: 1,
        explanation: 'Server Actions are async functions marked with the "use server" directive. They run on the server and can be used as form actions or called from client components. They enable mutations without manually creating API routes.',
        difficulty: 'Intermediate'
      },
    ]
  },

  apis: {
    title: 'REST API Quiz',
    icon: '🌐',
    color: 'emerald',
    questions: [
      {
        id: 'api-q1',
        question: 'What HTTP status code should be returned when a resource is successfully created?',
        options: [
          '200 OK',
          '201 Created',
          '204 No Content',
          '202 Accepted'
        ],
        correct: 1,
        explanation: '201 Created is the correct status for successful resource creation. The response should also include a Location header pointing to the new resource URL.',
        difficulty: 'Beginner'
      },
      {
        id: 'api-q2',
        question: 'What is the difference between 401 and 403 HTTP status codes?',
        options: [
          '401 is for missing resources; 403 is for server errors',
          '401 means unauthenticated (who are you?); 403 means authenticated but not authorized (I know you, but you can\'t do this)',
          '401 is for GET requests; 403 is for POST requests',
          'They are identical — both mean access denied'
        ],
        correct: 1,
        explanation: '401 Unauthorized means the request lacks valid authentication credentials — the user is not logged in. 403 Forbidden means the user IS authenticated but does not have permission to access the resource.',
        difficulty: 'Beginner'
      },
      {
        id: 'api-q3',
        question: 'What makes an HTTP method "idempotent"?',
        options: [
          'It can only be called once',
          'Making the same request multiple times produces the same result as making it once',
          'It does not modify any data',
          'It always returns the same response body'
        ],
        correct: 1,
        explanation: 'An idempotent method can be called multiple times and always produces the same server-side result. GET, PUT, DELETE are idempotent. POST is NOT idempotent — creating a resource twice creates two resources.',
        difficulty: 'Intermediate'
      },
      {
        id: 'api-q4',
        question: 'What is the difference between PUT and PATCH?',
        options: [
          'PUT is for creation; PATCH is for deletion',
          'PUT replaces the entire resource; PATCH applies a partial update',
          'They are identical — both update resources',
          'PATCH is newer and deprecated PUT'
        ],
        correct: 1,
        explanation: 'PUT replaces the entire resource — you must send the complete representation. PATCH applies partial changes — you only send the fields you want to update. PATCH is not idempotent (unlike PUT) in general.',
        difficulty: 'Intermediate'
      },
      {
        id: 'api-q5',
        question: 'Where should a JWT refresh token be stored for best security?',
        options: [
          'In localStorage for persistence across tabs',
          'In sessionStorage for tab isolation',
          'In a JavaScript variable in memory',
          'In an HttpOnly cookie — inaccessible to JavaScript'
        ],
        correct: 3,
        explanation: 'HttpOnly cookies cannot be accessed by JavaScript at all — they are immune to XSS attacks. Access tokens can be in memory (most secure) or sessionStorage. Never store refresh tokens in localStorage — XSS can steal them.',
        difficulty: 'Intermediate'
      },
      {
        id: 'api-q6',
        question: 'What is API versioning and why is it important?',
        options: [
          'Tracking the number of API requests for billing',
          'Keeping old API contracts working for existing clients while introducing breaking changes in new versions',
          'Caching API responses by version number',
          'Documenting the API with Swagger'
        ],
        correct: 1,
        explanation: 'API versioning lets you make breaking changes without breaking existing clients. Common approaches: URL versioning (/api/v1/products), header versioning (Accept: application/vnd.api+json;version=1), or query param (?version=1).',
        difficulty: 'Intermediate'
      },
    ]
  },

  oop: {
    title: 'OOP & Design Patterns Quiz',
    icon: '🏗️',
    color: 'amber',
    questions: [
      {
        id: 'oop-q1',
        question: 'Which SOLID principle does this violate? "A class that handles user authentication, sends emails, AND writes to the database."',
        options: [
          'Open/Closed Principle',
          'Liskov Substitution Principle',
          'Single Responsibility Principle',
          'Dependency Inversion Principle'
        ],
        correct: 2,
        explanation: 'This violates the Single Responsibility Principle. The class has three reasons to change: authentication logic changes, email logic changes, and database logic changes. Split into AuthService, EmailService, and UserRepository.',
        difficulty: 'Beginner'
      },
      {
        id: 'oop-q2',
        question: 'What does the Open/Closed Principle mean?',
        options: [
          'Classes should be open for inheritance and closed for instantiation',
          'Software entities should be open for extension but closed for modification',
          'Interfaces should be open; concrete classes should be closed',
          'Public methods should be open; private methods should be closed'
        ],
        correct: 1,
        explanation: 'OCP means you should be able to add new behavior by writing new code (extension) without modifying existing, tested code. Achieved via interfaces, abstract classes, and strategy patterns.',
        difficulty: 'Beginner'
      },
      {
        id: 'oop-q3',
        question: 'What is the Repository Pattern primarily used for?',
        options: [
          'Caching database queries automatically',
          'Abstracting the data access layer so business logic does not depend on the database technology',
          'Managing file system operations',
          'Handling HTTP requests in an organized way'
        ],
        correct: 1,
        explanation: 'Repository pattern creates an abstraction (interface) over data access. Business logic depends on IRepository<T>, not on SqlRepository or MongoRepository. This makes business logic testable with mocks and storage-agnostic.',
        difficulty: 'Intermediate'
      },
      {
        id: 'oop-q4',
        question: 'In polymorphism, if a method is declared as taking a base class parameter, what types can be passed?',
        options: [
          'Only the exact base class type',
          'Only derived class types',
          'The base class and any derived class (Liskov Substitution)',
          'Any object with the same method signatures'
        ],
        correct: 2,
        explanation: 'Polymorphism (via LSP) allows derived classes to be substituted wherever the base class is expected. If a method accepts Shape, you can pass Circle or Rectangle — as long as they honor the Shape contract.',
        difficulty: 'Intermediate'
      },
      {
        id: 'oop-q5',
        question: 'What problem does the Dependency Inversion Principle solve?',
        options: [
          'Makes classes more dependent on each other for better integration',
          'Eliminates tight coupling between high-level modules and low-level implementations',
          'Ensures all dependencies are initialized in the correct order',
          'Reduces the number of parameters needed in methods'
        ],
        correct: 1,
        explanation: 'DIP eliminates tight coupling. Without DIP, high-level classes (business logic) depend directly on low-level classes (SqlRepository). With DIP, both depend on an abstraction (IRepository) — enabling easy swapping and testing.',
        difficulty: 'Intermediate'
      },
    ]
  },

  refactoring: {
    title: 'Clean Code & Refactoring Quiz',
    icon: '✨',
    color: 'rose',
    questions: [
      {
        id: 'ref-q1',
        question: 'What does "DRY" stand for and why does it matter?',
        options: [
          'Don\'t Repeat Yourself — duplication means a bug fix must be applied in multiple places',
          'Design Reusable Yields — every class should be reusable',
          'Direct Reference Yielding — avoid indirect references',
          'Don\'t Reference Yourself — avoid circular dependencies'
        ],
        correct: 0,
        explanation: 'DRY (Don\'t Repeat Yourself) means every piece of knowledge should have a single source of truth. When logic is duplicated and a bug is found, you must fix it in all copies. Miss one → inconsistent behavior.',
        difficulty: 'Beginner'
      },
      {
        id: 'ref-q2',
        question: 'What is a "code smell"?',
        options: [
          'Code that does not compile',
          'Code that contains security vulnerabilities',
          'A surface-level indicator that suggests there may be a deeper design problem',
          'Code that runs slower than expected'
        ],
        correct: 2,
        explanation: 'Code smells are not bugs — the code may work correctly. They are patterns that suggest the design could be improved: Long Method, Large Class, Primitive Obsession, Feature Envy, etc. They make code harder to change and understand.',
        difficulty: 'Beginner'
      },
      {
        id: 'ref-q3',
        question: 'What is "Primitive Obsession" code smell?',
        options: [
          'Using too many loops instead of LINQ',
          'Using primitives (strings, ints) for concepts that deserve their own type with validation and behavior',
          'Writing code in a primitive programming style without OOP',
          'Avoiding modern language features'
        ],
        correct: 1,
        explanation: 'Primitive Obsession is using bare primitives like string for email, decimal for money, int for userId — instead of creating value objects (Email, Money, UserId) that encapsulate validation and behavior.',
        difficulty: 'Intermediate'
      },
      {
        id: 'ref-q4',
        question: 'What refactoring technique should you use when you have a method that is too long?',
        options: [
          'Inline Method — merge it into the calling method',
          'Extract Method — pull logical chunks into smaller named methods',
          'Replace Method with Method Object — create a new class for it',
          'Both B and C are valid depending on complexity'
        ],
        correct: 3,
        explanation: 'Extract Method is the primary technique — pull chunks of logic into well-named methods. For very complex methods with many local variables, Replace Method with Method Object creates a class where each variable becomes a field, enabling further extractions.',
        difficulty: 'Intermediate'
      },
      {
        id: 'ref-q5',
        question: 'What does YAGNI mean and when should you apply it?',
        options: [
          'You Are Getting Nothing Immediately — delay all feature development',
          'You Aren\'t Gonna Need It — don\'t build features until they are actually needed',
          'Your Architecture Grows Naturally Inside — let architecture evolve',
          'Yet Another Generic Nature Interface — avoid generic abstractions'
        ],
        correct: 1,
        explanation: 'YAGNI says don\'t build features, abstractions, or infrastructure based on imagined future needs. Build what is needed now. Premature abstraction is technical debt — it adds complexity without benefit.',
        difficulty: 'Beginner'
      },
      {
        id: 'ref-q6',
        question: 'Which is the safest order to refactor legacy code?',
        options: [
          'Refactor → Test → Deploy',
          'Test → Refactor → Verify tests still pass',
          'Deploy → Test → Refactor if tests fail',
          'Refactor and test simultaneously'
        ],
        correct: 1,
        explanation: 'Always write tests BEFORE refactoring (or ensure existing tests cover the code). Then refactor in small steps, running tests after each step. This gives you a safety net to catch regressions immediately.',
        difficulty: 'Intermediate'
      },
    ]
  }
};

export const getAllQuizQuestions = () =>
  Object.values(QUIZZES).flatMap(q => q.questions);

export const getQuizByTrack = (trackId) => QUIZZES[trackId];
