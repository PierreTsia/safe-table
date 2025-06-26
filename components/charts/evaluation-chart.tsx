'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LegendPayload } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EvaluationStats } from '@/lib/supabase'

interface EvaluationChartProps {
  data: EvaluationStats[]
}

function groupEvaluations(data: EvaluationStats[]) {
  const tresSatisfaisant = data.find(d => d.evaluation === 'Très satisfaisant')
  const satisfaisant = data.find(d => d.evaluation === 'Satisfaisant')
  const aAmeliorer = data.find(d => d.evaluation === 'À améliorer')
  const aCorriger = data.find(d => d.evaluation === 'À corriger de manière urgente')

  const groupLabel = 'À améliorer ou corriger'
  const groupCount = (aAmeliorer?.count || 0) + (aCorriger?.count || 0)
  const groupPercentage = (aAmeliorer?.percentage || 0) + (aCorriger?.percentage || 0)

  const grouped = [
    tresSatisfaisant && { evaluation: 'Très satisfaisant', count: tresSatisfaisant.count, percentage: tresSatisfaisant.percentage },
    satisfaisant && { evaluation: 'Satisfaisant', count: satisfaisant.count, percentage: satisfaisant.percentage },
    (groupCount > 0) && { evaluation: groupLabel, count: groupCount, percentage: groupPercentage }
  ].filter(Boolean) as EvaluationStats[]

  return grouped
}

const COLORS = {
  'Très satisfaisant': '#10b981',
  'Satisfaisant': '#3b82f6', 
  'À améliorer ou corriger': '#ef4444'
}

function renderCustomLegend({ payload }: { payload?: readonly LegendPayload[] }) {
  return (
    <ul className="flex flex-col gap-2 mt-6 text-sm">
      {payload && payload.map((entry) => {
        const percentage = entry.payload ? (entry.payload as { percentage: number }).percentage : '?'
        return (
          <li key={entry.value} className="flex items-center gap-2">
            <span style={{ background: entry.color, width: 16, height: 16, display: 'inline-block', borderRadius: 4 }}></span>
            <span className="font-medium">{entry.value}</span>
            <span className="ml-2 text-muted-foreground">— {percentage}%</span>
          </li>
        )
      })}
    </ul>
  )
}

export function EvaluationChart({ data }: EvaluationChartProps) {
  const groupedData = groupEvaluations(data)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Répartition des niveaux d&apos;hygiène</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={groupedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
              nameKey="evaluation"
              isAnimationActive={false}
            >
              {groupedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.evaluation as keyof typeof COLORS] || '#8884d8'} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} établissements`,
                name
              ]}
            />
            <Legend content={renderCustomLegend} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 