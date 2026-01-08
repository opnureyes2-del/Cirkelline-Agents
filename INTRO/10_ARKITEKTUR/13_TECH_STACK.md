# 13_TECH_STACK - Cirkelline-Agents

**Purpose:** Technology stack and dependencies overview
**Status:** Current
**Last Updated:** 2026-01-02

---

## Overview

Cirkelline-Agents uses modern JavaScript/TypeScript tooling for cross-platform mobile development.

---

## Frontend Stack

### Framework & Tooling
- **React Native** - Cross-platform mobile framework
- **Expo** - React Native development platform
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Redux** - State management (optional)
- **React Query** - Data fetching

### Build & Development
- **Expo CLI** - Development and building
- **Metro Bundler** - JavaScript bundler
- **Babel** - JavaScript transpiler
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Testing
- **Jest** - JavaScript testing framework
- **React Native Testing Library** - Component testing
- **Detox** - E2E testing

---

## Backend Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Nest.js** - Optional framework alternative

### Database
- **PostgreSQL** - Primary database
- **TypeORM** - ORM for database access
- **Redis** - Caching and sessions (optional)

### Authentication & Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables
- **helmet** - Security headers

### APIs & Integration
- **Axios** - HTTP client
- **Socket.io** - Real-time communication
- **GraphQL** - Alternative API layer (optional)

---

## Development Tools

### Version Control
- **Git** - Version control
- **GitHub** - Repository hosting

### Package Management
- **npm** - Node package manager
- **yarn** - Alternative package manager (optional)

### Containerization
- **Docker** - Application containers
- **Docker Compose** - Multi-container orchestration

### Monitoring & Logging
- **Winston** - Logging library
- **Sentry** - Error tracking
- **DataDog** - Monitoring (optional)

---

## Platform Support

### Mobile Platforms
- **iOS** - Apple devices
- **Android** - Android devices
- **Web** - Browser-based (via Expo Web)

### Desktop Support
- **Electron** - Desktop application (future)
- **macOS** - Native macOS app (future)
- **Windows** - Windows application (future)

---

## Version Requirements

```
Node.js: >= 16.0.0
npm: >= 8.0.0
Expo: >= 47.0.0
React Native: >= 0.70.0
TypeScript: >= 4.8.0
PostgreSQL: >= 12.0
```

---

## Performance Considerations

- Code splitting for mobile
- Tree-shaking for bundle size
- Lazy loading for routes
- Image optimization
- API response caching

---

## Security Practices

- Environment variable isolation
- API key management
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention (via ORM)

---

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Technology stack documentation created | Kv1nt |
