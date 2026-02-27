import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';

const features = [
  {
    title: 'Secure by default',
    body: 'JWT auth, bcrypt hashing, rate limiting, and strict validation across the API surface.',
  },
  {
    title: 'Focused writing flow',
    body: 'Drafts, publishing controls, auto slugs, and clear editorial ergonomics in one dashboard.',
  },
  {
    title: 'Real engagement',
    body: 'Public feed, likes, and comments with optimistic interactions and clean loading states.',
  },
  {
    title: 'Production ready stack',
    body: 'Next.js + NestJS + Prisma + PostgreSQL with scalable architecture and observability hooks.',
  },
];

const topics = ['Technology', 'Design', 'Programming', 'AI', 'Science', 'Startups', 'Writing', 'Productivity'];

export default function HomePage() {
  return (
    <PageShell className="bg-surface">
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div className="hero-glow" />
        <div className="hero-grid" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-secondary shadow-card">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Production-ready secure blogging platform
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl" style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}>
              Write clearly.
              <span className="block text-accent">Ship confidently.</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-ink-secondary sm:text-xl">
              A modular, secure blog platform with private dashboards, public storytelling, and social feedback loops.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register" className="btn-primary rounded-full px-8 py-3 text-base">
                Start writing
              </Link>
              <Link href="/feed" className="btn-secondary rounded-full px-8 py-3 text-base">
                Explore feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Browse topics:</span>
            {topics.map((topic) => (
              <Link key={topic} href="/feed" className="tag">
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Built with engineering quality</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-ink-secondary">
              The frontend is organized into reusable modules and the backend is structured for correctness and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <article key={feature.title} className="rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-sm font-semibold text-accent">
                  {idx + 1}
                </span>
                <h3 className="mb-2 text-sm font-semibold text-ink">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-ink-secondary">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
