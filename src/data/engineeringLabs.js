export const CODE_REVIEW_CASES = [
  {
    id: 'review-auth-controller',
    title: 'PR Review: Authentication Controller',
    level: 'Junior to Mid',
    focus: ['Security', 'Validation', 'Testing'],
    summary: 'A developer opened a PR for login. Review it like a senior engineer.',
    code: `public async Task<IActionResult> Login(LoginRequest req)
{
    var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user.Password == req.Password)
    {
        var token = _jwt.Create(user.Id.ToString());
        return Ok(token);
    }
    return BadRequest("Invalid login");
}`,
    findings: [
      'Null reference risk when no user exists.',
      'Plain text password comparison is a critical security issue.',
      'No input validation or rate limiting.',
      'Error response can support account enumeration if changed inconsistently.',
      'No tests for invalid password, missing user, lockout, or token claims.',
    ],
    seniorComment: 'Block this PR until password hashing, null handling, validation, and tests are added. Authentication code is high-risk and should fail closed.',
  },
  {
    id: 'review-react-effect',
    title: 'PR Review: React Data Fetching',
    level: 'Mid',
    focus: ['React', 'Race conditions', 'UX'],
    summary: 'Find the bugs in this component before it ships.',
    code: `function ProductList({ category }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/products?category=' + category)
      .then(r => r.json())
      .then(setItems);
  });

  return items.map(i => <ProductCard product={i} />);
}`,
    findings: [
      'Missing dependency array causes fetch on every render.',
      'No loading or error state.',
      'No request cancellation, so stale responses can overwrite newer state.',
      'Missing key prop in list rendering.',
      'Category should be encoded before being placed in a URL.',
    ],
    seniorComment: 'Add dependencies, loading/error states, AbortController, URL encoding, and stable keys. This PR has correctness and UX issues.',
  },
  {
    id: 'review-ef-query',
    title: 'PR Review: EF Core Query',
    level: 'Senior',
    focus: ['Performance', 'Database', 'API shape'],
    summary: 'Review an endpoint that works locally but may fail in production.',
    code: `var orders = await _db.Orders.ToListAsync();
var result = orders
  .Where(o => o.CustomerId == customerId)
  .Select(o => new OrderDto {
      Id = o.Id,
      Total = o.Items.Sum(i => i.Price)
  });
return Ok(result);`,
    findings: [
      'Loads all orders into memory before filtering.',
      'Potential lazy-loading or N+1 behavior for order items.',
      'No pagination or max result limit.',
      'Money calculation should use decimal and clear currency rules.',
      'Query should project in the database and include only required fields.',
    ],
    seniorComment: 'Move filtering/projection into IQueryable, add pagination, verify indexes, and add performance-focused integration tests.',
  },
];

