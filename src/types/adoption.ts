import type { PaginationMeta } from ".";

export type AdoptionStatus = 'available' | 'pending' | 'adopted';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface AdoptionPhoto {
  url: string;
  publicId: string;
  _id?: string;
}

export interface AdoptionListing {
  _id: string;
  shelter: { _id: string; name: string; email: string; phone?: string };
  name: string;
  species: string;
  breed?: string;
  age?: string;
  gender: 'male' | 'female' | 'unknown';
  description?: string;
  temperament?: string;
  photos: AdoptionPhoto[];
  status: AdoptionStatus;
  createdAt: string;
}

export interface AdoptionListingsResponse {
  success: boolean;
  count: number;
  pagination: PaginationMeta;
  listings: AdoptionListing[];
}

export interface AdoptionListingResponse {
  success: boolean;
  listing: AdoptionListing;
}

export interface AdoptionListingFormValues {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: 'male' | 'female' | 'unknown';
  description: string;
  temperament: string;
  photos: File[];
}

export interface AdoptionRequest {
  _id: string;
  listing: { _id: string; name: string; species: string; photos: AdoptionPhoto[]; status: AdoptionStatus };
  applicant: { _id: string; name: string; email: string; phone?: string };
  message?: string;
  status: RequestStatus;
  reviewNote?: string;
  createdAt: string;
}

export interface AdoptionRequestsResponse {
  success: boolean;
  count: number;
  requests: AdoptionRequest[];
}