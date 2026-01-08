# CIRKELLINE-AGENTS (Mobile & Desktop Agent App)

**Version:** v1.0.0
**Status:** 📱 MOBILE-FIRST DEVELOPMENT
**Last Updated:** 2025-12-28
**Owner:** Rasmus (Agent mobile/desktop application)

---

## 🌍 OVERALL ECOSYSTEM CONTEXT

### The Situation
You are working in Rasmus's localhost development environment. This is **cirkelline-agents** - a mobile and desktop application for AI agents.

### This Specific Folder
**Location:** `/home/rasmus/Desktop/projekts/projects/cirkelline-agents/`
**Purpose:** Mobile-first agent application with React Native/Expo
**Status:** 📱 Development phase

### The Complete Ecosystem (9 Projects)
```
/home/rasmus/Desktop/projekts/projects/
├── cirkelline-system/              ← Clean v1.3.8 (DO NOT EDIT)
├── cirkelline-kv1ntos/             ← Experimental version
├── cosmic-library/                 ← AI Training Academy (Port 7778)
├── lib-admin/                      ← CKC Admin Hub (Port 7779)
├── commando-center/                ← Docker Infrastructure (Port 8090)
├── cirkelline-consulting/          ← Booking Platform (Port 3000)
├── kommandor-og-agenter/           ← Multi-agent orchestration
├── commander-and-agent/            ← Commander documentation
└── cirkelline-agents/              ← YOU ARE HERE
```

---

## 🎯 PROJECT PURPOSE

### What This Project Is

A mobile and desktop application for AI agents built with:
- React Native / Expo
- TypeScript
- Mobile-first architecture

### Project Structure

