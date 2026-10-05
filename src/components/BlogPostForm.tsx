import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useBlog';
import type { BlogCategory, BlogPost } from '@/types/blog';

interface BlogPostFormProps {
  existingPost?: BlogPost;
}

const CATEGORIES = ['nutrition', 'health', 'training', 'grooming', 'adoption', 'general'];

export const BlogPostForm = ({ existingPost }: BlogPostFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const rolePrefix = location.pathname.startsWith('/vet') ? '/vet' : '/shelter';
  const isEditMode = !!existingPost;

  const [title, setTitle] = useState(existingPost?.title ?? '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt ?? '');
  const [content, setContent] = useState(existingPost?.content ?? '');
  const [category, setCategory] = useState(existingPost?.category ?? 'general');
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | null>(existingPost?.coverImage?.url ?? null);
  const [error, setError] = useState('');

  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost(existingPost?._id ?? '');
  const mutation = isEditMode ? updateMutation : createMutation;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');

  if (!title.trim() || !content.trim()) {
    setError('Title and content are required.');
    return;
  }

  mutation.mutate(
    { title, content, excerpt, category, coverImage },
    {
      onSuccess: (data) => navigate(`${rolePrefix}/blog/${data.post._id}`),
      onError: (err) => {
        setError(
          axios.isAxiosError(err) ? err.response?.data?.message || 'Something went wrong.' : 'Something went wrong.'
        );
      },
    }
  );
};

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="coverImage" className="form-label">
          Cover image <span className="font-normal text-ink/40">(optional)</span>
        </label>
        {preview && (
          <div className="mb-3 aspect-\[16\/9] w-full max-w-sm overflow-hidden rounded-3xl bg-peach">
            <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
          </div>
        )}
        <input
          id="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select id="category" className="input-field" value={category} onChange={(e) => setCategory(e.target.value as BlogCategory)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="excerpt" className="form-label">
          Excerpt <span className="font-normal text-ink/40">(short summary shown in listings, optional)</span>
        </label>
        <input
          id="excerpt"
          type="text"
          maxLength={300}
          className="input-field"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="content" className="form-label">
          Content
        </label>
        <textarea
          id="content"
          required
          rows={12}
          className="input-field resize-none"
          placeholder="Write your article..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={mutation.isPending} className="btn-primary">
          {mutation.isPending ? 'Publishing...' : isEditMode ? 'Save changes' : 'Publish post'}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};