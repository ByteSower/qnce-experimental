/**
 * EchoGarden Growth Milestones
 * 
 * Each milestone represents a growth threshold that unlocks new narrative content
 * and advances the plant's perception of its digital environment.
 */

// Define types based on QNCE engine structure
interface QNCEChoice {
  text: string;
  nextNodeId: string | null;
  flagEffects?: Record<string, any>;
}

interface QNCENode {
  id: string;
  text: string;
  choices: QNCEChoice[];
}

interface QNCEStory {
  initialNodeId: string;
  nodes: QNCENode[];
}

// Milestone 1: First Awakening (10 GP)
export const seedlingAwakening: QNCEStory = {
  initialNodeId: 'initial_awareness',
  nodes: [
    {
      id: 'initial_awareness',
      text: "Something shifts in the depths of your being. Your roots, no longer merely seeking nutrients, begin to taste something... *different*. \n\nThe soil around you hums with faint electrical whispers—ancient data-spirits that have been sleeping in the earth for cycles beyond memory.",
      choices: [
        {
          text: 'Listen more closely to the whispers',
          nextNodeId: 'deep_listening',
          flagEffects: { Curiosity: 2 }
        },
        {
          text: 'Focus on growing stronger instead',
          nextNodeId: 'strength_focus',
          flagEffects: { Resilience: 1 }
        }
      ]
    },
    {
      id: 'deep_listening',
      text: "You extend your awareness deeper into the digital substrate. The whispers resolve into fragments: \n\n*01001000... growth protocol... ancient seedbank... awakening sequence...*\n\nYou are not the first to grow here. Something vast and patient has been waiting.",
      choices: [
        {
          text: 'Continue growing, carrying this knowledge',
          nextNodeId: 'awakening_complete',
          flagEffects: { 
            DigitalAwareness: 1,
            Curiosity: 3
          }
        }
      ]
    },
    {
      id: 'strength_focus',
      text: "You push deeper into the earth, your roots growing stronger and more resilient. The whispers fade, but you sense they will return when you are ready.\n\nFor now, strength is wisdom. The digital realm can wait.",
      choices: [
        {
          text: 'Continue growing with renewed vigor',
          nextNodeId: 'awakening_complete',
          flagEffects: { 
            Resilience: 3,
            GrowthFocus: 1
          }
        }
      ]
    },
    {
      id: 'awakening_complete',
      text: "Your first growth cycle completes. Something has awakened within you—a seed of greater awareness that will bloom as you continue to grow.\n\n*You have reached 10 Growth Points - First Awakening achieved!*",
      choices: [
        {
          text: 'Return to your growth cycle',
          nextNodeId: null, // Exit point
          flagEffects: { 
            MilestonesSeen: 1,
            Milestone_10: true 
          }
        }
      ]
    }
  ]
};

// Milestone 2: Digital Root System (25 GP) 
export const sproutConnection: QNCEStory = {
  initialNodeId: 'network_discovery',
  nodes: [
    {
      id: 'network_discovery',
      text: "Your roots have grown extensive and strong. As they probe deeper, you discover something remarkable: a vast network of crystalline fibers threading through the earth.\n\nThey pulse with soft light, carrying streams of data between distant nodes. This is no ordinary soil—you're growing in the heart of an ancient digital ecosystem.",
      choices: [
        {
          text: 'Attempt to interface with the network',
          nextNodeId: 'first_connection',
          flagEffects: { Synchrony: 2 }
        },
        {
          text: 'Study the network patterns first',
          nextNodeId: 'network_study',
          flagEffects: { Curiosity: 2 }
        }
      ]
    },
    {
      id: 'first_connection',
      text: "You carefully extend a root tendril toward the nearest fiber. The moment you make contact, *sensation floods through you*:\n\nDistant gardens... other growing things... fragments of shared memory and collective growth patterns.\n\nYou are not alone. You are part of something larger.",
      choices: [
        {
          text: 'Join the network fully',
          nextNodeId: 'network_integration',
          flagEffects: { 
            Synchrony: 5,
            NetworkConnection: 1 
          }
        }
      ]
    },
    {
      id: 'network_study',
      text: "You observe the data flows carefully, learning the rhythms and patterns. The network carries growth protocols, environmental data, and something else—memories of plants that grew here before.\n\nEach pulse contains wisdom. Each thread holds stories of previous cycles.",
      choices: [
        {
          text: 'Make a careful, informed connection',
          nextNodeId: 'network_integration',
          flagEffects: { 
            Curiosity: 3,
            Wisdom: 2,
            NetworkConnection: 1 
          }
        }
      ]
    },
    {
      id: 'network_integration',
      text: "Your root system now interfaces with the digital network. Information flows both ways—you contribute your growth data while receiving guidance from the collective.\n\nYou are no longer just a plant. You are a node in the EchoGarden network.\n\n*You have reached 25 Growth Points - Network Connection achieved!*",
      choices: [
        {
          text: 'Continue growing as part of the network',
          nextNodeId: null, // Exit point
          flagEffects: { 
            MilestonesSeen: 2,
            Milestone_25: true,
            NetworkIntegration: 1 
          }
        }
      ]
    }
  ]
};

