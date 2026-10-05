import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adoptionListingApi } from '@/api/adoptionListing.api';
import type { AdoptionListingFormValues } from '@/types/adoption';

export const MY_LISTINGS_QUERY_KEY = ['my-listings'] as const;
export const LISTING_QUERY_KEY = (id: string) => ['listing', id] as const;

export const useMyListings = () => {
  return useQuery({
    queryKey: MY_LISTINGS_QUERY_KEY,
    queryFn: adoptionListingApi.getMine,
  });
};


export const useListing = (id: string) => {
  return useQuery({
    queryKey: LISTING_QUERY_KEY(id),
    queryFn: () => adoptionListingApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: AdoptionListingFormValues) => adoptionListingApi.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY }),
  });
};

export const useUpdateListing = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<AdoptionListingFormValues>) => adoptionListingApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEY(id) });
    },
  });
};

export const useRemoveListingPhoto = (listingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => adoptionListingApi.removePhoto(listingId, photoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEY(listingId) }),
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adoptionListingApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY }),
  });
};