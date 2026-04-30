// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Interview Mode Data
// ═══════════════════════════════════════════════════════════

export const INTERVIEW_CATEGORIES = [
  {
    id: 'csharp-dotnet',
    title: 'C# & .NET',
    icon: '⚙️',
    color: 'blue',
    badge: 'bg-blue-500/20 text-blue-300',
    border: 'border-blue-500/40',
    description: 'Core language features, CLR, memory management, async/await',
    questionCount: 20,
  },
  {
    id: 'react',
    title: 'React & Frontend',
    icon: '⚛️',
    color: 'emerald',
    badge: 'bg-emerald-500/20 text-emerald-300',
    border: 'border-emerald-500/40',
    description: 'Hooks, rendering, performance, state management',
    questionCount: 15,
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: '📡',
    color: 'violet',
    badge: 'bg-violet-500/20 text-violet-300',
    border: 'border-violet-500/40',
    description: 'Scalability, microservices, databases, caching strategies',
    questionCount: 12,
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    icon: '💬',
    color: 'amber',
    badge: 'bg-amber-500/20 text-amber-300',
    border: 'border-amber-500/40',
    description: 'STAR method, teamwork, conflict resolution, leadership',
    questionCount: 10,
  },
  {
    id: 'sql',
    title: 'SQL & Databases',
    icon: '🗄️',
    color: 'rose',
    badge: 'bg-rose-500/20 text-rose-300',
    border: 'border-rose-500/40',
    description: 'Query optimization, indexing, transactions, normalization',
    questionCount: 12,
  },
];

