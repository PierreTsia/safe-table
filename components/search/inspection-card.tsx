import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InspectionDisplay } from '@/lib/supabase'
import { 
  UtensilsCrossed, 
  Wheat, 
  Building2, 
  Beef, 
  Tractor, 
  ShoppingCart, 
  Milk, 
  ChefHat,
  Croissant,
  Store
} from 'lucide-react'

interface InspectionCardProps {
  inspection: InspectionDisplay
  onClick?: () => void
}

const evaluationMap = {
  1: { variant: 'success' as const, text: 'Très satisfaisant' },
  2: { variant: 'satisfactory' as const, text: 'Satisfaisant' },
  3: { variant: 'warning' as const, text: 'À améliorer' },
  4: { variant: 'destructive' as const, text: 'À corriger de manière urgente' },
}

const businessTypeIconMap = {
  'Restaurants': UtensilsCrossed,
  'Boulangerie-Pâtisserie': Wheat,
  'Restauration collective': Building2,
  'Boucherie-Charcuterie': Beef,
  'Producteurs fermiers': Tractor,
  'Libre service': ShoppingCart,
  'Transformation de lait ou produits laitiers': Milk,
  'Traiteur': ChefHat,
  'Rayon pain/viennoiserie/pâtisserie': Croissant,
  'Libre service|Alimentation générale': Store,
  'Alimentation générale': Store,
} as const

export function InspectionCard({ inspection, onClick }: InspectionCardProps) {
  const evaluation = evaluationMap[inspection.evaluationCode as keyof typeof evaluationMap] 
    || evaluationMap[1] // fallback to success

  const IconComponent = businessTypeIconMap[inspection.businessType as keyof typeof businessTypeIconMap] || Store

  return (
    <Card 
      className="hover:border-primary transition-all duration-200 cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold leading-tight mb-3">
          {inspection.businessName}
        </CardTitle>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-primary/70 flex-shrink-0" />
            <p className="text-sm font-medium text-foreground/80">
              {inspection.businessType}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {inspection.address}
            </p>
            <p className="text-sm font-medium text-foreground/70">
              {inspection.city}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={evaluation.variant} className="font-medium">
            {evaluation.text}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Inspecté le {new Date(inspection.inspectionDate).toLocaleDateString('fr-FR')}
        </p>
      </CardContent>
    </Card>
  )
} 