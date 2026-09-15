import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { clearSession, getSession } from '../utils/storage';

/** Renders responsive authenticated navigation and session logout controls. */
export default function Navbar() {
  const navigate = useNavigate();
  const session = getSession();
  const [open, setOpen] = useState(false);
  const links = session?.role === 'admin' ? [['All Blogs', '/blogs'], ['Write', '/write'], ['Users', '/users']] : [['All Blogs', '/blogs'], ['Write', '/write']];
  function logout() {
    clearSession();
    navigate('/');
  }
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <nav aria-label="Authenticated navigation" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link className="text-xl font-bold tracking-tight text-indigo-600" to="/">WriteSpace</Link>
        <button
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="rounded-lg p-2 text-slate-700 sm:hidden"
          onClick={() => setOpen(value => !value)}
          type="button"
        >
          ☰
        </button>
        <div className={`${open ? 'flex' : 'hidden'} w-full flex-col gap-2 sm:flex sm:w-auto sm:flex-row sm:items-center`}>
          <div className="flex flex-col gap-1 sm:flex-row">
            {links.map(([label, path]) => <NavLink className={({
            isActive
          }) => `rounded-full px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`} key={path} to={path}>
                {label}
              </NavLink>)}
          </div>
          <div className="flex items-center gap-2 border-t border-slate-200 pt-2 sm:border-0 sm:pt-0">
            <Avatar label={`${session?.displayName} avatar`} role={session?.role || 'user'} />
            <span className="text-sm font-semibold text-slate-800">
{session?.displayName}
</span>
            <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" onClick={logout} type="button">Logout</button>
          </div>
        </div>
      </nav>
    </header>;
}
