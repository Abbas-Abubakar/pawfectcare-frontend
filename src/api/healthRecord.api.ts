import { apiClient } from './client';
import type { HealthRecordsResponse, HealthRecordFormValues } from '@/types/healthRecord';

export const healthRecordApi = {
  getByPet: async (petId: string): Promise<HealthRecordsResponse> => {
    const { data } = await apiClient.get(`/pets/${petId}/health-records`);
    return data;
  },

  create: async (petId: string, values: HealthRecordFormValues) => {
    const payload = {
      type: values.type,
      title: values.title,
      description: values.description || undefined,
      dateAdministered: values.dateAdministered || undefined,
      nextDueDate: values.nextDueDate || undefined,
      severity: values.severity || undefined,
    };
    const { data } = await apiClient.post(`/pets/${petId}/health-records`, payload);
    return data;
  },
  update: async (petId: string, recordId: string, values: Partial<HealthRecordFormValues>) => {
  const payload = {
    type: values.type,
    title: values.title,
    description: values.description || undefined,
    dateAdministered: values.dateAdministered || undefined,
    nextDueDate: values.nextDueDate || undefined,
    severity: values.severity || undefined,
  };
  const { data } = await apiClient.patch(`/pets/${petId}/health-records/${recordId}`, payload);
  return data;
},

remove: async (petId: string, recordId: string) => {
  await apiClient.delete(`/pets/${petId}/health-records/${recordId}`);
},
};