import { apiClient } from './client';
import type { ProductsResponse, WishlistResponse } from '@/types/product';

interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}

export const productApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const { data } = await apiClient.get('/products', { params: filters });
    return data;
  },
};

export const wishlistApi = {
  get: async (): Promise<WishlistResponse> => {
    const { data } = await apiClient.get('/wishlist');
    return data;
  },

  add: async (productId: string): Promise<WishlistResponse> => {
    const { data } = await apiClient.post(`/wishlist/${productId}`);
    return data;
  },

  remove: async (productId: string): Promise<WishlistResponse> => {
    const { data } = await apiClient.delete(`/wishlist/${productId}`);
    return data;
  },
};