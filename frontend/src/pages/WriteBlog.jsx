import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { canManagePost } from '../utils/auth';
import { getPosts, getSession, savePosts } from '../utils/storage';
/** Creates a new post or updates an authorized existing post. */
export default function WriteBlog() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const existing = id ? getPosts().find(post => post.id === id) : null;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
    }
  }, [id]);
  if (id && (!existing || !canManagePost(session, existing))) return <Navigate replace to="/blogs" />;
  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required.';
    if (!content.trim()) nextErrors.content = 'Content is required.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const posts = getPosts();
    const post = existing ? {
      ...existing,
      title: title.trim(),
      content: content.trim()
    } : {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      authorId: session.userId,
      authorName: session.displayName,
      authorRole: session.role
    };
    savePosts(existing ? posts.map(item => item.id === existing.id ? post : item) : [...posts, post]);
    navigate(`/blog/${post.id}`);
  }
  return <div className="min-h-screen bg-slate-50">
<Navbar />
<main className="mx-auto max-w-3xl px-4 py-10">
<p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
{existing ? 'Refine your draft' : 'A blank page'}
</p>
<h1 className="mt-2 text-3xl font-extrabold text-slate-900">
{existing ? 'Edit post' : 'Write a post'}
</h1>
<form className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8" noValidate onSubmit={submit}>
<label className="block text-sm font-semibold text-slate-700" htmlFor="post-title">Title</label>
<input
aria-describedby={errors.title ? 'title-error' : undefined}
aria-invalid={Boolean(errors.title)}
className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
id="post-title"
onChange={event => setTitle(event.target.value)}
value={title}
/>
{errors.title && <p className="mt-1 text-sm text-red-600" id="title-error" role="alert">
{errors.title}
</p>}
<label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="post-content">Content</label>
<textarea
aria-describedby={errors.content ? 'content-error' : undefined}
aria-invalid={Boolean(errors.content)}
className="mt-2 min-h-64 w-full rounded-lg border border-slate-300 px-3 py-2.5 leading-7 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
id="post-content"
onChange={event => setContent(event.target.value)}
value={content}
/>
{errors.content && <p className="mt-1 text-sm text-red-600" id="content-error" role="alert">
{errors.content}
</p>}
<p className="mt-2 text-right text-sm text-slate-500">
{content.length} characters</p>
<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
<Link className="rounded-lg px-4 py-2 text-center font-medium text-slate-500 hover:bg-slate-100" to={existing ? `/blog/${existing.id}` : '/blogs'}>Cancel</Link>
<button className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700" type="submit">Save Post</button>
</div>
</form>
</main>
</div>;
}
