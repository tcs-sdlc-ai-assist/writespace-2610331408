import { useState } from 'react';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';
import { canDeleteUser, DEFAULT_ADMIN, validateAccount } from '../utils/auth';
import { getSession, getUsers, saveUsers } from '../utils/storage';

/** Manages browser-local accounts from the administrator-only user workspace. */
export default function UserManagement() {
  const session = getSession();
  const [users, setUsers] = useState(getUsers());
  const [fields, setFields] = useState({
    displayName: '',
    username: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  function updateField(event) {
    const {
      name,
      value
    } = event.target;
    setFields(current => ({
      ...current,
      [name]: value
    }));
  }
  function createUser(event) {
    event.preventDefault();
    const validationErrors = validateAccount(fields, users);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const account = {
      id: crypto.randomUUID(),
      displayName: fields.displayName.trim(),
      username: fields.username.trim(),
      password: fields.password,
      role: fields.role,
      createdAt: new Date().toISOString()
    };
    const nextUsers = [...users, account];
    if (!saveUsers(nextUsers)) {
      setErrors({
        form: 'Your browser could not save this account.'
      });
      return;
    }
    setUsers(nextUsers);
    setFields({
      displayName: '',
      username: '',
      password: '',
      role: 'user'
    });
    setErrors({});
  }
  function deleteUser(user) {
    if (canDeleteUser(session, user) && window.confirm(`Delete ${user.displayName}?`)) {
      const nextUsers = users.filter(candidate => candidate.id !== user.id);
      saveUsers(nextUsers);
      setUsers(nextUsers);
    }
  }
  const listedUsers = [{
    id: DEFAULT_ADMIN.userId,
    displayName: DEFAULT_ADMIN.displayName,
    username: DEFAULT_ADMIN.username,
    role: DEFAULT_ADMIN.role,
    createdAt: '2024-01-01T00:00:00.000Z'
  }, ...users.filter(user => user.username !== DEFAULT_ADMIN.username && user.id !== DEFAULT_ADMIN.userId)];
  return <div className="min-h-screen bg-slate-50">
<Navbar />
<main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
<div>
<p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Administrator workspace</p>
<h1 className="mt-2 text-3xl font-extrabold text-slate-900">Manage Users</h1>
<p className="mt-2 text-slate-600">Create local accounts and keep the community’s access roles clear.</p>
</div>
<section className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
<form className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" noValidate onSubmit={createUser}>
<h2 className="text-xl font-extrabold text-slate-900">Create User</h2>
<div className="mt-5 space-y-4">
{[['displayName', 'Display Name', 'text'], ['username', 'Username', 'text'], ['password', 'Password', 'password']].map(([name, label, type]) => <div key={name}>
<label className="block text-sm font-semibold text-slate-700" htmlFor={`user-${name}`}>
{label}
</label>
<input
aria-describedby={errors[name] ? `${name}-error` : undefined}
aria-invalid={Boolean(errors[name])}
className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
id={`user-${name}`}
name={name}
onChange={updateField}
value={fields[name]}
type={type}
/>
{errors[name] && <p className="mt-1 text-sm text-red-600" id={`${name}-error`} role="alert">
{errors[name]}
</p>}
</div>)}
<div>
<label className="block text-sm font-semibold text-slate-700" htmlFor="user-role">Role</label>
<select
className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
id="user-role"
name="role"
onChange={updateField}
value={fields.role}
>
<option value="admin">Admin</option>
<option value="user">user</option>
</select>
</div>
{errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
{errors.form}
</p>}
<button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700" type="submit">Create User</button>
</div>
</form>
<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
<div className="flex items-center justify-between">
<h2 className="text-xl font-extrabold text-slate-900">Local accounts</h2>
<span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
{listedUsers.length} total</span>
</div>
<div className="mt-5">
{listedUsers.map(user => <UserRow canDelete={canDeleteUser(session, user)} key={user.id} onDelete={deleteUser} user={user} />)}
</div>
</section>
</section>
</main>
</div>;
}
