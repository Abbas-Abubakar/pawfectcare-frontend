import { Link } from 'react-router-dom';
import { useMyListings } from '@/hooks/useAdoptionListings';
import { ListingCard } from '@/components/ListingCard';

export const ListingsList = () => {
  const { data, isLoading } = useMyListings();
  const listings = data?.listings ?? [];

  return (
    <div>
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold text-ink">Adoption Listings</h1>
          <p className="mt-1 text-ink/60">Pets looking for their forever home.</p>
        </div>
        <Link to="/shelter/listings/new" className="btn-primary whitespace-nowrap">
          + New listing
        </Link>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">🏠</p>
            <h2 className="font-display text-2xl font-bold text-ink">No listings yet</h2>
            <p className="max-w-sm text-ink/60">Create your first adoption listing to help a pet find a home.</p>
            <Link to="/shelter/listings/new" className="btn-primary mt-2">
              Create a listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};