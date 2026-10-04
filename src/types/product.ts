export type ProductCategory = 'food' | 'toys' | 'grooming' | 'accessories' | 'health' | 'other';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image?: { url: string; publicId: string };
  isActive: boolean;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  products: Product[];
}

export interface Wishlist {
  products: Product[];
}

export interface WishlistResponse {
  success: boolean;
  wishlist: Wishlist;
}