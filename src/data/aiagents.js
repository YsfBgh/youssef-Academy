// ═══════════════════════════════════════════════════════════
//  JaDev Academy — AI Agents Lab Data
// ═══════════════════════════════════════════════════════════

export const AGENT_ROLES = [
  {
    id: 'architect',
    name: 'Architect Agent',
    icon: '🏛️',
    color: 'violet',
    badge: 'bg-violet-500/20 text-violet-300',
    description: 'Plans the overall system design, selects tech stack, defines API contracts and data models.',
    powers: ['System decomposition', 'Tech stack selection', 'API contract design', 'ADR writing'],
  },
  {
    id: 'frontend',
    name: 'Frontend Agent',
    icon: '🎨',
    color: 'emerald',
    badge: 'bg-emerald-500/20 text-emerald-300',
    description: 'Generates React components, writes CSS, builds forms, implements routing and state management.',
    powers: ['Component generation', 'Responsive layouts', 'Form handling', 'State management'],
  },
  {
    id: 'backend',
    name: 'Backend Agent',
    icon: '⚙️',
    color: 'blue',
    badge: 'bg-blue-500/20 text-blue-300',
    description: 'Writes .NET controllers, services, repositories, EF Core migrations, and business logic.',
    powers: ['API scaffolding', 'DB migrations', 'Service layer', 'LINQ queries'],
  },
  {
    id: 'qa',
    name: 'QA Agent',
    icon: '🧪',
    color: 'amber',
    badge: 'bg-amber-500/20 text-amber-300',
    description: 'Generates unit tests, integration tests, identifies edge cases, and writes test scenarios.',
    powers: ['Test generation', 'Edge case analysis', 'Mocking', 'Coverage review'],
  },
  {
    id: 'reviewer',
    name: 'Code Reviewer Agent',
    icon: '🔍',
    color: 'rose',
    badge: 'bg-rose-500/20 text-rose-300',
    description: 'Reviews code for security vulnerabilities, performance issues, and adherence to best practices.',
    powers: ['Security audit', 'Performance review', 'Best practices check', 'Refactoring suggestions'],
  },
  {
    id: 'devops',
    name: 'DevOps Agent',
    icon: '🚢',
    color: 'cyan',
    badge: 'bg-cyan-500/20 text-cyan-300',
    description: 'Writes Dockerfiles, CI/CD pipelines, Helm charts, and deployment scripts.',
    powers: ['Dockerfile generation', 'CI/CD pipelines', 'IaC scripts', 'Monitoring setup'],
  },
];

