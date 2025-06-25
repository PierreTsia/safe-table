'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { searchInspections, InspectionDisplay } from '@/lib/supabase'
import { InspectionCard } from '@/components/search/inspection-card'
import { SearchControls } from '@/components/search/search-controls'
import { SearchPagination } from '@/components/search/search-pagination'
import { SearchSkeleton } from '@/components/search/search-skeleton'

interface SearchResultsProps {
  initialQuery: string
}

function useSearchResults(query: string, page: number, pageSize: number, sortBy: string, sortOrder: string, businessType?: string) {
  return useQuery({
    queryKey: ['search', query, page, pageSize, sortBy, sortOrder, businessType],
    queryFn: () => searchInspections(query, page, pageSize, sortBy as 'inspectionDate' | 'businessName' | 'evaluationCode', sortOrder as 'asc' | 'desc', businessType),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function SearchResults({ initialQuery }: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('size') || '12', 10)
  const sortBy = (searchParams.get('sort') as 'inspectionDate' | 'businessName' | 'evaluationCode') || 'inspectionDate'
  const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'desc'
  const businessType = searchParams.get('type') || undefined
  
  const { data, isLoading, error, isPending, isFetching } = useSearchResults(
    initialQuery, 
    currentPage, 
    pageSize, 
    sortBy, 
    sortOrder,
    businessType
  )

  const results = data?.data || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  const updateUrl = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })
    router.push(`/search?${newSearchParams.toString()}`)
  }

  const handleSortChange = (newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
    updateUrl({ sort: newSortBy, order: newSortOrder, page: '1' })
  }

  const handlePageChange = (page: number) => {
    updateUrl({ page: page.toString() })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    updateUrl({ size: newPageSize.toString(), page: '1' })
  }

  const handleBusinessTypeChange = (newBusinessType: string | undefined) => {
    updateUrl({ type: newBusinessType || '', page: '1' })
  }

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

  if (isLoading || isPending) {
    return <SearchSkeleton pageSize={pageSize} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-500">
          Erreur lors de la recherche: {error.message}
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
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onBusinessTypeChange={handleBusinessTypeChange}
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
        onPageChange={handlePageChange}
      />
    </div>
  )
} 