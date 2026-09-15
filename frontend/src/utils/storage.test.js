import { afterEach, describe, expect, it } from 'vitest';
import {
  clearSession,
  clearWriteSpaceData,
  getPosts,
  getSession,
  getUsers,
  savePosts,
  saveUsers,
  setSession,
} from './storage';

afterEach(() => {
  window.localStorage.clear();
});

describe('WriteSpace storage helpers', () => {
  it('persists and retrieves posts and users using the required records', () => {
    const posts = [{ id: 'post-1', title: 'A post' }];
    const users = [{ id: 'user-1', username: 'author' }];

    expect(savePosts(posts)).toBe(true);
    expect(saveUsers(users)).toBe(true);
    expect(getPosts()).toEqual(posts);
    expect(getUsers()).toEqual(users);
  });

  it('returns safe empty arrays for corrupt local storage arrays', () => {
    window.localStorage.setItem('writespace_posts', '{broken');
    window.localStorage.setItem('writespace_users', JSON.stringify({ not: 'an array' }));

    expect(getPosts()).toEqual([]);
    expect(getUsers()).toEqual([]);
  });

  it('sets, reads, clears, and safely recovers the session record', () => {
    const session = { userId: 'user-1', role: 'user', username: 'author' };

    expect(setSession(session)).toBe(true);
    expect(getSession()).toEqual(session);
    expect(clearSession()).toBe(true);
    expect(getSession()).toBeNull();

    window.localStorage.setItem('writespace_session', 'invalid');
    expect(getSession()).toBeNull();
  });

  it('clears only WriteSpace records for a controlled reset', () => {
    savePosts([{ id: 'post-1' }]);
    saveUsers([{ id: 'user-1' }]);
    setSession({ userId: 'user-1' });
    window.localStorage.setItem('unrelated', 'kept');

    clearWriteSpaceData();

    expect(getPosts()).toEqual([]);
    expect(getUsers()).toEqual([]);
    expect(getSession()).toBeNull();
    expect(window.localStorage.getItem('unrelated')).toBe('kept');
  });
});
