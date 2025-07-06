/**
 * useGrowthMilestones Hook
 * 
 * Watches energy levels and triggers narrative milestones when specific thresholds are reached.
 * Ensures each milestone only fires once and manages QNCE narrative integration.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GROWTH_THRESHOLDS, type GrowthThreshold } from '../narratives/echoGarden/growthMilestones';

export interface GrowthMilestoneEvent {
  threshold: GrowthThreshold;
  previousEnergy: number;
  currentEnergy: number;
  isFirstTime: boolean;
}

export interface UseGrowthMilestonesConfig {
  onMilestoneReached?: (event: GrowthMilestoneEvent) => void;
  enabledThresholds?: GrowthThreshold[];
}

export interface UseGrowthMilestonesReturn {
  reachedMilestones: Set<GrowthThreshold>;
  lastMilestone: GrowthThreshold | null;
  nextMilestone: GrowthThreshold | null;
  progressToNext: number; // 0-1 progress to next milestone
  resetMilestones: () => void;
  hasMilestone: (threshold: GrowthThreshold) => boolean;
}

export const useGrowthMilestones = (
  currentEnergy: number,
  config: UseGrowthMilestonesConfig = {}
): UseGrowthMilestonesReturn => {
  const {
    onMilestoneReached,
    enabledThresholds = GROWTH_THRESHOLDS
  } = config;

  // Track which milestones have been reached
  const [reachedMilestones, setReachedMilestones] = useState<Set<GrowthThreshold>>(() => {
    // Initialize with already-passed milestones
    const initialMilestones = new Set<GrowthThreshold>();
    enabledThresholds.forEach(threshold => {
      if (threshold <= currentEnergy) {
        initialMilestones.add(threshold);
      }
    });
    return initialMilestones;
  });
  
  // Track previous energy to detect threshold crossings
  const previousEnergyRef = useRef<number>(currentEnergy);
  
  // Track last milestone for easy access
  const [lastMilestone, setLastMilestone] = useState<GrowthThreshold | null>(() => {
    // Initialize with the highest already-passed milestone
    const passedMilestones = enabledThresholds.filter(threshold => threshold <= currentEnergy);
    return passedMilestones.length > 0 ? Math.max(...passedMilestones) as GrowthThreshold : null;
  });

  // Calculate next milestone and progress
  const nextMilestone = enabledThresholds.find(threshold => 
    !reachedMilestones.has(threshold) && threshold > currentEnergy
  ) || null;

  const progressToNext = nextMilestone ? 
    Math.min(currentEnergy / nextMilestone, 1) : 1;

  // Check for milestone crossings
  useEffect(() => {
    const previousEnergy = previousEnergyRef.current;
    
    // Only check if energy increased
    if (currentEnergy <= previousEnergy) {
      previousEnergyRef.current = currentEnergy;
      return;
    }

    // Find newly crossed thresholds
    const newlyReached = enabledThresholds.filter(threshold => 
      threshold > previousEnergy && 
      threshold <= currentEnergy && 
      !reachedMilestones.has(threshold)
    );

    if (newlyReached.length > 0) {
      // Update reached milestones
      setReachedMilestones(prev => {
        const updated = new Set(prev);
        newlyReached.forEach(threshold => updated.add(threshold));
        return updated;
      });

      // Update last milestone to the highest newly reached
      const highestNew = Math.max(...newlyReached) as GrowthThreshold;
      setLastMilestone(highestNew);

      // Fire callbacks for each newly reached milestone
      newlyReached.forEach(threshold => {
        const event: GrowthMilestoneEvent = {
          threshold,
          previousEnergy,
          currentEnergy,
          isFirstTime: true
        };

        onMilestoneReached?.(event);
      });
    }

    previousEnergyRef.current = currentEnergy;
  }, [currentEnergy, enabledThresholds, reachedMilestones, onMilestoneReached]);

  // Reset all milestones (useful for testing or restarting)
  const resetMilestones = useCallback(() => {
    setReachedMilestones(new Set());
    setLastMilestone(null);
    previousEnergyRef.current = currentEnergy; // Reset to current energy to prevent re-detection
  }, [currentEnergy]);

  // Check if a specific milestone has been reached
  const hasMilestone = useCallback((threshold: GrowthThreshold) => {
    return reachedMilestones.has(threshold);
  }, [reachedMilestones]);

  return {
    reachedMilestones,
    lastMilestone,
    nextMilestone,
    progressToNext,
    resetMilestones,
    hasMilestone
  };
};
