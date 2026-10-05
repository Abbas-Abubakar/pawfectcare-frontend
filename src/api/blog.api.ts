import type { BlogPostFormValues } from './appointment.api';
import { apiClient } from './client';
import type { BlogPostsResponse, BlogPostResponse, BookmarkResponse } from '@/types/blog';

interface BlogFilters {
  category?: string;
  search?: string;
  page?: number;
}

export const blogApi = {
  create: async (values: BlogPostFormValues): Promise<BlogPostResponse> => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    if (values.excerpt) formData.append('excerpt', values.excerpt);
    formData.append('category', values.category);
    if (values.coverImage) formData.append('coverImage', values.coverImage);

    const { data } = await apiClient.post('/blog', formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  update: async (id: string, values: Partial<BlogPostFormValues>): Promise<BlogPostResponse> => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === 'coverImage' && val instanceof File) {
        formData.append('coverImage', val);
      } else if (val !== undefined) {
        formData.append(key, val as string);
      }
    });

    const { data } = await apiClient.patch(`/blog/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/blog/${id}`);
  },

  getMine: async (authorId: string): Promise<BlogPostsResponse> => {
    // Our backend has no dedicated "my posts" endpoint — reuse the public
    // list endpoint and filter client-side by author id. Fine at our current
    // scale; if an author's post count grows large, this should move to a
    // real backend filter (e.g. GET /blog?author=:id) instead.
    const { data } = await apiClient.get<BlogPostsResponse>('/blog', { params: { limit: 100 } });
    return { ...data, posts: data.posts.filter((p) => p.author._id === authorId) };
  },
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