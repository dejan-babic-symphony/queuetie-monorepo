import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, SxProps, Theme } from '@mui/material';
import { CSSProperties, FC, useState } from 'react';
import { SortableItemProps } from './types';

export const SortableItem: FC<SortableItemProps> = ({ id, children }) => {
  const [isHandleHovered, setIsHandleHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const dndStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: !isDragging ? undefined : transition,
    zIndex: isDragging ? 1000 : undefined,
    willChange: 'transform',
    padding: 0,
  };

  const dragAreaSx: SxProps<Theme> = {
    height: '12px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: -1,
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  };

  const dragHandleSx: SxProps<Theme> = {
    height: '4px',
    width: '40px',
    borderRadius: '2px',
    backgroundColor: (theme: Theme) => theme.palette.primary.main,
    opacity: isHandleHovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
  };

  return (
    <Box ref={setNodeRef} sx={dndStyle}>
      <Box
        {...listeners}
        {...attributes}
        sx={dragAreaSx}
        onMouseEnter={() => setIsHandleHovered(true)}
        onMouseLeave={() => setIsHandleHovered(false)}
      >
        <Box sx={dragHandleSx} />
      </Box>
      {children}
    </Box>
  );
};
