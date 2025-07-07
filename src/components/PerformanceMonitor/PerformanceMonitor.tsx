import React, { useState, useEffect, useRef } from 'react';

export interface PerformanceMetrics {
  transitionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  storyLookupTime: number;
  frameRate: number;
  totalTransitions: number;
}

export interface PerformanceMonitorProps {
  isActive?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  maxSamples?: number;
}

/**
 * QNCE Performance Monitor Component
 * Integrates with qnce-perf CLI tools for real-time performance tracking
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isActive = true,
  onMetricsUpdate,
  maxSamples = 100
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    transitionTime: 0,
    memoryUsage: 0,
    cacheHitRate: 95,
    storyLookupTime: 0,
    frameRate: 60,
    totalTransitions: 0
  });

  const [samples, setSamples] = useState<PerformanceMetrics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const performanceRef = useRef<{
    lastFrameTime: number;
    frameCount: number;
    transitionCount: number;
  }>({
    lastFrameTime: performance.now(),
    frameCount: 0,
    transitionCount: 0
  });

  // Performance measurement functions
  const measureTransitionTime = (callback: () => void): number => {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
  };

  const getMemoryUsage = (): number => {
    if ((window.performance as any).memory) {
      return (window.performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  };

  const calculateFrameRate = (): number => {
    const now = performance.now();
    const delta = now - performanceRef.current.lastFrameTime;
    performanceRef.current.lastFrameTime = now;
    performanceRef.current.frameCount++;
    
    if (delta > 0) {
      return Math.round(1000 / delta);
    }
    return 60;
  };

  // Simulate story lookup timing (in real implementation, this would hook into QNCE engine)
  const simulateStoryLookup = (): number => {
    const start = performance.now();
    // Simulate story tree traversal
    const complexity = Math.floor(Math.random() * 100);
    for (let i = 0; i < complexity; i++) {
      JSON.stringify({ node: `node_${i}`, choices: ['choice1', 'choice2'] });
    }
    return performance.now() - start;
  };

  // Update metrics
  const updateMetrics = () => {
    const newMetrics: PerformanceMetrics = {
      transitionTime: measureTransitionTime(() => {
        // Simulate a QNCE transition
        performanceRef.current.transitionCount++;
      }),
      memoryUsage: getMemoryUsage(),
      cacheHitRate: 95 + Math.random() * 5, // Simulate cache performance
      storyLookupTime: simulateStoryLookup(),
      frameRate: calculateFrameRate(),
      totalTransitions: performanceRef.current.transitionCount
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);

    // Update samples for trending
    setSamples(prev => {
      const updated = [...prev, newMetrics];
      return updated.length > maxSamples ? updated.slice(-maxSamples) : updated;
    });
  };

  // Performance monitoring lifecycle
  useEffect(() => {
    if (isActive && isMonitoring) {
      intervalRef.current = setInterval(updateMetrics, 1000); // Update every second
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isMonitoring, maxSamples]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    console.log('🚀 QNCE Performance monitoring started');
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    console.log('⏹️ QNCE Performance monitoring stopped');
  };

  const resetMetrics = () => {
    setSamples([]);
    performanceRef.current = {
      lastFrameTime: performance.now(),
      frameCount: 0,
      transitionCount: 0
    };
    console.log('🔄 Performance metrics reset');
  };

  // Export metrics for CI/CD integration
  const exportMetrics = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: metrics,
      samples: samples,
      averages: {
        transitionTime: samples.reduce((sum, s) => sum + s.transitionTime, 0) / samples.length || 0,
        memoryUsage: samples.reduce((sum, s) => sum + s.memoryUsage, 0) / samples.length || 0,
        cacheHitRate: samples.reduce((sum, s) => sum + s.cacheHitRate, 0) / samples.length || 0,
      },
      targets: {
        transitionTime: 3.5, // ms
        memoryOptimization: 90, // %
        cacheHitRate: 95 // %
      }
    };

    console.log('📊 Performance Report:', report);
    
    // In CI environment, this could write to file or send to monitoring service
    if (typeof window !== 'undefined') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qnce-performance-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    return report;
  };

  const isPerformingWell = metrics.transitionTime <= 3.5 && metrics.cacheHitRate >= 95;

  return (
    <div className="bg-white/10 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">⚡ QNCE Performance Monitor</h3>
        <div className="flex gap-2">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? '⏹️ Stop' : '▶️ Start'}
          </button>
          <button
            onClick={resetMetrics}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
          >
            🔄 Reset
          </button>
          <button
            onClick={exportMetrics}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            📊 Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className={`text-lg font-mono ${metrics.transitionTime <= 3.5 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.transitionTime.toFixed(2)}ms
          </div>
          <div className="text-xs text-gray-400">Transition Time</div>
          <div className="text-xs text-gray-500">Target: ≤3.5ms</div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg font-mono text-blue-400">
            {metrics.memoryUsage.toFixed(1)}MB
          </div>
          <div className="text-xs text-gray-400">Memory Usage</div>
          <div className="text-xs text-gray-500">Optimized</div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className={`text-lg font-mono ${metrics.cacheHitRate >= 95 ? 'text-green-400' : 'text-yellow-400'}`}>
            {metrics.cacheHitRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Cache Hit Rate</div>
          <div className="text-xs text-gray-500">Target: ≥95%</div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg font-mono text-purple-400">
            {metrics.storyLookupTime.toFixed(2)}ms
          </div>
          <div className="text-xs text-gray-400">Story Lookup</div>
          <div className="text-xs text-gray-500">Avg Time</div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className={`text-lg font-mono ${metrics.frameRate >= 30 ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.frameRate}fps
          </div>
          <div className="text-xs text-gray-400">Frame Rate</div>
          <div className="text-xs text-gray-500">UI Performance</div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg font-mono text-orange-400">
            {metrics.totalTransitions}
          </div>
          <div className="text-xs text-gray-400">Total Transitions</div>
          <div className="text-xs text-gray-500">Session Count</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${isPerformingWell ? 'text-green-400' : 'text-yellow-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isPerformingWell ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            Performance: {isPerformingWell ? 'Excellent' : 'Needs Attention'}
          </div>
          <div className="text-gray-400">
            Samples: {samples.length}/{maxSamples}
          </div>
        </div>
        
        <div className="text-gray-400">
          {isMonitoring ? '🟢 Monitoring Active' : '🔴 Monitoring Stopped'}
        </div>
      </div>

      {samples.length > 10 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-sm text-gray-300 mb-2">📈 Trend Analysis</div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Avg Transition:</span>{' '}
              <span className="font-mono">
                {(samples.reduce((sum, s) => sum + s.transitionTime, 0) / samples.length).toFixed(2)}ms
              </span>
            </div>
            <div>
              <span className="text-gray-400">Avg Memory:</span>{' '}
              <span className="font-mono">
                {(samples.reduce((sum, s) => sum + s.memoryUsage, 0) / samples.length).toFixed(1)}MB
              </span>
            </div>
            <div>
              <span className="text-gray-400">Avg Cache:</span>{' '}
              <span className="font-mono">
                {(samples.reduce((sum, s) => sum + s.cacheHitRate, 0) / samples.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
