import { PageLoader } from '@/components/PageLoader';
import { useSuccessStories } from '@/hooks/useSuccessStories';

export const PublicStories = () => {
  const { data, isLoading } = useSuccessStories();
  const stories = data?.stories ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-ink">Success Stories</h1>
      <p className="mt-1 text-ink/60">Celebrating every happy ending.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <PageLoader/>
        ) : (
          stories.map((story) => (
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};