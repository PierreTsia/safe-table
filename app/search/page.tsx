'use client'

import { SearchBar } from '@/components/ui/search-bar'
import { SearchResults } from '@/components/search-results'
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const params = use(searchParams)
  const query = params.q?.trim()

  // Handle empty search
  if (!query) {
    notFound()
  }

  return (
    <main className="container mx-auto p-8">
      <div className="mb-8">
        {/* Back button and breadcrumb navigation */}
        <div className="flex items-center gap-4 mb-6">
    
            
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Home className="w-4 h-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recherche</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <SearchBar className="mb-4" />
        <h1 className="text-2xl font-bold">
          Résultats pour &quot;{query}&quot;
        </h1>
      </div>

      <SearchResults initialQuery={query} />
    </main>
  )
} 