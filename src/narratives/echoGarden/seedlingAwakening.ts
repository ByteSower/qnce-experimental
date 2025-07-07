// src/narratives/echoGarden/seedlingAwakening.ts

/**
 * Seedling Awakening - First Growth Milestone (GP ≥ 10)
 * The player's first sprouts break through the surface and sense the world.
 */

import { 
  NarrativeSegment,
  FlagUpdate,
  QNCEVariables 
} from './types';

export const seedlingAwakening: NarrativeSegment = {
  id: 'seedlingAwakening',
  title: 'Seedling Awakening',
  description: 'Your first sprouts break through the surface and sense the world.',
  entryPoints: ['eg_start'],
  exitPoints: ['eg_sproutEmergence'],
  nodes: [
    {
      nodeId: 'eg_start',
      text: `A tender shoot unfurls beneath the pale light. You feel warmth trickling through your veins for the first time.`,
      assetPlaceholders: {
        visualCue: '/assets/echogarden/EG-Thumbnail.png',
        audioCue: 'soft_breeze.mp3'
      },
      feedbackHook: { milestone: 'seedlingAwakening', delay: 0 },
      choices: [
        {
          choiceText: 'Listen to the heartbeat of the soil',
          nextNodeId: 'eg_listenSoil',
          flagUpdates: [{ flag: 'coherence', operation: 'increment', value: 1 }]
        },
        {
          choiceText: 'Stretch toward the light',
          nextNodeId: 'eg_stretchLight',
          flagUpdates: [{ flag: 'synchrony', operation: 'increment', value: 1 }]
        }
      ]
    },
    {
      nodeId: 'eg_listenSoil',
      text: `You root deeper, feeling the pulse of microorganisms and distant water veins. A gentle hum of life surrounds you.`,
      choices: [
        {
          choiceText: 'Embrace the hum',
          nextNodeId: 'eg_sproutEmergence',
          flagUpdates: [{ flag: 'curiosity', operation: 'increment', value: 1 }]
        }
      ]
    },
    {
      nodeId: 'eg_stretchLight',
      text: `Your leaves tremble as golden rays wash over you. You taste photons like nectar.`,
      choices: [
        {
          choiceText: 'Bask in the glow',
          nextNodeId: 'eg_sproutEmergence',
          flagUpdates: [{ flag: 'disruption', operation: 'decrement', value: 1 }]
        }
      ]
    }
  ]
};
