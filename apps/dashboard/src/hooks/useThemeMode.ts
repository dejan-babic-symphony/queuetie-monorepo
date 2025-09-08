import { createTheme, Theme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

const getSystemThemePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getStoredTheme = (): 'light' | 'dark' | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('queuetie-theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const setStoredTheme = (mode: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('queuetie-theme', mode);
  } catch {
    // Silently fail in environments where localStorage is not available
  }
};

export const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = getStoredTheme();
    const systemPrefersDark = getSystemThemePreference();
    return stored ?? (systemPrefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    setStoredTheme(mode);
  }, [mode]);

  // Listen for system theme changes and auto-update when no user preference is saved
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const userPreference = getStoredTheme();
      if (!userPreference) {
        setMode(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { mode, theme, setMode, toggleTheme };
};
