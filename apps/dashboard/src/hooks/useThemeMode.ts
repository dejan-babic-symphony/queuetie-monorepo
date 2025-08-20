import { createTheme, Theme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export const useThemeMode = () => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('queuetie-theme') as 'light' | 'dark' | null;
    return saved ?? (prefersDarkMode ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('queuetie-theme', mode);
  }, [mode]);

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { mode, theme, setMode, toggleTheme };
};
