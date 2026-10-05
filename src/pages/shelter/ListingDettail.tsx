import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useListing, useDeleteListing } from '@/hooks/useAdoptionListings';
import { useListingRequests, useApproveRequest, useRejectRequest } from '@/hooks/useAdoptionRequests';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-sunshine/30 text-ink',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-ink/10 text-ink/50',
};

export const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: listingData, isLoading: listingLoading } = useListing(id!);
  const { data: requestsData, isLoading: requestsLoading } = useListingRequests(id!);
  const approveMutation = useApproveRequest(id!);
  const rejectMutation = useRejectRequest(id!);
  const deleteMutation = useDeleteListing();

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  if (listingLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-display text-xl text-ink/40">Loading...</p>
      </div>
    );
  }

  const listing = listingData?.listing;
  if (!listing) return null;

  const requests = requestsData?.requests ?? [];
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const otherRequests = requests.filter((r) => r.status !== 'pending');

  const handleApprove = (requestId: string) => {
    approveMutation.mutate(
      { requestId, reviewNote },
      { onSuccess: () => { setReviewingId(null); setReviewNote(''); } }
    );
  };

  const handleReject = (requestId: string) => {
    rejectMutation.mutate(
      { requestId, reviewNote },
      { onSuccess: () => { setReviewingId(null); setReviewNote(''); } }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(listing._id, {
      onSuccess: () => navigate('/shelter/listings'),
    });
  };

  return (
    <div className="max-w-3xl">
      <Link to=".." className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to Listings
      </Link>

      <div className="mt-4 flex items-start gap-6">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-4xl bg-peach">
          {listing.photos[0]?.url ? (
            <img src={listing.photos[0].url} alt={listing.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">🐾</div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-ink">{listing.name}</h1>
          <p className="mt-1 capitalize text-ink/60">
            {listing.breed || listing.species} · {listing.age || 'Age unknown'} · {listing.status}
          </p>
          {listing.description && <p className="mt-3 text-ink/70">{listing.description}</p>}

          <div className="mt-4 flex gap-3">
            <Link to={`/shelter/listings/${listing._id}/edit`} className="btn-secondary text-sm">
              Edit
            </Link>
            <button onClick={handleDelete} disabled={deleteMutation.isPending} className="text-sm font-semibold text-red-500 hover:text-red-600">
              Delete listing
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-ink">
          Adoption requests {requests.length > 0 && `(${requests.length})`}
        </h2>

        <div className="mt-4 space-y-3">
          {requestsLoading ? (
            <p className="text-sm text-ink/50">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-ink/50">No requests yet.</p>
          ) : (
            <>
              {pendingRequests.map((request) => (
                <div key={request._id} className="rounded-3xl border-2 border-coral/20 bg-coral-light/30 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink">{request.applicant.name}</p>
                      <p className="text-sm text-ink/50">{request.applicant.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  {request.message && <p className="mt-3 text-sm text-ink/70">"{request.message}"</p>}

                  {reviewingId === request._id ? (
                    <div className="mt-4 space-y-2">
                      <input
                        type="text"
                        placeholder="Note (optional)"
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="input-field text-sm"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={approveMutation.isPending}
                          className="btn-primary text-sm"
                        >
                          Confirm approve
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={rejectMutation.isPending}
                          className="text-sm font-semibold text-red-600"
                        >
                          Confirm reject
                        </button>
                        <button onClick={() => setReviewingId(null)} className="text-sm font-semibold text-ink/50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewingId(request._id)}
                      className="mt-4 text-sm font-semibold text-coral hover:text-coral-dark"
                    >
                      Review request
                    </button>
                  )}
                </div>
              ))}

              {otherRequests.map((request) => (
                <div key={request._id} className="rounded-3xl border-2 border-ink/5 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink">{request.applicant.name}</p>
                      <p className="text-sm text-ink/50">{request.applicant.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  {request.reviewNote && <p className="mt-2 text-sm italic text-ink/40">{request.reviewNote}</p>}

                  {request.status === 'approved' && (
                    <Link
                      to={`/shelter/stories/new?adoptionRequestId=${request._id}&petName=${encodeURIComponent(listing.name)}`}
                      className="mt-3 inline-block text-sm font-semibold text-coral hover:text-coral-dark"
                    >
                      📝 Write a success story
                    </Link>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};