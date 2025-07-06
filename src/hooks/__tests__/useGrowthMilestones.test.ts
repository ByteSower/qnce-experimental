import { renderHook, act } from '@testing-library/react';
import { useGrowthMilestones } from '../useGrowthMilestones';

describe('useGrowthMilestones Hook', () => {
  test('initializes correctly with no milestones', () => {
    const { result } = renderHook(() => useGrowthMilestones(0));
    
    expect(result.current.reachedMilestones.size).toBe(0);
    expect(result.current.lastMilestone).toBe(null);
    expect(result.current.nextMilestone).toBe(10);
    expect(result.current.progressToNext).toBe(0);
  });

  test('detects milestone crossing', () => {
    const mockCallback = jest.fn();
    const { result, rerender } = renderHook(
      ({ energy }) => useGrowthMilestones(energy, { onMilestoneReached: mockCallback }),
      { initialProps: { energy: 5 } }
    );

    // Cross first milestone
    rerender({ energy: 15 });

    expect(result.current.hasMilestone(10)).toBe(true);
    expect(result.current.lastMilestone).toBe(10);
    expect(result.current.nextMilestone).toBe(25);
    expect(mockCallback).toHaveBeenCalledWith({
      threshold: 10,
      previousEnergy: 5,
      currentEnergy: 15,
      isFirstTime: true
    });
  });

  test('calculates progress correctly', () => {
    const { result, rerender } = renderHook(
      ({ energy }) => useGrowthMilestones(energy),
      { initialProps: { energy: 5 } }
    );

    expect(result.current.progressToNext).toBe(0.5); // 5/10 = 0.5

    rerender({ energy: 20 });
    expect(result.current.progressToNext).toBe(0.8); // 20/25 = 0.8
  });

  test('resets milestones correctly', () => {
    const { result, rerender } = renderHook(
      ({ energy }) => useGrowthMilestones(energy),
      { initialProps: { energy: 30 } }
    );

    // Should have milestones 10 and 25
    expect(result.current.reachedMilestones.size).toBe(2);
    
    act(() => {
      result.current.resetMilestones();
    });

    expect(result.current.reachedMilestones.size).toBe(0);
    expect(result.current.lastMilestone).toBe(null);
  });
});
