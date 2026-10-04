import { apiClient } from './client';
import type { User, UserRole } from '../types';

interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  userId: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/verify-otp', { email, otp });
    return data;
  },

  resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post('/auth/resend-otp', { email });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/reset-password', { email, token, newPassword });
    return data;
  },
};