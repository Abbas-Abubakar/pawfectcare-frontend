import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointment.api';
import { vetApi } from '@/api/vet.api';
import { availabilityApi } from '@/api/availability.api';

export const VETS_QUERY_KEY = ['vets'] as const;
export const SLOTS_QUERY_KEY = (vetId: string) => ['availability', vetId] as const;
export const APPOINTMENTS_QUERY_KEY = ['appointments'] as const;

export const useVets = () => {
  return useQuery({
    queryKey: VETS_QUERY_KEY,
    queryFn: vetApi.list,
  });
};

export const useOpenSlots = (vetId: string) => {
  return useQuery({
    queryKey: SLOTS_QUERY_KEY(vetId),
    queryFn: () => availabilityApi.getOpenSlots(vetId),
    enabled: !!vetId,
  });
};

export const useMyAppointments = (status?: string) => {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, status],
    queryFn: () => appointmentApi.getMyAppointments(status),
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentApi.book,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => appointmentApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
};