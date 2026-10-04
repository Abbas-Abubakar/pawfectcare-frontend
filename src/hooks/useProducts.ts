// import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/product.api';
import { createListQuery } from './useCreateListQuery';

export const PRODUCTS_QUERY_KEY = ['products'] as const;

// interface UseProductsParams {
//   category?: string;
//   search?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   page?: number;
// }

export const useProducts = createListQuery(PRODUCTS_QUERY_KEY, productApi.getProducts);