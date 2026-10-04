import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { AvailabilitySlot } from '@/types/appointment';

interface MySlotsResponse {
  success: boolean;
  count: number;
  slots: AvailabilitySlot[];
}

export const MY_SLOTS_QUERY_KEY = ['my-availability'] as const;

export const useMyAvailability = (params: { from?: string; to?: string } = {}) => {
  return useQuery({
    queryKey: [...MY_SLOTS_QUERY_KEY, params],
    queryFn: async () => {
      const { data } = await apiClient.get<MySlotsResponse>('/availability/my-slots', { params });
      return data;
    },
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { date: string; slots: { startTime: string; endTime: string }[] }) => {
      const { data } = await apiClient.post('/availability', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SLOTS_QUERY_KEY });
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/availability/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SLOTS_QUERY_KEY });
    },
  });
};