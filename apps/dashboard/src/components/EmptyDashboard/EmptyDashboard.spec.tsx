import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyDashboard } from './EmptyDashboard';

describe('EmptyDashboard', () => {
  it('renders empty dashboard message', () => {
    render(<EmptyDashboard />);

    expect(screen.getByText('No gadgets yet')).toBeInTheDocument();
    expect(screen.getByText(/Get started by adding a gadget/i)).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<EmptyDashboard />);

    const heading = screen.getByText('No gadgets yet');
    expect(heading).toBeInTheDocument();
  });

  it('displays the instruction text', () => {
    render(<EmptyDashboard />);

    const instruction = screen.getByText(/Get started by adding a gadget/i);
    expect(instruction).toBeInTheDocument();
  });
});
