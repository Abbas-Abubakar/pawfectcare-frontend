import { Skeleton } from './Skeleton';

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div role="status" aria-busy="true" className="space-y-4">
    <span className="sr-only">Loading</span>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="rounded-3xl border-2 border-ink/5 bg-white p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-3 w-3/4" />
      </div>
    ))}
  </div>
);