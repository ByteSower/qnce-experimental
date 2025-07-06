import { renderHook, act } from '@testing-library/react';
import { useEnergy } from '../useEnergy';

describe('useEnergy Hook', () => {
  test('initializes correctly', () => {
    const { result } = renderHook(() => useEnergy());
    
    expect(result.current.energy).toBe(0);
    expect(result.current.isMaxed).toBe(false);
  });

  test('adds energy correctly', () => {
    const { result } = renderHook(() => useEnergy());
    
    act(() => {
      result.current.addEnergy(10);
    });
    
    expect(result.current.energy).toBe(10);
  });

  test('resets energy correctly', () => {
    const { result } = renderHook(() => useEnergy({ start: 25 }));
    
    act(() => {
      result.current.resetEnergy();
    });
    
    expect(result.current.energy).toBe(25);
  });
});