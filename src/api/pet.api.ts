import { apiClient } from './client';
import type { PetsResponse, PetResponse, PetFormValues } from '@/types/pet';

const buildPetFormData = (values: PetFormValues): FormData => {
  const formData = new FormData();
  formData.append('name', values.name);
  formData.append('species', values.species);
  if (values.breed) formData.append('breed', values.breed);
  formData.append('gender', values.gender);
  if (values.dateOfBirth) formData.append('dateOfBirth', values.dateOfBirth);
  if (values.weight) formData.append('weight', values.weight);
  if (values.color) formData.append('color', values.color);
  if (values.notes) formData.append('notes', values.notes);
  if (values.photo) formData.append('photo', values.photo);
  return formData;
};

export const petApi = {
  getMyPets: async (page = 1, limit = 20): Promise<PetsResponse> => {
    const { data } = await apiClient.get('/pets', { params: { page, limit } });
    return data;
  },

  getPetById: async (id: string): Promise<PetResponse> => {
    const { data } = await apiClient.get(`/pets/${id}`);
    return data;
  },

  createPet: async (values: PetFormValues): Promise<PetResponse> => {
    const formData = buildPetFormData(values);
    // Explicitly unset Content-Type so the browser sets it automatically with
    // the correct multipart boundary. Our apiClient instance defaults to
    // 'application/json' for every request — if we left that default in place
    // here, the backend's multer middleware would fail to parse the body,
    // since a JSON content-type on a multipart body is invalid.
    const { data } = await apiClient.post('/pets', formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  updatePet: async (id: string, values: PetFormValues): Promise<PetResponse> => {
    const formData = buildPetFormData(values);
    const { data } = await apiClient.patch(`/pets/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },
};