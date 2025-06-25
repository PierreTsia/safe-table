'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SearchBar } from '@/components/ui/search-bar'
import { SearchResults } from '@/components/search-results'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), { ssr: false })
import { use, useEffect, useState } from 'react'
import { Map, List } from 'lucide-react'

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
          <SearchResults initialQuery={query} />
        </TabsContent>

        <TabsContent value="map" className="mt-0">
          <MapView initialQuery={query} />
     
        </TabsContent>
      </Tabs>
    </div>
  )
} 