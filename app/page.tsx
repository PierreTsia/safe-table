import { getInspectionsByEvaluationCode } from '@/lib/supabase'
import { SearchWrapper } from '@/components/search-wrapper'

export default async function Home() {
  try {
    // Try to fetch 15 high-risk inspections (evaluationCode 4)
    const inspections = await getInspectionsByEvaluationCode(4)
    
    return (
      <main className="container mx-auto p-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-4xl font-bold">SafeTable</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explorez les données d&apos;inspection sanitaire des établissements alimentaires en France
          </p>
          
          <SearchWrapper />
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Dernières inspections à risque élevé</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inspections.slice(0, 15).map((inspection) => (
              <div 
                key={inspection.id} 
                className="border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <p className="font-medium">{inspection.businessName}</p>
                <p className="text-sm text-muted-foreground">{inspection.city}</p>
                <p className="text-sm text-red-600 mt-2">
                  Inspecté le {new Date(inspection.inspectionDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  } catch (error) {
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">SafeTable - Erreur de connexion</h1>
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">État de la connexion: ❌ Erreur</h2>
          <p>Impossible de se connecter à la base de données ou de récupérer les données.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Erreur inconnue'}</p>
        </div>
      </main>
    )
  }
}
