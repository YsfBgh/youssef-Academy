// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Project Lab Data
//  Portfolio projects with milestones and completion tracking
// ═══════════════════════════════════════════════════════════

export const PROJECTS = [
  {
    id: 'proj-001',
    title: '.NET REST API — Task Manager',
    subtitle: 'Build a production-ready CRUD API with auth and EF Core',
    icon: '🔌',
    difficulty: 'Beginner',
    estimatedHours: 12,
    techStack: ['C# .NET 8', 'ASP.NET Core', 'EF Core', 'SQL Server', 'Swagger'],
    xpReward: 500,
    color: 'blue',
    gradient: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-500/20 text-blue-300',
    border: 'border-blue-500/40',
    description: `Build a complete REST API for a task management system. This project covers the essential skills every .NET developer needs: controllers, EF Core, migrations, validation, and Swagger documentation.`,
    milestones: [
      {
        id: 'pm-001-1',
        title: 'Project Setup & Database',
        description: 'Create the .NET 8 project, configure EF Core, and set up the SQL Server database with migrations.',
        tasks: [
          'Create new ASP.NET Core Web API project',
          'Install EF Core, SQL Server provider packages',
          'Create Task and User entity models',
          'Configure DbContext and connection string',
          'Run initial migration and create the database',
        ],
        codeHint: `// Task.cs entity
public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}`,
        xpReward: 80,
      },
      {
        id: 'pm-001-2',
        title: 'CRUD Endpoints',
        description: 'Implement full Create, Read, Update, Delete for tasks with proper HTTP status codes.',
        tasks: [
          'GET /api/tasks — list all tasks (with pagination)',
          'GET /api/tasks/{id} — get single task',
          'POST /api/tasks — create task (with validation)',
          'PUT /api/tasks/{id} — full update',
          'PATCH /api/tasks/{id}/complete — mark complete',
          'DELETE /api/tasks/{id} — delete task',
        ],
        codeHint: `[HttpPost]
public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskRequest request)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var task = new TaskItem
    {
        Title = request.Title,
        Description = request.Description,
        UserId = GetCurrentUserId()
    };
    _db.Tasks.Add(task);
    await _db.SaveChangesAsync();
    return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task.ToDto());
}`,
        xpReward: 120,
      },
      {
        id: 'pm-001-3',
        title: 'Authentication with JWT',
        description: 'Add user registration, login, and JWT bearer token authentication.',
        tasks: [
          'Install Microsoft.AspNetCore.Authentication.JwtBearer',
          'Create AuthController with /register and /login endpoints',
          'Generate JWT tokens with claims (userId, email)',
          'Add [Authorize] attribute to protected endpoints',
          'Configure JWT validation in Program.cs',
        ],
        codeHint: `// Generate JWT
var token = new JwtSecurityToken(
    issuer: _config["Jwt:Issuer"],
    audience: _config["Jwt:Audience"],
    claims: new[] {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email)
    },
    expires: DateTime.UtcNow.AddDays(7),
    signingCredentials: new SigningCredentials(
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)),
        SecurityAlgorithms.HmacSha256)
);`,
        xpReward: 150,
      },
      {
        id: 'pm-001-4',
        title: 'Testing & Swagger',
        description: 'Add Swagger UI, write unit tests, and document your API.',
        tasks: [
          'Configure Swagger with JWT bearer support',
          'Write xUnit tests for TaskService',
          'Add FluentValidation for request models',
          'Test all endpoints in Swagger UI',
          'Write README with setup instructions',
        ],
        codeHint: `// xUnit test
public class TaskServiceTests
{
    [Fact]
    public async Task CreateTask_ValidRequest_ReturnsCreatedTask()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TestDb")
            .Options;
        using var db = new AppDbContext(options);
        var service = new TaskService(db);

        var result = await service.CreateTaskAsync(new CreateTaskRequest
        {
            Title = "Test task",
            UserId = 1
        });

        Assert.Equal("Test task", result.Title);
        Assert.False(result.IsCompleted);
    }
}`,
        xpReward: 150,
      },
    ],
  },
  {
    id: 'proj-002',
    title: 'Auth System — Identity + OAuth',
    subtitle: 'Full authentication: registration, login, refresh tokens, Google OAuth',
    icon: '🔐',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    techStack: ['C# .NET 8', 'ASP.NET Identity', 'JWT', 'OAuth 2.0', 'Redis', 'PostgreSQL'],
    xpReward: 700,
    color: 'rose',
    gradient: 'from-rose-600 to-rose-800',
    badge: 'bg-rose-500/20 text-rose-300',
    border: 'border-rose-500/40',
    description: `Build a complete authentication system with ASP.NET Core Identity, JWT access tokens, refresh tokens stored in Redis, and Google OAuth. This is the auth foundation used in real enterprise apps.`,
    milestones: [
      {
        id: 'pm-002-1',
        title: 'ASP.NET Identity Setup',
        description: 'Configure Identity with custom ApplicationUser, roles, and PostgreSQL.',
        tasks: [
          'Install AspNetCore.Identity and Npgsql.EntityFrameworkCore',
          'Create ApplicationUser extending IdentityUser',
          'Configure IdentityDbContext with PostgreSQL',
          'Run Identity migrations',
          'Create seed data for Admin role',
        ],
        codeHint: `public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? ProfilePictureUrl { get; set; }
}`,
        xpReward: 100,
      },
      {
        id: 'pm-002-2',
        title: 'JWT + Refresh Tokens',
        description: 'Implement short-lived access tokens (15min) with refresh tokens (7 days) stored in Redis.',
        tasks: [
          'Create TokenService: GenerateAccessToken, GenerateRefreshToken',
          'Store refresh tokens in Redis with TTL',
          'Implement POST /auth/refresh endpoint',
          'Add token revocation (logout = delete refresh token)',
          'Handle token rotation on each refresh',
        ],
        codeHint: `// Refresh token rotation
public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
{
    var userId = await _cache.GetStringAsync($"refresh:{refreshToken}");
    if (userId == null) throw new UnauthorizedException("Invalid refresh token");

    // Revoke old token (rotation)
    await _cache.RemoveAsync($"refresh:{refreshToken}");

    var user = await _userManager.FindByIdAsync(userId);
    return await GenerateAuthResponseAsync(user!);
}`,
        xpReward: 200,
      },
      {
        id: 'pm-002-3',
        title: 'Google OAuth Integration',
        description: 'Add "Sign in with Google" using OAuth 2.0 authorization code flow.',
        tasks: [
          'Register app in Google Cloud Console',
          'Install Google.Apis.Auth package',
          'Create GET /auth/google and GET /auth/google/callback endpoints',
          'Validate Google ID token and create/find local user',
          'Return JWT tokens after successful OAuth flow',
        ],
        codeHint: `[HttpPost("google")]
public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] string idToken)
{
    var payload = await GoogleJsonWebSignature.ValidateAsync(idToken,
        new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _config["Google:ClientId"] }
        });

    var user = await _userManager.FindByEmailAsync(payload.Email)
        ?? await CreateUserFromGoogleAsync(payload);

    return await _tokenService.GenerateAuthResponseAsync(user);
}`,
        xpReward: 200,
      },
      {
        id: 'pm-002-4',
        title: 'Role-Based Access Control',
        description: 'Implement RBAC with Admin, Manager, and User roles.',
        tasks: [
          'Assign roles during registration (default: User)',
          'Create admin-only endpoints with [Authorize(Roles = "Admin")]',
          'Add role claims to JWT token',
          'Create POST /admin/users/{id}/roles endpoint',
          'Test all role scenarios',
        ],
        codeHint: `[Authorize(Roles = "Admin")]
[HttpPost("users/{userId}/roles")]
public async Task<IActionResult> AssignRole(string userId, [FromBody] string roleName)
{
    var user = await _userManager.FindByIdAsync(userId)
        ?? throw new NotFoundException();

    if (!await _roleManager.RoleExistsAsync(roleName))
        return BadRequest("Role does not exist");

    await _userManager.AddToRoleAsync(user, roleName);
    return NoContent();
}`,
        xpReward: 200,
      },
    ],
  },
  {
    id: 'proj-003',
    title: 'React Dashboard — Analytics UI',
    subtitle: 'Build a rich data dashboard with charts, filters, and real-time updates',
    icon: '📊',
    difficulty: 'Intermediate',
    estimatedHours: 14,
    techStack: ['React 18', 'Recharts', 'TanStack Query', 'Tailwind CSS', 'Vite'],
    xpReward: 600,
    color: 'emerald',
    gradient: 'from-emerald-600 to-emerald-800',
    badge: 'bg-emerald-500/20 text-emerald-300',
    border: 'border-emerald-500/40',
    description: `Build a beautiful analytics dashboard in React with live charts, filter controls, and real-time polling. This project covers React Query, Recharts, and professional UI patterns.`,
    milestones: [
      {
        id: 'pm-003-1',
        title: 'Project Setup & Layout',
        description: 'Set up Vite, Tailwind, React Router, and the dashboard shell.',
        tasks: [
          'Create Vite + React project with Tailwind CSS',
          'Set up React Router with dashboard layout',
          'Build responsive sidebar navigation',
          'Create header with user menu',
          'Add theme (dark mode by default)',
        ],
        codeHint: `// Dashboard Layout
export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}`,
        xpReward: 80,
      },
      {
        id: 'pm-003-2',
        title: 'Charts & Data Visualization',
        description: 'Build 4 chart types: line chart for trends, bar chart for comparisons, pie chart for distribution, area chart for cumulative data.',
        tasks: [
          'Install Recharts',
          'Build LineChart for DAU over time',
          'Build BarChart for revenue by month',
          'Build PieChart for user plan distribution',
          'Build AreaChart for cumulative signups',
          'Add responsive containers and tooltips',
        ],
        codeHint: `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DAUChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
        <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}`,
        xpReward: 180,
      },
      {
        id: 'pm-003-3',
        title: 'TanStack Query & Data Fetching',
        description: 'Replace manual fetch calls with React Query for caching, refetching, and loading states.',
        tasks: [
          'Install @tanstack/react-query',
          'Set up QueryClient in main.jsx',
          'Convert all data fetches to useQuery hooks',
          'Add refetchInterval for real-time polling',
          'Handle loading and error states',
          'Add optimistic updates for mutations',
        ],
        codeHint: `// DAU data hook
export function useDAU(days = 30) {
  return useQuery({
    queryKey: ['dau', days],
    queryFn: () => fetch(\`/api/analytics/dau?days=\${days}\`).then(r => r.json()),
    refetchInterval: 60_000, // refetch every 60s
    staleTime: 30_000,
  });
}

// In component
const { data, isLoading, error } = useDAU(30);
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;`,
        xpReward: 180,
      },
      {
        id: 'pm-003-4',
        title: 'Filters & Date Range Picker',
        description: 'Add interactive filters: date range, metric selector, and comparison period.',
        tasks: [
          'Build DateRangePicker component',
          'Add time range presets: 7d, 30d, 90d, custom',
          'Wire filters to query params',
          'Add chart comparison (current vs previous period)',
          'Add CSV export button',
        ],
        codeHint: `const [range, setRange] = useState({ days: 30 });

const presets = [
  { label: '7 days',  days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

return (
  <div className="flex gap-2">
    {presets.map(p => (
      <button key={p.days}
        onClick={() => setRange({ days: p.days })}
        className={range.days === p.days ? 'btn-primary' : 'btn-secondary'}>
        {p.label}
      </button>
    ))}
  </div>
);`,
        xpReward: 160,
      },
    ],
  },
  {
    id: 'proj-004',
    title: 'Next.js SaaS Starter',
    subtitle: 'Full-stack SaaS app with Next.js App Router, Prisma, and Stripe',
    icon: '▲',
    difficulty: 'Advanced',
    estimatedHours: 24,
    techStack: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    xpReward: 1000,
    color: 'violet',
    gradient: 'from-violet-600 to-violet-800',
    badge: 'bg-violet-500/20 text-violet-300',
    border: 'border-violet-500/40',
    description: `Build a production-ready SaaS starter with Next.js App Router, server components, Prisma ORM, authentication, and Stripe payments. The kind of project that gets you hired.`,
    milestones: [
      {
        id: 'pm-004-1',
        title: 'Next.js App Router Setup',
        description: 'Set up the project with TypeScript, App Router, and the layout hierarchy.',
        tasks: [
          'Create Next.js 14 project with TypeScript and Tailwind',
          'Set up app/ directory structure',
          'Create root layout, marketing layout, and dashboard layout',
          'Build landing page with hero section',
          'Configure next.config.js for optimization',
        ],
        codeHint: `// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
        xpReward: 120,
      },
      {
        id: 'pm-004-2',
        title: 'Auth with NextAuth.js',
        description: 'Add email/password and GitHub OAuth authentication with NextAuth.js.',
        tasks: [
          'Install next-auth v5 (Auth.js)',
          'Configure GitHub and Credentials providers',
          'Create auth.ts with Prisma adapter',
          'Protect dashboard routes with middleware',
          'Add login/register pages with server actions',
        ],
        codeHint: `// auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async ({ email, password }) => {
        const user = await prisma.user.findUnique({ where: { email: String(email) } });
        if (!user || !bcrypt.compareSync(String(password), user.password!)) return null;
        return user;
      }
    })
  ],
});`,
        xpReward: 250,
      },
      {
        id: 'pm-004-3',
        title: 'Stripe Subscriptions',
        description: 'Integrate Stripe for monthly/annual subscription plans with webhooks.',
        tasks: [
          'Create products and prices in Stripe dashboard',
          'Build pricing page with plan comparison',
          'Implement checkout session creation',
          'Handle Stripe webhooks (subscription created, cancelled)',
          'Build billing management page',
        ],
        codeHint: `// Create checkout session (server action)
