import { apiClient } from './client';
import type { ContactMessagesResponse } from '@/types/contact';

export const contactMessageApi = {
  getAll: async (params: { type?: string; status?: string } = {}) => {
    const { data } = await apiClient.get<ContactMessagesResponse>('/contact', { params });
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch(`/contact/${id}/status`, { status });
    return data;
  },
};