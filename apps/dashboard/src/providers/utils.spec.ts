import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GadgetProps } from '../components/Gadget/types';
import { capitalize, createGadget, autoUngroupIfNeeded } from './utils';

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

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    uuidCounter = 0;
  });

  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle single letter strings', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('z')).toBe('Z');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should not change already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
    });

    it('should handle strings with numbers or special characters', () => {
      expect(capitalize('123test')).toBe('123test');
      expect(capitalize('!hello')).toBe('!hello');
    });
  });

  describe('createGadget', () => {
    it('should create a gadget with default properties', () => {
      const gadget = createGadget();

      expect(gadget).toEqual({
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

    it('should override properties when provided', () => {
      const override = {
        isGroup: true,
        isVisible: false,
      };

      const gadget = createGadget(override);

      expect(gadget.isGroup).toBe(true);
      expect(gadget.isVisible).toBe(false);
      expect(gadget.id).toBe('mock-uuid-1');
    });

    it('should override client properties when provided', () => {
      const override = {
        client: {
          id: 'custom-client-id',
          name: 'Custom Client Name',
        },
      };

      const gadget = createGadget(override);

      expect(gadget.client).toEqual(override.client);
      expect(gadget.organization.id).toBe('mock-uuid-2');
    });

    it('should override organization properties when provided', () => {
      const override = {
        organization: {
          id: 'custom-org-id',
          name: 'Custom Organization',
        },
      };

      const gadget = createGadget(override);

      expect(gadget.organization).toEqual(override.organization);
      expect(gadget.client.id).toBe('mock-uuid-2');
    });

    it('should override both client and organization when provided', () => {
      const override = {
        client: { id: 'client-1', name: 'Client One' },
        organization: { id: 'org-1', name: 'Org One' },
        isGroup: true,
      };

      const gadget = createGadget(override);

      expect(gadget.client).toEqual(override.client);
      expect(gadget.organization).toEqual(override.organization);
      expect(gadget.isGroup).toBe(true);
      expect(gadget.id).toBe('mock-uuid-1');
    });

    it('should generate unique IDs for each call', () => {
      const gadget1 = createGadget();
      const gadget2 = createGadget();

      expect(gadget1.id).not.toBe(gadget2.id);
      expect(gadget1.client.id).not.toBe(gadget2.client.id);
      expect(gadget1.organization.id).not.toBe(gadget2.organization.id);
    });

    it('should preserve partial overrides without affecting other properties', () => {
      const override = { isGroup: true };
      const gadget = createGadget(override);

      expect(gadget.isGroup).toBe(true);
      expect(gadget.isVisible).toBe(true); // default preserved
      expect(gadget.client.name).toBe('Amazing Widget'); // faker values
      expect(gadget.organization.name).toBe('Acme');
    });
  });

  describe('autoUngroupIfNeeded', () => {
    const createMockGadgets = (): GadgetProps[] => [
      {
        id: 'gadget-1',
        isVisible: true,
        isGroup: true,
        client: { id: 'client-1', name: 'Client 1' },
        organization: { id: 'org-1', name: 'Org 1' },
      },
      {
        id: 'gadget-2',
        isVisible: true,
        isGroup: true,
        client: { id: 'client-2', name: 'Client 2' },
        organization: { id: 'org-1', name: 'Org 1' }, // same organization
      },
      {
        id: 'gadget-3',
        isVisible: true,
        isGroup: false,
        client: { id: 'client-3', name: 'Client 3' },
        organization: { id: 'org-2', name: 'Org 2' }, // different organization
      },
    ];

    it('should ungroup gadgets when fewer than 2 remain in organization', () => {
      const gadgets = createMockGadgets();

      // Remove one gadget, leaving only 1 in org-1
      const remainingGadgets = [gadgets[0], gadgets[2]]; // gadget-1 and gadget-3

      const result = autoUngroupIfNeeded(remainingGadgets, 'org-1');

      expect(result[0].isGroup).toBe(false); // gadget-1 should be ungrouped
      expect(result[1].isGroup).toBe(false); // gadget-3 unchanged
    });

    it('should keep gadgets grouped when 2 or more remain in organization', () => {
      const gadgets = createMockGadgets();

      const result = autoUngroupIfNeeded(gadgets, 'org-1');

      // Should not change anything since there are 2 gadgets in org-1
      expect(result[0].isGroup).toBe(true);
      expect(result[1].isGroup).toBe(true);
      expect(result[2].isGroup).toBe(false); // unchanged
    });

    it('should handle empty organization correctly', () => {
      const gadgets = createMockGadgets();

      const result = autoUngroupIfNeeded(gadgets, 'non-existent-org');

      // Should not change anything since no gadgets match the organization
      expect(result).toEqual(gadgets);
    });

    it('should handle empty gadgets array', () => {
      const result = autoUngroupIfNeeded([], 'org-1');

      expect(result).toEqual([]);
    });

    it('should only affect gadgets in the specified organization', () => {
      const gadgets = [
        {
          id: 'gadget-1',
          isVisible: true,
          isGroup: true,
          client: { id: 'client-1', name: 'Client 1' },
          organization: { id: 'org-1', name: 'Org 1' },
        },
        {
          id: 'gadget-2',
          isVisible: true,
          isGroup: true,
          client: { id: 'client-2', name: 'Client 2' },
          organization: { id: 'org-2', name: 'Org 2' },
        },
      ];

      const result = autoUngroupIfNeeded(gadgets, 'org-1');

      expect(result[0].isGroup).toBe(false); // org-1 gadget ungrouped (only 1 left)
      expect(result[1].isGroup).toBe(true); // org-2 gadget unchanged
    });

    it('should handle the boundary case of exactly 2 gadgets', () => {
      const gadgets = [
        {
          id: 'gadget-1',
          isVisible: true,
          isGroup: true,
          client: { id: 'client-1', name: 'Client 1' },
          organization: { id: 'org-1', name: 'Org 1' },
        },
        {
          id: 'gadget-2',
          isVisible: true,
          isGroup: true,
          client: { id: 'client-2', name: 'Client 2' },
          organization: { id: 'org-1', name: 'Org 1' },
        },
      ];

      const result = autoUngroupIfNeeded(gadgets, 'org-1');

      // With exactly 2 gadgets, they should remain grouped
      expect(result[0].isGroup).toBe(true);
      expect(result[1].isGroup).toBe(true);
    });

    it('should handle multiple organizations with mixed group states', () => {
      const gadgets: GadgetProps[] = [
        {
          id: 'gadget-1',
          isVisible: true,
          isGroup: true,
          client: { id: 'client-1', name: 'Client 1' },
          organization: { id: 'org-1', name: 'Org 1' },
        },
        {
          id: 'gadget-2',
          isVisible: true,
          isGroup: false, // mixed group state
          client: { id: 'client-2', name: 'Client 2' },
          organization: { id: 'org-1', name: 'Org 1' },
        },
        {
          id: 'gadget-3',
          isVisible: true,
          isGroup: true,
          client: { id: 'client-3', name: 'Client 3' },
          organization: { id: 'org-2', name: 'Org 2' },
        },
      ];

      const result = autoUngroupIfNeeded(gadgets, 'org-2');

      // org-2 has only 1 gadget, should be ungrouped
      expect(result[2].isGroup).toBe(false);

      // org-1 has 2 gadgets, should remain as is
      expect(result[0].isGroup).toBe(true);
      expect(result[1].isGroup).toBe(false); // was already false
    });
  });
});
