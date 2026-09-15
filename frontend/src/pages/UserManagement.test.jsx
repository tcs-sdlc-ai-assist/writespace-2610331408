import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as storage from '../utils/storage';
import UserManagement from './UserManagement';

vi.mock('../utils/storage', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    saveUsers: vi.fn(actual.saveUsers)
  };
});

function seedAdmin() { window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'default-admin', displayName: 'Administrator', role: 'admin' })); }
afterEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});
describe('UserManagement', () => {
  it('creates a unique role-assigned local account with ID and timestamp', async () => { seedAdmin(); const user = userEvent.setup(); render(<MemoryRouter><UserManagement /></MemoryRouter>); await user.type(screen.getByLabelText('Display Name'), 'New Admin'); await user.type(screen.getByLabelText('Username'), 'newadmin'); await user.type(screen.getByLabelText('Password'), 'secret'); await user.selectOptions(screen.getByLabelText('Role'), 'admin'); await user.click(screen.getByRole('button', { name: 'Create User' })); const [account] = JSON.parse(window.localStorage.getItem('writespace_users')); expect(account).toMatchObject({ displayName: 'New Admin', username: 'newadmin', role: 'admin' }); expect(account.id).toBeTruthy(); expect(account.createdAt).toBeTruthy(); });
  it('rejects duplicate usernames and exposes a field-level error', async () => { seedAdmin(); window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'taken-1', displayName: 'Taken', username: 'taken', password: 'secret', role: 'user', createdAt: '2025-01-01T00:00:00.000Z' }])); const user = userEvent.setup(); render(<MemoryRouter><UserManagement /></MemoryRouter>); await user.type(screen.getByLabelText('Display Name'), 'Taken'); await user.type(screen.getByLabelText('Username'), 'taken'); await user.type(screen.getByLabelText('Password'), 'secret'); await user.click(screen.getByRole('button', { name: 'Create User' })); expect(screen.getByText('Username is already taken.')).toBeVisible(); });
  it('keeps default admin deletion disabled and prevents current-account deletion', () => { seedAdmin(); window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'default-admin', displayName: 'Duplicate', username: 'owner', password: 'secret', role: 'admin', createdAt: '2025-01-01' }])); render(<MemoryRouter><UserManagement /></MemoryRouter>); expect(screen.getByTitle('Default admin cannot be deleted')).toBeVisible(); expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument(); });
  it('removes another account only after confirmation', async () => { seedAdmin(); window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'writer-1', displayName: 'Writer', username: 'writer', role: 'user', createdAt: '2025-01-01' }])); vi.spyOn(window, 'confirm').mockReturnValue(true); const user = userEvent.setup(); render(<MemoryRouter><UserManagement /></MemoryRouter>); await user.click(screen.getByRole('button', { name: 'Delete' })); expect(JSON.parse(window.localStorage.getItem('writespace_users'))).toEqual([]); });
  it('shows a form error and does not create an account when saving an admin-created user fails', async () => {
    seedAdmin();
    storage.saveUsers.mockReturnValueOnce(false);
    const user = userEvent.setup();
    render(<MemoryRouter><UserManagement /></MemoryRouter>);

    await user.type(screen.getByLabelText('Display Name'), 'Failed Admin');
    await user.type(screen.getByLabelText('Username'), 'failed-admin');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.selectOptions(screen.getByLabelText('Role'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Create User' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Your browser could not save this account.');
    expect(screen.queryByText('Failed Admin')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('writespace_users')).toBeNull();
  });
});
