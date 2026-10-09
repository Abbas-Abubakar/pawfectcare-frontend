import { useState, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { useAdoptionBrowse } from '@/hooks/useAdoptionBrowse';

export const AdoptionBrowse = () => {
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading } = useAdoptionBrowse({
    search: deferredSearch || undefined,
    species: species || undefined,
  });

  const listings = data?.listings ?? [];

  return (
    <div>
      <div className="flex sm:items-center justify-between flex-col gap-4 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-ink">Adopt a Pet</h1>
          <p className="mt-1 text-ink/60">Pets from local shelters looking for a home.</p>
        </div>
        <Link to="/owner/adopt/my-requests" className="btn-secondary text-sm sm:inset-auto">
          My requests
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:max-w-xs"
        />
        <input
          type="text"
          placeholder="Filter by species (Dog, Cat...)"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="input-field sm:max-w-xs"
        />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing._id}
                to={`/owner/adopt/${listing._id}`}
                className="group block overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral"
              >
                <div className="aspect-square w-full overflow-hidden bg-peach">
                  {listing.photos[0]?.url ? (
                    <img
                      src={listing.photos[0].url}
                      alt={listing.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl">🐾</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-ink">{listing.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {listing.breed || listing.species} · {listing.age || 'Age unknown'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink/50">No pets available for adoption right now.</p>
        )}
      </div>
    </div>
  );
};