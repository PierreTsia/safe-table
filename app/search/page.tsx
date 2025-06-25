import { SearchBar } from '@/components/ui/search-bar'
import { SearchResults } from '@/components/search-results'
import { notFound } from 'next/navigation'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim()

  // Handle empty search
  if (!query) {
    notFound()
  }

  return (
    <main className="container mx-auto p-8">
      <div className="mb-8">
        <SearchBar className="mb-4" />
        <h1 className="text-2xl font-bold">
          Résultats pour &quot;{query}&quot;
        </h1>
      </div>

      <SearchResults initialQuery={query} />
    </main>
  )
} 