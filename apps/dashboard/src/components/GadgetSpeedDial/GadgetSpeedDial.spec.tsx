import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GadgetSpeedDial } from './GadgetSpeedDial';
import { GadgetSpeedDialProps } from './types';

describe('GadgetSpeedDial', () => {
  const defaultProps: GadgetSpeedDialProps = {
    onAddGadget: vi.fn(),
    onClearGadgets: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows add button on hover and calls onAddGadget when clicked', async () => {
    const user = userEvent.setup();
    render(<GadgetSpeedDial {...defaultProps} />);

    const dial = screen.getByLabelText('Speed dial for gadget control');

    await user.hover(dial);

    const addButton = await screen.findByLabelText('Add Gadget');
    const clearButton = screen.queryByLabelText('Clear Gadgets');

    await waitFor(
      () => {
        expect(addButton).toBeVisible();
        expect(clearButton).toBeNull();
      },
      { timeout: 1000 }
    );

    // Use fireEvent for buttons with pointer-events: none
    fireEvent.click(addButton);

    expect(defaultProps.onAddGadget).toHaveBeenCalledTimes(1);
  });

  it('shows both add and clear buttons when showClearButton is true', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps, showClearButton: true };
    render(<GadgetSpeedDial {...props} />);

    const dial = screen.getByLabelText('Speed dial for gadget control');

    await user.hover(dial);

    const addButton = screen.getByLabelText('Add Gadget');
    const clearButton = screen.getByLabelText('Clear Gadgets');

    await waitFor(
      () => {
        expect(addButton).toBeVisible();
        expect(clearButton).toBeVisible();
      },
      { timeout: 1000 }
    );

    // Use fireEvent for buttons with pointer-events: none
    fireEvent.click(clearButton);

    expect(defaultProps.onClearGadgets).toHaveBeenCalledTimes(1);
  });

  it('does not show clear button by default', async () => {
    const user = userEvent.setup();
    render(<GadgetSpeedDial {...defaultProps} />);

    const dial = screen.getByLabelText('Speed dial for gadget control');
    await user.hover(dial);

    const clearButton = screen.queryByLabelText('Clear Gadgets');
    expect(clearButton).toBeNull();
  });
});
