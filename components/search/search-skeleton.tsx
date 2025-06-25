import { Skeleton } from '@/components/ui/skeleton'

function SearchResultSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-28" />
    </div>
  )
}

interface SearchSkeletonProps {
  pageSize: number
}

export function SearchSkeleton({ pageSize }: SearchSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Results grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pageSize }, (_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  )
} 