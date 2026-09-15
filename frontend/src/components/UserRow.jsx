import PropTypes from 'prop-types';
import Avatar from './Avatar';

/** Displays one responsive administrator-managed account with its safe action state. */
export default function UserRow({ user, canDelete, onDelete }) {
  const isDefaultAdmin = user.username === 'admin';
  const badgeClass = user.role === 'admin' ? 'bg-violet-100 text-violet-700 ring-violet-300' : 'bg-indigo-100 text-indigo-700 ring-indigo-300';
  const parsedDate = new Date(user.createdAt);
  const date = Number.isNaN(parsedDate.getTime())
    ? 'Recently'
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(parsedDate);
  return <div className="grid gap-4 border-b border-slate-200 py-4 last:border-b-0 md:grid-cols-[1.4fr_1fr_0.7fr_0.9fr_auto] md:items-center"><div className="flex items-center gap-3"><Avatar label={`${user.displayName} avatar`} role={user.role} /><div><p className="font-semibold text-slate-900">{user.displayName}</p><p className="text-sm text-slate-500">@{user.username}</p></div></div><span className={`w-fit rounded-full px-3 py-0.5 text-sm font-medium ring-1 ${badgeClass}`}>{user.role === 'admin' ? 'Admin' : 'user'}</span><time className="text-sm text-slate-500">{date}</time><span className="text-sm text-slate-500 md:hidden">Created {date}</span><div>{isDefaultAdmin ? <span className="cursor-not-allowed text-sm font-medium text-slate-400" title="Default admin cannot be deleted">Default admin cannot be deleted</span> : <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50" disabled={!canDelete} onClick={() => onDelete(user)} title={canDelete ? 'Delete user' : 'You cannot delete the current account'} type="button">Delete</button>}</div></div>;
}
UserRow.propTypes = { user: PropTypes.shape({ id: PropTypes.string.isRequired, displayName: PropTypes.string.isRequired, username: PropTypes.string.isRequired, role: PropTypes.string.isRequired, createdAt: PropTypes.string.isRequired }).isRequired, canDelete: PropTypes.bool.isRequired, onDelete: PropTypes.func.isRequired };
