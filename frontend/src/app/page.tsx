import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-amber-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1
              className="text-5xl md:text-6xl font-bold text-neutral-900 leading-tight tracking-tight"
              style={{ fontFamily: 'Merriweather, Georgia, serif' }}
            >
              Human stories &amp; ideas.
            </h1>
            <p className="mt-5 text-xl text-neutral-600 leading-relaxed">
              A place to read, write, and deepen your understanding.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/register"
                className="btn-primary px-8 py-3 text-base rounded-full"
              >
                Start reading
              </Link>
              <Link href="/feed" className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors">
                Browse stories →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending topics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-4">
          Discover by topic
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Technology', 'Design', 'Programming', 'Productivity', 'AI', 'Startups', 'Writing', 'Science'].map(
            (t) => (
              <Link
                key={t}
                href="/feed"
                className="tag text-sm py-2 px-4"
              >
                {t}
              </Link>
            ),
          )}
        </div>
      </section>

      <div className="divider max-w-5xl mx-auto px-4 sm:px-6" />

      {/* Why SecureBlog */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {[
          {
            icon: '🔐',
            title: 'Secure by default',
            body: 'JWT auth, bcrypt hashing, rate limiting, and input validation protecting every endpoint.',
          },
          {
            icon: '📝',
            title: 'Focus on writing',
            body: 'Distraction-free editor, auto slug generation, draft → publish workflow.',
          },
          {
            icon: '🔥',
            title: 'Real engagement',
            body: 'Like posts with optimistic UI, leave comments, and follow the public feed.',
          },
        ].map((f) => (
          <div key={f.title}>
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-neutral-900 text-base mb-1">{f.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
