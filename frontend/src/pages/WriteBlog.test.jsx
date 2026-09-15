import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WriteBlog from './WriteBlog';
import * as storage from '../utils/storage';

function setSession(session = { userId: 'writer-1', displayName: 'Writer', role: 'user' }) { window.localStorage.setItem('writespace_session', JSON.stringify(session)); }
afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});
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
  it('replaces a seeded post when its author saves an edit while preserving identity and ownership', async () => {
    setSession();
    const seededPost = {
      id: 'owned-post', title: 'Original title', content: 'Original content', authorId: 'writer-1', authorName: 'Writer', createdAt: '2025-01-01',
    };
    window.localStorage.setItem('writespace_posts', JSON.stringify([seededPost]));
    vi.spyOn(storage, 'getPosts').mockReturnValue([seededPost]);
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/edit/owned-post']}>
        <Routes>
          <Route element={<WriteBlog />} path="/edit/:id" />
          <Route element={<h1>All Blogs</h1>} path="/blogs" />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByLabelText('Title')).toHaveValue('Original title'));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated title' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Updated content' } });
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('Updated title');
      expect(screen.getByLabelText('Content')).toHaveValue('Updated content');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Post' }));

    const posts = JSON.parse(window.localStorage.getItem('writespace_posts'));
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      id: 'owned-post', title: 'Updated title', content: 'Updated content', authorId: 'writer-1', authorName: 'Writer', createdAt: '2025-01-01',
    });
  });

  it('stores hostile markup as text and retains a large post payload without injecting markup', async () => {
    setSession();
    const hostileTitle = '<img src=x onerror=alert(1)>';
    const largeContent = 'A'.repeat(100_000);
    render(<MemoryRouter><WriteBlog /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: hostileTitle } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: largeContent } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Post' }));

    const [post] = JSON.parse(window.localStorage.getItem('writespace_posts'));
    expect(post.title).toBe(hostileTitle);
    expect(post.content).toHaveLength(100_000);
    expect(document.querySelector('img[src="x"]')).toBeNull();
  });

  it('redirects an unauthorized user away from another author edit flow', () => {
    setSession(); window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'other-post', title: 'Other', content: 'Private', authorId: 'other', authorName: 'Other', createdAt: '2025-01-01' }]));
    render(
      <MemoryRouter initialEntries={['/edit/other-post']}>
        <Routes>
          <Route element={<WriteBlog />} path="/edit/:id" />
          <Route element={<h1>All Blogs</h1>} path="/blogs" />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'All Blogs' })).toBeVisible();
  });
});
