import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useThemeMode } from './useThemeMode';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
const mockMatchMedia = vi.fn();
const mockMediaQueryList = {
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
});

describe('useThemeMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMediaQueryList.matches = false;
    mockMediaQueryList.addEventListener.mockClear();
    mockMediaQueryList.removeEventListener.mockClear();
    mockMatchMedia.mockReturnValue(mockMediaQueryList);
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with light mode when no saved preference and system prefers light', () => {
      mockMediaQueryList.matches = false;
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useThemeMode());

      expect(result.current.mode).toBe('light');
      expect(result.current.theme.palette.mode).toBe('light');
    });

    it('should initialize with dark mode when no saved preference and system prefers dark', () => {
      mockMediaQueryList.matches = true;
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useThemeMode());

      expect(result.current.mode).toBe('dark');
      expect(result.current.theme.palette.mode).toBe('dark');
    });

    it('should use saved preference over system preference', () => {
      mockMediaQueryList.matches = true; // System prefers dark
      mockLocalStorage.getItem.mockReturnValue('light'); // But saved is light

      const { result } = renderHook(() => useThemeMode());

      expect(result.current.mode).toBe('light');
      expect(result.current.theme.palette.mode).toBe('light');
    });

    it('should call localStorage.getItem with correct key on initialization', () => {
      renderHook(() => useThemeMode());

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('queuetie-theme');
    });
  });

  describe('setMode', () => {
    it('should update mode and save to localStorage', () => {
      const { result } = renderHook(() => useThemeMode());

      act(() => {
        result.current.setMode('dark');
      });

      expect(result.current.mode).toBe('dark');
      expect(result.current.theme.palette.mode).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('queuetie-theme', 'dark');
    });

    it('should update theme when mode changes', () => {
      const { result } = renderHook(() => useThemeMode());

      act(() => {
        result.current.setMode('dark');
      });

      expect(result.current.theme.palette.mode).toBe('dark');

      act(() => {
        result.current.setMode('light');
      });

      expect(result.current.theme.palette.mode).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useThemeMode());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.mode).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('queuetie-theme', 'dark');
    });

    it('should toggle from dark to light', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useThemeMode());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.mode).toBe('light');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('queuetie-theme', 'light');
    });

    it('should handle multiple toggles correctly', () => {
      const { result } = renderHook(() => useThemeMode());

      // Start with light (default)
      expect(result.current.mode).toBe('light');

      act(() => {
        result.current.toggleTheme(); // light -> dark
      });
      expect(result.current.mode).toBe('dark');

      act(() => {
        result.current.toggleTheme(); // dark -> light
      });
      expect(result.current.mode).toBe('light');

      act(() => {
        result.current.toggleTheme(); // light -> dark
      });
      expect(result.current.mode).toBe('dark');
    });
  });

  describe('theme object', () => {
    it('should return a valid MUI theme object', () => {
      const { result } = renderHook(() => useThemeMode());

      expect(result.current.theme).toBeDefined();
      expect(result.current.theme.palette).toBeDefined();
      expect(result.current.theme.palette.mode).toBe('light');
    });

    it('should maintain theme object reference stability when mode unchanged', () => {
      const { result, rerender } = renderHook(() => useThemeMode());

      const initialTheme = result.current.theme;
      rerender();

      expect(result.current.theme).toBe(initialTheme);
    });

    it('should create new theme object when mode changes', () => {
      const { result } = renderHook(() => useThemeMode());

      const initialTheme = result.current.theme;

      act(() => {
        result.current.setMode('dark');
      });

      expect(result.current.theme).not.toBe(initialTheme);
      expect(result.current.theme.palette.mode).toBe('dark');
    });
  });

  describe('localStorage persistence', () => {
    it('should save mode changes to localStorage', () => {
      const { result } = renderHook(() => useThemeMode());

      act(() => {
        result.current.setMode('dark');
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('queuetie-theme', 'dark');

      act(() => {
        result.current.setMode('light');
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('queuetie-theme', 'light');
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const { result } = renderHook(() => useThemeMode());

      expect(() => {
        act(() => {
          result.current.setMode('dark');
        });
      }).not.toThrow();

      expect(result.current.mode).toBe('dark');
    });
  });

  describe('function reference stability', () => {
    it('should maintain stable references for setMode and toggleTheme', () => {
      const { result, rerender } = renderHook(() => useThemeMode());

      const initialSetMode = result.current.setMode;
      const initialToggleTheme = result.current.toggleTheme;

      rerender();

      expect(result.current.setMode).toBe(initialSetMode);
      expect(result.current.toggleTheme).toBe(initialToggleTheme);
    });
  });

  describe('system theme change listener', () => {
    it('should register media query listener on mount', () => {
      renderHook(() => useThemeMode());

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should remove listener on unmount', () => {
      const { unmount } = renderHook(() => useThemeMode());

      unmount();

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should update theme when system preference changes and no stored preference', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useThemeMode());

      // Get the listener function
      const listenerCall = mockMediaQueryList.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      );
      const listener = listenerCall![1];

      // Simulate system theme change to dark
      act(() => {
        listener({ matches: true });
      });

      expect(result.current.mode).toBe('dark');
    });

    it('should not update theme when system preference changes but user has stored preference', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useThemeMode());

      expect(result.current.mode).toBe('light');

      // Get the listener function
      const listenerCall = mockMediaQueryList.addEventListener.mock.calls.find(
        (call) => call[0] === 'change'
      );
      const listener = listenerCall![1];

      // Simulate system theme change to dark
      act(() => {
        listener({ matches: true });
      });

      // Should still be light because user has stored preference
      expect(result.current.mode).toBe('light');
    });
  });

  describe('localStorage error handling', () => {
    it('should handle localStorage.getItem errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        renderHook(() => useThemeMode());
      }).not.toThrow();
    });

    it('should handle localStorage.setItem errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const { result } = renderHook(() => useThemeMode());

      expect(() => {
        act(() => {
          result.current.setMode('dark');
        });
      }).not.toThrow();

      expect(result.current.mode).toBe('dark');
    });

    it('should handle invalid stored values gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme');

      const { result } = renderHook(() => useThemeMode());

      // Should fall back to system preference
      expect(result.current.mode).toBe('light'); // mockMediaQueryList.matches is false by default
    });
  });
});
