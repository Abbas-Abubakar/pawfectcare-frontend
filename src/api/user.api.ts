import { apiClient } from './client';
import type { User, UpdateProfilePayload, ChangePasswordPayload } from '@/types';

export const userApi = {
  updateProfile: async (payload: UpdateProfilePayload): Promise<{ success: boolean; user: User }> => {
    const formData = new FormData();
    if (payload.name !== undefined) formData.append('name', payload.name);
    if (payload.phone !== undefined) formData.append('phone', payload.phone);
    if (payload.photo) formData.append('profilePhoto', payload.photo);

    const { data } = await apiClient.patch('/users/me', formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.patch('/users/me/password', payload);
    return data;
  },
};