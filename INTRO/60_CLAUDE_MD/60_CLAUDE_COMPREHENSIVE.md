# 60_CLAUDE_COMPREHENSIVE - Claude AI Interaction Guide

**Purpose:** Comprehensive guide for Claude to work effectively on this project
**Status:** Current
**Last Updated:** 2026-01-02

---

## Overview for Claude AI Assistants

This document provides comprehensive guidance for Claude and other AI assistants working on the Cirkelline-Agents project.

---

## Project Context

### What This Project Is
Cirkelline-Agents is a mobile-first agent application built with React Native and Expo. It manages autonomous AI agents that can be coordinated and deployed across distributed systems.

### What Claude Can Do Here
- Read any file in the project
- Analyze code and architecture
- Create new documentation
- Suggest improvements
- Debug issues
- Write tests
- Refactor code

### What Claude Cannot Do
- Edit files in cirkelline-system-DO-NOT-PUSH (reference only)
- Make decisions without user approval
- Commit code without explicit request
- Push to production directly
- Access external resources without explicit URL

---

## Project Structure for Claude

```
cirkelline-agents/
├── agents/          # Agent logic (read/edit)
├── components/      # React components (read/edit)
├── config/         # Configuration (read/edit)
├── docs/           # Documentation (read/edit)
├── INTRO/          # This integration folder (read/edit)
├── scripts/        # Build scripts (read/edit)
├── server/         # Backend code (read/edit)
├── services/       # Service integrations (read/edit)
├── types/          # TypeScript types (read/edit)
└── CLAUDE.md       # Original instructions (read only)
```

---

## Code Quality Standards

### Style Guide
- **Language:** TypeScript (strict mode)
- **Formatting:** Prettier (2-space indents)
- **Linting:** ESLint with standard config
- **Naming:** camelCase for variables/functions, PascalCase for classes/components

### Code Organization
- One concept per file
- Maximum 300 lines per file
- Clear separation of concerns
- Documented complex logic

### Error Handling
```typescript
// Good: Specific error handling
try {
  const agent = await agentService.create(config);
} catch (error) {
  logger.error('Agent creation failed', error);
  throw new ServiceException('AGENT_CREATE_FAILED', error);
}

// Bad: Generic catch-all
try {
  // ...
} catch (e) {
  console.log('error');
}
```

### Testing
- Unit tests for services (80% coverage)
- Integration tests for APIs
- E2E tests for critical flows
- Meaningful test descriptions

---

## Common Tasks for Claude

### Task 1: Understanding Architecture
When asked about the system design:
1. Read `/INTRO/10_ARKITEKTUR/` files
2. Review `/server/` and `/agents/` structure
3. Check `/docs/ARCHITECTURE_V2.md`
4. Look at type definitions in `/types/`

### Task 2: Adding New Features
When implementing new features:
1. Check existing patterns in codebase
2. Create types first (`/types/`)
3. Implement service layer (`/services/`)
4. Create API endpoint (`/server/`)
5. Build UI component (`/components/`)
6. Add tests
7. Update documentation

### Task 3: Fixing Bugs
When debugging:
1. Reproduce issue from error message/logs
2. Search related code (`/server/`, `/agents/`)
3. Check recent CHANGELOG entries
4. Add test to prevent regression
5. Fix the issue
6. Verify fix with tests
7. Document fix in CHANGELOG

### Task 4: Writing Documentation
When creating docs:
1. Follow INTRO section format
2. Include code examples where relevant
3. Add CHANGELOG entry
4. Keep MEDIUM detail level (not too simple, not too deep)
5. Link to related sections

---

## Testing Requirements

### Unit Tests (jest)
```typescript
describe('AgentService', () => {
  it('should create agent with valid config', async () => {
    const service = new AgentService(mockRepository);
    const agent = await service.create({ name: 'Test' });
    expect(agent.name).toBe('Test');
  });
});
```

### Integration Tests
```typescript
describe('POST /agents', () => {
  it('should create agent and save to database', async () => {
    const response = await request(app)
      .post('/api/v1/agents')
      .send({ name: 'Test Agent' });
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

---

## Documentation Standards

### File Header
```typescript
/**
 * AgentService - Manages agent lifecycle and coordination
 *
 * Responsibilities:
 * - Create and initialize agents
 * - Manage agent state
 * - Coordinate multi-agent tasks
 *
 * @module services/AgentService
 */
```

### Inline Comments
```typescript
// GOOD: Explains WHY, not WHAT
// Check if agent is idle before assigning new task
// (prevents state corruption from concurrent modifications)
if (agent.status === 'idle') {
  // ...
}

// BAD: Obvious from code
// increment counter
counter++;
```

---

## Git Workflow (Reference Only)

This project has NO git repository. But if it did:

### Branch Naming
- `feature/agent-coordination` - New feature
- `fix/state-corruption-bug` - Bug fix
- `docs/api-documentation` - Documentation
- `refactor/service-layer` - Refactoring

### Commit Messages
```
feat: add agent coordination system

- Implement multi-agent task scheduling
- Add state synchronization
- Improve error handling

Fixes #123
```

---

## Common Questions

### Q: Can I push to GitHub?
**A:** No. This project is not on GitHub yet. Only read from local filesystem.

### Q: Should I test my changes?
**A:** Always. Write tests alongside implementation.

### Q: How detailed should documentation be?
**A:** MEDIUM detail. Enough to understand, not too verbose.

### Q: Can I install new dependencies?
**A:** Only after discussing with user. Prefer using existing packages.

### Q: What's the code coverage target?
**A:** 80% for services, 75% for controllers, 70% for components.

---

## Emergency Procedures

### If Something Breaks Production
1. Revert last changes
2. Create issue with reproduction steps
3. Document the problem
4. Fix in isolated branch with tests
5. Review before re-deploying

### If Database is Corrupted
1. Stop all services immediately
2. Restore from latest backup
3. Identify what caused corruption
4. Add validation to prevent recurrence
5. Deploy fix and resume

### If Security is Compromised
1. Rotate all secrets immediately
2. Review access logs
3. Create incident report
4. Patch vulnerability
5. Audit security measures

---

## Performance Guidelines

### API Response Targets
- Login: < 100ms
- Agent creation: < 500ms
- Task execution: < 1000ms
- Database query: < 100ms
- Overall API: < 200ms (p95)

### Bundle Size Targets
- Main app bundle: < 2MB
- Per-screen bundle: < 500KB
- External JS: < 1MB

### Memory Targets
- Backend: < 256MB (development)
- Backend: < 512MB (production)
- Mobile app: < 100MB installed

---

## Security Best Practices

### Never
- Commit API keys or secrets
- Expose passwords in logs
- Skip authentication checks
- Trust user input without validation
- Use `eval()` or dynamic code execution

### Always
- Use environment variables for secrets
- Validate and sanitize user input
- Hash passwords with bcrypt
- Use HTTPS in production
- Log security events

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Comprehensive Claude guide created | Kv1nt |
