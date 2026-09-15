import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import WriteBlog from './WriteBlog';

function setSession(session = { userId: 'writer-1', displayName: 'Writer', role: 'user' }) { window.localStorage.setItem('writespace_session', JSON.stringify(session)); }
afterEach(() => window.localStorage.clear());
describe('WriteBlog', () => {
  it('shows field errors when an author submits blank post fields', async () => {
    setSession(); const user = userEvent.setup(); render(<MemoryRouter><WriteBlog /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Save Post' }));
    expect(screen.getByText('Title is required.')).toBeVisible(); expect(screen.getByText('Content is required.')).toBeVisible();
  });
  it('creates a UUID-backed local post from the active author', async () => {
    setSession(); const user = userEvent.setup(); render(<MemoryRouter><WriteBlog /></MemoryRouter>);
    await user.type(screen.getByLabelText('Title'), 'Local note'); await user.type(screen.getByLabelText('Content'), 'A durable local note.'); await user.click(screen.getByRole('button', { name: 'Save Post' }));
    const [post] = JSON.parse(window.localStorage.getItem('writespace_posts')); expect(post).toMatchObject({ title: 'Local note', authorId: 'writer-1', authorName: 'Writer' }); expect(post.id).toBeTruthy(); expect(post.createdAt).toBeTruthy();
  });
  it('redirects an unauthorized user away from another author edit flow', () => {
    setSession(); window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'other-post', title: 'Other', content: 'Private', authorId: 'other', authorName: 'Other', createdAt: '2025-01-01' }]));
    render(<MemoryRouter initialEntries={['/edit/other-post']}><WriteBlog /></MemoryRouter>);
    expect(screen.queryByRole('heading', { name: /edit post/i })).not.toBeInTheDocument();
  });
});
