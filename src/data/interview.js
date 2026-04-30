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
  {
    id: 'aspnet',
    title: 'ASP.NET Core & APIs',
    icon: '🔌',
    color: 'sky',
    badge: 'bg-sky-500/20 text-sky-300',
    border: 'border-sky-500/40',
    description: 'Middleware, DI, controllers, validation, auth, minimal APIs',
    questionCount: 12,
  },
  {
    id: 'devops',
    title: 'DevOps & Git',
    icon: '🚀',
    color: 'orange',
    badge: 'bg-orange-500/20 text-orange-300',
    border: 'border-orange-500/40',
    description: 'Docker, CI/CD, Git workflows, deployment, environments',
    questionCount: 8,
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

  // ─── ASP.NET Core & APIs ───────────────────────────────────
  {
    id: 'iq-asp-01',
    categoryId: 'aspnet',
    level: 'Junior',
    question: 'What is dependency injection in ASP.NET Core and why is it important?',
    shortAnswer: 'DI is a design pattern where an object\'s dependencies are provided to it rather than created internally. ASP.NET Core has a built-in DI container. It improves testability, loose coupling, and code maintainability.',
    fullAnswer: `**Dependency Injection (DI)** separates the creation of objects from their use.

**Without DI (tight coupling):**
\`\`\`csharp
class OrderService
{
    private readonly EmailService _email = new EmailService(); // hard dependency
    public void PlaceOrder(Order o) { _email.Send("Order placed!"); }
}
// Cannot test OrderService without also running EmailService
\`\`\`

**With DI (loose coupling):**
\`\`\`csharp
class OrderService
{
    private readonly IEmailService _email;
    public OrderService(IEmailService email) => _email = email;
    public void PlaceOrder(Order o) { _email.Send("Order placed!"); }
}
// In tests, inject a mock IEmailService
\`\`\`

**Registering in ASP.NET Core:**
\`\`\`csharp
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddTransient<IOrderService, OrderService>();
builder.Services.AddSingleton<ICache, MemoryCache>();
\`\`\`

**Service lifetimes:**
- **Transient** — new instance per injection. Use for lightweight, stateless services.
- **Scoped** — one instance per HTTP request. Use for DbContext, business services.
- **Singleton** — one instance for the app lifetime. Use for caches, config.

**Never inject Scoped into Singleton** — "captive dependency" causes stale data bugs.`,
    tags: ['DI', 'dependency-injection', 'architecture', 'testability'],
    followUps: ['What is the difference between Transient, Scoped, and Singleton?', 'How would you mock a dependency in a unit test?'],
  },
  {
    id: 'iq-asp-02',
    categoryId: 'aspnet',
    level: 'Junior',
    question: 'What is middleware in ASP.NET Core? How do you write custom middleware?',
    shortAnswer: 'Middleware is code that handles requests and responses in a pipeline. Each piece can process the request, pass it to the next middleware, and then process the response on the way back.',
    fullAnswer: `**Middleware pipeline** processes every HTTP request in order.

Built-in examples: UseAuthentication, UseAuthorization, UseStaticFiles, UseCors.

\`\`\`csharp
// Custom middleware class
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestTimingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();

        await _next(context);  // pass to next middleware

        sw.Stop();
        var ms = sw.ElapsedMilliseconds;
        context.Response.Headers.Append("X-Response-Time", ms + "ms");
    }
}

// Register in Program.cs
app.UseMiddleware<RequestTimingMiddleware>();
\`\`\`

**Order matters** — middleware runs in registration order:
1. Exception handling (outermost — catches everything)
2. HTTPS redirection
3. Static files
4. Routing
5. Authentication
6. Authorization
7. Your custom middleware
8. Endpoint (controller/minimal API)

**Short-circuit:** middleware can return a response without calling _next, e.g., a rate limiter or IP block.`,
    tags: ['middleware', 'pipeline', 'request-response', 'aspnet'],
    followUps: ['When would you use middleware vs a filter vs an action?', 'How do you order middleware correctly?'],
  },
  {
    id: 'iq-asp-03',
    categoryId: 'aspnet',
    level: 'Mid',
    question: 'Explain the difference between authentication and authorization in ASP.NET Core.',
    shortAnswer: 'Authentication answers "who are you?" — verifying identity via JWT, cookies, etc. Authorization answers "what are you allowed to do?" — checking permissions via roles, policies, or claims.',
    fullAnswer: `**Authentication** = verifying identity.
**Authorization** = checking permissions.

\`\`\`csharp
// Register both
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { ... });
builder.Services.AddAuthorization();

// Pipeline order — authentication MUST come before authorization
app.UseAuthentication();
app.UseAuthorization();
\`\`\`

**Role-based authorization:**
\`\`\`csharp
[Authorize(Roles = "Admin,Manager")]
public IActionResult AdminDashboard() => Ok();
\`\`\`

**Policy-based (more flexible):**
\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SeniorDev", policy =>
        policy.RequireClaim("level", "senior")
              .RequireAuthenticatedUser());
});

[Authorize(Policy = "SeniorDev")]
public IActionResult SeniorFeature() => Ok();
\`\`\`

**JWT flow:**
1. Client sends credentials to /auth/login
2. Server validates and returns a signed JWT
3. Client sends JWT in Authorization: Bearer header
4. Server validates JWT signature on every request — no session storage needed`,
    tags: ['authentication', 'authorization', 'JWT', 'roles', 'policies'],
    followUps: ['What is the difference between JWT and session-based auth?', 'How do you refresh JWT tokens?'],
  },
  {
    id: 'iq-asp-04',
    categoryId: 'aspnet',
    level: 'Mid',
    question: 'What are the key HTTP status codes and when should you use each in a REST API?',
    shortAnswer: '200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 500 Internal Server Error.',
    fullAnswer: `**2xx — Success**
- **200 OK** — GET, PUT, PATCH success with a response body
- **201 Created** — POST created a resource. Include Location header pointing to new resource
- **204 No Content** — DELETE, or PUT/PATCH when no body needed

**4xx — Client Errors**
- **400 Bad Request** — malformed request, cannot parse JSON, invalid syntax
- **401 Unauthorized** — not authenticated (no valid token/session)
- **403 Forbidden** — authenticated but not authorized for this action
- **404 Not Found** — resource does not exist
- **409 Conflict** — duplicate resource, optimistic concurrency failure
- **422 Unprocessable Entity** — syntactically valid but semantically invalid (validation errors)
- **429 Too Many Requests** — rate limit exceeded

**5xx — Server Errors**
- **500 Internal Server Error** — unexpected exception
- **502 Bad Gateway** — upstream service failure
- **503 Service Unavailable** — overloaded, maintenance

**Common mistakes:**
- Returning 200 for errors ("success: false") — breaks HTTP semantics
- Using 400 for authorization failures — should be 403
- Returning 500 for business logic errors — should be 4xx
- Never returning 201 for POST — clients cannot find the new resource`,
    tags: ['REST', 'HTTP', 'status-codes', 'API-design'],
    followUps: ['What is the difference between 401 and 403?', 'What should a 422 response body look like?'],
  },
  {
    id: 'iq-asp-05',
    categoryId: 'aspnet',
    level: 'Mid',
    question: 'How does model validation work in ASP.NET Core? What happens when validation fails?',
    shortAnswer: 'Data Annotations on DTOs are automatically checked before action methods run. When validation fails, ModelState.IsValid is false. With [ApiController], a 400 ProblemDetails response is returned automatically.',
    fullAnswer: `**Data Annotations on the DTO:**
\`\`\`csharp
public class CreateUserRequest
{
    [Required, MaxLength(50)]
    public string Username { get; init; } = "";

    [Required, EmailAddress]
    public string Email { get; init; } = "";

    [Range(18, 120)]
    public int Age { get; init; }
}
\`\`\`

**[ApiController] attribute** enables automatic validation:
- Returns 400 ProblemDetails with field errors before the action runs
- No need to check ModelState manually

**Manual validation when needed:**
\`\`\`csharp
if (!ModelState.IsValid)
    return ValidationProblem(ModelState);
\`\`\`

**Custom validation:**
\`\`\`csharp
public class FutureDateAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext ctx)
    {
        if (value is DateTime date && date <= DateTime.Now)
            return new ValidationResult("Date must be in the future");
        return ValidationResult.Success;
    }
}
\`\`\`

**FluentValidation** (popular alternative): more expressive, testable validation rules separated from the DTO class.`,
    tags: ['validation', 'ModelState', 'DataAnnotations', 'FluentValidation'],
    followUps: ['What is FluentValidation and why might you prefer it?', 'How do you return validation errors in a standard format?'],
  },

  // ─── DevOps & Git ──────────────────────────────────────────────
  {
    id: 'iq-devops-01',
    categoryId: 'devops',
    level: 'Junior',
    question: 'What is the difference between git merge and git rebase?',
    shortAnswer: 'Merge preserves the full history with a merge commit. Rebase replays your commits on top of the target branch, creating a linear history. Rebase rewrites history — never rebase shared/public branches.',
    fullAnswer: `**git merge** — keeps all history, creates a merge commit:
\`\`\`
      A---B---C  feature
     /         \\
D---E---F---G   main (merge commit)
\`\`\`
- Non-destructive — original commits unchanged
- Creates a "merge commit" node in history
- Use for merging long-lived feature branches to main

**git rebase** — replays your commits on top of target:
\`\`\`
              A'--B'--C'  feature (replayed)
             /
D---E---F---G  main
\`\`\`
- Linear history — easier to read
- Rewrites commit SHAs — dangerous on shared branches
- Use for keeping a feature branch up-to-date with main

**Golden rule:** never rebase commits that have been pushed to a shared remote branch. You will force others to deal with diverged history.

**Typical workflow:**
\`\`\`bash
git checkout feature/login
git fetch origin
git rebase origin/main   # keep feature branch current
# ... work ...
git push origin feature/login
# On GitHub: create PR, merge via merge commit or squash
\`\`\``,
    tags: ['git', 'merge', 'rebase', 'branching', 'workflow'],
    followUps: ['What is git squash and when would you use it?', 'How do you resolve a merge conflict?'],
  },
  {
    id: 'iq-devops-02',
    categoryId: 'devops',
    level: 'Junior',
    question: 'What is Docker and why is it useful for development and deployment?',
    shortAnswer: 'Docker packages an application and all its dependencies into a container — a lightweight, portable unit that runs identically everywhere. Eliminates "works on my machine" problems.',
    fullAnswer: `**Docker** solves environment inconsistency by packaging the app and its runtime together.

**Key concepts:**
- **Image** — the blueprint (Dockerfile builds it). Immutable.
- **Container** — a running instance of an image. Isolated process.
- **Dockerfile** — instructions to build an image
- **docker-compose** — define and run multi-container apps

**Simple .NET Dockerfile:**
\`\`\`dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyApp.dll"]
\`\`\`

**docker-compose for local dev:**
\`\`\`yaml
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      - ConnectionStrings__Db=Host=db;Database=myapp
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
\`\`\`

**Why it matters for interviews:**
Shows you understand deployment, not just coding.`,
    tags: ['docker', 'containers', 'deployment', 'devops'],
    followUps: ['What is the difference between a container and a virtual machine?', 'What is Kubernetes?'],
  },
  {
    id: 'iq-devops-03',
    categoryId: 'devops',
    level: 'Mid',
    question: 'What is CI/CD? Describe a basic pipeline for a .NET application.',
    shortAnswer: 'CI (Continuous Integration) automatically builds and tests code on every push. CD (Continuous Delivery/Deployment) automatically deploys passing builds to staging or production.',
    fullAnswer: `**CI — Continuous Integration:**
- Every commit triggers a build and test run
- Catches integration bugs before they reach main
- Tools: GitHub Actions, Azure DevOps, GitLab CI

**CD — Continuous Deployment:**
- Passing CI automatically deploys to production (or staging)
- Reduces manual deployment errors

**Basic GitHub Actions pipeline for .NET:**
\`\`\`yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v3
        with: { dotnet-version: '8.0.x' }
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build --verbosity normal

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp .
      - run: docker push myregistry/myapp:latest
      # Deploy to Azure App Service, AWS, etc.
\`\`\`

**Environment variables in CI:**
- Store secrets in GitHub Secrets, not in code
- Use environment-specific config files (.env.staging, .env.prod)
- Never commit API keys, passwords, or connection strings`,
    tags: ['CI-CD', 'GitHub-Actions', 'pipeline', 'automation', 'devops'],
    followUps: ['What is a deployment environment (staging vs production)?', 'How do you handle database migrations in CI/CD?'],
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
