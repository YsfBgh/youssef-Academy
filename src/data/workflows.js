// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Workflows & Simulations
// ═══════════════════════════════════════════════════════════

export const WORKFLOWS = [
  {
    id: 'wf-01',
    title: 'Build a REST API from Scratch (.NET)',
    icon: '⚙️',
    track: 'csharp',
    duration: '45 min',
    description: 'Step-by-step workflow to build a complete REST API with .NET, EF Core, and proper architecture.',
    steps: [
      {
        id: 1,
        title: 'Project Setup',
        icon: '📁',
        color: 'blue',
        details: 'Create a new ASP.NET Core Web API project and configure the folder structure.',
        code: `dotnet new webapi -n MyApi
cd MyApi

# Install packages
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Swashbuckle.AspNetCore

# Folder structure
MyApi/
├── Controllers/
├── Services/
├── Repositories/
├── Models/
├── DTOs/
├── Data/
└── Program.cs`,
        checklist: ['Create project', 'Install EF Core', 'Install Swagger', 'Set up folder structure']
      },
      {
        id: 2,
        title: 'Define Models & DbContext',
        icon: '🗃️',
        color: 'purple',
        details: 'Create entity models and configure DbContext with Fluent API.',
        code: `// Models/Product.cs
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}

// Data/AppDbContext.cs
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> o) : base(o) {}
    public DbSet<Product> Products  { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Product>(e => {
            e.Property(p => p.Name).IsRequired().HasMaxLength(200);
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.HasIndex(p => p.Name).IsUnique();
        });
    }
}`,
        checklist: ['Define Product entity', 'Define Category entity', 'Create AppDbContext', 'Add Fluent API configuration']
      },
      {
        id: 3,
        title: 'Repository & Service Layers',
        icon: '🔧',
        color: 'emerald',
        details: 'Implement the repository pattern and service layer to separate concerns.',
        code: `// Repositories/IProductRepository.cs
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(CancellationToken ct = default);
    Task<Product?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Product> AddAsync(Product p, CancellationToken ct = default);
    Task<bool> UpdateAsync(Product p, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}

// Services/ProductService.cs
public class ProductService : IProductService
{
    private readonly IProductRepository _repo;
    public ProductService(IProductRepository repo) => _repo = repo;

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken ct)
    {
        var product = dto.ToEntity();
        var created = await _repo.AddAsync(product, ct);
        return ProductDto.FromEntity(created);
    }
}`,
        checklist: ['Create IProductRepository', 'Implement ProductRepository with EF', 'Create IProductService', 'Implement ProductService']
      },
      {
        id: 4,
        title: 'DTOs & Validation',
        icon: '📋',
        color: 'amber',
        details: 'Create Data Transfer Objects to avoid exposing entities directly.',
        code: `// DTOs/ProductDto.cs
public record ProductDto(int Id, string Name, decimal Price, string CategoryName);

public record CreateProductDto(
    [Required][MaxLength(200)] string Name,
    [Range(0.01, double.MaxValue)] decimal Price,
    [Required] int CategoryId
);

public record UpdateProductDto(
    [MaxLength(200)] string? Name,
    [Range(0.01, double.MaxValue)] decimal? Price,
    bool? IsActive
);

// Extension for mapping
public static class ProductMappings
{
    public static Product ToEntity(this CreateProductDto dto) => new() {
        Name = dto.Name, Price = dto.Price, CategoryId = dto.CategoryId
    };
    public static ProductDto ToDto(this Product p) => new(
        p.Id, p.Name, p.Price, p.Category?.Name ?? ""
    );
}`,
        checklist: ['Create ProductDto', 'Create CreateProductDto with validation', 'Create UpdateProductDto', 'Add mapping methods']
      },
      {
        id: 5,
        title: 'Controller',
        icon: '🎮',
        color: 'cyan',
        details: 'Build the API controller with proper status codes and error handling.',
        code: `[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _svc;
    public ProductsController(IProductService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _svc.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var product = await _svc.GetByIdAsync(id, ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateProductDto dto, CancellationToken ct)
    {
        var product = await _svc.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _svc.DeleteAsync(id, ct) ? NoContent() : NotFound();
}`,
        checklist: ['Create controller with [ApiController]', 'GET /products endpoint', 'GET /products/{id} endpoint', 'POST /products endpoint', 'DELETE endpoint']
      },
      {
        id: 6,
        title: 'Register Services & Run Migrations',
        icon: '🚀',
        color: 'rose',
        details: 'Wire up DI container and create the database schema.',
        code: `// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();
app.Run();

// Terminal: Create & apply migration
dotnet ef migrations add InitialCreate
dotnet ef database update

// Test with Swagger at: https://localhost:5001/swagger`,
        checklist: ['Register DbContext', 'Register repositories & services', 'Configure Swagger', 'Run migrations', 'Test with Swagger UI']
      }
    ]
  },
  {
    id: 'wf-02',
    title: 'React Authentication Flow',
    icon: '🔐',
    track: 'react',
    duration: '30 min',
    description: 'Implement a complete JWT authentication flow in React with protected routes.',
    steps: [
      {
        id: 1,
        title: 'Auth Context Setup',
        icon: '🏗️',
        color: 'blue',
        details: 'Create AuthContext with login, logout, and user state.',
        code: `// context/AuthContext.jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(sessionStorage.getItem('user'))
  );

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    api.defaults.headers.common['Authorization'] =
      \`Bearer \${res.data.accessToken}\`;
    setUser(res.data.user);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};`,
        checklist: ['Create AuthContext', 'Implement login function', 'Implement logout function', 'Set axios Authorization header']
      },
      {
        id: 2,
        title: 'Login Form Component',
        icon: '📝',
        color: 'violet',
        details: 'Build a controlled login form with validation.',
        code: `// pages/Login.jsx
function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email" required
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        placeholder="Email"
      />
      <input
        type="password" required
        value={form.password}
        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}`,
        checklist: ['Controlled form inputs', 'Error state', 'Loading state', 'Redirect on success']
      },
      {
        id: 3,
        title: 'Protected Route Component',
        icon: '🛡️',
        color: 'emerald',
        details: 'Create a wrapper that redirects unauthenticated users.',
        code: `// components/ProtectedRoute.jsx
function ProtectedRoute({ children, requiredRole }) {
  const { isAuth, user } = useAuth();
  const location = useLocation();

  if (!isAuth) {
    // Save intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage in App.jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="admin" element={
      <ProtectedRoute requiredRole="Admin">
        <AdminPanel />
      </ProtectedRoute>
    } />
  </Route>
</Routes>`,
        checklist: ['Redirect to login if unauthenticated', 'Save redirect location in state', 'Role-based protection', 'Redirect after login to original destination']
      }
    ]
  },
  {
    id: 'wf-03',
    title: 'Git Feature Branch Workflow',
    icon: '🌿',
    track: 'general',
    duration: '15 min',
    description: 'The professional Git workflow used in teams. Never commit directly to main.',
    steps: [
      {
        id: 1,
        title: 'Start a Feature',
        icon: '🌱',
        color: 'emerald',
        details: 'Always start from an up-to-date main branch.',
        code: `# Sync with remote
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/user-authentication

# Or for bugs:
git checkout -b fix/login-validation-error

# Naming conventions:
# feature/   → new features
# fix/        → bug fixes
# hotfix/     → critical production fixes
# refactor/   → code improvements
# chore/      → maintenance`,
        checklist: ['Pull latest main', 'Create branch with clear name', 'Use consistent naming convention']
      },
      {
        id: 2,
        title: 'Commit with Conventional Messages',
        icon: '💾',
        color: 'blue',
        details: 'Use conventional commits format for clear history.',
        code: `# Format: type(scope): short description

# Types: feat, fix, docs, style, refactor, test, chore

# Good commit messages:
git commit -m "feat(auth): add JWT refresh token endpoint"
git commit -m "fix(products): handle null category in GetById"
git commit -m "refactor(cart): extract price calculation to service"
git commit -m "test(auth): add unit tests for login validation"
git commit -m "docs(api): add Swagger descriptions to endpoints"

# Bad commit messages:
git commit -m "fix"           # too vague
git commit -m "WIP"           # never commit WIP to shared branch
git commit -m "asdfghjkl"     # meaningless

# Commit often — small logical units
# Each commit should compile and tests should pass`,
        checklist: ['Use conventional commit format', 'Keep commits small and focused', 'Each commit should pass tests']
      },
      {
        id: 3,
        title: 'Open Pull Request',
        icon: '🔀',
        color: 'violet',
        details: 'Push your branch and open a PR for code review.',
        code: `# Push your branch
git push origin feature/user-authentication

# Before pushing, squash messy commits (optional)
git rebase -i HEAD~3

# Rebase on main to avoid merge conflicts
git fetch origin
git rebase origin/main

# If conflicts:
# 1. Fix conflicts in files
# 2. git add .
# 3. git rebase --continue

# PR Description template:
## What changed?
- Added JWT authentication endpoints
- Added refresh token rotation

## Why?
- Users need persistent sessions

## How to test?
1. POST /auth/login with credentials
2. Verify access token expires in 15 min
3. POST /auth/refresh to get new token

## Checklist
- [x] Tests added
- [x] No breaking changes
- [x] Swagger docs updated`,
        checklist: ['Rebase on latest main before PR', 'Write descriptive PR description', 'Link related issue', 'Request appropriate reviewers']
      },
      {
        id: 4,
        title: 'After Merge — Clean Up',
        icon: '🧹',
        color: 'amber',
        details: 'Delete branch and sync your local repo after merging.',
        code: `# After your PR is merged to main:

# Switch to main and pull
git checkout main
git pull origin main

# Delete local branch
git branch -d feature/user-authentication

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/user-authentication

# See all branches
git branch -a

# Prune stale remote tracking refs
git fetch --prune`,
        checklist: ['Pull merged main', 'Delete local branch', 'Delete remote branch', 'Verify feature works in main']
      }
    ]
  },
  {
    id: 'wf-04',
    title: 'Next.js App Router — Full Stack Feature',
    icon: '▲',
    track: 'nextjs',
    duration: '35 min',
    description: 'Build a complete feature using Next.js App Router with Server Components, Server Actions, and Client interactivity.',
    steps: [
      {
        id: 1,
        title: 'Server Component — Data Fetching',
        icon: '🖥️',
        color: 'violet',
        details: 'Fetch data server-side for instant first paint.',
        code: `// app/products/page.tsx
import { Suspense } from 'react';
import ProductGrid from './ProductGrid';
import ProductSkeleton from './ProductSkeleton';

export const metadata = {
  title: 'Products',
  description: 'Browse all products'
};

export default function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; page?: string }
}) {
  return (
    <main>
      <h1>Products</h1>
      <Suspense
        key={searchParams.category}
        fallback={<ProductSkeleton count={12} />}
      >
        <ProductGrid
          category={searchParams.category}
          page={Number(searchParams.page) || 1}
        />
      </Suspense>
    </main>
  );
}`,
        checklist: ['Create page.tsx', 'Add metadata export', 'Wrap data-fetching in Suspense', 'Read searchParams for filtering']
      },
      {
        id: 2,
        title: 'Async Server Component',
        icon: '⚡',
        color: 'blue',
        details: 'Fetch data directly in an async component.',
        code: `// app/products/ProductGrid.tsx
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from './AddToCartButton';  // client component

interface Props {
  category?: string;
  page: number;
}

const PAGE_SIZE = 12;

export default async function ProductGrid({ category, page }: Props) {
  // Direct DB access — no API call needed!
  const [products, total] = await Promise.all([
    db.product.findMany({
      where: category ? { category: { slug: category } } : {},
      include: { category: true },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: { createdAt: 'desc' }
    }),
    db.product.count({
      where: category ? { category: { slug: category } } : {}
    })
  ]);

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {products.map(product => (
          <article key={product.id}>
            <ProductCard product={product} />
            <AddToCartButton productId={product.id} />  {/* client */}
          </article>
        ))}
      </div>
      <Pagination current={page} total={total} pageSize={PAGE_SIZE} />
    </>
  );
}`,
        checklist: ['Mark as async', 'Query DB directly', 'Pass only needed data to client components', 'Implement pagination']
      },
      {
        id: 3,
        title: 'Server Action — Form Submit',
        icon: '📤',
        color: 'emerald',
        details: 'Handle form submission server-side with Server Actions.',
        code: `// app/products/[id]/ReviewForm.tsx
'use client';
import { addReview } from './actions';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Review'}
    </button>
  );
}

export default function ReviewForm({ productId }: { productId: string }) {
  const [state, formAction] = useFormState(addReview, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <textarea name="content" required minLength={10} />
      <select name="rating">
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
      </select>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

// app/products/[id]/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function addReview(prevState: any, formData: FormData) {
  const productId = formData.get('productId') as string;
  const content   = formData.get('content') as string;
  const rating    = Number(formData.get('rating'));

  if (content.length < 10) return { error: 'Review must be at least 10 characters' };

  await db.review.create({ data: { productId, content, rating } });
  revalidatePath(\`/products/\${productId}\`);
  return { success: true };
}`,
        checklist: ['Create Server Action with "use server"', 'Use useFormState for state', 'useFormStatus for pending state', 'Revalidate path after mutation']
      }
    ]
  }
];

