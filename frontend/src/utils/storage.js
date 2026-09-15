/** Browser-local persistence helpers for WriteSpace records and sessions. */

const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

/**
 * Reads an array record safely from local storage.
 * @param {string} key Storage key to read.
 * @returns {Array} Parsed records, or an empty array for unavailable/corrupt data.
 */
function readArray(key) {
  try {
    const rawValue = window.localStorage.getItem(key);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

/**
 * Writes an array record safely to local storage.
 * @param {string} key Storage key to write.
 * @param {Array} records Records to persist.
 * @returns {boolean} Whether storage accepted the record.
 */
function writeArray(key, records) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.isArray(records) ? records : []));
    return true;
  } catch {
    return false;
  }
}

/** @returns {Array} All persisted posts. */
export function getPosts() {
  return readArray(POSTS_KEY);
}

/** @param {Array} posts Post records to persist. @returns {boolean} Write result. */
export function savePosts(posts) {
  return writeArray(POSTS_KEY, posts);
}

/** @returns {Array} All persisted users. */
export function getUsers() {
  return readArray(USERS_KEY);
}

/** @param {Array} users User records to persist. @returns {boolean} Write result. */
export function saveUsers(users) {
  return writeArray(USERS_KEY, users);
}

/**
 * Reads the active session safely.
 * @returns {object|null} Session object or null when absent/corrupt.
 */
export function getSession() {
  try {
    const rawValue = window.localStorage.getItem(SESSION_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : null;
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
      ? parsedValue
      : null;
  } catch {
    return null;
  }
}

/**
 * Persists the active session.
 * @param {object} session Session record to store.
 * @returns {boolean} Whether storage accepted the record.
 */
export function setSession(session) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

/** @returns {boolean} Whether the session key was removed. */
export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Clears all WriteSpace keys; restricted to tests and reset flows. */
export function clearWriteSpaceData() {
  try {
    window.localStorage.removeItem(POSTS_KEY);
    window.localStorage.removeItem(USERS_KEY);
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage absence already results in safe empty getters.
  }
}
