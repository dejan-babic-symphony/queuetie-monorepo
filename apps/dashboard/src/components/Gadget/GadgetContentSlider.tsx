import { Box, Slide } from '@mui/material';
import { CSSProperties, FC, useRef } from 'react';
import { useGadgetInstance } from '../../providers';
import { GadgetContentSliderProps } from './types';

export const GadgetContentSlider: FC<GadgetContentSliderProps> = ({ notifications, progress }) => {
  const { activeContent } = useGadgetInstance();
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

  const getSlideDirection = () => {
    switch (activeContent) {
      case 'progress':
        return 'right';
      case 'notifications':
        return 'left';
      default:
        return 'down';
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'progress':
        return progress;
      case 'notifications':
        return notifications;
      case 'none':
        return <Box>No content selected</Box>;
      default:
        return null;
    }
  };

  return (
    <Box ref={contentRef}>
      <Slide
        key={activeContent} // forces remount when content type changes
        container={() => contentRef.current ?? undefined}
        direction={getSlideDirection()}
        in={activeContent !== 'none'}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        <Box sx={contentContainerSx}>{renderContent()}</Box>
      </Slide>
    </Box>
  );
};
