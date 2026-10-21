import { Skeleton } from './Skeleton';

const IMAGE_ASPECTS = {
  square: 'aspect-square',
  standard: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
} as const;

interface CardGridSkeletonProps {
  count?: number;
  imageAspect?: keyof typeof IMAGE_ASPECTS;
  // Pass the same grid classes the real grid uses, so nothing shifts when data arrives
  className?: string;
}

export const CardGridSkeleton = ({
  count = 6,
  imageAspect = 'square',
  className = 'grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
}: CardGridSkeletonProps) => (
  <div role="status" aria-busy="true" className={`grid ${className}`}>
    <span className="sr-only">Loading</span>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="overflow-hidden rounded-4xl bg-white">
        <Skeleton className={`w-full rounded-none ${IMAGE_ASPECTS[imageAspect]}`} />
        <div className="space-y-3 p-5">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);