import { getInspectionsByEvaluationCode } from '@/lib/supabase'
import { SearchWrapper } from '@/components/search-wrapper'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Shield, Search, TrendingUp } from 'lucide-react'

export default async function Home() {
  try {
    // Try to fetch high-risk inspections for the hero section
    const highRiskInspections = await getInspectionsByEvaluationCode(4)
    
    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-8 py-24">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  <span className="text-primary">Safe</span>Table
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                  Transparence alimentaire en France
                </p>
              </div>

              {/* Value Proposition */}
              <div className="space-y-6 max-w-2xl mx-auto">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Explorez les résultats des contrôles officiels sanitaires du dispositif{' '}
                  <a 
                    href="https://agriculture.gouv.fr/alimconfiance-les-resultats-des-controles-sanitaires-accessibles-tous" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Alim&apos;confiance
                  </a>{' '}
                  du Ministère de l&apos;Agriculture et de l&apos;Alimentation. 
                  Production, transformation et distribution alimentaire en France : 
                  prenez des décisions éclairées pour votre sécurité sanitaire.
                </p>
                
                {/* Search CTA */}
                <div className="pt-4">
                  <SearchWrapper />
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">70k+</div>
                  <div className="text-sm text-muted-foreground">Établissements</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">Mai 2025</div>
                  <div className="text-sm text-muted-foreground">Dernière mise à jour</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">Officiel</div>
                  <div className="text-sm text-muted-foreground">Ministère Agriculture</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">🇫🇷</div>
                  <div className="text-sm text-muted-foreground">France entière</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Qu&apos;est-ce qu&apos;Alim&apos;confiance ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Le dispositif officiel du Ministère de l&apos;Agriculture pour consulter 
                les résultats des contrôles sanitaires des établissements alimentaires
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Contrôles Officiels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Résultats des contrôles sanitaires réalisés par les inspecteurs 
                    de la Direction Départementale de la Protection des Populations (DDPP) 
                    sur les établissements de production, transformation et distribution.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Transparence Totale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Données publiques issues du dispositif Alim&apos;confiance, 
                    disponibles sur{' '}
                    <a 
                      href="https://www.data.gouv.fr/fr/datasets/681dd0ca365bb9cabb5b484a/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      data.gouv.fr
                    </a>{' '}
                    sous licence ouverte.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl">Niveau d&apos;Hygiène</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                     Évaluation claire du niveau d&apos;hygiène avec quatre niveaux{' '}
                     (très satisfaisant, satisfaisant, à améliorer 
                     ou à corriger de manière urgente).
                   </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent High-Risk Inspections */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h2 className="text-3xl font-bold">Inspections Récentes à Risque</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Établissements nécessitant des corrections urgentes
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {highRiskInspections.slice(0, 6).map((inspection) => (
                <Card key={inspection.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{inspection.businessName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{inspection.city}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="destructive" className="font-medium">
                      À corriger de manière urgente
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Inspecté le {new Date(inspection.inspectionDate).toLocaleDateString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    return (
      <main className="container mx-auto p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">SafeTable - Service Temporairement Indisponible</h1>
          <div className="text-red-600 max-w-md mx-auto">
            <p>Nous rencontrons des difficultés techniques. Veuillez réessayer dans quelques instants.</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-sm mt-2 font-mono">
                {error instanceof Error ? error.message : 'Erreur inconnue'}
              </p>
            )}
          </div>
        </div>
      </main>
    )
  }
}
