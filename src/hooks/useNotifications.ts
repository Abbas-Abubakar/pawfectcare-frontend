import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/api/notification.api';
import type { NotificationsResponse } from '@/types/notification';
import { createListQuery } from './useCreateListQuery';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

export const useNotifications = createListQuery<void, NotificationsResponse>(
  NOTIFICATIONS_QUERY_KEY,
  () => notificationApi.getAll(),
  () => ({ refetchInterval: 30_000 })
);

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};