export const AGENT_LESSONS = [
  {
    id: 'al-01',
    title: 'What Are AI Coding Agents?',
    icon: '🤖',
    duration: '15 min',
    agentRole: null,
    content: `## What Are AI Coding Agents?

AI coding agents are AI models that don't just answer questions — they **take actions**: reading files, running commands, writing code, calling APIs, and iterating on feedback.

### The Shift from Chatbot to Agent

**Chatbot (passive):**
> You: "How do I write a JWT middleware in ASP.NET Core?"
> AI: *explains how*

**Agent (active):**
> You: "Add JWT auth to my API"
> Agent: *reads your codebase → writes middleware → updates Program.cs → writes tests → runs build → fixes errors*

### Core Agent Loop

\`\`\`
Observe → Plan → Act → Observe → Plan → Act → ...
\`\`\`

1. **Observe** — Read context: files, docs, error messages, test results
2. **Plan** — Decide next action based on goal and current state
3. **Act** — Use a tool: write file, run command, call API, search web
4. **Repeat** — Until the goal is achieved or stuck

### Tools Agents Use

- **File tools** — read, write, edit code files
- **Shell tools** — run tests, builds, linters, npm install
- **Search tools** — look up documentation, find examples
- **Browser tools** — navigate web pages, fill forms, take screenshots
- **API tools** — call external services, databases, APIs

### Key Mental Model

Think of an agent as a **very capable intern** that:
- Can read your entire codebase instantly
- Writes code based on your instructions
- Runs the tests to verify
- But needs **clear instructions** and **context** to do it well

Your job: Write better prompts, give better context, review the output critically.`,
    quiz: [
      {
        q: 'What is the main difference between a chatbot and an AI agent?',
        options: ['Agents are smarter', 'Agents take actions with tools; chatbots only respond with text', 'Agents are faster', 'Chatbots can write code; agents cannot'],
        answer: 1,
      },
      {
        q: 'What is the agent loop order?',
        options: ['Plan → Act → Observe', 'Act → Observe → Plan', 'Observe → Plan → Act', 'Plan → Observe → Act'],
        answer: 2,
      },
    ],
  },
  {
    id: 'al-02',
    title: 'Prompt Engineering for Code',
    icon: '✍️',
    duration: '20 min',
    agentRole: null,
    content: `## Prompt Engineering for Code Generation

The quality of AI-generated code depends almost entirely on the quality of your prompt. Here are the principles that separate vague prompts from precise ones.

### The 5 Elements of a Good Code Prompt

1. **Context** — What codebase/project? What tech stack?
2. **Goal** — What should the code do?
3. **Constraints** — What must it NOT do? What patterns to follow?
4. **Examples** — Show an existing similar piece of code
5. **Output format** — How should the response be structured?

### Bad vs Good Prompts

**Bad:**
> "Write a user service"

**Good:**
> "I'm building an ASP.NET Core 8 Web API. Write a UserService class that:
> - Takes IUserRepository and IEmailService as constructor dependencies (DI pattern)
> - Has a RegisterAsync(RegisterRequest) method that validates the email is unique, hashes the password with BCrypt, saves the user, and sends a welcome email
> - Throws a DuplicateEmailException if email exists
> - Returns UserDto (not the User entity)
>
> Follow the existing pattern in OrderService.cs (attached). Use async/await throughout. Do not include any UI code."

### Prompting Patterns

**Role assignment:**
> "You are a senior .NET architect. Review this code for SOLID principle violations..."

**Chain of thought:**
> "Think step by step before writing any code. First explain your approach, then write the implementation."

**Few-shot examples:**
> "Here's how I write controllers in this project: [example]. Now write a similar controller for Products."

**Negative constraints:**
> "Do NOT use static methods. Do NOT use the repository directly from the controller. Do NOT use var for complex types."

### Context is Everything

Agents with context about your project produce 10x better code than those without it.

Always provide:
- Existing similar files as reference
- The data model/entity shapes
- The naming conventions you follow
- Any custom base classes or utilities`,
    quiz: [
      {
        q: 'Which is the most important element of a good code prompt?',
        options: ['Length', 'Context about the project and tech stack', 'Using formal language', 'Asking politely'],
        answer: 1,
      },
      {
        q: 'What does "chain of thought" prompting do?',
        options: ['Makes the AI write faster', 'Forces the AI to explain its approach before coding', 'Links multiple API calls', 'Connects prompts in a loop'],
        answer: 1,
      },
    ],
  },
  {
    id: 'al-03',
    title: 'Multi-Agent Workflows',
    icon: '🔄',
    duration: '25 min',
    agentRole: null,
    content: `## Multi-Agent Workflows

A single agent is powerful. Multiple agents with specialized roles, working together, is transformative.

### Why Multi-Agent?

Any complex task benefits from specialization + review:
- **Architect** designs the system
- **Backend agent** implements the API
- **Frontend agent** builds the UI
- **QA agent** writes and runs tests
- **Reviewer agent** checks for security/quality issues
- **DevOps agent** packages and deploys

### Workflow: Building a Feature

\`\`\`
User: "Add a billing history page to the dashboard"

1. Architect Agent:
   → Plans: new /api/billing/history endpoint + React BillingPage component
   → Defines: BillingRecord DTO, API contract

2. Backend Agent:
   → Reads: existing controllers, DbContext, service pattern
   → Writes: BillingController, BillingService, adds BillingRecord to EF Core

3. Frontend Agent:
   → Reads: existing React pages, component patterns, API client
   → Writes: BillingPage.jsx, useBillingHistory() hook

4. QA Agent:
   → Reads: new controller + service
   → Writes: BillingServiceTests.cs, BillingPage.test.jsx

5. Reviewer Agent:
   → Reviews all new code for security (auth check on endpoint?),
     performance (N+1 query?), best practices

6. DevOps Agent:
   → Checks no new env vars needed, updates docker-compose if needed
\`\`\`

### Orchestrator Pattern

One agent coordinates the others:
\`\`\`
You → Orchestrator Agent
Orchestrator → Architect Agent (plan)
Orchestrator → Backend Agent (implement plan)
Orchestrator → QA Agent (test implementation)
Orchestrator → You (final review)
\`\`\`

### Human-in-the-Loop

Best practice: insert human checkpoints at critical decisions:
- After architecture plan (before any code is written)
- After backend is complete (review before frontend starts)
- After all code (review before running tests/deployment)

This prevents a chain of agents building on a flawed foundation.`,
    quiz: [
      {
        q: 'What is the primary benefit of using multiple specialized agents?',
        options: ['They run in parallel and save time', 'Specialization + review leads to better quality than a single agent', 'They cost less to run', 'They can access more APIs'],
        answer: 1,
      },
      {
        q: 'What is the Orchestrator pattern?',
        options: ['Multiple agents running the same task', 'One agent that coordinates and delegates to specialized agents', 'Agents checking each other\'s work', 'A pipeline of agents in strict sequence'],
        answer: 1,
      },
    ],
  },
  {
    id: 'al-04',
    title: 'AI-Assisted Code Review',
    icon: '🔍',
    duration: '20 min',
    agentRole: 'reviewer',
    content: `## AI-Assisted Code Review

Using AI as a code reviewer amplifies your review quality. You catch more issues, faster, consistently.

### What AI Reviews Excel At

**Security patterns:**
- SQL injection risks
- Missing authentication/authorization checks
- Exposed secrets or PII in logs
- Insecure deserialization

**Performance anti-patterns:**
- N+1 query problems in EF Core
- Synchronous calls in async methods
- Missing indexes (from query patterns)
- Over-fetching data (SELECT *)

**Code quality:**
- Violation of SOLID principles
- Missing null checks
- Inconsistent error handling
- Dead code and unused imports

### Review Prompt Template

\`\`\`
You are a senior .NET developer performing a code review.

Review the following code for:
1. Security issues (injection, auth, exposed data)
2. Performance problems (N+1, blocking calls, memory leaks)
3. SOLID principle violations
4. Missing error handling
5. Naming and readability issues

For each issue:
- Quote the specific line(s)
- Explain WHY it's a problem
- Provide a corrected version

Code to review:
[paste code here]

Context: This is a C# ASP.NET Core controller in a multi-tenant SaaS API.
Each user can only access their own data.
\`\`\`

### What to Watch For in AI Reviews

- AI may flag false positives (review critically)
- May miss domain-specific security requirements
- Good at patterns, weak at business logic correctness
- Use AI review as a first pass, then do your own review

### Combining AI + Human Review

Best workflow:
1. Run automated linter/analyzer (e.g., Roslyn analyzers)
2. AI review (catches patterns humans miss when tired)
3. Human review (catches business logic and context issues)
4. PR discussion + approval`,
    quiz: [
      {
        q: 'What type of issue is AI code review BEST at catching?',
        options: ['Business logic correctness', 'Team communication problems', 'Security patterns and code quality anti-patterns', 'Estimating story points'],
        answer: 2,
      },
      {
        q: 'What is a key limitation of AI code review?',
        options: ['It cannot read code', 'It may miss domain-specific business logic correctness', 'It is too slow', 'It only works with Python'],
        answer: 1,
      },
    ],
  },
];

