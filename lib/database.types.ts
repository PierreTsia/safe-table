export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inspections: {
        Row: {
          activityType: string
          address: string
          agreement: string | null
          businessName: string
          businessType: string
          city: string
          commune: string
          communeCode: string
          createdAt: string | null
          department: string
          departmentCode: string
          evaluation: string
          evaluationCode: number
          filter: string
          id: number
          inspectionDate: string
          latitude: number | null
          longitude: number | null
          postalCode: string
          region: string
          regionCode: string
          riskScore: number
          siret: string
          updatedAt: string | null
        }
        Insert: {
          activityType: string
          address: string
          agreement?: string | null
          businessName: string
          businessType: string
          city: string
          commune: string
          communeCode: string
          createdAt?: string | null
          department: string
          departmentCode: string
          evaluation: string
          evaluationCode: number
          filter: string
          id?: number
          inspectionDate: string
          latitude?: number | null
          longitude?: number | null
          postalCode: string
          region: string
          regionCode: string
          riskScore: number
          siret: string
          updatedAt?: string | null
        }
        Update: {
          activityType?: string
          address?: string
          agreement?: string | null
          businessName?: string
          businessType?: string
          city?: string
          commune?: string
          communeCode?: string
          createdAt?: string | null
          department?: string
          departmentCode?: string
          evaluation?: string
          evaluationCode?: number
          filter?: string
          id?: number
          inspectionDate?: string
          latitude?: number | null
          longitude?: number | null
          postalCode?: string
          region?: string
          regionCode?: string
          riskScore?: number
          siret?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      inspection_evaluation_stats: {
        Row: {
          count: number | null
          evaluation: string | null
          percentage: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      find_inspections_within_radius: {
        Args: { center_lat: number; center_lng: number; radius_km: number }
        Returns: {
          id: number
          distance_km: number
          businessName: string
          siret: string
          address: string
          postalCode: string
          city: string
          inspectionDate: string
          businessType: string
          evaluation: string
          evaluationCode: number
          agreement: string
          latitude: number
          longitude: number
          filter: string
          activityType: string
          region: string
          regionCode: string
          department: string
          departmentCode: string
          commune: string
          communeCode: string
          riskScore: number
          createdAt: string
          updatedAt: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
