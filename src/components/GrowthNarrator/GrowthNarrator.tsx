/**
 * GrowthNarrator Component
 * 
 * Renders narrative overlays/modals when growth milestones are reached.
 * Integrates with QNCE engine to display dynamic narrative content.
 */

import React, { useState, useEffect } from 'react';
import { createQNCEEngine } from 'qnce-engine';
import { getNarrativeSegment, convertToBasicQNCEStory, type QNCEVariables } from '../../narratives/echoGarden';
import styles from './GrowthNarrator.module.css';

interface GrowthNarratorProps {
  milestoneEvent: number | null; // Now takes milestone threshold number directly
  onNarrativeComplete?: (threshold: number, flags: Record<string, any>) => void;
  onClose?: () => void;
  className?: string;
}

export const GrowthNarrator: React.FC<GrowthNarratorProps> = ({
  milestoneEvent,
  onNarrativeComplete,
  onClose,
  className
}) => {
  const [qnceEngine, setQNCEEngine] = useState<any>(null);
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [accumulatedFlags, setAccumulatedFlags] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  // Initialize QNCE engine when milestone event occurs
  useEffect(() => {
    if (!milestoneEvent) {
      setIsVisible(false);
      return;
    }

    const narrativeSegment = getNarrativeSegment(milestoneEvent);
    if (!narrativeSegment) {
      console.warn(`No narrative segment found for milestone ${milestoneEvent}`);
      return;
    }

    try {
      // Initialize variables with current flags
      const variables: QNCEVariables = {
        coherence: 0,
        synchrony: 0,
        curiosity: 0,
        disruption: 0,
        ...accumulatedFlags
      };

      // Convert enhanced narrative segment to basic QNCE story format
      const qnceStory = convertToBasicQNCEStory(narrativeSegment, variables);
      
      const engine = createQNCEEngine(qnceStory);
      setQNCEEngine(engine);
      setCurrentNode(engine.getCurrentNode());
      setAccumulatedFlags({});
      setIsVisible(true);
    } catch (error) {
      console.error('Failed to create QNCE engine:', error);
    }
  }, [milestoneEvent]);

  // Handle choice selection
  const handleChoice = (choice: any) => {
    if (!qnceEngine) return;

    try {
      // Apply flag effects if present
      if (choice.flagEffects) {
        setAccumulatedFlags(prev => ({
          ...prev,
          ...choice.flagEffects
        }));
      }

      // Navigate to next node or complete if no next node
      if (choice.nextNodeId && choice.nextNodeId !== '') {
        // Use the correct QNCE engine API method
        qnceEngine.selectChoice(choice);
        setCurrentNode(qnceEngine.getCurrentNode());
      } else {
        // End of narrative - trigger completion callback
        handleNarrativeComplete();
      }
    } catch (error) {
      console.error('Error handling choice:', error);
      handleNarrativeComplete();
    }
  };

  // Handle narrative completion
  const handleNarrativeComplete = () => {
    if (milestoneEvent) {
      onNarrativeComplete?.(milestoneEvent, accumulatedFlags);
    }
    handleClose();
  };

  // Handle modal close
  const handleClose = () => {
    setIsVisible(false);
    setQNCEEngine(null);
    setCurrentNode(null);
    setAccumulatedFlags({});
    onClose?.();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  if (!isVisible || !currentNode || !milestoneEvent) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${className || ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Growth Milestone: {milestoneEvent} GP
          </h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close narrative"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.narrative}>
            {/* Display narrative image if available */}
            {currentNode.assetPlaceholders?.visualCue && (
              <img 
                src={currentNode.assetPlaceholders.visualCue}
                alt="Narrative visual"
                className={styles.narrativeImage}
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', currentNode.assetPlaceholders.visualCue);
                }}
                onError={(e) => {
                  console.error('❌ Failed to load narrative image:', currentNode.assetPlaceholders.visualCue);
                  console.error('Error details:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            <p className={styles.text}>
              {currentNode.text}
            </p>
          </div>

          {currentNode.choices && currentNode.choices.length > 0 && (
            <div className={styles.choices}>
              {currentNode.choices.map((choice: any, index: number) => (
                <button
                  key={index}
                  className={styles.choice}
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {(!currentNode.choices || currentNode.choices.length === 0) && (
            <div className={styles.choices}>
              <button
                className={styles.choice}
                onClick={handleNarrativeComplete}
              >
                Continue Growing
              </button>
            </div>
          )}
        </div>

        {Object.keys(accumulatedFlags).length > 0 && (
          <div className={styles.flagDisplay}>
            <h4>Growth Changes:</h4>
            <div className={styles.flags}>
              {Object.entries(accumulatedFlags).map(([flag, value]) => (
                <span key={flag} className={styles.flag}>
                  {flag}: +{value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
