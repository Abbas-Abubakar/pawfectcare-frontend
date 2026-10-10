// src/pages/public/PublicBlogPost.tsx
import { useParams, Link, useLocation } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlog';
import { PageLoader } from '@/components/PageLoader';

export const PublicBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBlogPost(id!);
  const location = useLocation()
  const from = location.state?.from

  if (isLoading) return <PageLoader/>

  const post = data?.post;
  if (!post) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to=".." className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to {from}
      </Link>

      {post.coverImage?.url && (
        <div className="mt-4 aspect-\[16\/9] w-full overflow-hidden rounded-4xl bg-peach">
          <img src={post.coverImage.url} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-coral">{post.category}</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">{post.title}</h1>
      <p className="mt-2 text-sm text-ink/50">By {post.author.name}</p>
      <div className="mt-6 whitespace-pre-wrap text-ink/80">{post.content}</div>

      <div className="mt-8 rounded-3xl bg-coral-light p-5 text-center">
        <p className="text-sm text-ink/70">Want to bookmark articles and get personalized care reminders?</p>
        <Link to="/auth/register" className="btn-primary mt-3 inline-block">
          Create a free account
        </Link>
      </div>
    </div>
  );
};