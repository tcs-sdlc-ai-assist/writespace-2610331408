import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import * as storage from '../utils/storage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

vi.mock('../utils/storage', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    saveUsers: vi.fn(actual.saveUsers),
    setSession: vi.fn(actual.setSession)
  };
});

function LocationDisplay() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

async function submitValidRegistration(user) {
  await user.type(screen.getByLabelText('Display Name'), 'Failure Writer');
  await user.type(screen.getByLabelText('Username'), 'failure-writer');
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.type(screen.getByLabelText('Confirm Password'), 'secret');
  await user.click(screen.getByRole('button', { name: 'Create Account' }));
}

afterEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});
describe('authentication pages', () => {
  it('shows the required invalid login message', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'bad');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password.');
  });
  it('registers a valid local user and persists their session', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    await user.type(screen.getByLabelText('Display Name'), 'A Writer');
    await user.type(screen.getByLabelText('Username'), 'writer');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.type(screen.getByLabelText('Confirm Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(JSON.parse(window.localStorage.getItem('writespace_users'))[0]).toMatchObject({ username: 'writer', role: 'user' });
    expect(JSON.parse(window.localStorage.getItem('writespace_session'))).toMatchObject({ username: 'writer', role: 'user' });
  });
  it('blocks duplicate names and mismatched confirmations with inline errors', async () => {
    window.localStorage.setItem('writespace_users', JSON.stringify([{ username: 'writer' }]));
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    await user.type(screen.getByLabelText('Display Name'), 'A Writer');
    await user.type(screen.getByLabelText('Username'), 'writer');
    await user.type(screen.getByLabelText('Password'), 'one');
    await user.type(screen.getByLabelText('Confirm Password'), 'two');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(screen.getByText('Username is already taken.')).toBeVisible();
    expect(screen.getByText('Passwords do not match.')).toBeVisible();
  });

  it('persists self-registered accounts as normal users rather than administrators', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    await user.type(screen.getByLabelText('Display Name'), 'Boundary Writer');
    await user.type(screen.getByLabelText('Username'), 'boundary-writer');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.type(screen.getByLabelText('Confirm Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    const [account] = JSON.parse(window.localStorage.getItem('writespace_users'));
    expect(account.role).toBe('user');
    expect(account.role).not.toBe('admin');
  });

  it('shows a form error and does not start a session or navigate when saving a registration fails', async () => {
    storage.saveUsers.mockReturnValueOnce(false);
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/register']}><RegisterPage /><LocationDisplay /></MemoryRouter>);

    await submitValidRegistration(user);

    expect(screen.getByRole('alert')).toHaveTextContent('Your browser could not save this account.');
    expect(storage.setSession).not.toHaveBeenCalled();
    expect(screen.getByTestId('location')).toHaveTextContent('/register');
    expect(window.localStorage.getItem('writespace_session')).toBeNull();
  });

  it('shows a form error and does not navigate when starting a registration session fails', async () => {
    storage.setSession.mockReturnValueOnce(false);
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/register']}><RegisterPage /><LocationDisplay /></MemoryRouter>);

    await submitValidRegistration(user);

    expect(screen.getByRole('alert')).toHaveTextContent('Your browser could not start a session.');
    expect(screen.getByTestId('location')).toHaveTextContent('/register');
    expect(window.localStorage.getItem('writespace_session')).toBeNull();
  });
});
