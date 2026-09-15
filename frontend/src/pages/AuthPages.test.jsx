import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

afterEach(() => window.localStorage.clear());
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
});
