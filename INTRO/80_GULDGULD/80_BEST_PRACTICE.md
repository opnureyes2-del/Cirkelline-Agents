# 80_GULDGULD - Best Practices & Golden Standards

**Purpose:** Best practices and golden standards for code quality
**Status:** Current
**Last Updated:** 2026-01-02

---

## Code Quality Standards

### Golden Rules

1. **DRY (Don't Repeat Yourself)**
   - Extract common logic into utilities
   - Create reusable components
   - Share business logic in services

2. **SOLID Principles**
   - **S**ingle Responsibility - One reason to change
   - **O**pen/Closed - Open for extension, closed for modification
   - **L**iskov Substitution - Correct subtype substitution
   - **I**nterface Segregation - Specific client interfaces
   - **D**ependency Inversion - Depend on abstractions

3. **Clear Naming**
   - Use descriptive, searchable names
   - Avoid abbreviations (except common ones)
   - Use pronounceable names
   - Avoid misleading names

4. **Small Functions**
   - Maximum 30 lines per function
   - Do one thing well
   - Easy to test and understand
   - Clear error handling

5. **Comprehensive Testing**
   - Write tests alongside code
   - Test behavior, not implementation
   - Use meaningful test descriptions
   - Achieve 80%+ coverage

---

## TypeScript Best Practices

### Always Use Strict Types
```typescript
// GOOD: Fully typed
function createAgent(
  name: string,
  type: 'processor' | 'analyzer',
  config: AgentConfig
): Promise<Agent> {
  // ...
}

// BAD: Using any
function createAgent(name: any, type: any, config: any): any {
  // ...
}
```

### Use Interfaces for Data Structures
```typescript
// GOOD: Clear interface
interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: 'idle' | 'active' | 'error';
  createdAt: Date;
}

// BAD: Unclear object type
function getAgent(id: string): any {
  // ...
}
```

---

## Performance Best Practices

### Optimize Database Queries
```typescript
// BAD: N+1 query problem
const agents = await Agent.find();
for (const agent of agents) {
  agent.tasks = await Task.find({ agentId: agent.id }); // Query per agent!
}

// GOOD: Single join query
const agents = await Agent.find()
  .leftJoinAndSelect('agent.tasks', 'tasks');
```

### Use Caching
```typescript
// GOOD: Cache frequently accessed data
async function getAgent(id: string): Promise<Agent> {
  const cached = await cache.get(`agent:${id}`);
  if (cached) return cached;

  const agent = await repository.findById(id);
  await cache.set(`agent:${id}`, agent, 3600); // 1 hour
  return agent;
}
```

---

## Security Best Practices

### Input Validation
```typescript
// GOOD: Validate all user input
function validateAgentConfig(config: unknown): AgentConfig {
  if (!config || typeof config !== 'object') {
    throw new ValidationError('Invalid config');
  }

  const { name, type } = config as any;

  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name must be string');
  }

  if (!VALID_AGENT_TYPES.includes(type)) {
    throw new ValidationError('Invalid agent type');
  }

  return { name, type } as AgentConfig;
}
```

### Secret Management
```typescript
// GOOD: Environment variables for secrets
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY must be set');
}

// GOOD: Never log sensitive data
logger.info('Agent created', { id, name }); // Safe

// BAD: Logging sensitive data
logger.info('API call', { apiKey, token }); // Dangerous!
```

---

## Testing Standards

### Unit Test Example
```typescript
describe('AgentService.create', () => {
  let service: AgentService;
  let mockRepository: MockAgentRepository;

  beforeEach(() => {
    mockRepository = new MockAgentRepository();
    service = new AgentService(mockRepository);
  });

  it('should create agent with valid config', async () => {
    const config = { name: 'Test Agent', type: 'processor' };
    const agent = await service.create(config);
    expect(agent.name).toBe('Test Agent');
    expect(agent.id).toBeDefined();
  });
});
```

---

## Code Organization

### Project Structure
- One concept per file
- Maximum 300 lines per file
- Clear separation of concerns
- Documented complex logic

### File Naming
- `camelCase` for files: `agentService.ts`
- `PascalCase` for classes: `AgentService`
- `UPPER_SNAKE_CASE` for constants: `MAX_AGENTS`
- `kebab-case` for components: `agent-card.tsx`

---

## Documentation Standards

### Function Documentation
```typescript
/**
 * Creates a new agent with the provided configuration.
 *
 * @param config - Agent configuration
 * @returns Promise resolving to created agent
 * @throws ValidationError if config is invalid
 */
async function create(config: AgentConfig): Promise<Agent> {
  // ...
}
```

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Best practices documentation updated | Kv1nt |
| 2026-01-01 | 15:29 | Template auto-generated | TEMPLATE_GENERATOR |
