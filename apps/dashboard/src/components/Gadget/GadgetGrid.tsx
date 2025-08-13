import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GadgetGridProps } from './types';
import { Gadget } from './Gadget';
import { Grow } from '@mui/material';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { SortableItem } from '../SortableItem';

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
          <SortableContext items={gadgets} strategy={rectSortingStrategy}>
            <Box sx={boxSx}>
              <Grid
                container
                direction="row"
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={gridSx}
              >
                {gadgets.map((gadget) => (
                  <Grow key={gadget.id} in={gadget.visible} timeout={500}>
                    <Grid>
                      <SortableItem id={gadget.id}>
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
