import type { PaginationMeta } from ".";

export type BlogCategory = 'nutrition' | 'health' | 'training' | 'grooming' | 'adoption' | 'general';

export interface BlogPost {
  _id: string;
  author: { _id: string; name: string; role: string };
  title: string;
  content: string;
  excerpt?: string;
  category: BlogCategory;
  coverImage?: { url: string; publicId: string };
  createdAt: string;
}

export interface BlogPostsResponse {
  success: boolean;
  count: number;
  pagination: PaginationMeta;
  posts: BlogPost[];
}

export interface BlogPostResponse {
  success: boolean;
  post: BlogPost;
}

export interface Bookmark {
  posts: BlogPost[];
}

export interface BookmarkResponse {
  success: boolean;
  bookmark: Bookmark;
}