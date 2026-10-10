import { useState, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { PageLoader } from '@/components/PageLoader';

export const PublicStore = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const { data, isLoading } = useProducts({ search: deferredSearch || undefined });
  const products = data?.products ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-ink">Pet Store</h1>
      <p className="mt-1 text-ink/60">
        <Link to="/auth/register" className="font-semibold text-coral">Sign up</Link> to save items to your wishlist.
      </p>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mt-6 max-w-xs"
      />

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <PageLoader/>
        ) : (
          products.map((product) => (
            <div key={product._id} className="overflow-hidden rounded-4xl bg-white">
              <div className="aspect-square w-full overflow-hidden bg-peach">
                {product.image?.url ? (
                  <img src={product.image.url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">🛍️</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-coral">{product.category}</p>
                <h3 className="mt-1 font-semibold text-ink">{product.name}</h3>
                <p className="mt-1 font-display font-bold text-ink">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};