export const DEBUG_SCENARIOS = [
  {
    id: 'debug-white-page',
    title: 'Debugging Lab: React White Page',
    level: 'Junior',
    symptoms: ['Blank page', 'Console ReferenceError', 'Vite still returns 200'],
    logs: `Uncaught ReferenceError: amount is not defined
    at challenges.js:375:18`,
    investigation: [
      'Open browser console and identify the first app-owned error.',
      'Map the stack trace to the source file and line.',
      'Check whether the failing file is data, component, or dependency code.',
      'Fix the source and rebuild.',
      'Hard refresh to clear stale browser state.',
    ],
    rootCause: 'A displayed code sample used template interpolation syntax inside a JavaScript template string.',
    fix: 'Escape interpolation syntax or use plain string concatenation in displayed samples.',
  },
  {
    id: 'debug-docker-env',
    title: 'Debugging Lab: Docker API Cannot Reach Database',
    level: 'Mid',
    symptoms: ['API starts locally', 'Container logs show connection refused', 'Migrations fail in compose'],
    logs: `Microsoft.Data.SqlClient.SqlException: A network-related or instance-specific error occurred.
Connection string: Server=localhost;Database=AppDb;`,
    investigation: [
      'Check docker-compose service names and networks.',
      'Remember localhost inside the API container means the API container.',
      'Verify SQL container health and exposed ports.',
      'Move secrets and connection strings to environment variables.',
      'Add retry/backoff for startup migrations.',
    ],
    rootCause: 'The API container used localhost instead of the database service name.',
    fix: 'Use Server=db or the compose service name, add health checks, and document local vs container connection strings.',
  },
  {
    id: 'debug-slow-query',
    title: 'Debugging Lab: Slow Orders Endpoint',
    level: 'Senior',
    symptoms: ['Endpoint jumps from 200ms to 12s', 'CPU low', 'Database reads high'],
    logs: `SELECT * FROM Orders
SELECT * FROM OrderItems WHERE OrderId = @p0
SELECT * FROM OrderItems WHERE OrderId = @p1
... repeated 800 times`,
    investigation: [
      'Compare logs before and after the release.',
      'Identify N+1 query pattern.',
      'Check missing Include/projection and indexes.',
      'Measure with realistic production-sized data.',
      'Add regression tests or query-count assertions.',
    ],
    rootCause: 'A DTO mapping change triggered lazy loading for every order.',
    fix: 'Project required fields in one query, add pagination, indexes, and performance tests.',
  },
];

export const ARCHITECTURE_SCENARIOS = [
  {
    id: 'arch-learning-platform',
    title: 'Design a Learning Platform',
    level: 'Mid',
    requirements: [
      'Users take lessons, quizzes, and code challenges.',
      'Progress must survive refresh and later sync to backend.',
      'Admin can add content.',
      'The system should support certificates later.',
    ],
    decisions: [
      'Separate content, progress, quiz attempt, and user profile models.',
      'Use server-side progress APIs when authentication arrives.',
      'Keep content versioned so progress is not broken when lessons change.',
      'Use background jobs for certificate generation later.',
    ],
    risks: [
      'Changing lesson IDs can corrupt progress.',
      'Large content blobs can slow initial load.',
      'Quiz answers must not be exposed if real certification is added.',
    ],
    rubric: ['Clear boundaries', 'Progress model', 'Content versioning', 'Security', 'Future migration path'],
  },
  {
    id: 'arch-ecommerce',
    title: 'Design an E-Commerce API',
    level: 'Senior',
    requirements: [
      'Catalog browsing, cart, checkout, payments, inventory, order history.',
      'Inventory must not oversell.',
      'Payments can fail or be delayed.',
      'Admins need product management.',
    ],
    decisions: [
      'Separate catalog, cart, order, payment, and inventory boundaries.',
      'Use transactions or reservations for stock-sensitive operations.',
      'Use idempotency keys for checkout and payment callbacks.',
      'Use events for order confirmation emails and fulfillment.',
    ],
    risks: [
      'Double charging without idempotency.',
      'Overselling without inventory reservation.',
      'Tight coupling payment provider code into core domain.',
    ],
    rubric: ['Boundaries', 'Data consistency', 'Idempotency', 'Failure handling', 'Operational visibility'],
  },
  {
    id: 'arch-chat',
    title: 'Design a Real-Time Chat System',
    level: 'Senior',
    requirements: [
      'One-to-one and group messages.',
      'Read receipts and typing indicators.',
      'Messages must be persisted.',
      'Mobile clients may reconnect often.',
    ],
    decisions: [
      'Use WebSockets for real-time delivery and REST for history.',
      'Persist messages before acknowledging send.',
      'Use queues or pub/sub for multi-server fanout.',
      'Track delivery/read state separately from message content.',
    ],
    risks: [
      'Message ordering across reconnects.',
      'Fanout bottlenecks in large groups.',
      'Unbounded history queries without pagination.',
    ],
    rubric: ['Realtime transport', 'Persistence', 'Ordering', 'Scale-out', 'Client reconnect strategy'],
  },
];
