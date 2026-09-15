import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import { canManagePost } from '../utils/auth';
import { getPosts, getSession, savePosts } from '../utils/storage';
/** Renders a full post and its permitted owner/administrator controls. */
export default function ReadBlog() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const post = getPosts().find(item => item.id === id);
  if (!post) return <div className="min-h-screen bg-slate-50">
<Navbar />
<main className="mx-auto max-w-3xl px-4 py-16">
<h1 className="text-3xl font-extrabold">Post not found</h1>
<Link className="mt-5 inline-block text-indigo-600" to="/blogs">Back to All Posts</Link>
</main>
</div>;
  const canManage = canManagePost(session, post);
  function deletePost() {
    if (canManage && window.confirm('Delete this post?')) {
      savePosts(getPosts().filter(item => item.id !== post.id));
      navigate('/blogs');
    }
  }
  return <div className="min-h-screen bg-slate-50">
<Navbar />
<main className="mx-auto max-w-3xl px-4 py-12">
<Link className="font-semibold text-indigo-600" to="/blogs">← Back to All Posts</Link>
<article className="mt-6 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10">
<div className="flex flex-wrap items-start justify-between gap-4">
<div>
<h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
{post.title}
</h1>
<div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
<Avatar label={`${post.authorName} avatar`} role={post.authorRole || 'user'} />
<span>
{post.authorName}
</span>
<time>
{new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                }).format(new Date(post.createdAt))}
</time>
</div>
</div>
{canManage && <div className="flex gap-2">
<Link
className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50"
to={`/edit/${post.id}`}
>
Edit
</Link>
<button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100" onClick={deletePost} type="button">Delete</button>
</div>}
</div>
<div className="mt-10 whitespace-pre-wrap leading-8 text-slate-700">
{post.content}
</div>
</article>
</main>
</div>;
}
