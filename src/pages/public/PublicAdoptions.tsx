// src/pages/public/PublicAdoptions.tsx
import { useState, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { useAdoptionBrowse } from '@/hooks/useAdoptionBrowse';
import { PageLoader } from '@/components/PageLoader';

export const PublicAdoptions = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const { data, isLoading } = useAdoptionBrowse({ search: deferredSearch || undefined });
  const listings = data?.listings ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-ink">Adopt a Pet</h1>
      <p className="mt-1 text-ink/60">
        Found someone you love?{' '}
        <Link to="/auth/register" className="font-semibold text-coral">
          Create an account
        </Link>{' '}
        to apply.
      </p>

      <input
        type="text"
        placeholder="Search by name or breed..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mt-6 max-w-xs"
      />

      <div className="mt-8">
        {isLoading ? (
          <PageLoader/>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <Link key={listing._id} to={`/adopt/${listing._id}`} state={{from: "adoptions"}} className="group overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral">
                <div className="aspect-square w-full overflow-hidden bg-peach">
                  {listing.photos[0]?.url ? (
                    <img src={listing.photos[0].url} alt={listing.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl">🐾</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-ink">{listing.name}</h3>
                  <p className="text-xs text-ink/50">{listing.breed || listing.species}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink/50">No pets available right now.</p>
        )}
      </div>
    </div>
  );
};