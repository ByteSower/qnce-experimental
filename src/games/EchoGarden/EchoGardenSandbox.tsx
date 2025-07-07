import React, { useState } from 'react';
import { EnergyMeter } from '../../components/EnergyMeter';
import { GrowthNarrator } from '../../components/GrowthNarrator';
import { PerformanceMonitor, type PerformanceMetrics } from '../../components/PerformanceMonitor';
import { useEnergy } from '../../hooks/useEnergy';
import { useGrowthMilestones } from '../../hooks/useGrowthMilestones';

/**
 * EchoGarden Development Sandbox
 * Live testing environment for EnergyMeter component with narrative integration
 */
export const EchoGardenSandbox: React.FC = () => {
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const [narrativeFlags, setNarrativeFlags] = useState<Record<string, any>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);

  // Enhanced energy system with narrative integration
  const narrativeEnergy = useEnergy({ 
    start: 0, 
    rate: 1, 
    intervalMs: 2000, // Faster for demo
    cap: 100 
  });

  const [reachedMilestones, setReachedMilestones] = useState<Set<number>>(new Set());

  // Use the new useGrowthMilestones hook with callback-based API
  useGrowthMilestones({
    milestones: [10, 25, 50],
    currentEnergy: narrativeEnergy.energy,
    onMilestone: (milestone) => {
      console.log(`🌱 Milestone reached: ${milestone} GP!`);
      setCurrentMilestone(milestone);
      setReachedMilestones(prev => new Set([...prev, milestone]));
    }
  });

  // Calculate milestone progress
  const milestoneThresholds = [10, 25, 50];
  const nextMilestone = milestoneThresholds.find(threshold => 
    !reachedMilestones.has(threshold) && threshold > narrativeEnergy.energy
  );
  const lastMilestone = [...reachedMilestones].sort((a, b) => b - a)[0] || null;
  const progressToNext = nextMilestone ? 
    Math.min(narrativeEnergy.energy / nextMilestone, 1) : 1;

  const handleNarrativeComplete = (threshold: number, flags: Record<string, any>) => {
    console.log(`Narrative complete for milestone ${threshold}:`, flags);
    setNarrativeFlags(prev => ({ ...prev, ...flags }));
    setCurrentMilestone(null);
  };

  const handleCloseNarrative = () => {
    setCurrentMilestone(null);
  };

  const handlePerformanceUpdate = (metrics: PerformanceMetrics) => {
    setPerformanceMetrics(metrics);
    
    // Log performance alerts for development
    if (metrics.transitionTime > 3.5) {
      console.warn('⚠️ Transition time exceeds target:', metrics.transitionTime + 'ms');
    }
    if (metrics.cacheHitRate < 95) {
      console.warn('⚠️ Cache hit rate below target:', metrics.cacheHitRate + '%');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🌱 EchoGarden Narrative Sandbox
          </h1>
          <p className="text-slate-600 mb-4">
            Testing EnergyMeter with integrated QNCE narrative milestones and performance monitoring
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowPerformanceDetails(!showPerformanceDetails)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                showPerformanceDetails 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {showPerformanceDetails ? '📊 Hide Performance' : '📊 Show Performance'}
            </button>
            
            {performanceMetrics && (
              <div className="flex items-center gap-4 text-sm">
                <div className={`px-2 py-1 rounded ${
                  performanceMetrics.transitionTime <= 3.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  ⚡ {performanceMetrics.transitionTime.toFixed(2)}ms
                </div>
                <div className={`px-2 py-1 rounded ${
                  performanceMetrics.cacheHitRate >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  📈 {performanceMetrics.cacheHitRate.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </header>

        {/* QNCE Performance Monitor */}
        {showPerformanceDetails && (
          <PerformanceMonitor 
            isActive={true}
            onMetricsUpdate={handlePerformanceUpdate}
            maxSamples={50}
          />
        )}

        {/* Narrative Energy System */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">
            🌿 Narrative Growth System
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Energy Display */}
            <div className="lg:col-span-2">
              <EnergyMeter 
                config={{ 
                  start: 0, 
                  rate: 1, 
                  intervalMs: 2000, 
                  cap: 100 
                }}
                labelFormat={(energy, cap) => `Growth Points: ${energy}/${cap}`}
                energyState={narrativeEnergy}
              />
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    console.log('Water button clicked, current energy:', narrativeEnergy.energy);
                    narrativeEnergy.addEnergy(5);
                  }}
                  disabled={narrativeEnergy.isMaxed}
                  className={`px-4 py-2 rounded transition-colors ${
                    narrativeEnergy.isMaxed 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                  }`}
                >
                  💧 Water (+5 GP) {narrativeEnergy.isMaxed ? '(Max)' : ''}
                </button>
                <button 
                  onClick={() => {
                    console.log('Reset button clicked');
                    narrativeEnergy.resetEnergy();
                    setCurrentMilestone(null);
                    setNarrativeFlags({});
                  }}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 active:bg-orange-700 transition-colors"
                >
                  🌱 Restart Growth
                </button>
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-3 text-gray-700">Milestone Progress</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Next Milestone:</span>
                  <span className="font-mono">{nextMilestone || 'Complete!'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span className="font-mono">{Math.round(progressToNext * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Reached:</span>
                  <span className="font-mono">{lastMilestone || 'None'}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">Reached Milestones:</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(reachedMilestones).map(threshold => (
                    <span 
                      key={threshold}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                    >
                      {threshold}
                    </span>
                  ))}
                </div>
              </div>

              {Object.keys(narrativeFlags).length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Narrative Flags:</div>
                  <div className="space-y-1">
                    {Object.entries(narrativeFlags).map(([flag, value]) => (
                      <div key={flag} className="text-xs flex justify-between">
                        <span className="text-blue-600">{flag}:</span>
                        <span className="font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">🎯 Testing Instructions:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Watch energy grow automatically (accelerated for demo)</li>
              <li>• Milestones trigger at 10, 25, and 50 Growth Points</li>
              <li>• Use "Water" button to speed up milestone testing</li>
              <li>• Narrative modals appear when milestones are reached</li>
              <li>• Choices affect narrative flags visible in the sidebar</li>
              <li>• Reset to test the complete narrative flow again</li>
            </ul>
          </div>
        </div>

        {/* Original Sandbox Configurations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            ⚗️ Component Testing Grid
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Default Configuration */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">
                Default Configuration
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Start: 0, Rate: 1 GP/5s, Cap: 100
              </p>
              <EnergyMeter />
            </div>

            {/* Fast Accrual */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">
                Fast Accrual
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Start: 10, Rate: 3 GP/2s, Cap: 150
              </p>
              <EnergyMeter 
                config={{ 
                  start: 10, 
                  rate: 3, 
                  intervalMs: 2000, 
                  cap: 150 
                }}
              />
            </div>

            {/* Near Maximum */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">
                Near Maximum
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Start: 85, Rate: 2 GP/3s, Cap: 100
              </p>
              <EnergyMeter 
                config={{ 
                  start: 85, 
                  rate: 2, 
                  intervalMs: 3000, 
                  cap: 100 
                }}
              />
            </div>

            {/* Custom Sizing & Labels */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">
                Custom Styling
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Custom size and label format
              </p>
              <EnergyMeter 
                width={400}
                height={32}
                labelFormat={(energy, cap) => `⚡ Energy: ${energy}/${cap} Units`}
                config={{ 
                  start: 25, 
                  rate: 1, 
                  intervalMs: 4000, 
                  cap: 80 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Modal */}
      <GrowthNarrator 
        milestoneEvent={currentMilestone}
        onNarrativeComplete={handleNarrativeComplete}
        onClose={handleCloseNarrative}
      />
    </div>
  );
};
