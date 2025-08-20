import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
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

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByRole('img');
    await expect(img).toHaveAttribute(
      'src',
      `https://api.dicebear.com/9.x/${args.variant}/svg?seed=${encodeURIComponent(
        args.seed.trim()
      )}`
    );
    await expect(img).toHaveAttribute('alt', args.seed);
  },
};

export const DifferentVariant: Story = {
  args: {
    seed: 'Jane Roe',
    variant: DiceBearVariant.IDENTICON,
    size: 36,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByRole('img');
    await expect(img).toHaveAttribute(
      'src',
      `https://api.dicebear.com/9.x/${args.variant}/svg?seed=${encodeURIComponent(
        args.seed.trim()
      )}`
    );
    await expect(img).toHaveAttribute('alt', args.seed);
  },
};
