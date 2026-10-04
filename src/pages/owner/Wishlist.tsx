import { Link } from 'react-router-dom';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/ProductCard';

export const WishlistPage = () => {
  const { data, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const products = data?.wishlist.products ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">My Wishlist</h1>
      <p className="mt-1 text-ink/60">Things you've saved for later.</p>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isToggling={
                  toggleWishlist.isPending && toggleWishlist.variables?.productId === product._id
                }
                isWishlisted={true}
                onToggleWishlist={() =>
                  toggleWishlist.mutate({ productId: product._id, isWishlisted: true, product })
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">🤍</p>
            <h2 className="font-display text-2xl font-bold text-ink">Your wishlist is empty</h2>
            <p className="text-ink/60">Tap the heart on anything you'd like to save.</p>
            <Link to="/owner/store" className="btn-primary mt-2">
              Browse the store
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};