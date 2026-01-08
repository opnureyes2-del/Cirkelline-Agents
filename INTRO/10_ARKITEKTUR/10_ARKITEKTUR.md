# 10_ARKITEKTUR - INDEX
**Sektion:** Systemarkitektur og Infrastruktur
**Sidst Opdateret:** 2026-01-08 12:45
**Version:** v1.0.0

---

## OVERSIGT

Denne sektion indeholder al arkitektur-dokumentation for cirkelline-agents projektet (React Native mobile app).

---

## FILER I DENNE SEKTION

| # | Fil | Beskrivelse |
|---|-----|-------------|
| 10 | 10_SYSTEM_ARCHITECTURE.md | React Native mobile app arkitektur |
| 11 | 11_DATABASE_SCHEMA.md | MMKV storage schema |
| 12 | 12_API_DESIGN.md | API endpoints og contracts |
| 13 | 13_TECH_STACK.md | Technologies used (React Native 0.73.2, TypeScript, Gemini) |
| 14 | 14_DESIGN_PATTERNS.md | Architectural patterns |
| 15 | 15_SECURITY_ARCHITECTURE.md | Security design (Keychain, MMKV) |
| 16 | 16_DEPLOYMENT_ARCHITECTURE.md | Deployment topology |

---

## HURTIG REFERENCE

### Tech Stack
- **Mobile:** React Native 0.73.2 (standard, not Expo)
- **Language:** TypeScript 5.3.3
- **AI:** Google Gemini (Gemini Pro + Gemini Nano)
- **State:** Zustand 4.4.7
- **Storage:** MMKV 2.11.0 (fast key-value)
- **Navigation:** React Navigation 6.1.9
- **UI:** React Native Paper 5.11.6

### Agent Types (5)
1. **Chat Agent** - General conversation
2. **Terminal Agent** - Command-line interface
3. **Code Agent** - Code generation & debugging
4. **Data Agent** - Data analysis
5. **Evolution Agent** - Self-improvement

### Personality Modes (2)
- **Cirkel Mode** - Friendly, warm, conversational
- **Kv1nt Mode** - Technical, precise, direct

---

## FEJLHÅNDTERING

### Problem 1: React Native Build Fails - Dependency Version Mismatch

**Symptom:** `npm install` succeeds but `npm run android` fails with "Invariant Violation" eller "Unable to resolve module", eller build crashes with dependency conflicts

**Årsag:**
- React Native version (0.73.2) ikke kompatibel med nogle dependencies
- Node modules cache corrupted
- Gradle cache issues (Android)
- Pod dependencies ikke synced (iOS)
- Metro bundler cache outdated

**Diagnosticering:**
```bash
# Check React Native version
cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents/config
cat package.json | grep "react-native"

# Check for dependency conflicts
npm ls react-native
npm ls react

# Check Node/npm versions
node --version  # Should be 18+
npm --version   # Should be 9+

# Check for corrupted node_modules
ls -la node_modules/ | wc -l
du -sh node_modules/

# Check Metro bundler cache
ls -la ~/.metro-cache/ 2>/dev/null || echo "No Metro cache"

# Android: Check Gradle cache
ls -la ~/.gradle/caches/ | head -20
```

**Fix:**
1. Clear all caches completely:
   ```bash
   cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents/config

   # Clear npm cache
   npm cache clean --force

   # Remove node_modules and lockfile
   rm -rf node_modules package-lock.json

   # Clear Metro bundler cache
   rm -rf ~/.metro-cache/

   # Android: Clear Gradle cache
   cd android && ./gradlew clean && cd ..

   # iOS: Clear Pods (if on Mac)
   cd ios && rm -rf Pods Podfile.lock && cd ..
   ```

2. Reinstall dependencies with specific versions:
   ```bash
   # Install exact versions from package.json
   npm install

   # Verify installation
   npm ls react-native react
   ```

3. For Android - rebuild Gradle:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   cd ..
   ```

4. For iOS - reinstall Pods:
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. Start Metro bundler fresh:
   ```bash
   npm start -- --reset-cache
   ```

6. Try build again:
   ```bash
   npm run android  # Or npm run ios
   ```

**Prevention:**
- Always use exact versions in package.json (no ^ or ~)
- Run `npm install` after every git pull
- Clear caches weekly during active development
- Document working dependency versions in CHANGELOG

---

### Problem 2: Gemini API Fails - Invalid API Key or Rate Limit

**Symptom:** App starts but AI features fail with "API key not found", "401 Unauthorized", eller "429 Too Many Requests", eller API calls timeout after 30 seconds

**Årsag:**
- GOOGLE_GEMINI_API_KEY ikke configureret i Keychain
- API key expired eller invalid
- API rate limit exceeded (free tier: 60 requests/minute)
- Network connectivity issues
- API endpoint changed or deprecated

**Diagnosticering:**
```bash
# Check if app code references API key correctly
cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents
grep -r "GOOGLE_GEMINI_API_KEY" components/ services/
grep -r "@google/generative-ai" services/

# Check network connectivity to Google APIs
curl -I https://generativelanguage.googleapis.com/v1beta/models/gemini-pro
ping -c 3 generativelanguage.googleapis.com

# Check API key format (should start with "AIza")
# Run app with debug logging enabled
npm run android -- --verbose

