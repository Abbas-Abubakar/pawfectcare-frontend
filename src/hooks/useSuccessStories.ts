import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { successStoryApi } from '@/api/successStory.api';

export const SUCCESS_STORIES_QUERY_KEY = ['success-stories'] as const;

export const useSuccessStories = (search?: string) => {
  return useQuery({
    queryKey: [...SUCCESS_STORIES_QUERY_KEY, search],
    queryFn: () => successStoryApi.getAll(search),
  });
};

export const useCreateSuccessStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: successStoryApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUCCESS_STORIES_QUERY_KEY }),
  });
};

export const useDeleteSuccessStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: successStoryApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUCCESS_STORIES_QUERY_KEY }),
  });
};