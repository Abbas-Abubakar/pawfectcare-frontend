import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adoptionRequestApi } from '@/api/adoptionRequest.api';
import { MY_LISTINGS_QUERY_KEY } from './useAdoptionListings';

export const LISTING_REQUESTS_QUERY_KEY = (listingId: string) => ['listing-requests', listingId] as const;

export const useListingRequests = (listingId: string) => {
  return useQuery({
    queryKey: LISTING_REQUESTS_QUERY_KEY(listingId),
    queryFn: () => adoptionRequestApi.getForListing(listingId),
    enabled: !!listingId,
  });
};

export const useApproveRequest = (listingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, reviewNote }: { requestId: string; reviewNote?: string }) =>
      adoptionRequestApi.approve(requestId, reviewNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTING_REQUESTS_QUERY_KEY(listingId) });
      // Approving changes the listing's status to 'adopted', so the listings list is stale too
      queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
    },
  });
};

export const useRejectRequest = (listingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, reviewNote }: { requestId: string; reviewNote?: string }) =>
      adoptionRequestApi.reject(requestId, reviewNote),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LISTING_REQUESTS_QUERY_KEY(listingId) }),
  });
};