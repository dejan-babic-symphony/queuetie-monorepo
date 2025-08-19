import { Avatar } from '@mui/material';
import { FC, useCallback } from 'react';
import { DiceBearProps, DiceBearVariant } from './types';

export const DiceBearAvatar: FC<DiceBearProps> = ({
  seed,
  variant = DiceBearVariant.BOTTTS,
  size = 36,
}) => {
  const getDiceUrl = useCallback(
    () => `https://api.dicebear.com/9.x/${variant}/svg?seed=${encodeURIComponent(seed.trim())}`,
    [variant, seed]
  );

  const getInitials = () => {
    return seed
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <Avatar
      variant="square"
      src={getDiceUrl()}
      alt={seed}
      slotProps={{ img: { loading: 'eager' } }}
      sx={{ width: size ?? 36, height: size ?? 36 }}
    >
      {getInitials()}
    </Avatar>
  );
};
