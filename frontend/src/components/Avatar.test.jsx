import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar, { getAvatar } from './Avatar';

describe('Avatar', () => {
  it('renders the administrator avatar with a supplied accessible label', () => {
    render(<Avatar label="Ada avatar" role="admin" />);

    expect(screen.getByRole('img', { name: 'Ada avatar' })).toHaveTextContent('👑');
  });

  it('renders the default user avatar for non-admin roles', () => {
    render(getAvatar('user'));

    expect(screen.getByRole('img', { name: 'User avatar' })).toHaveTextContent('📖');
  });
});
