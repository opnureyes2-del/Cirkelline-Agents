# 60_CLAUDE_MD - INDEX
**Sektion:** AI Instruktioner og Projekt Kontekst
**Sidst Opdateret:** 2026-01-08
**Version:** v1.0.0

---

## OVERSIGT

Denne sektion indeholder CLAUDE.md filen for cirkelline-agents projektet - AI instruktioner for React Native mobile app med Google Gemini integration.

---

## HURTIG REFERENCE

### Projekt Details
- **Type:** React Native Mobile App (iOS/Android)
- **Platform:** iOS/Android via Expo
- **Language:** TypeScript 5.3.3
- **AI:** Google Gemini (Pro + Nano)
- **Status:** ~70% Complete (UI done, agents pending)

---

## FEJLHÅNDTERING

### Problem 1: CLAUDE.md References Wrong Package Manager

**Symptom:** CLAUDE.md says `npm run android` but project uses `yarn` or `pnpm`, or says port 3000 but mobile apps don't use ports

**Årsag:**
- CLAUDE.md copied from backend project template
- Package manager changed (npm → yarn → pnpm) but CLAUDE.md not updated
- Mobile-specific commands not documented
- CLAUDE.md references non-existent scripts in package.json

**Diagnosticering:**
```bash
cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents
ls package-lock.json yarn.lock pnpm-lock.yaml 2>/dev/null | head -1
cat package.json | grep -A20 '"scripts"'
grep "npm run\|port.*3000" CLAUDE.md
```

**Fix:**
1. Identify actual package manager and document it
2. Update CLAUDE.md: show correct run commands
3. Remove port references (mobile apps don't expose ports)
4. Document mobile commands: npm run android, npm run ios, npm start
5. Add troubleshooting: "android command not found", "Metro bundler cache issues"

---

### Problem 2: CLAUDE.md Missing Google Gemini API Key Requirements

**Symptom:** CLAUDE.md doesn't mention GOOGLE_GEMINI_API_KEY requirement, or API quota exceeded because billing not documented

**Årsag:**
- Gemini API integration added but CLAUDE.md not updated
- API key requirements not documented
- Billing/quota not explained
- Security note about storing keys missing

**Diagnosticering:**
```bash
grep -r "GEMINI\|API_KEY\|apiKey" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/src/ --include="*.ts" --include="*.tsx"
grep -i "gemini\|api.*key" CLAUDE.md
ls -la .env.example 2>/dev/null
```

**Fix:**
1. Document Gemini API requirement: app won't work without it
2. Show where to get key: https://makersuite.google.com/app/apikey
3. Explain cost structure: free tier vs paid tier
4. Document key storage: react-native-keychain (NOT hardcoded)
5. Add troubleshooting: "API key missing", "Quota exceeded errors"

---

### Problem 3: CLAUDE.md Says Project Has Git But It Doesn't

**Symptom:** CLAUDE.md says `git commit` but project has NO .git folder, causing AI to attempt git operations that fail

**Årsag:**
- Git folder removed after CLAUDE.md created (security/cleanup)
- CLAUDE.md copied from project with git
- CLAUDE.md template includes git instructions by default

**Diagnosticierung:**
```bash
cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents
ls -la .git 2>&1
grep -i "git commit\|git push\|repository" CLAUDE.md
```

**Fix:**
1. Add clear NO GIT warning to CLAUDE.md
2. Explicitly state: NO .git folder, local only
3. Document what this means: can't do git operations
4. Recommend: manual backups required
5. Add notes: if going to production, initialize git: git init

---

## ÆNDRINGSLOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-08 | 12:55 | Initial INDEX med FEJLHÅNDTERING (3 problems) | Claude |

---

*60_CLAUDE_MD.md - Opdateret 2026-01-08 12:55*
