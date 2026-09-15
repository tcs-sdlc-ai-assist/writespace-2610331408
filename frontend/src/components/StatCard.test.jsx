import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders its metric label, numeric value, and accent class', () => {
    render(<StatCard accent="bg-indigo-600" label="Total Posts" value={12} />);

    expect(screen.getByText('Total Posts')).toBeVisible();
    expect(screen.getByText('12')).toBeVisible();
    expect(screen.getByText('12').closest('article')).toHaveClass('bg-indigo-600');
  });

  it('renders a zero-value metric instead of treating it as missing', () => {
    render(<StatCard accent="bg-slate-600" label="Draft Posts" value={0} />);

    expect(screen.getByText('0')).toBeVisible();
    expect(screen.getByText('0').closest('article')).toHaveClass('bg-slate-600');
  });
});
