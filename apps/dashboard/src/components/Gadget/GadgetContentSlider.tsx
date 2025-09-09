import { Box, Slide } from '@mui/material';
import { CSSProperties, FC, useRef } from 'react';
import { useGadgetInstance } from '../../providers';
import { GadgetContentSliderProps } from './types';

export const GadgetContentSlider: FC<GadgetContentSliderProps> = ({ notifications, progress }) => {
  const { contentToggled } = useGadgetInstance();
  const contentRef = useRef<HTMLElement>(null);

  const contentContainerSx: CSSProperties = {
    height: '172px',
    maxHeight: '172px',
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <Box ref={contentRef}>
      <Slide
        key={contentToggled ? 'progress' : 'notifications'} // forces remount
        container={() => contentRef.current ?? undefined}
        direction={contentToggled ? 'right' : 'left'}
        in
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        <Box sx={contentContainerSx}>{contentToggled ? progress : notifications}</Box>
      </Slide>
    </Box>
  );
};
