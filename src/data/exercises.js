// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Mission Exercise Data
//  Each entry maps 'trackId:lessonId' → full mission content
// ═══════════════════════════════════════════════════════════

export const EXERCISES = {

  // ── C# TRACK ──────────────────────────────────────────────

  'csharp:variables': {
    briefing: {
      tag: 'PROD INCIDENT // BILLING',
      title: 'The Invoice Bug',
      scenario: "NexaCore's billing service has been undercharging clients for 3 weeks.",
      problem: "A junior dev used int for all price calculations. $9.99 becomes $9, $0.99 becomes $0. Three enterprise clients were undercharged a total of $4,200 this month.",
      stakes: 'Fix it before the automated billing run fires at midnight.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'decimal vs double for money',
        body: 'For money: always use decimal. It has 28 significant digits with no binary rounding errors. double and float use binary approximations — never use them for financial data.',
        code: `decimal price = 9.99m;   // ✓ exact representation
double  price = 9.99;    // ✗ binary approximation
// 0.1 + 0.2 in double = 0.30000000000000004`,
      },
      {
        id: 'kp2',
        title: 'Integer division silently truncates',
        body: 'int / int = int, truncated toward zero. No exception, no warning. This is the most common source of billing bugs in .NET.',
        code: `int a = 1, b = 2;
int result    = a / b;    // = 0, not 0.5 ← silent bug
decimal safe  = 1m / 2m;  // = 0.5 ✓`,
      },
      {
        id: 'kp3',
        title: 'Math.Round with MidpointRounding',
        body: "Default C# rounding uses banker's rounding: 2.5 rounds to 2 (nearest even). For financial work use MidpointRounding.AwayFromZero.",
        code: `// Banker's rounding (default) — wrong for invoices
Math.Round(2.345m, 2)
// = 2.34 ← unexpected!

// Financial rounding — correct
Math.Round(2.345m, 2, MidpointRounding.AwayFromZero)
// = 2.35 ✓`,
      },
    ],
    exercise: {
      language: 'csharp',
      description: 'Fix CalculateInvoiceTotal so it uses decimal types and returns correctly rounded values.',
      starterCode: `public class InvoiceService
{
    // BUG: int types cause silent truncation
    public int CalculateInvoiceTotal(int unitPrice, int quantity, int taxRate)
    {
        int subtotal = unitPrice * quantity;
        int tax = subtotal * taxRate / 100;
        return subtotal + tax;
    }
}

// Should return:
// CalculateInvoiceTotal(9.99, 3, 10)  => 32.97
// CalculateInvoiceTotal(0.99, 1, 8)   => 1.07`,
      solution: `public class InvoiceService
{
    public decimal CalculateInvoiceTotal(decimal unitPrice, int quantity, decimal taxRate)
    {
        decimal subtotal = unitPrice * quantity;
        decimal tax = subtotal * taxRate / 100m;
        return Math.Round(subtotal + tax, 2, MidpointRounding.AwayFromZero);
    }
}`,
      patterns: [
        { label: 'Uses decimal type', regex: 'decimal' },
        { label: 'Returns decimal (not int)', regex: 'decimal CalculateInvoiceTotal' },
        { label: 'Uses Math.Round', regex: 'Math\\.Round' },
        { label: 'Uses AwayFromZero', regex: 'AwayFromZero' },
        { label: 'Divides by 100m (not 100)', regex: '100m' },
      ],
      hints: [
        'Change int unitPrice, int quantity, int taxRate → decimal unitPrice, int quantity, decimal taxRate. Change the return type too.',
        'When dividing by 100 in a decimal context, write 100m to ensure decimal division: taxRate / 100m',
        'Wrap the return in Math.Round(value, 2, MidpointRounding.AwayFromZero)',
      ],
    },
    challenge: {
      description: 'Add a discountPct parameter (decimal, default 0). Apply discount after tax. Return 0 if the final total would be negative.',
      starterCode: `public decimal CalculateInvoiceTotal(
    decimal unitPrice,
    int quantity,
    decimal taxRate,
    decimal discountPct = 0)
{
    // 1. Calculate subtotal
    // 2. Apply tax
    // 3. Apply discount
    // 4. Round to 2 decimals, minimum 0
}`,
      hints: [
        'Steps: subtotal → add tax → subtract discount → clamp to 0.',
        'discount = total * discountPct / 100m',
        'Use Math.Max(0m, result) to prevent negative totals.',
      ],
    },
  },

  'csharp:control-flow': {
    briefing: {
      tag: 'BUG REPORT // API',
      title: 'The Status Code Disaster',
      scenario: 'NexaCore API returns 200 OK for every response — including errors.',
      problem: "A developer hardcoded return Ok() for all outcomes. Now client apps can't tell success from failure. The monitoring system shows 0% error rate while clients report widespread failures.",
      stakes: 'Fix the status mapping before the sprint review in 90 minutes.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'Switch expressions (C# 8+)',
        body: 'Switch expressions are the modern way to map values. More concise than switch statements, can be used as expressions (assigned to variables, returned directly).',
        code: `string label = status switch
{
    "active"   => "Running",
    "inactive" => "Stopped",
    "error"    => "Failed",
    _          => "Unknown"   // default
};`,
      },
      {
        id: 'kp2',
        title: 'Guard clauses over nested if',
        body: 'Return early on invalid conditions. This flattens nesting and keeps the happy path readable. Senior devs call this "fail fast".',
        code: `// ✗ Nested — hard to read
public Result Process(Order order) {
    if (order != null) {
        if (order.Items.Count > 0) {
            // actual logic buried here
        }
    }
}

// ✓ Guard clauses — clear
public Result Process(Order order) {
    if (order == null) return Result.Fail("Order is null");
    if (order.Items.Count == 0) return Result.Fail("No items");
    // happy path here, not buried
}`,
      },
      {
        id: 'kp3',
        title: 'HTTP status semantics',
        body: '200 = success, 201 = created, 400 = bad request (client error), 401 = unauthorized, 404 = not found, 409 = conflict, 500 = server error. Match your return type to the outcome.',
        code: `// In ASP.NET Core controllers:
return Ok(data);           // 200
return Created(uri, data); // 201
return BadRequest(errors); // 400
return NotFound();         // 404
return Conflict();         // 409`,
      },
    ],
    exercise: {
      language: 'csharp',
      description: 'Implement GetHttpStatus() that maps an outcome string to the correct HTTP status code using a switch expression.',
      starterCode: `public class ApiHelper
{
    // Map outcome to HTTP status code
    // "success"       => 200
    // "created"       => 201
    // "bad_request"   => 400
    // "unauthorized"  => 401
    // "not_found"     => 404
    // "conflict"      => 409
    // anything else   => 500
    public int GetHttpStatus(string outcome)
    {
        // Replace with switch expression
        return 200;
    }
}`,
      solution: `public class ApiHelper
{
    public int GetHttpStatus(string outcome) => outcome switch
    {
        "success"      => 200,
        "created"      => 201,
        "bad_request"  => 400,
        "unauthorized" => 401,
        "not_found"    => 404,
        "conflict"     => 409,
        _              => 500
    };
}`,
      patterns: [
        { label: 'Uses switch expression', regex: 'switch' },
        { label: 'Handles "not_found" => 404', regex: '404' },
        { label: 'Handles "unauthorized" => 401', regex: '401' },
        { label: 'Has default case (_)', regex: '_\\s*=>' },
        { label: 'Returns 500 for unknown', regex: '500' },
      ],
      hints: [
        'Use the switch expression syntax: outcome switch { "success" => 200, ... }',
        'The default case in switch expressions uses the discard pattern: _ => 500',
        'You can return the switch expression directly: public int GetHttpStatus(string outcome) => outcome switch { ... };',
      ],
    },
    challenge: {
      description: 'Add a second method IsClientError(int statusCode) that returns true for 4xx status codes, and IsServerError(int statusCode) for 5xx. Use expressions, not if/else.',
      starterCode: `public bool IsClientError(int statusCode)
{
    // true for 400-499
}

public bool IsServerError(int statusCode)
{
    // true for 500-599
}`,
      hints: [
        'Use range pattern: statusCode is >= 400 and <= 499',
        'Or: statusCode / 100 == 4 for client errors.',
      ],
    },
  },

  'csharp:methods': {
    briefing: {
      tag: 'CODE REVIEW // NULL SAFETY',
      title: 'The NullReferenceException Epidemic',
      scenario: "NexaCore's user service throws NullReferenceException in prod every Friday afternoon.",
      problem: 'Methods return null without documenting it. Callers forget to null-check. The pattern spreads — now 12 methods can return null and nobody knows which ones.',
      stakes: 'Refactor the user lookup method to be null-safe using C# 8 nullable reference types.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'Nullable reference types (C# 8+)',
        body: 'Add ? to signal "this can be null". The compiler then warns callers to check. This makes nullability part of the API contract.',
        code: `string? name = null;    // ✓ explicitly nullable
string  name = null;    // ✗ compiler warning in NRT mode

User? FindUser(int id)  // signals: might return null
User  FindUser(int id)  // signals: never returns null`,
      },
      {
        id: 'kp2',
        title: 'Null-coalescing and null-conditional',
        body: '?? returns a fallback if null. ?. short-circuits the chain if null. Together they eliminate most null-check boilerplate.',
        code: `string name = user?.Name ?? "Anonymous";
int count = user?.Orders?.Count ?? 0;

// Without them:
string name = user != null && user.Name != null
    ? user.Name : "Anonymous";`,
      },
      {
        id: 'kp3',
        title: 'ArgumentNullException.ThrowIfNull (C# 10)',
        body: 'Guard public method inputs at the top. Fail fast with a clear error rather than a confusing NullReferenceException 10 calls deep.',
        code: `public void ProcessOrder(Order order, User user)
{
    ArgumentNullException.ThrowIfNull(order);
    ArgumentNullException.ThrowIfNull(user);
    // safe from here down
}`,
      },
    ],
    exercise: {
      language: 'csharp',
      description: 'Rewrite GetUserDisplayName to be null-safe: accept nullable User, return a fallback string, use ?. and ?? operators.',
      starterCode: `public class UserService
{
    // BUG: crashes if user is null, or user.Profile is null
    public string GetUserDisplayName(User user)
    {
        return user.Profile.DisplayName;
    }
}

public class User
{
    public string? Name { get; set; }
    public UserProfile? Profile { get; set; }
}

public class UserProfile
{
    public string? DisplayName { get; set; }
}`,
      solution: `public class UserService
{
    public string GetUserDisplayName(User? user)
    {
        return user?.Profile?.DisplayName
            ?? user?.Name
            ?? "Anonymous";
    }
}`,
      patterns: [
        { label: 'Parameter is nullable (User?)', regex: 'User\\?' },
        { label: 'Uses ?. operator', regex: '\\?\\.' },
        { label: 'Uses ?? fallback', regex: '\\?\\?' },
        { label: 'Returns fallback string', regex: '"[A-Za-z]+"' },
      ],
      hints: [
        'Change the parameter to User? user to accept null inputs.',
        'Chain null-conditionals: user?.Profile?.DisplayName',
        'Add ?? "Anonymous" at the end as the final fallback.',
      ],
    },
    challenge: {
      description: 'Add a method UpdateDisplayName(User? user, string? newName) that: validates both params are non-null (throw ArgumentNullException), trims whitespace from newName, rejects empty strings, then sets the display name.',
      starterCode: `public void UpdateDisplayName(User? user, string? newName)
{
    // 1. Guard: throw if user or newName is null
    // 2. Trim newName
    // 3. Throw ArgumentException if trimmed name is empty
    // 4. Set user.Profile ??= new UserProfile()
    // 5. Assign the trimmed name
}`,
      hints: [
        'Use ArgumentNullException.ThrowIfNull(user) and ArgumentNullException.ThrowIfNull(newName)',
        'string trimmed = newName.Trim(); if (trimmed.Length == 0) throw new ArgumentException(...)',
        'user.Profile ??= new UserProfile(); ensures Profile exists before assigning.',
      ],
    },
  },

  // ── REACT TRACK ───────────────────────────────────────────

  'react:components': {
    briefing: {
      tag: 'CODE SMELL // DRY VIOLATION',
      title: 'The Copy-Paste Crisis',
      scenario: "The NexaCore dashboard has 6 different versions of the same user card.",
      problem: "A junior dev copy-pasted a UserCard component 6 times with slight variations. A design update required changing 6 files — one was missed. Production now shows an inconsistent avatar size for Premium users.",
      stakes: 'Build one reusable UserCard component to replace all 6.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'Props are your component API',
        body: 'Design props like a function signature. Use destructuring with defaults. Name props for what they represent, not how they look.',
        code: `// ✓ Clear props with defaults
function UserCard({ name, role, avatar = '👤', isOnline = false }) {
  return <div>...</div>;
}

// Usage:
<UserCard name="Sofia" role="Tech Lead" isOnline={true} />
<UserCard name="Marcus" role="Dev" />  // avatar defaults to 👤`,
      },
      {
        id: 'kp2',
        title: 'Conditional rendering patterns',
        body: 'Use && for "render if truthy". Use ?? for value fallbacks. Avoid ternaries that render null.',
        code: `{isOnline && <span className="online-dot" />}
{badge && <span className="badge">{badge}</span>}
{count ?? 0}   // fallback if null/undefined`,
      },
      {
        id: 'kp3',
        title: 'Dynamic className composition',
        body: 'Build className strings dynamically using template literals or lookup objects. Avoid inline style objects — they bypass Tailwind and CSS cascade.',
        code: `const sizes = { sm: 'text-sm p-2', md: 'text-base p-4', lg: 'text-lg p-6' };

<div className={\`card \${sizes[size]} \${isOnline ? 'border-green-500' : 'border-slate-700'}\`}>`,
      },
    ],
    exercise: {
      language: 'javascript',
      description: "Build a UserCard component. Props: name (string), role (string), avatar (emoji, default '👤'), isOnline (boolean, default false). Show a green badge when online. Make it look good on a dark background.",
      starterCode: `import React from 'react';

function UserCard({ name, role, avatar = '👤', isOnline = false }) {
  // Build a card that shows:
  // - large avatar at the top (emoji, centered)
  // - name in bold
  // - role in smaller muted text
  // - green "● Online" indicator when isOnline is true
  return (
    <div style={{ /* your styles here */ }}>
      {/* Your JSX */}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 32, background: '#0f172a', minHeight: '100vh', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <UserCard name="Sofia Chen" role="Tech Lead" avatar="👩‍💼" isOnline={true} />
      <UserCard name="Marcus Webb" role="Senior Dev" avatar="👨‍💻" isOnline={false} />
      <UserCard name="Lena Fischer" role="QA Engineer" />
    </div>
  );
}`,
      hints: [
        "Give the card a dark background (e.g. background: '#1e293b'), some padding, a border-radius, and a border.",
        "For the online indicator: {isOnline && <div style={{ color: '#4ade80' }}>● Online</div>}",
        "Use fontSize: '2rem', textAlign: 'center' for the avatar. The third card uses the default 👤 from destructuring.",
      ],
    },
    challenge: {
      description: "Add a size prop ('sm' | 'md' | 'lg') that scales the card dimensions and text. Add an optional badge prop (string) that shows as a small colored pill below the role.",
      starterCode: `import React from 'react';

const SIZES = {
  sm: { padding: 12, avatarSize: '1.5rem', nameSize: '0.875rem' },
  md: { padding: 20, avatarSize: '2.5rem', nameSize: '1rem' },
  lg: { padding: 28, avatarSize: '3.5rem', nameSize: '1.25rem' },
};

function UserCard({ name, role, avatar = '👤', isOnline = false, size = 'md', badge }) {
  const s = SIZES[size];
  // Use s.padding, s.avatarSize, s.nameSize for your styles
  // badge: if provided, show as a small pill with a blue background
  return <div>...</div>;
}

export default function App() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 32, background: '#0f172a', minHeight: '100vh', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <UserCard name="Sofia" role="Tech Lead" size="sm" isOnline={true} />
      <UserCard name="Marcus" role="Senior Dev" size="md" badge="PRO" />
      <UserCard name="Lena" role="QA" size="lg" avatar="🧪" />
    </div>
  );
}`,
      hints: [
        'Destructure the size object: const { padding, avatarSize, nameSize } = SIZES[size];',
        'For the badge: {badge && <span style={{ background: "#1d4ed8", color: "#bfdbfe", padding: "2px 10px", borderRadius: 99, fontSize: "0.75rem" }}>{badge}</span>}',
      ],
    },
  },

  'react:hooks-state': {
    briefing: {
      tag: 'BUG REPORT // UI STATE',
      title: 'The Shopping Cart Counter',
      scenario: "NexaCore's product catalog shows a cart counter that never updates correctly.",
      problem: "The dev used a regular variable for the cart count. React doesn't re-render on regular variable changes — only on state changes. Users add items but the count stays at 0.",
      stakes: 'Fix the cart state so the counter updates on every add/remove.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'useState: state triggers re-renders',
        body: "Regular variables don't cause re-renders. useState does. When you call the setter, React schedules a re-render with the new value.",
        code: `// ✗ Regular variable — won't re-render
let count = 0;
count++;  // UI stays at 0

// ✓ useState — triggers re-render
const [count, setCount] = useState(0);
setCount(count + 1);  // React re-renders with count = 1`,
      },
      {
        id: 'kp2',
        title: 'Functional updates for derived state',
        body: 'When new state depends on old state, use the functional form: setCount(prev => prev + 1). This is safe in async contexts and batched updates.',
        code: `// ✓ Safe: uses the latest state value
setCount(prev => prev + 1);

// ✗ Risky: "count" might be stale in closures
setCount(count + 1);`,
      },
      {
        id: 'kp3',
        title: 'State is a snapshot',
        body: "State doesn't change mid-render. The value of count you read in an event handler is the value from when the render happened. This is why functional updates matter for rapid clicks.",
        code: `// Clicking quickly 3 times:
// With count + 1: might only increment once (stale closure)
// With prev => prev + 1: always increments correctly`,
      },
    ],
    exercise: {
      language: 'javascript',
      description: 'Build a CartCounter component with Add and Remove buttons. Count cannot go below 0. Show a "Cart is empty" message at 0, and "🛒 {n} items" above 0.',
      starterCode: `import React, { useState } from 'react';

function CartCounter() {
  // BUG: Using a regular variable — won't trigger re-renders
  let count = 0;

  function addItem() {
    count++;  // This won't update the UI!
  }

  function removeItem() {
    if (count > 0) count--;
  }

  return (
    <div style={{ padding: 32, background: '#1e293b', borderRadius: 12, color: '#e2e8f0', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 16, fontSize: '1.25rem', fontWeight: 'bold' }}>
        {count === 0 ? 'Cart is empty' : \`🛒 \${count} item\${count !== 1 ? 's' : ''}\`}
      </h2>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={removeItem} style={{ padding: '8px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '1.25rem' }}>−</button>
        <button onClick={addItem}    style={{ padding: '8px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '1.25rem' }}>+</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <CartCounter />
    </div>
  );
}`,
      hints: [
        'Replace let count = 0 with const [count, setCount] = useState(0)',
        'In addItem: call setCount(prev => prev + 1)',
        'In removeItem: call setCount(prev => Math.max(0, prev - 1)) to prevent going below 0',
      ],
    },
    challenge: {
      description: 'Extend CartCounter with a max limit prop (default 10). Show a "Limit reached" warning in amber when at max. Add a Reset button that clears to 0. Use a single state object { count, limit }.',
      starterCode: `import React, { useState } from 'react';

function CartCounter({ max = 10 }) {
  const [count, setCount] = useState(0);

  // Add: respect max limit
  // Remove: respect floor of 0
  // Reset: set count to 0
  // Show amber warning at max

  return <div>...</div>;
}

export default function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <CartCounter max={5} />
    </div>
  );
}`,
      hints: [
        'In addItem: setCount(prev => Math.min(max, prev + 1))',
        'Show warning: {count >= max && <p style={{ color: "#fbbf24" }}>Limit reached!</p>}',
        'Reset button: <button onClick={() => setCount(0)}>Reset</button>',
      ],
    },
  },

  'react:hooks-effect': {
    briefing: {
      tag: 'FEATURE REQUEST // API INTEGRATION',
      title: 'The Stale Data Dashboard',
      scenario: "NexaCore's user profile page shows data from the wrong user when navigating quickly.",
      problem: "The dev fetched data without cleanup. When a user navigates fast (userId changes), the old fetch completes after the new one, overwriting the correct data. Classic race condition.",
      stakes: 'Fix the useEffect to cancel stale requests and handle loading/error states properly.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'useEffect dependency array',
        body: 'The dependency array controls when the effect re-runs. Empty [] = once on mount. [userId] = every time userId changes. Missing deps = stale closures and hard-to-find bugs.',
        code: `useEffect(() => {
  fetchUser(userId);
}, [userId]);  // re-runs whenever userId changes`,
      },
      {
        id: 'kp2',
        title: 'Cleanup with AbortController',
        body: 'Return a cleanup function from useEffect to cancel in-flight requests. This prevents race conditions and memory leaks when the component unmounts or deps change.',
        code: `useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    });

  return () => controller.abort();  // cleanup!
}, [userId]);`,
      },
      {
        id: 'kp3',
        title: 'Loading and error states',
        body: 'A complete data fetch needs three states: loading (show spinner), data (show content), error (show message). Always handle all three — never render partially loaded UI.',
        code: `const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

if (loading) return <Spinner />;
if (error)   return <ErrorMsg message={error} />;
return <UserCard user={user} />;`,
      },
    ],
    exercise: {
      language: 'javascript',
      description: 'Build a UserProfile component that fetches from https://jsonplaceholder.typicode.com/users/{userId}. Handle loading, error, and data states. Add AbortController cleanup.',
      starterCode: `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  // TODO: add loading and error state

  useEffect(() => {
    // TODO: fetch the user, handle loading/error states
    // URL: https://jsonplaceholder.typicode.com/users/\${userId}
    // TODO: add AbortController for cleanup
    fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]); // dependency array is correct

  if (!user) return <div style={{ color: '#94a3b8', padding: 32 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, background: '#1e293b', borderRadius: 12, color: '#e2e8f0', maxWidth: 320 }}>
      <h2 style={{ fontWeight: 'bold', marginBottom: 8 }}>{user.name}</h2>
      <p style={{ color: '#94a3b8' }}>{user.email}</p>
      <p style={{ color: '#94a3b8' }}>{user.phone}</p>
    </div>
  );
}

export default function App() {
  const [userId, setUserId] = useState(1);
  return (
    <div style={{ padding: 32, background: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1,2,3].map(id => (
          <button key={id} onClick={() => setUserId(id)}
            style={{ padding: '8px 16px', background: userId === id ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            User {id}
          </button>
        ))}
      </div>
      <UserProfile userId={userId} />
    </div>
  );
}`,
      hints: [
        'Add: const [loading, setLoading] = useState(true); and const [error, setError] = useState(null);',
        'At the start of the fetch: setLoading(true); setError(null); At the end: setLoading(false);',
        'Add AbortController: const controller = new AbortController(); pass { signal: controller.signal } to fetch. Return () => controller.abort();',
      ],
    },
    challenge: {
      description: 'Extract the fetch logic into a custom hook: useUser(userId) that returns { user, loading, error }. The component should only use the hook, not any fetch logic.',
      starterCode: `import React, { useState, useEffect } from 'react';

// Build this custom hook:
function useUser(userId) {
  // Move all fetch logic here
  // Return { user, loading, error }
}

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  // Component is now clean — no fetch logic
  if (loading) return <div style={{ color: '#94a3b8', padding: 32 }}>Loading...</div>;
  if (error)   return <div style={{ color: '#f87171', padding: 32 }}>Error: {error}</div>;
  return (
    <div style={{ padding: 24, background: '#1e293b', borderRadius: 12, color: '#e2e8f0' }}>
      <h2 style={{ fontWeight: 'bold' }}>{user?.name}</h2>
      <p style={{ color: '#94a3b8' }}>{user?.email}</p>
    </div>
  );
}

export default function App() {
  const [userId, setUserId] = useState(1);
  return (
    <div style={{ padding: 32, background: '#0f172a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[1,2,3].map(id => (
          <button key={id} onClick={() => setUserId(id)}
            style={{ padding: '8px 16px', background: userId === id ? '#3b82f6' : '#334155', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            User {id}
          </button>
        ))}
      </div>
      <UserProfile userId={userId} />
    </div>
  );
}`,
      hints: [
        'function useUser(userId) { const [user, setUser] = useState(null); ... return { user, loading, error }; }',
        'Move the entire useEffect and all state declarations into the hook body.',
        'Custom hooks must start with "use" — this is a React convention enforced by the linter.',
      ],
    },
  },

  // ── APIS TRACK ────────────────────────────────────────────

  'apis:controllers': {
    briefing: {
      tag: 'SPRINT TICKET // FEATURE',
      title: 'Build the Project Endpoints',
      scenario: "NexaCore's project management module needs a REST API.",
      problem: "The frontend team is blocked — they need GET /api/projects, GET /api/projects/{id}, and POST /api/projects endpoints. The backend has the data layer ready. You just need the controller.",
      stakes: 'Deliver working endpoints before the sprint demo at 4pm.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'Controller structure in ASP.NET Core',
        body: 'Controllers inherit from ControllerBase (API) or Controller (MVC+Views). Use [ApiController] for automatic model validation and [Route] for URL mapping.',
        code: `[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _service;

    public ProjectsController(IProjectService service)
    {
        _service = service;
    }
}`,
      },
      {
        id: 'kp2',
        title: 'HTTP verb attributes',
        body: "[HttpGet], [HttpPost], [HttpPut], [HttpDelete] map methods to HTTP verbs. Route parameters use {id} notation. Always return IActionResult or ActionResult<T> for flexibility.",
        code: `[HttpGet]
public ActionResult<IEnumerable<Project>> GetAll() { }

[HttpGet("{id}")]
public ActionResult<Project> GetById(int id) { }

[HttpPost]
public ActionResult<Project> Create([FromBody] CreateProjectDto dto) { }`,
      },
      {
        id: 'kp3',
        title: 'Correct status codes from controllers',
        body: 'Return Ok(data) for 200, CreatedAtAction for 201 (with location header), NotFound() for 404, BadRequest() for 400. CreatedAtAction is important — it tells clients where to find the new resource.',
        code: `return Ok(projects);            // 200 + data
return NotFound();              // 404

return CreatedAtAction(
    nameof(GetById),            // route name
    new { id = project.Id },    // route values
    project                     // response body
);  // 201 + Location header`,
      },
    ],
    exercise: {
      language: 'csharp',
      description: 'Complete the ProjectsController with three endpoints: GET all projects, GET by id (404 if not found), POST create (return 201 with location).',
      starterCode: `[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly List<Project> _projects = new()
    {
        new Project { Id = 1, Name = "Alpha", Status = "active" },
        new Project { Id = 2, Name = "Beta",  Status = "planning" },
    };

    // TODO: GET api/projects — return all projects
    public ActionResult<IEnumerable<Project>> GetAll()
    {
        return null; // fix this
    }

    // TODO: GET api/projects/{id} — return project or 404
    public ActionResult<Project> GetById(int id)
    {
        return null; // fix this
    }

    // TODO: POST api/projects — create project, return 201
    public ActionResult<Project> Create([FromBody] CreateProjectDto dto)
    {
        return null; // fix this
    }
}

public record Project   { public int Id { get; set; } public string Name { get; set; } = ""; public string Status { get; set; } = ""; }
public record CreateProjectDto { public string Name { get; set; } = ""; }`,
      solution: `[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly List<Project> _projects = new()
    {
        new Project { Id = 1, Name = "Alpha", Status = "active" },
        new Project { Id = 2, Name = "Beta",  Status = "planning" },
    };

    [HttpGet]
    public ActionResult<IEnumerable<Project>> GetAll() => Ok(_projects);

    [HttpGet("{id}")]
    public ActionResult<Project> GetById(int id)
    {
        var project = _projects.FirstOrDefault(p => p.Id == id);
        return project is null ? NotFound() : Ok(project);
    }

    [HttpPost]
    public ActionResult<Project> Create([FromBody] CreateProjectDto dto)
    {
        var project = new Project { Id = _projects.Count + 1, Name = dto.Name, Status = "planning" };
        _projects.Add(project);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }
}`,
      patterns: [
        { label: '[HttpGet] on GetAll', regex: '\\[HttpGet\\]' },
        { label: '[HttpGet("{id}")] on GetById', regex: '\\[HttpGet\\("\\{id\\}"\\)\\]' },
        { label: '[HttpPost] on Create', regex: '\\[HttpPost\\]' },
        { label: 'Returns NotFound() for missing', regex: 'NotFound\\(\\)' },
        { label: 'Returns CreatedAtAction for POST', regex: 'CreatedAtAction' },
      ],
      hints: [
        'Add [HttpGet] above GetAll and return Ok(_projects)',
        'Add [HttpGet("{id}")] above GetById. Use FirstOrDefault then check if null: return project is null ? NotFound() : Ok(project)',
        'Add [HttpPost] above Create. Build the new Project, add it to the list, return CreatedAtAction(nameof(GetById), new { id = project.Id }, project)',
      ],
    },
    challenge: {
      description: 'Add DELETE api/projects/{id} (return 204 No Content if deleted, 404 if not found) and PUT api/projects/{id} (update name, return 200 with updated project).',
      starterCode: `// Add to ProjectsController:

// DELETE api/projects/{id}
public IActionResult Delete(int id)
{
}

// PUT api/projects/{id}
public ActionResult<Project> Update(int id, [FromBody] CreateProjectDto dto)
{
}`,
      hints: [
        'DELETE: [HttpDelete("{id}")] — find project, remove from list, return NoContent() or NotFound()',
        'PUT: [HttpPut("{id}")] — find project, update its Name, return Ok(project) or NotFound()',
      ],
    },
  },

  // ── OOP TRACK ─────────────────────────────────────────────

  'oop:classes': {
    briefing: {
      tag: 'ARCHITECTURE // CLASS DESIGN',
      title: 'The God Class Problem',
      scenario: "NexaCore has a single 800-line UserManager class that does everything.",
      problem: "It handles authentication, sends emails, calculates billing, manages sessions, AND validates data. Adding a feature means reading 800 lines to understand impact. Bugs in billing break authentication.",
      stakes: 'Split the God class into focused, single-responsibility classes.',
    },
    keyPoints: [
      {
        id: 'kp1',
        title: 'Single Responsibility Principle',
        body: 'A class should have one reason to change. If you describe a class and use the word "and", it probably violates SRP. Split at the "and".',
        code: `// ✗ God class — does everything
class UserManager {
    Login()       { }  // auth
    SendEmail()   { }  // notifications
    CalcBilling() { }  // billing
    ValidateAge() { }  // validation
}

// ✓ SRP — each class has one purpose
class AuthService      { Login()       { } }
class EmailService     { SendEmail()   { } }
class BillingService   { CalcBilling() { } }
class UserValidator    { ValidateAge() { } }`,
      },
      {
        id: 'kp2',
        title: 'Encapsulation: private fields, public contract',
        body: 'Fields should be private. Only expose what callers need through public methods/properties. This lets you change internals without breaking callers.',
        code: `public class BankAccount
{
    private decimal _balance;   // hidden internal state

    public decimal Balance => _balance;  // read-only property

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Must be positive");
        _balance += amount;
    }
}`,
      },
      {
        id: 'kp3',
        title: 'Constructor injection for dependencies',
        body: 'Pass dependencies through the constructor. This makes dependencies explicit, enables testing with mocks, and enables DI containers to wire things up.',
        code: `// ✗ Hidden dependency — hard to test, hard to swap
class OrderService {
    private DbContext _db = new DbContext(); // hardcoded!
}

// ✓ Constructor injection — explicit, testable
class OrderService {
    private readonly IDbContext _db;
    public OrderService(IDbContext db) { _db = db; }
}`,
      },
    ],
    exercise: {
      language: 'csharp',
      description: "Design a BankAccount class with: private _balance field, Balance property (read-only), Deposit(amount) method (throws on negative), Withdraw(amount) method (throws on overdraft), and GetStatement() returning a formatted string.",
      starterCode: `public class BankAccount
{
    // TODO: private _balance field

    // TODO: Balance property (read-only, shows _balance)

    // TODO: Deposit(decimal amount)
    // - throw ArgumentException if amount <= 0
    // - add to balance

    // TODO: Withdraw(decimal amount)
    // - throw ArgumentException if amount <= 0
    // - throw InvalidOperationException("Insufficient funds") if amount > balance
    // - subtract from balance

    // TODO: GetStatement()
    // Return: "Balance: $X.XX"
}`,
      solution: `public class BankAccount
{
    private decimal _balance;

    public decimal Balance => _balance;

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Deposit must be positive.");
        _balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Withdrawal must be positive.");
        if (amount > _balance) throw new InvalidOperationException("Insufficient funds.");
        _balance -= amount;
    }

    public string GetStatement() => $"Balance: \${_balance:F2}";
}`,
      patterns: [
        { label: 'Private _balance field', regex: 'private decimal _balance' },
        { label: 'Read-only Balance property', regex: 'Balance\\s*=>' },
        { label: 'Deposit throws on invalid', regex: 'ArgumentException' },
        { label: 'Withdraw checks for overdraft', regex: 'InvalidOperationException' },
        { label: 'GetStatement formats balance', regex: 'GetStatement' },
      ],
      hints: [
        'private decimal _balance; — no initial value needed (defaults to 0)',
        'public decimal Balance => _balance; — expression-bodied read-only property',
        'In Withdraw: if (amount > _balance) throw new InvalidOperationException("Insufficient funds.");',
      ],
    },
    challenge: {
      description: 'Add a transaction history. Keep a private List<string> _transactions. Every Deposit and Withdraw appends a record (e.g., "+$50.00" or "-$30.00"). Add GetTransactionHistory() that returns the full list.',
      starterCode: `public class BankAccount
{
    private decimal _balance;
    private List<string> _transactions = new();

    public decimal Balance => _balance;

    public void Deposit(decimal amount)
    {
        // Existing validation + balance update
        // Also: _transactions.Add(...)
    }

    public void Withdraw(decimal amount)
    {
        // Existing validation + balance update
        // Also: _transactions.Add(...)
    }

    public IReadOnlyList<string> GetTransactionHistory() => _transactions.AsReadOnly();
    public string GetStatement() => $"Balance: \${_balance:F2} | {_transactions.Count} transaction(s)";
}`,
      hints: [
        'After _balance += amount: _transactions.Add($"+\${amount:F2}")',
        'After _balance -= amount: _transactions.Add($"-\${amount:F2}")',
        'Return _transactions.AsReadOnly() to prevent callers from modifying the list.',
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export function getExercise(trackId, lessonId) {
  return EXERCISES[`${trackId}:${lessonId}`] ?? null;
}

export function hasExercise(trackId, lessonId) {
  return Boolean(EXERCISES[`${trackId}:${lessonId}`]);
}

export function getExerciseCount() {
  return Object.keys(EXERCISES).length;
}
