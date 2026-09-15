import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

afterEach(() => window.localStorage.clear());

describe('Home', () => {
  it('shows the empty state and writing call to action when there are no posts', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ displayName: 'Writer', role: 'user' }));
    render(<MemoryRouter><Home /></MemoryRouter>);

    const emptyMessage = screen.getByText('No blogs yet. Be the first to write one!');
    expect(emptyMessage).toBeVisible();
    expect(emptyMessage.closest('section')).toHaveTextContent('Write');
    expect(emptyMessage.closest('section')?.querySelector('a')).toHaveAttribute('href', '/write');
  });

  it('lists saved posts newest first instead of the empty state', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'u1', displayName: 'Writer', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'old', title: 'Older post', content: 'Old content', authorId: 'u1', authorName: 'Writer', createdAt: '2025-01-01T00:00:00.000Z' },
      { id: 'new', title: 'Newer post', content: 'New content', authorId: 'u1', authorName: 'Writer', createdAt: '2025-02-01T00:00:00.000Z' },
    ]));
    render(<MemoryRouter><Home /></MemoryRouter>);

    const titles = screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/blog/')).map((link) => link.textContent);
    expect(titles).toEqual(['Newer post', 'Older post']);
    expect(screen.queryByText('No blogs yet. Be the first to write one!')).not.toBeInTheDocument();
  });
});
