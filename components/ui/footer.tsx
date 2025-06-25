export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground max-w-4xl mx-auto">
            Ces données sont issues du dispositif{' '}
            <a 
              href="https://agriculture.gouv.fr/alimconfiance-les-resultats-des-controles-sanitaires-accessibles-tous" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Alim&apos;confiance
            </a>{' '}
            du Ministère de l&apos;Agriculture et de l&apos;Alimentation, disponibles sur{' '}
            <a 
              href="https://www.data.gouv.fr/fr/datasets/681dd0ca365bb9cabb5b484a/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              data.gouv.fr
            </a>{' '}
            sous licence ouverte. Dernière mise à jour : mai 2025.
          </p>
        </div>
      </div>
    </footer>
  )
} 