#!/bin/bash
# CIRKELLINE COMPLETE INSTALLATION
# Run this on your ROG STRIX SCAR 17
# This installs EVERYTHING including AI and SSH

set -e  # Exit on error

echo "🚀 CIRKELLINE COMPLETE INSTALLATION"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

success() { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# ==================================
# STEP 1: CHOOSE INSTALLATION METHOD
# ==================================

echo ""
echo "Choose installation method:"
echo ""
echo "1) 🚀 EXPO (RECOMMENDED)"
echo "   - Fastest setup (5 minutes)"
echo "   - Easiest to use"
echo "   - Scan QR code to test instantly"
echo "   - Perfect for development"
echo ""
echo "2) ⚡ REACT NATIVE CLI (Advanced)"
echo "   - Full control"
echo "   - Production-ready builds"
echo "   - Requires Android SDK"
echo "   - Takes 30-60 minutes"
echo ""
read -p "Enter choice (1 or 2): " METHOD

# ==================================
# STEP 2: CREATE PROJECT
# ==================================

WORKSPACE="$HOME/cirkelline-workspace"
mkdir -p "$WORKSPACE"
cd "$WORKSPACE"

if [ "$METHOD" == "1" ]; then
    # EXPO METHOD
    info "Creating Expo project..."

    npx create-expo-app@latest Cirkelline --template blank-typescript
    cd Cirkelline

    # Install dependencies
    info "Installing dependencies..."
    npm install \
        zustand \
        @tanstack/react-query \
        @google/generative-ai \
        axios

    success "Expo project created!"

    # Create source directories
    mkdir -p src/services src/agents src/components src/types

    # Create package.json scripts
    info "Configuring scripts..."

else
    # REACT NATIVE CLI METHOD
    info "Creating React Native project..."

    npx react-native@latest init Cirkelline --template react-native-template-typescript
    cd Cirkelline

    # Install dependencies
    info "Installing dependencies (this may take a while)..."
    npm install \
        @react-native-async-storage/async-storage \
        react-native-paper \
        react-native-vector-icons \
        zustand \
        @tanstack/react-query \
        @google/generative-ai \
        react-native-gesture-handler \
        react-native-reanimated \
        react-native-safe-area-context \
        react-native-screens \
        react-native-mmkv \
        axios

    success "React Native project created!"

    # Create source directories
    mkdir -p src/services src/agents src/components src/types
fi

# ==================================
# STEP 3: CREATE SERVICE FILES
# ==================================

info "Creating Gemini AI service..."
cat > src/services/GeminiService.ts << 'EOF'
// GeminiService.ts
// Paste content from Artifact #9 here
export class GeminiNanoService {
  // ... (full code from artifact)
}
EOF

info "Creating SSH service..."
cat > src/services/SSHService.ts << 'EOF'
// SSHService.ts
// Paste content from Artifact #10 here
export class SSHService {
  // ... (full code from artifact)
}
EOF

info "Creating AI service..."
cat > src/services/AIService.ts << 'EOF'
// AIService.ts
// Paste content from Artifact #2 here
export class AIService {
  // ... (full code from artifact)
}
EOF

success "Service files created!"

# ==================================
# STEP 4: CREATE MAIN APP
# ==================================

info "Creating main app component..."
cat > App.tsx << 'EOF'
// App.tsx
// Paste content from Artifact #6 here
import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cirkelline Loading...</Text>
    </View>
  );
}
EOF

success "Main app created!"

# ==================================
# STEP 5: ENVIRONMENT SETUP
# ==================================

info "Creating environment configuration..."
cat > .env << 'EOF'
# Cirkelline Environment Variables

# Google AI (for Gemini)
GOOGLE_API_KEY=your_google_api_key_here

# Anthropic (for Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
CIRKELLINE_SERVER_URL=wss://cirkelline.com/ws
CIRKELLINE_SSH_HOST=cirkelline.com
CIRKELLINE_SSH_PORT=22
CIRKELLINE_SSH_USER=rasmus

# Development
DEBUG=true
EOF

success "Environment file created!"

# ==================================
# STEP 6: SSH KEY GENERATION
# ==================================

echo ""
info "Setting up SSH keys for server access..."
SSH_KEY_PATH="$HOME/.ssh/cirkelline_key"

