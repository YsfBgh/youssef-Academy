// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Course Data
//  6 Tracks: C#/.NET · React · Next.js · REST APIs · OOP · Refactoring
// ═══════════════════════════════════════════════════════════

export const TRACKS = [
  {
    id: 'csharp',
    title: 'C# & .NET',
    subtitle: 'Master the Microsoft stack from fundamentals to advanced',
    icon: '⚙️',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300',
    lessons: [
      {
        id: 'cs-01',
        title: 'C# Syntax & Type System',
        duration: '20 min',
        difficulty: 'Beginner',
        theory: `## C# Syntax & Type System

C# is a statically typed, object-oriented language that runs on the .NET runtime (CLR). Understanding the type system is the foundation of everything you'll do at Jadev.

### Value Types vs Reference Types

**Value types** are stored on the stack and hold their data directly:
- \`int\`, \`double\`, \`bool\`, \`char\`, \`struct\`, \`enum\`

**Reference types** are stored on the heap and hold a reference to the data:
- \`class\`, \`string\`, \`array\`, \`interface\`, \`delegate\`

### Nullable Types

Since C# 8, reference types are non-nullable by default. Use \`?\` to allow null:

\`\`\`csharp
string name = "Youssef";       // non-nullable
string? nickname = null;       // nullable reference type
int age = 25;                  // value type
int? score = null;             // nullable value type (Nullable<int>)
\`\`\`

### var and Type Inference

\`\`\`csharp
var message = "Hello";     // compiler infers string
var count = 42;            // compiler infers int
var pi = 3.14;             // compiler infers double
\`\`\`

### String Interpolation & Verbatim Strings

\`\`\`csharp
string name = "Youssef";
int age = 25;

// Interpolation
string greeting = $"Hello {name}, you are {age} years old!";

// Multi-line verbatim
string path = @"C:\\Users\\Youssef\\Documents";

// Raw string literals (C# 11)
string json = """
{
  "name": "Youssef",
  "age": 25
}
""";
\`\`\`

### Pattern Matching (C# 8+)

\`\`\`csharp
object obj = 42;

// is pattern
if (obj is int number) {
    Console.WriteLine($"It's an int: {number}");
}

// switch expression
string result = obj switch {
    int n when n > 0  => "positive",
    int n when n < 0  => "negative",
    int                => "zero",
    string s          => $"string: {s}",
    _                 => "unknown"
};
\`\`\``,
        codeExample: `// Type system in action
using System;

class TypeSystemDemo
{
    static void Main()
    {
        // Value types
        int a = 10;
        int b = a;       // copy — changing b won't affect a
        b = 20;
        Console.WriteLine($"a={a}, b={b}");  // a=10, b=20

        // Reference types
        int[] arr1 = { 1, 2, 3 };
        int[] arr2 = arr1;   // same reference!
        arr2[0] = 99;
        Console.WriteLine(arr1[0]);   // 99 — both point to same array

        // Nullable
        string? name = null;
        string display = name ?? "Anonymous";   // null-coalescing
        Console.WriteLine(display);   // "Anonymous"

        // Pattern matching
        object val = "Hello";
        if (val is string s && s.Length > 3)
            Console.WriteLine($"Long string: {s}");
    }
}`,
        keyPoints: [
          'Value types live on the stack, reference types on the heap',
          'Use ? for nullable types — avoids NullReferenceException',
          'var is statically typed — compiler infers the type at compile time',
          'Pattern matching with is and switch expressions is idiomatic modern C#',
          'String interpolation $"" is preferred over string.Format()',
        ]
      },
      {
        id: 'cs-02',
        title: 'OOP in C#: Classes, Inheritance, Interfaces',
        duration: '30 min',
        difficulty: 'Intermediate',
        theory: `## OOP in C#

### Classes & Constructors

\`\`\`csharp
public class Employee
{
    // Auto-implemented properties
    public int Id { get; init; }        // init = set once
    public string Name { get; set; }
    public decimal Salary { get; private set; }

    // Constructor
    public Employee(int id, string name, decimal salary)
    {
        Id = id;
        Name = name;
        Salary = salary;
    }

    // Method
    public void GiveRaise(decimal percent) =>
        Salary *= (1 + percent / 100);

    // Override ToString
    public override string ToString() =>
        $"Employee[{Id}] {Name} — \${Salary:F2}";
}
\`\`\`

### Inheritance & Polymorphism

\`\`\`csharp
public class Developer : Employee
{
    public string[] TechStack { get; set; }

    public Developer(int id, string name, decimal salary, string[] stack)
        : base(id, name, salary)          // call base constructor
    {
        TechStack = stack;
    }

    // Override virtual method
    public override string ToString() =>
        $"{base.ToString()} | Stack: {string.Join(", ", TechStack)}";
}
\`\`\`

### Interfaces — Contracts

\`\`\`csharp
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

// Default interface methods (C# 8+)
public interface ILogger
{
    void Log(string message);
    void LogWarning(string message) => Log($"[WARN] {message}");
    void LogError(string message)   => Log($"[ERROR] {message}");
}
\`\`\`

### Abstract Classes vs Interfaces

| | Abstract Class | Interface |
|---|---|---|
| Instance fields | ✅ | ❌ |
| Constructors | ✅ | ❌ |
| Multiple inheritance | ❌ | ✅ |
| Default implementations | ✅ | ✅ (C# 8+) |
| Use when | Shared base behavior | Contract/capability |`,
        codeExample: `// Full OOP example
public abstract class Shape
{
    public string Color { get; set; } = "Black";
    public abstract double Area();
    public virtual string Describe() => $"{GetType().Name} area={Area():F2}";
}

public class Circle : Shape
{
    public double Radius { get; set; }
    public Circle(double radius) => Radius = radius;
    public override double Area() => Math.PI * Radius * Radius;
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    public Rectangle(double w, double h) { Width = w; Height = h; }
    public override double Area() => Width * Height;
}

// Polymorphism in action
Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };
foreach (var shape in shapes)
    Console.WriteLine(shape.Describe());
// Circle area=78.54
// Rectangle area=24.00`,
        keyPoints: [
          'Use init; for immutable properties set at construction only',
          'Always call base() constructor when inheriting',
          'Prefer interfaces over abstract classes for decoupling',
          'Virtual + override enables polymorphism; sealed prevents further overriding',
          'C# does not support multiple class inheritance — use interfaces instead',
        ]
      },
      {
        id: 'cs-03',
        title: 'LINQ — Language Integrated Query',
        duration: '25 min',
        difficulty: 'Intermediate',
        theory: `## LINQ — Language Integrated Query

LINQ lets you query collections (arrays, lists, databases, XML) using a consistent, SQL-like syntax. This is one of the most powerful features of C#.

### Method Syntax vs Query Syntax

\`\`\`csharp
var numbers = new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Method syntax (preferred in teams)
var evens = numbers
    .Where(n => n % 2 == 0)
    .Select(n => n * n)
    .ToList();

// Query syntax (SQL-like, less common)
var evens2 = (from n in numbers
              where n % 2 == 0
              select n * n).ToList();
\`\`\`

### Essential LINQ Operators

\`\`\`csharp
var devs = new List<Developer>
{
    new("Alice", "C#", 85000),
    new("Bob",   "React", 78000),
    new("Youssef", "C#", 90000),
    new("Sara",  "React", 82000),
    new("Tom",   "C#", 75000),
};

// Filter + Project
var csharpDevs = devs
    .Where(d => d.Stack == "C#")
    .Select(d => new { d.Name, d.Salary });

// Ordering
var topEarners = devs
    .OrderByDescending(d => d.Salary)
    .ThenBy(d => d.Name)
    .Take(3);

// Grouping
var byStack = devs
    .GroupBy(d => d.Stack)
    .Select(g => new {
        Stack = g.Key,
        Count = g.Count(),
        AvgSalary = g.Average(d => d.Salary)
    });

// Aggregation
decimal totalPayroll = devs.Sum(d => d.Salary);
decimal maxSalary   = devs.Max(d => d.Salary);
bool anyReact       = devs.Any(d => d.Stack == "React");
bool allPaid        = devs.All(d => d.Salary > 50000);

// Flattening
var allSkills = devs
    .SelectMany(d => d.Skills)
    .Distinct();

// Join
var projects = ...;
var devProjects = devs.Join(projects,
    d => d.Id,
    p => p.DeveloperId,
    (d, p) => new { d.Name, p.Title });
\`\`\`

### Deferred vs Immediate Execution

\`\`\`csharp
// DEFERRED — query not executed yet
var query = devs.Where(d => d.Salary > 80000);

// IMMEDIATE — forces execution now
var list  = query.ToList();     // List<Developer>
var count = query.Count();      // int
var first = query.First();      // Developer
var arr   = query.ToArray();    // Developer[]
\`\`\``,
        codeExample: `record Developer(string Name, string Stack, decimal Salary);

var devs = new List<Developer>
{
    new("Alice",   "C#",    85000),
    new("Bob",     "React", 78000),
    new("Youssef", "C#",    90000),
    new("Sara",    "React", 82000),
};

// 1. Highest paid C# developer
var topCsharp = devs
    .Where(d => d.Stack == "C#")
    .MaxBy(d => d.Salary);
Console.WriteLine($"Top C#: {topCsharp?.Name}");  // Youssef

// 2. Average salary by stack
var avgByStack = devs
    .GroupBy(d => d.Stack)
    .ToDictionary(
        g => g.Key,
        g => g.Average(d => d.Salary)
    );
foreach (var (stack, avg) in avgByStack)
    Console.WriteLine($"{stack}: \${avg:F0}");

// 3. Name list sorted
string names = string.Join(", ",
    devs.OrderBy(d => d.Name)
        .Select(d => d.Name));
Console.WriteLine(names);`,
        keyPoints: [
          'LINQ uses deferred execution — the query runs only when iterated or forced',
          'Always call .ToList() or .ToArray() when you need the result immediately',
          'GroupBy returns IGrouping<TKey, TElement> — iterate over it or project it',
          'MaxBy / MinBy (LINQ .NET 6+) replaces OrderByDescending().First()',
          'LINQ works on any IEnumerable<T> — including EF Core DbSet queries',
        ]
      },
      {
        id: 'cs-04',
        title: 'async / await & Task Parallel Library',
        duration: '30 min',
        difficulty: 'Intermediate',
        theory: `## Async / Await in C#

Asynchronous programming is essential for building responsive APIs and UIs. async/await makes it readable without callback hell.

### The async/await Pattern

\`\`\`csharp
// Synchronous — blocks the thread
public string FetchData()
{
    Thread.Sleep(2000);   // blocks!
    return "data";
}

// Asynchronous — non-blocking
public async Task<string> FetchDataAsync()
{
    await Task.Delay(2000);   // yields thread to pool
    return "data";
}
\`\`\`

### Task Return Types

\`\`\`csharp
async Task            DoSomethingAsync()     { ... }   // no return value
async Task<T>         GetValueAsync<T>()    { ... }   // returns T
async ValueTask<T>    GetCachedAsync<T>()   { ... }   // perf optimization
\`\`\`

### Exception Handling

\`\`\`csharp
public async Task<User?> GetUserAsync(int id)
{
    try
    {
        var response = await _httpClient.GetAsync($"/users/{id}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<User>();
    }
    catch (HttpRequestException ex)
    {
        _logger.LogError(ex, "Failed to fetch user {Id}", id);
        return null;
    }
}
\`\`\`

### Parallel Async — WhenAll vs WhenAny

\`\`\`csharp
// Sequential — slow (waits for each)
var a = await GetAAsync();
var b = await GetBAsync();
var c = await GetCAsync();

// Parallel — fast (all fire at once)
var (a, b, c) = await (GetAAsync(), GetBAsync(), GetCAsync());
// or
var results = await Task.WhenAll(GetAAsync(), GetBAsync(), GetCAsync());

// First to complete wins
var fastest = await Task.WhenAny(GetAAsync(), GetBAsync());
\`\`\`

### CancellationToken — Best Practice

\`\`\`csharp
public async Task<IEnumerable<Product>> SearchAsync(
    string keyword,
    CancellationToken cancellationToken = default)
{
    return await _db.Products
        .Where(p => p.Name.Contains(keyword))
        .ToListAsync(cancellationToken);   // pass token everywhere!
}
\`\`\`

### ConfigureAwait

\`\`\`csharp
// In library code — don't capture context (perf)
var data = await _http.GetStringAsync(url).ConfigureAwait(false);

// In UI/ASP.NET code — keep context (default behavior)
var data = await _http.GetStringAsync(url);
\`\`\``,
        codeExample: `using System.Net.Http.Json;

public class ApiService
{
    private readonly HttpClient _http;

    public ApiService(HttpClient http) => _http = http;

    // Fetch multiple endpoints in parallel
    public async Task<DashboardData> GetDashboardAsync(
        CancellationToken ct = default)
    {
        // Fire all requests at once
        var usersTask   = _http.GetFromJsonAsync<List<User>>("api/users", ct);
        var ordersTask  = _http.GetFromJsonAsync<List<Order>>("api/orders", ct);
        var statsTask   = _http.GetFromJsonAsync<Stats>("api/stats", ct);

        await Task.WhenAll(usersTask, ordersTask, statsTask);

        return new DashboardData
        {
            Users  = await usersTask  ?? [],
            Orders = await ordersTask ?? [],
            Stats  = await statsTask  ?? new Stats()
        };
    }
}

// With retry logic
public async Task<T?> GetWithRetryAsync<T>(
    string url,
    int maxRetries = 3,
    CancellationToken ct = default)
{
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            return await _http.GetFromJsonAsync<T>(url, ct);
        }
        catch (HttpRequestException) when (i < maxRetries - 1)
        {
            await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, i)), ct);
        }
    }
    return default;
}`,
        keyPoints: [
          'Never use .Result or .Wait() — they cause deadlocks in ASP.NET',
          'Always pass CancellationToken through your call chain',
          'Use Task.WhenAll for parallel async — huge performance win',
          'async void is only for event handlers — use async Task everywhere else',
          'ConfigureAwait(false) in library code, omit it in application code',
        ]
      },
      {
        id: 'cs-05',
        title: 'ASP.NET Core — Building REST APIs',
        duration: '35 min',
        difficulty: 'Intermediate',
        theory: `## ASP.NET Core Web APIs

ASP.NET Core is the go-to framework for building modern REST APIs in the .NET ecosystem.

### Minimal API (Modern Approach)

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Route groups
var products = app.MapGroup("/api/products").RequireAuthorization();

products.MapGet("/",       async (IProductService svc) =>
    Results.Ok(await svc.GetAllAsync()));

products.MapGet("/{id}",   async (int id, IProductService svc) =>
    await svc.GetByIdAsync(id) is Product p
        ? Results.Ok(p)
        : Results.NotFound());

products.MapPost("/",      async (CreateProductDto dto, IProductService svc) => {
    var product = await svc.CreateAsync(dto);
    return Results.CreatedAtRoute("GetProduct", new { id = product.Id }, product);
});

products.MapPut("/{id}",   async (int id, UpdateProductDto dto, IProductService svc) =>
    await svc.UpdateAsync(id, dto) ? Results.NoContent() : Results.NotFound());

products.MapDelete("/{id}", async (int id, IProductService svc) =>
    await svc.DeleteAsync(id) ? Results.NoContent() : Results.NotFound());

app.Run();
\`\`\`

### Controller-Based API (Traditional)

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _svc;

    public ProductsController(IProductService svc) => _svc = svc;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Product>), 200)]
    public async Task<IActionResult> GetAll()
        => Ok(await _svc.GetAllAsync());

    [HttpGet("{id:int}", Name = "GetProduct")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _svc.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var product = await _svc.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }
}
\`\`\`

### Dependency Injection Lifetimes

\`\`\`csharp
services.AddSingleton<ICacheService, MemoryCacheService>();   // 1 instance app-wide
services.AddScoped<IDbContext, AppDbContext>();               // 1 per HTTP request
services.AddTransient<IEmailSender, SmtpEmailSender>();      // new every injection
\`\`\``,
        codeExample: `// Complete service + repository pattern
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default);
    Task<Product?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Product> CreateAsync(Product product, CancellationToken ct = default);
    Task<bool> UpdateAsync(Product product, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}

public class ProductService : IProductService
{
    private readonly IProductRepository _repo;
    private readonly ILogger<ProductService> _logger;

    public ProductService(IProductRepository repo, ILogger<ProductService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    public async Task<Product> CreateAsync(CreateProductDto dto, CancellationToken ct = default)
    {
        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price,
            CreatedAt = DateTime.UtcNow
        };

        _logger.LogInformation("Creating product: {Name}", dto.Name);
        return await _repo.CreateAsync(product, ct);
    }
}`,
        keyPoints: [
          'Minimal APIs are preferred for new projects — less boilerplate, same power',
          'Always use async endpoints — never block I/O threads',
          'Use [ApiController] to get automatic model validation + ProblemDetails',
          'DI lifetime matters — Scoped for DbContext, Singleton for shared caches',
          'Return Results.* (minimal) or IActionResult (controller) — never raw values',
        ]
      },
      {
        id: 'cs-06',
        title: 'Entity Framework Core',
        duration: '30 min',
        difficulty: 'Intermediate',
        theory: `## Entity Framework Core

EF Core is the ORM (Object-Relational Mapper) for .NET — it maps your C# classes to database tables.

### DbContext & Entities

\`\`\`csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Product>  Products  { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Order>    Orders    { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(p => p.Name).IsUnique();
        });
    }
}
\`\`\`

### Common Query Patterns

\`\`\`csharp
// Include navigation properties (eager loading)
var products = await _db.Products
    .Include(p => p.Category)
    .Include(p => p.Tags)
    .Where(p => p.IsActive && p.Price < 100)
    .OrderBy(p => p.Name)
    .AsNoTracking()    // faster for read-only
    .ToListAsync(ct);

// Pagination
var page = await _db.Products
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(ct);

// Projection — only fetch needed columns
var names = await _db.Products
    .Select(p => new ProductSummaryDto { Id = p.Id, Name = p.Name })
    .ToListAsync(ct);
\`\`\`

### Migrations

\`\`\`bash
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet ef migrations add AddProductIndex
dotnet ef database update
dotnet ef database drop           # dev only!
\`\`\``,
        codeExample: `// Repository with EF Core
public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _db;

    public ProductRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default)
        => await _db.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Product?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _db.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<Product> CreateAsync(Product product, CancellationToken ct = default)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);
        return product;
    }

    public async Task<bool> UpdateAsync(Product product, CancellationToken ct = default)
    {
        _db.Products.Update(product);
        return await _db.SaveChangesAsync(ct) > 0;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var product = await _db.Products.FindAsync([id], ct);
        if (product is null) return false;
        _db.Products.Remove(product);
        return await _db.SaveChangesAsync(ct) > 0;
    }
}`,
        keyPoints: [
          'Use AsNoTracking() for read-only queries — significant performance boost',
          'Always Include() navigation properties you need — avoid N+1 queries',
          'Projection with Select() is faster than loading full entities',
          'Never call SaveChangesAsync() in a loop — batch changes then save once',
          'Use migrations for all schema changes — never modify the DB directly in production',
        ]
      },
    ]
  },

  {
    id: 'react',
    title: 'React Mastery',
    subtitle: 'Hooks, state, performance and modern React patterns',
    icon: '⚛️',
    color: 'cyan',
    gradient: 'from-cyan-600 to-cyan-800',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-500/20 text-cyan-300',
    lessons: [
      {
        id: 'rx-01',
        title: 'Hooks Deep Dive: useState, useEffect, useRef',
        duration: '25 min',
        difficulty: 'Beginner',
        theory: `## React Hooks

Hooks let you use state and other React features in functional components.

### useState — State Management

\`\`\`jsx
// Basic
const [count, setCount] = useState(0);

// Object state — always spread to avoid overwriting
const [user, setUser] = useState({ name: '', email: '' });
const updateName = (name) => setUser(prev => ({ ...prev, name }));

// Functional update — use when new state depends on old
setCount(prev => prev + 1);  // always use prev form in async scenarios

// Lazy initializer — expensive computation runs only once
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data') ?? '[]'));
\`\`\`

### useEffect — Side Effects

\`\`\`jsx
// Run on every render
useEffect(() => { document.title = count; });

// Run once (componentDidMount equivalent)
useEffect(() => {
    fetchData();
}, []);

// Run when dependencies change
useEffect(() => {
    const sub = api.subscribe(userId, onUpdate);
    return () => sub.unsubscribe();  // cleanup (componentWillUnmount)
}, [userId]);

// Avoid — missing dependencies cause stale closures
useEffect(() => {
    setInterval(() => console.log(count), 1000);  // count is stale!
}, []);  // should include [count]
\`\`\`

### useRef — Mutable Values Without Re-render

\`\`\`jsx
// DOM reference
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

// Persist value without causing re-render
const renderCount = useRef(0);
useEffect(() => { renderCount.current++; });

// Store previous value
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; }, [count]);
\`\`\``,
        codeExample: `import { useState, useEffect, useRef } from 'react';

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search with cleanup
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const timer = setTimeout(async () => {
      // Cancel previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        const res = await fetch(\`/api/search?q=\${query}\`, {
          signal: abortRef.current.signal
        });
        setResults(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div>
      <input
        ref={inputRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <span>Searching...</span>}
      {results.map(r => <div key={r.id}>{r.name}</div>)}
    </div>
  );
}`,
        keyPoints: [
          'Always use the functional update form (prev =>) when state depends on old state',
          'useEffect cleanup is crucial — return a function to cancel subscriptions/timers',
          'useRef does NOT trigger re-renders — use for DOM refs and mutable values',
          'Missing dependencies in useEffect cause stale closure bugs',
          'Lazy initializer in useState runs only once — use for expensive computations',
        ]
      },
      {
        id: 'rx-02',
        title: 'useContext, useReducer & Custom Hooks',
        duration: '25 min',
        difficulty: 'Intermediate',
        theory: `## Advanced Hooks

### useContext — Global State Without Redux

\`\`\`jsx
// 1. Create context
const ThemeContext = createContext(null);

// 2. Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook (best practice — avoids null checks everywhere)
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

// 4. Consume anywhere
function Button() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>Theme: {theme}</button>;
}
\`\`\`

### useReducer — Complex State Logic

\`\`\`jsx
const initialState = { items: [], total: 0, loading: false };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload],
               total: state.total + action.payload.price };
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload);
      return { ...state,
               items: state.items.filter(i => i.id !== action.payload),
               total: state.total - (item?.price ?? 0) };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <div>
      {state.items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: \${state.total}</p>
    </div>
  );
}
\`\`\`

### Custom Hooks — Reusable Logic

\`\`\`jsx
// useFetch — data fetching hook
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then(r => r.json())
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(error => { if (!cancelled) setState({ data: null, loading: false, error }); });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

// useLocalStorage — persistent state
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initialValue))
  );

  const setStored = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, setStored];
}
\`\`\``,
        codeExample: `// Full auth context with useReducer
const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':  return { ...state, user: action.payload, isAuth: true };
    case 'LOGOUT': return { user: null, isAuth: false };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem('user')),
    isAuth: !!localStorage.getItem('user')
  });

  const login = async (credentials) => {
    const user = await authApi.login(credentials);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};`,
        keyPoints: [
          'useContext + custom hook pattern avoids prop drilling cleanly',
          'useReducer is preferable to useState when state has complex transitions',
          'Always throw an error in your custom hook if used outside its Provider',
          'Extract reusable logic into custom hooks (useFetch, useForm, useDebounce)',
          'Context re-renders ALL consumers when value changes — split contexts by concern',
        ]
      },
      {
        id: 'rx-03',
        title: 'Performance: useMemo, useCallback, memo',
        duration: '20 min',
        difficulty: 'Advanced',
        theory: `## React Performance Optimization

### React.memo — Skip Re-renders

\`\`\`jsx
// Without memo — re-renders every time parent re-renders
function ExpensiveList({ items }) {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}

// With memo — only re-renders if items prop changes
const ExpensiveList = React.memo(({ items }) => {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});

// Custom comparison
const MemoList = React.memo(ExpensiveList, (prev, next) =>
  prev.items.length === next.items.length
);
\`\`\`

### useMemo — Memoize Expensive Computations

\`\`\`jsx
function Dashboard({ orders }) {
  // Recalculates ONLY when orders changes
  const stats = useMemo(() => ({
    total: orders.reduce((sum, o) => sum + o.amount, 0),
    count: orders.length,
    avg:   orders.length ? orders.reduce((s, o) => s + o.amount, 0) / orders.length : 0,
    max:   Math.max(...orders.map(o => o.amount))
  }), [orders]);

  return <StatsCard stats={stats} />;
}
\`\`\`

### useCallback — Stable Function References

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback — new function reference every render
  // → Child re-renders even if count is irrelevant to it
  const handleDelete = (id) => deleteItem(id);

  // With useCallback — same reference unless deps change
  const handleDelete = useCallback((id) => deleteItem(id), []);
  const handleUpdate = useCallback((id, data) => updateItem(id, data), []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoizedChildList onDelete={handleDelete} onUpdate={handleUpdate} />
    </>
  );
}
\`\`\`

### Golden Rule

> Measure first. Don't optimize prematurely.
> Use React DevTools Profiler to identify actual bottlenecks.`,
        codeExample: `import { useState, useMemo, useCallback, memo } from 'react';

// 1. Heavy computation memoized
const ProductList = memo(function ProductList({ products, onBuy }) {
  return (
    <ul>
      {products.map(p => (
        <ProductItem key={p.id} product={p} onBuy={onBuy} />
      ))}
    </ul>
  );
});

// 2. Individual item also memoized
const ProductItem = memo(function ProductItem({ product, onBuy }) {
  console.log('Rendering:', product.name); // see how often this logs
  return (
    <li>
      {product.name} — \${product.price}
      <button onClick={() => onBuy(product.id)}>Buy</button>
    </li>
  );
});

// 3. Parent with optimized handlers
function Store({ rawProducts }) {
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // Memoize filtered list
  const products = useMemo(
    () => category === 'all' ? rawProducts : rawProducts.filter(p => p.category === category),
    [rawProducts, category]
  );

  // Stable callback reference
  const handleBuy = useCallback((id) => {
    setCart(prev => [...prev, id]);
  }, []);

  return (
    <>
      <select onChange={e => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
      </select>
      <ProductList products={products} onBuy={handleBuy} />
      <p>Cart: {cart.length} items</p>
    </>
  );
}`,
        keyPoints: [
          'React.memo prevents re-renders — but only works if props are the same reference',
          'useCallback stabilizes function references so memo\'d children don\'t re-render',
          'useMemo is for expensive computations — not needed for simple operations',
          'Don\'t overuse — premature optimization adds complexity without benefit',
          'Use React DevTools Profiler to measure before and after optimization',
        ]
      },
    ]
  },

  {
    id: 'nextjs',
    title: 'Next.js Pro',
    subtitle: 'App Router, SSR/SSG, API routes, performance',
    icon: '▲',
    color: 'violet',
    gradient: 'from-violet-600 to-violet-800',
    border: 'border-violet-500/40',
    badge: 'bg-violet-500/20 text-violet-300',
    lessons: [
      {
        id: 'nx-01',
        title: 'App Router & File-Based Routing',
        duration: '25 min',
        difficulty: 'Beginner',
        theory: `## Next.js App Router (Next.js 13+)

The App Router uses React Server Components by default and brings a new mental model for routing.

### Folder Structure → Routes

\`\`\`
app/
├── layout.tsx          → Root layout (wraps everything)
├── page.tsx            → /
├── loading.tsx         → Automatic loading UI
├── error.tsx           → Error boundary
├── not-found.tsx       → 404 page
├── dashboard/
│   ├── layout.tsx      → /dashboard layout
│   ├── page.tsx        → /dashboard
│   └── settings/
│       └── page.tsx    → /dashboard/settings
├── products/
│   ├── page.tsx        → /products
│   └── [id]/
│       └── page.tsx    → /products/:id
└── api/
    └── products/
        └── route.ts    → API endpoint
\`\`\`

### Server vs Client Components

\`\`\`tsx
// SERVER COMPONENT (default) — runs on server, no useState/useEffect
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then(r => r.json());

  return (
    <main>
      <h1>Products</h1>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </main>
  );
}

// CLIENT COMPONENT — add "use client" directive
// components/AddToCart.tsx
'use client';
import { useState } from 'react';

export default function AddToCart({ productId }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
\`\`\`

### Dynamic Routes & Params

\`\`\`tsx
// app/products/[id]/page.tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}

// Generate static params at build time (SSG)
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ id: p.id.toString() }));
}
\`\`\``,
        codeExample: `// app/layout.tsx — root layout
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'Modern Next.js application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductDetail from './ProductDetail';
import ReviewsSkeleton from './ReviewsSkeleton';
import Reviews from './Reviews';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return { title: product?.name ?? 'Product Not Found' };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <>
      <ProductDetail product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />
      </Suspense>
    </>
  );
}`,
        keyPoints: [
          'Server Components run on the server — zero JS sent to client, direct DB access',
          'Use "use client" only where you need interactivity (hooks, browser APIs)',
          'loading.tsx and error.tsx are automatic — no manual Suspense/ErrorBoundary needed',
          'generateStaticParams() at build time = SSG (fast, cached at CDN)',
          'Layouts persist across route changes — ideal for navbars and sidebars',
        ]
      },
      {
        id: 'nx-02',
        title: 'Data Fetching: SSR, SSG, ISR, CSR',
        duration: '25 min',
        difficulty: 'Intermediate',
        theory: `## Next.js Data Fetching Strategies

### Server-Side Rendering (SSR) — Per Request

\`\`\`tsx
// Force fresh data on every request
export const dynamic = 'force-dynamic';   // or no-store cache

async function getData(id: string) {
  const res = await fetch(\`https://api.example.com/data/\${id}\`, {
    cache: 'no-store'   // SSR: never cache
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Page({ params }) {
  const data = await getData(params.id);
  return <div>{data.title}</div>;
}
\`\`\`

### Static Generation (SSG) — At Build Time

\`\`\`tsx
// Cache forever — regenerate only on rebuild
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache'   // default in Next.js
  });
  return res.json();
}
\`\`\`

### Incremental Static Regeneration (ISR) — Best of Both

\`\`\`tsx
// Revalidate every 60 seconds
const res = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 }
});

// Or tag-based revalidation
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
});
// Then in a Server Action or API route:
revalidateTag('posts');
\`\`\`

### Server Actions — Form Handling

\`\`\`tsx
// app/contact/page.tsx
async function submitForm(formData: FormData) {
  'use server';   // this function runs on the server
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  await sendEmail({ name, email });
  revalidatePath('/contact');
}

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">Send</button>
    </form>
  );
}
\`\`\``,
        codeExample: `// app/blog/page.tsx — ISR blog list
import { revalidateTag } from 'next/cache';

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 3600, tags: ['posts'] }  // refresh hourly
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog</h1>
      <div className="grid grid-cols-3 gap-4">
        {posts.slice(0, 9).map(post => (
          <article key={post.id} className="border p-4 rounded">
            <h2>{post.title}</h2>
            <p>{post.body.slice(0, 80)}...</p>
            <a href={\`/blog/\${post.id}\`}>Read more →</a>
          </article>
        ))}
      </div>
    </div>
  );
}

// app/api/revalidate/route.ts — webhook to revalidate cache
import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { tag, secret } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidateTag(tag);
  return Response.json({ revalidated: true, tag });
}`,
        keyPoints: [
          'cache: "no-store" = SSR, cache: "force-cache" = SSG, next.revalidate = ISR',
          'ISR is usually the best choice — fast like SSG, fresh like SSR',
          'Server Actions replace API routes for form submissions and mutations',
          'revalidateTag() lets you invalidate specific cached data on demand',
          'Streaming with Suspense lets parts of the page load independently',
        ]
      },
    ]
  },

  {
    id: 'apis',
    title: 'REST API Design',
    subtitle: 'HTTP mastery, REST principles, auth, versioning',
    icon: '🌐',
    color: 'emerald',
    gradient: 'from-emerald-600 to-emerald-800',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/20 text-emerald-300',
    lessons: [
      {
        id: 'api-01',
        title: 'REST Principles & HTTP Fundamentals',
        duration: '20 min',
        difficulty: 'Beginner',
        theory: `## REST & HTTP

REST (Representational State Transfer) is an architectural style for APIs. Understanding HTTP deeply is essential.

### HTTP Methods & Their Semantics

| Method | Purpose | Idempotent | Safe | Body |
|--------|---------|------------|------|------|
| GET    | Retrieve resource | ✅ | ✅ | ❌ |
| POST   | Create resource | ❌ | ❌ | ✅ |
| PUT    | Replace resource entirely | ✅ | ❌ | ✅ |
| PATCH  | Partial update | ❌ | ❌ | ✅ |
| DELETE | Remove resource | ✅ | ❌ | Optional |

### REST URL Design

\`\`\`
✅ Good REST URLs:
GET    /api/products              → list all products
POST   /api/products              → create product
GET    /api/products/{id}         → get one
PUT    /api/products/{id}         → replace
PATCH  /api/products/{id}         → partial update
DELETE /api/products/{id}         → delete

GET    /api/products/{id}/reviews → nested resource

❌ Bad REST URLs (RPC style):
GET    /api/getProducts
POST   /api/createProduct
GET    /api/product/delete?id=5
\`\`\`

### HTTP Status Codes — Know These Cold

\`\`\`
2xx Success:
  200 OK             — standard success
  201 Created        — resource created (include Location header)
  204 No Content     — success with no body (DELETE, PUT)

3xx Redirection:
  301 Moved Permanently
  304 Not Modified   — cache is still valid

4xx Client Errors:
  400 Bad Request    — invalid input, validation failed
  401 Unauthorized   — not authenticated
  403 Forbidden      — authenticated but no permission
  404 Not Found      — resource doesn't exist
  409 Conflict       — duplicate or state conflict
  422 Unprocessable  — semantic validation failed
  429 Too Many       — rate limited

5xx Server Errors:
  500 Internal Error  — server bug
  502 Bad Gateway     — upstream service failed
  503 Service Unavailable — down for maintenance
\`\`\`

### REST Constraints (Richardson Maturity Model)

**Level 0** — One URL, one method (XML-RPC, SOAP)
**Level 1** — Multiple resources, still GET/POST only
**Level 2** — HTTP verbs correctly + status codes ← Most APIs
**Level 3** — HATEOAS: responses include links to next actions`,
        codeExample: `// REST API response structure — be consistent
{
  // Success — list
  "data": [...],
  "meta": { "total": 100, "page": 1, "perPage": 20 },
  "links": { "self": "/api/products?page=1", "next": "/api/products?page=2" }
}

{
  // Success — single
  "data": { "id": 1, "name": "Widget", "price": 29.99 }
}

{
  // Error (RFC 7807 Problem Details)
  "type": "https://docs.api.com/errors/validation",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The request body contains invalid fields",
  "errors": {
    "name": ["Name is required", "Name must be at least 3 chars"],
    "price": ["Price must be positive"]
  }
}

// Headers to always set
Content-Type: application/json
Cache-Control: no-cache, no-store        // for authenticated routes
X-Request-Id: uuid                       // for tracing
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999`,
        keyPoints: [
          'GET must be safe and idempotent — never use it for state changes',
          'PUT replaces the whole resource; PATCH updates specific fields',
          '401 = "who are you?", 403 = "I know who you are, but no"',
          'Always return consistent response shapes — data, meta, errors',
          'Use plural nouns for collection URLs: /products not /product',
        ]
      },
      {
        id: 'api-02',
        title: 'API Authentication: JWT & OAuth 2.0',
        duration: '30 min',
        difficulty: 'Intermediate',
        theory: `## API Authentication

### JWT (JSON Web Token)

A JWT is a self-contained token with 3 base64-encoded parts: Header.Payload.Signature

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    ← Header
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ill...  ← Payload (claims)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c ← Signature
\`\`\`

\`\`\`csharp
// ASP.NET Core JWT setup
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = config["Jwt:Issuer"],
            ValidAudience            = config["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
        };
    });

// Generate token
var claims = new[] {
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, user.Role),
};
var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
var token = new JwtSecurityToken(
    issuer:   config["Jwt:Issuer"],
    audience: config["Jwt:Audience"],
    claims:   claims,
    expires:  DateTime.UtcNow.AddHours(1),
    signingCredentials: creds
);
return new JwtSecurityTokenHandler().WriteToken(token);
\`\`\`

### Refresh Token Strategy

\`\`\`
1. Login → server returns { accessToken (15min), refreshToken (7d) }
2. Client stores refreshToken in HttpOnly cookie
3. When accessToken expires → POST /auth/refresh with cookie
4. Server validates refreshToken → returns new accessToken
5. Logout → server invalidates refreshToken in DB
\`\`\`

### OAuth 2.0 Flows

\`\`\`
Authorization Code Flow (web apps, most secure):
1. User clicks "Login with Google"
2. Redirect to Google with client_id, redirect_uri, scope, state
3. Google authenticates user, redirects back with code
4. Backend exchanges code for tokens (using client_secret)
5. Store tokens, use access_token for Google API calls
\`\`\``,
        codeExample: `// Login endpoint
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    var user = await _userService.ValidateAsync(dto.Email, dto.Password);
    if (user is null)
        return Unauthorized(new { error = "Invalid credentials" });

    var accessToken  = _tokenService.GenerateAccessToken(user);
    var refreshToken = _tokenService.GenerateRefreshToken();

    // Store refresh token hash in DB
    await _userService.SaveRefreshTokenAsync(user.Id, refreshToken);

    // Set refresh token as HttpOnly cookie
    Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions {
        HttpOnly = true,
        Secure   = true,
        SameSite = SameSiteMode.Strict,
        Expires  = DateTimeOffset.UtcNow.AddDays(7)
    });

    return Ok(new { accessToken, expiresIn = 3600 });
}

// Protect endpoints
[Authorize]
[HttpGet("profile")]
public async Task<IActionResult> GetProfile()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var user = await _userService.GetByIdAsync(int.Parse(userId!));
    return Ok(user);
}

// Role-based authorization
[Authorize(Roles = "Admin,Manager")]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id) { ... }`,
        keyPoints: [
          'Never store JWT in localStorage — use HttpOnly cookies for refresh tokens',
          'Access tokens short-lived (15min), refresh tokens long-lived (7d)',
          'Always validate issuer, audience, lifetime, and signature',
          'Use HTTPS only — JWT signature prevents tampering but not interception',
          'Rotate refresh tokens on each use — single-use refresh token pattern',
        ]
      },
    ]
  },

  {
    id: 'oop',
    title: 'OOP & Design Patterns',
    subtitle: 'SOLID, GoF patterns, clean architecture',
    icon: '🏗️',
    color: 'amber',
    gradient: 'from-amber-600 to-amber-800',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/20 text-amber-300',
    lessons: [
      {
        id: 'oop-01',
        title: 'SOLID Principles',
        duration: '35 min',
        difficulty: 'Intermediate',
        theory: `## SOLID Principles

SOLID is the foundation of clean, maintainable object-oriented code. Every senior developer at Jadev is expected to know these deeply.

### S — Single Responsibility Principle

> A class should have only ONE reason to change.

\`\`\`csharp
// ❌ Violates SRP — does too many things
class OrderService {
    void ProcessOrder(Order order) { ... }   // business logic
    void SaveToDatabase(Order order) { ... } // data access
    void SendEmail(Order order) { ... }      // communication
    void GeneratePdf(Order order) { ... }    // reporting
}

// ✅ Each class has one job
class OrderService     { void ProcessOrder(Order o) { ... } }
class OrderRepository  { void Save(Order o) { ... } }
class OrderEmailer     { void SendConfirmation(Order o) { ... } }
class OrderPdfExporter { byte[] Generate(Order o) { ... } }
\`\`\`

### O — Open/Closed Principle

> Open for extension, closed for modification.

\`\`\`csharp
// ❌ Adding new payment → modify existing class
class PaymentProcessor {
    void Process(Payment p) {
        if (p.Type == "Credit") { ... }
        else if (p.Type == "PayPal") { ... }  // keep modifying!
    }
}

// ✅ Add new payment type without touching existing code
interface IPaymentStrategy { Task ProcessAsync(Payment payment); }

class CreditCardStrategy : IPaymentStrategy { ... }
class PayPalStrategy      : IPaymentStrategy { ... }
class CryptoStrategy      : IPaymentStrategy { ... }  // new — no changes elsewhere!

class PaymentProcessor {
    private readonly Dictionary<string, IPaymentStrategy> _strategies;
    async Task ProcessAsync(Payment p) => await _strategies[p.Type].ProcessAsync(p);
}
\`\`\`

### L — Liskov Substitution Principle

> Subclasses must be substitutable for their base class.

\`\`\`csharp
// ❌ Violates LSP — Square breaks Rectangle's invariant
class Rectangle { virtual int Width { get; set; } virtual int Height { get; set; } }
class Square : Rectangle {
    override int Width  { set { base.Width = base.Height = value; } get; }
    override int Height { set { base.Width = base.Height = value; } get; }
}
// Rectangle r = new Square(); r.Width = 5; r.Height = 10;
// r.Area() → 100, not 50! Breaks caller's expectation.

// ✅ Separate hierarchy
interface IShape { double Area(); }
class Rectangle : IShape { public double Area() => Width * Height; ... }
class Square    : IShape { public double Area() => Side * Side; ... }
\`\`\`

### I — Interface Segregation Principle

> Clients should not depend on interfaces they don't use.

\`\`\`csharp
// ❌ Fat interface
interface IWorker {
    void Work();
    void Eat();
    void Sleep();
    void GetPaid();
}

// ✅ Focused interfaces
interface IWorkable { void Work(); }
interface IEatable  { void Eat(); void Sleep(); }
interface IPayable  { void GetPaid(); }
\`\`\`

### D — Dependency Inversion Principle

> Depend on abstractions, not concretions.

\`\`\`csharp
// ❌ Tightly coupled
class OrderService {
    private SqlOrderRepository _repo = new SqlOrderRepository(); // concrete!
}

// ✅ Depends on abstraction
class OrderService {
    private readonly IOrderRepository _repo;
    public OrderService(IOrderRepository repo) => _repo = repo; // injected!
}
// Swap SQL → NoSQL → Mock without touching OrderService
\`\`\``,
        codeExample: `// SOLID in practice — notification system
public interface INotificationChannel
{
    Task SendAsync(string to, string subject, string body, CancellationToken ct = default);
    bool CanHandle(string channelType);
}

public class EmailNotification : INotificationChannel
{
    public bool CanHandle(string type) => type == "email";
    public async Task SendAsync(string to, string subject, string body, CancellationToken ct)
    {
        // email sending logic
        await _smtp.SendAsync(new MailMessage(from: _config.From, to, subject, body), ct);
    }
}

public class SmsNotification : INotificationChannel
{
    public bool CanHandle(string type) => type == "sms";
    public async Task SendAsync(string to, string subject, string body, CancellationToken ct)
    {
        await _twilio.SendSmsAsync(to, body, ct);
    }
}

// OCP: add PushNotification without modifying existing classes
public class NotificationService
{
    private readonly IEnumerable<INotificationChannel> _channels;

    public NotificationService(IEnumerable<INotificationChannel> channels)
        => _channels = channels;

    public async Task SendAsync(NotificationRequest req, CancellationToken ct = default)
    {
        var channel = _channels.FirstOrDefault(c => c.CanHandle(req.Channel))
            ?? throw new NotSupportedException($"Channel '{req.Channel}' not supported");

        await channel.SendAsync(req.To, req.Subject, req.Body, ct);
    }
}`,
        keyPoints: [
          'SRP: one class = one reason to change — split fat classes mercilessly',
          'OCP: extend via new classes/strategies — don\'t modify existing working code',
          'LSP: subclasses must honor the contract — if a Square breaks Rectangle, redesign',
          'ISP: many focused interfaces > one fat interface',
          'DIP: inject dependencies — enables testing, swapping implementations',
        ]
      },
      {
        id: 'oop-02',
        title: 'Design Patterns: Repository, Factory, Observer',
        duration: '30 min',
        difficulty: 'Intermediate',
        theory: `## Essential Design Patterns

### Repository Pattern

Abstracts data access, making business logic testable and storage-agnostic.

\`\`\`csharp
// Generic repository
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}

// Unit of Work — commit multiple repos in one transaction
public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    IOrderRepository Orders { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
\`\`\`

### Factory Pattern

Creates objects without specifying exact class.

\`\`\`csharp
public abstract class NotificationFactory
{
    public abstract INotification Create(string type);

    // Factory method
    public static INotification Create(NotificationConfig config) => config.Type switch {
        "email" => new EmailNotification(config),
        "sms"   => new SmsNotification(config),
        "push"  => new PushNotification(config),
        _       => throw new ArgumentException($"Unknown type: {config.Type}")
    };
}
\`\`\`

### Observer Pattern (Event-driven)

\`\`\`csharp
// .NET events are built-in observer pattern
public class OrderPlacedEvent
{
    public int OrderId { get; init; }
    public string CustomerEmail { get; init; }
}

// MediatR — mediator + observer for domain events
public class OrderPlacedHandler : INotificationHandler<OrderPlacedEvent>
{
    public async Task Handle(OrderPlacedEvent e, CancellationToken ct)
    {
        await _emailService.SendOrderConfirmationAsync(e.CustomerEmail, e.OrderId);
        await _inventoryService.ReserveItemsAsync(e.OrderId);
    }
}
\`\`\`

### Builder Pattern

\`\`\`csharp
var query = new ProductQueryBuilder()
    .InCategory("Electronics")
    .PriceBetween(100, 500)
    .InStock(true)
    .SortBy("price", ascending: true)
    .Page(1, pageSize: 20)
    .Build();
\`\`\``,
        codeExample: `// Repository + Unit of Work in action
public class PlaceOrderUseCase
{
    private readonly IUnitOfWork _uow;
    private readonly IPublisher _events;

    public PlaceOrderUseCase(IUnitOfWork uow, IPublisher events)
    {
        _uow = uow;
        _events = events;
    }

    public async Task<Order> ExecuteAsync(PlaceOrderCommand cmd, CancellationToken ct)
    {
        // Validate product exists
        var product = await _uow.Products.GetByIdAsync(cmd.ProductId, ct)
            ?? throw new NotFoundException("Product", cmd.ProductId);

        // Create order
        var order = new Order
        {
            ProductId = cmd.ProductId,
            CustomerId = cmd.CustomerId,
            Quantity = cmd.Quantity,
            Total = product.Price * cmd.Quantity,
            Status = OrderStatus.Pending
        };

        await _uow.Orders.AddAsync(order, ct);
        await _uow.SaveChangesAsync(ct);   // one transaction

        // Publish domain event (observer pattern)
        await _events.Publish(new OrderPlacedEvent {
            OrderId = order.Id,
            CustomerEmail = cmd.CustomerEmail
        }, ct);

        return order;
    }
}`,
        keyPoints: [
          'Repository pattern decouples business logic from data access layer',
          'Unit of Work ensures multiple repository operations commit atomically',
          'Factory centralizes complex object creation — callers don\'t know concrete types',
          'Observer (events/MediatR) decouples side effects from core business logic',
          'Use patterns to solve actual problems — don\'t pattern-match everything',
        ]
      },
    ]
  },

  {
    id: 'refactoring',
    title: 'Clean Code & Refactoring',
    subtitle: 'Code smells, clean code principles, refactoring techniques',
    icon: '✨',
    color: 'rose',
    gradient: 'from-rose-600 to-rose-800',
    border: 'border-rose-500/40',
    badge: 'bg-rose-500/20 text-rose-300',
    lessons: [
      {
        id: 'ref-01',
        title: 'Clean Code Principles',
        duration: '25 min',
        difficulty: 'Intermediate',
        theory: `## Clean Code Principles

Clean code is not about being clever — it's about being clear. Code is read 10x more than it's written.

### Naming — The Most Important Thing

\`\`\`csharp
// ❌ Cryptic names
int d;             // days? data? delta?
bool flag;
void ProcessIt(List<int> l) { ... }
var x = GetData();

// ✅ Intention-revealing names
int daysUntilExpiration;
bool isEmailVerified;
void ProcessPaymentRefunds(List<int> orderIds) { ... }
var activeSubscriptions = GetActiveSubscriptions();
\`\`\`

### Functions — Small, One Thing

\`\`\`csharp
// ❌ Too many responsibilities
void ProcessOrder(Order order) {
    // validate
    if (order.Total <= 0) throw new Exception("Invalid total");
    if (order.CustomerId <= 0) throw new Exception("Invalid customer");

    // calculate tax
    decimal tax = order.Total * 0.2m;
    order.Total += tax;

    // save
    db.Orders.Add(order);
    db.SaveChanges();

    // notify
    var email = db.Customers.Find(order.CustomerId)?.Email;
    smtp.Send(email, "Order placed", "...");
}

// ✅ Small functions, each does one thing
async Task ProcessOrderAsync(Order order, CancellationToken ct)
{
    ValidateOrder(order);
    ApplyTax(order);
    await _repo.SaveAsync(order, ct);
    await _notifier.SendConfirmationAsync(order, ct);
}
\`\`\`

### Comments — Code Should Explain Itself

\`\`\`csharp
// ❌ Comment explains WHAT — the code already shows that
// Loop through orders and calculate total
foreach (var order in orders)
    total += order.Amount;

// ✅ Comments explain WHY — the code can't
// Business rule: orders over 90 days old are archived, not deleted
// to comply with financial audit requirements (GDPR Art. 17 exception)
const int ARCHIVE_THRESHOLD_DAYS = 90;

// ✅ Extract instead of comment
// Instead of: n = n + 1; // increment for leap year
bool IsLeapYear(int year) => (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
\`\`\`

### DRY — Don't Repeat Yourself

\`\`\`csharp
// ❌ Same validation in 3 places
if (string.IsNullOrWhiteSpace(name) || name.Length > 100) { ... }

// ✅ Extract once, use everywhere
private static void ValidateName(string name) {
    if (string.IsNullOrWhiteSpace(name))    throw new ValidationException("Name required");
    if (name.Length > 100)                  throw new ValidationException("Name too long");
}
\`\`\`

### KISS & YAGNI

\`\`\`csharp
// ❌ YAGNI violation — building abstractions "for the future"
public abstract class AbstractBaseEntityFactoryProvider<T> where T : IEntity { ... }

// ✅ Solve today's problem simply
public class UserService { ... }

// ❌ Clever but unreadable
var result = items.Aggregate(0, (acc, x) => acc + (x.active ? x.val : 0));

// ✅ Clear beats clever
var total = items.Where(x => x.active).Sum(x => x.val);
\`\`\``,
        codeExample: `// Before refactoring
public string calc(List<int> d, bool t) {
    int s = 0;
    for(int i = 0; i < d.Count; i++) {
        s = s + d[i];
    }
    if(t == true) {
        s = s * 2;
    }
    return "Total: " + s.ToString();
}

// After refactoring
public string CalculateOrderTotal(List<int> itemPrices, bool isVipCustomer)
{
    int baseTotal = itemPrices.Sum();
    int finalTotal = isVipCustomer ? ApplyVipDiscount(baseTotal) : baseTotal;
    return FormatCurrency(finalTotal);
}

private int ApplyVipDiscount(int total) => total / 2;  // 50% VIP discount

private string FormatCurrency(int amount) => $"Total: {amount:C}";

// Improvements made:
// 1. Meaningful method and parameter names
// 2. LINQ instead of manual loop
// 3. Extracted small helper methods (SRP)
// 4. Removed redundant "== true"
// 5. Named the magic number (50% discount)`,
        keyPoints: [
          'The best comment is no comment — make the code self-documenting',
          'Functions should do ONE thing and do it well — if you need "and" in the name, split it',
          'DRY: the same logic in 3 places → extract to one place',
          'YAGNI: don\'t build for imagined future needs — solve today\'s problem simply',
          'Clarity > cleverness — code is written once, read many times',
        ]
      },
      {
        id: 'ref-02',
        title: 'Code Smells & Refactoring Techniques',
        duration: '30 min',
        difficulty: 'Intermediate',
        theory: `## Code Smells & How to Fix Them

Code smells are patterns that indicate deeper problems. Spotting them makes you a 10x reviewer.

### Long Method

**Smell:** Method > 20 lines, multiple levels of abstraction
**Fix:** Extract Method, Extract Class

### Large Class (God Object)

**Smell:** Class with 500+ lines, 20+ methods
**Fix:** Extract Class, Move Method, Split by responsibility

### Long Parameter List

**Smell:** More than 3-4 parameters
\`\`\`csharp
// ❌
void CreateUser(string first, string last, string email, string phone,
                string address, string city, string country, int age) { }

// ✅ Introduce Parameter Object
void CreateUser(CreateUserDto dto) { }
record CreateUserDto(string FirstName, string LastName, string Email,
                     string Phone, Address Address, int Age);
\`\`\`

### Primitive Obsession

\`\`\`csharp
// ❌ Using primitives for domain concepts
string email = "youssef@example.com";
decimal price = -5.00m;   // negative price?!

// ✅ Value objects with built-in validation
public record Email
{
    public string Value { get; }
    public Email(string value) {
        if (!Regex.IsMatch(value, @"^[^@]+@[^@]+\.[^@]+$"))
            throw new DomainException("Invalid email");
        Value = value;
    }
}

public record Money(decimal Amount, string Currency = "USD")
{
    public Money {
        if (Amount < 0) throw new DomainException("Money cannot be negative");
    }
}
\`\`\`

### Switch Statements / Type Checking

\`\`\`csharp
// ❌ Every new type requires modifying this switch
string GetDiscount(string customerType) => customerType switch {
    "Regular" => "0%",
    "Silver"  => "5%",
    "Gold"    => "10%",
    _         => throw new Exception()
};

// ✅ Polymorphism
abstract class Customer { public abstract decimal GetDiscount(); }
class RegularCustomer : Customer { public override decimal GetDiscount() => 0m; }
class SilverCustomer  : Customer { public override decimal GetDiscount() => 0.05m; }
class GoldCustomer    : Customer { public override decimal GetDiscount() => 0.10m; }
\`\`\`

### Data Clumps

\`\`\`csharp
// ❌ These 3 always appear together
void Ship(string street, string city, string zipCode) { }
void Bill(string street, string city, string zipCode) { }

// ✅ Extract to class
record Address(string Street, string City, string ZipCode);
void Ship(Address address) { }
void Bill(Address address) { }
\`\`\`

### Feature Envy

\`\`\`csharp
// ❌ Method in Order uses Customer's data more than Order's
class Order {
    void ApplyDiscount() {
        // uses customer.loyalty, customer.tier, customer.yearsActive...
        // should this be in Customer?
    }
}

// ✅ Move method to where the data lives
class Customer {
    decimal CalculateDiscount() => Tier switch {
        "Gold" => 0.10m, "Silver" => 0.05m, _ => 0m
    };
}
\`\`\``,
        codeExample: `// Refactoring step by step

// Step 1: Identify smells
public string ProcessOrder(int userId, string prodName, int qty, decimal price,
    bool isVip, string coupon, string payMethod, string addr, string city, string zip)
{
    // Step 1: look up user
    var user = _db.Users.Find(userId);
    if (user == null) return "Error: user not found";

    // calculate
    decimal total = price * qty;
    if (isVip) total *= 0.9m;
    if (coupon == "SAVE10") total -= 10;
    if (total < 0) total = 0;

    // save
    var order = new Order { UserId = userId, Total = total, /* ... */ };
    _db.Orders.Add(order);
    _db.SaveChanges();

    // notify
    var email = user.Email;
    _smtp.Send(email, "Order confirmed", $"Your order total is {total}");

    return "Success";
}

// Step 2: After refactoring
public async Task<Result<OrderDto>> ProcessOrderAsync(
    PlaceOrderCommand cmd, CancellationToken ct = default)
{
    var user = await _users.GetByIdAsync(cmd.UserId, ct);
    if (user is null) return Result.Fail("User not found");

    var pricing = _pricingService.Calculate(cmd.Items, user, cmd.CouponCode);
    var order = Order.Create(user, cmd.Items, pricing, cmd.ShippingAddress);

    await _orders.AddAsync(order, ct);
    await _uow.SaveChangesAsync(ct);
    await _events.Publish(new OrderPlacedEvent(order), ct);

    return Result.Ok(OrderDto.From(order));
}`,
        keyPoints: [
          'Long Parameter List → introduce a Parameter Object / DTO',
          'Primitive Obsession → create Value Objects with built-in validation',
          'Switch on type → use polymorphism (Strategy, State pattern)',
          'Feature Envy → move method to the class whose data it uses most',
          'Refactor in small safe steps — run tests after each step',
        ]
      },
    ]
  },
];

export const getTrack = (id) => TRACKS.find(t => t.id === id);
export const getLesson = (trackId, lessonId) => {
  const track = getTrack(trackId);
  return track?.lessons.find(l => l.id === lessonId);
};
export const totalLessons = () => TRACKS.reduce((sum, t) => sum + t.lessons.length, 0);
