'use client'

import { EvaluationChart } from './evaluation-chart'
import { EvaluationStats } from '@/lib/supabase'
import { BarChart3 } from 'lucide-react'

interface ChartsSectionProps {
  evaluationStats: EvaluationStats[]
}

export function ChartsSection({ evaluationStats }: ChartsSectionProps) {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Statistiques des inspections
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez la répartition des niveaux d&apos;hygiène 
            dans les établissements alimentaires français
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <EvaluationChart data={evaluationStats} />
        </div>
      </div>
    </section>
  )
} 