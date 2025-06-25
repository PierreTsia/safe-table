'use client'

import { Map } from 'lucide-react'

interface MapViewProps {
  initialQuery: string
}

export function MapView({ initialQuery }: MapViewProps) {
  return (
    <div className="flex items-center justify-center h-96 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
      <div className="text-center">
        <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Carte en cours de développement</h3>
        <p className="text-muted-foreground mb-4">
          Recherche pour &quot;{initialQuery}&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Cette fonctionnalité permettra de visualiser les établissements sur une carte interactive
        </p>
      </div>
    </div>
  )
} 