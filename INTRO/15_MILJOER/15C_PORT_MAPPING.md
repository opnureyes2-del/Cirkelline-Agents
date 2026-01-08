# 15C_PORT_MAPPING - Port Allocation & Service Mapping

**Purpose:** Complete port allocation across all environments
**Status:** Current
**Last Updated:** 2026-01-02

---

## Port Allocation Summary

| Service | Dev | Staging | Prod | Type | Description |
|---------|-----|---------|------|------|-------------|
| Backend API | 7777 | 7777 | 443 | HTTP(S) | Main API |
| Metro Bundler | 8081 | N/A | N/A | HTTP | Expo development |
| Simulator | 19000 | N/A | N/A | HTTP | Expo simulator |
| PostgreSQL | 5432 | 5432 | 5432 | TCP | Database |
| Redis | 6379 | 6379 | 6379 | TCP | Cache |
| Adminer | 8080 | N/A | N/A | HTTP | DB admin UI |
| Prometheus | 9090 | 9090 | 9090 | HTTP | Metrics |
| Grafana | 3000 | 3100 | N/A | HTTP | Dashboards |
| Sentry | N/A | N/A | 443 | HTTPS | Error tracking |

---

## Development Environment Ports

```
Localhost Services:
├─ :3000 - Frontend (React Native Web)
├─ :7777 - Backend API
├─ :8080 - Database Admin (Adminer)
├─ :8081 - Metro Bundler (Expo)
├─ :5432 - PostgreSQL
├─ :6379 - Redis
├─ :9090 - Prometheus
├─ :3000 - Grafana (conflicts with frontend if running simultaneously)
└─ :19000 - Expo Simulator
```

---

## Staging Environment Ports

### Load Balancer (ALB)
```
Public Interface:
├─ :80 → Redirect to HTTPS
└─ :443 → Backend API

Internal Interface:
├─ :7777 → ECS Backend Tasks (private subnet)
└─ :5432 → RDS Database (private subnet)
```

### Internal Services (Private Subnets)
```
Backend Instances:
├─ Instance 1: :7777
├─ Instance 2: :7777
└─ Instance 3: :7777

Database:
└─ RDS: :5432

Cache:
└─ ElastiCache: :6379 (cluster mode)

Monitoring:
├─ Prometheus: :9090 (internal)
└─ Grafana: :3100 (internal)
```

---

## Production Environment Ports

### CloudFront CDN
```
Public Interface:
├─ :80 → Redirect to HTTPS
└─ :443 → CloudFront (TLS 1.2+)
```

### API Gateway
```
Public Interface:
└─ :443 → API Gateway

Internal:
└─ Forwards to ALB :443 → ELB → Backend :7777
```

### Application Load Balancer (ALB)
```
Layer 7 Routing:
├─ /api/v1/* → Backend API ECS Cluster
├─ /health → Health Check Endpoint
└─ /metrics → Prometheus Metrics (private)
```

### Auto-Scaling Group
```
Backend Instances:
├─ Instance 1-N: :7777 (dynamic)
└─ All behind ALB (no direct access)
```

### Database Tier (RDS)
```
Primary:
└─ :5432 (private subnet, accessed via parameter group)

Replicas:
├─ Replica 1: :5432
└─ Replica 2: :5432
```

### Cache Tier (ElastiCache)
```
Redis Cluster:
├─ Node 1: :6379
├─ Node 2: :6379
└─ Node 3: :6379
```

---

## Network Architecture

### Development (Single Machine)
```
┌─────────────────────────────────┐
│   Local Network (localhost)      │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Docker Network (cirkelline) │ │
│ ├──────┬──────┬──────┬────────┤ │
│ │      │      │      │        │ │
│ │ :7777│ :5432│ :6379│ :8080  │ │
│ │ API  │ DB   │ Cache│ Admin  │ │
│ └──────┴──────┴──────┴────────┘ │
└─────────────────────────────────┘
```

### Staging (VPC)
```
┌─────────────────────────────────────┐
│ AWS VPC (Staging)                   │
├─────────────────────────────────────┤
│ Public Subnet                       │
│ └─ ALB (:443 HTTPS)                │
│                                     │
│ Private Subnet A                    │
│ ├─ Backend Instance 1 (:7777)      │
│ └─ Backend Instance 2 (:7777)      │
│                                     │
│ Private Subnet B                    │
│ ├─ RDS PostgreSQL (:5432)          │
│ └─ ElastiCache Redis (:6379)       │
└─────────────────────────────────────┘
```

### Production (Multi-Region)
```
┌─────────────────────────────────────────┐
│ CloudFront CDN                          │
│ ├─ Region 1 (us-east-1)                │
│ │  ├─ API Gateway (:443)                │
│ │  ├─ ALB (:7777)                       │
│ │  ├─ ECS Cluster (N instances :7777)   │
│ │  ├─ RDS Primary (:5432)               │
│ │  ├─ ElastiCache (:6379)               │
│ │  └─ Backups & Monitoring              │
│ └─ Region 2 (eu-west-1) [Failover]     │
│    └─ Same as Region 1                 │
└─────────────────────────────────────────┘
```

---

## Port Configuration Files

### Express Server (server/index.ts)
```typescript
const PORT = process.env.PORT || 7777;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on ${HOSTNAME}:${PORT}`);
});
```

### Database Connection (config/database.ts)
```typescript
const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:password@localhost:5432/cirkelline_agents';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: parseInt(process.env.DB_POOL_SIZE || '20')
});
```

### Redis Client (config/cache.ts)
```typescript
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL);
```

---

## Common Port Conflicts

### Resolution Steps
1. Identify which port is in use: `lsof -i :PORT`
2. Kill process: `kill -9 PID`
3. Or change port in `.env`
4. Or change port binding in service

### Port Forwarding (SSH)
```bash
# Forward production database to local port
ssh -L 5432:prod-db.internal:5432 user@bastion-host

# Then connect locally to forwarded port
psql postgresql://postgres:pass@localhost:5432/cirkelline_agents
```

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Port mapping documentation created | Kv1nt |
