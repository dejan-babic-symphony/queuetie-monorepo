import { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSwitch } from '../src/components/ThemeSwitch';

type Story = StoryObj<typeof ThemeSwitch>;

const meta: Meta<typeof ThemeSwitch> = {
  component: ThemeSwitch,
  title: 'basic/ThemeSwitch',
  tags: ['theme', 'atoms'],
};

export default meta;

export const Checked: Story = {
  args: { checked: true },
};

export const Unchecked: Story = {
  args: { checked: false },
};
