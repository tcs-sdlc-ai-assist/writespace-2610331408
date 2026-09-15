import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserRow from './UserRow';

describe('UserRow', () => {
  it('shows the protected default administrator state', () => {
    render(<UserRow canDelete={false} onDelete={vi.fn()} user={{ id: 'default-admin', displayName: 'Administrator', username: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' }} />);

    expect(screen.getByTitle('Default admin cannot be deleted')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('disables a user deletion action when the current account cannot be deleted', () => {
    render(<UserRow canDelete={false} onDelete={vi.fn()} user={{ id: 'u1', displayName: 'Writer', username: 'writer', role: 'user', createdAt: 'invalid-date' }} />);

    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    expect(screen.getByText('Recently')).toBeVisible();
  });

  it('calls the delete handler for a deletable user', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const account = { id: 'u1', displayName: 'Writer', username: 'writer', role: 'user', createdAt: '2025-01-02T00:00:00.000Z' };
    render(<UserRow canDelete onDelete={onDelete} user={account} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith(account);
  });
});
