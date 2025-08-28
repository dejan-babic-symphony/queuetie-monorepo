import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Grow } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SortableItem } from '../SortableItem';
import { Gadget } from './Gadget';
import { GadgetGridProps } from './types';

export const GadgetGrid: React.FC<GadgetGridProps> = ({ gadgets, show, onReorder: reorder }) => {
  const boxSx = {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    min: '100%',
  };
  const gridSx = {
    justifyContent: 'center',
    alignItems: 'center',
  };
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = gadgets.findIndex((g) => g.id === active.id);
      const newIndex = gadgets.findIndex((g) => g.id === over?.id);
      reorder(arrayMove(gadgets, oldIndex, newIndex));
    }
  };

  return (
    <>
      {show && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={gadgets.map((gadget) => gadget.id)}
            strategy={rectSortingStrategy}
          >
            <Box sx={boxSx}>
              <Grid
                container
                direction="row"
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={gridSx}
              >
                {gadgets.map((gadget) => (
                  <Grow key={gadget.id} in={gadget.isVisible} timeout={500}>
                    <Grid>
                      <SortableItem key={gadget.id} id={gadget.id}>
                        <Gadget {...gadget} />
                      </SortableItem>
                    </Grid>
                  </Grow>
                ))}
              </Grid>
            </Box>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};
