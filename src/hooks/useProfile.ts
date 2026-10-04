import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { useAuthStore } from '@/store/authStore';
import type { UpdateProfilePayload, ChangePasswordPayload } from '@/types';

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userApi.updateProfile(payload),
    onSuccess: (data) => {
      // No separate "profile" query to invalidate — the Zustand auth store
      // IS our source of truth for the current user, so we update it directly.
      setUser(data.user);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => userApi.changePassword(payload),
  });
};