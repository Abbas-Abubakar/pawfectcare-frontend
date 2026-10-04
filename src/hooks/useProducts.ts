import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/product.api';

export const PRODUCTS_QUERY_KEY = ['products'] as const;

interface UseProductsParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}

export const useProducts = (params: UseProductsParams) => {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () => productApi.getProducts(params),
  });
};