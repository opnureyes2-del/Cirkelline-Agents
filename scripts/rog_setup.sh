#!/bin/bash
# CIRKELLINE DEVELOPMENT ENVIRONMENT SETUP
# For: ROG STRIX SCAR 17 (Ubuntu)
# Target: Pixel 9 Pro (Android)
# Created: December 21, 2024

echo "🚀 CIRKELLINE SETUP - Let's build your AI companion!"
echo "=================================================="
echo ""

# Check if running on Ubuntu
if [ ! -f /etc/lsb-release ]; then
    echo "❌ This script is designed for Ubuntu. Please run on Ubuntu system."
    exit 1
fi

echo "✅ Running on Ubuntu"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Update system
echo "📦 Step 1: Updating system packages..."
sudo apt update
sudo apt upgrade -y
echo "✅ System updated"
echo ""

# Install Node.js 20
echo "📦 Step 2: Installing Node.js 20..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo "⚠️  Node.js already installed: $NODE_VERSION"
    read -p "Do you want to reinstall? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo "✅ Node.js installed: $(node --version)"
echo "✅ npm installed: $(npm --version)"
echo ""

# Install Yarn (optional but recommended)
echo "📦 Step 3: Installing Yarn..."
if ! command_exists yarn; then
    npm install -g yarn
    echo "✅ Yarn installed: $(yarn --version)"
else
    echo "✅ Yarn already installed: $(yarn --version)"
fi
echo ""

# Install Rust
echo "📦 Step 4: Installing Rust..."
if command_exists rustc; then
    echo "⚠️  Rust already installed: $(rustc --version)"
    read -p "Do you want to update? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rustup update
    fi
else
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi
echo "✅ Rust installed: $(rustc --version)"
echo ""

# Install essential build tools
echo "📦 Step 5: Installing build essentials..."
sudo apt install -y \
    build-essential \
    git \
    curl \
    wget \
    unzip \
    openjdk-17-jdk \
    adb \
    fastboot
echo "✅ Build tools installed"
echo ""

# Install Android SDK
echo "📦 Step 6: Setting up Android SDK..."
echo "⚠️  Android SDK requires manual setup."
echo ""
echo "Please follow these steps:"
echo "1. Download Android Studio from: https://developer.android.com/studio"
echo "2. Or install command-line tools:"
echo "   wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip"
echo "3. Follow Android Studio setup wizard"
echo "4. Install Android SDK Platform 34 (for Pixel 9 Pro)"
echo ""
read -p "Have you installed Android SDK? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Please install Android SDK and run this script again"
    echo "Or continue manually after installing SDK"
fi
echo ""

# Install React Native CLI
echo "📦 Step 7: Installing React Native CLI..."
if ! command_exists react-native; then
    npm install -g react-native-cli
    echo "✅ React Native CLI installed"
else
    echo "✅ React Native CLI already installed"
fi
echo ""

# Install Watchman (for React Native)
echo "📦 Step 8: Installing Watchman..."
if ! command_exists watchman; then
    cd /tmp
    wget https://github.com/facebook/watchman/releases/download/v2023.11.20.00/watchman-v2023.11.20.00-linux.zip
    unzip watchman-v2023.11.20.00-linux.zip
    cd watchman-v2023.11.20.00-linux
    sudo mkdir -p /usr/local/{bin,lib} /usr/local/var/run/watchman
    sudo cp bin/* /usr/local/bin
    sudo cp lib/* /usr/local/lib
    sudo chmod 755 /usr/local/bin/watchman
    sudo chmod 2777 /usr/local/var/run/watchman
    cd ~
    echo "✅ Watchman installed"
else
    echo "✅ Watchman already installed"
fi
echo ""

# Setup environment variables
echo "📦 Step 9: Setting up environment variables..."
ANDROID_HOME_PATH="$HOME/Android/Sdk"
if [ ! -d "$ANDROID_HOME_PATH" ]; then
    echo "⚠️  Android SDK not found at $ANDROID_HOME_PATH"
    echo "Please update ANDROID_HOME in your ~/.bashrc after installing SDK"
else
    # Add to bashrc if not already present
    if ! grep -q "ANDROID_HOME" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# Android SDK" >> ~/.bashrc
        echo "export ANDROID_HOME=\$HOME/Android/Sdk" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/emulator" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.bashrc
        echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin" >> ~/.bashrc
        echo "✅ Environment variables added to ~/.bashrc"
        echo "⚠️  Run 'source ~/.bashrc' to apply changes"
    else
        echo "✅ Environment variables already set"
    fi
fi
echo ""

# Create project directory
echo "📦 Step 10: Creating project directory..."
CIRKELLINE_DIR="$HOME/cirkelline-workspace"
mkdir -p "$CIRKELLINE_DIR"
cd "$CIRKELLINE_DIR"
echo "✅ Project directory created at: $CIRKELLINE_DIR"
echo ""

# Summary
echo "=================================================="
echo "🎉 SETUP COMPLETE!"
echo "=================================================="
echo ""
echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Rust: $(rustc --version)"
echo "✅ React Native CLI: Installed"
echo "✅ Project directory: $CIRKELLINE_DIR"
echo ""
echo "📱 NEXT STEPS:"
echo "1. Enable Developer Options on your Pixel 9 Pro:"
echo "   Settings > About Phone > Tap 'Build Number' 7 times"
echo "2. Enable USB Debugging:"
echo "   Settings > System > Developer Options > USB Debugging"
echo "3. Connect your Pixel 9 Pro via USB"
echo "4. Run: adb devices (should show your device)"
echo ""
echo "🚀 Ready to create the Cirkelline app!"
echo "Next: I'll create the React Native project structure"
echo ""
