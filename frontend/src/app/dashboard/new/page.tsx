import { Navbar } from '@/components/Navbar';
import { BlogEditor } from '@/components/BlogEditor';
import Link from 'next/link';

export default function NewBlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-ink-muted mb-8">
            <Link href="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink font-medium">New Story</span>
          </div>

          <BlogEditor mode="create" />
        </div>
      </main>
    </div>
  );
}
