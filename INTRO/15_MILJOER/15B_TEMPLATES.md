# 15B_TEMPLATES - Configuration Templates

**Purpose:** Template files for environment configuration
**Status:** Current
**Last Updated:** 2026-01-02

---

## .env.example - Template for All Environments

```bash
# Application
NODE_ENV=development
PORT=7777
API_VERSION=v1

# URLs
API_URL=http://localhost:7777/api/v1
FRONTEND_URL=http://localhost:3000
MOBILE_APP_SCHEME=cirkellineagents://

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/cirkelline_agents
DB_POOL_SIZE=20
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_TIMEOUT=30000

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-refresh-secret-here
REFRESH_TOKEN_EXPIRY=7d
SESSION_SECRET=session-secret-here

# Security
CORS_ORIGIN=http://localhost:3000,http://localhost:19000
CORS_CREDENTIALS=true
HELMET_ENABLED=true

# External APIs
OPENAI_API_KEY=sk-...
BRAVE_API_KEY=...
SENDGRID_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json
SENTRY_DSN=https://...@sentry.io/...

# Monitoring
DATADOG_API_KEY=...
DATADOG_ENABLED=false
NEWRELIC_LICENSE_KEY=...

# File Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=cirkelline-agents-dev

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...
EMAIL_FROM=noreply@cirkelline.com

# Mobile
EXPO_PROJECT_ID=...
EXPO_ACCESS_TOKEN=...
```

---

## Docker Compose Template

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cirkelline-agents-backend
    ports:
      - "7777:7777"
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      DATABASE_URL: postgresql://postgres:password@postgres:5432/cirkelline_agents
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - cirkelline

  postgres:
    image: postgres:15-alpine
    container_name: cirkelline-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: cirkelline_agents
      POSTGRES_PASSWORD: password
      POSTGRES_USER: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - cirkelline
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: cirkelline-redis
    ports:
      - "6379:6379"
    networks:
      - cirkelline
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  adminer:
    image: adminer
    container_name: cirkelline-adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - cirkelline

volumes:
  pgdata:

networks:
  cirkelline:
    driver: bridge
```

---

## Kubernetes Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cirkelline-agents
  labels:
    app: cirkelline-agents
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cirkelline-agents
  template:
    metadata:
      labels:
        app: cirkelline-agents
    spec:
      containers:
      - name: backend
        image: cirkelline-agents:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 7777
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: cirkelline-secrets
              key: database-url
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /health
            port: 7777
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 7777
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: cirkelline-agents-service
spec:
  selector:
    app: cirkelline-agents
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 7777
```

---

## Terraform Template (Infrastructure as Code)

```hcl
provider "aws" {
  region = var.aws_region
}

# RDS PostgreSQL
resource "aws_db_instance" "cirkelline" {
  identifier     = "cirkelline-agents"
  engine         = "postgres"
  engine_version = "15.1"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = "cirkelline_agents"
  username = "postgres"
  password = random_password.db_password.result

  skip_final_snapshot = false

  tags = {
    Name = "cirkelline-agents-db"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "cirkelline" {
  cluster_id           = "cirkelline-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# ECS Task Definition
resource "aws_ecs_task_definition" "cirkelline" {
  family                   = "cirkelline-agents"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "cirkelline-agents"
      image     = "YOUR_DOCKER_REGISTRY/cirkelline-agents:latest"
      essential = true
      portMappings = [
        {
          containerPort = 7777
          hostPort      = 7777
        }
      ]
    }
  ])
}
```

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Configuration templates documentation created | Kv1nt |
