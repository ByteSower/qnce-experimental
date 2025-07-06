/**
 * Enhanced analytics for experimental environment
 * Comprehensive game development tracking with QNCE performance monitoring
 */

// Enhanced analytics class for game development
export class ExperimentalAnalytics {
  private static instance: ExperimentalAnalytics;
  private events: Array<{
    timestamp: number;
    event: string;
    category: string;
    label?: string;
    data?: any;
    gameType?: string;
    qnceState?: any;
  }> = [];

  static getInstance(): ExperimentalAnalytics {
    if (!ExperimentalAnalytics.instance) {
      ExperimentalAnalytics.instance = new ExperimentalAnalytics();
    }
    return ExperimentalAnalytics.instance;
  }

  trackEvent(event: string, category: string, label?: string, data?: any): void {
    const eventData = {
      timestamp: Date.now(),
      event,
      category,
      ...(label && { label }),
      ...(data && { data })
    };
    
    this.events.push(eventData);
    console.log('📊 Analytics:', eventData);
  }

  // Game-specific tracking methods
  trackGameEvent(gameType: string, event: string, category: string, data?: any, qnceState?: any): void {
    const eventData = {
      timestamp: Date.now(),
      event: `game_${event}`,
      category: `${gameType}_${category}`,
      gameType,
      ...(data && { data }),
      ...(qnceState && { qnceState })
    };
    
    this.events.push(eventData);
    console.log(`🎮 Game Analytics [${gameType}]:`, eventData);
  }

  trackQNCEPerformance(operation: string, duration: number, gameType?: string): void {
    this.trackGameEvent(gameType || 'unknown', 'qnce_performance', 'performance', {
      operation,
      duration,
      performanceNow: performance.now()
    });
  }

  trackGameMechanicTest(gameType: string, mechanic: string, result: any): void {
    this.trackGameEvent(gameType, 'mechanic_test', 'gameplay', {
      mechanic,
      result,
      sessionId: this.getSessionId()
    });
  }

  getGameEvents(gameType?: string): typeof this.events {
    if (gameType) {
      return this.events.filter(event => event.gameType === gameType);
    }
    return [...this.events];
  }

  getPerformanceMetrics(): any {
    const perfEvents = this.events.filter(event => 
      event.event === 'game_qnce_performance'
    );
    
    return {
      totalOperations: perfEvents.length,
      averageDuration: perfEvents.length ? 
        perfEvents.reduce((sum, event) => sum + (event.data?.duration || 0), 0) / perfEvents.length : 0,
      byGameType: perfEvents.reduce((acc, event) => {
        const type = event.gameType || 'unknown';
        if (!acc[type]) acc[type] = [];
        acc[type].push(event.data?.duration || 0);
        return acc;
      }, {} as Record<string, number[]>)
    };
  }

  getEvents(): typeof this.events {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  private getSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
const analyticsInstance = ExperimentalAnalytics.getInstance();

// Legacy API for backward compatibility
export const analytics = {
  trackEvent: (event: string, category: string, label?: string) => {
    analyticsInstance.trackEvent(event, category, label);
  }
};

// Enhanced tracking utilities
export const trackStoryEvent = {
  choice: (nodeId: string, gameType?: string, qnceState?: any) => {
    if (gameType) {
      analyticsInstance.trackGameEvent(gameType, 'choice', 'narrative', { nodeId }, qnceState);
    } else {
      analytics.trackEvent('story_choice', 'narrative', nodeId);
    }
  },
  progress: (nodeId: string, gameType?: string, qnceState?: any) => {
    if (gameType) {
      analyticsInstance.trackGameEvent(gameType, 'progress', 'narrative', { nodeId }, qnceState);
    } else {
      analytics.trackEvent('story_progress', 'narrative', nodeId);
    }
  }
};

export const trackUIEvent = {
  feature: (feature: string, action: string) => {
    analytics.trackEvent('ui_interaction', feature, action);
  },
  help: (section: string) => {
    analytics.trackEvent('help_accessed', 'ui', section);
  }
};

// Game-specific tracking utilities
export const trackGameEvent = {
  mechanic: (gameType: string, mechanic: string, result: any) => {
    analyticsInstance.trackGameMechanicTest(gameType, mechanic, result);
  },
  performance: (operation: string, duration: number, gameType?: string) => {
    analyticsInstance.trackQNCEPerformance(operation, duration, gameType);
  },
  state: (gameType: string, state: any, qnceState?: any) => {
    analyticsInstance.trackGameEvent(gameType, 'state_change', 'gameplay', state, qnceState);
  }
};

// Export enhanced analytics instance
export { analyticsInstance as gameAnalytics };
