import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useMyBlogPosts, useDeleteBlogPost } from '@/hooks/useBlog';
import { PageLoader } from '@/components/PageLoader';

export const MyBlogPosts = () => {
  const user = useAuthStore((state) => state.user);
  const rolePrefix = user?.role === 'veterinarian' ? '/vet' : '/shelter';

  const { data, isLoading } = useMyBlogPosts(user?.id ?? '');
  const deleteMutation = useDeleteBlogPost();

  const posts = data?.posts ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Posts</h1>
          <p className="mt-1 text-ink/60">Articles and tips you've published.</p>
        </div>
        <Link to={`${rolePrefix}/blog/new`} className="btn-primary">
          + Write a post
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          <PageLoader/>

        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="flex items-center justify-between rounded-3xl border-2 border-ink/5 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-coral">{post.category}</p>
                <h3 className="font-semibold text-ink">{post.title}</h3>
                <p className="mt-1 text-xs text-ink/40">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to={`${rolePrefix}/blog/${post._id}/edit`} className="text-sm font-semibold text-coral hover:text-coral-dark">
                  Edit
                </Link>
                <button
                  onClick={() => deleteMutation.mutate(post._id)}
                  disabled={deleteMutation.isPending}
                  className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">📝</p>
            <h2 className="font-display text-2xl font-bold text-ink">No posts yet</h2>
            <p className="text-ink/60">Share your expertise with pet owners.</p>
            <Link to={`${rolePrefix}/blog/new`} className="btn-primary mt-2">
              Write your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};