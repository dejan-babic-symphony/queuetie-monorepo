import { FC, useEffect } from 'react';
import { DiceBearProps, DiceBearVariant } from './types';
import { Avatar } from '@mui/material';

export const DiceBearAvatar: FC<DiceBearProps> = ({ seed, variant = DiceBearVariant.BOTTTS }) => {
  useEffect(() => {
    const img = new window.Image();
    img.src = getDiceUrl();
  }, [seed]);

  const getDiceUrl = () => {
    return `https://api.dicebear.com/9.x/${variant}/svg?seed=${encodeURIComponent(seed.trim())}`;
  };

  const getInitials = () => {
    return seed
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <Avatar aria-label="avatars" src={getDiceUrl()}>
      {getInitials()}
    </Avatar>
  );
};
