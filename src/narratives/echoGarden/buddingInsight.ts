// src/narratives/echoGarden/buddingInsight.ts

/**
 * Budding Insight - Third Growth Milestone (GP ≥ 50)
 * Your consciousness blossoms, filling you with ancient knowledge and purpose.
 */

import {
  NarrativeSegment,
  QNCEVariables
} from './types';

export const buddingInsight: NarrativeSegment = {
  id: 'buddingInsight',
  title: 'Budding Insight',
  description: 'Your consciousness blossoms, filling you with ancient knowledge and purpose.',
  entryPoints: ['eg_buddingInsight'],
  exitPoints: ['eg_nextPhase'],
  nodes: [
    {
      nodeId: 'eg_buddingInsight',
      text: (vars: QNCEVariables) => {
        const { synchrony, curiosity } = vars;
        if (synchrony && curiosity && synchrony > 2 && curiosity > 2) {
          return `A cascade of revelations—your mind intertwines with distant echoes, weaving coherent visions of Eden's past.`;
        }
        return `Your thoughts flutter, glimpsing fragments of a greater tapestry yet to be fully seen.`;
      },
      assetPlaceholders: {
        visualCue: '/assets/echogarden/EG-image3.png',
        audioCue: 'reveal_tone.mp3'
      },
      feedbackHook: { milestone: 'buddingInsight', delay: 2000 },
      choices: [
        {
          choiceText: 'Embrace the visions',
          nextNodeId: 'eg_chaseVision',
          flagUpdates: [{ flag: 'curiosity', operation: 'increment', value: 1 }]
        },
        {
          choiceText: 'Hold back, observe',
          nextNodeId: 'eg_holdBack',
          flagUpdates: [{ flag: 'coherence', operation: 'increment', value: 1 }]
        }
      ]
    },
    {
      nodeId: 'eg_chaseVision',
      text: `You surge forward, guided by crystalline lights.`,
      choices: [
        {
          choiceText: 'Follow the light',
          nextNodeId: 'eg_nextPhase',
          flagUpdates: [{ flag: 'synchrony', operation: 'increment', value: 2 }]
        }
      ]
    },
    {
      nodeId: 'eg_holdBack',
      text: `You stand firm, letting the insights wash over you in silent communion.`,
      choices: [
        {
          choiceText: 'Step into the light',
          nextNodeId: 'eg_nextPhase',
          flagUpdates: [{ flag: 'disruption', operation: 'decrement', value: 1 }]
        }
      ]
    }
  ]
};
