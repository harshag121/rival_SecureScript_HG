import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure by default',
    body: 'JWT authentication, bcrypt hashing, rate limiting, and strict input validation protect every endpoint.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Distraction-free writing',
    body: 'A clean editor with auto slug generation, draft workflow, and async AI summary generation.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Real engagement',
    body: 'Like posts with optimistic UI, leave threaded comments, and browse a live public feed.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Production-grade stack',
    body: 'Next.js 15, NestJS, PostgreSQL, Prisma, Redis + BullMQ, and structured Pino logging.',
  },
];

const topics = ['Technology', 'Design', 'Programming', 'AI', 'Productivity', 'Startups', 'Writing', 'Science'];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-border">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Gradient blob */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent-light via-indigo-50 to-transparent opacity-60 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white shadow-card text-xs font-medium text-ink-secondary mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open source · Production ready
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-ink leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
              Every idea deserves
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">
                an audience.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed mb-10 max-w-xl">
              A secure, production-ready blogging platform with private dashboards, public feeds, likes, and comments.
            </p>

            <div className="flex items-center flex-wrap gap-4">
              <Link
                href="/register"
                className="btn-primary px-8 py-3 text-base rounded-full"
              >
                Start writing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/feed"
                className="btn-secondary px-8 py-3 text-base rounded-full"
              >
                Browse stories
              </Link>
            </div>

            {/* Social proof mini strip */}
            <div className="flex items-center gap-3 mt-10">
              <div className="flex -space-x-2">
                {['#667eea', '#43e97b', '#fa709a', '#4facfe'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                  >
                    {['A', 'J', 'M', 'S'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-ink-secondary">
                Join writers sharing ideas every day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Topics ─────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider flex-shrink-0">
              Explore topics:
            </span>
            {topics.map((t) => (
              <Link key={t} href="/feed" className="tag">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight">
              Built for real-world production
            </h2>
            <p className="text-ink-secondary text-lg max-w-xl mx-auto">
              Every feature is designed with security, performance, and developer experience in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-border bg-surface hover:bg-white hover:shadow-card-hover transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-ink text-[0.9375rem] mb-2">{f.title}</h3>
                <p className="text-ink-secondary text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            Ready to start writing?
          </h2>
          <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
            Create your free account and share your first story today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-ink font-semibold text-base hover:bg-neutral-100 transition-colors"
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-neutral-700 text-neutral-300 font-medium text-base hover:border-neutral-500 hover:text-white transition-colors"
            >
              Browse the feed
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
