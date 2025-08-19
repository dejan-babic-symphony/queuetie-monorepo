import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { EmptyDashboard } from '../src/components/EmptyDashboard';

type Story = StoryObj<typeof EmptyDashboard>;

const meta: Meta<typeof EmptyDashboard> = {
  component: EmptyDashboard,
  title: 'basic/EmptyDashboard',
  tags: ['dashboard', 'atoms', 'test'],
};

export default meta;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No gadgets yet')).toBeInTheDocument();
    await expect(canvas.getByText(/Get started by adding a gadget/i)).toBeInTheDocument();
  },
};
