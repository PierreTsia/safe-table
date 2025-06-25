'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchInspections } from '@/lib/supabase'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ChevronUpIcon, ChevronDownIcon, ChevronDownIcon as DropdownIcon } from 'lucide-react'

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

function LoadingGrid({ pageSize }: { pageSize: number }) {
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

function PageSizeSelector({ 
  currentPageSize, 
  onPageSizeChange 
}: { 
  currentPageSize: number
  onPageSizeChange: (size: number) => void 
}) {
  const pageSizeOptions = [10, 20, 50]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
        >
          {currentPageSize} / page
          <DropdownIcon className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {pageSizeOptions.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => onPageSizeChange(size)}
            className="cursor-pointer"
          >
            {size} / page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SortSelector({
  currentSort,
  currentOrder,
  onSortChange
}: {
  currentSort: 'inspectionDate' | 'businessName' | 'evaluationCode'
  currentOrder: 'asc' | 'desc'
  onSortChange: (sort: 'inspectionDate' | 'businessName' | 'evaluationCode', order: 'asc' | 'desc') => void
}) {
  const sortOptions = [
    { value: 'inspectionDate', label: 'Date', desc: 'Plus récent d\'abord', asc: 'Plus ancien d\'abord' },
    { value: 'businessName', label: 'Nom', desc: 'Z → A', asc: 'A → Z' },
    { value: 'evaluationCode', label: 'Évaluation', desc: 'Pire → Meilleur', asc: 'Meilleur → Pire' }
  ] as const

  const currentOption = sortOptions.find(opt => opt.value === currentSort)
  const currentLabel = currentOrder === 'desc' ? currentOption?.desc : currentOption?.asc

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
        >
          {currentLabel}
          {currentOrder === 'desc' ? (
            <ChevronDownIcon className="ml-1 h-3 w-3" />
          ) : (
            <ChevronUpIcon className="ml-1 h-3 w-3" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {sortOptions.map((option) => (
          <div key={option.value}>
            <DropdownMenuItem
              onClick={() => onSortChange(option.value, 'desc')}
              className="cursor-pointer"
            >
              {option.desc}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange(option.value, 'asc')}
              className="cursor-pointer"
            >
              {option.asc}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
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

  if (loading) {
    return <LoadingGrid pageSize={pageSize} />
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
      {/* Results count, page size, and sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {totalCount} résultat{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Afficher:</span>
            <PageSizeSelector 
              currentPageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trier par:</span>
            <SortSelector
              currentSort={sortBy}
              currentOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((inspection) => (
          <div 
            key={inspection.id} 
            className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
          >
            <p className="font-medium">{inspection.businessName}</p>
            <p className="text-sm text-muted-foreground">{inspection.city}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${
                inspection.evaluationCode === 4 ? 'bg-red-500' :
                inspection.evaluationCode === 3 ? 'bg-orange-500' :
                inspection.evaluationCode === 2 ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <span className="text-sm">
                {inspection.evaluationCode === 4 ? 'À corriger de manière urgente' :
                 inspection.evaluationCode === 3 ? 'À améliorer' :
                 inspection.evaluationCode === 2 ? 'Satisfaisant' :
                 'Très satisfaisant'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Inspecté le {new Date(inspection.inspectionDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(pageNum)
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage + 1)
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
} 