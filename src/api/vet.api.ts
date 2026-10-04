import { apiClient } from './client';
import type { VetsResponse } from '@/types/appointment';

export const vetApi = {
  list: async (): Promise<VetsResponse> => {
    const { data } = await apiClient.get('/users/vets');
    return data;
  },
};