export const SIMULATIONS = [
  {
    id: 'sim-01',
    title: 'Debug a Production Bug',
    icon: '🐛',
    difficulty: 'Intermediate',
    track: 'csharp',
    scenario: 'Your API is returning 500 errors in production. Users cannot place orders. You have 10 minutes.',
    context: `Stack trace from Sentry:
System.NullReferenceException: Object reference not set to an instance
   at OrderService.PlaceOrderAsync(PlaceOrderCommand cmd)
   at OrderController.Create(CreateOrderDto dto)

Request body: { "productId": 999, "quantity": 2 }
Database query log: SELECT * FROM Products WHERE Id = 999 → 0 rows`,
    steps: [
      {
        step: 1,
        prompt: 'What is the most likely root cause of this NullReferenceException?',
        answer: 'The code calls GetByIdAsync(999) which returns null (product doesn\'t exist), but the code doesn\'t check for null before using the result. product.Price * cmd.Quantity → NullReferenceException.',
        hint: 'Look at what GetByIdAsync returns when the product is not found.'
      },
      {
        step: 2,
        prompt: 'Write the null check that should have been in the service method.',
        answer: `var product = await _repo.GetByIdAsync(cmd.ProductId, ct);
if (product is null)
    throw new NotFoundException($"Product {cmd.ProductId} not found");
// OR return Result.Fail("Product not found");`,
        hint: 'Use "is null" pattern matching and throw a domain-specific exception.'
      },
      {
        step: 3,
        prompt: 'What HTTP status code should the controller return for a NotFoundException?',
        answer: '404 Not Found. The controller should catch NotFoundException and return NotFound() or use a global exception handler that maps NotFoundException → 404.',
        hint: 'What status code means "the resource you requested does not exist"?'
      },
      {
        step: 4,
        prompt: 'How would you prevent this class of bug in the future?',
        answer: `1. Always handle null returns from repository methods (check immediately after the call).
2. Use Result<T> pattern instead of returning null — forces caller to handle failure case.
3. Add integration tests for "product not found" scenario.
4. Configure global exception handler to return proper ProblemDetails.`,
        hint: 'Think about both defensive programming and systemic safeguards.'
      }
    ]
  },
  {
    id: 'sim-02',
    title: 'Code Review: Spot the Issues',
    icon: '👁️',
    difficulty: 'Intermediate',
    track: 'refactoring',
    scenario: 'You are reviewing a PR from a junior developer. Find all the issues in this code.',
    context: `// ProductController.cs — submitted for review
[HttpGet]
public IActionResult GetProducts(string category)
{
    var products = _db.Products.ToList()
        .Where(p => p.Category == category)
        .Select(p => new { p.Id, p.Name, p.Price, p.Secret_Internal_Cost })
        .ToList();

    if (products.Count == 0)
        return Ok(new List<object>());

    return Ok(products);
}

[HttpPost]
public IActionResult CreateProduct(string name, decimal price)
{
    var product = new Product { Name = name, Price = price };
    _db.Products.Add(product);
    _db.SaveChanges();
    return Ok("Created");
}`,
    steps: [
      {
        step: 1,
        prompt: 'Find the N+1 / performance issue in GetProducts.',
        answer: '.ToList() is called BEFORE .Where() — this loads ALL products from the database into memory, then filters in C#. Fix: move .Where() before .ToList(), and ideally use async: .Where(p => p.Category == category).ToListAsync(ct)',
        hint: 'Look at what happens at the database level when you call .ToList() first.'
      },
      {
        step: 2,
        prompt: 'Find the security issue in GetProducts.',
        answer: 'p.Secret_Internal_Cost is included in the response. Sensitive data should NEVER be returned to the client. Use a DTO that only exposes public fields.',
        hint: 'What field should not be visible to API consumers?'
      },
      {
        step: 3,
        prompt: 'Find the issues in CreateProduct.',
        answer: `1. Should be async (SaveChangesAsync not SaveChanges)
2. Returns 200 OK on creation — should return 201 Created with Location header
3. No input validation (empty name? negative price?)
4. Parameters should come from a DTO: CreateProductDto not individual params
5. Returns plain string "Created" — should return the created resource`,
        hint: 'Check: async, correct status code, validation, return type, parameter binding.'
      }
    ]
  },
  {
    id: 'sim-03',
    title: 'System Design: Design a Notification Service',
    icon: '🏗️',
    difficulty: 'Advanced',
    track: 'oop',
    scenario: 'Your manager asks you to design a notification service that can send email, SMS, and push notifications. It must be extensible (new channels added easily) and reliable.',
    context: `Requirements:
- Send notifications via Email, SMS, Push
- New channels should be addable without modifying existing code
- Each notification has: type, recipient, subject, body
- Some notifications are high-priority (try again on failure)
- Track delivery status`,
    steps: [
      {
        step: 1,
        prompt: 'Which SOLID principle is key to making this extensible? How would you apply it?',
        answer: `Open/Closed Principle (OCP):
- Define INotificationChannel interface with SendAsync(notification)
- Each channel (Email, SMS, Push) implements it
- NotificationService receives IEnumerable<INotificationChannel>
- Adding a new channel = new class, zero modifications to existing code`,
        hint: 'Which principle says "open for extension, closed for modification"?'
      },
      {
        step: 2,
        prompt: 'What design pattern handles retry/reliability best here?',
        answer: `Decorator pattern + Retry policy:
- Create RetryingNotificationChannel that wraps any INotificationChannel
- It retries on failure with exponential backoff
- Can also use Polly library in .NET for resilience policies:
  Policy.Handle<Exception>().WaitAndRetryAsync(3, i => TimeSpan.FromSeconds(Math.Pow(2, i)))`,
        hint: 'Think about wrapping existing behavior without modifying it.'
      },
      {
        step: 3,
        prompt: 'Sketch the class diagram (describe the interfaces and main classes).',
        answer: `INotificationChannel { SendAsync(notification); string ChannelName; }
EmailChannel : INotificationChannel
SmsChannel : INotificationChannel
PushChannel : INotificationChannel
RetryingChannel : INotificationChannel (wraps another channel — Decorator)

NotificationService {
  + SendAsync(NotificationRequest req)
  - IEnumerable<INotificationChannel> _channels
}

NotificationRequest { string Type; string Recipient; string Subject; string Body; Priority priority; }
DeliveryLog { int Id; string ChannelName; bool Success; DateTime SentAt; }`,
        hint: 'Think in terms of interfaces and decorators.'
      }
    ]
  }
];

export const getWorkflowById = (id) => WORKFLOWS.find(w => w.id === id);
export const getSimulationById = (id) => SIMULATIONS.find(s => s.id === id);
