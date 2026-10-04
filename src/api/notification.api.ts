import { apiClient } from './client';
import type { NotificationsResponse } from '@/types/notification';

export const notificationApi = {
  getAll: async (unreadOnly = false): Promise<NotificationsResponse> => {
    const { data } = await apiClient.get('/notifications', {
      params: unreadOnly ? { unreadOnly: 'true' } : undefined,
    });
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.patch('/notifications/read-all');
    return data;
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete(`/notifications/${id}`);
    return data;
  },
};