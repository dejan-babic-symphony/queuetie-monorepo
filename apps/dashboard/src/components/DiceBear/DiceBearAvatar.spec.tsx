import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DiceBearAvatar } from './DiceBearAvatar';
import { DiceBearVariant } from './types';

describe('DiceBearAvatar', () => {
  it('renders with default variant and generates correct src URL', () => {
    const seed = 'John Doe';
    const defaultVariant = DiceBearVariant.BOTTTS;

    render(<DiceBearAvatar seed={seed} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      `https://api.dicebear.com/9.x/${defaultVariant}/svg?seed=${encodeURIComponent(seed.trim())}`
    );
    expect(img).toHaveAttribute('alt', seed);
  });

  it('renders with different variant and custom size', () => {
    const seed = 'Jane Roe';
    const variant = DiceBearVariant.IDENTICON;
    const size = 36;

    render(<DiceBearAvatar seed={seed} variant={variant} size={size} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      `https://api.dicebear.com/9.x/${variant}/svg?seed=${encodeURIComponent(seed.trim())}`
    );
    expect(img).toHaveAttribute('alt', seed);
  });

  it('handles seeds with spaces correctly', () => {
    const seed = '  Test User  ';
    const variant = DiceBearVariant.BOTTTS;

    render(<DiceBearAvatar seed={seed} variant={variant} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      `https://api.dicebear.com/9.x/${variant}/svg?seed=${encodeURIComponent(seed.trim())}`
    );
  });
});
