// src/pages/public/PublicAdoptionDetail.tsx
import { useParams, Link, useLocation } from 'react-router-dom';
import { useListing } from '@/hooks/useAdoptionListings';
import { PageLoader } from '@/components/PageLoader';

export const PublicAdoptionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useListing(id!);
  const location = useLocation()
  const from = location.state?.from

  if (isLoading) return <PageLoader/>;

  const listing = data?.listing;
  if (!listing) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to=".." className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to {from}
      </Link>

      {listing.photos[0]?.url && (
        <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-4xl bg-peach">
          <img src={listing.photos[0].url} alt={listing.name} className="h-full w-full object-cover" />
        </div>
      )}

      <h1 className="mt-6 font-display text-3xl font-bold text-ink">{listing.name}</h1>
      <p className="mt-1 capitalize text-ink/60">{listing.breed || listing.species} · {listing.age || 'Age unknown'}</p>
      {listing.temperament && <p className="mt-3 text-sm text-ink/70"><span className="font-semibold">Temperament:</span> {listing.temperament}</p>}
      {listing.description && <p className="mt-3 text-ink/70">{listing.description}</p>}

      <div className="mt-8 rounded-3xl bg-coral-light p-5 text-center">
        <p className="font-semibold text-ink">Interested in {listing.name}?</p>
        <p className="mt-1 text-sm text-ink/60">Create a free account to submit an adoption application.</p>
        <Link to="/auth/register" className="btn-primary mt-4 inline-block">
          Sign up to apply
        </Link>
      </div>
    </div>
  );
};