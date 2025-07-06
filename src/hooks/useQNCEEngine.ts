/**
 * EXPERIMENTAL: QNCE Engine Integration Hook
 * 
 * This is an experimental implementation that tests integrating the standalone
 * QNCE engine package with our existing Quantum Chronicles implementation.
 * 
 * Purpose: Evaluate performance improvements and advanced features
 * Status: Experimental - for testing and evaluation only
 */

import { useState, useCallback, useEffect } from 'react';
import { trackStoryEvent } from '../utils/analytics';
import { createQNCEEngine, DEMO_STORY, type QNCEEngine } from 'qnce-engine';

// Now using the real QNCE engine package!

// Experimental QNCE Engine Hook using real package
export const useQNCEEngine = () => {
  // Initialize with the real QNCE engine using DEMO_STORY
  const [engine] = useState<QNCEEngine>(() => createQNCEEngine(DEMO_STORY));
  const [engineState, setEngineState] = useState(() => engine.getState());

  const [performance, setPerformance] = useState({
    lastTransitionTime: 0,
    totalTransitions: 0,
    averageTransitionTime: 0,
    memoryUsage: 0,
  });

  // Real QNCE engine choice handling
  const makeChoice = useCallback((choiceIndex: number) => {
    const startTime = window.performance.now();
    
    // Use the real engine's selectChoice method with choice object
    const availableChoices = engine.getAvailableChoices();
    const choice = availableChoices[choiceIndex];
    
    if (choice) {
      engine.selectChoice(choice);
      const newState = engine.getState();
      setEngineState(newState);
      trackStoryEvent.choice(newState.currentNodeId);
    }
    
    const endTime = window.performance.now();
    const transitionTime = endTime - startTime;
    
    setPerformance(prev => ({
      lastTransitionTime: transitionTime,
      totalTransitions: prev.totalTransitions + 1,
      averageTransitionTime: (prev.averageTransitionTime * prev.totalTransitions + transitionTime) / (prev.totalTransitions + 1),
      memoryUsage: (window.performance as any).memory?.usedJSHeapSize || 0,
    }));
  }, [engine]);

  // Real QNCE engine reset
  const reset = useCallback(() => {
    engine.resetNarrative();
    setEngineState(engine.getState());
  }, [engine]);

  // Experimental: Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window.performance as any).memory) {
        setPerformance(prev => ({
          ...prev,
          memoryUsage: (window.performance as any).memory.usedJSHeapSize,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Experimental: Background processing simulation
  const backgroundProcess = useCallback(() => {
    // Simulate cache preloading and optimization
    console.log('QNCE Engine: Background processing active');
  }, []);

  useEffect(() => {
    backgroundProcess();
  }, [backgroundProcess]);

  return {
    // Engine interface - using real QNCE engine
    currentNode: engine.getCurrentNode(),
    state: engineState,
    makeChoice,
    reset,
    
    // Performance metrics (experimental)
    performance,
    
    // Advanced features (experimental)
    experimental: {
      backgroundProcess,
      getProfileData: () => performance,
      enableHotReload: () => console.log('Hot-reload enabled (experimental)'),
      generateAIContent: () => console.log('AI content generation (experimental)'),
      // Real QNCE engine features
      preloadNextNodes: () => engine.preloadNextNodes(),
      warmCache: () => engine.warmCache(),
      getBranchingEngine: () => engine.getBranchingEngine(),
      getActiveFlows: () => engine.getActiveFlows(),
    }
  };
};

export default useQNCEEngine;
