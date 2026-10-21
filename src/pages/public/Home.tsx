import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAdoptionBrowse } from '@/hooks/useAdoptionBrowse';
import { useBlogPosts } from '@/hooks/useBlog';
import { useProducts } from '@/hooks/useProducts';
import { useSuccessStories } from '@/hooks/useSuccessStories';
import { useContactInfo } from '@/hooks/useContactInfo';
import { AsyncSection } from '@/components/AsyncSection';
import { EmptyState } from '@/components/EmptyState';
import { CardGridSkeleton } from '@/components/skeletons/CardGridSkeleton';
import { Skeleton } from '@/components/skeletons/Skeleton';

interface HomeSectionProps {
  title: string;
  linkTo: string;
  linkLabel: string;
  showLink: boolean;
  children: ReactNode;
}

const HomeSection = ({ title, linkTo, linkLabel, showLink, children }: HomeSectionProps) => (
  <section className="mx-auto mt-16 max-w-6xl">
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      {/* No point linking to an empty page */}
      {showLink && (
        <Link to={linkTo} className="text-sm font-semibold text-coral hover:text-coral-dark">
          {linkLabel} →
        </Link>
      )}
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

export const Home = () => {
  const adoptionsQuery = useAdoptionBrowse({});
  const postsQuery = useBlogPosts({});
  const productsQuery = useProducts({});
  const storiesQuery = useSuccessStories();
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();

  const listings = adoptionsQuery.data?.listings ?? [];
  const posts = postsQuery.data?.posts ?? [];
  const products = productsQuery.data?.products ?? [];
  const stories = storiesQuery.data?.stories ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-10 text-center">
        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Everything your pet needs, all in one place
        </h1>
        <p className="mt-4 text-lg text-ink/60">
          Track health records, book vet visits, shop for your pet, and find your next best friend, all with
          PawfectCare.
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

      {/* Adoptable pets */}
      <HomeSection
        title="Pets looking for a home"
        linkTo="/adopt"
        linkLabel="View all"
        showLink={listings.length > 0}
      >
        <AsyncSection
          isLoading={adoptionsQuery.isLoading}
          isError={adoptionsQuery.isError}
          isEmpty={listings.length === 0}
          onRetry={() => adoptionsQuery.refetch()}
          errorMessage="We couldn't load the adoptable pets right now."
          skeleton={<CardGridSkeleton count={4} className="grid-cols-2 gap-5 sm:grid-cols-4" />}
          empty={
            <EmptyState
              variant="card"
              emoji="🏡"
              title="No pets are looking for a home right now"
              message="There aren't any adoptable pets listed at the moment. New listings appear as shelters add them, so check back soon."
            />
          }
        >
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {listings.slice(0, 4).map((listing) => (
              <Link
                key={listing._id}
                to={`/adopt/${listing._id}`}
                className="group overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral"
              >
                <div className="aspect-square w-full overflow-hidden bg-peach">
                  {listing.photos[0]?.url ? (
                    <img
                      src={listing.photos[0].url}
                      alt={listing.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
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
        </AsyncSection>
      </HomeSection>

      {/* Blog */}
      <HomeSection title="Tips from our vets" linkTo="/blog" linkLabel="View all" showLink={posts.length > 0}>
        <AsyncSection
          isLoading={postsQuery.isLoading}
          isError={postsQuery.isError}
          isEmpty={posts.length === 0}
          onRetry={() => postsQuery.refetch()}
          errorMessage="We couldn't load the latest articles right now."
          skeleton={<CardGridSkeleton count={3} imageAspect="wide" className="grid-cols-1 gap-5 sm:grid-cols-3" />}
          empty={
            <EmptyState
              variant="card"
              emoji="📝"
              title="No articles yet"
              message="Tips and advice from our vets and shelter partners will show up here once they're published."
            />
          }
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="group overflow-hidden rounded-4xl bg-white transition-shadow hover:shadow-coral"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-peach">
                  {post.coverImage?.url ? (
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
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
        </AsyncSection>
      </HomeSection>

      {/* Store */}
      <HomeSection title="Shop for your pet" linkTo="/store" linkLabel="Visit store" showLink={products.length > 0}>
        <AsyncSection
          isLoading={productsQuery.isLoading}
          isError={productsQuery.isError}
          isEmpty={products.length === 0}
          onRetry={() => productsQuery.refetch()}
          errorMessage="We couldn't load the store right now."
          skeleton={<CardGridSkeleton count={4} className="grid-cols-2 gap-5 sm:grid-cols-4" />}
          empty={
            <EmptyState
              variant="card"
              emoji="🛍️"
              title="The store is empty for now"
              message="Products for your pets will appear here once they're added."
            />
          }
        >
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {products.slice(0, 4).map((product) => (
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
        </AsyncSection>
      </HomeSection>

      {/* Success stories */}
      <HomeSection
        title="Happy endings"
        linkTo="/success-stories"
        linkLabel="View all"
        showLink={stories.length > 0}
      >
        <AsyncSection
          isLoading={storiesQuery.isLoading}
          isError={storiesQuery.isError}
          isEmpty={stories.length === 0}
          onRetry={() => storiesQuery.refetch()}
          errorMessage="We couldn't load the success stories right now."
          skeleton={<CardGridSkeleton count={3} imageAspect="standard" className="grid-cols-1 gap-5 sm:grid-cols-3" />}
          empty={
            <EmptyState
              variant="card"
              emoji="🎉"
              title="No success stories yet"
              message="Stories from pets who found their forever homes will be shared here."
            />
          }
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stories.slice(0, 3).map((story) => (
              <div key={story._id} className="overflow-hidden rounded-4xl bg-white">
                <div className="aspect-[4/3] w-full overflow-hidden bg-peach">
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
        </AsyncSection>
      </HomeSection>

      {/* Shelter contact info */}
      <section className="mx-auto mt-16 max-w-3xl rounded-4xl bg-white p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Visit or reach out</h2>

        {contactLoading ? (
          <div role="status" aria-busy="true" className="mx-auto mt-4 flex flex-col items-center gap-2">
            <span className="sr-only">Loading contact details</span>
            <Skeleton className="h-4 w-64 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
        ) : contactInfo?.info ? (
          <>
            <p className="mt-2 text-ink/60">{contactInfo.info.address}</p>
            <p className="mt-1 text-ink/60">{contactInfo.info.hours}</p>
            <p className="mt-1 text-ink/60">
              {contactInfo.info.phone} · {contactInfo.info.email}
            </p>
          </>
        ) : (
          <p className="mt-2 text-ink/60">Questions? Send us a message and we'll get back to you.</p>
        )}

        <Link to="/contact" className="btn-primary mt-5 inline-block">
          Contact us
        </Link>
      </section>
    </div>
  );
};