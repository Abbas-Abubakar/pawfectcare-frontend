import { apiClient } from './client';
import type { VetAppointmentsResponse, AssignedPetsResponse } from '@/types/vetAppointment';

export const vetDashboardApi = {
  getToday: async (): Promise<VetAppointmentsResponse> => {
    const { data } = await apiClient.get('/vet/dashboard/today');
    return data;
  },

  getAppointments: async (params: { status?: string } = {}): Promise<VetAppointmentsResponse> => {
    const { data } = await apiClient.get('/vet/dashboard/appointments', { params });
    return data;
  },

  getAssignedPets: async (): Promise<AssignedPetsResponse> => {
    const { data } = await apiClient.get('/vet/dashboard/assigned-pets');
    return data;
  },
};