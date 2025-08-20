import Switch from '@mui/material/Switch';
import { ThemeSwitchProps } from './types';

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ checked, handleChange }) => {
  const slotProps = { input: { 'aria-label': 'Switch between dark and light theme' } };

  const themeSwitchSx = {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 1000,
  };

  return (
    <>
      <Switch sx={themeSwitchSx} slotProps={slotProps} checked={checked} onChange={handleChange} />
    </>
  );
};
