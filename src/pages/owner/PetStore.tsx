import { useState, useDeferredValue } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/ProductCard';
import type { ProductCategory } from '@/types/product';

const CATEGORIES: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Food', value: 'food' },
  { label: 'Toys', value: 'toys' },
  { label: 'Grooming', value: 'grooming' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Health', value: 'health' },
];

export const PetStore = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');

  // Defers re-running the (expensive, Atlas-Search-backed) query until typing
  // pauses, without needing a manual debounce timer + useEffect + cleanup.
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading } = useProducts({
    search: deferredSearch || undefined,
    category: category === 'all' ? undefined : category,
  });

  const { data: wishlistData } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const wishlistedIds = new Set(wishlistData?.wishlist.products.map((p) => p._id) ?? []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Pet Store</h1>
      <p className="mt-1 text-ink/60">Everything your pet needs, delivered with love.</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === c.value ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:bg-cream'
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink/50">Loading products...</p>
        ) : data && data.products.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistedIds.has(product._id)}
                isToggling={
                  toggleWishlist.isPending && toggleWishlist.variables?.productId === product._id
                }
                onToggleWishlist={() =>
                  toggleWishlist.mutate({
                    productId: product._id,
                    isWishlisted: wishlistedIds.has(product._id),
                    product,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center text-ink/50">
            <p className="text-4xl">🔍</p>
            <p className="mt-2">No products found. Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};