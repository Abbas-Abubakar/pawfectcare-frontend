import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCreateSuccessStory } from '@/hooks/useSuccessStories';

export const AddSuccessStory = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const adoptionRequestId = searchParams.get('adoptionRequestId');
  const petName = searchParams.get('petName') ?? '';

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');

  const mutation = useCreateSuccessStory();

  if (!adoptionRequestId) {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold text-ink">No adoption selected</h1>
        <p className="mt-2 text-ink/60">
          Start a success story from an approved request on a listing's detail page.
        </p>
        <Link to="/shelter/listings" className="btn-primary mt-6 inline-block">
          Go to listings
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !story.trim()) {
      setError('Title and story are required.');
      return;
    }

    mutation.mutate(
      { adoptionRequestId, title, story, photos },
      {
        onSuccess: () => navigate('/shelter/stories'),
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Something went wrong.' : 'Something went wrong.'
          );
        },
      }
    );
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-ink">Write a success story</h1>
      {petName && <p className="mt-1 text-ink/60">Celebrating {petName}'s new home 🎉</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            className="input-field"
            placeholder={`${petName || 'This pet'} Finds Their Forever Home`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="story" className="form-label">
            Story
          </label>
          <textarea
            id="story"
            required
            rows={6}
            className="input-field resize-none"
            placeholder="Tell the story of this adoption..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="photos" className="form-label">
            Photos <span className="font-normal text-ink/40">(optional, up to 6)</span>
          </label>
          <input
            id="photos"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 6))}
            className="input-field"
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Publishing...' : 'Publish story'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};