```
cirkelline-agents/
├── agents/          # Agent implementations
├── components/      # React components
├── config/          # Configuration
├── docs/           # Documentation
├── INTRO/          # Integration with central INTRO
├── scripts/        # Build and deployment scripts
├── server/         # Backend server
├── services/       # Service integrations
└── types/          # TypeScript types
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### Technology Stack (Verificeret 2026-01-03)
- **Mobile:** React Native 0.73.2 (NOT Expo - standard React Native)
- **Language:** TypeScript 5.3.3
- **Platform:** iOS / Android
- **Architecture:** Multi-agent AI companion app
- **AI:** Google Gemini integration (Gemini Pro + Gemini Nano)
- **State:** Zustand (lightweight state management)
- **Navigation:** React Navigation (Stack Navigator)
- **Storage:** MMKV (fast, secure key-value storage)
- **Styling:** React Native Paper + Custom StyleSheet

### Dependencies (package.json - Physical Verification)
**Core:**
- react: 18.2.0
- react-native: 0.73.2
- typescript: 5.3.3

**AI Integration:**
- @google/generative-ai: ^0.1.3 (Gemini SDK)

**State & Data:**
- zustand: ^4.4.7 (State management)
- @tanstack/react-query: ^5.17.9 (Server state)
- react-native-mmkv: ^2.11.0 (Fast storage)
- @react-native-async-storage/async-storage: ^1.21.0 (Async storage)

**Navigation:**
- @react-navigation/native: ^6.1.9
- @react-navigation/stack: ^6.3.20
- react-native-screens: ^3.29.0
- react-native-gesture-handler: ^2.14.1

**UI:**
- react-native-paper: ^5.11.6 (Material Design)
- react-native-vector-icons: ^10.0.3

**Security:**
- react-native-keychain: ^8.1.2 (Secure credential storage)

### Project Structure (Physical Verification 2026-01-03)
| Directory | Purpose | Status | Files |
|-----------|---------|--------|-------|
| `components/` | React components | ✅ KOMPLET | App.tsx (20KB - fuld app) |
| `services/` | AI & Storage services | ✅ KOMPLET | 5 TypeScript services (50KB total) |
| `config/` | Configuration | ✅ KOMPLET | package.json |
| `docs/` | Documentation | ✅ KOMPLET | Architecture, deployment, integration guides |
| `INTRO/` | Central INTRO integration | ✅ KOMPLET | Linked til central bible |
| `agents/` | Agent implementations | ❌ TOM | Ingen filer endnu |
| `scripts/` | Build/deployment | ❌ MANGLER | Ikke implementeret |
| `server/` | Backend server | ❌ MANGLER | Ikke implementeret |
| `types/` | TypeScript types | ❌ TOM | Ingen filer |

### Services Layer (Physical Files)
| Service | Størrelse | Formål |
|---------|-----------|--------|
| `GeminiService.ts` | 10.6 KB | Standard Gemini AI integration |
| `GeminiNanoService.ts` | 10.4 KB | On-device Gemini Nano |
| `OptimizedGeminiService.ts` | 5.1 KB | Optimized Gemini calls |
| `StorageService.ts` | 12.6 KB | MMKV storage abstraction |
| `AIService.ts` | 11.5 KB | AI service abstraction layer |

### App Features (App.tsx Analysis)
**Agent Types (5 specialized agents):**
- **Chat Agent** - General conversation & assistance
- **Terminal Agent** - Command-line interface & system control
- **Code Agent** - Code generation & debugging
- **Data Agent** - Data analysis & visualization
- **Evolution Agent** - Self-improvement & learning

**Personality Modes (2 modes):**
- **Cirkel Mode** - Friendly, warm, conversational ("Hey! 👋 I'm Cirkel...")
- **Kv1nt Mode** - Technical, precise, direct ("Kv1nt AI assistant online. Ready for commands.")

**Core Capabilities:**
- Multi-agent orchestration (5 agents running simultaneously)
- Real-time chat interface with message history
- Theme switching (Dark/Light mode)
- Personality switching (Cirkel/Kv1nt)
- Agent status tracking (idle/active/processing/error)
- API key management (secure storage via Keychain)
- Persistent storage (conversation history via MMKV)

### Ports & Services
- **Port:** N/A (mobile app - runs on device/emulator)
- **Backend:** Google Gemini API (cloud)
- **Database:** MMKV (on-device key-value store)
- **API:** Google Generative AI SDK

### Key Technical Decisions (Verificeret)
1. **React Native Standard** - NOT using Expo (full control over native code)
2. **Multi-Agent Architecture** - 5 specialized agents vs single chatbot
3. **Dual Personality** - Cirkel (friendly) vs Kv1nt (technical)
4. **Google Gemini** - Primary AI (with Nano for on-device fallback)
5. **MMKV Storage** - Fastest key-value storage for React Native
6. **Zustand** - Minimal state management (lighter than Redux)
7. **TypeScript** - Full type safety across app

---

## 📚 DOCUMENTATION

**Key Documentation Files:**
- `docs/ARCHITECTURE_V2.md` - System architecture
- `docs/DEPLOYMENT_GUIDE.md` - Deployment instructions
- `docs/INTEGRATION_GUIDE.md` - Integration guide
- `docs/MOBILE_FIRST_ARCH.md` - Mobile-first architecture
- `docs/EXPO_QUICK_SETUP.md` - Quick setup with Expo

---

## INTRO DOCUMENTATION STANDARD

This project follows the INTRO documentation standard:
- [06_TEMPLATE_INTRO](/home/rasmus/Desktop/status opdaterings rapport/INTRO/06_TEMPLATE_INTRO/06_TEMPLATE_INTRO.md) - Master template for all documentation
- [39_DNA_KOMPLET_TODO](/home/rasmus/Desktop/status opdaterings rapport/INTRO/30_TODOS/39_DNA_KOMPLET_TODO/39_DNA_KOMPLET_TODO.md) - Master task list (270 points)

**Local INTRO folder:** `./INTRO/`
- `00_INDEX.md` - Project navigation
- `_TODO_VERIFIKATION/STATUS.md` - Integration status

**Central INTRO Bible:** `/home/rasmus/Desktop/status opdaterings rapport/INTRO/`
- [00_START_HER.md](../../../status%20opdaterings%20rapport/INTRO/00_START_HER.md) - Starting point
- [48_cirkelline-agents_BASELINE](../../../status%20opdaterings%20rapport/INTRO/40_BASELINES/48_cirkelline-agents_BASELINE/) - Project baseline
- [59_cirkelline-agents_ROADMAP](../../../status%20opdaterings%20rapport/INTRO/50_ROADMAPS/59_cirkelline-agents_ROADMAP/) - Project roadmap
- [69_cirkelline-agents_CLAUDE](../../../status%20opdaterings%20rapport/INTRO/60_CLAUDE_MD/69_cirkelline-agents_CLAUDE/) - This file (copy)

---

## ⚠️ IMPORTANT NOTES

### For Claude When Working on This Project

1. **Mobile-first development** - prioritize mobile experience
2. **React Native/Expo** - use appropriate mobile patterns
3. **TypeScript** - maintain type safety
4. **Documentation** - check docs/ folder for details
5. **INTRO integration** - link to central INTRO system

---

## 📊 CURRENT STATUS (Verificeret 2026-01-03)

**Implementation Status:** ~70% Complete

**What Exists ✅:**
- ✅ Complete React Native app structure (App.tsx 20KB)
- ✅ 5 AI services (GeminiService, GeminiNanoService, OptimizedGemini Service, StorageService, AIService) - 50KB total
- ✅ Full package.json with all dependencies configured
- ✅ Multi-agent architecture (5 agent types)
- ✅ Dual personality system (Cirkel + Kv1nt)
- ✅ Complete UI implementation
- ✅ State management (Zustand)
- ✅ Navigation (React Navigation Stack)
- ✅ Storage (MMKV)
- ✅ Security (Keychain for API keys)
- ✅ Documentation (Architecture, deployment, integration guides)
- ✅ INTRO integration (linked to central bible)

**What's Missing ❌:**
- ❌ Agent implementations (agents/ folder is empty)
- ❌ Build scripts (scripts/ folder empty)
- ❌ Backend server (server/ folder empty)
- ❌ TypeScript type definitions (types/ folder empty)
- ❌ Testing (Jest configured but no tests written)
- ❌ iOS/Android builds (not built yet)
- ❌ Deployment pipeline

**Deployment Readiness:**
- **Dependencies:** ✅ All configured in package.json
- **API Keys:** ⚠️ Requires Google Gemini API key (user must configure)
- **Build:** ❌ Not built for iOS/Android yet
- **Testing:** ❌ No tests written

**How to Run:**
```bash
cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents/config
npm install
npm run android  # For Android
npm run ios      # For iOS (requires Mac)
```

---

## ÆNDRINGSLOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2025-12-28 | - | Initial CLAUDE.md created | Claude |
| 2025-12-29 | 04:20 | INTRO DOCUMENTATION STANDARD tilføjet (DEL 18 KRYDS-3) | Claude |
| 2025-12-29 | 04:20 | Reference til 06_TEMPLATE_INTRO og 39_DNA tilføjet | Claude |
| 2025-12-29 | 05:35 | Komplette INTRO Bible links tilføjet (DEL 12 100%) | Claude |
| 2025-12-29 | 12:00 | TECHNICAL ARCHITECTURE sektion tilføjet (DEL 12 komplet 8/8 sektioner) | Claude |
| 2026-01-03 | 02:30 | P1-8: Komplet dokumentation med FAKTA (fysisk verificeret) | Claude |
| 2026-01-03 | 02:30 | Verificeret React Native 0.73.2, 5 services, package.json, App.tsx | Claude |
| 2026-01-03 | 02:30 | Tilføjet komplet dependency liste, app features, agent types | Claude |
| 2026-01-09 | 00:50 | P1-8: Updated INTRO/30_TODOS.md with actual task list | Elle |
| 2026-01-09 | 00:50 | P1-8: Updated INTRO/40_BASELINES.md with actual baseline status | Elle |

---

**Created:** 2025-12-28
**Maintained by:** Claude Code
**Original Author:** Rasmus (opnureyes2@gmail.com)
**Status:** 📱 MOBILE-FIRST DEVELOPMENT

