import { apiClient } from './client';
import type { AvailabilityResponse } from '@/types/appointment';

export const availabilityApi = {
  getOpenSlots: async (vetId: string): Promise<AvailabilityResponse> => {
    const { data } = await apiClient.get(`/availability/vet/${vetId}`);
    return data;
  },
};