import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { canManagePost } from '../utils/auth';
const borderClasses = ['border-indigo-500', 'border-violet-500', 'border-pink-500', 'border-teal-500'];
/** Displays a concise, role-aware blog preview. */
export default function BlogCard({
  post,
  index,
  session
}) {
  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(post.createdAt));
  const summary = post.content.length > 120 ? `${post.content.slice(0, 120).trim()}…` : post.content;
  return <article
    className={`border-t-4 ${borderClasses[index % 4]} rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-transform hover:-translate-y-1 hover:shadow-md`}
  >
      <div className="flex items-start justify-between gap-3">
        <Link className="text-xl font-bold text-slate-900 hover:text-indigo-600" to={`/blog/${post.id}`}>
{post.title}
</Link>
        {canManagePost(session, post) && (
          <Link
            aria-label={`Edit ${post.title}`}
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
            to={`/edit/${post.id}`}
          >
            Edit
          </Link>
        )}
      </div>
      <p className="mt-4 leading-7 text-slate-600">
{summary}
</p>
      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <Avatar label={`${post.authorName} avatar`} role={post.authorRole || 'user'} />
        <span>
{post.authorName}
</span>
        <span aria-hidden="true">·</span>
        <time>
{date}
</time>
      </div>
    </article>;
}
BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorRole: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  session: PropTypes.object.isRequired
};
