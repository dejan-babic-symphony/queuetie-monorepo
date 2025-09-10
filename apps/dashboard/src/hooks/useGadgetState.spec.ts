import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGadgetState, useGadgetActions } from './useGadgetState';
import { useContext } from 'react';
import { GadgetProps } from '../components/Gadget/types';
import { GadgetStateContextType } from '../providers/types';

// Mock useContext
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

describe('useGadgetState', () => {
  const mockUseContext = vi.mocked(useContext);

  const mockContextValue: GadgetStateContextType = {
    gadgets: [],
    hasGadgets: false,
    addGadget: vi.fn(),
    clearGadgets: vi.fn(),
    setGadgets: vi.fn(),
    removeGadget: vi.fn(),
    groupGadget: vi.fn(),
    leaveGroup: vi.fn(),
    updateGadget: vi.fn(),
    createGadget: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGadgetState hook', () => {
    it('should return context value when provider is present', () => {
      mockUseContext.mockReturnValue(mockContextValue);

      const { result } = renderHook(() => useGadgetState());

      expect(result.current).toBe(mockContextValue);
      expect(mockUseContext).toHaveBeenCalledTimes(1);
    });

    it('should throw error when used outside provider', () => {
      mockUseContext.mockReturnValue(null);

      expect(() => {
        renderHook(() => useGadgetState());
      }).toThrow('useGadgetState must be used within a GadgetStateProvider');
    });

    it('should throw error when context is undefined', () => {
      mockUseContext.mockReturnValue(undefined);

      expect(() => {
        renderHook(() => useGadgetState());
      }).toThrow('useGadgetState must be used within a GadgetStateProvider');
    });

    it('should call useContext with correct context', () => {
      mockUseContext.mockReturnValue(mockContextValue);

      renderHook(() => useGadgetState());

      expect(mockUseContext).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});

describe('useGadgetActions', () => {
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
      isVisible: false,
      isGroup: true,
      client: { id: 'client-2', name: 'Client 2' },
      organization: { id: 'org-2', name: 'Org 2' },
    },
  ];

  const mockRemoveGadget = vi.fn();
  const mockGroupGadget = vi.fn();
  const mockLeaveGroup = vi.fn();
  const mockUpdateGadget = vi.fn();

  const mockContextValue: GadgetStateContextType = {
    gadgets: mockGadgets,
    hasGadgets: true,
    addGadget: vi.fn(),
    clearGadgets: vi.fn(),
    setGadgets: vi.fn(),
    removeGadget: mockRemoveGadget,
    groupGadget: mockGroupGadget,
    leaveGroup: mockLeaveGroup,
    updateGadget: mockUpdateGadget,
    createGadget: vi.fn(),
  };

  const mockUseContext = vi.mocked(useContext);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseContext.mockReturnValue(mockContextValue);
  });

  describe('initialization', () => {
    it('should return all expected action functions', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      expect(result.current).toHaveProperty('removeGadget');
      expect(result.current).toHaveProperty('groupGadget');
      expect(result.current).toHaveProperty('leaveGroup');
      expect(result.current).toHaveProperty('updateGadget');
      expect(result.current).toHaveProperty('toggleVisibility');

      expect(typeof result.current.removeGadget).toBe('function');
      expect(typeof result.current.groupGadget).toBe('function');
      expect(typeof result.current.leaveGroup).toBe('function');
      expect(typeof result.current.updateGadget).toBe('function');
      expect(typeof result.current.toggleVisibility).toBe('function');
    });

    it('should call useGadgetState to get context', () => {
      renderHook(() => useGadgetActions('gadget-1'));

      expect(mockUseContext).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeGadget action', () => {
    it('should call context removeGadget with correct gadgetId', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.removeGadget();
      });

      expect(mockRemoveGadget).toHaveBeenCalledTimes(1);
      expect(mockRemoveGadget).toHaveBeenCalledWith('gadget-1');
    });

    it('should work with different gadget IDs', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-2'));

      act(() => {
        result.current.removeGadget();
      });

      expect(mockRemoveGadget).toHaveBeenCalledWith('gadget-2');
    });
  });

  describe('groupGadget action', () => {
    it('should call context groupGadget with correct gadgetId', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.groupGadget();
      });

      expect(mockGroupGadget).toHaveBeenCalledTimes(1);
      expect(mockGroupGadget).toHaveBeenCalledWith('gadget-1');
    });

    it('should work with different gadget IDs', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-2'));

      act(() => {
        result.current.groupGadget();
      });

      expect(mockGroupGadget).toHaveBeenCalledWith('gadget-2');
    });
  });

  describe('leaveGroup action', () => {
    it('should call context leaveGroup with correct gadgetId', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.leaveGroup();
      });

      expect(mockLeaveGroup).toHaveBeenCalledTimes(1);
      expect(mockLeaveGroup).toHaveBeenCalledWith('gadget-1');
    });

    it('should work with different gadget IDs', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-2'));

      act(() => {
        result.current.leaveGroup();
      });

      expect(mockLeaveGroup).toHaveBeenCalledWith('gadget-2');
    });
  });

  describe('updateGadget action', () => {
    it('should call context updateGadget with correct gadgetId and updates', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));
      const updates = { isVisible: false, isGroup: true };

      act(() => {
        result.current.updateGadget(updates);
      });

      expect(mockUpdateGadget).toHaveBeenCalledTimes(1);
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', updates);
    });

    it('should work with partial updates', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-2'));
      const updates = { isVisible: true };

      act(() => {
        result.current.updateGadget(updates);
      });

      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-2', updates);
    });

    it('should work with empty updates object', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.updateGadget({});
      });

      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', {});
    });
  });

  describe('toggleVisibility action', () => {
    it('should toggle visibility for existing visible gadget', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.toggleVisibility();
      });

      expect(mockUpdateGadget).toHaveBeenCalledTimes(1);
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false });
    });

    it('should toggle visibility for existing invisible gadget', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-2'));

      act(() => {
        result.current.toggleVisibility();
      });

      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-2', { isVisible: true });
    });

    it('should not call updateGadget for non-existent gadget', () => {
      const { result } = renderHook(() => useGadgetActions('non-existent-gadget'));

      act(() => {
        result.current.toggleVisibility();
      });

      expect(mockUpdateGadget).not.toHaveBeenCalled();
    });

    it('should handle empty gadgets array gracefully', () => {
      mockUseContext.mockReturnValue({
        ...mockContextValue,
        gadgets: [],
      });

      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.toggleVisibility();
      });

      expect(mockUpdateGadget).not.toHaveBeenCalled();
    });
  });

  describe('function memoization', () => {
    it('should memoize removeGadget function', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.removeGadget;
      rerender();

      expect(result.current.removeGadget).toBe(initialFunction);
    });

    it('should memoize groupGadget function', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.groupGadget;
      rerender();

      expect(result.current.groupGadget).toBe(initialFunction);
    });

    it('should memoize leaveGroup function', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.leaveGroup;
      rerender();

      expect(result.current.leaveGroup).toBe(initialFunction);
    });

    it('should memoize updateGadget function', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.updateGadget;
      rerender();

      expect(result.current.updateGadget).toBe(initialFunction);
    });

    it('should memoize toggleVisibility function', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.toggleVisibility;
      rerender();

      expect(result.current.toggleVisibility).toBe(initialFunction);
    });

    it('should recreate functions when gadgetId changes', () => {
      const { result, rerender } = renderHook(({ gadgetId }) => useGadgetActions(gadgetId), {
        initialProps: { gadgetId: 'gadget-1' },
      });

      const initialRemoveFunction = result.current.removeGadget;
      const initialGroupFunction = result.current.groupGadget;

      rerender({ gadgetId: 'gadget-2' });

      expect(result.current.removeGadget).not.toBe(initialRemoveFunction);
      expect(result.current.groupGadget).not.toBe(initialGroupFunction);
    });

    it('should recreate functions when context functions change', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.removeGadget;

      // Mock new context with different function references
      mockUseContext.mockReturnValue({
        ...mockContextValue,
        removeGadget: vi.fn(),
        groupGadget: vi.fn(),
        leaveGroup: vi.fn(),
        updateGadget: vi.fn(),
      });

      rerender();

      expect(result.current.removeGadget).not.toBe(initialFunction);
    });

    it('should recreate toggleVisibility when gadgets array changes', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      const initialFunction = result.current.toggleVisibility;

      // Mock context with different gadgets array
      mockUseContext.mockReturnValue({
        ...mockContextValue,
        gadgets: [
          ...mockGadgets,
          {
            id: 'gadget-3',
            isVisible: true,
            isGroup: false,
            client: { id: 'client-3', name: 'Client 3' },
            organization: { id: 'org-3', name: 'Org 3' },
          },
        ],
      });

      rerender();

      expect(result.current.toggleVisibility).not.toBe(initialFunction);
    });
  });

  describe('multiple actions', () => {
    it('should handle multiple actions correctly', () => {
      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      act(() => {
        result.current.removeGadget();
        result.current.groupGadget();
        result.current.leaveGroup();
        result.current.updateGadget({ isVisible: false });
        result.current.toggleVisibility();
      });

      expect(mockRemoveGadget).toHaveBeenCalledWith('gadget-1');
      expect(mockGroupGadget).toHaveBeenCalledWith('gadget-1');
      expect(mockLeaveGroup).toHaveBeenCalledWith('gadget-1');
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false });
      expect(mockUpdateGadget).toHaveBeenCalledWith('gadget-1', { isVisible: false }); // toggleVisibility
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      // Reset all mock implementations before each test
      mockRemoveGadget.mockReset();
      mockGroupGadget.mockReset();
      mockLeaveGroup.mockReset();
      mockUpdateGadget.mockReset();
    });

    it('should handle context methods throwing errors', () => {
      mockRemoveGadget.mockImplementation(() => {
        throw new Error('Remove failed');
      });

      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      expect(() => {
        act(() => {
          result.current.removeGadget();
        });
      }).toThrow('Remove failed');
    });

    it('should handle updateGadget throwing in toggleVisibility', () => {
      mockUpdateGadget.mockImplementation(() => {
        throw new Error('Update failed');
      });

      const { result } = renderHook(() => useGadgetActions('gadget-1'));

      expect(() => {
        act(() => {
          result.current.toggleVisibility();
        });
      }).toThrow('Update failed');
    });

    it('should work with special characters in gadget ID', () => {
      const specialId = 'gadget-with-special-chars-!@#$%^&*()';
      const { result } = renderHook(() => useGadgetActions(specialId));

      act(() => {
        result.current.removeGadget();
      });

      expect(mockRemoveGadget).toHaveBeenCalledWith(specialId);
    });

    it('should work with empty string gadget ID', () => {
      const { result } = renderHook(() => useGadgetActions(''));

      act(() => {
        result.current.removeGadget();
      });

      expect(mockRemoveGadget).toHaveBeenCalledWith('');
    });
  });

  describe('dependency array correctness', () => {
    it('should include correct dependencies for each action', () => {
      const { result, rerender } = renderHook(() => useGadgetActions('gadget-1'));

      // Functions should be stable when dependencies don't change
      const actions = { ...result.current };
      rerender();

      expect(result.current.removeGadget).toBe(actions.removeGadget);
      expect(result.current.groupGadget).toBe(actions.groupGadget);
      expect(result.current.leaveGroup).toBe(actions.leaveGroup);
      expect(result.current.updateGadget).toBe(actions.updateGadget);
      expect(result.current.toggleVisibility).toBe(actions.toggleVisibility);
    });
  });
});
