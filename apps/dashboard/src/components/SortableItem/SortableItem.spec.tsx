import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SortableItem } from './SortableItem';
import { SortableItemProps } from './types';

// Mock @dnd-kit/sortable
const mockUseSortable = vi.fn();
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => mockUseSortable(),
}));

// Mock @dnd-kit/utilities
vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn((transform) => (transform ? 'transform: translate(10px, 20px)' : '')),
    },
  },
}));

describe('SortableItem', () => {
  const defaultProps: SortableItemProps = {
    id: 'test-item',
    children: <div data-testid="test-child">Test Content</div>,
  };

  const mockSortableReturn = {
    attributes: { role: 'button', tabIndex: 0 },
    listeners: { onMouseDown: vi.fn(), onKeyDown: vi.fn() },
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSortable.mockReturnValue(mockSortableReturn);
  });

  it('renders children correctly', () => {
    render(<SortableItem {...defaultProps} />);

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows drag handle on hover', async () => {
    const user = userEvent.setup();
    render(<SortableItem {...defaultProps} />);

    const dragArea = screen.getByRole('button');

    // Initially handle should be invisible (opacity 0)
    const dragHandle = dragArea.querySelector('div');
    expect(dragHandle).toHaveStyle({ opacity: '0' });

    // Hover over drag area
    await user.hover(dragArea);

    await waitFor(() => {
      expect(dragHandle).toHaveStyle({ opacity: '1' });
    });
  });

  it('hides drag handle when not hovering', async () => {
    const user = userEvent.setup();
    render(<SortableItem {...defaultProps} />);

    const dragArea = screen.getByRole('button');
    const dragHandle = dragArea.querySelector('div');

    // Hover then unhover
    await user.hover(dragArea);
    await user.unhover(dragArea);

    await waitFor(() => {
      expect(dragHandle).toHaveStyle({ opacity: '0' });
    });
  });
});
