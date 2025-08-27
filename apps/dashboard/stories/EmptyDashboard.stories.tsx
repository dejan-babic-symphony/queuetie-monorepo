import { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyDashboard } from '../src/components/EmptyDashboard';

type Story = StoryObj<typeof EmptyDashboard>;

const meta: Meta<typeof EmptyDashboard> = {
  component: EmptyDashboard,
  title: 'basic/EmptyDashboard',
  tags: ['dashboard', 'atoms', 'test'],
};

export default meta;

export const Default: Story = {};
