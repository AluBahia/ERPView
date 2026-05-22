import { Skeleton } from './Skeleton';

interface LoadingSkeletonProps {
  kpiCount?: number;
  chartCount?: number;
  tableRows?: number;
}

export function LoadingSkeleton({
  kpiCount = 4,
  chartCount = 4,
  tableRows = 5,
}: LoadingSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: kpiCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-bg-secondary p-4 flex flex-col gap-3"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Charts grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: chartCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-bg-secondary p-4"
          >
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-bg-secondary p-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: tableRows }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
