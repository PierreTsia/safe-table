'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SearchBar } from '@/components/ui/search-bar'
import { SearchResults } from '@/components/search-results'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), { ssr: false })
import { use, useEffect, useState } from 'react'
import { Map, List } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { searchInspections } from '@/lib/supabase'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; view?: string }>
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const params = use(searchParams)
  const query = params.q?.trim()
  const initialView = params.view || 'text'
  
  const router = useRouter()
  const searchParamsClient = useSearchParams()
  const [activeTab, setActiveTab] = useState(initialView)

  // --- Search state from URL ---
  const currentPage = parseInt(searchParamsClient.get('page') || '1', 10)
  const pageSize = parseInt(searchParamsClient.get('size') || '12', 10)
  const sortBy = (searchParamsClient.get('sort') as 'inspectionDate' | 'businessName' | 'evaluationCode') || 'inspectionDate'
  const sortOrder = (searchParamsClient.get('order') as 'asc' | 'desc') || 'desc'
  const businessType = searchParamsClient.get('type') || undefined

  // --- Fetch results ---
  function useSearchResults(query: string, page: number, pageSize: number, sortBy: string, sortOrder: string, businessType?: string) {
    return useQuery({
      queryKey: ['search', query, page, pageSize, sortBy, sortOrder, businessType],
      queryFn: () => searchInspections(query, page, pageSize, sortBy as 'inspectionDate' | 'businessName' | 'evaluationCode', sortOrder as 'asc' | 'desc', businessType),
      enabled: !!query,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  const { data, isLoading, error, isPending, isFetching } = useSearchResults(
    query || '',
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    businessType
  )

  const loading = isLoading || isPending;
  const results = data?.data || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  // --- Handlers to update URL ---
  const updateUrl = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParamsClient)
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

  // Sync tab state with URL on mount
  useEffect(() => {
    const viewParam = searchParamsClient.get('view') || 'text'
    setActiveTab(viewParam)
  }, [searchParamsClient])

  // Handle empty search - redirect to home
  if (!query) {
    router.replace('/')
    return null
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const newSearchParams = new URLSearchParams(searchParamsClient)
    newSearchParams.set('view', value)
    router.push(`/search?${newSearchParams.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <SearchBar className="mb-4" />
        <h1 className="text-2xl font-bold">
          Résultats pour &quot;{query}&quot;
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Carte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-0">
          <SearchResults
            results={results}
            totalCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            isFetching={isFetching}
            error={error}
            initialQuery={query}
            sortBy={sortBy}
            sortOrder={sortOrder}
            businessType={businessType}
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            onBusinessTypeChange={handleBusinessTypeChange}
            onPageChange={handlePageChange}
          />
        </TabsContent>

        <TabsContent value="map" className="mt-0">
          <MapView initialQuery={query}  />
        </TabsContent>
      </Tabs>
    </div>
  )
} 