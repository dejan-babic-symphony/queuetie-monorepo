import { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { GadgetSpeedDial } from '../src/components/GadgetSpeedDial';
import { GadgetSpeedDialProps } from '../src/components/GadgetSpeedDial/types';

type Story = StoryObj<typeof GadgetSpeedDial>;

const meta: Meta<typeof GadgetSpeedDial> = {
  component: GadgetSpeedDial,
  title: 'basic/GadgetSpeedDial',
  tags: ['dashboard', 'atoms'],
  parameters: { interactions: { disable: true } },
  args: {
    onAddGadget: fn(),
    onClearGadgets: fn(),
  } as GadgetSpeedDialProps,
};

export default meta;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dial = await canvas.findByLabelText('Speed dial for gadget control');

    await userEvent.hover(dial);

    const addButton = await canvas.findByLabelText('Add Gadget');
    const clearButton = canvas.queryByLabelText('Clear Gadgets');

    await waitFor(
      () => {
        expect(addButton).toBeVisible();
        expect(clearButton).toBeNull();
      },
      { timeout: 100 }
    );

    await userEvent.click(addButton);

    await expect(args.onAddGadget).toHaveBeenCalledTimes(1);
  },
};

export const WithClearGadgets = {
  args: { showClearButton: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dial = await canvas.findByLabelText('Speed dial for gadget control');

    const addButton = await canvas.findByLabelText('Add Gadget');
    const clearButton = await canvas.findByLabelText('Clear Gadgets');

    await userEvent.hover(dial);

    await waitFor(
      () => {
        expect(addButton).toBeVisible();
        expect(clearButton).toBeVisible();
      },
      { timeout: 100 }
    );

    await userEvent.click(clearButton);

    await expect(args.onClearGadgets).toHaveBeenCalledTimes(1);
  },
};
