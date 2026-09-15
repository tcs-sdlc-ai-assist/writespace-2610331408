import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

afterEach(() => window.localStorage.clear());
describe('LandingPage', () => {
  it('shows public discovery copy and an empty latest-post state', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /your thoughts/i })).toBeVisible();
    expect(screen.getByText('No posts yet — check back soon!')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Get Started Free' })).toHaveAttribute('href', '/register');
  });
  it('renders up to three most recent local post previews', () => {
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'old', title: 'Old', content: 'Old post', createdAt: '2024-01-01' }, { id: 'new', title: 'New', content: 'New post', createdAt: '2025-01-01' }]));
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText('New')).toBeVisible();
    expect(screen.getByText('Old')).toBeVisible();
  });
});
