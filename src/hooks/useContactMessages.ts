import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactMessageApi } from '@/api/contactMessage.api';

export const CONTACT_MESSAGES_QUERY_KEY = ['contact-messages'] as const;

export const useContactMessages = (params: { type?: string; status?: string }) => {
  return useQuery({
    queryKey: [...CONTACT_MESSAGES_QUERY_KEY, params],
    queryFn: () => contactMessageApi.getAll(params),
  });
};

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => contactMessageApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY }),
  });
};