import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { roleHome } from '../utils/auth';

/**
 * Renders the sticky navigation used on public pages.
 * @param {{session: object|null}} props Active session when present.
 * @returns {JSX.Element} Public navigation header.
 */
export default function PublicNavbar({ session = null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <nav
        aria-label="Public navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <Link className="text-xl font-bold tracking-tight text-indigo-600" to="/">
          WriteSpace
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            <Avatar label={`${session.displayName} avatar`} role={session.role} />
            <span className="hidden text-sm font-semibold text-slate-800 sm:block">
              {session.displayName}
            </span>
            <Link
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              to={roleHome(session)}
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              to="/register"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

PublicNavbar.propTypes = {
  session: PropTypes.shape({
    displayName: PropTypes.string,
    role: PropTypes.string,
  }),
};

