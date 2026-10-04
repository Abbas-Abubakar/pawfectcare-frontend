import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointment.api';
import { vetApi } from '@/api/vet.api';
import { availabilityApi } from '@/api/availability.api';
import { createListQuery } from './useCreateListQuery';
import type { VetsResponse } from '@/types/appointment';

export const VETS_QUERY_KEY = ['vets'] as const;
export const SLOTS_QUERY_KEY = (vetId: string) => ['availability', vetId] as const;
export const APPOINTMENTS_QUERY_KEY = ['appointments'] as const;

export const useVets = createListQuery<void, VetsResponse>(VETS_QUERY_KEY, vetApi.list);

export const useOpenSlots = createListQuery(
  ['availability'],
  (vetId: string) => availabilityApi.getOpenSlots(vetId),
  (vetId) => ({ enabled: !!vetId })
);

export const useMyAppointments = createListQuery(APPOINTMENTS_QUERY_KEY, appointmentApi.getMyAppointments);

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

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newAvailabilityId }: { id: string; newAvailabilityId: string }) =>
      appointmentApi.reschedule(id, newAvailabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
};