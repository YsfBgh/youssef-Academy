// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Practice Exercises
//  Exercises with hints, starter code, full solutions, explanations
//  Topics: C#, JavaScript, React, SQL, ASP.NET Core, Algorithms
// ═══════════════════════════════════════════════════════════

export const EXERCISE_TOPICS = [
  { id: 'csharp',    label: 'C#',           color: 'blue',    badge: 'bg-blue-500/20 text-blue-300',    icon: '⚙️' },
  { id: 'javascript',label: 'JavaScript',   color: 'amber',   badge: 'bg-amber-500/20 text-amber-300',  icon: '🟨' },
  { id: 'react',     label: 'React',        color: 'emerald', badge: 'bg-emerald-500/20 text-emerald-300', icon: '⚛️' },
  { id: 'sql',       label: 'SQL',          color: 'rose',    badge: 'bg-rose-500/20 text-rose-300',    icon: '🗄️' },
  { id: 'aspnet',    label: 'ASP.NET Core', color: 'violet',  badge: 'bg-violet-500/20 text-violet-300', icon: '🔌' },
  { id: 'algorithms',label: 'Algorithms',   color: 'sky',     badge: 'bg-sky-500/20 text-sky-300',      icon: '📊' },
  { id: 'refactor',  label: 'Refactoring',  color: 'orange',  badge: 'bg-orange-500/20 text-orange-300', icon: '🔧' },
];