export const INTERVIEW_QUESTIONS = [
  // ─── C# & .NET ─────────────────────────────────────────────
  {
    id: 'iq-cs-01',
    categoryId: 'csharp-dotnet',
    level: 'Junior',
    question: 'What is the difference between a class and a struct in C#?',
    shortAnswer: 'Classes are reference types allocated on the heap; structs are value types allocated on the stack. Structs are copied on assignment.',
    fullAnswer: `**Classes (Reference Types)**
- Stored on the managed heap
- Passed by reference — assignment copies the reference, not the data
- Support inheritance and polymorphism
- Can be null
- Default constructor always available

**Structs (Value Types)**
- Stored on the stack (when local variable) or inline in an object
- Passed by value — assignment creates a full copy
- Cannot inherit from other structs/classes (only implement interfaces)
- Cannot be null (unless Nullable<T>)
- Better performance for small, immutable data

**When to use struct:**
- Small (< 16 bytes ideally), immutable data: Point, Color, Money
- Performance-critical hot paths (avoid GC pressure)

\`\`\`csharp
// Class — reference type
class PersonClass { public string Name; }
var a = new PersonClass { Name = "Alice" };
var b = a;       // b points to same object
b.Name = "Bob";  // a.Name is now "Bob" too!

// Struct — value type
struct PersonStruct { public string Name; }
var x = new PersonStruct { Name = "Alice" };
var y = x;       // y is a copy
y.Name = "Bob";  // x.Name is still "Alice"
\`\`\``,
    tags: ['value-types', 'reference-types', 'memory', 'fundamentals'],
    followUps: ['What is boxing/unboxing?', 'When would you use a readonly struct?'],
  },
  {
    id: 'iq-cs-02',
    categoryId: 'csharp-dotnet',
    level: 'Junior',
    question: 'Explain async/await in C#. What does it do under the hood?',
    shortAnswer: 'async/await is syntactic sugar for the Task-based Asynchronous Pattern (TAP). The compiler transforms the method into a state machine that can suspend at await points without blocking the thread.',
    fullAnswer: `**async/await** allows writing asynchronous code that looks synchronous.

**What happens:**
1. \`async\` marks a method as asynchronous, making it return \`Task\` or \`Task<T>\`
2. \`await\` suspends the method at that point and releases the thread
3. When the awaited task completes, execution resumes (possibly on a different thread)
4. The compiler generates a state machine class to track the suspension points

\`\`\`csharp
// This async method...
public async Task<string> FetchDataAsync(string url)
{
    var response = await _httpClient.GetAsync(url);
    var content = await response.Content.ReadAsStringAsync();
    return content;
}

// ...is roughly equivalent to a state machine:
// State 0: call GetAsync, register continuation
// State 1: when complete, call ReadAsStringAsync, register continuation
// State 2: when complete, set the Task result
\`\`\`

**Key rules:**
- Always \`await\` Task — never .Result or .Wait() (deadlock risk)
- Use \`ConfigureAwait(false)\` in library code (avoids capturing sync context)
- \`async void\` is only for event handlers — exceptions are uncatchable
- Chain of async: if you await, callers should await too`,
    tags: ['async', 'await', 'Task', 'threading', 'performance'],
    followUps: ['What is ConfigureAwait(false) and when should you use it?', 'What is the difference between Task.Run and async/await?'],
  },
  {
    id: 'iq-cs-03',
    categoryId: 'csharp-dotnet',
    level: 'Mid',
    question: 'What are the SOLID principles? Give a C# example of one.',
    shortAnswer: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Each guides toward maintainable, extensible code.',
    fullAnswer: `**S — Single Responsibility Principle**
A class should have one reason to change.

\`\`\`csharp
// BAD: one class doing too much
class UserService {
    void Register(User user) { /* DB */ }
    void SendWelcomeEmail(User user) { /* Email */ }
    string FormatUserReport(User user) { /* Formatting */ }
}

// GOOD: separated concerns
class UserRepository { void Save(User u) { } }
class EmailService { void SendWelcome(User u) { } }
class UserReportFormatter { string Format(User u) { return ""; } }
\`\`\`

**O — Open/Closed:** Open for extension, closed for modification.
Use abstract classes or interfaces. Add new behavior by adding new classes.

**L — Liskov Substitution:** Subclasses must be usable wherever base class is used.
A Square that overrides Rectangle and breaks SetWidth/SetHeight violates LSP.

**I — Interface Segregation:** Many small interfaces > one large interface.
Don't force classes to implement methods they don't need.

**D — Dependency Inversion:** Depend on abstractions, not concretions.
\`\`\`csharp
// BAD: depends on concrete SqlUserRepository
class UserService { private SqlUserRepository _repo = new(); }

// GOOD: depends on IUserRepository abstraction
class UserService {
    private readonly IUserRepository _repo;
    public UserService(IUserRepository repo) => _repo = repo;
}
\`\`\``,
    tags: ['SOLID', 'OOP', 'design-principles', 'clean-code'],
    followUps: ['How does Dependency Injection help with DI principle?', 'What is the difference between composition and inheritance?'],
  },
  {
    id: 'iq-cs-04',
    categoryId: 'csharp-dotnet',
    level: 'Mid',
    question: 'What is dependency injection in ASP.NET Core and what lifetimes are available?',
    shortAnswer: 'DI is a pattern where dependencies are provided from outside rather than created inside. ASP.NET Core has a built-in IoC container with Singleton, Scoped, and Transient lifetimes.',
    fullAnswer: `ASP.NET Core has a built-in DI container. Services are registered in \`Program.cs\` and injected via constructor.

**Three lifetimes:**

| Lifetime | Instance created | Use when |
|---|---|---|
| Singleton | Once per app lifetime | Stateless services, config, caches |
| Scoped | Once per HTTP request | DB contexts, user-specific services |
| Transient | Every time it's resolved | Lightweight stateless services |

\`\`\`csharp
// Registration in Program.cs
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<IUserRepository, SqlUserRepository>();
builder.Services.AddTransient<IPasswordHasher, BcryptHasher>();

// Injection in a controller
public class UserController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IEmailSender _email;

    public UserController(IUserRepository repo, IEmailSender email)
    {
        _repo = repo;
        _email = email;
    }
}
\`\`\`

**Captive dependency anti-pattern:** Never inject a Scoped or Transient service into a Singleton — the Singleton "captures" the shorter-lived instance, causing state bugs.`,
    tags: ['DI', 'IoC', 'ASP.NET Core', 'architecture'],
    followUps: ['How would you mock dependencies in unit tests?'],
  },
  {
    id: 'iq-cs-05',
    categoryId: 'csharp-dotnet',
    level: 'Senior',
    question: 'Explain the difference between IEnumerable, IQueryable, and IList in C# and when to use each.',
    shortAnswer: 'IEnumerable executes in memory (LINQ-to-Objects). IQueryable defers to a query provider (LINQ-to-SQL, translates to SQL). IList adds indexing and mutability on top of IEnumerable.',
    fullAnswer: `**IEnumerable<T>**
- Lazy, forward-only iteration over in-memory data
- LINQ operators work in memory
- Use for: any in-memory collection, yield return, generators

**IQueryable<T>**
- Builds expression trees that are translated by a query provider (EF Core → SQL)
- Queries execute in the database, not in memory
- Use for: EF Core DbSet, filtering/ordering before loading data

\`\`\`csharp
// IQueryable — SQL WHERE clause is generated
IQueryable<User> query = _db.Users.Where(u => u.IsActive);
// At this point, NO query has run

var result = await query.ToListAsync(); // NOW the SQL executes

// IEnumerable — loads ALL users then filters in C#!
IEnumerable<User> allUsers = await _db.Users.ToListAsync();
var active = allUsers.Where(u => u.IsActive); // in-memory — wasteful!
\`\`\`

**IList<T>**
- Extends IEnumerable + ICollection
- Adds indexing (list[0]), Count, Add, Remove, Insert
- Use when you need mutable random-access list

**Performance tip:** Always filter/order on IQueryable before calling ToList(). Calling ToList() first converts to IEnumerable and loses the query translation benefit.`,
    tags: ['LINQ', 'IQueryable', 'EF Core', 'performance', 'collections'],
    followUps: ['What is deferred execution in LINQ?'],
  },

  // ─── REACT ─────────────────────────────────────────────────
  {
    id: 'iq-react-01',
    categoryId: 'react',
    level: 'Junior',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    shortAnswer: 'useEffect runs asynchronously after the browser paints. useLayoutEffect runs synchronously after DOM updates but before the browser paints — use it for DOM measurements to avoid flicker.',
    fullAnswer: `**useEffect**
- Runs asynchronously after the browser has painted the screen
- Safe for most side effects: data fetching, subscriptions, analytics
- Does NOT block the visual update

**useLayoutEffect**
- Runs synchronously after DOM mutations but before the browser paints
- Use for: reading DOM layout (getBoundingClientRect), preventing flicker on position adjustments

\`\`\`jsx
// useEffect (most common)
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// useLayoutEffect (for DOM measurements)
const [tooltipHeight, setTooltipHeight] = useState(0);

useLayoutEffect(() => {
  // DOM is updated but browser hasn't painted yet
  const height = tooltipRef.current.getBoundingClientRect().height;
  setTooltipHeight(height); // position tooltip without flicker
}, []);
\`\`\`

**Rule of thumb:** Start with useEffect. Only switch to useLayoutEffect if you see visual flicker caused by state updates after DOM measurement.`,
    tags: ['hooks', 'useEffect', 'useLayoutEffect', 'DOM', 'rendering'],
    followUps: ['How does the cleanup function in useEffect work?', 'What happens when useEffect dependencies change?'],
  },
  {
    id: 'iq-react-02',
    categoryId: 'react',
    level: 'Mid',
    question: 'When would you use useMemo vs useCallback?',
    shortAnswer: 'useMemo memoizes a computed value. useCallback memoizes a function reference. Use them to prevent re-renders in child components or avoid expensive re-computations.',
    fullAnswer: `**useMemo** — cache a computed value
\`\`\`jsx
const expensiveResult = useMemo(() => {
  return heavyComputation(data);
}, [data]); // recompute only when data changes
\`\`\`

**useCallback** — cache a function reference
\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]); // new function only when id changes
\`\`\`

**When useCallback matters:**
- Passed as prop to a React.memo() child — prevents unnecessary re-renders
- Used as a useEffect dependency — prevents infinite loops

\`\`\`jsx
// Without useCallback: handleSubmit is a new function every render
// → triggers re-render of ExpensiveForm every time parent re-renders
<ExpensiveForm onSubmit={handleSubmit} />

// With useCallback + React.memo: only re-renders when formId changes
const handleSubmit = useCallback(() => submitForm(formId), [formId]);
const ExpensiveForm = React.memo(({ onSubmit }) => <form>...</form>);
\`\`\`

**Caution:** Don't over-optimize. useMemo/useCallback add overhead. Only use them when you've measured a real performance problem or know the component is expensive.`,
    tags: ['hooks', 'useMemo', 'useCallback', 'performance', 'memoization'],
    followUps: ['What is React.memo and how does it work?', 'What is the difference between useMemo and useReducer?'],
  },
  {
    id: 'iq-react-03',
    categoryId: 'react',
    level: 'Mid',
    question: 'Explain the React reconciliation algorithm (Virtual DOM diffing).',
    shortAnswer: 'React compares the previous and new virtual DOM trees. It uses keys for list items, assumes same-position elements are the same type, and updates only what changed in the real DOM.',
    fullAnswer: `React re-renders produce a new virtual DOM (a JS object tree). The reconciler diffs old vs new and applies minimal DOM operations.

**Two core assumptions:**
1. Elements of different types produce different trees (no diffing across types)
2. \`key\` prop tells React which list items are which across renders

\`\`\`jsx
// Case 1: Same type — React updates props
// Old: <Button color="blue" />
// New: <Button color="red" />
// Result: updates className only (no unmount/remount)

// Case 2: Different type — React destroys + creates
// Old: <div>...</div>
// New: <span>...</span>
// Result: full unmount of div tree, mount of span tree

// Case 3: Lists without keys — O(n²) diffing nightmare
// React assumes index 0→0, 1→1 etc. Inserting at beginning destroys all!
<li>Alice</li> → wrong: React thinks Alice became Bob
<li>Bob</li>

// Case 3 with keys — O(n) diffing
<li key="alice">Alice</li>  // React tracks by identity
<li key="bob">Bob</li>      // Only moves nodes, no remounting
\`\`\`

**Performance tips:**
- Always use stable, unique keys in lists (not array index for dynamic lists)
- Keep component tree stable — conditional wrapping in different elements causes re-mounting`,
    tags: ['reconciliation', 'virtual DOM', 'keys', 'performance', 'rendering'],
    followUps: ['Why is using array index as key sometimes problematic?'],
  },

  // ─── SYSTEM DESIGN ─────────────────────────────────────────
  {
    id: 'iq-sd-01',
    categoryId: 'system-design',
    level: 'Mid',
    question: 'How would you design a URL shortener like bit.ly?',
    shortAnswer: 'Hash the long URL to a short code (6-8 chars), store the mapping in a DB, use Redis for hot-path caching, handle redirects via 301/302, and consider rate limiting and analytics.',
    fullAnswer: `**Requirements:** 100M URLs created/day, 10B redirects/day, URLs never expire.

**Core Components:**

1. **API Service** (POST /shorten, GET /{code})
2. **Hash Generation** — Base62 encode a counter or UUID → ~6-8 chars
3. **Primary DB** — PostgreSQL: (id, short_code, long_url, created_at, user_id)
4. **Redis Cache** — short_code → long_url (TTL 24h, 99% of traffic hits cache)
5. **CDN/Load Balancer** — distribute redirect traffic globally

**Redirect flow:**
\`\`\`
GET /abc123
→ Check Redis cache for "abc123"
  → Cache hit (99%): 301 redirect to long URL [<1ms]
  → Cache miss (1%): Query DB, cache result, redirect [~5ms]
\`\`\`

**ID generation:**
- Option A: Auto-increment ID → Base62 encode (simple, sequential, predictable)
- Option B: UUID → first 6 chars of MD5 hash (collision risk, need retry)
- Option C: Distributed ID (Snowflake) → Base62 (scales across multiple servers)

**Scale math:**
- 10B redirects/day = ~116k RPS peak
- Redis can handle 1M+ ops/sec — easily handles this
- DB writes: 100M/day = ~1,200 writes/sec — no problem for PostgreSQL

**Analytics:** Write redirect events to Kafka → Flink aggregations → ClickHouse for fast queries`,
    tags: ['system-design', 'scalability', 'Redis', 'caching', 'databases'],
    followUps: ['How would you handle custom short URLs?', 'How do you prevent abuse (spam URLs)?'],
  },
  {
    id: 'iq-sd-02',
    categoryId: 'system-design',
    level: 'Senior',
    question: 'Design a rate limiter for an API. What algorithms are available?',
    shortAnswer: 'Common algorithms: Token Bucket (bursty traffic), Sliding Window Log (accurate but memory-intensive), Fixed Window Counter (simple), Sliding Window Counter (good balance). Redis is typical for distributed rate limiting.',
    fullAnswer: `**Token Bucket Algorithm (most common)**
- Bucket holds N tokens, refills at R tokens/second
- Each request consumes 1 token
- If empty: reject with 429 Too Many Requests
- Allows bursting up to bucket size

**Fixed Window Counter**
- Count requests per window (e.g., 100 req per 1min window)
- Simple but has edge case: 200 requests possible at window boundary

**Sliding Window Log**
- Store timestamp of each request
- Count requests in last 60 seconds
- Accurate but memory-intensive (stores all timestamps)

**Sliding Window Counter (best balance)**
- Blend of fixed window with weighted previous window
- \`current_count + prev_count * (1 - elapsed/window)\`

**Distributed Rate Limiting with Redis:**
\`\`\`
-- Token Bucket in Redis (Lua script for atomicity)
local tokens = redis.call('GET', key) or bucket_capacity
tokens = math.min(tokens + refill_amount, bucket_capacity)
if tokens >= 1 then
  tokens = tokens - 1
  redis.call('SET', key, tokens, 'EX', ttl)
  return 1 -- allow
else
  return 0 -- reject
end
\`\`\`

**In ASP.NET Core:**
- Use built-in Rate Limiting middleware (net 7+): \`AddRateLimiter()\`
- Or AspNetCoreRateLimit package with Redis backing
- Apply per IP, per user, per API key, or globally`,
    tags: ['system-design', 'rate-limiting', 'Redis', 'algorithms', 'API'],
    followUps: ['How would you implement per-user rate limits in ASP.NET Core?'],
  },

  // ─── BEHAVIORAL ────────────────────────────────────────────
  {
    id: 'iq-beh-01',
    categoryId: 'behavioral',
    level: 'Junior',
    question: 'Tell me about a time you had a bug that was difficult to debug. How did you solve it?',
    shortAnswer: 'Use the STAR method: Situation (what project), Task (what the bug was), Action (how you debugged it step by step), Result (how it was resolved and what you learned).',
    fullAnswer: `**STAR Framework for this question:**

**Situation:** Set the context — what project, what kind of bug, when.
"While working on a .NET API for our e-commerce project, users reported that orders were occasionally being created twice..."

**Task:** What was your responsibility?
"I was responsible for the order creation endpoint and needed to find and fix the root cause within 24 hours as it was causing duplicate charges."

**Action:** Walk through your debugging process in detail.
"I started by checking the logs, which showed the endpoint was being called twice within milliseconds. I added correlation IDs to trace the requests. I found the React frontend was sending the POST request twice due to a missing loading state — users could double-click the submit button. I fixed it with idempotency: added an idempotency key header on the frontend and a unique constraint + deduplication check on the API."

**Result:** What was the outcome? What did you learn?
"Fixed within 4 hours. Zero duplicate orders since. I now always design payment/order endpoints with idempotency as a first-class concern."

**Tips:**
- Be specific — name the technology, tool, error message
- Show your debugging methodology (logs → isolation → hypothesis → test)
- Show what you learned — interviewers want growth mindset`,
    tags: ['behavioral', 'debugging', 'STAR', 'problem-solving'],
    followUps: ['What tools do you use for debugging in .NET?'],
  },
  {
    id: 'iq-beh-02',
    categoryId: 'behavioral',
    level: 'Mid',
    question: 'Describe a time you disagreed with a technical decision made by your team or tech lead.',
    shortAnswer: 'Show that you can voice disagreement professionally, use data/reasoning, and ultimately commit to the team decision even if overruled. "Disagree and commit" is the expected behavior.',
    fullAnswer: `**What interviewers are assessing:**
- Can you handle professional disagreement without conflict?
- Do you back opinions with reasoning/data?
- Can you commit once a decision is made (even if you disagree)?

**Strong answer structure:**
1. Describe the technical disagreement clearly
2. Explain how you raised your concern (privately first, then in design review)
3. What data/reasoning you brought
4. How the decision was ultimately made
5. How you committed to it and what happened

**Example answer:**
"In my last project, the team decided to use a stored procedure for a complex reporting query rather than building it into the service layer. I disagreed because it would make the code harder to test and version control.

I brought it up in our design review with specific concerns: stored procs aren't in git, can't be unit tested easily, and move business logic into the DB. I proposed a LINQ query with a view instead.

The tech lead heard my concern but decided stored procs were better for this team's skillset. I committed fully — helped write the proc, documented it thoroughly, and added integration tests.

In retrospect, it worked well for that specific case. I learned to consider team context when making architectural arguments."`,
    tags: ['behavioral', 'teamwork', 'communication', 'technical-decisions'],
    followUps: ['How do you handle it when a colleague writes bad code that gets merged?'],
  },

  // ─── SQL ────────────────────────────────────────────────────
  {
    id: 'iq-sql-01',
    categoryId: 'sql',
    level: 'Junior',
    question: 'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?',
    shortAnswer: 'INNER JOIN returns rows where both tables match. LEFT JOIN returns all left rows plus matched right rows (NULLs for no match). FULL OUTER JOIN returns all rows from both tables.',
    fullAnswer: `Given tables: **Orders** and **Customers**

\`\`\`sql
-- INNER JOIN: only orders with a matching customer
SELECT o.Id, c.Name
FROM Orders o
INNER JOIN Customers c ON o.CustomerId = c.Id;
-- Result: only orders that have a valid customer

-- LEFT JOIN: ALL orders, even with no customer
SELECT o.Id, c.Name
FROM Orders o
LEFT JOIN Customers c ON o.CustomerId = c.Id;
-- Result: all orders; Name is NULL for orphan orders

-- RIGHT JOIN: ALL customers, even with no orders
SELECT o.Id, c.Name
FROM Orders o
RIGHT JOIN Customers c ON o.CustomerId = c.Id;
-- Result: all customers; Id is NULL for customers with no orders

-- FULL OUTER JOIN: everything from both tables
SELECT o.Id, c.Name
FROM Orders o
FULL OUTER JOIN Customers c ON o.CustomerId = c.Id;
-- Result: all orders AND all customers; NULLs where no match
\`\`\`

**Common use case for LEFT JOIN:** Find customers with NO orders
\`\`\`sql
SELECT c.Name
FROM Customers c
LEFT JOIN Orders o ON o.CustomerId = c.Id
WHERE o.Id IS NULL; -- the NULL check is the key
\`\`\``,
    tags: ['SQL', 'joins', 'fundamentals', 'databases'],
    followUps: ['What is a self-join? Give an example use case.'],
  },
  {
    id: 'iq-sql-02',
    categoryId: 'sql',
    level: 'Mid',
    question: 'How do database indexes work and when should you add one?',
    shortAnswer: 'An index is a separate data structure (typically a B-tree) that lets the DB find rows without scanning the whole table. Add indexes on columns used in WHERE, JOIN ON, and ORDER BY clauses.',
    fullAnswer: `**How B-tree indexes work:**
The DB maintains a sorted tree of (indexed column value → row pointer).
A lookup goes from O(n) full table scan to O(log n) tree traversal.

\`\`\`sql
-- Without index: full table scan — reads every row
SELECT * FROM Orders WHERE CustomerId = 42;  -- 1M rows scanned

-- With index on CustomerId:
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId);
-- Now: O(log n) B-tree lookup → find matching rows directly
\`\`\`

**When to add an index:**
- Columns in WHERE clauses (high-cardinality, frequently filtered)
- Foreign keys (JOIN ON columns) — prevents full scans on JOINs
- Columns in ORDER BY (index scan can avoid sort operation)
- Composite index for multi-column WHERE: (A, B) for \`WHERE A = x AND B = y\`

**When NOT to add an index:**
- Write-heavy tables (indexes slow down INSERT/UPDATE/DELETE)
- Low-cardinality columns (boolean, status with 3 values) — not worth it
- Small tables — full scan is faster than index overhead

**EF Core:**
\`\`\`csharp
// In OnModelCreating:
entity.HasIndex(e => e.CustomerId); // single column
entity.HasIndex(e => new { e.Status, e.CreatedAt }); // composite
\`\`\`

**Pro tip:** Use EXPLAIN/EXPLAIN ANALYZE to check if a query uses your index.`,
    tags: ['SQL', 'indexes', 'performance', 'B-tree', 'query-optimization'],
    followUps: ['What is a covering index?', 'What is index fragmentation?'],
  },
];

export function getQuestionsByCategory(categoryId) {
  return INTERVIEW_QUESTIONS.filter(q => q.categoryId === categoryId);
}

export function getQuestionById(id) {
  return INTERVIEW_QUESTIONS.find(q => q.id === id);
}

export const LEVEL_COLORS = {
  Junior: 'bg-emerald-500/20 text-emerald-300',
  Mid: 'bg-blue-500/20 text-blue-300',
  Senior: 'bg-violet-500/20 text-violet-300',
};
