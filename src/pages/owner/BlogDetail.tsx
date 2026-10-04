import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlog';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: 'Nutrition',
  health: 'Health',
  training: 'Training',
  grooming: 'Grooming',
  adoption: 'Adoption',
  general: 'General',
};

export const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useBlogPost(id!);
  const { data: bookmarksData } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading article...</p>
      </div>
    );
  }

  const post = data?.post;
  if (!post) return null;

  const isBookmarked = bookmarksData?.bookmark.posts.some((p) => p._id === post._id) ?? false;
  const isToggling = toggleBookmark.isPending && toggleBookmark.variables?.postId === post._id;

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('/owner/blog')} className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to Blog
      </button>

      {post.coverImage?.url && (
        <div className="mt-4 aspect-[16/9] w-full overflow-hidden rounded-4xl bg-peach">
          <img src={post.coverImage.url} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-coral">
            {CATEGORY_LABELS[post.category]}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">{post.title}</h1>
          <p className="mt-2 text-sm text-ink/50">
            By {post.author.name} ·{' '}
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            toggleBookmark.mutate({ postId: post._id, isBookmarked, post })
          }
          disabled={isToggling}
          className="btn-secondary shrink-0 disabled:opacity-50"
        >
          {isToggling ? '...' : isBookmarked ? '🔖 Saved' : '📑 Save'}
        </button>
      </div>

      <div className="mt-6 whitespace-pre-wrap text-ink/80">{post.content}</div>

      <Link to="/owner/blog" className="btn-secondary mt-8 inline-block">
        ← More articles
      </Link>
    </div>
  );
};