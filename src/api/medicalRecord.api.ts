import { apiClient } from './client';
import type { MedicalRecordResponse, MedicalHistoryResponse } from '@/types/medicalRecord';

export const medicalRecordApi = {
  create: async (
    appointmentId: string,
    values: { diagnosis: string; prescription?: string; notes?: string; attachments?: File[] }
  ): Promise<MedicalRecordResponse> => {
    const formData = new FormData();
    formData.append('diagnosis', values.diagnosis);
    if (values.prescription) formData.append('prescription', values.prescription);
    if (values.notes) formData.append('notes', values.notes);
    values.attachments?.forEach((file) => formData.append('attachments', file));

    const { data } = await apiClient.post(`/appointments/${appointmentId}/medical-record`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  getPetHistory: async (petId: string): Promise<MedicalHistoryResponse> => {
    const { data } = await apiClient.get(`/pets/${petId}/medical-records`);
    return data;
  },
};