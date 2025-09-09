import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { ReactNode } from 'react';
import { GadgetStateProvider } from './GadgetStateProvider';
import { useGadgetState } from '../hooks/useGadgetState';
import { GadgetProps } from '../components/Gadget/types';

// Mock faker
vi.mock('@faker-js/faker', () => ({
  faker: {
    word: {
      adjective: vi.fn(() => 'amazing'),
      noun: vi.fn(() => 'widget'),
      sample: vi.fn(() => 'acme'),
    },
  },
}));

// Mock uuid
let uuidCounter = 0;
vi.mock('uuid', () => ({
  v4: vi.fn(() => `mock-uuid-${++uuidCounter}`),
}));

// Wrapper component for testing
const wrapper = ({ children }: { children: ReactNode }) => (
  <GadgetStateProvider>{children}</GadgetStateProvider>
);

describe('GadgetStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uuidCounter = 0; // Reset counter for predictable IDs
  });

  describe('useGadgetState hook', () => {
    it('should initialize with empty gadgets array', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      expect(result.current.gadgets).toEqual([]);
      expect(result.current.hasGadgets).toBe(false);
    });

    it('should provide all expected state and actions', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      expect(result.current).toHaveProperty('gadgets');
      expect(result.current).toHaveProperty('hasGadgets');
      expect(result.current).toHaveProperty('addGadget');
      expect(result.current).toHaveProperty('clearGadgets');
      expect(result.current).toHaveProperty('setGadgets');
      expect(result.current).toHaveProperty('updateGadget');
      expect(result.current).toHaveProperty('createGadget');
      expect(result.current).toHaveProperty('removeGadget');
      expect(result.current).toHaveProperty('groupGadget');
      expect(result.current).toHaveProperty('leaveGroup');
    });
  });

  describe('addGadget', () => {
    it('should add a new gadget to the array', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
      });

      expect(result.current.gadgets).toHaveLength(1);
      expect(result.current.hasGadgets).toBe(true);
    });

    it('should add multiple gadgets maintaining order', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
        result.current.addGadget();
        result.current.addGadget();
      });

      expect(result.current.gadgets).toHaveLength(3);
      expect(result.current.gadgets[0].id).toBe('mock-uuid-1');
    });

    it('should create gadgets with proper default structure', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
      });

      const gadget = result.current.gadgets[0];
      expect(gadget).toHaveProperty('id');
      expect(gadget).toHaveProperty('isVisible', true);
      expect(gadget).toHaveProperty('isGroup', false);
      expect(gadget).toHaveProperty('client');
      expect(gadget).toHaveProperty('organization');
      // Actions are now separate functions, not embedded in gadget objects
      expect(gadget).not.toHaveProperty('onGroup');
      expect(gadget).not.toHaveProperty('onGroupLeave');
      expect(gadget).not.toHaveProperty('onRemove');
    });
  });

  describe('clearGadgets', () => {
    it('should remove all gadgets immediately', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      // Add some gadgets first
      act(() => {
        result.current.addGadget();
        result.current.addGadget();
      });

      expect(result.current.gadgets).toHaveLength(2);

      // Clear gadgets
      act(() => {
        result.current.clearGadgets();
      });

      expect(result.current.gadgets).toEqual([]);
      expect(result.current.hasGadgets).toBe(false);
    });

    it('should handle clearing when no gadgets exist', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      expect(() => {
        act(() => {
          result.current.clearGadgets();
        });
      }).not.toThrow();

      expect(result.current.gadgets).toEqual([]);
    });
  });

  describe('updateGadget', () => {
    it('should update specific gadget properties', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
      });

      const gadgetId = result.current.gadgets[0].id;

      act(() => {
        result.current.updateGadget(gadgetId, { isGroup: true });
      });

      const updatedGadget = result.current.gadgets.find((g) => g.id === gadgetId);
      expect(updatedGadget?.isGroup).toBe(true);
    });

    it('should not affect other gadgets when updating one', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
        result.current.addGadget();
      });

      const [firstGadget] = result.current.gadgets;

      act(() => {
        result.current.updateGadget(firstGadget.id, { isGroup: true });
      });

      const updatedGadgets = result.current.gadgets;
      expect(updatedGadgets[0].isGroup).toBe(true);
      expect(updatedGadgets[1].isGroup).toBe(false);
    });

    it('should handle updating non-existent gadget gracefully', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
      });

      expect(() => {
        act(() => {
          result.current.updateGadget('non-existent-id', { isGroup: true });
        });
      }).not.toThrow();

      // Original gadget should remain unchanged
      expect(result.current.gadgets[0].isGroup).toBe(false);
    });
  });

  describe('createGadget', () => {
    it('should create gadget with default properties', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      let createdGadget: GadgetProps;
      act(() => {
        createdGadget = result.current.createGadget();
      });

      expect(createdGadget!).toEqual({
        id: 'mock-uuid-1',
        isVisible: true,
        isGroup: false,
        client: {
          id: 'mock-uuid-2',
          name: 'Amazing Widget',
        },
        organization: {
          id: 'mock-uuid-3',
          name: 'Acme',
        },
      });
    });

    it('should create gadget with override properties', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      const override = {
        isGroup: true,
        client: {
          id: 'custom-client-id',
          name: 'Custom Client',
        },
      };

      let createdGadget: GadgetProps;
      act(() => {
        createdGadget = result.current.createGadget(override);
      });

      expect(createdGadget!.isGroup).toBe(true);
      expect(createdGadget!.client).toEqual(override.client);
    });
  });

  describe('gadget actions', () => {
    describe('groupGadget', () => {
      it('should create a new gadget in the same organization and mark original as group', () => {
        const { result } = renderHook(() => useGadgetState(), { wrapper });

        act(() => {
          result.current.addGadget();
        });

        const originalGadget = result.current.gadgets[0];
        const organizationId = originalGadget.organization.id;

        act(() => {
          result.current.groupGadget(originalGadget.id);
        });

        expect(result.current.gadgets).toHaveLength(2);
        expect(result.current.gadgets[0].isGroup).toBe(true);
        expect(result.current.gadgets[1].organization.id).toBe(organizationId);
        expect(result.current.gadgets[1].isGroup).toBe(true);
      });
    });

    describe('leaveGroup', () => {
      it('should change gadget organization and mark as not group', () => {
        const { result } = renderHook(() => useGadgetState(), { wrapper });

        act(() => {
          result.current.addGadget();
        });

        const gadget = result.current.gadgets[0];
        const originalOrgId = gadget.organization.id;

        // First group it
        act(() => {
          result.current.groupGadget(gadget.id);
        });

        expect(result.current.gadgets[0].isGroup).toBe(true);

        // Then leave group
        act(() => {
          result.current.leaveGroup(result.current.gadgets[0].id);
        });

        const updatedGadget = result.current.gadgets[0];
        expect(updatedGadget.isGroup).toBe(false);
        expect(updatedGadget.organization.id).not.toBe(originalOrgId);
      });
    });

    describe('removeGadget', () => {
      it('should remove gadget immediately', () => {
        const { result } = renderHook(() => useGadgetState(), { wrapper });

        act(() => {
          result.current.addGadget();
        });

        const gadget = result.current.gadgets[0];

        act(() => {
          result.current.removeGadget(gadget.id);
        });

        expect(result.current.gadgets).toHaveLength(0);
      });
    });
  });

  describe('organization counting and ungrouping', () => {
    it('should handle organization counting correctly', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      // Add three gadgets to create a proper group scenario
      act(() => {
        result.current.addGadget();
      });

      const firstGadget = result.current.gadgets[0];

      // Group the gadgets - this creates another gadget in the same org
      act(() => {
        result.current.groupGadget(firstGadget.id);
      });

      // Add one more gadget to the same org to make it 3 total
      act(() => {
        result.current.setGadgets((prev) => [
          ...prev,
          result.current.createGadget({ organization: firstGadget.organization, isGroup: true }),
        ]);
      });

      expect(result.current.gadgets).toHaveLength(3);

      // Now remove one gadget
      const gadgetToRemove = result.current.gadgets[2];
      act(() => {
        result.current.removeGadget(gadgetToRemove.id);
      });

      // Should have 2 gadgets left, and they should still be grouped since count >= 2
      expect(result.current.gadgets).toHaveLength(2);
      expect(result.current.gadgets[0].isGroup).toBe(true);
      expect(result.current.gadgets[1].isGroup).toBe(true);
    });

    it('should ungroup when only 1 gadget remains in organization', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      // Add one gadget
      act(() => {
        result.current.addGadget();
      });

      const firstGadget = result.current.gadgets[0];

      // Group it (creates another gadget in same org)
      act(() => {
        result.current.groupGadget(firstGadget.id);
      });

      expect(result.current.gadgets).toHaveLength(2);
      expect(result.current.gadgets[0].isGroup).toBe(true);
      expect(result.current.gadgets[1].isGroup).toBe(true);

      // Remove one gadget, leaving only 1 in the organization
      act(() => {
        result.current.removeGadget(result.current.gadgets[1].id);
      });

      // Should have 1 gadget left, and it should be ungrouped since count < 2
      expect(result.current.gadgets).toHaveLength(1);
      expect(result.current.gadgets[0].isGroup).toBe(false);
    });
  });

  describe('state management', () => {
    it('should handle multiple operations correctly', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
        result.current.addGadget();
      });

      const [gadget1] = result.current.gadgets;

      // Multiple operations should work correctly
      act(() => {
        result.current.removeGadget(gadget1.id);
      });

      expect(result.current.gadgets).toHaveLength(1);

      act(() => {
        result.current.clearGadgets();
      });

      expect(result.current.gadgets).toHaveLength(0);
    });
  });

  describe('performance and referential stability', () => {
    it('should maintain stable references for callback functions', () => {
      const { result, rerender } = renderHook(() => useGadgetState(), { wrapper });

      const initial = {
        addGadget: result.current.addGadget,
        clearGadgets: result.current.clearGadgets,
        updateGadget: result.current.updateGadget,
      };

      rerender();

      expect(result.current.addGadget).toBe(initial.addGadget);
      expect(result.current.clearGadgets).toBe(initial.clearGadgets);
      expect(result.current.updateGadget).toBe(initial.updateGadget);
      // createGadget is not memoized so it will be different on each render
    });

    it('should efficiently handle large numbers of gadgets', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      // Add many gadgets
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addGadget();
        }
      });

      expect(result.current.gadgets).toHaveLength(100);
      expect(result.current.hasGadgets).toBe(true);

      // Clear all should work efficiently and immediately
      act(() => {
        result.current.clearGadgets();
      });

      expect(result.current.gadgets).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid successive operations', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      act(() => {
        result.current.addGadget();
        result.current.clearGadgets();
        result.current.addGadget();
      });

      // Should have 1 gadget (clearGadgets removes all, then addGadget adds one)
      expect(result.current.gadgets).toHaveLength(1);
    });

    it('should handle empty organization names gracefully', () => {
      const { result } = renderHook(() => useGadgetState(), { wrapper });

      const gadgetWithEmptyOrg = result.current.createGadget({
        organization: { id: 'test-id', name: '' },
      });

      expect(gadgetWithEmptyOrg.organization.name).toBe('');
      expect(gadgetWithEmptyOrg.organization.id).toBe('test-id');
    });
  });
});