export async function createCheckoutSession(priceId: string) {
  const session = await auth();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session?.user?.email!,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: \`\${process.env.NEXT_PUBLIC_URL}/dashboard?success=1\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_URL}/pricing\`,
  });

  redirect(checkoutSession.url!);
}`,
        xpReward: 350,
      },
      {
        id: 'pm-004-4',
        title: 'Dashboard & Deployment',
        description: 'Build the user dashboard, admin panel, and deploy to Vercel.',
        tasks: [
          'Build user dashboard with usage stats',
          'Create admin panel (user list, revenue metrics)',
          'Add email notifications with Resend',
          'Configure environment variables',
          'Deploy to Vercel with Neon PostgreSQL',
        ],
        codeHint: `// Dashboard server component
export default async function Dashboard() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: { subscription: true }
  });

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <PlanBadge plan={user?.subscription?.plan} />
      <UsageStats userId={user?.id} />
    </div>
  );
}`,
        xpReward: 280,
      },
    ],
  },
  {
    id: 'proj-005',
    title: 'Dockerized Full-Stack App',
    subtitle: 'Containerize a .NET API + React frontend + SQL Server with Docker Compose',
    icon: '🐳',
    difficulty: 'Intermediate',
    estimatedHours: 10,
    techStack: ['Docker', 'Docker Compose', 'ASP.NET Core', 'React', 'SQL Server', 'Nginx'],
    xpReward: 600,
    color: 'cyan',
    gradient: 'from-cyan-600 to-cyan-800',
    badge: 'bg-cyan-500/20 text-cyan-300',
    border: 'border-cyan-500/40',
    description: `Take an existing full-stack app and fully containerize it using Docker and Docker Compose. Learn multi-stage builds, networking, volumes, and how production containers are structured.`,
    milestones: [
      {
        id: 'pm-005-1',
        title: 'Dockerfile for .NET API',
        description: 'Write a multi-stage Dockerfile for the ASP.NET Core API.',
        tasks: [
          'Create multi-stage Dockerfile (build + runtime stages)',
          'Use mcr.microsoft.com/dotnet/sdk for build stage',
          'Use mcr.microsoft.com/dotnet/aspnet for runtime',
          'Copy only the publish output to runtime image',
          'Test: docker build -t my-api . && docker run -p 5000:80 my-api',
        ],
        codeHint: `# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyApi.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "MyApi.dll"]`,
        xpReward: 150,
      },
      {
        id: 'pm-005-2',
        title: 'Dockerfile for React Frontend',
        description: 'Build the React app and serve it with Nginx.',
        tasks: [
          'Create multi-stage Dockerfile for React (node build + nginx serve)',
          'Create nginx.conf for SPA routing (try_files)',
          'Build production bundle with npm run build',
          'Serve static files from /usr/share/nginx/html',
          'Test locally',
        ],
        codeHint: `# Stage 1: Build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80`,
        xpReward: 120,
      },
      {
        id: 'pm-005-3',
        title: 'Docker Compose Orchestration',
        description: 'Wire up all services with Docker Compose: API, frontend, database, and Nginx reverse proxy.',
        tasks: [
          'Create docker-compose.yml with 4 services',
          'Configure service dependencies (healthchecks)',
          'Set up named volumes for SQL Server data',
          'Configure environment variables via .env file',
          'Add Nginx as reverse proxy (proxy_pass to API)',
        ],
        codeHint: `services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "\${DB_PASSWORD}"
      ACCEPT_EULA: "Y"
    volumes:
      - sqldata:/var/opt/mssql
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "\${DB_PASSWORD}" -Q "SELECT 1"
      interval: 10s
      retries: 5
  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy
    environment:
      ConnectionStrings__Default: "Server=db;Database=MyApp;User=sa;Password=\${DB_PASSWORD}"
  frontend:
    build: ./frontend
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on: [api, frontend]

volumes:
  sqldata:`,
        xpReward: 200,
      },
      {
        id: 'pm-005-4',
        title: 'CI/CD Pipeline',
        description: 'Add GitHub Actions workflow to build, test, and push images to Docker Hub.',
        tasks: [
          'Create .github/workflows/ci.yml',
          'Add steps: checkout, build, test, push to Docker Hub',
          'Configure secrets in GitHub repository settings',
          'Add build matrix for PR vs main branch',
          'Test the pipeline on a push',
        ],
        codeHint: `name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push API
        uses: docker/build-push-action@v5
        with:
          context: ./api
          push: \${{ github.ref == 'refs/heads/main' }}
          tags: yourusername/myapi:latest`,
        xpReward: 130,
      },
    ],
  },
];

export function getProjectById(id) {
  return PROJECTS.find(p => p.id === id);
}

export function getMilestoneById(projectId, milestoneId) {
  const project = getProjectById(projectId);
  return project?.milestones.find(m => m.id === milestoneId);
}
