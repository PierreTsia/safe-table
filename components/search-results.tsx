'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchInspections } from '@/lib/supabase'
import { InspectionCard } from '@/components/search/inspection-card'
import { SearchControls } from '@/components/search/search-controls'
import { SearchPagination } from '@/components/search/search-pagination'
import { SearchSkeleton } from '@/components/search/search-skeleton'

interface Inspection {
  id: number
  businessName: string
  city: string
  evaluationCode: number
  inspectionDate: string
}

interface SearchResultsProps {
  initialQuery: string
}

export function SearchResults({ initialQuery }: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [results, setResults] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('size') || '12', 10)
  const sortBy = (searchParams.get('sort') as 'inspectionDate' | 'businessName' | 'evaluationCode') || 'inspectionDate'
  const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'desc'
  
  const totalPages = Math.ceil(totalCount / pageSize)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, count } = await searchInspections(initialQuery, currentPage, pageSize, sortBy, sortOrder)
        setResults(data)
        setTotalCount(count)
      } catch (err) {
        setError('Erreur lors de la recherche')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (initialQuery) {
      fetchResults()
    }
  }, [initialQuery, currentPage, pageSize, sortBy, sortOrder])

  const updateUrl = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value)
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

  const handleInspectionClick = (inspection: Inspection) => {
    // TODO: Navigate to individual inspection page
    console.log('Clicked inspection:', inspection)
  }

  if (loading) {
    return <SearchSkeleton pageSize={pageSize} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          Aucun résultat trouvé pour &quot;{initialQuery}&quot;
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
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
      />

      {/* Results grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((inspection) => (
          <InspectionCard
            key={inspection.id}
            inspection={inspection}
            onClick={() => handleInspectionClick(inspection)}
          />
        ))}
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