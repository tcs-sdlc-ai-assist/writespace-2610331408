import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

afterEach(() => window.localStorage.clear());
describe('AdminDashboard', () => {
  it('shows four required statistics and selects only the five newest posts', () => {
    window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'u1', role: 'user' }, { id: 'a1', role: 'admin' }]));
    window.localStorage.setItem('writespace_posts', JSON.stringify(Array.from({ length: 6 }, (_, index) => ({ id: `p${index}`, title: `Post ${index}`, authorName: 'Writer', createdAt: `2025-01-0${index + 1}` }))));
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    expect(screen.getByText('Total Posts')).toBeVisible(); expect(screen.getByText('Total Users')).toBeVisible(); expect(screen.getByText('Total Admins')).toBeVisible(); expect(screen.getByText('Total users')).toBeVisible();
    expect(screen.getByText('Post 5')).toBeVisible(); expect(screen.queryByText('Post 0')).not.toBeInTheDocument();
  });
  it('provides administrator quick actions', () => { render(<MemoryRouter><AdminDashboard /></MemoryRouter>); expect(screen.getByRole('link', { name: 'Write New Post' })).toHaveAttribute('href', '/write'); expect(screen.getByRole('link', { name: 'Manage Users' })).toHaveAttribute('href', '/users'); });
});
