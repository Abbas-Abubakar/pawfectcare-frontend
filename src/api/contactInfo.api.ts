import { apiClient } from './client';

export interface ShelterInfo {
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  hours: string;
}

export const contactInfoApi = {
  get: async (): Promise<{ success: boolean; info: ShelterInfo }> => {
    const { data } = await apiClient.get('/contact-info');
    return data;
  },
};