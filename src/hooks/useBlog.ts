import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query';
import { blogApi } from '@/api/blog.api';
import { createListQuery } from './useCreateListQuery';
import type { BlogPostFormValues } from '@/api/appointment.api';

export const BLOG_POSTS_QUERY_KEY = ['blog-posts'] as const;
export const BLOG_POST_QUERY_KEY = (id: string) => ['blog-posts', id] as const;
export const MY_POSTS_QUERY_KEY = (authorId: string) => ['my-blog-posts', authorId] as const;


export const useBlogPosts = createListQuery(BLOG_POSTS_QUERY_KEY, blogApi.getPosts);

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: BLOG_POST_QUERY_KEY(id),
    queryFn: () => blogApi.getPostById(id),
    enabled: !!id,
  });
};


export const useMyBlogPosts = (authorId: string) => {
  return useQuery({
    queryKey: MY_POSTS_QUERY_KEY(authorId),
    queryFn: () => blogApi.getMine(authorId),
    enabled: !!authorId,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: BlogPostFormValues) => blogApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_POSTS_QUERY_KEY });
    },
  });
};

export const useUpdateBlogPost = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<BlogPostFormValues>) => blogApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BLOG_POST_QUERY_KEY(id) });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_POSTS_QUERY_KEY });
    },
  });
};