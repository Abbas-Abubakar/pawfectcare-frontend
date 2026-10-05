import { apiClient } from './client';
import type { AdoptionListingsResponse, AdoptionListingResponse, AdoptionListingFormValues } from '@/types/adoption';

const buildListingFormData = (values: AdoptionListingFormValues): FormData => {
  const formData = new FormData();
  formData.append('name', values.name);
  formData.append('species', values.species);
  if (values.breed) formData.append('breed', values.breed);
  if (values.age) formData.append('age', values.age);
  formData.append('gender', values.gender);
  if (values.description) formData.append('description', values.description);
  if (values.temperament) formData.append('temperament', values.temperament);
  values.photos.forEach((file) => formData.append('photos', file));
  return formData;
};

export const adoptionListingApi = {
  getAll: async (params: { status?: string; species?: string; search?: string } = {}) => {
    const { data } = await apiClient.get<AdoptionListingsResponse>('/adoptions', { params });
    return data;
  },

  getMine: async () => {
    const { data } = await apiClient.get<AdoptionListingsResponse>('/adoptions/my-listings');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<AdoptionListingResponse>(`/adoptions/${id}`);
    return data;
  },

  create: async (values: AdoptionListingFormValues) => {
    const { data } = await apiClient.post<AdoptionListingResponse>('/adoptions', buildListingFormData(values), {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  update: async (id: string, values: Partial<AdoptionListingFormValues>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === 'photos' && Array.isArray(val)) {
        val.forEach((file: File) => formData.append('photos', file));
      } else if (val !== undefined) {
        formData.append(key, val as string);
      }
    });
    const { data } = await apiClient.patch<AdoptionListingResponse>(`/adoptions/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  removePhoto: async (listingId: string, photoId: string) => {
    const { data } = await apiClient.delete(`/adoptions/${listingId}/photos/${photoId}`);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete(`/adoptions/${id}`);
    return data;
  },
};
