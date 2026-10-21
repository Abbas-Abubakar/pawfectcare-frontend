import { Skeleton } from './Skeleton';

export const DashboardSkeleton = () => (
  <div role="status" aria-busy="true" className="flex min-h-screen bg-cream">
    <span className="sr-only">Loading</span>

    {/* Mobile topbar */}
    <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-3 bg-white px-4 lg:hidden">
      <Skeleton className="h-10 w-10 shrink-0" />
      <Skeleton className="h-10 flex-1" />
    </div>

    {/* Desktop sidebar */}
    <aside className="hidden h-screen w-64 shrink-0 flex-col bg-white px-4 py-6 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="mt-10 space-y-2">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    </aside>

    <main className="w-full min-w-0 flex-1 px-4 py-6 pt-20 lg:px-8 lg:py-8 lg:pt-8">
      <Skeleton className="mb-6 hidden h-12 max-w-sm lg:block" />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-64 rounded-4xl" />
        ))}
      </div>
    </main>
  </div>
);