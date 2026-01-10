# Cirkelline Agents

> **React Native Mobile App med 5 AI-drevne Agenter**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./CLAUDE.md)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)]()

## Oversigt

Cirkelline Agents er en React Native mobilapplikation der giver brugere adgang til 5 specialiserede AI-agenter. Appen fungerer som den mobile frontend til Cirkelline-økosystemet.

## Features

### 5 AI Agenter

| Agent | Funktion | Port |
|-------|----------|------|
| **Chat Commander** | Samtale & assistance | 7789 |
| **Terminal Commander** | Shell kommandoer | 7790 |
| **Code Commander** | Kodegenerering | 7791 |
| **Data Commander** | Data analyse | 7792 |
| **Evolution Commander** | AI evolution | 7793 |

### Dual Personality System

- **Cirkel** - Venlig, imødekommende personlighed
- **Kv1nt** - Teknisk, præcis personlighed

## Tech Stack

- **Framework:** React Native 0.73.2
- **Language:** TypeScript 5.3.3
- **AI Backend:** Google Gemini API
- **Storage:** MMKV (performant key-value)
- **State:** Zustand
- **Navigation:** React Navigation 6.x

## Installation

```bash
# Clone repository
git clone https://github.com/opnureyes2-del/Cirkelline-Agents.git
cd cirkelline-agents

# Install dependencies
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Konfiguration

Opret `.env` fil:

```env
GEMINI_API_KEY=your_api_key
BACKEND_URL=http://localhost:7777
```

## Projekt Struktur

```
cirkelline-agents/
├── agents/           # Agent definitioner
├── components/       # React komponenter
├── config/           # Konfigurationsfiler
├── server/           # Backend integration
├── services/         # API services
├── types/            # TypeScript types
└── INTRO/            # Dokumentation
```

## Integration

Denne app integrerer med:
- **cirkelline-system** (Backend API på port 7777)
- **Mastermind Controller** (Agent orchestration på port 7799)
- **ELLE.md Agents** (25 systemd agents)

## Status

| Komponent | Status |
|-----------|--------|
| UI/UX | 60% |
| Agent Integration | 80% |
| Backend Connection | 100% |
| Offline Support | 0% |

**Overall:** 60% komplet

## Dokumentation

- [CLAUDE.md](./CLAUDE.md) - Fuld teknisk dokumentation
- [INTRO/](./INTRO/) - INTRO dokumentation system

## Links

- **GitHub:** [opnureyes2-del/Cirkelline-Agents](https://github.com/opnureyes2-del/Cirkelline-Agents)
- **Backend:** [cirkelline-system](../cirkelline-kv1ntos/)

---

**Cirkelline Agents** - Del af Cirkelline Ecosystem v1.3.8

*Sidst opdateret: 2026-01-10*
