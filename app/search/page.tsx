import { Suspense } from 'react'
import { SearchBar } from '@/components/ui/search-bar'
import { searchInspections } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface SearchPageProps {
  searchParams: { q?: string }
}

async function SearchResults({ query }: { query: string }) {
  const results = await searchInspections(query)

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          Aucun résultat trouvé pour &quot;{query}&quot;
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((inspection) => (
        <div 
          key={inspection.id} 
          className="border rounded-lg p-4 hover:border-primary transition-colors"
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
  )
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

      <Suspense fallback={
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            Recherche en cours...
          </p>
        </div>
      }>
        <SearchResults query={query} />
      </Suspense>
    </main>
  )
} 