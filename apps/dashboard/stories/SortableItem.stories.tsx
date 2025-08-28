import { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableItem } from '../src/components/SortableItem';
import { Box } from '@mui/material';

type Story = StoryObj<typeof SortableItem>;

const SortableListDecorator: Decorator = () => {
  const [items, setItems] = useState(['item-1', 'item-2', 'item-3', 'item-4']);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          {items.map((id) => (
            <SortableItem key={id} id={id}>
              <Box
                sx={{
                  p: 2,
                  mt: 1,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                Sortable Item {id.split('-')[1]}
              </Box>
            </SortableItem>
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
};

const meta: Meta<typeof SortableItem> = {
  component: SortableItem,
  title: 'basic/SortableItem',
  tags: ['dashboard', 'atoms', 'test'],
  decorators: [SortableListDecorator],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: Story = {};
