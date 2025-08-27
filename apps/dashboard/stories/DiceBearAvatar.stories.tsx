import { Meta, StoryObj } from '@storybook/react-vite';
import { DiceBearAvatar } from '../src/components/DiceBear';
import { DiceBearVariant } from '../src/components/DiceBear/types';

type Story = StoryObj<typeof DiceBearAvatar>;

const meta: Meta<typeof DiceBearAvatar> = {
  component: DiceBearAvatar,
  title: 'basic/DiceBearAvatar',
  tags: ['avatar', 'atoms', 'test'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.keys(DiceBearVariant),
      mapping: DiceBearVariant,
    },
    size: {
      control: { type: 'number', min: 16, max: 128, step: 4 },
    },
  },
  args: {
    seed: 'John Doe',
    variant: DiceBearVariant.BOTTTS,
  },
};

export default meta;

export const Default: Story = {};

export const DifferentVariant: Story = {
  args: {
    seed: 'Jane Roe',
    variant: DiceBearVariant.IDENTICON,
    size: 36,
  },
};
