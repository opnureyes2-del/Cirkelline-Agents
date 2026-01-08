# 70_GETTING_STARTED - Quick Start Guide

**Purpose:** Getting started with Cirkelline-Agents development
**Status:** Current
**Last Updated:** 2026-01-02

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 16+ ([https://nodejs.org](https://nodejs.org))
- **npm** 8+ (comes with Node.js)
- **Git** for version control
- **PostgreSQL** 12+ for database
- **VS Code** or preferred editor
- **Expo CLI** for mobile development (optional for backend only)

### Verify Installation
```bash
node --version      # Should be v16+
npm --version       # Should be v8+
psql --version      # Should be 12+
git --version       # Any recent version
```

---

## Initial Setup (15 minutes)

### 1. Clone Repository
```bash
cd /home/rasmus/Desktop/projekts/projects
# Already cloned, just navigate to it
cd cirkelline-agents
```

### 2. Install Dependencies
```bash
npm install
# Wait for installation to complete (~2 minutes)
```

### 3. Setup Environment
```bash
# Copy example environment file
cp .env.example .env.development

# Edit with your local settings
nano .env.development

# Key variables to set:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/cirkelline_agents
# JWT_SECRET=your-dev-secret-here
```

### 4. Setup Database
```bash
# Option A: Using Docker Compose
docker-compose up -d postgres redis

# Option B: Local PostgreSQL
psql -U postgres -d cirkelline_agents -f scripts/init.sql
```

### 5. Start Backend
```bash
npm run dev
# Server should start on http://localhost:7777
```

### 6. Test Connection
```bash
curl http://localhost:7777/health
# Should return: {"status":"ok"}
```

---

## Project Structure Explained

```
cirkelline-agents/
│
├── agents/                 # Agent implementations
│   ├── AgentManager.ts    # Manages agent lifecycle
│   ├── BaseAgent.ts       # Base class for all agents
│   └── strategies/        # Different agent types
│
├── components/            # React Native components
│   ├── AgentCard.tsx      # Agent display component
│   ├── TaskList.tsx       # Task display
│   └── Navigation.ts      # Screen navigation
│
├── config/               # Configuration
│   ├── database.ts       # DB connection setup
│   ├── environment.ts    # Environment variables
│   └── logger.ts         # Logging setup
│
├── server/               # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── controllers/     # Route handlers
│
├── services/            # Business logic
│   ├── AgentService.ts  # Agent business logic
│   ├── TaskService.ts   # Task management
│   └── UserService.ts   # User management
│
├── types/              # TypeScript types
│   ├── index.ts        # Exported types
│   ├── Agent.ts        # Agent interfaces
│   └── Task.ts         # Task interfaces
│
├── docs/               # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── SETUP.md
│
└── INTRO/              # Integration documentation (this folder)
```

---

## Common Development Tasks

### Running Tests
```bash
# Run all tests
npm test

# Run with watch mode (re-run on file change)
npm test -- --watch

# Run with coverage report
npm test -- --coverage
```

### Linting Code
```bash
# Check for linting errors
npm run lint

# Fix automatically fixable errors
npm run lint -- --fix

# Format code with Prettier
npm run format
```

### Building for Production
```bash
# Build backend
npm run build

# Output goes to ./dist/ directory
# Can be deployed to production

# Build mobile for iOS
expo build:ios

# Build mobile for Android
expo build:android
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:down

# Seed database with sample data
npm run db:seed

# Reset database (⚠️ deletes all data!)
npm run db:reset
```

---

## Creating Your First Agent

### Step 1: Define Agent Type
```typescript
// types/Agent.ts
export interface CustomAgent extends Agent {
  type: 'custom';
  behavior: 'processing' | 'analysis' | 'coordination';
}
```

### Step 2: Implement Agent Logic
```typescript
// agents/strategies/CustomAgentStrategy.ts
import { BaseAgent } from '../BaseAgent';

export class CustomAgentStrategy extends BaseAgent {
  async execute(task) {
    // Your agent logic here
    return { result: 'success' };
  }
}
```

### Step 3: Register in Agent Manager
```typescript
// agents/AgentManager.ts
const agentFactory = {
  custom: () => new CustomAgentStrategy()
};
```

### Step 4: Create API Endpoint
```typescript
// server/routes/agents.ts
router.post('/agents', async (req, res) => {
  const agent = await agentService.create(req.body);
  res.status(201).json(agent);
});
```

### Step 5: Test It
```typescript
// test/agent.test.ts
it('should create custom agent', async () => {
  const agent = await agentService.create({
    name: 'Test Agent',
    type: 'custom'
  });
  expect(agent.type).toBe('custom');
});
```

---

## Debugging Tips

### Backend Debugging
```bash
# Run with debug logging
DEBUG=cirkelline:* npm run dev

# Use Node debugger
node --inspect-brk dist/server.js

# Connect to chrome://inspect in browser
```

### Database Debugging
```bash
# Connect to PostgreSQL directly
psql postgresql://postgres:password@localhost:5432/cirkelline_agents

# View tables
\dt

# View specific query
SELECT * FROM agents WHERE id = 'uuid-here';
```

### Mobile Debugging
```bash
# Start Expo with debugging tools
expo start --dev-client

# View device logs
expo logs

# Reset Expo cache
expo start -c
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 7777
lsof -i :7777

# Kill process
kill -9 PID
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost

# Start PostgreSQL
docker-compose up postgres

# Or brew on macOS
brew services start postgresql
```

### npm Modules Not Found
```bash
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Expo Build Issues
```bash
# Clear Expo cache
expo start -c

# Log in to Expo account
expo login

# Check build status
expo build:status
```

---

## Next Steps

1. **Read Architecture Guide:** `INTRO/10_ARKITEKTUR/10_SYSTEM_ARCHITECTURE.md`
2. **Understand Environment Setup:** `INTRO/15_MILJOER/15_MILJOER.md`
3. **Review API Documentation:** `docs/API_DESIGN.md`
4. **Check Active Tasks:** `INTRO/30_TODOS/30_TODOS.md`
5. **Start Contributing:** Pick a task from TODOs and begin!

---

## Getting Help

### Resources
- Architecture docs: `INTRO/10_ARKITEKTUR/`
- Code examples: `docs/EXAMPLES.md`
- API reference: `docs/API.md`
- Troubleshooting: This guide

### Asking Questions
When you need help:
1. Check the relevant documentation file
2. Search the codebase for similar examples
3. Look at existing tests for usage patterns
4. Ask Rasmus with specific details

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Getting started guide created | Kv1nt |
