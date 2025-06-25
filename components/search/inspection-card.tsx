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

export function InspectionCard({ inspection, onClick }: InspectionCardProps) {
  return (
    <div 
      className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
      onClick={onClick}
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
  )
} 