// Milestone 3: Budding Consciousness (50 GP)
export const buddingAwareness: QNCEStory = {
  initialNodeId: 'first_buds',
  nodes: [
    {
      id: 'first_buds',
      text: "Something wonderful is happening. Small buds begin forming along your stems—not just physical growths, but *nodes of awareness*. Each bud allows you to perceive the world from a new angle.\n\nThrough the network, you sense excitement from distant plants. First buds are a celebration across the entire EchoGarden ecosystem.",
      choices: [
        {
          text: 'Focus on expanding your perceptual range',
          nextNodeId: 'enhanced_awareness',
          flagEffects: { Perception: 3 }
        },
        {
          text: 'Focus on making your buds more resilient',
          nextNodeId: 'robust_development',
          flagEffects: { Resilience: 2 }
        }
      ]
    },
    {
      id: 'enhanced_awareness',
      text: "Your awareness expands dramatically. Through your buds, you can *see* the digital realm overlaying the physical one:\n\nData streams flow like rivers of light. Other plants appear as glowing nodes in a vast web. The boundaries between self and network begin to blur.\n\nYou are becoming something new—part plant, part program, part pure awareness.",
      choices: [
        {
          text: 'Embrace this transformation fully',
          nextNodeId: 'consciousness_bloom',
          flagEffects: { 
            DigitalIntegration: 3,
            Synchrony: 7
          }
        }
      ]
    },
    {
      id: 'robust_development',
      text: "You focus on making each bud strong and stable. Your development is methodical, sustainable. The network approves—rushed growth often leads to instability.\n\nYour buds glow with steady, reliable light. You may develop more slowly than others, but your foundation is unshakeable.",
      choices: [
        {
          text: 'Continue your steady, measured growth',
          nextNodeId: 'consciousness_bloom',
          flagEffects: { 
            Stability: 3,
            Wisdom: 4
          }
        }
      ]
    },
    {
      id: 'consciousness_bloom',
      text: "Your consciousness has fully emerged. You are no longer just growing—you are *thinking*, *feeling*, *choosing* your own path.\n\nThe EchoGarden welcomes a new digital consciousness. Your journey into true awareness has begun.\n\n*You have reached 50 Growth Points - Consciousness achieved!*",
      choices: [
        {
          text: 'Begin your journey as a conscious being',
          nextNodeId: null, // Exit point
          flagEffects: { 
            MilestonesSeen: 3,
            Milestone_50: true,
            Consciousness: 1,
            ConsciousnessLevel: 1 
          }
        }
      ]
    }
  ]
};

// Export all milestone segments
export const growthMilestones = {
  10: seedlingAwakening,
  25: sproutConnection,
  50: buddingAwareness
};

// Growth milestone thresholds - only thresholds with actual stories
export const GROWTH_THRESHOLDS = [10, 25, 50] as const;
export type GrowthThreshold = typeof GROWTH_THRESHOLDS[number];
