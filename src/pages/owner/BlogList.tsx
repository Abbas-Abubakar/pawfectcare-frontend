import { useState, useDeferredValue } from 'react';
import { useBlogPosts } from '@/hooks/useBlog';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { BlogCard } from '@/components/BlogCard';
import type { BlogCategory } from '@/types/blog';

const CATEGORIES: { label: string; value: BlogCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Health', value: 'health' },
  { label: 'Training', value: 'training' },
  { label: 'Grooming', value: 'grooming' },
  { label: 'Adoption', value: 'adoption' },
  { label: 'General', value: 'general' },
];

export const BlogList = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BlogCategory | 'all'>('all');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading } = useBlogPosts({
    search: deferredSearch || undefined,
    category: category === 'all' ? undefined : category,
  });

  const { data: bookmarksData } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const bookmarkedIds = new Set(bookmarksData?.bookmark.posts.map((p) => p._id) ?? []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Blog & Tips</h1>
      <p className="mt-1 text-ink/60">Advice from our vets and shelter partners.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c.value ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:bg-cream'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading articles...</p>
        ) : data && data.posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                isBookmarked={bookmarkedIds.has(post._id)}
                isToggling={
                  toggleBookmark.isPending && toggleBookmark.variables?.postId === post._id
                }
                onToggleBookmark={() =>
                  toggleBookmark.mutate({
                    postId: post._id,
                    isBookmarked: bookmarkedIds.has(post._id),
                    post,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-ink/50">
            <p className="text-4xl">🔍</p>
            <p className="mt-2">No articles found. Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};