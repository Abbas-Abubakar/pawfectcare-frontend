import { Link } from 'react-router-dom';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { BlogCard } from '@/components/BlogCard';

export const BookmarksPage = () => {
  const { data, isLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const posts = data?.bookmark.posts ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Bookmarked Articles</h1>
      <p className="mt-1 text-ink/60">Tips you've saved to read again.</p>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                isBookmarked={true}
                isToggling={
                  toggleBookmark.isPending && toggleBookmark.variables?.postId === post._id
                }
                onToggleBookmark={() =>
                  toggleBookmark.mutate({ postId: post._id, isBookmarked: true, post })
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">📑</p>
            <h2 className="font-display text-2xl font-bold text-ink">No bookmarks yet</h2>
            <p className="text-ink/60">Save articles you want to come back to.</p>
            <Link to="/owner/blog" className="btn-primary mt-2">
              Browse articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};