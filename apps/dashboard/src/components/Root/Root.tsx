import { StrictMode } from 'react';
import './Root.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useThemeMode } from '../../hooks/useThemeMode';
import { RootProps } from './types';
import { ThemeSwitch } from '../ThemeSwitch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const Root: React.FC<RootProps> = ({ children, withThemeSwitch = false }) => {
  const { mode, theme, setMode } = useThemeMode();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.checked ? 'dark' : 'light');
  };

  return (
    <StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {withThemeSwitch && <ThemeSwitch checked={mode === 'dark'} handleChange={handleChange} />}
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
