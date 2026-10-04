import { apiClient } from './client';
import type { BlogPostsResponse, BlogPostResponse, BookmarkResponse } from '@/types/blog';

interface BlogFilters {
  category?: string;
  search?: string;
  page?: number;
}

export const blogApi = {
  getPosts: async (filters: BlogFilters = {}): Promise<BlogPostsResponse> => {
    const { data } = await apiClient.get('/blog', { params: filters });
    return data;
  },

  getPostById: async (id: string): Promise<BlogPostResponse> => {
    const { data } = await apiClient.get(`/blog/${id}`);
    return data;
  },
};

export const bookmarkApi = {
  get: async (): Promise<BookmarkResponse> => {
    const { data } = await apiClient.get('/bookmarks');
    return data;
  },

  add: async (postId: string): Promise<BookmarkResponse> => {
    const { data } = await apiClient.post(`/bookmarks/${postId}`);
    return data;
  },

  remove: async (postId: string): Promise<BookmarkResponse> => {
    const { data } = await apiClient.delete(`/bookmarks/${postId}`);
    return data;
  },
};