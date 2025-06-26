'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SearchBar } from '@/components/ui/search-bar'
import { SearchResults } from '@/components/search-results'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), { ssr: false })
import { use, useEffect, useState, useCallback } from 'react'
import { Map, List } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { searchInspections } from '@/lib/supabase'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; view?: string }>
}

export interface InspectionResult {
  id: number;
  latitude: number;
  longitude: number;
  evaluationCode: number;
  businessName: string;
  businessType: string;
  address: string;
  city: string;
  postalCode: string;
  evaluation?: string;
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

  // --- Map state ---
  // Parse map center and radius from URL (or fallback to Paris)
  const urlLat = searchParamsClient.get('lat')
  const urlLng = searchParamsClient.get('lng')
  const urlRadius = searchParamsClient.get('radius')
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    urlLat ? parseFloat(urlLat) : 48.8566,
    urlLng ? parseFloat(urlLng) : 2.3522,
  ])
  const [mapRadius, setMapRadius] = useState<number>(urlRadius ? parseFloat(urlRadius) : 5)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [truncationWarning, setTruncationWarning] = useState(false)
 // keep for prop, but not used

  // Geolocation for recenter
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  // Keep map state in sync with URL
  useEffect(() => {
    const urlLat = searchParamsClient.get('lat')
    const urlLng = searchParamsClient.get('lng')
    const urlRadius = searchParamsClient.get('radius')
    if (urlLat && urlLng) {
      setMapCenter([parseFloat(urlLat), parseFloat(urlLng)])
    }
    if (urlRadius) {
      setMapRadius(parseFloat(urlRadius))
    }
  }, [searchParamsClient])

  // --- Map event handlers ---
  const updateMapUrl = useCallback((center: [number, number], radius: number) => {
    const newSearchParams = new URLSearchParams(searchParamsClient)
    newSearchParams.set('lat', center[0].toFixed(6))
    newSearchParams.set('lng', center[1].toFixed(6))
    newSearchParams.set('radius', radius.toString())
    router.push(`/search?${newSearchParams.toString()}`)
  }, [router, searchParamsClient])

  const handleRadiusChange = (radius: number) => {
    setMapRadius(radius)
    updateMapUrl(mapCenter, radius)
  }

  const handleSearchAtCenter = (center: [number, number], radius: number) => {
    setMapCenter(center)
    setMapRadius(radius)
    updateMapUrl(center, radius)
  }

  const handleMoveEnd = (center: [number, number]) => {
    setMapCenter(center)
    updateMapUrl(center, mapRadius)
  }

  const handleRecenter = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng])
      updateMapUrl([userLocation.lat, userLocation.lng], mapRadius)
    }
  }

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

  // Map fetch (spatial, capped)
  function useMapResults(query: string, center: [number, number] | null, radius: number | null, limit: number = 500) {
    return useQuery({
      queryKey: ['map-search', query, center?.[0], center?.[1], radius, limit],
      queryFn: () =>
        center && radius
          ? searchInspections(query, 1, limit, 'inspectionDate', 'desc', undefined, { lat: center[0], lng: center[1], radius })
          : Promise.resolve({ data: [], count: 0 }),
      enabled: !!query && !!center && !!radius && activeTab === 'map',
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
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

  // Map results fetch
  const { data: mapData, isFetching: isMapFetching } = useMapResults(
    query || '',
    activeTab === 'map' ? mapCenter : null,
    activeTab === 'map' ? mapRadius : null,
    500
  )



  useEffect(() => {

    if (mapData?.count && mapData.count === 500) {
      setTruncationWarning(true)
    } else {
      setTruncationWarning(false)
    }
   
  }, [mapData, truncationWarning, setTruncationWarning])

  const loading = isLoading || isPending;
  const results = data?.data || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / pageSize)
  const mapResults = (mapData?.data || []).filter(
    (r) => typeof r.latitude === 'number' && typeof r.longitude === 'number'
  ) as InspectionResult[];



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
    if (
      value === 'map' &&
      !newSearchParams.get('lat') &&
      !newSearchParams.get('lng') &&
      results.length > 0 &&
      typeof results[0].latitude === 'number' &&
      typeof results[0].longitude === 'number'
    ) {
      newSearchParams.set('lat', results[0].latitude.toFixed(6));
      newSearchParams.set('lng', results[0].longitude.toFixed(6));
      newSearchParams.set('radius', '2'); // or whatever default you want
    }
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
          <MapView
            results={mapResults}
            center={mapCenter}
            radius={mapRadius}
            loading={isMapFetching}
            truncationWarning={truncationWarning}
            onRadiusChange={handleRadiusChange}
            onSearchAtCenter={handleSearchAtCenter}
            onMoveEnd={handleMoveEnd}
            onRecenter={handleRecenter}
            userLocation={userLocation}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 