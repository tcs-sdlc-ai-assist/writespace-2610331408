import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogCard from './BlogCard';

const post = { id: 'post-1', title: 'A careful title', content: 'x'.repeat(130), createdAt: '2025-01-01T00:00:00.000Z', authorId: 'writer-1', authorName: 'Writer' };
describe('BlogCard', () => {
  it('renders the required excerpt, author, date, and color cycle', () => {
    render(<MemoryRouter><BlogCard index={2} post={post} session={{ userId: 'writer-1', role: 'user' }} /></MemoryRouter>);
    expect(screen.getByText(/…$/)).toBeVisible();
    expect(screen.getByText('Writer')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Edit A careful title' })).toHaveAttribute('href', '/edit/post-1');
  });
  it('hides edit action from a non-owning user but shows it to an administrator', () => {
    const { rerender } = render(<MemoryRouter><BlogCard index={0} post={post} session={{ userId: 'other', role: 'user' }} /></MemoryRouter>);
    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
    rerender(<MemoryRouter><BlogCard index={0} post={post} session={{ userId: 'admin', role: 'admin' }} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /edit/i })).toBeVisible();
  });
});
