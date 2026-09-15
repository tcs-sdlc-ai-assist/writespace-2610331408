import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { roleHome, validateAccount } from '../utils/auth';
import { getSession, getUsers, saveUsers, setSession } from '../utils/storage';

/** Renders the local self-registration form and begins a user session. */
export default function RegisterPage() {
  const navigate = useNavigate();
  const existingSession = getSession();
  const [fields, setFields] = useState({ displayName: '', username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  if (existingSession) return <Navigate replace to={roleHome(existingSession)} />;

  function updateField(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateAccount(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const user = { id: crypto.randomUUID(), displayName: fields.displayName.trim(), username: fields.username.trim(), password: fields.password, role: 'user', createdAt: new Date().toISOString() };
    if (!saveUsers([...getUsers(), user])) {
      setErrors({ form: 'Your browser could not save this account.' });
      return;
    }
    const session = { userId: user.id, username: user.username, displayName: user.displayName, role: user.role };
    if (!setSession(session)) {
      setErrors({ form: 'Your browser could not start a session.' });
      return;
    }
    navigate('/blogs');
  }

  const formFields = [['displayName', 'Display Name', 'text'], ['username', 'Username', 'text'], ['password', 'Password', 'password'], ['confirmPassword', 'Confirm Password', 'password']];
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 px-4 py-10">
      <section aria-labelledby="register-title" className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10"><Link className="text-2xl font-extrabold tracking-tight text-indigo-600" to="/">WriteSpace</Link><p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Start locally</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900" id="register-title">Create your writing space.</h1><form className="mt-8 space-y-4" noValidate onSubmit={handleSubmit}>{formFields.map(([name, label, type]) => <div key={name}><label className="block text-sm font-semibold text-slate-700" htmlFor={name}>{label}</label><input aria-describedby={errors[name] ? `${name}-error` : undefined} aria-invalid={Boolean(errors[name])} aria-required="true" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" id={name} name={name} onChange={updateField} required type={type} value={fields[name]} />{errors[name] && <p className="mt-1 text-sm text-red-600" id={`${name}-error`} role="alert">{errors[name]}</p>}</div>)}{errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">{errors.form}</p>}<button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" type="submit">Create Account</button></form><p className="mt-7 text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-indigo-600 hover:text-indigo-800" to="/login">Login</Link></p></section>
    </main>
  );
}
