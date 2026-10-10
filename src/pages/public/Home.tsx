import { Link } from 'react-router-dom';
import { useAdoptionBrowse } from '@/hooks/useAdoptionBrowse';
import { useBlogPosts } from '@/hooks/useBlog';
import { useProducts } from '@/hooks/useProducts';
import { useSuccessStories } from '@/hooks/useSuccessStories';
import { useContactInfo } from '@/hooks/useContactInfo';

export const Home = () => {
  const { data: adoptions } = useAdoptionBrowse({});
  const { data: posts } = useBlogPosts({});
  const { data: products } = useProducts({});
  const { data: stories } = useSuccessStories();
  const { data: contactInfo } = useContactInfo();
  const from = {from: "home"}

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-10 text-center">
        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Everything your pet needs, all in one place
        </h1>
        <p className="mt-4 text-lg text-ink/60">
          Track health records, book vet visits, shop for your pet, and find your next best friend — all with PawfectCare.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/auth/register" className="btn-primary">
            Get started
          </Link>
          <Link to="/auth/login" className="btn-secondary">
            Log in
          </Link>
        </div>
      </section>

      {/* Adoptable pets preview */}
      <section className="mx-auto mt-20 max-w-6xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Pets looking for a home</h2>
          <Link to="/adopt" className="text-sm font-semibold text-coral hover:text-coral-dark">
            View all →
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {(adoptions?.listings ?? []).slice(0, 4).map((listing) => (
            <Link
              key={listing._id}
              to={`/adopt/${listing._id}`}
              state={from}
              className="group overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral"
            >
              <div className="aspect-square w-full overflow-hidden bg-peach">
                {listing.photos[0]?.url ? (
                  <img src={listing.photos[0].url} alt={listing.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">🐾</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-ink">{listing.name}</p>
                <p className="text-xs text-ink/50">{listing.breed || listing.species}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog preview */}
      <section className="mx-auto mt-16 max-w-6xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Tips from our vets</h2>
          <Link to="/blog" className="text-sm font-semibold text-coral hover:text-coral-dark">
            View all →
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {(posts?.posts ?? []).slice(0, 3).map((post) => (
            <Link key={post._id} to={`/blog/${post._id}`} state={from} className="group overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral">
              <div className="aspect-\[16\/10] w-full overflow-hidden bg-peach">
                {post.coverImage?.url ? (
                  <img src={post.coverImage.url} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">📝</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-coral">{post.category}</p>
                <h3 className="mt-1 font-semibold text-ink">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Store preview */}
      <section className="mx-auto mt-16 max-w-6xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Shop for your pet</h2>
          <Link to="/store" className="text-sm font-semibold text-coral hover:text-coral-dark">
            Visit store →
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {(products?.products ?? []).slice(0, 4).map((product) => (
            <div key={product._id} className="overflow-hidden rounded-4xl bg-white">
              <div className="aspect-square w-full overflow-hidden bg-peach">
                {product.image?.url ? (
                  <img src={product.image.url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">🛍️</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-ink">{product.name}</p>
                <p className="text-sm text-ink/60">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success stories preview */}
      {(stories?.stories.length ?? 0) > 0 && (
        <section className="mx-auto mt-16 max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Happy endings</h2>
            <Link to="/success-stories" state={from}className="text-sm font-semibold text-coral hover:text-coral-dark">
              View all →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stories!.stories.slice(0, 3).map((story) => (
              <div key={story._id} className="overflow-hidden rounded-4xl bg-white">
                <div className="aspect-\[4\/3] w-full overflow-hidden bg-peach">
                  {story.photos[0]?.url ? (
                    <img src={story.photos[0].url} alt={story.petName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">🎉</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-coral">{story.petName}</p>
                  <h3 className="mt-1 font-semibold text-ink">{story.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shelter contact info */}
      {contactInfo?.info && (
        <section className="mx-auto mt-16 max-w-3xl rounded-4xl bg-white p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">Visit or reach out</h2>
          <p className="mt-2 text-ink/60">{contactInfo.info.address}</p>
          <p className="mt-1 text-ink/60">{contactInfo.info.hours}</p>
          <p className="mt-1 text-ink/60">
            {contactInfo.info.phone} · {contactInfo.info.email}
          </p>
          <Link to="/contact" className="btn-primary mt-5 inline-block">
            Contact us
          </Link>
        </section>
      )}
    </div>
  );
};