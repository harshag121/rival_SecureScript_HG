import Link from 'next/link';
import { BlogEditor } from '@/components/BlogEditor';
import { PageShell } from '@/components/layout/PageShell';

export default function NewBlogPage() {
  return (
    <PageShell className="bg-surface" showFooter={false}>
      <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
          <Link href="/dashboard" className="transition-colors hover:text-ink">
            Dashboard
          </Link>
          <span>›</span>
          <span className="font-medium text-ink">New Story</span>
        </div>

        <BlogEditor mode="create" />
      </div>
    </PageShell>
  );
}
