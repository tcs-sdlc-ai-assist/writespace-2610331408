import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

function Location() {
  return <p>{useLocation().pathname}</p>;
}

afterEach(() => window.localStorage.clear());

describe('ProtectedRoute', () => {
  it('redirects an unauthenticated visitor to login', () => {
    render(
      <MemoryRouter initialEntries={['/blogs']}>
        <Routes>
          <Route element={<ProtectedRoute><p>Private content</p></ProtectedRoute>} path="/blogs" />
          <Route element={<Location />} path="/login" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('/login')).toBeInTheDocument();
  });

  it('redirects a non-admin session away from an admin-only route', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'u1', role: 'user' }));
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute adminOnly><p>Admin content</p></ProtectedRoute>} path="/admin" />
          <Route element={<Location />} path="/blogs" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('/blogs')).toBeInTheDocument();
  });

  it('renders protected content for an administrator', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'a1', role: 'admin' }));
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<ProtectedRoute adminOnly><p>Admin content</p></ProtectedRoute>} path="/admin" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });
});
