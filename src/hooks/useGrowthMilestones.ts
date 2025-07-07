/**
 * PLAN for useGrowthMilestones hook:
 *
 * 1. Receive: milestones (number[]), currentEnergy (number), onMilestone callback.
 * 2. Maintain a ref or state of which milestones have fired.
 * 3. On each energy change:
 *    a. For each milestone not yet fired, if energy >= milestone, call onMilestone(milestone) and mark it fired.
 *    b. If energy resets below the first milestone, clear fired flags so milestones can fire again.
 * 4. Clean up any listeners on unmount.
 *
 * Then implement the hook with useEffect, useRef, and proper TypeScript typings.
 */

import { useEffect, useRef } from 'react';

export interface UseGrowthMilestonesOptions {
  /**
   * Array of milestone thresholds (e.g., [10, 25, 50])
   */
  milestones: number[];
  
  /**
   * Current energy value to watch
   */
  currentEnergy: number;
  
  /**
   * Callback fired when a milestone is reached for the first time
   * @param milestone - The milestone threshold that was reached
   */
  onMilestone: (milestone: number) => void;
}

/**
 * Hook that watches energy levels and fires milestone callbacks exactly once per threshold.
 * 
 * @param options - Configuration object with milestones, currentEnergy, and onMilestone callback
 * 
 * Usage:
 * ```ts
 * const energyState = useEnergy();
 * useGrowthMilestones({
 *   milestones: [10, 25, 50],
 *   currentEnergy: energyState.energy,
 *   onMilestone: (milestone) => {
 *     console.log(`Reached milestone: ${milestone}!`);
 *     // Launch narrative segment, etc.
 *   }
 * });
 * ```
 */
export const useGrowthMilestones = (options: UseGrowthMilestonesOptions): void => {
  const { milestones, currentEnergy, onMilestone } = options;
  
  // Track which milestones have already fired
  const firedMilestonesRef = useRef<Set<number>>(new Set());
  
  // Track previous energy for change detection
  const previousEnergyRef = useRef<number>(currentEnergy);
  
  // Sort milestones to ensure proper order
  const sortedMilestones = [...milestones].sort((a, b) => a - b);
  const firstMilestone = sortedMilestones[0];
  
  useEffect(() => {
    const previousEnergy = previousEnergyRef.current;
    const firedMilestones = firedMilestonesRef.current;
    
    // Check if energy has reset below the first milestone
    if (firstMilestone && currentEnergy < firstMilestone && previousEnergy >= firstMilestone) {
      // Reset all fired flags when energy drops below first milestone
      firedMilestones.clear();
    }
    
    // Check for newly crossed milestones
    sortedMilestones.forEach(milestone => {
      // Fire milestone if:
      // 1. Current energy meets or exceeds the milestone
      // 2. This milestone hasn't fired yet
      // 3. Previous energy was below this milestone (to ensure crossing detection)
      if (
        currentEnergy >= milestone && 
        !firedMilestones.has(milestone) && 
        previousEnergy < milestone
      ) {
        // Mark as fired
        firedMilestones.add(milestone);
        
        // Fire the callback
        onMilestone(milestone);
      }
    });
    
    // Update previous energy reference
    previousEnergyRef.current = currentEnergy;
  }, [currentEnergy, sortedMilestones, firstMilestone, onMilestone]);
  
  // Initialize previous energy ref on first render
  useEffect(() => {
    previousEnergyRef.current = currentEnergy;
  }, []); // Empty dependency array - only run once on mount
};

// Convenience hook that accepts separate parameters (alternative API)
export const useGrowthMilestonesSimple = (
  milestones: number[],
  currentEnergy: number,
  onMilestone: (milestone: number) => void
): void => {
  useGrowthMilestones({ milestones, currentEnergy, onMilestone });
};
