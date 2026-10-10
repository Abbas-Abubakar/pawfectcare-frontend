import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useListing } from '@/hooks/useAdoptionListings';
import { useCreateAdoptionRequest } from '@/hooks/useAdoptionBrowse';

export const AdoptionListingDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useListing(id!);
  const createRequest = useCreateAdoptionRequest();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading...</p>
      </div>
    );
  }

  const listing = data?.listing;
  if (!listing) return null;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    createRequest.mutate(
      { listingId: listing._id, message },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Could not submit request.' : 'Could not submit request.'
          );
        },
      }
    );
  };

  return (
    <div className="max-w-2xl">
      <Link to=".." className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to Adopt a Pet
      </Link>

      {listing.photos.length > 0 && (
        <div className="mt-4 aspect-\[16\/10] w-full overflow-hidden rounded-4xl bg-peach">
          <img src={listing.photos[0].url} alt={listing.name} className="h-full w-full object-cover" />
        </div>
      )}

      <h1 className="mt-6 font-display text-3xl font-bold text-ink">{listing.name}</h1>
      <p className="mt-1 capitalize text-ink/60">
        {listing.breed || listing.species} · {listing.age || 'Age unknown'} · {listing.gender}
      </p>

      {listing.temperament && (
        <p className="mt-3 text-sm text-ink/70">
          <span className="font-semibold">Temperament:</span> {listing.temperament}
        </p>
      )}
      {listing.description && <p className="mt-3 text-ink/70">{listing.description}</p>}

      <div className="mt-6 rounded-3xl bg-white p-5 text-sm text-ink/60">
        <p className="font-semibold text-ink">Shelter contact</p>
        <p className="mt-1">{listing.shelter.name}</p>
        <p>{listing.shelter.email}</p>
        {listing.shelter.phone && <p>{listing.shelter.phone}</p>}
      </div>

      {listing.status !== 'available' ? (
        <p className="mt-8 rounded-2xl bg-cream p-4 text-center text-ink/60">
          This pet is no longer available for adoption.
        </p>
      ) : submitted ? (
        <div className="mt-8 rounded-2xl bg-green-50 p-5 text-center text-green-700">
          <p className="text-2xl">🎉</p>
          <p className="mt-1 font-semibold">Request submitted!</p>
          <p className="mt-1 text-sm">The shelter will review your application and get back to you.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="message" className="form-label">
              Why would you be a great fit? <span className="font-normal text-ink/40">(optional)</span>
            </label>
            <textarea
              id="message"
              rows={4}
              className="input-field resize-none"
              placeholder="Tell the shelter about your home, experience, and why you'd like to adopt..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={createRequest.isPending} className="btn-primary w-full">
            {createRequest.isPending ? 'Submitting...' : `Apply to adopt ${listing.name}`}
          </button>
        </form>
      )}
    </div>
  );
};