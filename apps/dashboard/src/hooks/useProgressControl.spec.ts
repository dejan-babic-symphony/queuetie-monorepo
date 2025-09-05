import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useProgressControl, ProgressStatus } from './useProgressControl';

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));

describe('useProgressControl', () => {
  it('should initialize with empty controls', () => {
    const { result } = renderHook(() => useProgressControl());

    expect(result.current.controls).toEqual({});
    expect(result.current.available).toEqual([]);
  });

  describe('register', () => {
    it('should register a new control with generated ID', () => {
      const { result } = renderHook(() => useProgressControl());

      let registeredId: string;
      act(() => {
        registeredId = result.current.register();
      });

      expect(registeredId!).toBe('mock-uuid-1234');
      expect(result.current.controls).toEqual({
        'mock-uuid-1234': {
          id: 'mock-uuid-1234',
          progress: 0,
          status: ProgressStatus.Idle,
        },
      });
      expect(result.current.available).toEqual(['mock-uuid-1234']);
    });

    it('should register a new control with provided ID', () => {
      const { result } = renderHook(() => useProgressControl());

      let registeredId: string;
      act(() => {
        registeredId = result.current.register('custom-id');
      });

      expect(registeredId!).toBe('custom-id');
      expect(result.current.controls).toEqual({
        'custom-id': {
          id: 'custom-id',
          progress: 0,
          status: ProgressStatus.Idle,
        },
      });
      expect(result.current.available).toEqual(['custom-id']);
    });

    it('should prevent duplicate registration and return existing ID', () => {
      const { result } = renderHook(() => useProgressControl());

      let firstId: string;
      let secondId: string;
      act(() => {
        firstId = result.current.register('duplicate-id');
        secondId = result.current.register('duplicate-id');
      });

      expect(firstId!).toBe('duplicate-id');
      expect(secondId!).toBe('duplicate-id');
      expect(Object.keys(result.current.controls)).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update progress and status correctly on reserved controls', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      act(() => {
        result.current.reserve('test-id');
      });

      // Update progress to 50% (should be Active)
      let updateResult: boolean;
      act(() => {
        updateResult = result.current.update('test-id', 50);
      });

      expect(updateResult!).toBe(true);
      expect(result.current.controls['test-id']).toEqual({
        id: 'test-id',
        progress: 50,
        status: ProgressStatus.Active,
      });

      // Update progress to 100% (should be Done)
      act(() => {
        updateResult = result.current.update('test-id', 100);
      });

      expect(updateResult!).toBe(true);
      expect(result.current.controls['test-id']).toEqual({
        id: 'test-id',
        progress: 100,
        status: ProgressStatus.Done,
      });
    });

    it('should not allow updates on non-reserved controls', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      // Try to update without reserving first
      let updateResult: boolean;
      act(() => {
        updateResult = result.current.update('test-id', 50);
      });

      expect(updateResult!).toBe(false);
      expect(result.current.controls['test-id']).toEqual({
        id: 'test-id',
        progress: 0,
        status: ProgressStatus.Idle,
      });
    });

    it('should allow updates on previously reserved controls even when done', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      act(() => {
        result.current.reserve('test-id');
      });

      act(() => {
        result.current.update('test-id', 100); // Set to done
      });

      expect(result.current.controls['test-id'].status).toBe(ProgressStatus.Done);

      // Should be able to update a done control that was previously reserved
      let updateResult: boolean;
      act(() => {
        updateResult = result.current.update('test-id', 50);
      });

      expect(updateResult!).toBe(true);
      expect(result.current.controls['test-id']).toEqual({
        id: 'test-id',
        progress: 50,
        status: ProgressStatus.Active,
      });
    });

    it('should clamp progress values to 0-100 range', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      act(() => {
        result.current.reserve('test-id');
      });

      // Test negative value - should be clamped to 0 and set to Idle
      act(() => {
        result.current.update('test-id', -10);
      });
      expect(result.current.controls['test-id'].progress).toBe(0);
      expect(result.current.controls['test-id'].status).toBe(ProgressStatus.Idle);

      // Reserve again after becoming idle
      act(() => {
        result.current.reserve('test-id');
      });

      // Test over 100 - should be clamped to 100 and set to Done
      act(() => {
        result.current.update('test-id', 150);
      });
      expect(result.current.controls['test-id'].progress).toBe(100);
      expect(result.current.controls['test-id'].status).toBe(ProgressStatus.Done);
    });

    it('should avoid unnecessary updates when progress and status are the same', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      act(() => {
        result.current.reserve('test-id');
      });

      // First update
      let updateResult: boolean;
      act(() => {
        updateResult = result.current.update('test-id', 50);
      });
      expect(updateResult!).toBe(true);

      // Same update should return false
      act(() => {
        updateResult = result.current.update('test-id', 50);
      });
      expect(updateResult!).toBe(false);
    });

    it('should return false for non-existent control', () => {
      const { result } = renderHook(() => useProgressControl());

      let updateResult: boolean;
      act(() => {
        updateResult = result.current.update('non-existent-id', 50);
      });

      expect(updateResult!).toBe(false);
      expect(result.current.controls).toEqual({});
    });
  });

  describe('reserve', () => {
    it('should reserve a control (set to Reserved with 0 progress)', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      let reserveResult: boolean;
      act(() => {
        reserveResult = result.current.reserve('test-id');
      });

      expect(reserveResult!).toBe(true);
      expect(result.current.controls['test-id']).toEqual({
        id: 'test-id',
        progress: 0,
        status: ProgressStatus.Reserved,
      });
      expect(result.current.available).toEqual([]);
    });

    it('should return false for non-existent control', () => {
      const { result } = renderHook(() => useProgressControl());

      let reserveResult: boolean;
      act(() => {
        reserveResult = result.current.reserve('non-existent-id');
      });

      expect(reserveResult!).toBe(false);
    });

    it('should return false if control is already reserved', () => {
      const { result } = renderHook(() => useProgressControl());

      let firstReserveResult: boolean;
      let secondReserveResult: boolean;

      act(() => {
        result.current.register('test-id');
      });

      act(() => {
        firstReserveResult = result.current.reserve('test-id');
      });

      expect(firstReserveResult!).toBe(true);
      expect(result.current.controls['test-id'].status).toBe(ProgressStatus.Reserved);

      act(() => {
        secondReserveResult = result.current.reserve('test-id');
      });

      expect(secondReserveResult!).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a control and return true', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      expect(result.current.controls['test-id']).toBeDefined();

      let removeResult: boolean;
      act(() => {
        removeResult = result.current.remove('test-id');
      });

      expect(removeResult!).toBe(true);
      expect(result.current.controls['test-id']).toBeUndefined();
      expect(result.current.available).toEqual([]);
    });

    it('should return false for non-existent control', () => {
      const { result } = renderHook(() => useProgressControl());

      let removeResult: boolean;
      act(() => {
        removeResult = result.current.remove('non-existent-id');
      });

      expect(removeResult!).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset a control to idle state', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('test-id');
      });

      act(() => {
        result.current.reserve('test-id');
      });

      act(() => {
        result.current.update('test-id', 75);
      });

      // Verify the control was updated before reset
      expect(result.current.controls['test-id'].progress).toBe(75);
      expect(result.current.controls['test-id'].status).toBe(ProgressStatus.Active);

      let resetResult: boolean;
      act(() => {
        resetResult = result.current.reset('test-id');
      });

      expect(resetResult!).toBe(true);
      expect(result.current.controls['test-id']).toEqual({
        id: 'test-id',
        progress: 0,
        status: ProgressStatus.Idle,
      });
    });

    it('should return false for non-existent control', () => {
      const { result } = renderHook(() => useProgressControl());

      let resetResult: boolean;
      act(() => {
        resetResult = result.current.reset('non-existent-id');
      });

      expect(resetResult!).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all controls', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('control-1');
        result.current.register('control-2');
        result.current.register('control-3');
      });

      expect(Object.keys(result.current.controls)).toHaveLength(3);

      act(() => {
        result.current.clear();
      });

      expect(result.current.controls).toEqual({});
      expect(result.current.available).toEqual([]);
    });
  });

  describe('available controls filtering', () => {
    it('should filter available controls correctly', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('idle-control');
        result.current.register('reserved-control');
        result.current.register('done-control');
      });

      act(() => {
        result.current.reserve('reserved-control'); // Reserved
        result.current.reserve('done-control'); // Reserve first
      });

      act(() => {
        result.current.update('done-control', 100); // Done
        // idle-control remains Idle, reserved-control stays Reserved
      });

      // Only idle controls should be available (not reserved or done)
      expect(result.current.available).toContain('idle-control');
      expect(result.current.available).not.toContain('done-control');
      expect(result.current.available).not.toContain('reserved-control');
    });

    it('should handle multiple controls independently', () => {
      const { result } = renderHook(() => useProgressControl());

      act(() => {
        result.current.register('control-1');
        result.current.register('control-2');
        result.current.register('control-3');
      });

      act(() => {
        result.current.reserve('control-1');
      });

      act(() => {
        result.current.update('control-1', 25);
      });

      act(() => {
        result.current.reserve('control-2');
      });

      act(() => {
        result.current.reserve('control-3');
      });

      act(() => {
        result.current.update('control-3', 100);
      });

      expect(result.current.controls['control-1'].status).toBe(ProgressStatus.Active);
      expect(result.current.controls['control-1'].progress).toBe(25);

      expect(result.current.controls['control-2'].status).toBe(ProgressStatus.Reserved);
      expect(result.current.controls['control-2'].progress).toBe(0);

      expect(result.current.controls['control-3'].status).toBe(ProgressStatus.Done);
      expect(result.current.controls['control-3'].progress).toBe(100);

      // No controls should be available (all are Reserved, Active, or Done)
      expect(result.current.available).toEqual([]);
    });
  });

  describe('string enum values', () => {
    it('should use string values for ProgressStatus enum', () => {
      expect(ProgressStatus.Idle).toBe('idle');
      expect(ProgressStatus.Reserved).toBe('reserved');
      expect(ProgressStatus.Active).toBe('active');
      expect(ProgressStatus.Done).toBe('done');
    });
  });

  describe('referential stability', () => {
    it('should maintain referential stability of callback functions', () => {
      const { result, rerender } = renderHook(() => useProgressControl());

      const initial = {
        register: result.current.register,
        update: result.current.update,
        reserve: result.current.reserve,
        remove: result.current.remove,
        reset: result.current.reset,
        clear: result.current.clear,
      };

      rerender();

      expect(result.current.register).toBe(initial.register);
      expect(result.current.update).toBe(initial.update);
      expect(result.current.reserve).toBe(initial.reserve);
      expect(result.current.remove).toBe(initial.remove);
      expect(result.current.reset).toBe(initial.reset);
      expect(result.current.clear).toBe(initial.clear);
    });
  });
});
