import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/api/product.api';
import type { Product, WishlistResponse } from '@/types/product';

export const WISHLIST_QUERY_KEY = ['wishlist'] as const;

export const useWishlist = () => {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: wishlistApi.get,
  });
};

/**
 * Toggles a product in/out of the wishlist with an optimistic UI update.
 * Takes the product's current "is it wishlisted" state so it knows whether
 * to call add or remove.
 */
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean; product: Product }) =>
      isWishlisted ? wishlistApi.remove(productId) : wishlistApi.add(productId),

    // Runs immediately, before the network request resolves
    onMutate: async ({ productId, isWishlisted, product }) => {
      // Cancel any in-flight wishlist refetch so it doesn't overwrite our
      // optimistic change with stale data arriving after it
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });

      // Snapshot the current cache so we can roll back if the request fails
      const previousWishlist = queryClient.getQueryData<WishlistResponse>(WISHLIST_QUERY_KEY);

      // Apply the optimistic change directly to the cache
      queryClient.setQueryData<WishlistResponse>(WISHLIST_QUERY_KEY, (old) => {
        if (!old) return old;
        const currentProducts = old.wishlist.products;

        const updatedProducts = isWishlisted
          ? currentProducts.filter((p) => p._id !== productId)
          : [...currentProducts, product];

        return { ...old, wishlist: { ...old.wishlist, products: updatedProducts } };
      });

      return { previousWishlist };
    },

    // If the mutation fails, roll back to the snapshot taken in onMutate
    onError: (_err, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previousWishlist);
      }
    },

    // Whether it succeeded or failed, resync with the server's real state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
};