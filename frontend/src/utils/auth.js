import { getUsers } from './storage';

/** Immutable browser-local demo administrator identity. */
export const DEFAULT_ADMIN = {
  userId: 'default-admin',
  username: 'admin',
  displayName: 'Administrator',
  role: 'admin',
};

/**
 * Authenticates a credential pair, checking the required default admin first.
 * @param {string} username Username to check.
 * @param {string} password Password to check.
 * @returns {object|null} Safe session object on success, otherwise null.
 */
export function authenticate(username, password) {
  const normalizedUsername = username.trim();
  if (normalizedUsername === 'admin' && password === 'admin') {
    return { ...DEFAULT_ADMIN };
  }

  const user = getUsers().find(
    (candidate) => candidate.username === normalizedUsername && candidate.password === password,
  );

  return user
    ? {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      }
    : null;
}

/**
 * Validates registration or administrator-created account details.
 * @param {{displayName: string, username: string, password: string, confirmPassword?: string}} fields User fields.
 * @param {Array} users Existing users.
 * @returns {object} Error strings keyed by invalid field, or an empty object.
 */
export function validateAccount(fields, users = getUsers()) {
  const errors = {};
  const displayName = fields.displayName?.trim() ?? '';
  const username = fields.username?.trim() ?? '';
  const password = fields.password ?? '';

  if (!displayName) errors.displayName = 'Display Name is required.';
  if (!username) errors.username = 'Username is required.';
  if (!password) errors.password = 'Password is required.';
  if ('confirmPassword' in fields && password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (username && (username === 'admin' || users.some((user) => user.username === username))) {
    errors.username = 'Username is already taken.';
  }
  return errors;
}

/**
 * Determines whether a session may modify a post.
 * @param {object|null} session Active session.
 * @param {object|null} post Target post.
 * @returns {boolean} Whether the session has ownership or administrator authority.
 */
export function canManagePost(session, post) {
  return Boolean(session && post && (session.role === 'admin' || post.authorId === session.userId));
}

/**
 * Determines whether an account can be deleted by a session.
 * @param {object|null} session Active session.
 * @param {object} user Target stored user.
 * @returns {boolean} Whether deletion is allowed.
 */
export function canDeleteUser(session, user) {
  return Boolean(
    session?.role === 'admin'
      && user?.username !== 'admin'
      && user?.id !== session.userId,
  );
}

/** @param {object|null} session Session to route. @returns {string} Role home path. */
export function roleHome(session) {
  return session?.role === 'admin' ? '/admin' : '/blogs';
}
