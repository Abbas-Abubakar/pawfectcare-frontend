import { apiClient } from './client';
import type { AppointmentsResponse, AppointmentResponse } from '@/types/appointment';

interface BookAppointmentPayload {
  petId: string;
  availabilityId: string;
  reason: string;
}

export const appointmentApi = {
  getMyAppointments: async (status?: string): Promise<AppointmentsResponse> => {
    const { data } = await apiClient.get('/appointments/my-appointments', {
      params: status ? { status } : undefined,
    });
    return data;
  },

  book: async (payload: BookAppointmentPayload): Promise<AppointmentResponse> => {
    const { data } = await apiClient.post('/appointments', payload);
    return data;
  },

  cancel: async (id: string, cancelReason?: string): Promise<AppointmentResponse> => {
    const { data } = await apiClient.patch(`/appointments/${id}/cancel`, { cancelReason });
    return data;
  },

  reschedule: async (id: string, newAvailabilityId: string): Promise<AppointmentResponse> => {
    const { data } = await apiClient.patch(`/appointments/${id}/reschedule`, { newAvailabilityId });
    return data;
  },
};