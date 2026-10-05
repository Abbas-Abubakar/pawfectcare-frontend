import { useQuery, useMutation } from '@tanstack/react-query';
import { feedbackApi } from '@/api/feedback.api';

export const FEEDBACK_QUERY_KEY = ['feedback'] as const;

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment?: string }) =>
      feedbackApi.submit(rating, comment),
  });
};

export const useAllFeedback = () => {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEY,
    queryFn: feedbackApi.getAll,
  });
};