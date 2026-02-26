import { Navbar } from '@/components/Navbar';
import { BlogEditor } from '@/components/BlogEditor';

export default function NewBlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            New Story
          </h1>
          <p className="text-neutral-400 text-sm mt-1">What would you like to share today?</p>
        </div>
        <BlogEditor mode="create" />
      </main>
    </>
  );
}
