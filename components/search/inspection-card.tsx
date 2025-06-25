import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Inspection {
  id: number
  businessName: string
  city: string
  evaluationCode: number
  inspectionDate: string
}

interface InspectionCardProps {
  inspection: Inspection
  onClick?: () => void
}

const evaluationMap = {
  1: { variant: 'success' as const, text: 'Très satisfaisant' },
  2: { variant: 'satisfactory' as const, text: 'Satisfaisant' },
  3: { variant: 'warning' as const, text: 'À améliorer' },
  4: { variant: 'destructive' as const, text: 'À corriger de manière urgente' },
}

export function InspectionCard({ inspection, onClick }: InspectionCardProps) {
  const evaluation = evaluationMap[inspection.evaluationCode as keyof typeof evaluationMap] 
    || evaluationMap[1] // fallback to success

  return (
    <Card 
      className="hover:border-primary transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-base">{inspection.businessName}</CardTitle>
        <p className="text-sm text-muted-foreground">{inspection.city}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant={evaluation.variant}>
          {evaluation.text}
        </Badge>
        <p className="text-sm text-muted-foreground">
          Inspecté le {new Date(inspection.inspectionDate).toLocaleDateString('fr-FR')}
        </p>
      </CardContent>
    </Card>
  )
} 