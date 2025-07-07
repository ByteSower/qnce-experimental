// src/narratives/echoGarden/sproutEmergence.ts

/**
 * Sprout Emergence - Second Growth Milestone (GP ≥ 25)
 * Your form solidifies as you reach toward devotion and understanding.
 */

import {
  NarrativeSegment,
  QNCEVariables
} from './types';

export const sproutEmergence: NarrativeSegment = {
  id: 'sproutEmergence',
  title: 'Sprout Emergence',
  description: 'Your form solidifies as you reach toward devotion and understanding.',
  entryPoints: ['eg_sproutEmergence'],
  exitPoints: ['eg_buddingInsight'],
  nodes: [
    {
      nodeId: 'eg_sproutEmergence',
      text: (vars: QNCEVariables) => {
        const { coherence } = vars;
        return coherence && coherence > 1
          ? `Your structure feels coherent, fibers aligning in perfect symmetry. A spark of self-awareness flickers.`
          : `You bud awkwardly, unsteady but determined to find your purpose.`;
      },
      assetPlaceholders: {
        visualCue: '/assets/echogarden/EG-image2.png',
        audioCue: 'soft_chime.mp3'
      },
      feedbackHook: { milestone: 'sproutEmergence', delay: 1000 },
      choices: [
        {
          choiceText: 'Probe the ambient signals',
          nextNodeId: 'eg_probeSignals',
          flagUpdates: [{ flag: 'curiosity', operation: 'increment', value: 1 }]
        },
        {
          choiceText: 'Ground yourself in the earth',
          nextNodeId: 'eg_groundEarth',
          flagUpdates: [{ flag: 'coherence', operation: 'increment', value: 1 }]
        }
      ]
    },
    {
      nodeId: 'eg_probeSignals',
      text: `You detect faint vibrations—messages encoded in the wind.`,
      choices: [
        {
          choiceText: 'Decipher the patterns',
          nextNodeId: 'eg_sproutEmergence',
          conditions: [{ flag: 'curiosity', operator: '>=', value: 2 }],
          flagUpdates: [{ flag: 'synchrony', operation: 'increment', value: 1 }]
        },
        {
          choiceText: 'Ignore and proceed',
          nextNodeId: 'eg_buddingInsight',
          flagUpdates: [{ flag: 'disruption', operation: 'increment', value: 1 }]
        }
      ]
    },
    {
      nodeId: 'eg_groundEarth',
      text: `Roots tangle deeper, anchoring you. Stability fills your cells.`,
      choices: [
        {
          choiceText: 'Rise boldly',
          nextNodeId: 'eg_buddingInsight',
          flagUpdates: [{ flag: 'coherence', operation: 'increment', value: 1 }]
        }
      ]
    }
  ]
};
