/**
 * Game Development Utilities
 * Enhanced tools for QNCE game prototyping
 */

// Game Performance Monitor
export class GamePerformanceMonitor {
  private startTime: number = Date.now();
  private frameCount: number = 0;
  private lastFrameTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      window.qncePerformance = {
        startTime: this.startTime,
        transitions: 0,
        memorySnapshots: []
      };
    }
  }

  recordTransition(transitionTime: number) {
    if (window.qncePerformance) {
      window.qncePerformance.transitions++;
    }
    console.log(`🎮 Game Transition: ${transitionTime.toFixed(2)}ms`);
  }

  recordMemorySnapshot() {
    if (window.qncePerformance && (window.performance as any).memory) {
      const memory = (window.performance as any).memory.usedJSHeapSize;
      window.qncePerformance.memorySnapshots.push(memory);
      console.log(`🧠 Memory: ${(memory / 1024 / 1024).toFixed(1)}MB`);
    }
  }

  getStats() {
    return {
      uptime: Date.now() - this.startTime,
      transitions: window.qncePerformance?.transitions || 0,
      averageMemory: window.qncePerformance?.memorySnapshots?.length 
        ? window.qncePerformance.memorySnapshots.reduce((a, b) => a + b, 0) / window.qncePerformance.memorySnapshots.length
        : 0
    };
  }
}

// Game State Synchronizer
export class GameStateSynchronizer {
  private qnceState: any = null;
  private gameState: any = null;

  syncQNCEToGame(qnceState: any, gameStateSetter: (updater: (prev: any) => any) => void) {
    this.qnceState = qnceState;
    
    // Example sync logic - can be customized per game type
    gameStateSetter(prev => ({
      ...prev,
      storyProgress: qnceState.history?.length || 0,
      currentFlags: qnceState.flags || {},
      narrativeContext: qnceState.currentNodeId
    }));
  }

  syncGameToQNCE(gameState: any, qnceEngine: any) {
    this.gameState = gameState;
    
    // Custom flags based on game state
    if (gameState.level > 5) {
      // High level player - could unlock special story branches
    }
    
    if (gameState.resources?.gold > 1000) {
      // Wealthy player - different story options
    }
  }
}

// Game Debug Console
export class GameDebugConsole {
  constructor() {
    if (typeof window !== 'undefined') {
      window.gameDebug = {
        qnce: null,
        performance: null,
        state: null
      };
    }
  }

  attachQNCE(qnceInstance: any) {
    if (window.gameDebug) {
      window.gameDebug.qnce = qnceInstance;
      console.log('🔗 QNCE Engine attached to debug console');
    }
  }

  logGameEvent(event: string, data?: any) {
    console.log(`🎮 Game Event: ${event}`, data);
  }

  logPerformanceMetric(metric: string, value: number, unit: string = 'ms') {
    console.log(`⚡ Performance: ${metric} = ${value}${unit}`);
  }
}

// Export singleton instances
export const gamePerformanceMonitor = new GamePerformanceMonitor();
export const gameStateSynchronizer = new GameStateSynchronizer();
export const gameDebugConsole = new GameDebugConsole();
