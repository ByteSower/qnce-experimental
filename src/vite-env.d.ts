/// <reference types="vite/client" />

// Game Development Environment Variables
interface ImportMetaEnv {
  readonly VITE_GAME_MODE: string
  readonly VITE_QNCE_DEBUG: string
  readonly VITE_PERFORMANCE_MONITORING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global Game Development Flags
declare const __GAME_DEV_MODE__: boolean;
declare const __QNCE_PERFORMANCE_MONITORING__: boolean;

// Enhanced Window Interface for Game Development
declare global {
  interface Window {
    // Game Debug Tools
    gameDebug?: {
      qnce: any;
      performance: any;
      state: any;
    };
    
    // Performance Monitoring
    qncePerformance?: {
      startTime: number;
      transitions: number;
      memorySnapshots: number[];
    };
  }
}

export {};
