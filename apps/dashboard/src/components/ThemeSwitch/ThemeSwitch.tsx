import Switch from '@mui/material/Switch';
import { ThemeSwitchProps } from './types';

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ checked, handleChange }) => {
  const label = { inputProps: { 'aria-label': 'Theme switch' } };

  const sx = {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 1000,
  };

  return (
    <>
      <Switch {...label} checked={checked} onChange={handleChange} sx={sx} />
    </>
  );
};