if [ ! -f "$SSH_KEY_PATH" ]; then
    read -p "Generate SSH key for Cirkelline? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "cirkelline@pixel9pro"
        success "SSH key generated: $SSH_KEY_PATH"

        echo ""
        warning "IMPORTANT: Add this public key to your server!"
        echo ""
        echo "Public key:"
        cat "$SSH_KEY_PATH.pub"
        echo ""
        echo "Run this on your server (cirkelline.com):"
        echo "echo '$(cat $SSH_KEY_PATH.pub)' >> ~/.ssh/authorized_keys"
        echo ""
        read -p "Press Enter when done..."
    fi
fi

# ==================================
# STEP 7: DEVICE CONNECTION CHECK
# ==================================

echo ""
info "Checking for Pixel 9 Pro connection..."

if command -v adb &> /dev/null; then
    DEVICE_COUNT=$(adb devices | grep -w "device" | wc -l)

    if [ $DEVICE_COUNT -gt 0 ]; then
        success "Pixel 9 Pro detected!"
    else
        warning "Pixel 9 Pro not detected"
        echo ""
        echo "Please:"
        echo "1. Connect Pixel 9 Pro via USB"
        echo "2. Enable USB Debugging"
        echo "3. Accept authorization on phone"
        echo ""
        read -p "Press Enter when ready..."
    fi
else
    warning "ADB not found. Installing..."
    sudo apt install -y adb
fi

# ==================================
# STEP 8: READY TO LAUNCH
# ==================================

echo ""
echo "===================================="
success "INSTALLATION COMPLETE! 🎉"
echo "===================================="
echo ""

if [ "$METHOD" == "1" ]; then
    # EXPO INSTRUCTIONS
    echo "📱 TO RUN YOUR APP:"
    echo ""
    echo "1. Install 'Expo Go' on your Pixel 9 Pro"
    echo "   (Download from Google Play Store)"
    echo ""
    echo "2. Start the development server:"
    echo "   cd $WORKSPACE/Cirkelline"
    echo "   npx expo start"
    echo ""
    echo "3. Scan the QR code with Expo Go app"
    echo ""
    echo "4. Your app will open on your phone!"
    echo ""

    read -p "Start Expo now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "Starting Expo..."
        npx expo start
    fi
else
    # REACT NATIVE CLI INSTRUCTIONS
    echo "📱 TO RUN YOUR APP:"
    echo ""
    echo "Terminal 1 - Start Metro:"
    echo "   cd $WORKSPACE/Cirkelline"
    echo "   npm start"
    echo ""
    echo "Terminal 2 - Deploy to Pixel:"
    echo "   cd $WORKSPACE/Cirkelline"
    echo "   npm run android"
    echo ""

    read -p "Start Metro now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "Starting Metro..."
        npm start
    fi
fi

echo ""
info "PROJECT LOCATION: $WORKSPACE/Cirkelline"
echo ""

# ==================================
# STEP 9: NEXT STEPS
# ==================================

echo ""
echo "🎯 NEXT STEPS:"
echo ""
echo "1. ✅ App installed - Test it on your Pixel!"
echo ""
echo "2. 🧠 Enable Gemini Nano (On Pixel 9 Pro):"
echo "   Settings > Developer Options > AICore Settings"
echo "   Enable 'on-device GenAI Features'"
echo ""
echo "3. 🔐 Setup SSH (If not done):"
echo "   Copy your public key to server:"
echo "   ssh-copy-id -i $SSH_KEY_PATH.pub rasmus@cirkelline.com"
echo ""
echo "4. 🌐 Get API Keys:"
echo "   - Google AI: https://makersuite.google.com/app/apikey"
echo "   - Anthropic: https://console.anthropic.com/"
echo "   Add to: $WORKSPACE/Cirkelline/.env"
echo ""
echo "5. 📝 Replace placeholder code:"
echo "   - Copy full code from artifacts into service files"
echo "   - Update App.tsx with complete UI"
echo ""
echo "6. 🚀 Deploy to server (Later):"
echo "   - Setup WebSocket server on cirkelline.com"
echo "   - Configure database"
echo "   - Enable real-time sync"
echo ""

echo ""
success "Your AI companion is ready to come alive! 🤖✨"
echo ""
