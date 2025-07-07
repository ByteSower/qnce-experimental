// src/narratives/echoGarden/types.ts

/**
 * Enhanced QNCE Types for EchoGarden Narrative Segments
 * 
 * These types extend the basic QNCE engine structure with advanced features
 * like conditional choices, flag operations, and dynamic text generation.
 */

export interface FlagUpdate {
  flag: string;
  operation: 'increment' | 'decrement' | 'set';
  value: number;
}

export interface FeedbackHook {
  milestone: string;
  delay: number;
}

export interface AssetPlaceholders {
  visualCue?: string;
  audioCue?: string;
}

export interface QNCEVariables {
  [key: string]: any;
  coherence?: number;
  synchrony?: number;
  curiosity?: number;
  disruption?: number;
}

export interface FlagCondition {
  flag: string;
  operator: '>=' | '<=' | '>' | '<' | '==' | '!=';
  value: number;
}

export interface EnhancedQNCEChoice {
  choiceText: string;
  nextNodeId: string | null;
  flagUpdates?: FlagUpdate[];
  conditions?: FlagCondition[];
}

export interface EnhancedQNCENode {
  nodeId: string;
  text: string | ((vars: QNCEVariables) => string);
  assetPlaceholders?: AssetPlaceholders;
  feedbackHook?: FeedbackHook;
  choices: EnhancedQNCEChoice[];
}

export interface NarrativeSegment {
  id: string;
  title: string;
  description: string;
  entryPoints: string[];
  exitPoints: string[];
  nodes: EnhancedQNCENode[];
}

// Convert enhanced narrative segment to basic QNCE story format
export interface BasicQNCEChoice {
  text: string;
  nextNodeId: string; // QNCE engine expects string, not null
  flagEffects?: Record<string, any>;
}

export interface BasicQNCENode {
  id: string;
  text: string;
  choices: BasicQNCEChoice[];
}

export interface BasicQNCEStory {
  initialNodeId: string;
  nodes: BasicQNCENode[];
}

/**
 * Convert enhanced narrative segment to basic QNCE story format
 * for compatibility with existing QNCE engine
 */
export function convertToBasicQNCEStory(segment: NarrativeSegment, variables: QNCEVariables = {}): BasicQNCEStory {
  return {
    initialNodeId: segment.entryPoints[0], // Use first entry point as initial node
    nodes: segment.nodes.map(node => ({
      id: node.nodeId,
      text: typeof node.text === 'function' ? node.text(variables) : node.text,
      assetPlaceholders: node.assetPlaceholders, // Preserve asset placeholders
      choices: node.choices.map(choice => ({
        text: choice.choiceText,
        nextNodeId: choice.nextNodeId || '', // Convert null to empty string for QNCE compatibility
        flagEffects: choice.flagUpdates?.reduce((acc, update) => {
          acc[update.flag] = update.value;
          return acc;
        }, {} as Record<string, any>) || {}
      }))
    }))
  };
}
