# 11_DATABASE_SCHEMA - Cirkelline-Agents

**Purpose:** Database structure and data model for agent platform
**Status:** Design Phase
**Last Updated:** 2026-01-02

---

## Overview

Cirkelline-Agents uses a relational database to store agent state, user data, and configuration. The schema supports multi-agent coordination and persistent state management.

---

## Core Tables

### 1. Agents Table
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'idle',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  config JSONB,
  capabilities TEXT[]
);
```

### 2. Agent States Table
```sql
CREATE TABLE agent_states (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  state JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INTEGER
);
```

### 3. Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  task_type VARCHAR(100),
  status VARCHAR(50),
  payload JSONB,
  result JSONB,
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

### 4. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  auth_token VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 5. Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  status VARCHAR(50),
  created_at TIMESTAMP,
  ended_at TIMESTAMP
);
```

---

## Relationships

```
Users
  ├─ (1:N) → Sessions
  │           └─ (1:N) → Tasks
  │
Agents
  ├─ (1:N) → Agent States
  └─ (1:N) → Tasks
```

---

## Indexing Strategy

- Primary Keys: UUID
- Foreign Keys: agent_id, user_id, session_id
- Performance Indexes: status, created_at, agent_type
- Full-Text Search: agent names, task descriptions

---

## Data Retention

- Active sessions: Indefinite
- Completed tasks: 90 days
- Agent state history: 30 days
- User data: Account lifetime

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Database schema documentation created | Kv1nt |
