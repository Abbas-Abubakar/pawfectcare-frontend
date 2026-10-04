import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vetDashboardApi } from '@/api/vetDashboard.api';
import { appointmentApi } from '@/api/appointment.api';

export const VET_TODAY_QUERY_KEY = ['vet-today'] as const;
export const ASSIGNED_PETS_QUERY_KEY = ['assigned-pets'] as const;

export const useTodayAppointments = () => {
  return useQuery({
    queryKey: VET_TODAY_QUERY_KEY,
    queryFn: vetDashboardApi.getToday,
  });
};

export const useAssignedPets = () => {
  return useQuery({
    queryKey: ASSIGNED_PETS_QUERY_KEY,
    queryFn: vetDashboardApi.getAssignedPets,
  });
};

export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentApi.confirm(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VET_TODAY_QUERY_KEY }),
  });
};

export const useRejectAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => appointmentApi.reject(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VET_TODAY_QUERY_KEY }),
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentApi.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VET_TODAY_QUERY_KEY }),
  });
};