import { apiClient } from './client';
import type { FeedbackResponse } from '@/types/feedback';

export const feedbackApi = {
  submit: async (rating: number, comment?: string) => {
    const { data } = await apiClient.post('/feedback', { rating, comment });
    return data;
  },

  getAll: async () => {
    const { data } = await apiClient.get<FeedbackResponse>('/feedback');
    return data;
  },
};