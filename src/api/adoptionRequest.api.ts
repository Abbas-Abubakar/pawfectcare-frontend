import { apiClient } from './client';
import type { AdoptionRequestsResponse } from '@/types/adoption';

export const adoptionRequestApi = {
  getForListing: async (listingId: string) => {
    const { data } = await apiClient.get<AdoptionRequestsResponse>(`/adoptions/${listingId}/requests`);
    return data;
  },

  approve: async (requestId: string, reviewNote?: string) => {
    const { data } = await apiClient.patch(`/adoptions/requests/${requestId}/approve`, { reviewNote });
    return data;
  },

  reject: async (requestId: string, reviewNote?: string) => {
    const { data } = await apiClient.patch(`/adoptions/requests/${requestId}/reject`, { reviewNote });
    return data;
  },
};