import PropTypes from 'prop-types';

/**
 * Renders the required role-distinct static avatar.
 * @param {{role: string, label?: string}} props Avatar role and optional accessible label.
 * @returns {JSX.Element} Role avatar element.
 */
export function getAvatar(role, label = '') {
  const isAdmin = role === 'admin';
  return (
    <span
      aria-label={label || (isAdmin ? 'Administrator avatar' : 'User avatar')}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base shadow-sm ${
        isAdmin ? 'bg-violet-600' : 'bg-indigo-500'
      } text-white`}
      role="img"
    >
      {isAdmin ? '👑' : '📖'}
    </span>
  );
}

/**
 * Displays a role avatar.
 * @param {{role: string, label?: string}} props Avatar role and label.
 * @returns {JSX.Element} Avatar element.
 */
export default function Avatar({ role, label }) {
  return getAvatar(role, label);
}

Avatar.propTypes = {
  role: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Avatar.defaultProps = {
  label: '',
};
