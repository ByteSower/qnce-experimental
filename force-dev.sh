#!/bin/bash

# FORCE CORRECT DIRECTORY - VS Code Insiders Fix
# This script absolutely forces the correct working directory

echo "🚀 QNCE Dev Server - Force Directory Fix"
echo "==========================================="

# Absolute path to the qnce-experimental directory
QNCE_DIR="/Users/ball/VSE-WS/qnce-experimental"

echo "🔧 Forcing directory to: $QNCE_DIR"
cd "$QNCE_DIR" || {
    echo "❌ ERROR: Cannot change to $QNCE_DIR"
    exit 1
}

echo "📍 Current directory: $(pwd)"
echo "✅ Verifying project files..."

# Verify we're in the right place
if [[ ! -f "package.json" ]]; then
    echo "❌ ERROR: package.json not found!"
    exit 1
fi

if [[ ! -f "vite.config.ts" ]]; then
    echo "❌ ERROR: vite.config.ts not found!"
    exit 1
fi

echo "✅ Project files verified"

# Kill any existing dev servers
echo "🧹 Cleaning up existing servers..."
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start the server with explicit working directory
echo "🚀 Starting Vite dev server..."
echo "   Working directory: $(pwd)"
echo "   Command: npx vite --port 3000 --host"

npx vite --port 3000 --host
