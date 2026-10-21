import { Skeleton } from './Skeleton';

export const DetailSkeleton = () => (
  <div role="status" aria-busy="true" className="max-w-3xl">
    <span className="sr-only">Loading</span>
    <Skeleton className="h-4 w-32" />
    <div className="mt-6 flex items-start gap-6">
      <Skeleton className="h-28 w-28 shrink-0 rounded-4xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </div>
    </div>
    <div className="mt-10 space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);