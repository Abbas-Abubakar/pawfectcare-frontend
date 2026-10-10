// src/pages/public/PublicBlog.tsx
import { useState, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlog';
import { PageLoader } from '@/components/PageLoader';

export const PublicBlog = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const { data, isLoading } = useBlogPosts({ search: deferredSearch || undefined });
  const posts = data?.posts ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-ink">Blog & Tips</h1>
      <p className="mt-1 text-ink/60">Advice from our vets and shelter partners.</p>

      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mt-6 max-w-xs"
      />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <PageLoader/>
        ) : (
          posts.map((post) => (
            <Link key={post._id} to={`/blog/${post._id}`} state={{from: "Blog"}} className="group overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral">
              <div className="aspect-\[16\/10] w-full overflow-hidden bg-peach">
                {post.coverImage?.url ? (
                  <img src={post.coverImage.url} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">📝</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-coral">{post.category}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">{post.title}</h3>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-ink/60">{post.excerpt}</p>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};