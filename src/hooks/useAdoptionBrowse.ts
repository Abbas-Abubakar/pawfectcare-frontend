import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adoptionListingApi } from '@/api/adoptionListing.api';
import { adoptionRequestApi } from '@/api/adoptionRequest.api';

export const ADOPTION_BROWSE_QUERY_KEY = ['adoption-browse'] as const;
export const MY_ADOPTION_REQUESTS_QUERY_KEY = ['my-adoption-requests'] as const;

interface BrowseParams {
  species?: string;
  search?: string;
}

export const useAdoptionBrowse = (params: BrowseParams) => {
  return useQuery({
    queryKey: [...ADOPTION_BROWSE_QUERY_KEY, params],
    queryFn: () => adoptionListingApi.getAll(params),
  });
};

export const useMyAdoptionRequests = () => {
  return useQuery({
    queryKey: MY_ADOPTION_REQUESTS_QUERY_KEY,
    queryFn: () => adoptionRequestApi.getMine(),
  });
};

export const useCreateAdoptionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, message }: { listingId: string; message?: string }) =>
      adoptionRequestApi.create(listingId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ADOPTION_REQUESTS_QUERY_KEY });
    },
  });
};

export const useWithdrawAdoptionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => adoptionRequestApi.withdraw(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ADOPTION_REQUESTS_QUERY_KEY });
    },
  });
};