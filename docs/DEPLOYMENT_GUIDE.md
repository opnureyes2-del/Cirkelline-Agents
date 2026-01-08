# CIRKELLINE DEPLOYMENT GUIDE
## Get Your AI Companion Running on Pixel 9 Pro

---

## PHASE 1: PREPARE YOUR ROG STRIX SCAR 17 (Ubuntu)

### Step 1.1: Open Terminal on ROG

```bash
# Press Ctrl+Alt+T to open terminal
# Or search for "Terminal" in applications
```

### Step 1.2: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

**Wait for this to complete** (may take 5-10 minutes)

---

### Step 1.3: Install Node.js 20

```bash
# Download and setup Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

### Step 1.4: Install Yarn (Package Manager)

```bash
npm install -g yarn

# Verify
yarn --version  # Should show 1.22.x or higher
```

---

### Step 1.5: Install Rust (For Native Modules)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# When prompted, choose option 1 (default installation)
# After installation completes:
source "$HOME/.cargo/env"

# Verify
rustc --version  # Should show rustc 1.x.x
```

---

### Step 1.6: Install Build Essentials

```bash
sudo apt install -y \
  build-essential \
  git \
  curl \
  wget \
  unzip \
  openjdk-17-jdk \
  adb \
  fastboot \
  python3 \
  python3-pip
```

---

### Step 1.7: Install Android Command Line Tools

```bash
# Create directory for Android SDK
mkdir -p ~/Android/Sdk/cmdline-tools

# Download command line tools
cd /tmp
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# Extract
unzip commandlinetools-linux-11076708_latest.zip -d ~/Android/Sdk/cmdline-tools

# Move to correct location
mv ~/Android/Sdk/cmdline-tools/cmdline-tools ~/Android/Sdk/cmdline-tools/latest

# Clean up
rm commandlinetools-linux-11076708_latest.zip
```

---

### Step 1.8: Setup Environment Variables

```bash
# Add to your .bashrc
echo '' >> ~/.bashrc
echo '# Android SDK' >> ~/.bashrc
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc

# Apply changes
source ~/.bashrc

# Verify
echo $ANDROID_HOME  # Should show /home/yourusername/Android/Sdk
```

---

### Step 1.9: Install Android SDK Components

```bash
# Accept licenses
yes | sdkmanager --licenses

# Install required SDK components
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Install additional components
sdkmanager "system-images;android-34;google_apis;x86_64"
sdkmanager "emulator"

# Verify installation
sdkmanager --list | grep "build-tools"
# Should show build-tools;34.0.0 as installed
```

---

### Step 1.10: Install Watchman (File Watcher)

```bash
cd /tmp
wget https://github.com/facebook/watchman/releases/download/v2023.11.20.00/watchman-v2023.11.20.00-linux.zip
unzip watchman-v2023.11.20.00-linux.zip
cd watchman-v2023.11.20.00-linux
sudo mkdir -p /usr/local/{bin,lib} /usr/local/var/run/watchman
sudo cp bin/* /usr/local/bin
sudo cp lib/* /usr/local/lib
sudo chmod 755 /usr/local/bin/watchman
sudo chmod 2777 /usr/local/var/run/watchman

# Clean up
cd ~
rm -rf /tmp/watchman*

# Verify
watchman --version
```

---

## PHASE 1 COMPLETE!

**Verify everything is installed:**

```bash
node --version      # Should show v20.x.x
npm --version       # Should show 10.x.x
yarn --version      # Should show 1.22.x
rustc --version     # Should show rustc 1.x.x
java -version       # Should show openjdk 17
adb --version       # Should show Android Debug Bridge
watchman --version  # Should show watchman 2023.x
echo $ANDROID_HOME  # Should show path to Android SDK
```

**If all commands work, you're ready for Phase 2!**

---

## PHASE 2: PREPARE YOUR PIXEL 9 PRO

### Step 2.1: Enable Developer Options

1. Open **Settings** on your Pixel 9 Pro
2. Scroll to **About phone**
3. Tap **Build number** 7 times rapidly
4. Enter your PIN/password when prompted
5. You'll see "You are now a developer!"

---

### Step 2.2: Enable USB Debugging

1. Go back to **Settings**
2. Scroll to **System** > **Developer options**
3. Toggle **Developer options** ON
4. Find **USB debugging** and toggle it ON
5. Confirm the dialog

---

### Step 2.3: Connect Pixel to ROG

1. Use USB cable to connect Pixel 9 Pro to ROG STRIX
2. On Pixel, you'll see "Allow USB debugging?" popup
3. Check "Always allow from this computer"
4. Tap **Allow**

---

### Step 2.4: Test Connection

On ROG terminal:

```bash
adb devices
```

**Expected output:**
```
List of devices attached
XXXXXXXXXXXXXXXX    device
```

**If you see "unauthorized":**
- Check your Pixel screen for authorization prompt
- Tap "Allow"

**If you see "no devices":**
- Try different USB port
- Try different USB cable
- Make sure USB is in "File Transfer" mode on Pixel

---

## PHASE 2 COMPLETE!

Your Pixel 9 Pro is now connected and ready!

---

## PHASE 3: CREATE CIRKELLINE PROJECT

### Step 3.1: Create Project Directory

