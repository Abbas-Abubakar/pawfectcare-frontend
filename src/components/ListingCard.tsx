import { Link } from 'react-router-dom';
import type { AdoptionListing } from '@/types/adoption';

const STATUS_STYLES: Record<AdoptionListing['status'], string> = {
  available: 'bg-green-100 text-green-700',
  pending: 'bg-sunshine/30 text-ink',
  adopted: 'bg-ink/10 text-ink/60',
};

export const ListingCard = ({ listing }: { listing: AdoptionListing }) => {
  return (
    <Link to={`/shelter/listings/${listing._id}`} className="group block overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral">
      <div className="relative aspect-square w-full overflow-hidden bg-peach">
        {listing.photos[0]?.url ? (
          <img
            src={listing.photos[0].url}
            alt={listing.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">🐾</div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[listing.status]}`}>
          {listing.status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-ink">{listing.name}</h3>
        <p className="mt-1 text-sm text-ink/60">
          {listing.breed || listing.species} · {listing.age || 'Age unknown'}
        </p>
      </div>
    </Link>
  );
};