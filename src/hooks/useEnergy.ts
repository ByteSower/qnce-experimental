/**
 * PLAN for useEnergy hook:
 *
 * We want a React hook that powers our EchoGarden idle mechanics:
 * 1. Initialize Growth Points (GP) at a configurable start value (default 0).
 * 2. Passively accrue GP by a configurable rate (default +1) every interval (default 5 s).
 * 3. Expose a function for click‑based accrual (e.g. addEnergy(amount)).
 * 4. Enforce a max cap (configurable, default 100) and provide an isMaxed boolean.
 * 5. Pause passive accrual when the page is hidden, resume when visible.
 * 6. Provide resetEnergy() to clear back to start.
 * 7. Clean up timers on unmount.
 *
 * We will follow this with a precise Copilot prompt to scaffold the implementation.
 */

// Copilot: Implement the `useEnergy` hook according to the above plan.
// Use TypeScript, React's useState/useEffect, and ensure proper cleanup.
// Export: useEnergy(config?: { start?: number; rate?: number; intervalMs?: number; cap?: number }): {
//   energy: number;
//   addEnergy(amount: number): void;
//   resetEnergy(): void;
//   isMaxed: boolean;
// }

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseEnergyConfig {
  start?: number;
  rate?: number;
  intervalMs?: number;
  cap?: number;
}

export interface UseEnergyReturn {
  energy: number;
  addEnergy: (amount: number) => void;
  resetEnergy: () => void;
  isMaxed: boolean;
}

export const useEnergy = (config: UseEnergyConfig = {}): UseEnergyReturn => {
  const {
    start = 0,
    rate = 1,
    intervalMs = 5000,
    cap = 100
  } = config;

  const [energy, setEnergy] = useState<number>(start);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isVisibleRef = useRef<boolean>(!document.hidden);
  const lastVisibilityToggle = useRef<number>(0);

  // Clamp energy to valid range
  const clampEnergy = useCallback((value: number): number => {
    return Math.max(0, Math.min(cap, value));
  }, [cap]);

  // Start interval helper - consolidates interval logic
  const startInterval = useCallback(() => {
    if (intervalRef.current || energy >= cap || !isVisibleRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        setEnergy(prevEnergy => {
          const newEnergy = clampEnergy(prevEnergy + rate);
          // Stop interval if we hit the cap
          if (newEnergy >= cap && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return newEnergy;
        });
      }
    }, intervalMs);
  }, [energy, cap, clampEnergy, rate, intervalMs]);

  // Stop interval helper
  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Add energy with validation
  const addEnergy = useCallback((amount: number) => {
    if (amount <= 0) return;
    
    setEnergy(prevEnergy => clampEnergy(prevEnergy + amount));
  }, [clampEnergy]);

  // Reset energy to start value
  const resetEnergy = useCallback(() => {
    setEnergy(start);
  }, [start]);

  // Check if energy is at maximum
  const isMaxed = energy >= cap;

  // Handle visibility change with debouncing
  const handleVisibilityChange = useCallback(() => {
    const now = Date.now();
    const timeSinceLastToggle = now - lastVisibilityToggle.current;
    
    // Debounce rapid visibility toggles (50ms threshold)
    if (timeSinceLastToggle < 50) {
      return;
    }
    
    lastVisibilityToggle.current = now;
    const isVisible = !document.hidden;
    isVisibleRef.current = isVisible;

    if (isVisible && !isMaxed) {
      startInterval();
    } else {
      stopInterval();
    }
  }, [isMaxed, startInterval, stopInterval]);

  // Setup passive energy accrual and restart logic
  useEffect(() => {
    if (isMaxed) {
      stopInterval();
      return;
    }

    // Start interval if conditions are met
    startInterval();

    return stopInterval;
  }, [isMaxed, startInterval, stopInterval]);

  // Setup visibility change listener
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return {
    energy,
    addEnergy,
    resetEnergy,
    isMaxed
  };
};
