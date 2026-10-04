import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/blog.api';
import { createListQuery } from './useCreateListQuery';

export const BLOG_POSTS_QUERY_KEY = ['blog-posts'] as const;
export const BLOG_POST_QUERY_KEY = (id: string) => ['blog-posts', id] as const;


export const useBlogPosts = createListQuery(BLOG_POSTS_QUERY_KEY, blogApi.getPosts);

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: BLOG_POST_QUERY_KEY(id),
    queryFn: () => blogApi.getPostById(id),
    enabled: !!id,
  });
};