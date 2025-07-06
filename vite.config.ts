import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Force the correct root directory to prevent VS Code Insiders from using parent directory
const projectRoot = __dirname;

// https://vitejs.dev/config/
export default defineConfig({
  root: projectRoot, // Explicitly set root to current directory
  plugins: [react()],
  server: {
    port: 3000,
    open: false, // Don't auto-open browser (we use Simple Browser)
    host: true, // Allow external connections for testing
    hmr: {
      overlay: true // Show HMR errors as overlay
    },
    // Workaround for Console Ninja extension conflicts
    middlewareMode: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: false, // Keep readable for debugging game prototypes
    rollupOptions: {
      output: {
        manualChunks: {
          'qnce-engine': ['qnce-engine'],
          'react-vendor': ['react', 'react-dom'],
          'game-prototypes': ['./src/games/GamePrototype.tsx']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@games': '/src/games',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@echo': '/src/games/EchoGarden',
      '@kairos': '/src/games/KAIROS'
    }
  },
  optimizeDeps: {
    include: ['qnce-engine'] // Pre-bundle QNCE engine for faster dev
  },
  define: {
    __GAME_DEV_MODE__: true, // Custom flag for game development features
    __QNCE_PERFORMANCE_MONITORING__: true
  }
})