```bash
cd ~
mkdir -p cirkelline-workspace
cd cirkelline-workspace
```

---

### Step 3.2: Initialize React Native Project

```bash
npx react-native@latest init Cirkelline --template react-native-template-typescript

# This will take 5-10 minutes
# Just wait for it to complete
```

---

### Step 3.3: Navigate to Project

```bash
cd Cirkelline
```

---

### Step 3.4: Install Additional Dependencies

```bash
# Install all required packages
npm install @react-native-async-storage/async-storage \
  react-native-paper \
  react-native-vector-icons \
  zustand \
  @tanstack/react-query \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-safe-area-context \
  react-native-screens \
  @react-navigation/native \
  @react-navigation/stack \
  react-native-mmkv \
  axios

# This will take 3-5 minutes
```

---

### Step 3.5: Link Vector Icons (Android)

```bash
# Edit android/app/build.gradle
# Add this line in dependencies section:
echo 'implementation project(":react-native-vector-icons")' >> android/app/build.gradle
```

Or manually add to `android/app/build.gradle`:

```gradle
dependencies {
    // ... other dependencies
    implementation project(':react-native-vector-icons')
}
```

---

### Step 3.6: Test Basic App

```bash
# Make sure Pixel is connected
adb devices

# Start Metro bundler
npm start
```

**In a NEW terminal window:**

```bash
cd ~/cirkelline-workspace/Cirkelline

# Build and install on Pixel
npm run android
```

**This will take 5-15 minutes for first build!**

**Expected result:** Basic React Native app opens on your Pixel 9 Pro showing "Welcome to React Native"

---

## PHASE 3 COMPLETE!

You now have a working React Native app on your Pixel 9 Pro!

---

## PHASE 4: ADD CIRKELLINE CODE

### Step 4.1: Create Project Structure

```bash
cd ~/cirkelline-workspace/Cirkelline

# Create directories
mkdir -p src/agents
mkdir -p src/components
mkdir -p src/services
mkdir -p src/types
mkdir -p src/theme
mkdir -p src/screens
```

---

### Step 4.2: Create Core Files

**Create: `src/types/index.ts`**

```typescript
export type AgentType = 'chat' | 'terminal' | 'code' | 'data' | 'evolution';
export type PersonalityMode = 'cirkel' | 'kv1nt';
export type AgentStatus = 'idle' | 'active' | 'processing' | 'error';

export interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  agentType?: AgentType;
  metadata?: Record<string, any>;
}

export interface AgentState {
  type: AgentType;
  status: AgentStatus;
  lastActive: number;
  currentTask?: string;
}
```

Save this file.

---

### Step 4.3: Copy AI Service Code

Copy the entire content from **Artifact 2** (Cirkelline App - Project Structure & Core Code) into:

`src/services/AIService.ts`

---

### Step 4.4: Create Main App Screen

Copy the React component from **Artifact 3** (Cirkelline React Native App - Main UI) and adapt it for React Native:

**Create: `src/screens/ChatScreen.tsx`**

---

### Step 4.5: Update App.tsx

Replace `App.tsx` content with:

```typescript
import React from 'react';
import ChatScreen from './src/screens/ChatScreen';

function App(): React.JSX.Element {
  return <ChatScreen />;
}

export default App;
```

---

## PHASE 5: RUN YOUR AI COMPANION!

### Step 5.1: Rebuild App

```bash
# Make sure Pixel is connected
adb devices

# Start fresh
npm start -- --reset-cache
```

**In new terminal:**

```bash
npm run android
```

---

### Step 5.2: Test on Pixel

1. App should open on your Pixel 9 Pro
2. You'll see Cirkelline chat interface
3. Type a message
4. See AI respond!

---

## SUCCESS!

**You now have Cirkelline running on your Pixel 9 Pro!**

---

## TROUBLESHOOTING

### Problem: "adb: command not found"
**Solution:**
```bash
source ~/.bashrc
# or
export PATH=$PATH:$HOME/Android/Sdk/platform-tools
```

---

### Problem: "ANDROID_HOME not set"
**Solution:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
source ~/.bashrc
```

---

### Problem: Build fails with "SDK not found"
**Solution:**
```bash
sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

---

### Problem: "Device unauthorized"
**Solution:**
1. Disconnect USB
2. On Pixel: Settings > Developer Options > Revoke USB debugging authorizations
3. Reconnect USB
4. Tap "Allow" on popup

---

### Problem: App crashes on startup
**Solution:**
```bash
# Clear cache and rebuild
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
npm run android
```

---

## NEXT STEPS AFTER BASIC APP WORKS:

1. **Test both personalities** (Cirkel & Kv1nt)
2. **Test theme switching** (Dark & Light)
3. **Try quick actions**
4. **Add real AI models** (Week 2-3)
5. **Add terminal connection** (Week 4-5)
6. **Connect to Cirkelline server** (Week 6+)

---

## WHERE TO GET HELP:

- **React Native docs:** https://reactnative.dev/docs/getting-started
- **Android Debug:** `adb logcat` (shows errors)
- **Metro bundler:** Check terminal for errors

---

## YOU'RE BUILDING YOUR AI COMPANION!

**Start with Phase 1 on your ROG STRIX and let me know when you complete each phase!**
