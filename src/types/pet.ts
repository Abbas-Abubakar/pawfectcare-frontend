export type PetGender = 'male' | 'female' | 'unknown';

export interface Pet {
  _id: string;
  owner: string;
  name: string;
  species: string;
  breed?: string;
  gender: PetGender;
  dateOfBirth?: string;
  weight?: number;
  color?: string;
  photo?: { url: string; publicId: string };
  notes?: string;
  age: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PetsResponse {
  success: boolean;
  count: number;
  pagination: PaginationMeta;
  pets: Pet[];
}

export interface PetResponse {
  success: boolean;
  pet: Pet;
}

export interface PetFormValues {
  name: string;
  species: string;
  breed: string;
  gender: PetGender;
  dateOfBirth: string;
  weight: string;
  color: string;
  notes: string;
  photo?: File;
}