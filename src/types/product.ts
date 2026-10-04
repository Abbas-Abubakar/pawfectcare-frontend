import type { PaginationMeta } from ".";

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
  pagination: PaginationMeta;
  products: Product[];
}

export interface Wishlist {
  products: Product[];
}

export interface WishlistResponse {
  success: boolean;
  wishlist: Wishlist;
}