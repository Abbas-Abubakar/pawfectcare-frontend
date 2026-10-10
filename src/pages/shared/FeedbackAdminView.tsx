import { useAllFeedback } from '@/hooks/useFeedback';
import { StarRating } from '@/components/StarRating';
import { PageLoader } from '@/components/PageLoader';

export const FeedbackAdminView = () => {
  const { data, isLoading } = useAllFeedback();
  const feedback = data?.feedback ?? [];

  const averageRating =
    feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">User Feedback</h1>

      {averageRating && (
        <div className="mt-4 flex items-center gap-3">
          <StarRating value={Math.round(Number(averageRating))} readOnly />
          <span className="text-ink/60">
            {averageRating} average · {feedback.length} {feedback.length === 1 ? 'response' : 'responses'}
          </span>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {isLoading ? (
          <PageLoader/>
        ) : feedback.length > 0 ? (
          feedback.map((item) => (
            <div key={item._id} className="rounded-3xl border-2 border-ink/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink">{item.user.name}</p>
                  <p className="text-xs capitalize text-ink/50">{item.user.role.replace('_', ' ')}</p>
                </div>
                <StarRating value={item.rating} readOnly size="sm" />
              </div>
              {item.comment && <p className="mt-3 text-sm text-ink/70">{item.comment}</p>}
              <p className="mt-2 text-xs text-ink/40">
                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-ink/50">No feedback submitted yet.</p>
        )}
      </div>
    </div>
  );
};