import { apiClient } from './client';
import type { ContactMessagesResponse, ContactSubmission } from '@/types/contact';

export const contactMessageApi = {
  getAll: async (params: { type?: string; status?: string } = {}) => {
    const { data } = await apiClient.get<ContactMessagesResponse>('/contact', { params });
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch(`/contact/${id}/status`, { status });
    return data;
  },
  submit: async (payload: ContactSubmission) => {
  const { data } = await apiClient.post<{ success: boolean; message: string; id: string }>('/contact', payload);
  return data;
},
};