export const AGENT_SIMULATIONS = [
  {
    id: 'asim-01',
    title: 'Architect Agent: Design a Notification System',
    icon: '🏛️',
    agentRole: 'architect',
    difficulty: 'Intermediate',
    xpReward: 200,
    description: 'Use the Architect Agent to design a notification system. You provide requirements; the agent produces an architecture plan, API contracts, and database schema.',
    scenario: `Your company needs a notification system to support:
- Email, SMS, and push notifications
- Template-based messages with variables
- Scheduled delivery (send at specific time)
- User notification preferences (opt-out per channel)
- Delivery status tracking
- ~500K notifications/day`,
    steps: [
      {
        id: 1,
        agentAction: 'Architect Agent is analyzing requirements...',
        prompt: 'Given these requirements, what are the core services/components I need?',
        agentResponse: `Based on the requirements, here's the component breakdown:

**Core Services:**
1. **NotificationService** — orchestrates sending, checks preferences
2. **TemplateEngine** — renders templates with variable substitution
3. **ChannelAdapters** — Email (SendGrid), SMS (Twilio), Push (FCM)
4. **Scheduler** — queues future notifications (use Hangfire or Quartz.NET)
5. **PreferenceService** — stores and checks user opt-outs

**Infrastructure:**
- **Message Queue** (RabbitMQ or Azure Service Bus) — decouple sending from API
- **Outbox Pattern** — reliable message delivery (no lost notifications on crash)
- **Status tracking table** — DeliveryAttempts with status per channel`,
        yourTask: 'Identify which service is responsible for preventing duplicate notifications.',
        expectedInsight: 'The NotificationService needs an idempotency check using a notification ID (or hash of recipient+template+scheduled time) before enqueuing.',
        points: 50,
      },
      {
        id: 2,
        agentAction: 'Architect Agent is designing the data model...',
        prompt: 'Design the database schema for the notifications system.',
        agentResponse: `\`\`\`sql
-- Core tables
CREATE TABLE NotificationTemplates (
    Id INT PRIMARY KEY,
    Name NVARCHAR(100) UNIQUE,
    Channel NVARCHAR(20), -- Email | SMS | Push
    SubjectTemplate NVARCHAR(500),
    BodyTemplate NVARCHAR(MAX),
    CreatedAt DATETIME2
);

CREATE TABLE NotificationJobs (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TemplateId INT REFERENCES NotificationTemplates,
    RecipientUserId INT,
    Variables NVARCHAR(MAX), -- JSON: {"name":"Alice","amount":"$50"}
    ScheduledAt DATETIME2,
    Status NVARCHAR(20), -- Pending | Queued | Sent | Failed
    CreatedAt DATETIME2
);

CREATE TABLE DeliveryAttempts (
    Id INT PRIMARY KEY,
    JobId UNIQUEIDENTIFIER REFERENCES NotificationJobs,
    Channel NVARCHAR(20),
    AttemptedAt DATETIME2,
    Status NVARCHAR(20), -- Success | Failed | Bounced
    ErrorMessage NVARCHAR(MAX)
);

CREATE TABLE UserNotificationPreferences (
    UserId INT,
    Channel NVARCHAR(20),
    IsEnabled BIT DEFAULT 1,
    PRIMARY KEY (UserId, Channel)
);
\`\`\``,
        yourTask: 'What index should be added to optimize the scheduler query that finds pending jobs due for delivery?',
        expectedInsight: 'CREATE INDEX IX_NotificationJobs_Status_ScheduledAt ON NotificationJobs(Status, ScheduledAt) WHERE Status = \'Pending\'',
        points: 50,
      },
      {
        id: 3,
        agentAction: 'Architect Agent is defining the API contract...',
        prompt: 'Define the REST API endpoints for this system.',
        agentResponse: `**Notification API:**
\`POST /api/notifications\` — Queue a notification
\`GET /api/notifications/{id}\` — Get delivery status
\`GET /api/notifications?userId={id}\` — User notification history
\`DELETE /api/notifications/{id}\` — Cancel pending notification

**Template API:**
\`GET /api/templates\` — List templates
\`POST /api/templates\` — Create template
\`PUT /api/templates/{id}\` — Update template

**Preferences API:**
\`GET /api/users/{id}/notification-preferences\` — Get preferences
\`PUT /api/users/{id}/notification-preferences\` — Update preferences

**Request example:**
\`\`\`json
POST /api/notifications
{
  "templateName": "order-confirmation",
  "recipientUserId": 12345,
  "variables": { "orderNumber": "ORD-001", "total": "$99.99" },
  "scheduledAt": "2026-05-01T09:00:00Z",
  "channels": ["Email", "Push"]
}
\`\`\``,
        yourTask: 'What HTTP status code should the POST endpoint return and what should the response body contain?',
        expectedInsight: '202 Accepted (not 200 OK) because the notification is queued, not yet sent. Response: { "jobId": "uuid", "status": "Queued", "scheduledAt": "..." }',
        points: 50,
      },
    ],
  },
  {
    id: 'asim-02',
    title: 'QA Agent: Write Tests for UserService',
    icon: '🧪',
    agentRole: 'qa',
    difficulty: 'Beginner',
    xpReward: 150,
    description: 'Use the QA Agent to generate unit tests for a UserService. Learn how AI identifies test cases you might miss.',
    scenario: `Here is a UserService.RegisterAsync() method that needs comprehensive unit tests:

\`\`\`csharp
public async Task<UserDto> RegisterAsync(RegisterRequest request)
{
    if (await _repo.EmailExistsAsync(request.Email))
        throw new DuplicateEmailException(request.Email);

    var hashedPassword = _hasher.Hash(request.Password);
    var user = new User
    {
        Email = request.Email.Trim().ToLower(),
        PasswordHash = hashedPassword,
        CreatedAt = DateTime.UtcNow
    };
    await _repo.SaveAsync(user);
    await _emailService.SendWelcomeAsync(user.Email);
    return user.ToDto();
}
\`\`\``,
    steps: [
      {
        id: 1,
        agentAction: 'QA Agent is analyzing the method for test cases...',
        prompt: 'What test cases should I write for this RegisterAsync method?',
        agentResponse: `Here are all the test cases I identified:

**Happy path:**
1. Valid new user → returns UserDto with correct email
2. Email is normalized (trimmed + lowercased) before saving
3. Password is hashed (not stored in plaintext)
4. Welcome email is sent after successful registration

**Error cases:**
5. Duplicate email → throws DuplicateEmailException
6. Email hasher is called exactly once

**Edge cases:**
7. Email with leading/trailing spaces is treated as duplicate of non-spaced version
8. Repository failure → exception propagates (don't swallow errors)
9. Email service failure → what happens? (currently saves user but throws — is this correct?)

That last one (#9) is actually a design bug: if SaveAsync succeeds but SendWelcomeAsync throws, the user is saved but the caller gets an exception. You might want a try/catch or outbox pattern here.`,
        yourTask: 'Write test case #1: valid new user returns UserDto with correct email.',
        expectedInsight: `[Fact]
public async Task RegisterAsync_NewUser_ReturnsUserDto()
{
    _mockRepo.Setup(r => r.EmailExistsAsync("alice@test.com")).ReturnsAsync(false);
    _mockHasher.Setup(h => h.Hash("Password123!")).Returns("hashed");

    var result = await _service.RegisterAsync(new RegisterRequest
    { Email = "alice@test.com", Password = "Password123!" });

    Assert.Equal("alice@test.com", result.Email);
    _mockRepo.Verify(r => r.SaveAsync(It.IsAny<User>()), Times.Once);
}`,
        points: 50,
      },
      {
        id: 2,
        agentAction: 'QA Agent is writing the duplicate email test...',
        prompt: 'Now write test case #5: duplicate email throws DuplicateEmailException.',
        agentResponse: `\`\`\`csharp
[Fact]
public async Task RegisterAsync_DuplicateEmail_ThrowsDuplicateEmailException()
{
    // Arrange
    _mockRepo.Setup(r => r.EmailExistsAsync("existing@test.com"))
             .ReturnsAsync(true);

    // Act & Assert
    await Assert.ThrowsAsync<DuplicateEmailException>(() =>
        _service.RegisterAsync(new RegisterRequest
        {
            Email = "existing@test.com",
            Password = "Password123!"
        })
    );

    // Verify no user was saved
    _mockRepo.Verify(r => r.SaveAsync(It.IsAny<User>()), Times.Never);
    // Verify no welcome email was sent
    _mockEmailService.Verify(e => e.SendWelcomeAsync(It.IsAny<string>()), Times.Never);
}
\`\`\`

Note the two extra Verify calls — they confirm that when we throw early, we didn't accidentally save a user or send an email. This is important.`,
        yourTask: 'Write test case #2: email is trimmed and lowercased before saving.',
        expectedInsight: `[Fact]
public async Task RegisterAsync_EmailIsNormalized_TrimmedAndLowercased()
{
    _mockRepo.Setup(r => r.EmailExistsAsync(It.IsAny<string>())).ReturnsAsync(false);

    await _service.RegisterAsync(new RegisterRequest
    { Email = "  Alice@TEST.COM  ", Password = "pass" });

    _mockRepo.Verify(r => r.SaveAsync(It.Is<User>(u => u.Email == "alice@test.com")), Times.Once);
}`,
        points: 50,
      },
      {
        id: 3,
        agentAction: 'QA Agent is identifying the design issue...',
        prompt: 'How should we handle test case #9: email service failure after successful save?',
        agentResponse: `This is actually a **design issue** worth surfacing in your PR review.

**Current behavior:** If _repo.SaveAsync() succeeds but _emailService.SendWelcomeAsync() throws, the user is persisted in the DB but the caller gets an exception. On retry, they'd get a DuplicateEmailException. The user is stuck.

**Options:**

1. **Try/catch on email send** — log the failure but don't fail registration
   \`\`\`csharp
   try { await _emailService.SendWelcomeAsync(user.Email); }
   catch (Exception ex) { _logger.LogError(ex, "Welcome email failed for {Email}", user.Email); }
   \`\`\`

2. **Outbox pattern** — save "send welcome email" as a record in the DB transaction, then a background job processes it. Guaranteed delivery.

3. **Accept partial failure** — registration succeeds; welcome email is a bonus. Explicitly document this.

**Test to write either way:**
\`\`\`csharp
[Fact]
public async Task RegisterAsync_EmailServiceFails_UserIsStillSaved()
{
    _mockRepo.Setup(r => r.EmailExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
    _mockEmailService.Setup(e => e.SendWelcomeAsync(It.IsAny<string>()))
                     .ThrowsAsync(new SmtpException("SMTP down"));

    // With try/catch approach: should not throw
    var result = await _service.RegisterAsync(new RegisterRequest
    { Email = "new@test.com", Password = "pass" });

    Assert.NotNull(result); // user was registered
    _mockRepo.Verify(r => r.SaveAsync(It.IsAny<User>()), Times.Once);
}
\`\`\``,
        yourTask: 'Based on the QA agent\'s analysis, which approach (try/catch or outbox) would you recommend for this scenario and why?',
        expectedInsight: 'For a welcome email, try/catch with logging is appropriate — a failed welcome email is not critical. Outbox pattern is better for billing notifications, order confirmations, or any email that MUST be delivered.',
        points: 50,
      },
    ],
  },
];

export function getLessonById(id) {
  return AGENT_LESSONS.find(l => l.id === id);
}

export function getSimulationById(id) {
  return AGENT_SIMULATIONS.find(s => s.id === id);
}
