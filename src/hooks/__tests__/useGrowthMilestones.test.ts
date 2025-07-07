/**
 * Unit tests for useGrowthMilestones hook
 * 
 * Tests:
 * - Single-fire behavior (no duplicate calls)
 * - Reset logic when energy drops below first milestone
 * - Proper milestone ordering
 * - Edge cases and boundary conditions
 */

import { renderHook } from '@testing-library/react';
import { useGrowthMilestones } from '../useGrowthMilestones';

describe('useGrowthMilestones', () => {
  let mockOnMilestone: jest.Mock;

  beforeEach(() => {
    mockOnMilestone = jest.fn();
  });

  it('should fire milestone callback when energy crosses threshold for the first time', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [10, 25, 50],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 5 } }
    );

    // Initially below first milestone - no calls
    expect(mockOnMilestone).not.toHaveBeenCalled();

    // Cross first milestone
    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(1);
    expect(mockOnMilestone).toHaveBeenCalledWith(10);

    // Cross second milestone
    rerender({ energy: 25 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(2);
    expect(mockOnMilestone).toHaveBeenCalledWith(25);

    // Cross third milestone
    rerender({ energy: 50 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(3);
    expect(mockOnMilestone).toHaveBeenCalledWith(50);
  });

  it('should not fire duplicate callbacks when energy fluctuates above threshold', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [10, 25, 50],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 15 } }
    );

    // Initially above first milestone - no call because we haven't crossed it
    expect(mockOnMilestone).not.toHaveBeenCalled();

    // Start below and cross the threshold
    rerender({ energy: 5 });
    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(1);
    expect(mockOnMilestone).toHaveBeenCalledWith(10);

    // Fluctuate above the threshold - should not fire again
    rerender({ energy: 15 });
    rerender({ energy: 12 });
    rerender({ energy: 20 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(1);
  });

  it('should reset fired milestones when energy drops below first milestone', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [10, 25, 50],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 5 } }
    );

    // Cross first two milestones
    rerender({ energy: 10 });
    rerender({ energy: 25 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(2);

    // Reset energy below first milestone
    rerender({ energy: 5 });

    // Cross milestones again - should fire again
    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(3);
    expect(mockOnMilestone).toHaveBeenLastCalledWith(10);

    rerender({ energy: 25 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(4);
    expect(mockOnMilestone).toHaveBeenLastCalledWith(25);
  });

  it('should handle unordered milestone arrays', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [50, 10, 25], // Unordered array
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 5 } }
    );

    // Cross milestones in order
    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledWith(10);

    rerender({ energy: 25 });
    expect(mockOnMilestone).toHaveBeenCalledWith(25);

    rerender({ energy: 50 });
    expect(mockOnMilestone).toHaveBeenCalledWith(50);

    expect(mockOnMilestone).toHaveBeenCalledTimes(3);
  });

  it('should handle skipping milestones when energy jumps', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [10, 25, 50],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 5 } }
    );

    // Jump directly to 30, crossing both 10 and 25
    rerender({ energy: 30 });
    
    expect(mockOnMilestone).toHaveBeenCalledTimes(2);
    expect(mockOnMilestone).toHaveBeenCalledWith(10);
    expect(mockOnMilestone).toHaveBeenCalledWith(25);
  });

  it('should handle empty milestone arrays gracefully', () => {
    renderHook(() => useGrowthMilestones({
      milestones: [],
      currentEnergy: 100,
      onMilestone: mockOnMilestone
    }));

    expect(mockOnMilestone).not.toHaveBeenCalled();
  });

  it('should handle single milestone', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [10],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 5 } }
    );

    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(1);
    expect(mockOnMilestone).toHaveBeenCalledWith(10);

    // Reset below milestone
    rerender({ energy: 5 });
    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledTimes(2);
  });

  it('should not fire milestones when energy starts above threshold', () => {
    renderHook(() => useGrowthMilestones({
      milestones: [10, 25, 50],
      currentEnergy: 100, // Start above all milestones
      onMilestone: mockOnMilestone
    }));

    // Should not fire any milestones since we didn't cross them
    expect(mockOnMilestone).not.toHaveBeenCalled();
  });

  it('should handle negative milestone values', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [-10, 0, 10],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: -20 } }
    );

    rerender({ energy: -10 });
    expect(mockOnMilestone).toHaveBeenCalledWith(-10);

    rerender({ energy: 0 });
    expect(mockOnMilestone).toHaveBeenCalledWith(0);

    rerender({ energy: 10 });
    expect(mockOnMilestone).toHaveBeenCalledWith(10);

    expect(mockOnMilestone).toHaveBeenCalledTimes(3);
  });

  it('should handle decimal milestone values', () => {
    const { rerender } = renderHook(
      ({ energy }) => useGrowthMilestones({
        milestones: [10.5, 25.7, 50.1],
        currentEnergy: energy,
        onMilestone: mockOnMilestone
      }),
      { initialProps: { energy: 5 } }
    );

    rerender({ energy: 10.5 });
    expect(mockOnMilestone).toHaveBeenCalledWith(10.5);

    rerender({ energy: 25.7 });
    expect(mockOnMilestone).toHaveBeenCalledWith(25.7);

    expect(mockOnMilestone).toHaveBeenCalledTimes(2);
  });
});
