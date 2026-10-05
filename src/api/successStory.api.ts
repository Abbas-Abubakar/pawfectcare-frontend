import { apiClient } from './client';
import type { SuccessStoriesResponse, SuccessStoryResponse } from '@/types/successStory';

export const successStoryApi = {
  getAll: async (search?: string) => {
    const { data } = await apiClient.get<SuccessStoriesResponse>('/success-stories', {
      params: search ? { search } : undefined,
    });
    return data;
  },

  create: async (values: { adoptionRequestId: string; title: string; story: string; photos: File[] }) => {
    const formData = new FormData();
    formData.append('adoptionRequestId', values.adoptionRequestId);
    formData.append('title', values.title);
    formData.append('story', values.story);
    values.photos.forEach((file) => formData.append('photos', file));

    const { data } = await apiClient.post<SuccessStoryResponse>('/success-stories', formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete(`/success-stories/${id}`);
    return data;
  },
};