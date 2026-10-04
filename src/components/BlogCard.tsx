import { Link } from 'react-router-dom';
import type { BlogPost } from '@/types/blog';

const CATEGORY_LABELS: Record<BlogPost['category'], string> = {
  nutrition: 'Nutrition',
  health: 'Health',
  training: 'Training',
  grooming: 'Grooming',
  adoption: 'Adoption',
  general: 'General',
};

interface BlogCardProps {
  post: BlogPost;
  isBookmarked: boolean;
  isToggling: boolean;
  onToggleBookmark: () => void;
}

export const BlogCard = ({ post, isBookmarked, isToggling, onToggleBookmark }: BlogCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral">
      <Link to={`/owner/blog/${post._id}`}>
        <div className="aspect-[16/10] w-full overflow-hidden bg-peach">
          {post.coverImage?.url ? (
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">📝</div>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={onToggleBookmark}
        disabled={isToggling}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-base shadow-sm transition-transform active:scale-90 disabled:opacity-50"
      >
        {isToggling ? '⏳' : isBookmarked ? '🔖' : '📑'}
      </button>

      <Link to={`/owner/blog/${post._id}`} className="block p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-coral">
          {CATEGORY_LABELS[post.category]}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold text-ink">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-ink/60">{post.excerpt}</p>}
        <p className="mt-3 text-xs text-ink/40">By {post.author.name}</p>
      </Link>
    </div>
  );
};