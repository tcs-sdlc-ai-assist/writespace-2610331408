import { Link, useNavigate } from 'react-router-dom';
import { getPosts, getSession } from '../utils/storage';
import { roleHome } from '../utils/auth';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

/** Formats a stored date into the required concise blog date. */
function formatDate(createdAt) {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime())
    ? 'Recently'
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
}

/** Returns a concise plain-text post excerpt. */
function excerpt(content) {
  return content.length > 120 ? `${content.slice(0, 120).trim()}…` : content;
}

/** Renders public product discovery and the latest local writing preview. */
export default function LandingPage() {
  const navigate = useNavigate();
  const session = getSession();
  const latestPosts = [...getPosts()]
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
    .slice(0, 3);

  function startReading() {
    navigate(session ? roleHome(session) : '/login');
  }

  function openPreview(postId) {
    navigate(session ? `/blog/${postId}` : '/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PublicNavbar session={session} />
      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500">
          <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-white/80">A local space for plain-text ideas</p>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
                Your thoughts. Your space. Beautifully simple.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-indigo-50">
                Read what matters, write without distraction, and keep every local post close to home.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-lg bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  onClick={startReading}
                  type="button"
                >
                  Start Reading
                </button>
                <Link
                  className="rounded-lg border border-white/70 bg-white/10 px-5 py-3 text-center font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  to="/register"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
            <div aria-hidden="true" className="relative hidden min-h-[360px] lg:block">
              <div className="absolute right-4 top-6 w-72 animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-white p-6 shadow-2xl">
                <div className="h-3 w-24 rounded-full bg-indigo-200" />
                <div className="mt-5 h-5 w-52 rounded bg-slate-800" />
                <div className="mt-5 space-y-3"><div className="h-3 rounded bg-slate-200" /><div className="h-3 w-5/6 rounded bg-slate-200" /><div className="h-3 w-3/4 rounded bg-slate-200" /></div>
                <div className="mt-7 flex items-center gap-2"><span className="h-7 w-7 rounded-full bg-pink-500" /><span className="h-3 w-24 rounded bg-slate-200" /></div>
              </div>
              <div className="absolute bottom-6 left-2 w-64 animate-[float_7s_ease-in-out_infinite_0.6s] rounded-2xl bg-violet-950/30 p-5 shadow-xl ring-1 ring-white/30 backdrop-blur-sm"><p className="text-sm font-semibold text-white">No server. No lag.</p><p className="mt-2 text-sm text-violet-100">Your writing stays in this browser.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Built for focus</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">A more intentional place to publish.</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[['Write Freely', 'Plain-text writing, no distractions.', 'bg-indigo-100 text-indigo-700'], ['Private & Local', 'All data lives in your browser.', 'bg-violet-100 text-violet-700'], ['Instant & Fast', 'No server, no lag.', 'bg-pink-100 text-pink-700']].map(([title, body, color]) => (
              <article className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition-transform hover:-translate-y-1 hover:shadow-md" key={title}><span className={`inline-flex rounded-xl px-3 py-1 text-sm font-bold ${color}`}>{title}</span><p className="mt-5 leading-7 text-slate-600">{body}</p></article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-500">Community notes</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Latest from the Blog</h2></div><button className="font-semibold text-indigo-600 hover:text-indigo-800" onClick={startReading} type="button">Explore all writing →</button></div>{latestPosts.length === 0 ? <p className="mt-10 rounded-2xl bg-slate-50 p-8 text-center text-slate-500">No posts yet — check back soon!</p> : <div className="mt-10 grid gap-5 md:grid-cols-3">{latestPosts.map((post) => <button className="rounded-2xl border-t-4 border-indigo-500 bg-slate-50 p-6 text-left shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500" key={post.id} onClick={() => openPreview(post.id)} type="button"><h3 className="text-lg font-bold text-slate-900">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{excerpt(post.content || '')}</p><p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">{formatDate(post.createdAt)}</p></button>)}</div>}</div></section>
      </main>
      <Footer />
    </div>
  );
}
