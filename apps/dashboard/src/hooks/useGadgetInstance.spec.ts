import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGadgetInstance } from './useGadgetInstance';
import { useContext } from 'react';
import { GadgetInstanceContextType } from '../providers/GadgetInstanceContext';
import { GatewayNotification, SimulateClient, SimulateOrganization } from '@queuetie/types';
import { ProgressControl } from './useProgressControl';

// Mock useContext
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

describe('useGadgetInstance', () => {
  const mockUseContext = vi.mocked(useContext);

  const mockClient: SimulateClient = {
    id: 'client-123',
    name: 'Test Client',
  };

  const mockOrganization: SimulateOrganization = {
    id: 'org-456',
    name: 'Test Organization',
  };

  const mockNotifications: GatewayNotification[] = [
    {
      type: 'broadcast_organization',
      message: 'Test notification',
      from: 'Test User',
      timestamp: '2025-01-10T10:00:00.000Z',
    },
    {
      type: 'socket_disconnect',
      message: 'Socket disconnected',
      from: 'Queuetie',
      timestamp: '2025-01-10T10:05:00.000Z',
    },
  ];

  const mockProgressControls: Record<string, ProgressControl> = {
    'progress-1': {
      id: 'progress-1',
      progress: 50,
      status: 0, // ProgressStatus.Idle
    },
    'progress-2': {
      id: 'progress-2',
      progress: 100,
      status: 2, // ProgressStatus.Done
    },
  };

  const mockContextValue: GadgetInstanceContextType = {
    socketOn: true,
    isGroup: false,
    contentToggled: true,
    dispatchEnabled: true,
    client: mockClient,
    organization: mockOrganization,
    progressControls: mockProgressControls,
    notifications: mockNotifications,
    handleToggleSocket: vi.fn(),
    handleContentToggle: vi.fn(),
    handleSimulateDispatch: vi.fn(),
    handleClearNotifications: vi.fn(),
    handleGroupBroadcast: vi.fn(),
    handleGroupAdd: vi.fn(),
    handleGroupLeave: vi.fn(),
    handleRemove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful context access', () => {
    beforeEach(() => {
      mockUseContext.mockReturnValue(mockContextValue);
    });

    it('should return context value when provider is present', () => {
      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current).toBe(mockContextValue);
      expect(mockUseContext).toHaveBeenCalledTimes(1);
    });

    it('should return all expected properties', () => {
      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current).toHaveProperty('socketOn', true);
      expect(result.current).toHaveProperty('isGroup', false);
      expect(result.current).toHaveProperty('contentToggled', true);
      expect(result.current).toHaveProperty('dispatchEnabled', true);
      expect(result.current).toHaveProperty('client', mockClient);
      expect(result.current).toHaveProperty('organization', mockOrganization);
      expect(result.current).toHaveProperty('progressControls', mockProgressControls);
      expect(result.current).toHaveProperty('notifications', mockNotifications);
    });

    it('should return all expected handler functions', () => {
      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current).toHaveProperty('handleToggleSocket');
      expect(result.current).toHaveProperty('handleContentToggle');
      expect(result.current).toHaveProperty('handleSimulateDispatch');
      expect(result.current).toHaveProperty('handleClearNotifications');
      expect(result.current).toHaveProperty('handleGroupBroadcast');
      expect(result.current).toHaveProperty('handleGroupAdd');
      expect(result.current).toHaveProperty('handleGroupLeave');
      expect(result.current).toHaveProperty('handleRemove');

      expect(typeof result.current.handleToggleSocket).toBe('function');
      expect(typeof result.current.handleContentToggle).toBe('function');
      expect(typeof result.current.handleSimulateDispatch).toBe('function');
      expect(typeof result.current.handleClearNotifications).toBe('function');
      expect(typeof result.current.handleGroupBroadcast).toBe('function');
      expect(typeof result.current.handleGroupAdd).toBe('function');
      expect(typeof result.current.handleGroupLeave).toBe('function');
      expect(typeof result.current.handleRemove).toBe('function');
    });

    it('should call useContext with GadgetInstanceContext', () => {
      renderHook(() => useGadgetInstance());

      expect(mockUseContext).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should maintain stable reference on re-renders', () => {
      const { result, rerender } = renderHook(() => useGadgetInstance());

      const initialResult = result.current;
      rerender();

      expect(result.current).toBe(initialResult);
    });
  });

  describe('error handling', () => {
    it('should throw error when used outside provider (null context)', () => {
      mockUseContext.mockReturnValue(null);

      expect(() => {
        renderHook(() => useGadgetInstance());
      }).toThrow('useGadgetInstance must be used within a GadgetProvider');

      expect(mockUseContext).toHaveBeenCalled();
    });

    it('should throw error when context is undefined', () => {
      mockUseContext.mockReturnValue(undefined);

      expect(() => {
        renderHook(() => useGadgetInstance());
      }).toThrow('useGadgetInstance must be used within a GadgetProvider');

      expect(mockUseContext).toHaveBeenCalled();
    });

    it('should throw error with correct message', () => {
      mockUseContext.mockReturnValue(null);

      expect(() => {
        renderHook(() => useGadgetInstance());
      }).toThrow('useGadgetInstance must be used within a GadgetProvider');
    });

    it('should not return any value when throwing', () => {
      mockUseContext.mockReturnValue(null);

      let result: any = 'should-not-exist';

      try {
        const { result: hookResult } = renderHook(() => useGadgetInstance());
        result = hookResult.current;
      } catch (error) {
        // Expected error
      }

      expect(result).toBe('should-not-exist'); // Should not be modified
    });
  });

  describe('different context states', () => {
    it('should handle context with null client and organization', () => {
      const contextWithNulls: GadgetInstanceContextType = {
        ...mockContextValue,
        client: null,
        organization: null,
      };
      mockUseContext.mockReturnValue(contextWithNulls);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.client).toBeNull();
      expect(result.current.organization).toBeNull();
      expect(result.current).toBe(contextWithNulls);
    });

    it('should handle context with socketOn false', () => {
      const contextWithSocketOff: GadgetInstanceContextType = {
        ...mockContextValue,
        socketOn: false,
        dispatchEnabled: false,
      };
      mockUseContext.mockReturnValue(contextWithSocketOff);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.socketOn).toBe(false);
      expect(result.current.dispatchEnabled).toBe(false);
    });

    it('should handle context with group gadget', () => {
      const groupContext: GadgetInstanceContextType = {
        ...mockContextValue,
        isGroup: true,
        contentToggled: false,
      };
      mockUseContext.mockReturnValue(groupContext);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.isGroup).toBe(true);
      expect(result.current.contentToggled).toBe(false);
    });

    it('should handle context with empty notifications', () => {
      const emptyNotificationsContext: GadgetInstanceContextType = {
        ...mockContextValue,
        notifications: [],
      };
      mockUseContext.mockReturnValue(emptyNotificationsContext);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.notifications).toEqual([]);
      expect(Array.isArray(result.current.notifications)).toBe(true);
    });

    it('should handle context with empty progress controls', () => {
      const emptyProgressContext: GadgetInstanceContextType = {
        ...mockContextValue,
        progressControls: {},
      };
      mockUseContext.mockReturnValue(emptyProgressContext);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.progressControls).toEqual({});
      expect(typeof result.current.progressControls).toBe('object');
    });
  });

  describe('context value types', () => {
    beforeEach(() => {
      mockUseContext.mockReturnValue(mockContextValue);
    });

    it('should return boolean values for boolean properties', () => {
      const { result } = renderHook(() => useGadgetInstance());

      expect(typeof result.current.socketOn).toBe('boolean');
      expect(typeof result.current.isGroup).toBe('boolean');
      expect(typeof result.current.contentToggled).toBe('boolean');
      expect(typeof result.current.dispatchEnabled).toBe('boolean');
    });

    it('should return objects with correct structure for client and organization', () => {
      const { result } = renderHook(() => useGadgetInstance());

      if (result.current.client) {
        expect(result.current.client).toHaveProperty('id');
        expect(result.current.client).toHaveProperty('name');
        expect(typeof result.current.client.id).toBe('string');
        expect(typeof result.current.client.name).toBe('string');
      }

      if (result.current.organization) {
        expect(result.current.organization).toHaveProperty('id');
        expect(result.current.organization).toHaveProperty('name');
        expect(typeof result.current.organization.id).toBe('string');
        expect(typeof result.current.organization.name).toBe('string');
      }
    });

    it('should return arrays with correct structure for notifications', () => {
      const { result } = renderHook(() => useGadgetInstance());

      expect(Array.isArray(result.current.notifications)).toBe(true);

      result.current.notifications.forEach((notification) => {
        expect(notification).toHaveProperty('type');
        expect(notification).toHaveProperty('message');
        expect(notification).toHaveProperty('from');
        expect(notification).toHaveProperty('timestamp');
        expect(typeof notification.type).toBe('string');
        expect(typeof notification.message).toBe('string');
        expect(typeof notification.from).toBe('string');
        expect(typeof notification.timestamp).toBe('string');
      });
    });

    it('should return object with correct structure for progress controls', () => {
      const { result } = renderHook(() => useGadgetInstance());

      expect(typeof result.current.progressControls).toBe('object');

      Object.values(result.current.progressControls).forEach((control) => {
        expect(control).toHaveProperty('id');
        expect(control).toHaveProperty('progress');
        expect(control).toHaveProperty('status');
        expect(typeof control.id).toBe('string');
        expect(typeof control.progress).toBe('number');
        expect(typeof control.status).toBe('number');
      });
    });
  });

  describe('hook behavior', () => {
    it('should call useContext only once per render', () => {
      mockUseContext.mockReturnValue(mockContextValue);

      renderHook(() => useGadgetInstance());

      expect(mockUseContext).toHaveBeenCalledTimes(1);
    });

    it('should call useContext on every re-render', () => {
      mockUseContext.mockReturnValue(mockContextValue);

      const { rerender } = renderHook(() => useGadgetInstance());

      expect(mockUseContext).toHaveBeenCalledTimes(1);

      rerender();
      expect(mockUseContext).toHaveBeenCalledTimes(2);

      rerender();
      expect(mockUseContext).toHaveBeenCalledTimes(3);
    });

    it('should return updated context when context value changes', () => {
      const initialContext = { ...mockContextValue, socketOn: false };
      const updatedContext = { ...mockContextValue, socketOn: true };

      mockUseContext.mockReturnValue(initialContext);
      const { result, rerender } = renderHook(() => useGadgetInstance());

      expect(result.current.socketOn).toBe(false);

      mockUseContext.mockReturnValue(updatedContext);
      rerender();

      expect(result.current.socketOn).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should work correctly with mock functions in context', () => {
      const mockHandleToggle = vi.fn();
      const contextWithMockFunction: GadgetInstanceContextType = {
        ...mockContextValue,
        handleToggleSocket: mockHandleToggle,
      };
      mockUseContext.mockReturnValue(contextWithMockFunction);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.handleToggleSocket).toBe(mockHandleToggle);
      expect(vi.isMockFunction(result.current.handleToggleSocket)).toBe(true);
    });

    it('should handle context with extreme values', () => {
      const extremeContext: GadgetInstanceContextType = {
        ...mockContextValue,
        progressControls: {
          extreme: {
            id: 'extreme',
            progress: Number.MAX_SAFE_INTEGER,
            status: -1,
          },
        },
        notifications: Array(1000).fill(mockNotifications[0]),
      };
      mockUseContext.mockReturnValue(extremeContext);

      const { result } = renderHook(() => useGadgetInstance());

      expect(result.current.progressControls.extreme.progress).toBe(Number.MAX_SAFE_INTEGER);
      expect(result.current.notifications).toHaveLength(1000);
    });

    it('should maintain referential equality for returned context', () => {
      mockUseContext.mockReturnValue(mockContextValue);

      const { result: result1 } = renderHook(() => useGadgetInstance());
      const { result: result2 } = renderHook(() => useGadgetInstance());

      expect(result1.current).toBe(result2.current);
    });
  });
});
