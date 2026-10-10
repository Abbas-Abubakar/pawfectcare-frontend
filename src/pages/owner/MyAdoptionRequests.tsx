import { Link } from 'react-router-dom';
import { useMyAdoptionRequests, useWithdrawAdoptionRequest } from '@/hooks/useAdoptionBrowse';
import { PageLoader } from '@/components/PageLoader';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-sunshine/30 text-ink',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-ink/10 text-ink/50',
};

export const MyAdoptionRequests = () => {
  const { data, isLoading } = useMyAdoptionRequests();
  const withdrawMutation = useWithdrawAdoptionRequest();

  const requests = data?.requests ?? [];

  return (
    <div className="max-w-2xl">
      <Link to="/owner/adopt" className="text-sm font-semibold text-ink/50 hover:text-ink">
        ← Back to Adopt a Pet
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-ink">My Adoption Requests</h1>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          <PageLoader/>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="rounded-3xl border-2 border-ink/5 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-peach">
                    {request.listing.photos[0]?.url ? (
                      <img src={request.listing.photos[0].url} alt={request.listing.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">🐾</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{request.listing.name}</p>
                    <p className="text-sm text-ink/50">
                      Applied {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[request.status]}`}>
                  {request.status}
                </span>
              </div>

              {request.reviewNote && <p className="mt-3 text-sm italic text-ink/50">{request.reviewNote}</p>}

              {request.status === 'pending' && (
                <button
                  onClick={() => withdrawMutation.mutate(request._id)}
                  disabled={withdrawMutation.isPending}
                  className="mt-3 text-sm font-semibold text-ink/50 hover:text-red-600"
                >
                  Withdraw request
                </button>
              )}

              {request.status === 'approved' && (
                <p className="mt-3 text-sm font-semibold text-green-700">
                  🎉 Check "My Pets" — {request.listing.name} is now yours!
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-ink/50">You haven't applied to adopt any pets yet.</p>
        )}
      </div>
    </div>
  );
};