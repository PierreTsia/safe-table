import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Environment variables are already defined in .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables:
    NEXT_PUBLIC_SUPABASE_PROJECT_URL: ${supabaseUrl ? 'Set' : 'Missing'}
    NEXT_PUBLIC_SUPABASE_KEY: ${supabaseAnonKey ? 'Set' : 'Missing'}
  `)
}

// Create typed client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Types from generated schema
export type Inspection = Database['public']['Tables']['inspections']['Row']
export type InspectionInsert = Database['public']['Tables']['inspections']['Insert']
export type InspectionUpdate = Database['public']['Tables']['inspections']['Update']

// Evaluation code mapping
export const EVALUATION_CODES = {
  1: "Très satisfaisant",
  2: "Satisfaisant",
  3: "À améliorer",
  4: "À corriger de manière urgente"
} as const

// Helper function to get evaluation text
export const getEvaluationText = (code: 1 | 2 | 3 | 4): string => {
  return EVALUATION_CODES[code]
}

// Helper function for search
export const searchInspections = async (query: string) => {
  const { data, error } = await supabase
    .from('inspections')
    .select()
    .or(`businessName.ilike.%${query}%,city.ilike.%${query}%`)
    .order('inspectionDate', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

// Get inspections by evaluation code
export const getInspectionsByEvaluationCode = async (evaluationCode: 1 | 2 | 3 | 4) => {
  const { data, error } = await supabase
    .from('inspections')
    .select()
    .eq('evaluationCode', evaluationCode)
    .order('inspectionDate', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

// Get inspections with meat handling agreement
export const getMeatHandlers = async () => {
  const { data, error } = await supabase
    .from('inspections')
    .select()
    .not('agreement', 'is', null)
    .order('inspectionDate', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

// Get inspections within radius (using the database function)
export const findInspectionsWithinRadius = async (
  centerLat: number,
  centerLng: number,
  radiusKm: number
) => {
  const { data, error } = await supabase
    .rpc('find_inspections_within_radius', {
      center_lat: centerLat,
      center_lng: centerLng,
      radius_km: radiusKm
    })

  if (error) throw error
  return data
} 