export const EXERCISES = [

  // ─── C# ───────────────────────────────────────────────────────

  {
    id: 'ex-cs-01',
    topic: 'csharp',
    subtopic: 'Control Flow',
    difficulty: 'Beginner',
    xpReward: 30,
    title: 'FizzBuzz',
    description: 'Print numbers 1–30. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".',
    objective: 'Practice `for` loops and conditional logic.',
    hints: [
      'Use the modulo operator `%` to check divisibility.',
      'Check the combined case (% 15) before the individual cases.',
      'Use `Console.WriteLine()` to print each result.',
    ],
    starterCode: 'for (int i = 1; i <= 30; i++)\n{\n    // Your logic here\n}',
    solution: 'for (int i = 1; i <= 30; i++)\n{\n    if (i % 15 == 0)      Console.WriteLine("FizzBuzz");\n    else if (i % 3 == 0)  Console.WriteLine("Fizz");\n    else if (i % 5 == 0)  Console.WriteLine("Buzz");\n    else                  Console.WriteLine(i);\n}',
    explanation: 'We check `% 15` first — if a number divides by both 3 and 5, we want "FizzBuzz" not "Fizz". Order of if-else matters here.',
    commonMistakes: [
      'Checking % 3 and % 5 before % 15 — causes "Fizz" to print instead of "FizzBuzz".',
      'Using = instead of == for comparison.',
    ],
    expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n...',
    tags: ['loops', 'conditionals', 'modulo'],
  },

  {
    id: 'ex-cs-02',
    topic: 'csharp',
    subtopic: 'Strings',
    difficulty: 'Beginner',
    xpReward: 30,
    title: 'Reverse a String',
    description: 'Write a method `ReverseString(string s)` that returns the string reversed without using built-in reverse helpers.',
    objective: 'Understand character arrays and string construction.',
    hints: [
      'Convert the string to a `char[]` using `s.ToCharArray()`.',
      'Use a `for` loop that starts from the end and works backwards.',
      'Build the result with `new string(charArray)` or `string.Concat`.',
    ],
    starterCode: 'static string ReverseString(string s)\n{\n    // Your code here\n    return "";\n}',
    solution: 'static string ReverseString(string s)\n{\n    char[] chars = s.ToCharArray();\n    int left = 0, right = chars.Length - 1;\n    while (left < right)\n    {\n        (chars[left], chars[right]) = (chars[right], chars[left]);\n        left++;\n        right--;\n    }\n    return new string(chars);\n}',
    explanation: 'Two-pointer approach: swap characters from both ends moving inward. O(n) time, O(n) space for the char array. The built-in `Array.Reverse` does the same thing internally.',
    commonMistakes: [
      'Forgetting strings are immutable — you cannot modify characters in-place on a string.',
      'Off-by-one errors with the loop boundary.',
    ],
    expectedOutput: 'ReverseString("hello") => "olleh"\nReverseString("abcde") => "edcba"',
    tags: ['strings', 'arrays', 'two-pointers'],
  },

  {
    id: 'ex-cs-03',
    topic: 'csharp',
    subtopic: 'LINQ',
    difficulty: 'Intermediate',
    xpReward: 50,
    title: 'LINQ: Filter, Transform, Aggregate',
    description: 'Given a list of students with Name and Score, use LINQ to:\n1. Filter students who scored above 70\n2. Return their names sorted alphabetically\n3. Calculate the average score of passing students',
    objective: 'Practice chaining LINQ operators: Where, OrderBy, Select, Average.',
    hints: [
      'Use `Where()` to filter, `OrderBy()` to sort, `Select()` to project.',
      'Chain operators: `students.Where(...).OrderBy(...).Select(...)`.',
      'Use `Average()` at the end of a filtered query to get the mean.',
    ],
    starterCode: 'var students = new List<Student>\n{\n    new("Alice", 85), new("Bob", 62), new("Carol", 91),\n    new("Dave", 74), new("Eve", 58)\n};\n\n// 1. Names of passing students (score > 70), sorted\nvar passingNames = // your LINQ here\n\n// 2. Average score of passing students\ndouble avgScore = // your LINQ here\n\nrecord Student(string Name, int Score);',
    solution: 'var students = new List<Student>\n{\n    new("Alice", 85), new("Bob", 62), new("Carol", 91),\n    new("Dave", 74), new("Eve", 58)\n};\n\nvar passingNames = students\n    .Where(s => s.Score > 70)\n    .OrderBy(s => s.Name)\n    .Select(s => s.Name)\n    .ToList();\n// ["Alice", "Carol", "Dave"]\n\ndouble avgScore = students\n    .Where(s => s.Score > 70)\n    .Average(s => s.Score);\n// 83.33\n\nrecord Student(string Name, int Score);',
    explanation: 'LINQ chains are lazy — they do not execute until materialized by ToList(), Average(), etc. Each operator returns IEnumerable<T> so you can keep chaining. Deferred execution means the filter and sort happen in one pass, not multiple iterations.',
    commonMistakes: [
      'Calling ToList() too early, breaking the lazy chain unnecessarily.',
      'Using Select before Where — projects all items before filtering, doing extra work.',
      'Forgetting that LINQ does not modify the original list.',
    ],
    expectedOutput: 'passingNames: ["Alice", "Carol", "Dave"]\navgScore: 83.33',
    tags: ['linq', 'collections', 'functional'],
  },

  {
    id: 'ex-cs-04',
    topic: 'csharp',
    subtopic: 'OOP',
    difficulty: 'Intermediate',
    xpReward: 60,
    title: 'Abstract Animal Hierarchy',
    description: 'Create an abstract `Animal` class with a `Name` property and abstract `Speak()` method. Implement `Dog` and `Cat` subclasses. Add a `Zoo` class that holds a list of animals and calls `Speak()` on each.',
    objective: 'Understand abstract classes, inheritance, and polymorphism.',
    hints: [
      'Use `abstract class Animal` with `public abstract string Speak()`.',
      'Each subclass must `override` the Speak method.',
      'The Zoo class accepts `List<Animal>` — any Animal subtype works (polymorphism).',
    ],
    starterCode: '// Define abstract Animal\n// Define Dog : Animal\n// Define Cat : Animal\n// Define Zoo with MakeNoise()\n\nvar zoo = new Zoo(new List<Animal> { new Dog("Rex"), new Cat("Whiskers") });\nzoo.MakeNoise();',
    solution: 'abstract class Animal\n{\n    public string Name { get; init; }\n    protected Animal(string name) => Name = name;\n    public abstract string Speak();\n}\n\nclass Dog : Animal\n{\n    public Dog(string name) : base(name) { }\n    public override string Speak() => "Woof!";\n}\n\nclass Cat : Animal\n{\n    public Cat(string name) : base(name) { }\n    public override string Speak() => "Meow!";\n}\n\nclass Zoo\n{\n    private readonly List<Animal> _animals;\n    public Zoo(List<Animal> animals) => _animals = animals;\n\n    public void MakeNoise()\n    {\n        foreach (var animal in _animals)\n            Console.WriteLine($"{animal.Name} says: {animal.Speak()}");\n    }\n}\n\nvar zoo = new Zoo(new List<Animal> { new Dog("Rex"), new Cat("Whiskers") });\nzoo.MakeNoise();',
    explanation: 'Polymorphism lets Zoo.MakeNoise() call the correct Speak() at runtime without knowing the concrete type. This is the "open/closed principle" — Zoo is open to new animal types without modification.',
    commonMistakes: [
      'Making Animal a regular class instead of abstract — allows instantiating Animal directly, which should not be possible.',
      'Forgetting the base constructor call `: base(name)` in subclasses.',
      'Using `new` instead of `override` — hides the method instead of overriding it.',
    ],
    expectedOutput: 'Rex says: Woof!\nWhiskers says: Meow!',
    tags: ['oop', 'inheritance', 'abstract', 'polymorphism'],
  },

  {
    id: 'ex-cs-05',
    topic: 'csharp',
    subtopic: 'Async/Await',
    difficulty: 'Intermediate',
    xpReward: 60,
    title: 'Async HTTP Fetch',
    description: 'Write an async method `FetchUserAsync(int id)` that calls `https://jsonplaceholder.typicode.com/users/{id}` using HttpClient, deserializes the JSON into a `User` record, and returns it.',
    objective: 'Practice async/await, HttpClient, and System.Text.Json deserialization.',
    hints: [
      'Inject or create a single `HttpClient` instance — do not create one per request.',
      'Use `await client.GetFromJsonAsync<User>(url)` to combine fetch + deserialize.',
      'Mark the method `async Task<User?>` to allow `await` inside it.',
    ],
    starterCode: 'using System.Net.Http;\nusing System.Net.Http.Json;\n\nstatic async Task<User?> FetchUserAsync(int id)\n{\n    // Your code here\n}\n\nrecord User(int Id, string Name, string Email);',
    solution: 'using System.Net.Http;\nusing System.Net.Http.Json;\n\nvar client = new HttpClient();\n\nstatic async Task<User?> FetchUserAsync(int id)\n{\n    var url = $"https://jsonplaceholder.typicode.com/users/{id}";\n    return await client.GetFromJsonAsync<User>(url);\n}\n\nvar user = await FetchUserAsync(1);\nConsole.WriteLine($"Fetched: {user?.Name} ({user?.Email})");\n\nrecord User(int Id, string Name, string Email);',
    explanation: 'GetFromJsonAsync<T>() combines GetAsync + ReadFromJsonAsync into one call. The method returns Task<User?> — nullable because the server could return 404. Always await async methods to propagate exceptions properly.',
    commonMistakes: [
      'Using .Result or .Wait() instead of await — causes deadlocks in UI/ASP.NET contexts.',
      'Creating a new HttpClient() for every request — exhausts socket connections.',
      'Ignoring the nullable return and not checking for null.',
    ],
    expectedOutput: 'Fetched: Leanne Graham (Sincere@april.biz)',
    tags: ['async', 'await', 'httpclient', 'json'],
  },

  {
    id: 'ex-cs-06',
    topic: 'csharp',
    subtopic: 'Pattern Matching',
    difficulty: 'Intermediate',
    xpReward: 50,
    title: 'Discount Calculator with Pattern Matching',
    description: 'Write a method `GetDiscount(object customer)` that returns a discount percentage. Use a switch expression with patterns: `PremiumCustomer` gets 20%, `RegularCustomer` with orders > 10 gets 10%, all others 0%.',
    objective: 'Practice switch expressions, property patterns, and type patterns.',
    hints: [
      'Use `customer switch { PremiumCustomer => 20, ... }` syntax.',
      'Property patterns: `RegularCustomer { OrderCount: > 10 } => 10`.',
      'The `_` wildcard is the default/fallback case.',
    ],
    starterCode: 'record PremiumCustomer(string Name);\nrecord RegularCustomer(string Name, int OrderCount);\nrecord GuestCustomer();\n\nstatic int GetDiscount(object customer)\n{\n    // Use switch expression with patterns\n}',
    solution: 'record PremiumCustomer(string Name);\nrecord RegularCustomer(string Name, int OrderCount);\nrecord GuestCustomer();\n\nstatic int GetDiscount(object customer) => customer switch\n{\n    PremiumCustomer                          => 20,\n    RegularCustomer { OrderCount: > 10 }     => 10,\n    RegularCustomer                          => 5,\n    GuestCustomer                            => 0,\n    _                                        => 0,\n};\n\nConsole.WriteLine(GetDiscount(new PremiumCustomer("Alice")));       // 20\nConsole.WriteLine(GetDiscount(new RegularCustomer("Bob", 15)));     // 10\nConsole.WriteLine(GetDiscount(new RegularCustomer("Carol", 3)));    // 5',
    explanation: 'Switch expressions evaluate top-to-bottom and return the first matching arm. Property patterns `{ OrderCount: > 10 }` match on the property value. This replaces long if-else chains with readable, exhaustive matching.',
    commonMistakes: [
      'Putting the general `RegularCustomer` arm before `RegularCustomer { OrderCount: > 10 }` — the more specific pattern must come first.',
      'Forgetting the `_` wildcard, causing a non-exhaustive switch warning.',
    ],
    expectedOutput: '20\n10\n5',
    tags: ['pattern-matching', 'switch-expression', 'records'],
  },

  // ─── JavaScript ────────────────────────────────────────────────

  {
    id: 'ex-js-01',
    topic: 'javascript',
    subtopic: 'Array Methods',
    difficulty: 'Beginner',
    xpReward: 30,
    title: 'Pipeline with map, filter, reduce',
    description: 'Given an array of product objects with `name` and `price`, use array methods to:\n1. Filter products under $50\n2. Double their prices (simulate a sale ending)\n3. Return the total cost',
    objective: 'Chain map(), filter(), and reduce() without loops.',
    hints: [
      'filter() returns a new array. Chain .map() after it.',
      'map() transforms each item. Return the modified object.',
      'reduce((total, p) => total + p.price, 0) sums prices.',
    ],
    starterCode: 'const products = [\n  { name: "Book", price: 12 },\n  { name: "Laptop", price: 800 },\n  { name: "Pen", price: 3 },\n  { name: "Monitor", price: 250 },\n  { name: "Notebook", price: 8 },\n];\n\n// 1. Filter under $50\n// 2. Double the prices\n// 3. Sum to total\nconst total = // your code here\nconsole.log(total);',
    solution: 'const products = [\n  { name: "Book", price: 12 },\n  { name: "Laptop", price: 800 },\n  { name: "Pen", price: 3 },\n  { name: "Monitor", price: 250 },\n  { name: "Notebook", price: 8 },\n];\n\nconst total = products\n  .filter(p => p.price < 50)\n  .map(p => ({ ...p, price: p.price * 2 }))\n  .reduce((sum, p) => sum + p.price, 0);\n\nconsole.log(total); // 46',
    explanation: 'Chaining array methods creates a readable data pipeline. Each step returns a new array (immutably). filter gets [Book,Pen,Notebook] => map doubles prices => reduce sums 24+6+16 = 46.',
    commonMistakes: [
      'Mutating the original product objects in map — use spread `{ ...p, price: ... }`.',
      'Forgetting the initial value `0` in reduce — causes issues when the array is empty.',
      'Using forEach instead of map/filter — forEach returns undefined, you cannot chain it.',
    ],
    expectedOutput: '46',
    tags: ['arrays', 'map', 'filter', 'reduce', 'functional'],
  },

  {
    id: 'ex-js-02',
    topic: 'javascript',
    subtopic: 'Closures',
    difficulty: 'Intermediate',
    xpReward: 50,
    title: 'Counter Factory with Closure',
    description: 'Write a `makeCounter(start = 0)` function that returns an object with three methods: `increment()`, `decrement()`, and `reset()`. Each call to makeCounter creates an independent counter.',
    objective: 'Understand closures — inner functions retain access to outer scope.',
    hints: [
      'Declare `let count = start` inside makeCounter.',
      'Return an object whose methods reference `count` through closure.',
      'Two separate makeCounter() calls have separate `count` variables.',
    ],
    starterCode: 'function makeCounter(start = 0) {\n  // Your code here\n}\n\nconst c1 = makeCounter(10);\nconst c2 = makeCounter();\nc1.increment();\nc1.increment();\nc2.increment();\nconsole.log(c1.value()); // 12\nconsole.log(c2.value()); // 1',
    solution: 'function makeCounter(start = 0) {\n  let count = start;\n  return {\n    increment() { count += 1; },\n    decrement() { count -= 1; },\n    reset()     { count = start; },\n    value()     { return count; },\n  };\n}\n\nconst c1 = makeCounter(10);\nconst c2 = makeCounter();\nc1.increment();\nc1.increment();\nc2.increment();\nconsole.log(c1.value()); // 12\nconsole.log(c2.value()); // 1',
    explanation: 'Each call to makeCounter creates a new execution context with its own `count` variable. The returned methods close over that specific `count`, keeping it private. This is the module pattern — encapsulated state without a class.',
    commonMistakes: [
      'Returning count directly in the object — this copies the value at the time of creation, not a live reference.',
      'Using a global variable — all counters would share state.',
    ],
    expectedOutput: '12\n1',
    tags: ['closures', 'scope', 'factory-function'],
  },

  {
    id: 'ex-js-03',
    topic: 'javascript',
    subtopic: 'Async/Await',
    difficulty: 'Intermediate',
    xpReward: 50,
    title: 'Sequential vs Parallel Fetches',
    description: 'Fetch user details for IDs [1, 2, 3] from jsonplaceholder. First implement sequentially (one after the other), then parallel. Log the time difference.',
    objective: 'Understand the performance difference between sequential await and Promise.all.',
    hints: [
      'Sequential: use a for loop with await inside.',
      'Parallel: create all promises first with .map(), then await Promise.all([...]).',
      'Use Date.now() or console.time() to measure duration.',
    ],
    starterCode: 'const fetchUser = (id) =>\n  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n    .then(r => r.json());\n\nasync function sequential() {\n  // fetch one at a time\n}\n\nasync function parallel() {\n  // fetch all at once\n}',
    solution: 'const fetchUser = (id) =>\n  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n    .then(r => r.json());\n\nasync function sequential() {\n  console.time("sequential");\n  const results = [];\n  for (const id of [1, 2, 3]) {\n    results.push(await fetchUser(id));\n  }\n  console.timeEnd("sequential");\n  return results;\n}\n\nasync function parallel() {\n  console.time("parallel");\n  const results = await Promise.all([1, 2, 3].map(fetchUser));\n  console.timeEnd("parallel");\n  return results;\n}\n\nsequential();\nparallel();',
    explanation: 'Sequential awaits one request before starting the next: 3 requests x ~200ms = ~600ms. Parallel starts all three simultaneously with Promise.all: they run concurrently and finish in ~200ms total. Use parallel when requests are independent.',
    commonMistakes: [
      'await inside .map() does not pause the map — it returns an array of Promises, not resolved values.',
      'Using Promise.all when requests depend on each other (second needs first\'s result) — use sequential instead.',
      'Not handling Promise.all rejection — if one fails, all fail. Use Promise.allSettled for independent failures.',
    ],
    expectedOutput: 'sequential: ~600ms\nparallel: ~200ms',
    tags: ['async', 'promises', 'performance', 'fetch'],
  },

  {
    id: 'ex-js-04',
    topic: 'javascript',
    subtopic: 'Utility Functions',
    difficulty: 'Intermediate',
    xpReward: 50,
    title: 'Debounce Implementation',
    description: 'Implement a `debounce(fn, delay)` function. It returns a new function that waits `delay` ms after the last call before invoking `fn`. Used for search inputs, resize handlers, etc.',
    objective: 'Understand closures, timers, and higher-order functions.',
    hints: [
      'Store a timer variable in the outer closure.',
      'In the returned function, call clearTimeout first, then setTimeout.',
      'The returned function should forward all arguments to fn using ...args.',
    ],
    starterCode: 'function debounce(fn, delay) {\n  // Your code here\n}\n\n// Test\nconst search = debounce((query) => console.log("Searching:", query), 300);\nsearch("h");\nsearch("he");\nsearch("hel");\nsearch("hell");\nsearch("hello");  // Only this should fire after 300ms',
    solution: 'function debounce(fn, delay) {\n  let timerId;\n  return function(...args) {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst search = debounce((query) => console.log("Searching:", query), 300);\nsearch("h");\nsearch("he");\nsearch("hel");\nsearch("hell");\nsearch("hello");  // Only this fires: "Searching: hello"',
    explanation: 'Each call resets the timer. Only when no new call arrives within the delay does the timer fire. `clearTimeout` cancels any pending call. `fn.apply(this, args)` preserves the correct `this` context and passes through arguments.',
    commonMistakes: [
      'Not calling clearTimeout — the function fires on every call instead of waiting.',
      'Using `fn(args)` instead of `fn.apply(this, args)` — loses `this` binding and arguments.',
      'Declaring timerId inside the returned function — creates a new timer each call instead of sharing one.',
    ],
    expectedOutput: 'Searching: hello  (only once, after 300ms)',
    tags: ['closures', 'timers', 'higher-order', 'performance'],
  },

  // ─── React ─────────────────────────────────────────────────────

  {
    id: 'ex-react-01',
    topic: 'react',
    subtopic: 'Hooks',
    difficulty: 'Beginner',
    xpReward: 40,
    title: 'Controlled Counter Component',
    description: 'Build a Counter component with increment, decrement, and reset buttons. The count cannot go below 0. Display "Max reached!" when count hits 10.',
    objective: 'Practice useState, conditional rendering, and event handlers.',
    hints: [
      'Use useState(0) to track count.',
      'Disable the decrement button when count === 0.',
      'Use a ternary or &&  to conditionally show the "Max reached!" message.',
    ],
    starterCode: 'import { useState } from "react";\n\nexport default function Counter() {\n  // Your code here\n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}',
    solution: 'import { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="flex flex-col items-center gap-4 p-8">\n      <h2 className="text-2xl font-bold">{count}</h2>\n      {count >= 10 && (\n        <p className="text-amber-400 text-sm">Max reached!</p>\n      )}\n      <div className="flex gap-2">\n        <button\n          onClick={() => setCount(c => Math.max(0, c - 1))}\n          disabled={count === 0}\n          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"\n        >\n          -\n        </button>\n        <button\n          onClick={() => setCount(0)}\n          className="px-4 py-2 bg-slate-600 rounded"\n        >\n          Reset\n        </button>\n        <button\n          onClick={() => setCount(c => Math.min(10, c + 1))}\n          disabled={count >= 10}\n          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-40"\n        >\n          +\n        </button>\n      </div>\n    </div>\n  );\n}',
    explanation: 'Using the functional updater `setCount(c => c + 1)` is safer than `setCount(count + 1)` because React batches state updates — the functional form always reads the latest value. Math.min/max enforces the bounds without extra if-statements.',
    commonMistakes: [
      'Using setCount(count + 1) instead of setCount(c => c + 1) — stale closure bug in fast clicks.',
      'Not disabling the button — letting count go negative.',
      'Checking count >= 10 without clamping — pressing + at count=10 would set it to 11.',
    ],
    expectedOutput: 'Interactive counter clamped 0–10 with conditional message.',
    tags: ['useState', 'events', 'conditional-rendering'],
  },

  {
    id: 'ex-react-02',
    topic: 'react',
    subtopic: 'Hooks',
    difficulty: 'Intermediate',
    xpReward: 60,
    title: 'Data Fetching with Loading and Error States',
    description: 'Build a UserCard component that fetches a user from the JSONPlaceholder API by ID. Show a loading spinner while fetching, an error message on failure, and the user data when done.',
    objective: 'Practice useEffect, loading/error state management, and cleanup.',
    hints: [
      'Keep three state variables: data, loading, error.',
      'Set loading=true before the fetch, false in finally.',
      'Return a cleanup function from useEffect to handle unmounting mid-fetch.',
    ],
    starterCode: 'import { useState, useEffect } from "react";\n\nexport default function UserCard({ userId }) {\n  // Add state for data, loading, error\n  // Add useEffect to fetch\n  // Render loading/error/data states\n}',
    solution: 'import { useState, useEffect } from "react";\n\nexport default function UserCard({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let cancelled = false;\n    setLoading(true);\n    setError(null);\n\n    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)\n      .then(r => {\n        if (!r.ok) throw new Error("User not found");\n        return r.json();\n      })\n      .then(data => { if (!cancelled) setUser(data); })\n      .catch(err => { if (!cancelled) setError(err.message); })\n      .finally(() => { if (!cancelled) setLoading(false); });\n\n    return () => { cancelled = true; };\n  }, [userId]);\n\n  if (loading) return <p>Loading...</p>;\n  if (error)   return <p className="text-red-400">Error: {error}</p>;\n  return (\n    <div className="card">\n      <h2 className="text-white font-bold">{user.name}</h2>\n      <p className="text-slate-400">{user.email}</p>\n      <p className="text-slate-400">{user.phone}</p>\n    </div>\n  );\n}',
    explanation: 'The `cancelled` flag prevents state updates after the component unmounts (race condition fix). The cleanup function returned from useEffect sets cancelled=true. Re-running the effect when userId changes re-fetches correctly.',
    commonMistakes: [
      'No cleanup — causes "Cannot update state on unmounted component" warnings.',
      'Not resetting loading/error before a new fetch — old state bleeds into the new request.',
      'Checking `r.ok` is essential — fetch only rejects on network errors, not HTTP errors like 404.',
    ],
    expectedOutput: 'Loading spinner -> User card with name/email/phone',
    tags: ['useEffect', 'fetch', 'loading-states', 'cleanup'],
  },

  {
    id: 'ex-react-03',
    topic: 'react',
    subtopic: 'Custom Hooks',
    difficulty: 'Intermediate',
    xpReward: 70,
    title: 'useLocalStorage Custom Hook',
    description: 'Build a `useLocalStorage(key, defaultValue)` custom hook that syncs state to localStorage. It should read the initial value from localStorage, update it on every state change, and handle JSON parse errors gracefully.',
    objective: 'Learn to build custom hooks that abstract browser APIs.',
    hints: [
      'Initialize with a lazy initializer function: useState(() => { ... }).',
      'Use useEffect to sync to localStorage whenever the value changes.',
      'Wrap the localStorage.getItem call in try/catch for corrupted data.',
    ],
    starterCode: 'import { useState, useEffect } from "react";\n\nexport function useLocalStorage(key, defaultValue) {\n  // Your hook implementation\n}\n\n// Usage:\n// const [name, setName] = useLocalStorage("username", "");\n// Works exactly like useState but persists!',
    solution: 'import { useState, useEffect } from "react";\n\nexport function useLocalStorage(key, defaultValue) {\n  const [value, setValue] = useState(() => {\n    try {\n      const stored = localStorage.getItem(key);\n      return stored !== null ? JSON.parse(stored) : defaultValue;\n    } catch {\n      return defaultValue;\n    }\n  });\n\n  useEffect(() => {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n    } catch {\n      // Storage quota exceeded or unavailable\n    }\n  }, [key, value]);\n\n  return [value, setValue];\n}',
    explanation: 'The lazy initializer (function passed to useState) runs only once on mount — efficient. useEffect writes to storage whenever value changes. The try/catch handles JSON.parse errors from corrupted storage and quota exceeded errors on write.',
    commonMistakes: [
      'Reading from localStorage on every render instead of just once — use the lazy initializer.',
      'Not JSON.parse/stringify — localStorage only stores strings.',
      'Missing key in useEffect dependency array — stale key bug when key prop changes.',
    ],
    expectedOutput: 'State persists across page refreshes.',
    tags: ['custom-hooks', 'localStorage', 'useState', 'useEffect'],
  },

  // ─── SQL ───────────────────────────────────────────────────────

  {
    id: 'ex-sql-01',
    topic: 'sql',
    subtopic: 'Joins',
    difficulty: 'Beginner',
    xpReward: 40,
    title: 'Inner Join Orders and Customers',
    description: 'Given tables `customers(id, name, email)` and `orders(id, customer_id, total, created_at)`, write a query to show each customer\'s name alongside their order totals, sorted by most recent order.',
    objective: 'Practice INNER JOIN, column aliasing, and ORDER BY.',
    hints: [
      'JOIN on customers.id = orders.customer_id.',
      'SELECT the columns you need, alias with AS for clarity.',
      'ORDER BY orders.created_at DESC for most recent first.',
    ],
    starterCode: '-- Write your query here\nSELECT\n  -- columns\nFROM customers\n  -- join\nWHERE -- optional filter\nORDER BY -- sort',
    solution: 'SELECT\n  c.name       AS customer_name,\n  c.email,\n  o.id         AS order_id,\n  o.total,\n  o.created_at AS ordered_at\nFROM customers c\nINNER JOIN orders o ON o.customer_id = c.id\nORDER BY o.created_at DESC;',
    explanation: 'INNER JOIN only returns rows where the join condition matches in BOTH tables. Customers with no orders are excluded. Use LEFT JOIN if you want all customers including those with zero orders (you\'ll get NULLs in the order columns).',
    commonMistakes: [
      'Forgetting the ON clause — causes a cartesian product (every customer x every order).',
      'Using SELECT * — returns duplicate id columns, confusing downstream code.',
      'Confusing INNER JOIN (intersection) with LEFT JOIN (all from left table).',
    ],
    expectedOutput: 'customer_name | email | order_id | total | ordered_at\n...',
    tags: ['joins', 'inner-join', 'select', 'order-by'],
  },

  {
    id: 'ex-sql-02',
    topic: 'sql',
    subtopic: 'Aggregation',
    difficulty: 'Intermediate',
    xpReward: 50,
    title: 'Revenue by Category with HAVING',
    description: 'Given `products(id, name, category, price)` and `order_items(id, order_id, product_id, quantity)`, find categories with total revenue over $1000. Show category, total revenue, and item count.',
    objective: 'Practice GROUP BY, aggregate functions, HAVING, and multi-table joins.',
    hints: [
      'JOIN order_items to products on product_id.',
      'GROUP BY products.category to aggregate per category.',
      'Revenue = SUM(price * quantity). HAVING filters groups after aggregation.',
    ],
    starterCode: 'SELECT\n  -- category, total_revenue, item_count\nFROM order_items oi\n  -- join products\nGROUP BY -- ...\nHAVING -- revenue > 1000\nORDER BY total_revenue DESC;',
    solution: 'SELECT\n  p.category,\n  SUM(p.price * oi.quantity)  AS total_revenue,\n  SUM(oi.quantity)            AS items_sold\nFROM order_items oi\nINNER JOIN products p ON p.id = oi.product_id\nGROUP BY p.category\nHAVING SUM(p.price * oi.quantity) > 1000\nORDER BY total_revenue DESC;',
    explanation: 'WHERE filters rows before grouping. HAVING filters groups after aggregation — it can reference aggregate functions. You cannot use the alias "total_revenue" in HAVING because aliases are resolved after HAVING in most databases.',
    commonMistakes: [
      'Using WHERE instead of HAVING to filter on aggregates — WHERE runs before GROUP BY so aggregates are not computed yet.',
      'Referencing the alias in HAVING — use the full expression or a subquery.',
      'Forgetting that GROUP BY must include all non-aggregated SELECT columns.',
    ],
    expectedOutput: 'category | total_revenue | items_sold\nElectronics | 4250.00 | 17\n...',
    tags: ['group-by', 'having', 'aggregates', 'joins'],
  },

  {
    id: 'ex-sql-03',
    topic: 'sql',
    subtopic: 'Window Functions',
    difficulty: 'Advanced',
    xpReward: 80,
    title: 'Rank Customers by Spending',
    description: 'Using the same customers/orders tables, rank customers by their total spending within each signup year. Show customer name, signup year, total spent, and their rank within that year.',
    objective: 'Practice window functions: RANK() OVER (PARTITION BY ... ORDER BY ...).',
    hints: [
      'Aggregate orders per customer first (subquery or CTE).',
      'Extract year with EXTRACT(YEAR FROM customers.created_at).',
      'RANK() OVER (PARTITION BY signup_year ORDER BY total_spent DESC) adds the rank.',
    ],
    starterCode: '-- Use a CTE or subquery to aggregate first,\n-- then apply RANK() window function\nWITH customer_totals AS (\n  SELECT\n    -- ...\n  FROM customers c\n  JOIN orders o ON ...\n  GROUP BY c.id, c.name, c.created_at\n)\nSELECT\n  -- name, signup_year, total_spent, rank\nFROM customer_totals;',
    solution: 'WITH customer_totals AS (\n  SELECT\n    c.name,\n    EXTRACT(YEAR FROM c.created_at)  AS signup_year,\n    COALESCE(SUM(o.total), 0)        AS total_spent\n  FROM customers c\n  LEFT JOIN orders o ON o.customer_id = c.id\n  GROUP BY c.id, c.name, c.created_at\n)\nSELECT\n  name,\n  signup_year,\n  total_spent,\n  RANK() OVER (PARTITION BY signup_year ORDER BY total_spent DESC) AS rank_in_year\nFROM customer_totals\nORDER BY signup_year, rank_in_year;',
    explanation: 'PARTITION BY divides the data into groups (like GROUP BY for window functions). ORDER BY within OVER defines the ranking direction. RANK() leaves gaps for ties; DENSE_RANK() does not. CTEs make the two-step query readable.',
    commonMistakes: [
      'Using GROUP BY instead of PARTITION BY — window functions need OVER(), not GROUP BY.',
      'Missing LEFT JOIN — INNER JOIN excludes customers with no orders.',
      'Forgetting COALESCE for customers with zero orders — SUM of nothing is NULL.',
    ],
    expectedOutput: 'name | signup_year | total_spent | rank_in_year\nAlice | 2023 | 4200.00 | 1\nBob | 2023 | 1800.00 | 2\n...',
    tags: ['window-functions', 'rank', 'partition-by', 'cte'],
  },

  // ─── ASP.NET Core ──────────────────────────────────────────────

  {
    id: 'ex-aspnet-01',
    topic: 'aspnet',
    subtopic: 'Minimal APIs',
    difficulty: 'Beginner',
    xpReward: 50,
    title: 'Minimal API CRUD for Products',
    description: 'Create a minimal ASP.NET Core API with in-memory storage. Implement GET /products, GET /products/{id}, POST /products, and DELETE /products/{id}.',
    objective: 'Practice minimal API endpoint definition, route parameters, and DTOs.',
    hints: [
      'Use `var app = WebApplication.Create(args)` and `app.MapGet`, `app.MapPost`, `app.MapDelete`.',
      'Use `Results.Ok()`, `Results.NotFound()`, `Results.Created()` for typed responses.',
      'Store products in a `List<Product>` variable for in-memory persistence.',
    ],
    starterCode: 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\nvar products = new List<Product>();\n\n// Define endpoints here\n\napp.Run();\n\nrecord Product(int Id, string Name, decimal Price);\nrecord CreateProductRequest(string Name, decimal Price);',
    solution: 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\nvar products = new List<Product>();\nvar nextId = 1;\n\napp.MapGet("/products", () => Results.Ok(products));\n\napp.MapGet("/products/{id:int}", (int id) =>\n{\n    var product = products.FirstOrDefault(p => p.Id == id);\n    return product is null ? Results.NotFound() : Results.Ok(product);\n});\n\napp.MapPost("/products", (CreateProductRequest req) =>\n{\n    var product = new Product(nextId++, req.Name, req.Price);\n    products.Add(product);\n    return Results.Created($"/products/{product.Id}", product);\n});\n\napp.MapDelete("/products/{id:int}", (int id) =>\n{\n    var product = products.FirstOrDefault(p => p.Id == id);\n    if (product is null) return Results.NotFound();\n    products.Remove(product);\n    return Results.NoContent();\n});\n\napp.Run();\n\nrecord Product(int Id, string Name, decimal Price);\nrecord CreateProductRequest(string Name, decimal Price);',
    explanation: 'Minimal APIs are lighter than controllers — no class needed. Route constraints like `{id:int}` ensure ASP.NET only matches numeric IDs. Results.Created sets the Location header. Records provide concise immutable DTOs.',
    commonMistakes: [
      'Not using Results.Created for POST — the 201 status + Location header is REST convention.',
      'Returning 200 for DELETE — it should be 204 No Content.',
      'Making the products list a local variable inside an endpoint — it resets every request.',
    ],
    expectedOutput: 'GET /products => []\nPOST /products { "name": "Book", "price": 9.99 } => 201 Created\nGET /products/1 => { "id": 1, "name": "Book", "price": 9.99 }',
    tags: ['minimal-api', 'crud', 'rest', 'http-status'],
  },

  {
    id: 'ex-aspnet-02',
    topic: 'aspnet',
    subtopic: 'Validation',
    difficulty: 'Intermediate',
    xpReward: 60,
    title: 'Request Validation with Data Annotations',
    description: 'Add validation to a CreateProductRequest so that Name is required (max 100 chars), Price is between 0.01 and 9999.99, and Category is one of: Electronics, Books, Clothing. Return 400 with details on invalid input.',
    objective: 'Practice Data Annotations and validation in ASP.NET Core.',
    hints: [
      'Use `[Required]`, `[MaxLength]`, `[Range]` attributes on the DTO.',
      'Enable endpoint filter validation or check `ModelState.IsValid` in controllers.',
      'For minimal APIs, use `app.AddEndpointFilter<ValidationFilter>()` or manual validation.',
    ],
    starterCode: 'using System.ComponentModel.DataAnnotations;\n\nrecord CreateProductRequest(\n    // Add validation attributes\n    string Name,\n    decimal Price,\n    string Category\n);',
    solution: 'using System.ComponentModel.DataAnnotations;\n\nclass CreateProductRequest\n{\n    [Required, MaxLength(100)]\n    public string Name { get; init; } = "";\n\n    [Range(0.01, 9999.99)]\n    public decimal Price { get; init; }\n\n    [Required, RegularExpression("Electronics|Books|Clothing",\n        ErrorMessage = "Category must be Electronics, Books, or Clothing")]\n    public string Category { get; init; } = "";\n}\n\n// In minimal API, validate manually:\napp.MapPost("/products", (CreateProductRequest req) =>\n{\n    var context = new ValidationContext(req);\n    var results = new List<ValidationResult>();\n    if (!Validator.TryValidateObject(req, context, results, true))\n    {\n        return Results.ValidationProblem(\n            results.ToDictionary(r => r.MemberNames.First(), r => new[] { r.ErrorMessage ?? "" })\n        );\n    }\n    // proceed...\n    return Results.Ok();\n});',
    explanation: 'Data Annotations are declarative validation. In MVC controllers, ModelState.IsValid checks them automatically. In minimal APIs, you validate manually or use a filter. Results.ValidationProblem returns RFC 7807 problem details with a 400 status.',
    commonMistakes: [
      'Using records with constructor parameters — Data Annotations only work on properties, not constructor params.',
      'Forgetting to call validateAllProperties=true in TryValidateObject — required attributes are skipped otherwise.',
    ],
    expectedOutput: 'POST with missing name => 400 { "errors": { "Name": ["The Name field is required."] } }',
    tags: ['validation', 'data-annotations', 'minimal-api', 'rest'],
  },

  // ─── Algorithms ────────────────────────────────────────────────

  {
    id: 'ex-algo-01',
    topic: 'algorithms',
    subtopic: 'Two Pointers',
    difficulty: 'Intermediate',
    xpReward: 60,
    title: 'Two Sum (Sorted Array)',
    description: 'Given a sorted integer array and a target sum, find two indices whose values add up to the target. Return [left, right] (1-indexed). Solve in O(n) time without a hashmap.',
    objective: 'Learn the two-pointer technique on sorted data.',
    hints: [
      'Start with one pointer at each end of the array.',
      'If sum < target, move the left pointer right. If sum > target, move right pointer left.',
      'When sum === target, you found the answer.',
    ],
    starterCode: '// C# solution\nstatic int[] TwoSum(int[] numbers, int target)\n{\n    // Your two-pointer solution here\n    return Array.Empty<int>();\n}',
    solution: 'static int[] TwoSum(int[] numbers, int target)\n{\n    int left = 0, right = numbers.Length - 1;\n    while (left < right)\n    {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return [left + 1, right + 1];  // 1-indexed\n        if (sum < target)  left++;\n        else               right--;\n    }\n    return Array.Empty<int>();  // no solution found\n}\n\n// TwoSum([2,7,11,15], 9) => [1, 2]  (2+7=9)',
    explanation: 'Because the array is sorted, we can use two pointers. Too small? The left pointer\'s value must increase — move left right. Too big? The right pointer\'s value must decrease — move right left. This is O(n) time, O(1) space vs O(n) for a hashmap approach.',
    commonMistakes: [
      'Using nested loops — O(n²), works but misses the O(n) optimization.',
      'Forgetting the sorted precondition — this approach fails on unsorted arrays.',
      'Off-by-one on 1-indexed output.',
    ],
    expectedOutput: 'TwoSum([2,7,11,15], 9) => [1, 2]\nTwoSum([2,3,4], 6) => [1, 3]',
    tags: ['two-pointers', 'arrays', 'searching'],
  },

  {
    id: 'ex-algo-02',
    topic: 'algorithms',
    subtopic: 'Recursion',
    difficulty: 'Intermediate',
    xpReward: 60,
    title: 'Binary Search',
    description: 'Implement binary search on a sorted integer array. Return the index of the target or -1 if not found. Implement both iterative and recursive versions.',
    objective: 'Understand divide-and-conquer, loop invariants, and recursion.',
    hints: [
      'Compute mid = left + (right - left) / 2 (not (left+right)/2 to avoid overflow).',
      'If target < arr[mid], search the left half. If target > arr[mid], search the right half.',
      'Recursive version: pass lo and hi bounds as parameters.',
    ],
    starterCode: '// Iterative\nstatic int BinarySearch(int[] arr, int target)\n{\n    // Your code\n    return -1;\n}\n\n// Recursive\nstatic int BinarySearchRec(int[] arr, int target, int lo, int hi)\n{\n    // Your code\n    return -1;\n}',
    solution: '// Iterative\nstatic int BinarySearch(int[] arr, int target)\n{\n    int lo = 0, hi = arr.Length - 1;\n    while (lo <= hi)\n    {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target)  lo = mid + 1;\n        else                    hi = mid - 1;\n    }\n    return -1;\n}\n\n// Recursive\nstatic int BinarySearchRec(int[] arr, int target, int lo, int hi)\n{\n    if (lo > hi) return -1;\n    int mid = lo + (hi - lo) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target)  return BinarySearchRec(arr, target, mid + 1, hi);\n    return BinarySearchRec(arr, target, lo, mid - 1);\n}',
    explanation: 'Binary search halves the search space each iteration: O(log n). The mid = lo + (hi - lo) / 2 formula avoids integer overflow that (lo + hi) / 2 can cause. Loop invariant: target is always within [lo, hi] if it exists.',
    commonMistakes: [
      'Using lo < hi instead of lo <= hi — misses the case where lo == hi and that element is the target.',
      'Not updating lo to mid+1 or hi to mid-1 — infinite loop when arr[mid] != target.',
      'Forgetting that binary search requires a sorted array.',
    ],
    expectedOutput: 'BinarySearch([1,3,5,7,9,11], 7) => 3\nBinarySearch([1,3,5,7,9,11], 6) => -1',
    tags: ['binary-search', 'divide-and-conquer', 'recursion'],
  },

  // ─── Refactoring ───────────────────────────────────────────────

  {
    id: 'ex-refactor-01',
    topic: 'refactor',
    subtopic: 'Clean Code',
    difficulty: 'Intermediate',
    xpReward: 70,
    title: 'Extract Method and Rename',
    description: 'Refactor this method that does too many things: validates input, calculates tax, formats an invoice string, and logs the result — all in one 40-line function. Apply Single Responsibility.',
    objective: 'Practice extract method refactoring and meaningful naming.',
    hints: [
      'Identify sections that have a single purpose and give them a name.',
      'A method that needs a comment to explain what a block does is a candidate for extraction.',
      'The caller should read like a story: Validate, Calculate, Format, Log.',
    ],
    starterCode: '// Before - hard to read, test, and maintain\nstatic string ProcessOrder(string customerName, decimal subtotal, string country)\n{\n    if (string.IsNullOrWhiteSpace(customerName)) throw new ArgumentException("Name required");\n    if (subtotal <= 0) throw new ArgumentException("Subtotal must be positive");\n    if (string.IsNullOrWhiteSpace(country)) throw new ArgumentException("Country required");\n\n    decimal taxRate = country == "US" ? 0.08m :\n                      country == "UK" ? 0.20m :\n                      country == "DE" ? 0.19m : 0.15m;\n    decimal tax = subtotal * taxRate;\n    decimal total = subtotal + tax;\n\n    string invoice = $"Invoice for {customerName}\\nSubtotal: {subtotal:C}\\nTax: {tax:C}\\nTotal: {total:C}";\n\n    Console.WriteLine($"[ORDER] {customerName}: {total:C}");\n    return invoice;\n}',
    solution: '// After - each method has one job\nstatic string ProcessOrder(string customerName, decimal subtotal, string country)\n{\n    ValidateOrderInputs(customerName, subtotal, country);\n    decimal total = CalculateTotal(subtotal, country);\n    string invoice = FormatInvoice(customerName, subtotal, total - subtotal, total);\n    LogOrder(customerName, total);\n    return invoice;\n}\n\nstatic void ValidateOrderInputs(string name, decimal subtotal, string country)\n{\n    if (string.IsNullOrWhiteSpace(name))    throw new ArgumentException("Name required");\n    if (subtotal <= 0)                       throw new ArgumentException("Subtotal must be positive");\n    if (string.IsNullOrWhiteSpace(country)) throw new ArgumentException("Country required");\n}\n\nstatic decimal GetTaxRate(string country) => country switch\n{\n    "US" => 0.08m, "UK" => 0.20m, "DE" => 0.19m, _ => 0.15m,\n};\n\nstatic decimal CalculateTotal(decimal subtotal, string country) =>\n    subtotal + subtotal * GetTaxRate(country);\n\nstatic string FormatInvoice(string name, decimal subtotal, decimal tax, decimal total) =>\n    $"Invoice for {name}\\nSubtotal: {subtotal:C}\\nTax: {tax:C}\\nTotal: {total:C}";\n\nstatic void LogOrder(string name, decimal total) =>\n    Console.WriteLine($"[ORDER] {name}: {total:C}");',
    explanation: 'Each extracted method is independently testable. ProcessOrder now reads as a sequence of named operations. GetTaxRate can be tested with all country codes without invoking the whole order flow. This is the Extract Method refactoring from Fowler\'s "Refactoring".',
    commonMistakes: [
      'Extracting too small — a one-liner that is already readable does not need a method.',
      'Not renaming — the method name must describe WHAT it does, not HOW.',
      'Passing too many parameters — a sign the method needs further decomposition or a parameter object.',
    ],
    expectedOutput: 'Functionally identical — same output, better structure.',
    tags: ['refactoring', 'extract-method', 'single-responsibility', 'clean-code'],
  },

];

export function getExercisesByTopic(topicId) {
  return EXERCISES.filter(e => e.topic === topicId);
}

export function getExercisesByDifficulty(difficulty) {
  return EXERCISES.filter(e => e.difficulty === difficulty);
}

export function getExerciseById(id) {
  return EXERCISES.find(e => e.id === id) ?? null;
}

export function getExercisesForTrack(trackId) {
  const map = {
    csharp:    ['csharp', 'algorithms'],
    react:     ['react', 'javascript'],
    nextjs:    ['react', 'javascript'],
    apis:      ['aspnet', 'algorithms'],
    oop:       ['csharp', 'refactor'],
    refactor:  ['refactor', 'csharp'],
  };
  const topics = map[trackId] ?? [];
  return EXERCISES.filter(e => topics.includes(e.topic));
}
