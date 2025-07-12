export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      engagement_activations: {
        Row: {
          activation_status: string | null
          country: string | null
          created_at: string
          currency: string | null
          discount_percentage: number | null
          engagement_model: string
          final_calculated_price: number | null
          id: string
          membership_status: string
          organization_type: string | null
          platform_fee_percentage: number | null
          terms_accepted: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activation_status?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          discount_percentage?: number | null
          engagement_model: string
          final_calculated_price?: number | null
          id?: string
          membership_status: string
          organization_type?: string | null
          platform_fee_percentage?: number | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activation_status?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          discount_percentage?: number | null
          engagement_model?: string
          final_calculated_price?: number | null
          id?: string
          membership_status?: string
          organization_type?: string | null
          platform_fee_percentage?: number | null
          terms_accepted?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pricing_configs: {
        Row: {
          annual_fee: number | null
          config_id: string
          country: string
          created_at: string | null
          currency: string | null
          discount_percentage: number | null
          engagement_model: string
          entity_type: string
          half_yearly_fee: number | null
          id: string
          internal_paas_pricing: Json | null
          membership_status: string
          organization_type: string
          platform_fee_percentage: number | null
          quarterly_fee: number | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          annual_fee?: number | null
          config_id: string
          country: string
          created_at?: string | null
          currency?: string | null
          discount_percentage?: number | null
          engagement_model: string
          entity_type: string
          half_yearly_fee?: number | null
          id?: string
          internal_paas_pricing?: Json | null
          membership_status: string
          organization_type: string
          platform_fee_percentage?: number | null
          quarterly_fee?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          annual_fee?: number | null
          config_id?: string
          country?: string
          created_at?: string | null
          currency?: string | null
          discount_percentage?: number | null
          engagement_model?: string
          entity_type?: string
          half_yearly_fee?: number | null
          id?: string
          internal_paas_pricing?: Json | null
          membership_status?: string
          organization_type?: string
          platform_fee_percentage?: number | null
          quarterly_fee?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          company_logo: string[] | null
          company_profile: string[] | null
          contact_person_name: string
          country: string
          country_code: string | null
          created_at: string
          custom_user_id: string
          entity_type: string
          id: string
          industry_segment: string | null
          organization_id: string | null
          organization_name: string
          organization_type: string
          phone_number: string | null
          registration_documents: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_logo?: string[] | null
          company_profile?: string[] | null
          contact_person_name: string
          country: string
          country_code?: string | null
          created_at?: string
          custom_user_id: string
          entity_type: string
          id: string
          industry_segment?: string | null
          organization_id?: string | null
          organization_name: string
          organization_type: string
          phone_number?: string | null
          registration_documents?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_logo?: string[] | null
          company_profile?: string[] | null
          contact_person_name?: string
          country?: string
          country_code?: string | null
          created_at?: string
          custom_user_id?: string
          entity_type?: string
          id?: string
          industry_segment?: string | null
          organization_id?: string | null
          organization_name?: string
          organization_type?: string
          phone_number?: string | null
          registration_documents?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
