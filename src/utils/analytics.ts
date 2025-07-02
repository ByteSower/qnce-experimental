/**
 * Simple analytics for experimental environment
 * Logs events to console for development tracking
 */

export const analytics = {
  trackEvent: (event: string, category: string, label?: string) => {
    console.log('📊 Analytics:', { event, category, label, timestamp: new Date() });
  }
};

export const trackStoryEvent = {
  choice: (nodeId: string) => {
    analytics.trackEvent('story_choice', 'narrative', nodeId);
  },
  progress: (nodeId: string) => {
    analytics.trackEvent('story_progress', 'narrative', nodeId);
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
