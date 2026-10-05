import { apiClient } from './client';
import type { AdoptionRequestsResponse } from '@/types/adoption';

export const adoptionRequestApi = {
  // Shelter admin side (already existed)
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

  // Pet owner side (new)
  create: async (listingId: string, message?: string) => {
    const { data } = await apiClient.post(`/adoptions/${listingId}/requests`, { message });
    return data;
  },

  getMine: async (status?: string) => {
    const { data } = await apiClient.get<AdoptionRequestsResponse>('/adoptions/my-requests', {
      params: status ? { status } : undefined,
    });
    return data;
  },

  withdraw: async (requestId: string) => {
    const { data } = await apiClient.patch(`/adoptions/requests/${requestId}/withdraw`);
    return data;
  },
};