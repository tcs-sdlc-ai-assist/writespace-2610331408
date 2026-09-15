import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_ADMIN,
  authenticate,
  canDeleteUser,
  canManagePost,
  roleHome,
  validateAccount,
} from './auth';

afterEach(() => window.localStorage.clear());

describe('WriteSpace authentication helpers', () => {
  it('authenticates the immutable default administrator before stored users', () => {
    expect(authenticate('admin', 'admin')).toEqual(DEFAULT_ADMIN);
  });

  it('authenticates a stored user and returns only the safe session fields', () => {
    window.localStorage.setItem('writespace_users', JSON.stringify([{
      id: 'writer-1',
      username: 'writer',
      password: 'secret',
      displayName: 'Stored Writer',
      role: 'user',
    }]));

    expect(authenticate(' writer ', 'secret')).toEqual({
      userId: 'writer-1',
      username: 'writer',
      displayName: 'Stored Writer',
      role: 'user',
    });
  });

  it('returns null for incorrect default admin credentials', () => {
    expect(authenticate('admin', 'wrong')).toBeNull();
  });

  it('validates missing account fields and the reserved administrator username', () => {
    expect(validateAccount({ displayName: '', username: 'admin', password: '' }, [])).toEqual({
      displayName: 'Display Name is required.',
      username: 'Username is already taken.',
      password: 'Password is required.',
    });
  });

  it('validates mismatched passwords and duplicate usernames', () => {
    expect(
      validateAccount(
        { displayName: 'Writer', username: 'writer', password: 'one', confirmPassword: 'two' },
        [{ username: 'writer' }],
      ),
    ).toEqual({
      username: 'Username is already taken.',
      confirmPassword: 'Passwords do not match.',
    });
  });

  it('permits only authors or administrators to manage posts', () => {
    const post = { authorId: 'author-1' };
    expect(canManagePost({ userId: 'author-1', role: 'user' }, post)).toBe(true);
    expect(canManagePost({ userId: 'other', role: 'user' }, post)).toBe(false);
    expect(canManagePost({ userId: 'admin', role: 'admin' }, post)).toBe(true);
  });

  it('prevents default-admin and self account deletion while allowing another account deletion', () => {
    const admin = { userId: 'admin-1', role: 'admin' };
    expect(canDeleteUser(admin, { id: 'writer-1', username: 'writer' })).toBe(true);
    expect(canDeleteUser(admin, { id: 'admin-1', username: 'owner' })).toBe(false);
    expect(canDeleteUser(admin, { id: 'default-admin', username: 'admin' })).toBe(false);
  });

  it('routes roles to their correct homes', () => {
    expect(roleHome({ role: 'admin' })).toBe('/admin');
    expect(roleHome({ role: 'user' })).toBe('/blogs');
  });
});
