import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReadBlog from './ReadBlog';

function renderReadBlog(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route element={<ReadBlog />} path="/blog/:id" /></Routes>
    </MemoryRouter>,
  );
}

afterEach(() => window.localStorage.clear());

describe('ReadBlog', () => {
  it('shows a not-found state with a return action for an unknown post', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ displayName: 'Writer', role: 'user' }));
    renderReadBlog('/blog/missing');

    expect(screen.getByRole('heading', { name: 'Post not found' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Back to All Posts' })).toHaveAttribute('href', '/blogs');
  });

  it('shows edit and delete only to the post author', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'author-1', displayName: 'Author', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'post-1', title: 'Owned post', content: 'Body', authorId: 'author-1', authorName: 'Author', createdAt: '2025-01-01T00:00:00.000Z' }]));
    renderReadBlog('/blog/post-1');

    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/edit/post-1');
    expect(screen.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  it('hides management actions from a non-owner', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'reader-1', displayName: 'Reader', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'post-1', title: 'Another post', content: 'Body', authorId: 'author-1', authorName: 'Author', createdAt: '2025-01-01T00:00:00.000Z' }]));
    renderReadBlog('/blog/post-1');

    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });
});
