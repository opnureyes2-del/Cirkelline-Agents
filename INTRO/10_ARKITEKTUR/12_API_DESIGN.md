# 12_API_DESIGN - Cirkelline-Agents

**Purpose:** API endpoint specifications and contracts
**Status:** Design Phase
**Last Updated:** 2026-01-02

---

## Overview

RESTful API design for Cirkelline-Agents backend. All endpoints return JSON and use standard HTTP methods.

---

## Base URL

```
Development: http://localhost:7777/api/v1
Production: https://api.cirkelline-agents.com/api/v1
```

---

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Core Endpoints

### Agents API

#### GET /agents
List all agents
```json
Response:
{
  "agents": [
    {
      "id": "uuid",
      "name": "Agent Name",
      "type": "agent_type",
      "status": "active",
      "capabilities": ["capability1", "capability2"]
    }
  ]
}
```

#### POST /agents
Create new agent
```json
Request:
{
  "name": "New Agent",
  "type": "agent_type",
  "config": {}
}

Response: Agent object
```

#### GET /agents/:id
Get agent details
```json
Response:
{
  "id": "uuid",
  "name": "Agent Name",
  "type": "agent_type",
  "state": {},
  "tasks": []
}
```

#### PUT /agents/:id
Update agent
```json
Request:
{
  "name": "Updated Name",
  "config": {}
}

Response: Updated agent object
```

#### DELETE /agents/:id
Delete agent
```
Response: 204 No Content
```

### Tasks API

#### POST /agents/:id/tasks
Create task for agent
```json
Request:
{
  "task_type": "process_data",
  "payload": {}
}

Response:
{
  "id": "uuid",
  "agent_id": "uuid",
  "status": "pending"
}
```

#### GET /agents/:id/tasks
List agent tasks
```json
Response:
{
  "tasks": [
    {
      "id": "uuid",
      "status": "completed",
      "result": {}
    }
  ]
}
```

#### GET /tasks/:id
Get task details
```json
Response:
{
  "id": "uuid",
  "status": "completed",
  "result": {}
}
```

### Sessions API

#### POST /sessions
Create session
```json
Request:
{
  "agent_id": "uuid",
  "user_id": "uuid"
}

Response:
{
  "id": "uuid",
  "status": "active"
}
```

#### GET /sessions/:id
Get session details
```json
Response:
{
  "id": "uuid",
  "agent_id": "uuid",
  "user_id": "uuid",
  "status": "active"
}
```

---

## Error Responses

All errors return appropriate HTTP status codes:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | API design documentation created | Kv1nt |
