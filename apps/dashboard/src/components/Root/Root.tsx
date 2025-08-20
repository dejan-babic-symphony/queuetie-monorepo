import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useMemo } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { ThemeSwitch } from '../ThemeSwitch';
import './Root.css';
import { RootProps } from './types';

export const Root: React.FC<RootProps> = ({ children, withThemeSwitch = false }) => {
  const { mode, theme, toggleTheme } = useThemeMode();
  const queryClient = useMemo(() => new QueryClient(), []);

  const handleChange = () => {
    toggleTheme();
  };

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {withThemeSwitch && <ThemeSwitch checked={mode === 'dark'} handleChange={handleChange} />}
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
