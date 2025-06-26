'use client'

import { useQueryClient } from '@tanstack/react-query'
import { searchInspections, InspectionDisplay } from '@/lib/supabase'
import { InspectionCard } from '@/components/search/inspection-card'
import { SearchControls } from '@/components/search/search-controls'
import { SearchPagination } from '@/components/search/search-pagination'
import { SearchSkeleton } from '@/components/search/search-skeleton'

interface SearchResultsProps {
  results: InspectionDisplay[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  isFetching: boolean;
  error: unknown;
  initialQuery: string;
  sortBy: 'inspectionDate' | 'businessName' | 'evaluationCode';
  sortOrder: 'asc' | 'desc';
  businessType?: string;
  onPageSizeChange: (newPageSize: number) => void;
  onSortChange: (sortBy: 'inspectionDate' | 'businessName' | 'evaluationCode', sortOrder: 'asc' | 'desc') => void;
  onBusinessTypeChange: (businessType: string | undefined) => void;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  results,
  totalCount,
  pageSize,
  currentPage,
  totalPages,
  loading,
  isFetching,
  error,
  initialQuery,
  sortBy,
  sortOrder,
  businessType,
  onPageSizeChange,
  onSortChange,
  onBusinessTypeChange,
  onPageChange,
}: SearchResultsProps) {
  const queryClient = useQueryClient()

  const handleInspectionClick = (inspection: InspectionDisplay) => {
    // TODO: Navigate to individual inspection page
    console.log('Clicked inspection:', inspection)
  }

  // Prefetch adjacent pages for faster navigation
  const prefetchAdjacentPages = () => {
    const adjacentPages = [currentPage + 1, currentPage - 1].filter(
      page => page > 0 && page <= totalPages
    )
    
    adjacentPages.forEach(page => {
      queryClient.prefetchQuery({
        queryKey: ['search', initialQuery, page, pageSize, sortBy, sortOrder, businessType],
        queryFn: () => searchInspections(initialQuery, page, pageSize, sortBy, sortOrder, businessType),
        staleTime: 5 * 60 * 1000,
      })
    })
  }

  // Prefetch when results are loaded and not currently fetching
  if (results.length > 0 && !isFetching) {
    setTimeout(prefetchAdjacentPages, 100) // Small delay to avoid blocking
  }

  if (loading) {
    return <SearchSkeleton pageSize={pageSize} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-500">
          Erreur lors de la recherche: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          Aucun résultat trouvé pour &quot;{initialQuery}&quot;
          {businessType && (
            <span className="block text-sm mt-2">
              dans la catégorie &quot;{businessType}&quot;
            </span>
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search controls */}
      <SearchControls
        totalCount={totalCount}
        pageSize={pageSize}
        sortBy={sortBy}
        sortOrder={sortOrder}
        businessType={businessType}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
        onBusinessTypeChange={onBusinessTypeChange}
      />

      {/* Results grid with loading indicator */}
      <div className="relative">
        {isFetching && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-1 shadow-lg">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Mise à jour...</span>
            </div>
          </div>
        )}
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${
          isFetching ? 'opacity-75' : 'opacity-100'
        }`}>
          {results.map((inspection) => (
            <InspectionCard
              key={inspection.id}
              inspection={inspection}
              onClick={() => handleInspectionClick(inspection)}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <SearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
} 