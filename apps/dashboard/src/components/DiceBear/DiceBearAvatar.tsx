import { Avatar } from '@mui/material';
import { FC, useCallback, useEffect } from 'react';
import { DiceBearProps, DiceBearVariant } from './types';

export const DiceBearAvatar: FC<DiceBearProps> = ({
  seed,
  variant = DiceBearVariant.BOTTTS,
  size,
}) => {
  const getDiceUrl = useCallback(
    () => `https://api.dicebear.com/9.x/${variant}/svg?seed=${encodeURIComponent(seed.trim())}`,
    [variant, seed]
  );

  useEffect(() => {
    const img = new window.Image();
    img.src = getDiceUrl();
  }, [getDiceUrl, seed]);

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
      sx={{ width: size ?? 36, height: size ?? 36 }}
    >
      {getInitials()}
    </Avatar>
  );
};
