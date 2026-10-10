import { useState, useDeferredValue } from 'react';
import { useSuccessStories, useDeleteSuccessStory } from '@/hooks/useSuccessStories';
import { PageLoader } from '@/components/PageLoader';

export const SuccessStoriesList = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading } = useSuccessStories(deferredSearch || undefined);
  const deleteMutation = useDeleteSuccessStory();

  const stories = data?.stories ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Success Stories</h1>
      <p className="mt-1 text-ink/60">Celebrating every happy ending.</p>

      <input
        type="text"
        placeholder="Search stories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mt-6 max-w-xs"
      />

      <div className="mt-8">
        {isLoading ? (
          <PageLoader/>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div key={story._id} className="overflow-hidden rounded-4xl bg-white">
                <div className="aspect-\[4\/3] w-full overflow-hidden bg-peach">
                  {story.photos[0]?.url ? (
                    <img src={story.photos[0].url} alt={story.petName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl">🎉</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-coral">{story.petName}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">{story.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-ink/60">{story.story}</p>
                  <button
                    onClick={() => deleteMutation.mutate(story._id)}
                    disabled={deleteMutation.isPending}
                    className="mt-3 text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink/50">No success stories yet. Write one from an approved adoption!</p>
        )}
      </div>
    </div>
  );
};