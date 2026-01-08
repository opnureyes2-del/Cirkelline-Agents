# 15_MILJOER - Environment Overview

**Purpose:** Environment configuration management for all deployment targets
**Status:** Current
**Last Updated:** 2026-01-02

---

## Overview

Cirkelline-Agents supports three primary environments: Development, Staging, and Production. Each environment has distinct configuration, resources, and deployment patterns.

---

## Environment Summary

| Property | Development | Staging | Production |
|----------|-------------|---------|-----------|
| **Purpose** | Local development | Pre-production testing | Live users |
| **Database** | PostgreSQL (local) | PostgreSQL (cloud) | PostgreSQL (managed) |
| **Cache** | Redis (optional) | Redis (cluster) | Redis (HA) |
| **Backend Port** | 7777 | 7777 | 443 (HTTPS) |
| **API URL** | http://localhost:7777 | https://staging-api.cirkelline.com | https://api.cirkelline.com |
| **Frontend URL** | Expo dev client | https://staging.cirkelline.com | https://cirkelline.com |
| **Scaling** | Single instance | 2-3 instances | 5+ instances (auto) |
| **Backups** | Manual | Daily | Hourly |
| **Monitoring** | Console logs | DataDog | Full stack (DataDog + ELK) |
| **Updates** | Continuous | Weekly | Controlled rollouts |

---

## Development Environment

### Setup
1. Local machine with Node.js 16+
2. PostgreSQL instance (Docker or local)
3. Redis (optional, for caching)
4. Expo CLI for mobile testing

### Configuration
- `.env.development` - Local secrets
- `package.json` - Dependencies
- `docker-compose.yml` - Services (optional)

### Features
- Hot reloading enabled
- Full debug logging
- Mock APIs available
- Slower response times acceptable

---

## Staging Environment

### Setup
- Cloud provider (AWS/GCP)
- RDS PostgreSQL instance
- ElastiCache Redis
- Multiple application instances
- Load balancer

### Configuration
- `.env.staging` - Staging secrets
- Auto-scaling enabled (2-3 instances)
- SSL/TLS certificates
- Database replication

### Features
- Production-like performance
- Real external API integrations
- Pre-production testing
- Full monitoring enabled

---

## Production Environment

### Setup
- High-availability setup across regions
- Managed PostgreSQL (RDS/Cloud SQL)
- Redis cluster for caching
- CDN for static assets
- API Gateway for rate limiting

### Configuration
- `.env.production` - Production secrets
- Auto-scaling (5-10 instances)
- SSL/TLS with HSTS
- Database backups every hour
- Multi-region deployment

### Features
- Maximum reliability
- 99.9% uptime SLA
- Real-time monitoring
- Automated failover
- Blue-green deployments

---

## Environment Variables

### Required Variables
```bash
# App
NODE_ENV=development|staging|production
PORT=7777
API_URL=http://localhost:7777/api/v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DB_POOL_SIZE=20

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
REFRESH_TOKEN_SECRET=your-refresh-secret

# External Services
OPENAI_API_KEY=sk-...
BRAVE_API_KEY=...

# Monitoring
SENTRY_DSN=https://...
DATADOG_API_KEY=...

# Application
LOG_LEVEL=info|debug
CORS_ORIGIN=http://localhost:3000
```

---

## Environment-Specific Configurations

### Development
- `LOG_LEVEL=debug`
- `CORS_ORIGIN=*` (for testing)
- `JWT_EXPIRY=7d` (longer for dev)
- No external API keys required (mocked)

### Staging
- `LOG_LEVEL=info`
- `CORS_ORIGIN=https://staging.cirkelline.com`
- `JWT_EXPIRY=24h`
- Real external APIs enabled
- Full monitoring active

### Production
- `LOG_LEVEL=warn`
- `CORS_ORIGIN=https://cirkelline.com`
- `JWT_EXPIRY=24h`
- All external APIs enabled
- Complete observability stack

---

## Switching Environments

### Local Development
```bash
# Copy example to local
cp .env.example .env.development

# Edit with local values
nano .env.development

# Use in development
npm run dev
```

### Docker Deployment
```bash
# Build for staging
docker build -t cirkelline-agents:staging .env.staging

# Build for production
docker build -t cirkelline-agents:production .env.production

# Run
docker run --env-file .env.staging cirkelline-agents:staging
```

---

## FEJLHÅNDTERING

### Problem 1: Missing eller Forkert Konfigureret .env Fil

**Symptom:** Applikation starter ikke, "Environment variable not found" fejl, eller service bruger forkert database/port/API-nøgle

**Årsag:**
- .env fil mangler i projekt-rod
- Required variable er ikke sat
- Værdi er tom eller indeholder forkerte tegn
- Forkert databaseforbindelse

**Diagnosticering:**
```bash
# Check om .env fil findes
ls -la /home/rasmus/Desktop/projekts/projects/cirkelline-agents/.env*

# Check hvilke variabler der er sat
grep -E "DATABASE|PORT|KEY" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/.env

# Test forbindelse
nc -zv localhost 7777
```

**Fix:**
1. Kopier .env.example til .env
2. Udfyld alle required variables
3. Verificer værdier matcher dokumentation
4. Restart service

**Prevention:**
- Altid kopier fra .env.example template
- Dokumenter alle required variables
- Validation script ved startup
- Environment-specific .env filer

---

### Problem 2: Port Conflicts - Service Kan Ikke Starte

**Symptom:** "Address already in use", "Port X is already allocated", service fejler ved startup

**Årsag:**
- Anden service allerede kører på samme port
- Gammel service ikke lukket korrekt
- Docker port mapping conflict
- To services konfigureret til samme port

**Diagnosticering:**
```bash
# Find hvad der bruger porten
sudo lsof -i :7777
ss -tulpn | grep 7777

# Check docker container ports
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Se hvilke porte der er i brug
netstat -tulpn | grep LISTEN
```

**Fix:**
1. Identificer proces på porten
2. Stop proces eller ændre port
3. Verificer port er fri
4. Start service igen

**Prevention:**
- Port mapping dokumentation
- Graceful shutdown scripts
- Docker health checks
- Port availability check før start

---

### Problem 3: Database Connection Fejler

**Symptom:** "Connection refused", "Cannot connect to database", "Access denied"

**Årsag:**
- Database container/service ikke startet
- Forkert DATABASE_URL
- Database credentials er forkerte
- Network connectivity problem

**Diagnosticering:**
```bash
# Check database service kører
docker ps | grep postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check container logs
docker logs postgres_container
```

**Fix:**
1. Verificer database kører
2. Check DATABASE_URL er korrekt
3. Verificer credentials
4. Test forbindelse
5. Restart service

**Prevention:**
- Separate .env files per environment
- Database startup verification
- Connection pool med retry
- Database health checks

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-08 | 16:30 | Added FEJLHÅNDTERING section (3 problems) | Kv1nt |
| 2026-01-02 | 00:00 | Environment overview documentation created | Kv1nt |