# Check Metro bundler logs for API errors
# Look for: "API key not valid", "PERMISSION_DENIED", "RESOURCE_EXHAUSTED"
```

**Fix:**
1. Obtain valid Google Gemini API key:
   - Go to: https://makersuite.google.com/app/apikey
   - Click "Get API Key"
   - Create new key (format: AIzaSyXXXXXXXXXXXXXXXXXXXX)
   - Copy key immediately

2. Configure API key in app (first launch):
   ```typescript
   // App will prompt for API key on first launch
   // Enter: AIzaSy... (your key)
   // App stores securely in react-native-keychain
   ```

3. If API key lost/corrupted - reset storage:
   ```bash
   # Android: Clear app data
   adb shell pm clear com.cirkellineagents

   # iOS: Uninstall and reinstall app
   ```

4. For rate limits - implement retry logic:
   ```typescript
   // Check services/OptimizedGeminiService.ts
   // Already has retry logic with exponential backoff
   // Rate limit: 60 requests/minute (free tier)
   // Upgrade to paid: 360 requests/minute
   ```

5. Test API key manually:
   ```bash
   export API_KEY="AIzaSy..."
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$API_KEY"
   ```

6. If all fails - check Google Cloud Console:
   - Verify API key not disabled
   - Check quota limits
   - Verify billing enabled (if using paid tier)

**Prevention:**
- Store backup API key securely (password manager)
- Set up monitoring for API usage (Google Cloud Console)
- Implement graceful degradation (use GeminiNanoService for offline mode)
- Add rate limit warning in UI (when approaching 60/min)
- Log all API errors to help debug issues

---

### Problem 3: MMKV Storage Corruption - App Crashes on Launch

**Symptom:** App crashes immediately on launch with "Cannot read property of undefined", eller infinite loading screen, eller white screen after successful build, eller error "MMKV initialization failed"

**Årsag:**
- MMKV storage file corrupted (sudden app kill during write)
- Storage path permissions changed
- Storage exceeded device limits
- Incompatible MMKV version after update
- Native module linking failed (iOS/Android)

**Diagnosticering:**
```bash
# Check if MMKV native module linked correctly
cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents/config

# Android: Check if MMKV is in build.gradle
grep -r "MMKV" android/app/build.gradle
cat android/app/build.gradle | grep "react-native-mmkv"

# iOS: Check if MMKV in Podfile.lock
cat ios/Podfile.lock | grep "MMKV"

# Check app logs for MMKV errors
adb logcat | grep -i mmkv  # Android
# iOS: Check Xcode console logs

# Check app storage size
adb shell du -sh /data/data/com.cirkellineagents/  # Android
# iOS: Check Settings → General → iPhone Storage

# Try to access MMKV manually (JavaScript)
# In Metro bundler REPL or React Native Debugger
```

**Fix:**
1. Clear MMKV storage completely:
   ```bash
   # Android: Clear app data (WARNING: deletes all user data)
   adb shell pm clear com.cirkellineagents

   # Or manually delete MMKV files
   adb shell rm -rf /data/data/com.cirkellineagents/files/mmkv

   # iOS: Uninstall and reinstall app
   # Or use Xcode → Product → Clean Build Folder
   ```

2. Relink MMKV native module:
   ```bash
   cd /home/rasmus/Desktop/projekts/projects/cirkelline-agents/config

   # Remove and reinstall MMKV
   npm uninstall react-native-mmkv
   npm install react-native-mmkv@2.11.0

   # Android: Rebuild
   cd android && ./gradlew clean && cd ..
   npm run android

   # iOS: Reinstall Pods
   cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
   npm run ios
   ```

3. Add storage error handling in code:
   ```typescript
   // In services/StorageService.ts
   try {
     const storage = new MMKV();
     // ... storage operations
   } catch (error) {
     console.error('MMKV initialization failed:', error);
     // Fallback to AsyncStorage
     import AsyncStorage from '@react-native-async-storage/async-storage';
     // Use AsyncStorage instead
   }
   ```

4. Implement storage size limits:
   ```typescript
   // Before writing large data
   const MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50 MB
   const currentSize = getAllKeys().reduce((total, key) => {
     return total + (getString(key)?.length || 0);
   }, 0);

   if (currentSize > MAX_STORAGE_SIZE) {
     // Clear old conversation history
     clearOldData();
   }
   ```

5. Verify fix:
   ```bash
   # Uninstall app
   adb uninstall com.cirkellineagents

   # Rebuild and install fresh
   npm run android

   # Test storage operations
   # Open app → Create conversation → Close app → Reopen
   # Conversation should persist
   ```

**Prevention:**
- Implement automatic storage cleanup (delete conversations older than 30 days)
- Add storage size monitoring in app (show warning at 80% capacity)
- Implement graceful fallback to AsyncStorage if MMKV fails
- Add error boundary around storage operations
- Test app crash recovery (kill app during write operations)
- Document storage limits in user guide

---

## ÆNDRINGSLOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-08 | 12:45 | Initial INDEX oprettet med FEJLHÅNDTERING (3 problems: React Native build fails, Gemini API fails, MMKV storage corruption) | Claude |

---

*10_ARKITEKTUR.md - Opdateret 2026-01-08 12:45*
