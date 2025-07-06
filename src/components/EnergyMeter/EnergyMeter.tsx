/**
 * PLAN: EnergyMeter component
 * - Import and use useEnergy hook.
 * - Render a progress bar showing energy vs cap.
 * - Display numeric label "GP: {energy} / {cap}".
 * - Harvest button calls addEnergy(1), disabled at isMaxed.
 * - Reset link calls resetEnergy().
 * - Animate bar fill on energy change.
 * - Accept optional props: width, height, labelFormat.
 * - Add ARIA roles for progressbar and button.
 */
// Copilot: Implement EnergyMeter component in React + TypeScript per the above plan.
// Use CSS modules for styling to avoid inline styles.
// Export: EnergyMeter(props?: { width?: number; height?: number; labelFormat?: (energy:number,cap:number)=>string; })

import React, { useEffect, useRef } from 'react';
import { useEnergy } from '../../hooks/useEnergy';
import type { UseEnergyReturn } from '../../hooks/useEnergy';
import styles from './EnergyMeter.module.css';

interface EnergyMeterProps {
  width?: number;
  height?: number;
  labelFormat?: (energy: number, cap: number) => string;
  config?: {
    start?: number;
    rate?: number;
    intervalMs?: number;
    cap?: number;
  };
  // Optional external energy state
  energyState?: UseEnergyReturn;
}

export const EnergyMeter: React.FC<EnergyMeterProps> = ({
  width = 300,
  height = 24,
  labelFormat = (energy, cap) => `GP: ${energy} / ${cap}`,
  config = {},
  energyState
}) => {
  // Use external energy state if provided, otherwise create internal state
  const internalEnergyState = useEnergy(config);
  const { energy, addEnergy, resetEnergy, isMaxed } = energyState || internalEnergyState;
  const cap = config.cap || 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  
  // Calculate fill percentage
  const fillPercentage = Math.min((energy / cap) * 100, 100);
  
  // Calculate color class based on energy level
  const getEnergyColorClass = (): string => {
    const percentage = fillPercentage;
    if (percentage < 30) {
      return styles.energyFillLow;
    } else if (percentage < 70) {
      return styles.energyFillMedium;
    } else {
      return styles.energyFillHigh;
    }
  };

  // Update dynamic styles via refs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.height = `${height}px`;
    }
    if (fillRef.current) {
      fillRef.current.style.width = `${fillPercentage}%`;
    }
    if (shineRef.current) {
      shineRef.current.style.width = `${fillPercentage}%`;
    }
  }, [width, height, fillPercentage]);

  const handleHarvest = () => {
    if (!isMaxed) {
      addEnergy(1);
    }
  };

  const handleReset = () => {
    resetEnergy();
  };

  return (
    <div className={styles.energyMeter}>
      {/* Energy Label */}
      <div className={styles.energyLabel}>
        <span className={styles.energyText}>
          {labelFormat(energy, cap)}
        </span>
        <button
          onClick={handleReset}
          className={styles.resetButton}
          aria-label="Reset energy to starting value"
        >
          Reset
        </button>
      </div>

      {/* Progress Bar Container */}
      <div
        ref={containerRef}
        className={styles.progressContainer}
        role="progressbar"
        aria-valuenow={Math.round(energy)}
        aria-valuemin={0}
        aria-valuemax={cap}
        aria-label={`Energy level: ${energy} out of ${cap} growth points`}
      >
        {/* Progress Bar Fill */}
        <div
          ref={fillRef}
          className={`${styles.progressFill} ${getEnergyColorClass()}`}
        />
        
        {/* Shine effect overlay */}
        <div
          ref={shineRef}
          className={styles.progressShine}
        />
      </div>

      {/* Harvest Button */}
      <div className={styles.harvestContainer}>
        <button
          onClick={handleHarvest}
          disabled={isMaxed}
          className={`
            ${styles.harvestButton}
            ${isMaxed ? styles.harvestButtonDisabled : styles.harvestButtonEnabled}
          `}
          aria-label={isMaxed ? 'Cannot harvest - energy is at maximum' : 'Harvest light to gain 1 growth point'}
        >
          {isMaxed ? 'Energy Full' : '🌱 Harvest Light'}
        </button>
      </div>

      {/* Status Indicator */}
      <div className={styles.statusIndicator}>
        <span className={`${styles.statusText} ${isMaxed ? styles.statusTextMaxed : styles.statusTextNormal}`}>
          {isMaxed ? '✨ Maximum Energy Reached!' : 'Collecting solar energy...'}
        </span>
      </div>
    </div>
  );
};
