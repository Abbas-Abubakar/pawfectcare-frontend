import { useParams } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlog';
import { BlogPostForm } from '@/components/BlogPostForm';

export const AddEditBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { data, isLoading } = useBlogPost(isEditMode ? id! : '');

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">{isEditMode ? 'Edit post' : 'Write a new post'}</h1>
      <div className="mt-8">
        <BlogPostForm existingPost={data?.post} />
      </div>
    </div>
  );
};