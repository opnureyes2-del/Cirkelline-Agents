# CIRKELLINE EXPO - ULTRA QUICK SETUP
## Get Your AI Companion Running in 5 MINUTES!

---

## WHY EXPO IS BETTER FOR US:

- **No Android SDK needed** - Skip the complex setup!
- **Test on phone IMMEDIATELY** - Scan QR code and go!
- **Works on ANY OS** - Ubuntu, Windows, Mac, doesn't matter!
- **Hot reload** - See changes instantly!
- **Way simpler** - Perfect for rapid development!

---

## QUICK START (5 Minutes Total!)

### Step 1: Install Node.js (If you don't have it)

**Check if you have Node:**
```bash
node --version
```

**If you see a version number (like v20.x.x), SKIP TO STEP 2!**

**If not, install Node:**
```bash
# Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify:
node --version
npm --version
```

---

### Step 2: Create Cirkelline App (1 minute)

```bash
# Create the app
npx create-expo-app@latest Cirkelline --template blank-typescript

# Enter the directory
cd Cirkelline
```

**That's it! App created!**

---

### Step 3: Install Expo Go on Your Pixel 9 Pro

1. Open **Google Play Store** on your Pixel
2. Search for **"Expo Go"**
3. Install it
4. Open Expo Go app

**Keep it open!**

---

### Step 4: Start the App (30 seconds)

```bash
# Start the development server
npx expo start
```

**You'll see a QR code in your terminal!**

---

### Step 5: Open on Your Phone (10 seconds)

**On your Pixel 9 Pro:**
1. Make sure you're on the SAME Wi-Fi as your ROG
2. In Expo Go app, tap **"Scan QR code"**
3. Scan the QR code from your terminal
4. **BOOM! App opens on your phone!**

---

## YOU NOW HAVE A WORKING APP!

Let's add Cirkelline's AI to it!

---

## ADD CIRKELLINE AI (2 Minutes)

### Step 6: Install Dependencies

```bash
npm install zustand @tanstack/react-query
```

---

### Step 7: Replace App.tsx

**Open `App.tsx` in your Cirkelline folder and replace ALL content with the code from `components/App.tsx` in this repository.**

The full App.tsx code includes:
- Dual personality system (Cirkel/Kv1nt)
- Dark/Light theme switching
- Agent status panel
- Message handling
- Quick actions

---

## TROUBLESHOOTING

### "Expo Go can't find the app"
- Make sure both devices are on the SAME Wi-Fi network
- Try: `npx expo start --tunnel`

### "Metro bundler error"
```bash
npx expo start -c  # Clear cache
```

### "Package not found"
```bash
rm -rf node_modules
npm install
```

---

## NEXT STEPS

1. **Enable Gemini Nano** on your Pixel 9 Pro:
   - Settings > Developer Options > AICore Settings
   - Enable "on-device GenAI Features"

2. **Add real AI integration**:
   - Copy `services/GeminiService.ts` to your project
   - Import and use in App.tsx

3. **Add SSH capability**:
   - See `docs/INTEGRATION_GUIDE.md`

---

## QUICK REFERENCE

```bash
# Start development
cd ~/cirkelline-workspace/Cirkelline
npx expo start

# Clear cache if issues
npx expo start -c

# Install new package
npm install package-name

# Update Expo
npx expo upgrade
```

---

**Your AI companion is ready in 5 minutes!**
