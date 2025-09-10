import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGadgetAnimations } from './useGadgetAnimations';
import { useGadgetState } from './useGadgetState';
import { GadgetProps } from '../components/Gadget/types';

// Mock useGadgetState hook
vi.mock('./useGadgetState', () => ({
  useGadgetState: vi.fn(),
}));

describe('useGadgetAnimations', () => {
  const mockGadgets: GadgetProps[] = [
    {
      id: 'gadget-1',
      isVisible: true,
      isGroup: false,
      client: { id: 'client-1', name: 'Client 1' },
      organization: { id: 'org-1', name: 'Org 1' },
    },
    {
      id: 'gadget-2',
      isVisible: true,
      isGroup: false,
      client: { id: 'client-2', name: 'Client 2' },
      organization: { id: 'org-2', name: 'Org 2' },
    },
    {
      id: 'gadget-3',
      isVisible: true,
      isGroup: true,
      client: { id: 'client-3', name: 'Client 3' },
      organization: { id: 'org-3', name: 'Org 3' },
    },
  ];

  const mockClearGadgets = vi.fn();
  const mockUpdateGadget = vi.fn();
  const mockUseGadgetState = vi.mocked(useGadgetState);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockUseGadgetState.mockReturnValue({
      gadgets: mockGadgets,
      clearGadgets: mockClearGadgets,
      updateGadget: mockUpdateGadget,
      hasGadgets: true,
      addGadget: vi.fn(),
      setGadgets: vi.fn(),
      createGadget: vi.fn(),
      removeGadget: vi.fn(),
      groupGadget: vi.fn(),
      leaveGroup: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should return clearGadgetsAnimated and removeGadgetAnimated functions', () => {
      const { result } = renderHook(() => useGadgetAnimations());

      expect(result.current).toHaveProperty('clearGadgetsAnimated');
      expect(result.current).toHaveProperty('removeGadgetAnimated');
      expect(typeof result.current.clearGadgetsAnimated).toBe('function');
      expect(typeof result.current.removeGadgetAnimated).toBe('function');
    });

    it('should call useGadgetState to get required dependencies', () => {
      renderHook(() => useGadgetAnimations());

      expect(mockUseGadgetState).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearGadgetsAnimated', () => {
    it('should hide all gadgets with staggered timing', () => {
      const { result } = renderHook(() => useGadgetAnimations());

      act(() => {
        result.current.clearGadgetsAnimated();
      });

      // Should not have called updateGadget immediately
      expect(mockUpdateGadget).not.toHaveBeenCalled();

      // Fast-forward first stagger delay (0ms for first gadget)
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false });

      // Fast-forward to second gadget (100ms)
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-2', { isVisible: false });

      // Fast-forward to third gadget (200ms total)
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-3', { isVisible: false });

      expect(mockUpdateGadget).toHaveBeenCalledTimes(3);
    });

    it('should clear gadgets after all animations complete', () => {
      const { result } = renderHook(() => useGadgetAnimations());

      act(() => {
        result.current.clearGadgetsAnimated();
      });

      // Fast-forward through all stagger delays (200ms for 3 gadgets)
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(mockClearGadgets).not.toHaveBeenCalled();

      // Fast-forward through animation duration (500ms more)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockClearGadgets).toHaveBeenCalledTimes(1);
    });

    it('should calculate correct total delay based on number of gadgets', () => {
      // Test with different number of gadgets
      const oneGadget = [mockGadgets[0]];
      mockUseGadgetState.mockReturnValue({
        gadgets: oneGadget,
        clearGadgets: mockClearGadgets,
        updateGadget: mockUpdateGadget,
        hasGadgets: true,
        addGadget: vi.fn(),
        setGadgets: vi.fn(),
        createGadget: vi.fn(),
        removeGadget: vi.fn(),
        groupGadget: vi.fn(),
        leaveGroup: vi.fn(),
      });

      const { result } = renderHook(() => useGadgetAnimations());

      act(() => {
        result.current.clearGadgetsAnimated();
      });

      // For 1 gadget: (1-1) * 100 + 500 = 500ms
      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(mockClearGadgets).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockClearGadgets).toHaveBeenCalledTimes(1);
    });

    it('should handle empty gadgets array gracefully', () => {
      mockUseGadgetState.mockReturnValue({
        gadgets: [],
        clearGadgets: mockClearGadgets,
        updateGadget: mockUpdateGadget,
        hasGadgets: false,
        addGadget: vi.fn(),
        setGadgets: vi.fn(),
        createGadget: vi.fn(),
        removeGadget: vi.fn(),
        groupGadget: vi.fn(),
        leaveGroup: vi.fn(),
      });

      const { result } = renderHook(() => useGadgetAnimations());

      act(() => {
        result.current.clearGadgetsAnimated();
      });

      expect(mockUpdateGadget).not.toHaveBeenCalled();

      // Should clear immediately for empty array: (-1) * 100 + 500 = 400ms
      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(mockClearGadgets).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeGadgetAnimated', () => {
    it('should hide gadget immediately and call remove callback after animation', () => {
      const { result } = renderHook(() => useGadgetAnimations());
      const mockRemoveCallback = vi.fn();

      act(() => {
        result.current.removeGadgetAnimated('gadget-1', mockRemoveCallback);
      });

      // Should immediately hide the gadget
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false });
      expect(mockUpdateGadget).toHaveBeenCalledTimes(1);

      // Callback should not be called immediately
      expect(mockRemoveCallback).not.toHaveBeenCalled();

      // Fast-forward animation duration (500ms)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockRemoveCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple simultaneous remove animations', () => {
      const { result } = renderHook(() => useGadgetAnimations());
      const mockRemoveCallback1 = vi.fn();
      const mockRemoveCallback2 = vi.fn();

      act(() => {
        result.current.removeGadgetAnimated('gadget-1', mockRemoveCallback1);
        result.current.removeGadgetAnimated('gadget-2', mockRemoveCallback2);
      });

      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false });
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-2', { isVisible: false });
      expect(mockUpdateGadget).toHaveBeenCalledTimes(2);

      // Both callbacks should not be called yet
      expect(mockRemoveCallback1).not.toHaveBeenCalled();
      expect(mockRemoveCallback2).not.toHaveBeenCalled();

      // Fast-forward animation duration
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockRemoveCallback1).toHaveBeenCalledTimes(1);
      expect(mockRemoveCallback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('function memoization', () => {
    it('should memoize clearGadgetsAnimated function', () => {
      const { result, rerender } = renderHook(() => useGadgetAnimations());

      const initialClearFunction = result.current.clearGadgetsAnimated;
      rerender();

      expect(result.current.clearGadgetsAnimated).toBe(initialClearFunction);
    });

    it('should memoize removeGadgetAnimated function', () => {
      const { result, rerender } = renderHook(() => useGadgetAnimations());

      const initialRemoveFunction = result.current.removeGadgetAnimated;
      rerender();

      expect(result.current.removeGadgetAnimated).toBe(initialRemoveFunction);
    });

    it('should recreate functions when dependencies change', () => {
      const { result, rerender } = renderHook(() => useGadgetAnimations());

      const initialClearFunction = result.current.clearGadgetsAnimated;
      const initialRemoveFunction = result.current.removeGadgetAnimated;

      // Change the mocked return value to trigger dependency change
      const newUpdateGadget = vi.fn();
      mockUseGadgetState.mockReturnValue({
        gadgets: mockGadgets,
        clearGadgets: mockClearGadgets,
        updateGadget: newUpdateGadget, // Different function reference
        hasGadgets: true,
        addGadget: vi.fn(),
        setGadgets: vi.fn(),
        createGadget: vi.fn(),
        removeGadget: vi.fn(),
        groupGadget: vi.fn(),
        leaveGroup: vi.fn(),
      });

      rerender();

      expect(result.current.clearGadgetsAnimated).not.toBe(initialClearFunction);
      expect(result.current.removeGadgetAnimated).not.toBe(initialRemoveFunction);
    });
  });

  describe('edge cases', () => {
    it('should handle gadget removal callback errors gracefully', () => {
      const { result } = renderHook(() => useGadgetAnimations());
      const mockRemoveCallback = vi.fn(() => {
        throw new Error('Remove callback failed');
      });

      act(() => {
        result.current.removeGadgetAnimated('gadget-1', mockRemoveCallback);
      });

      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false });

      // Callback should still be called after timeout, but will throw
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(500);
        });
      }).toThrow('Remove callback failed');

      expect(mockRemoveCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle clearGadgets throwing errors gracefully', () => {
      const { result } = renderHook(() => useGadgetAnimations());

      mockClearGadgets.mockImplementation(() => {
        throw new Error('Clear failed');
      });

      act(() => {
        result.current.clearGadgetsAnimated();
      });

      // Fast-forward to clear timeout
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(700); // (3-1) * 100 + 500 = 700ms
        });
      }).toThrow('Clear failed');
    });
  });

  describe('timing consistency', () => {
    beforeEach(() => {
      // Reset mocks to ensure clean state for timing tests
      mockUpdateGadget.mockReset();
      mockClearGadgets.mockReset();
      mockUseGadgetState.mockReturnValue({
        gadgets: mockGadgets,
        clearGadgets: mockClearGadgets,
        updateGadget: mockUpdateGadget,
        hasGadgets: true,
        addGadget: vi.fn(),
        setGadgets: vi.fn(),
        createGadget: vi.fn(),
        removeGadget: vi.fn(),
        groupGadget: vi.fn(),
        leaveGroup: vi.fn(),
      });
    });

    it('should use consistent animation duration across functions', () => {
      const { result } = renderHook(() => useGadgetAnimations());
      const mockRemoveCallback = vi.fn();

      // Both functions should use 500ms duration
      act(() => {
        result.current.removeGadgetAnimated('gadget-1', mockRemoveCallback);
      });

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(mockRemoveCallback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockRemoveCallback).toHaveBeenCalledTimes(1);
    });

    it('should use consistent stagger delay for clearGadgetsAnimated', () => {
      const { result } = renderHook(() => useGadgetAnimations());

      act(() => {
        result.current.clearGadgetsAnimated();
      });

      // Should stagger every 100ms
      act(() => {
        vi.advanceTimersByTime(99);
      });
      expect(mockUpdateGadget).toHaveBeenCalledTimes(1); // First gadget at 0ms

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockUpdateGadget).toHaveBeenCalledTimes(2); // Second gadget at 100ms

      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(mockUpdateGadget).toHaveBeenCalledTimes(3); // Third gadget at 200ms
    });
  });
});
