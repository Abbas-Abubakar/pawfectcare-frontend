import type { PaginationMeta } from ".";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// These fields are already the same type on Pet as we want in the form —
// Required<> because a controlled <input> needs a defined string, even if
// the underlying field is optional on the saved Pet (empty string = "unset").
type PetBaseFormFields = Required<Pick<Pet, 'name' | 'species' | 'breed' | 'color' | 'notes' | 'dateOfBirth'>>;

export interface PetFormValues extends PetBaseFormFields {
  gender: PetGender;
  weight: string;
  photo?: File;   
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
