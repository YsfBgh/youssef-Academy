// ═══════════════════════════════════════════════════════════
//  JaDev Academy — Enterprise Simulator Data
//  Fake company missions: tickets, bugs, PRs, incidents, deploys
// ═══════════════════════════════════════════════════════════

export const COMPANY = {
  name: 'NexaCore Solutions',
  description: 'A mid-size SaaS company building a B2B project management platform',
  team: [
    { name: 'Sofia Chen',    role: 'Tech Lead',          avatar: '👩‍💼' },
    { name: 'Marcus Webb',   role: 'Senior Backend Dev',  avatar: '👨‍💻' },
    { name: 'Priya Patel',   role: 'Frontend Developer', avatar: '👩‍💻' },
    { name: 'James Torres',  role: 'DevOps Engineer',     avatar: '🧑‍🔧' },
    { name: 'Lena Fischer',  role: 'QA Engineer',        avatar: '👩‍🔬' },
    { name: 'You',           role: 'Junior Developer',   avatar: '🧑‍💻' },
  ],
  currentSprint: 'Sprint 14 — Dashboard v2',
  sprintGoal: 'Complete the Analytics Dashboard feature and fix critical performance regressions',
};

export const MISSIONS = [
  // ─── SPRINT TICKETS ───────────────────────────────────────
  {
    id: 'ent-001',
    type: 'ticket',
    title: 'Implement Pagination for /api/projects Endpoint',
    priority: 'High',
    points: 5,
    xpReward: 150,
    assignee: 'You',
    reporter: 'Sofia Chen',
    description: `The \`GET /api/projects\` endpoint currently returns all projects in one response.
With 50+ active clients, this is causing slow load times (avg 3.2s).

**Acceptance Criteria:**
- Implement cursor-based pagination
- Add \`pageSize\` (default 20, max 100) and \`cursor\` query params
- Return \`nextCursor\` in the response envelope
- Update Swagger docs
- Add unit tests for the pagination logic

**Notes from Sofia:**
"Cursor-based is preferred over offset pagination here — we need stable results
across concurrent inserts. Marcus has the existing controller ready for you."`,
    steps: [
      {
        id: 1,
        instruction: 'Read the existing ProjectsController and understand the current response shape.',
        hint: 'Look at the Controller for the GET endpoint and check what it currently returns. Focus on the return type and the DB query.',
        answer: 'The controller does a simple .ToList() with no pagination. The response is a plain array of ProjectDto objects.',
        points: 25,
      },
      {
        id: 2,
        instruction: 'Design the paginated response envelope with nextCursor and data array.',
        hint: 'Create a generic PagedResult<T> class with List<T> Data, string? NextCursor, int TotalCount.',
        answer: `public class PagedResult<T>
{
    public List<T> Data { get; set; } = new();
    public string? NextCursor { get; set; }
    public int TotalCount { get; set; }
}`,
        points: 30,
      },
      {
        id: 3,
        instruction: 'Update the controller to accept cursor and pageSize query params and apply cursor-based filtering.',
        hint: 'Decode the cursor (base64 of the last project ID), apply .Where(p => p.Id > lastId).Take(pageSize).',
        answer: `[HttpGet]
public async Task<PagedResult<ProjectDto>> GetProjects(
    [FromQuery] string? cursor = null,
    [FromQuery] int pageSize = 20)
{
    pageSize = Math.Clamp(pageSize, 1, 100);
    var lastId = DecodeCursor(cursor);
    var items = await _db.Projects
        .Where(p => lastId == null || p.Id > lastId)
        .OrderBy(p => p.Id)
        .Take(pageSize + 1)
        .Select(p => new ProjectDto { ... })
        .ToListAsync();
    var hasMore = items.Count > pageSize;
    if (hasMore) items.RemoveAt(items.Count - 1);
    return new PagedResult<ProjectDto>
    {
        Data = items,
        NextCursor = hasMore ? EncodeCursor(items.Last().Id) : null,
        TotalCount = await _db.Projects.CountAsync()
    };
}`,
        points: 45,
      },
    ],
    tags: ['backend', '.NET', 'API', 'performance'],
    status: 'open',
  },
  {
    id: 'ent-002',
    type: 'bug',
    title: 'BUG: Dashboard charts not rendering on Safari 16',
    priority: 'Critical',
    points: 3,
    xpReward: 120,
    assignee: 'You',
    reporter: 'Lena Fischer',
    description: `**Environment:** Safari 16.4 on macOS Ventura
**Affected users:** ~12% of our users (Mac users)
**Severity:** P0 — blocks core functionality

**Steps to reproduce:**
1. Open https://app.nexacore.com/dashboard in Safari 16
2. Navigate to the Analytics tab
3. Observe: Charts are blank, console shows \`TypeError: undefined is not an object\`

**Console Error:**
\`\`\`
TypeError: undefined is not an object (evaluating 'ResizeObserver.prototype.observe')
\`\`\`

**Priya's note:** "Looks like our charting library uses ResizeObserver directly.
Safari 16 has a known bug with ResizeObserver in certain iframe contexts."`,
    steps: [
      {
        id: 1,
        instruction: 'Identify the root cause: which library/component is calling ResizeObserver directly?',
        hint: 'Search the codebase for "ResizeObserver". Check Chart.js and any wrapper components.',
        answer: 'The Recharts ResponsiveContainer uses ResizeObserver internally. Our custom ChartWrapper also calls it directly for a resize animation.',
        points: 30,
      },
      {
        id: 2,
        instruction: 'Write a polyfill/guard for the ResizeObserver usage in ChartWrapper.',
        hint: 'Add a conditional check: if (typeof ResizeObserver !== "undefined") before use, or use a try/catch with a fallback to static sizing.',
        answer: `// In ChartWrapper.jsx
const observer = typeof ResizeObserver !== 'undefined'
  ? new ResizeObserver(handleResize)
  : null;

if (observer) {
  observer.observe(containerRef.current);
}

// Cleanup
return () => observer?.disconnect();`,
        points: 40,
      },
      {
        id: 3,
        instruction: 'Add a fallback static width for charts when ResizeObserver is unavailable.',
        hint: 'Use a state variable initialized to a default width (e.g. 600), only update via ResizeObserver if available.',
        answer: `const [width, setWidth] = useState(600);

useEffect(() => {
  if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
  const ro = new ResizeObserver(entries => {
    setWidth(entries[0].contentRect.width);
  });
  ro.observe(containerRef.current);
  return () => ro.disconnect();
}, []);`,
        points: 30,
      },
    ],
    tags: ['frontend', 'react', 'bugfix', 'safari', 'browser-compat'],
    status: 'open',
  },
  {
    id: 'ent-003',
    type: 'pr-review',
    title: 'PR Review: Add Redis Caching to UserService',
    priority: 'Medium',
    points: 3,
    xpReward: 100,
    assignee: 'You',
    reporter: 'Marcus Webb',
    description: `Marcus has submitted PR #247: "feat: add Redis caching layer to UserService".

**PR Description:**
"Adds distributed caching to reduce DB load on the hot path for user lookups.
Cache TTL: 5 minutes. Cache key: \`user:{userId}\`"

**Your task:** Review this PR and identify issues.

Look for:
- Correctness of the cache invalidation strategy
- Thread safety issues
- Missing error handling for Redis failures
- Cache stampede potential
- Key naming conventions`,
    codeSnippet: `// UserService.cs — PR #247
public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IDistributedCache _cache;

    public UserService(AppDbContext db, IDistributedCache cache)
    {
        _db = db;
        _cache = cache;
    }

    public async Task<UserDto?> GetUserAsync(int userId)
    {
        var cacheKey = $"user:{userId}";
        var cached = await _cache.GetStringAsync(cacheKey);

        if (cached != null)
            return JsonSerializer.Deserialize<UserDto>(cached);

        var user = await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => new UserDto { Id = u.Id, Name = u.Name, Email = u.Email })
            .FirstOrDefaultAsync();

        if (user != null)
        {
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(user));
        }

        return user;
    }

    public async Task UpdateUserAsync(int userId, UpdateUserRequest req)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) throw new NotFoundException();

        user.Name = req.Name;
        user.Email = req.Email;
        await _db.SaveChangesAsync();
        // TODO: invalidate cache?
    }
}`,
    steps: [
      {
        id: 1,
        instruction: 'Identify the cache invalidation bug in UpdateUserAsync.',
        hint: 'After updating the user in the DB, the cache still holds the old data. Users will see stale data for up to 5 minutes.',
        answer: 'UpdateUserAsync modifies the DB but never removes or updates the cache entry. Must call _cache.RemoveAsync($"user:{userId}") after SaveChangesAsync().',
        points: 35,
      },
      {
        id: 2,
        instruction: 'Identify the missing cache TTL configuration.',
        hint: 'SetStringAsync without DistributedCacheEntryOptions means the cache entry never expires.',
        answer: 'The SetStringAsync call has no expiry options. Should use: new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) }',
        points: 30,
      },
      {
        id: 3,
        instruction: 'Identify the missing Redis failure handling (circuit breaker pattern).',
        hint: 'If Redis goes down, GetStringAsync throws. The service will crash instead of falling back to the DB.',
        answer: 'Wrap Redis calls in try/catch. If Redis fails, log the error and fall through to the DB query. This is the cache-aside pattern with graceful degradation.',
        points: 35,
      },
    ],
    tags: ['backend', '.NET', 'Redis', 'caching', 'code-review'],
    status: 'open',
  },
  {
    id: 'ent-004',
    type: 'incident',
    title: 'INCIDENT: API Response Times Spiked to 8s (SLA Breach)',
    priority: 'Critical',
    points: 8,
    xpReward: 200,
    assignee: 'You',
    reporter: 'James Torres',
    description: `🚨 **PRODUCTION INCIDENT — P0**

**Alert received:** 14:32 UTC
**Impact:** API p95 latency > 8000ms (SLA is 500ms). ~40% of requests timing out.
**Affected endpoints:** GET /api/projects, GET /api/tasks, POST /api/tasks
**Users affected:** All 2,400 active users

**James (DevOps):** "CPU on app servers is 30%, memory is fine. DB CPU is at 97%!
New deployment went out at 14:15 — 17 minutes before the spike.
I can roll back but Sofia wants us to diagnose first."

**Grafana shows:**
- DB query count: 1,240/sec (normally 85/sec)
- Slow query log: \`SELECT * FROM Tasks WHERE ProjectId = @p0\` — 847ms average
- Missing index warning on Tasks.ProjectId

**Your job: Lead the incident response.`,
    steps: [
      {
        id: 1,
        instruction: 'Write the incident Slack update to the #incidents channel with current status, impact, and hypothesis.',
        hint: 'Good incident updates: time, what is happening, who is affected, current hypothesis, next action.',
        answer: `🔴 [14:35 UTC] INCIDENT ACTIVE — API latency P0
What: API p95 latency 8s+ (SLA: 500ms). ~40% requests timing out.
Who: All 2,400 active users
Hypothesis: DB CPU at 97% following 14:15 deploy. Slow query on Tasks.ProjectId — likely missing index introduced in this deploy.
Action: Investigating migration history. Rollback standing by.
Next update: 14:45 UTC
IC: Youssef B.`,
        points: 25,
      },
      {
        id: 2,
        instruction: 'Identify the root cause from the evidence and write the SQL fix.',
        hint: 'Tasks.ProjectId has no index. The new feature likely added a JOIN or query on this column. CREATE INDEX is the fix.',
        answer: `-- Root cause: Migration in deploy added a new Task query filtering by ProjectId
-- but forgot to add the index (or dropped it accidentally).

-- Hotfix SQL:
CREATE INDEX CONCURRENTLY IX_Tasks_ProjectId
ON Tasks(ProjectId);

-- EF Core migration equivalent:
migrationBuilder.CreateIndex(
    name: "IX_Tasks_ProjectId",
    table: "Tasks",
    column: "ProjectId");`,
        points: 40,
      },
      {
        id: 3,
        instruction: 'Write the post-incident action items to prevent this from happening again.',
        hint: 'Think: detection, prevention, process. Slow query monitoring, migration review checklist, pre-deploy query analysis.',
        answer: `Post-Incident Actions:
1. Add slow query alert (<500ms threshold) to PagerDuty — owner: James
2. Add migration review to PR checklist: "Does this migration add/remove any indexes?" — owner: Sofia
3. Enable automated index advisor in staging DB — owner: James
4. Add load test to CI pipeline for the /api/tasks endpoint — owner: Lena
5. Schedule blameless postmortem for 2026-05-02 — owner: Sofia`,
        points: 35,
      },
    ],
    tags: ['incident', 'database', 'performance', 'on-call', 'SQL'],
    status: 'open',
  },
  {
    id: 'ent-005',
    type: 'ticket',
    title: 'Build the Daily Active Users (DAU) Analytics Endpoint',
    priority: 'Medium',
    points: 5,
    xpReward: 150,
    assignee: 'You',
    reporter: 'Sofia Chen',
    description: `The product team needs a DAU metric endpoint for the analytics dashboard.

**Acceptance Criteria:**
- \`GET /api/analytics/dau?days=30\` — returns DAU for the last N days
- Response: array of \`{ date: string, activeUsers: number }\`
- "Active" = user made at least one API request that day (use existing AuditLog table)
- Cache result for 1 hour (expensive query)
- Add integration test

**AuditLog table:**
- Id (int)
- UserId (int)
- Action (string)
- CreatedAt (datetime)

**Notes:** Sofia wants this to power the chart on the new Analytics Dashboard page.`,
    steps: [
      {
        id: 1,
        instruction: 'Write the LINQ query to calculate DAU from the AuditLog table.',
        hint: 'Group by DATE(CreatedAt), then count distinct UserIds per group. Filter by CreatedAt >= DateTime.UtcNow.AddDays(-days).',
        answer: `var dau = await _db.AuditLogs
    .Where(a => a.CreatedAt >= DateTime.UtcNow.AddDays(-days))
    .GroupBy(a => a.CreatedAt.Date)
    .Select(g => new DauDto
    {
        Date = g.Key.ToString("yyyy-MM-dd"),
        ActiveUsers = g.Select(a => a.UserId).Distinct().Count()
    })
    .OrderBy(d => d.Date)
    .ToListAsync();`,
        points: 40,
      },
      {
        id: 2,
        instruction: 'Add 1-hour caching to the controller action.',
        hint: 'Use IMemoryCache or IDistributedCache. Cache key: dau:{days}. Set AbsoluteExpiration to 1 hour.',
        answer: `var cacheKey = $"dau:{days}";
if (_cache.TryGetValue(cacheKey, out List<DauDto>? cached))
    return Ok(cached);

var result = await _analyticsService.GetDauAsync(days);

_cache.Set(cacheKey, result, TimeSpan.FromHours(1));
return Ok(result);`,
        points: 30,
      },
      {
        id: 3,
        instruction: 'Write an integration test for the DAU endpoint.',
        hint: 'Seed the test DB with AuditLog entries across 3 days, call the endpoint, assert correct counts.',
        answer: `[Fact]
public async Task GetDau_ReturnsCorrectCounts()
{
    // Arrange
    var factory = new WebApplicationFactory<Program>();
    var client = factory.CreateClient();
    // seed: 3 users active on Day1, 1 user on Day2
    await SeedAuditLogs(factory, new[] {
        (UserId: 1, Date: DateTime.UtcNow.AddDays(-2)),
        (UserId: 2, Date: DateTime.UtcNow.AddDays(-2)),
        (UserId: 3, Date: DateTime.UtcNow.AddDays(-2)),
        (UserId: 1, Date: DateTime.UtcNow.AddDays(-1)),
    });

    // Act
    var response = await client.GetAsync("/api/analytics/dau?days=7");
    var data = await response.Content.ReadFromJsonAsync<List<DauDto>>();

    // Assert
    Assert.Equal(3, data.First(d => d.Date == DateTime.UtcNow.AddDays(-2).ToString("yyyy-MM-dd")).ActiveUsers);
    Assert.Equal(1, data.First(d => d.Date == DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd")).ActiveUsers);
}`,
        points: 30,
      },
    ],
    tags: ['backend', '.NET', 'analytics', 'SQL', 'testing'],
    status: 'open',
  },
  {
    id: 'ent-006',
    type: 'deployment',
    title: 'Deploy Sprint 14 to Production',
    priority: 'High',
    points: 5,
    xpReward: 175,
    assignee: 'You',
    reporter: 'James Torres',
    description: `Sprint 14 is complete and has been merged to main. You are on deployment duty.

**Release checklist needs to be completed before deploy:**
- All PR checks green ✅
- QA sign-off from Lena ✅
- Database migrations reviewed ✅
- Rollback plan documented ✅
- Feature flags configured ✅

**Deploy steps:**
1. Tag the release in Git
2. Trigger the CI/CD pipeline
3. Monitor staging environment
4. Run smoke tests
5. Promote to production
6. Post deployment announcement

This is your first solo production deploy. James is on standby if needed.`,
    steps: [
      {
        id: 1,
        instruction: 'Write the Git commands to tag the release as v1.14.0 and push it.',
        hint: 'Use annotated tags (git tag -a) for releases. Include a message. Push tags separately.',
        answer: `git checkout main
git pull origin main

# Create annotated release tag
git tag -a v1.14.0 -m "Sprint 14: Analytics Dashboard v2, pagination fix, Redis caching"

# Push the tag to origin
git push origin v1.14.0

# Verify
git tag -l`,
        points: 25,
      },
      {
        id: 2,
        instruction: 'Write the smoke test commands to verify the deployment was successful.',
        hint: 'Check health endpoint, one GET and one POST endpoint, verify the new DAU endpoint returns data.',
        answer: `# Health check
curl -f https://api.nexacore.com/health || exit 1

# Auth smoke test
TOKEN=$(curl -s -X POST https://api.nexacore.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@nexacore.com","password":"SmokeTest123!"}' | jq -r .token)

# Verify projects endpoint with pagination
curl -f -H "Authorization: Bearer $TOKEN" \
  "https://api.nexacore.com/api/projects?pageSize=5" | jq '.data | length'

# Verify new analytics endpoint
curl -f -H "Authorization: Bearer $TOKEN" \
  "https://api.nexacore.com/api/analytics/dau?days=7" | jq length

echo "✅ Smoke tests passed"`,
        points: 40,
      },
      {
        id: 3,
        instruction: 'Write the deployment announcement for the #releases Slack channel.',
        hint: 'Include version, what changed, any impact on users, and link to release notes.',
        answer: `🚀 *v1.14.0 deployed to production* — Sprint 14: Dashboard v2

*What's new:*
• Analytics Dashboard: Daily Active Users chart
• Projects API: Cursor-based pagination (default 20, max 100)
• Performance: Redis caching on user lookups (5min TTL)
• Bugfix: Safari 16 chart rendering issue resolved

*Impact:* No downtime. All migrations are backward-compatible.
*Rollback:* v1.13.2 image tagged and ready in ECR if needed.

Release notes: https://github.com/nexacore/api/releases/tag/v1.14.0
Dashboard: https://app.nexacore.com

— Youssef B. | Questions? Ping #dev-team`,
        points: 35,
      },
    ],
    tags: ['devops', 'deployment', 'git', 'CI/CD', 'release'],
    status: 'open',
  },
];

export const SPRINT_BOARD = {
  backlog: ['ent-001', 'ent-005'],
  inProgress: ['ent-002', 'ent-003'],
  review: ['ent-006'],
  done: [],
};

export function getMissionById(id) {
  return MISSIONS.find(m => m.id === id);
}

export function getMissionsByType(type) {
  return MISSIONS.filter(m => m.type === type);
}

export const MISSION_TYPE_LABELS = {
  ticket: { label: 'Feature Ticket', icon: '🎫', color: 'blue' },
  bug: { label: 'Bug Report', icon: '🐛', color: 'rose' },
  'pr-review': { label: 'PR Review', icon: '🔍', color: 'violet' },
  incident: { label: 'Production Incident', icon: '🚨', color: 'red' },
  deployment: { label: 'Deployment', icon: '🚀', color: 'emerald' },
};
