import { Meta, StoryObj } from '@storybook/react-vite';
import { GadgetSpeedDial } from '../src/components/GadgetSpeedDial';

type Story = StoryObj<typeof GadgetSpeedDial>;

const meta: Meta<typeof GadgetSpeedDial> = {
  component: GadgetSpeedDial,
  title: 'basic/GadgetSpeedDial',
  tags: ['dashboard', 'atoms'],
};

export default meta;

export const Default: Story = {};
