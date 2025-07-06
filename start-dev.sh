#!/bin/bash

echo "🚀 Starting QNCE Experimental Dev Server..."
echo "🔧 Working around VS Code Insiders extension conflicts..."

# Force correct working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📍 Working in directory: $(pwd)"
echo "🔧 Ensuring we're in the qnce-experimental folder..."

# Verify we're in the right directory
if [[ ! -f "vite.config.ts" ]]; then
    echo "❌ ERROR: vite.config.ts not found. Are we in the wrong directory?"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Kill any existing processes on common dev ports
echo "🧹 Cleaning up any existing servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Wait a moment for cleanup
sleep 1

echo "📦 Starting Vite dev server from: $(pwd)"
npx vite --port 3000 --host --no-open

echo "✅ Server should be running at http://localhost:3000/"
