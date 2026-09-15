import { Link } from 'react-router-dom';

/** Renders the public WriteSpace footer and helpful route links. */
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm">© {new Date().getFullYear()} WriteSpace. Made for local thoughts.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link className="hover:text-white" to="/">Home</Link>
          <Link className="hover:text-white" to="/blogs">All Blogs</Link>
          <Link className="hover:text-white" to="/login">Login</Link>
          <Link className="hover:text-white" to="/register">Register</Link>
        </nav>
      </div>
    </footer>
  );
}
