import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isToggling: boolean;
  onToggleWishlist: () => void;
}

export const ProductCard = ({ product, isWishlisted, isToggling, onToggleWishlist }: ProductCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-4xl bg-white">
      <button
        type="button"
        onClick={onToggleWishlist}
        disabled={isToggling}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm transition-transform active:scale-90 disabled:opacity-50"
      >
        {isToggling ? '⏳' : isWishlisted ? '❤️' : '🤍'}
      </button>

      <div className="aspect-square w-full overflow-hidden bg-peach">
        {product.image?.url ? (
          <img
            src={product.image.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🛍️</div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-coral">{product.category}</p>
        <h3 className="mt-1 font-semibold text-ink">{product.name}</h3>
        <p className="mt-2 font-display text-lg font-bold text-ink">${product.price.toFixed(2)}</p>
        {product.stock === 0 && <p className="mt-1 text-xs font-medium text-red-500">Out of stock</p>}
      </div>
    </div>
  );
};