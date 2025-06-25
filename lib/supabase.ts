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

// Shared simplified inspection type for UI components
export type InspectionDisplay = Pick<Inspection, 
  'id' | 'businessName' | 'businessType' | 'address' | 'city' | 'evaluationCode' | 'inspectionDate'
>

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

// Search inspections with pagination and sorting
export const searchInspections = async (
  query: string, 
  page: number = 1, 
  pageSize: number = 12,
  sortBy: 'inspectionDate' | 'businessName' | 'evaluationCode' = 'inspectionDate',
  sortOrder: 'asc' | 'desc' = 'desc',
  businessType?: string,
  spatial?: { lat: number; lng: number; radius: number }
) => {
  // Split query into words for better matching
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0 && !spatial) return { data: [], count: 0 }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // If spatial search, use the RPC
  if (spatial) {
    // Call the Postgres function findInspectionsWithinRadius
    const rpcQuery = supabase
      .rpc('find_inspections_within_radius', {
        center_lat: spatial.lat,
        center_lng: spatial.lng,
        radius_km: spatial.radius
      })

    const { data, error } = await rpcQuery
    if (error) throw error
    return { data: data || [], count: data ? data.length : 0 }
  }

  // Build base query (non-spatial)
  let countQuery = supabase
    .from('inspections')
    .select('*', { count: 'exact', head: true })
    .or(terms.map(term => 
      `businessName.ilike.%${term}%,city.ilike.%${term}%,postalCode.ilike.%${term}%`
    ).join(','))

  let dataQuery = supabase
    .from('inspections')
    .select()
    .or(terms.map(term => 
      `businessName.ilike.%${term}%,city.ilike.%${term}%,postalCode.ilike.%${term}%`
    ).join(','))

  // Add business type filter if provided
  if (businessType) {
    countQuery = countQuery.eq('businessType', businessType)
    dataQuery = dataQuery.eq('businessType', businessType)
  }

  // Get count
  const { count, error: countError } = await countQuery
  if (countError) throw countError

  // Get paginated data
  const { data, error } = await dataQuery
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to)

  if (error) throw error
  return { data: data || [], count: count || 0 }
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