import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function Location() {
  return <p>{useLocation().pathname}</p>;
}

afterEach(() => window.localStorage.clear());

describe('Navbar', () => {
  it('toggles mobile navigation visibility', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_session', JSON.stringify({ displayName: 'Writer', role: 'user' }));
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    const menu = screen.getByRole('link', { name: 'All Blogs' }).parentElement?.parentElement;
    expect(menu).toHaveClass('hidden');
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(menu).toHaveClass('flex');
  });

  it('clears the session and returns to the landing route on logout', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_session', JSON.stringify({ displayName: 'Administrator', role: 'admin' }));
    render(
      <MemoryRouter initialEntries={['/blogs']}>
        <Navbar />
        <Routes><Route element={<Location />} path="/" /></Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    expect(window.localStorage.getItem('writespace_session')).toBeNull();
    expect(screen.getByText('/')).toBeInTheDocument();
  });
});
