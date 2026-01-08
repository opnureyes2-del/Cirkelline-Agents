# 15A_REELLE_MILJOER - Real Environments Detail

**Purpose:** Detailed configuration for each real environment
**Status:** Current
**Last Updated:** 2026-01-02

---

## Development Environment Details

### Machine Specifications
- **OS:** macOS/Linux/Windows
- **Node.js:** 16+
- **Memory:** 8GB minimum
- **Disk:** 2GB free space
- **RAM for Services:** 4GB (PostgreSQL + Redis)

### Running Services
```bash
# Terminal 1: PostgreSQL
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15-alpine

# Terminal 2: Redis (optional)
docker run -p 6379:6379 redis:7-alpine

# Terminal 3: Backend
npm run dev

# Terminal 4: Mobile (Expo)
expo start
```

### Access Points
- **Backend API:** http://localhost:7777
- **Postgres:** localhost:5432
- **Redis:** localhost:6379
- **Expo Metro:** http://localhost:8081

---

## Staging Environment Details

### Cloud Infrastructure
- **Provider:** AWS/GCP
- **Region:** us-east-1
- **Availability Zones:** 2 (AZ-a, AZ-b)

### Services
```
ALB (Application Load Balancer)
  ├─ Backend Instance 1 (ECS Task)
  ├─ Backend Instance 2 (ECS Task)
  └─ Backend Instance 3 (ECS Task)

RDS PostgreSQL
  ├─ Primary Instance (db.t3.medium)
  └─ Read Replica (db.t3.medium)

ElastiCache Redis
  └─ Cluster Mode (3 shards)

S3 Buckets
  ├─ Application logs
  └─ User uploads
```

### Performance Metrics
- **Response Time:** < 200ms (p95)
- **Throughput:** 1000 req/sec
- **Database Connections:** 50 concurrent
- **Memory per Instance:** 1GB

### Monitoring
- CloudWatch metrics
- CloudWatch Logs
- DataDog APM
- X-Ray tracing

---

## Production Environment Details

### Cloud Infrastructure
- **Provider:** AWS/GCP (multi-region)
- **Primary Region:** us-east-1
- **Failover Region:** eu-west-1
- **Availability Zones:** 3 per region

### Services
```
CloudFront CDN
  └─ API Gateway
     └─ ALB (Layer 7 Load Balancer)
        ├─ Auto Scaling Group
        │  ├─ ECS Task 1-N (Kubernetes compatible)
        │  └─ Running on EC2/Fargate
        │
        ├─ RDS PostgreSQL (Aurora)
        │  ├─ Primary (db.r5.xlarge, Multi-AZ)
        │  ├─ Read Replica 1
        │  └─ Read Replica 2
        │
        ├─ ElastiCache Redis (Cluster)
        │  ├─ 3 shards with failover
        │  └─ 2 replicas per shard
        │
        └─ S3 (Multi-region)
           ├─ Bucket replication
           └─ Lifecycle policies
```

### Performance Metrics
- **Response Time:** < 100ms (p95)
- **Throughput:** 10,000+ req/sec
- **Database Connections:** 500+ concurrent
- **Memory per Instance:** 2GB
- **Uptime SLA:** 99.9%

### Disaster Recovery
- **RTO (Recovery Time):** 15 minutes
- **RPO (Recovery Point):** 5 minutes
- **Backup Frequency:** Hourly
- **Backup Retention:** 30 days

---

## Environment Parity Checklist

| Feature | Dev | Staging | Prod |
|---------|-----|---------|------|
| PostgreSQL | ✓ | ✓ | ✓ |
| Redis | Optional | ✓ | ✓ |
| Load Balancer | ✗ | ✓ | ✓ |
| CDN | ✗ | ✗ | ✓ |
| SSL/TLS | ✗ | ✓ | ✓ |
| Monitoring | Console | Full | Full |
| Scaling | Manual | Auto 2-3 | Auto 5-10 |
| Backups | Manual | Daily | Hourly |

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Real environments documentation created | Kv1nt |
