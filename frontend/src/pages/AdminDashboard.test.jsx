import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('AdminDashboard', () => {
  it('shows four required statistics and selects only the five newest posts', () => {
    window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'u1', role: 'user' }, { id: 'a1', role: 'admin' }]));
    window.localStorage.setItem('writespace_posts', JSON.stringify(Array.from({ length: 6 }, (_, index) => ({ id: `p${index}`, title: `Post ${index}`, authorName: 'Writer', createdAt: `2025-01-0${index + 1}` }))));

    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);

    expect(screen.getByText('Total Posts')).toBeVisible();
    expect(screen.getByText('Total Users')).toBeVisible();
    expect(screen.getByText('Total Admins')).toBeVisible();
    expect(screen.getByText('Total users')).toBeVisible();
    expect(screen.getByText('Post 5')).toBeVisible();
    expect(screen.queryByText('Post 0')).not.toBeInTheDocument();
  });

  it('keeps a post when dashboard deletion is cancelled', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p1', title: 'Keep me', authorName: 'Writer', createdAt: '2025-01-01' }]));
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(window.localStorage.getItem('writespace_posts')).toContain('Keep me');
  });

  it('removes a post when dashboard deletion is confirmed', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p1', title: 'Remove me', authorName: 'Writer', createdAt: '2025-01-01' }]));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(window.localStorage.getItem('writespace_posts')).toBe('[]');
  });

  it('provides administrator quick actions', () => {
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);

    expect(screen.getByRole('link', { name: 'Write New Post' })).toHaveAttribute('href', '/write');
    expect(screen.getByRole('link', { name: 'Manage Users' })).toHaveAttribute('href', '/users');
  });
});
