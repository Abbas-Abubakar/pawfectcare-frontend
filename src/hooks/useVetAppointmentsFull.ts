import { useQuery } from '@tanstack/react-query';
import { vetDashboardApi } from '@/api/vetDashboard.api';

export const VET_APPOINTMENTS_QUERY_KEY = ['vet-appointments'] as const;

export const useVetAppointments = (status?: string) => {
  return useQuery({
    queryKey: [...VET_APPOINTMENTS_QUERY_KEY, status],
    queryFn: () => vetDashboardApi.getAppointments(status ? { status } : {}),
  });
};