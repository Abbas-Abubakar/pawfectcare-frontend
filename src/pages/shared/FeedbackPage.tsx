import { useState } from 'react';
import axios from 'axios';
import { useSubmitFeedback } from '@/hooks/useFeedback';
import { StarRating } from '@/components/StarRating';

export const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const mutation = useSubmitFeedback();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    mutation.mutate(
      { rating, comment },
      {
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Something went wrong.' : 'Something went wrong.'
          );
        },
      }
    );
  };

  if (mutation.isSuccess) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <p className="text-6xl">💛</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Thank you!</h1>
        <p className="mt-2 text-ink/60">Your feedback helps us make PawfectCare better.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center text-3xl font-bold text-ink">Share your feedback</h1>
      <p className="mt-2 text-center text-ink/60">How's your experience with PawfectCare been?</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-4xl bg-white p-6">
        <div className="flex flex-col items-center gap-2">
          <StarRating value={rating} onChange={setRating} />
          <span className="text-sm text-ink/50">{rating > 0 ? `${rating} out of 5` : 'Tap to rate'}</span>
        </div>

        <div>
          <label htmlFor="comment" className="form-label">
            Comments <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <textarea
            id="comment"
            rows={4}
            className="input-field resize-none"
            placeholder="What's working well? What could be better?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Sending...' : 'Submit feedback'}
        </button>
      </form>
    </div>
  );
};