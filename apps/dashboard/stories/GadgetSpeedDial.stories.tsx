import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { GadgetSpeedDial } from '../src/components/GadgetSpeedDial';
import { GadgetSpeedDialProps } from '../src/components/GadgetSpeedDial/types';

type Story = StoryObj<typeof GadgetSpeedDial>;

const meta: Meta<typeof GadgetSpeedDial> = {
  component: GadgetSpeedDial,
  title: 'basic/GadgetSpeedDial',
  tags: ['dashboard', 'atoms'],
  args: {
    onAddGadget: fn(),
    onClearGadgets: fn(),
  } as GadgetSpeedDialProps,
};

export default meta;

export const Default: Story = {};

export const WithClearGadgets: Story = {
  args: { showClearButton: true },
};
