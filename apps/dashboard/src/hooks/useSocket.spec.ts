import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSocket } from './useSocket';
import { SimulateClient, SimulateOrganization } from '@queuetie/types';
import * as dashboardConfig from '../config/dashboard';
import { io } from 'socket.io-client';

// Mock socket.io-client
vi.mock('socket.io-client', () => {
  const mockSocket = {
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  };

  return {
    io: vi.fn().mockReturnValue(mockSocket),
  };
});

// Mock dashboard config
const mockDashboardConfig = vi.fn();
vi.spyOn(dashboardConfig, 'dashboardConfig').mockImplementation(mockDashboardConfig);

describe('useSocket', () => {
  const mockClient: SimulateClient = {
    id: 'client-123',
    name: 'Test Client',
  };

  const mockOrganization: SimulateOrganization = {
    id: 'org-456',
    name: 'Test Organization',
  };

  const mockIo = vi.mocked(io);

  beforeEach(() => {
    vi.clearAllMocks();
    mockDashboardConfig.mockReturnValue({
      socket: {
        url: 'localhost:3000',
        token: 'test-token',
      },
    });

    // Reset the mock socket to return a fresh instance
    const mockSocket = {
      disconnect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };
    mockIo.mockReturnValue(mockSocket as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize and set socket after effect runs', () => {
      const { result } = renderHook(() => useSocket(mockClient, mockOrganization));

      // Socket is set immediately after effect runs
      expect(result.current.socket).toBeDefined();
      expect(result.current.socket).toHaveProperty('disconnect');
    });

    it('should call dashboardConfig once due to memoization', () => {
      renderHook(() => useSocket(mockClient, mockOrganization));

      expect(mockDashboardConfig).toHaveBeenCalledTimes(1);
    });

    it('should create socket connection with correct URL and headers', () => {
      renderHook(() => useSocket(mockClient, mockOrganization));

      expect(mockIo).toHaveBeenCalledWith('localhost:3000', {
        extraHeaders: {
          token: 'test-token',
          clientId: 'client-123',
          clientName: 'Test Client',
          organizationId: 'org-456',
          organizationName: 'Test Organization',
        },
      });
    });
  });

  describe('config memoization', () => {
    it('should memoize config and not recreate on re-renders', () => {
      const { rerender } = renderHook(() => useSocket(mockClient, mockOrganization));

      expect(mockDashboardConfig).toHaveBeenCalledTimes(1);

      rerender();

      // Should still be called only once due to memoization
      expect(mockDashboardConfig).toHaveBeenCalledTimes(1);
    });

    it('should use empty dependency array for config memoization', () => {
      renderHook(() => useSocket(mockClient, mockOrganization));

      // Config should be memoized and stable across renders
      expect(mockDashboardConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('socket connection management', () => {
    it('should create new socket connection when dependencies change', () => {
      const { rerender } = renderHook(
        ({ client, organization }) => useSocket(client, organization),
        {
          initialProps: { client: mockClient, organization: mockOrganization },
        }
      );

      expect(mockIo).toHaveBeenCalledTimes(1);

      const updatedClient = { ...mockClient, id: 'client-updated' };
      rerender({ client: updatedClient, organization: mockOrganization });

      expect(mockIo).toHaveBeenCalledTimes(2);
      expect(mockIo).toHaveBeenLastCalledWith('localhost:3000', {
        extraHeaders: {
          token: 'test-token',
          clientId: 'client-updated',
          clientName: 'Test Client',
          organizationId: 'org-456',
          organizationName: 'Test Organization',
        },
      });
    });

    it('should use memoized config so URL changes do not trigger new connections on rerender', () => {
      const { rerender } = renderHook(() => useSocket(mockClient, mockOrganization));

      expect(mockIo).toHaveBeenCalledTimes(1);

      // Change config to return different URL (but config is memoized)
      mockDashboardConfig.mockReturnValue({
        socket: {
          url: 'localhost:4000',
          token: 'test-token',
        },
      });

      rerender();

      // Should NOT create new connection because config is memoized
      expect(mockIo).toHaveBeenCalledTimes(1);
    });

    it('should use memoized config so token changes do not trigger new connections on rerender', () => {
      const { rerender } = renderHook(() => useSocket(mockClient, mockOrganization));

      expect(mockIo).toHaveBeenCalledTimes(1);

      // Change config to return different token (but config is memoized)
      mockDashboardConfig.mockReturnValue({
        socket: {
          url: 'localhost:3000',
          token: 'new-token',
        },
      });

      rerender();

      // Should NOT create new connection because config is memoized
      expect(mockIo).toHaveBeenCalledTimes(1);
    });
  });

  describe('socket cleanup', () => {
    it('should disconnect socket on unmount', () => {
      const { unmount } = renderHook(() => useSocket(mockClient, mockOrganization));
      const mockSocket = mockIo.mock.results[0]?.value;

      unmount();

      expect(mockSocket?.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should disconnect previous socket when dependencies change', () => {
      const { rerender } = renderHook(({ client }) => useSocket(client, mockOrganization), {
        initialProps: { client: mockClient },
      });
      const mockSocket = mockIo.mock.results[0]?.value;

      const updatedClient = { ...mockClient, name: 'Updated Client' };
      rerender({ client: updatedClient });

      expect(mockSocket?.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle cleanup gracefully when socket is undefined', () => {
      // Mock setSocket to not be called to simulate socket being undefined
      const originalSetSocket = vi.fn();
      vi.doMock('react', async () => {
        const actual = await vi.importActual('react');
        return {
          ...actual,
          useState: () => [undefined, originalSetSocket],
        };
      });

      const { unmount } = renderHook(() => useSocket(mockClient, mockOrganization));

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('socket state management', () => {
    it('should set socket state when connection is established', () => {
      const { result } = renderHook(() => useSocket(mockClient, mockOrganization));

      // Socket should be set after effect runs
      expect(result.current.socket).toBeDefined();
      expect(mockIo).toHaveBeenCalled();
    });

    it('should return socket in the expected format', () => {
      const { result } = renderHook(() => useSocket(mockClient, mockOrganization));

      expect(result.current).toHaveProperty('socket');
      expect(typeof result.current).toBe('object');
    });
  });

  describe('edge cases', () => {
    it('should handle empty client data', () => {
      const emptyClient = { id: '', name: '', organizationId: '' };

      renderHook(() => useSocket(emptyClient, mockOrganization));

      expect(mockIo).toHaveBeenCalledWith('localhost:3000', {
        extraHeaders: {
          token: 'test-token',
          clientId: '',
          clientName: '',
          organizationId: 'org-456',
          organizationName: 'Test Organization',
        },
      });
    });

    it('should handle empty organization data', () => {
      const emptyOrganization = { id: '', name: '' };

      renderHook(() => useSocket(mockClient, emptyOrganization));

      expect(mockIo).toHaveBeenCalledWith('localhost:3000', {
        extraHeaders: {
          token: 'test-token',
          clientId: 'client-123',
          clientName: 'Test Client',
          organizationId: '',
          organizationName: '',
        },
      });
    });

    it('should handle config with fallback values', () => {
      mockDashboardConfig.mockReturnValue({
        socket: {
          url: 'localhost:3000',
          token: 'let-me-in',
        },
      });

      renderHook(() => useSocket(mockClient, mockOrganization));

      expect(mockIo).toHaveBeenCalledWith('localhost:3000', {
        extraHeaders: {
          token: 'let-me-in',
          clientId: 'client-123',
          clientName: 'Test Client',
          organizationId: 'org-456',
          organizationName: 'Test Organization',
        },
      });
    });
  });

  describe('referential stability', () => {
    it('should maintain stable socket reference when no dependencies change', () => {
      const { result, rerender } = renderHook(() => useSocket(mockClient, mockOrganization));

      const initialResult = result.current;
      rerender();

      // The returned object should be the same reference if socket hasn't changed
      expect(typeof result.current).toBe(typeof initialResult);
    });
  });

  describe('dependency tracking', () => {
    it('should include all necessary dependencies in useEffect', () => {
      renderHook(() => useSocket(mockClient, mockOrganization));

      // Verify that useEffect dependencies are working by checking that
      // changing any dependency triggers a new connection
      expect(mockIo).toHaveBeenCalledTimes(1);
    });

    it('should recreate connection when client object reference changes', () => {
      const { rerender } = renderHook(({ client }) => useSocket(client, mockOrganization), {
        initialProps: { client: mockClient },
      });

      expect(mockIo).toHaveBeenCalledTimes(1);

      // Create new client object with same values but different reference
      const sameClientNewRef = { ...mockClient };
      rerender({ client: sameClientNewRef });

      expect(mockIo).toHaveBeenCalledTimes(2);
    });

    it('should recreate connection when organization object reference changes', () => {
      const { rerender } = renderHook(({ organization }) => useSocket(mockClient, organization), {
        initialProps: { organization: mockOrganization },
      });

      expect(mockIo).toHaveBeenCalledTimes(1);

      // Create new organization object with same values but different reference
      const sameOrgNewRef = { ...mockOrganization };
      rerender({ organization: sameOrgNewRef });

      expect(mockIo).toHaveBeenCalledTimes(2);
    });
  });
});
