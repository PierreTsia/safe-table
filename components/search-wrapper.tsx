'use client'

import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui/search-bar'

export function SearchWrapper() {
  const router = useRouter()

  const handleSearch = (query: string) => {
    if (!query.trim()) return
    
    // Create a URL-safe query string
    const searchParams = new URLSearchParams({
      q: query.trim()
    })
    
    // Navigate to the search page with the query
    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <SearchBar 
      onSearch={handleSearch}
      className="w-full"
    />
  )
} 