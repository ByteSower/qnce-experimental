// src/narratives/echoGarden/index.ts

/**
 * EchoGarden Narrative Segments
 * 
 * Exports all narrative segments and utilities for the EchoGarden experience.
 * These segments are triggered by the useGrowthMilestones hook when energy
 * thresholds are reached.
 */

// Enhanced narrative segments
export { seedlingAwakening } from './seedlingAwakening';
export { sproutEmergence } from './sproutEmergence';
export { buddingInsight } from './buddingInsight';

// Legacy milestone stories (for backward compatibility)
export { 
  seedlingAwakening as legacySeedlingAwakening,
  sproutConnection,
  buddingAwareness,
  growthMilestones,
  GROWTH_THRESHOLDS,
  type GrowthThreshold 
} from './growthMilestones';

// Types and utilities
export * from './types';

// Narrative segment registry for milestone system
import { seedlingAwakening } from './seedlingAwakening';
import { sproutEmergence } from './sproutEmergence';
import { buddingInsight } from './buddingInsight';
import type { NarrativeSegment } from './types';

export const NARRATIVE_SEGMENTS: Record<number, NarrativeSegment> = {
  10: seedlingAwakening,
  25: sproutEmergence,
  50: buddingInsight
};

/**
 * Get narrative segment by milestone threshold
 */
export function getNarrativeSegment(milestone: number): NarrativeSegment | null {
  return NARRATIVE_SEGMENTS[milestone] || null;
}

/**
 * Get all available milestone thresholds for enhanced narratives
 */
export function getAvailableMilestones(): number[] {
  return Object.keys(NARRATIVE_SEGMENTS).map(Number).sort((a, b) => a - b);
}
