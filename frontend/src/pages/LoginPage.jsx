import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authenticate, roleHome } from '../utils/auth';
import { getSession, setSession } from '../utils/storage';

/** Renders the local credential sign-in form and role-directed redirect. */
export default function LoginPage() {
  const navigate = useNavigate();
  const existingSession = getSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (existingSession) return <Navigate replace to={roleHome(existingSession)} />;

  function handleSubmit(event) {
    event.preventDefault();
    const session = authenticate(username, password);
    if (!session || !setSession(session)) {
      setError('Invalid username or password.');
      return;
    }
    navigate(roleHome(session));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 px-4 py-10">
      <section aria-labelledby="login-title" className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <Link className="text-2xl font-extrabold tracking-tight text-indigo-600" to="/">WriteSpace</Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900" id="login-title">Sign in to write.</h1>
        <p className="mt-3 text-slate-600">Use your browser-local account to continue.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div><label className="block text-sm font-semibold text-slate-700" htmlFor="login-username">Username</label><input aria-required="true" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" id="login-username" onChange={(event) => setUsername(event.target.value)} required value={username} /></div>
          <div><label className="block text-sm font-semibold text-slate-700" htmlFor="login-password">Password</label><input aria-required="true" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" id="login-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">{error}</p>}
          <button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" type="submit">Login</button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-600">New to WriteSpace? <Link className="font-semibold text-indigo-600 hover:text-indigo-800" to="/register">Register</Link></p>
      </section>
    </main>
  );
}
