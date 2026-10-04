import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/blog.api';

export const BLOG_POSTS_QUERY_KEY = ['blog-posts'] as const;
export const BLOG_POST_QUERY_KEY = (id: string) => ['blog-posts', id] as const;

interface UseBlogPostsParams {
  category?: string;
  search?: string;
  page?: number;
}

export const useBlogPosts = (params: UseBlogPostsParams) => {
  return useQuery({
    queryKey: [...BLOG_POSTS_QUERY_KEY, params],
    queryFn: () => blogApi.getPosts(params),
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: BLOG_POST_QUERY_KEY(id),
    queryFn: () => blogApi.getPostById(id),
    enabled: !!id,
  });
};