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
          current_frequency: string | null
          discount_percentage: number | null
          engagement_locked: boolean | null
          engagement_model: string
          final_calculated_price: number | null
          frequency_change_history: Json | null
          frequency_payments: Json | null
          id: string
          last_payment_date: string | null
          lock_date: string | null
          membership_status: string
          membership_type: string | null
          organization_type: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_status: string | null
          platform_fee_percentage: number | null
          pricing_locked: boolean | null
          selected_frequency: string | null
          terms_accepted: boolean | null
          total_payments_made: number | null
          updated_at: string
          updated_platform_fee_percentage: number | null
          user_id: string | null
        }
        Insert: {
          activation_status?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          current_frequency?: string | null
          discount_percentage?: number | null
          engagement_locked?: boolean | null
          engagement_model: string
          final_calculated_price?: number | null
          frequency_change_history?: Json | null
          frequency_payments?: Json | null
          id?: string
          last_payment_date?: string | null
          lock_date?: string | null
          membership_status: string
          membership_type?: string | null
          organization_type?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          platform_fee_percentage?: number | null
          pricing_locked?: boolean | null
          selected_frequency?: string | null
          terms_accepted?: boolean | null
          total_payments_made?: number | null
          updated_at?: string
          updated_platform_fee_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          activation_status?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          current_frequency?: string | null
          discount_percentage?: number | null
          engagement_locked?: boolean | null
          engagement_model?: string
          final_calculated_price?: number | null
          frequency_change_history?: Json | null
          frequency_payments?: Json | null
          id?: string
          last_payment_date?: string | null
          lock_date?: string | null
          membership_status?: string
          membership_type?: string | null
          organization_type?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          platform_fee_percentage?: number | null
          pricing_locked?: boolean | null
          selected_frequency?: string | null
          terms_accepted?: boolean | null
          total_payments_made?: number | null
          updated_at?: string
          updated_platform_fee_percentage?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      master_challenge_statuses: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_communication_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          link: string | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          link?: string | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          link?: string | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_competency_capabilities: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_countries: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_currencies: {
        Row: {
          code: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_user_created: boolean | null
          name: string
          symbol: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          code?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          symbol?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          code?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          symbol?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_master_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["name"]
          },
        ]
      }
      master_departments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          organization_id: string | null
          organization_name: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          organization_id?: string | null
          organization_name?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          organization_id?: string | null
          organization_name?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_domain_groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          hierarchy: Json | null
          id: string
          industry_segment_id: string | null
          is_active: boolean
          is_user_created: boolean | null
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          hierarchy?: Json | null
          id?: string
          industry_segment_id?: string | null
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          hierarchy?: Json | null
          id?: string
          industry_segment_id?: string | null
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_master_domain_groups_industry_segment"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "master_industry_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_domain_groups_industry_segment_id_fkey"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "master_industry_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      master_engagement_models: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_entity_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_industry_segments: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_organization_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_reward_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          name: string
          type: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          type?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          type?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_seeker_membership_fees: {
        Row: {
          annual_amount: number | null
          annual_currency: string | null
          country: string
          created_at: string
          created_by: string | null
          description: string | null
          entity_type: string
          half_yearly_amount: number | null
          half_yearly_currency: string | null
          id: string
          is_user_created: boolean | null
          monthly_amount: number | null
          monthly_currency: string | null
          organization_type: string
          quarterly_amount: number | null
          quarterly_currency: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          annual_amount?: number | null
          annual_currency?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type: string
          half_yearly_amount?: number | null
          half_yearly_currency?: string | null
          id?: string
          is_user_created?: boolean | null
          monthly_amount?: number | null
          monthly_currency?: string | null
          organization_type: string
          quarterly_amount?: number | null
          quarterly_currency?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          annual_amount?: number | null
          annual_currency?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type?: string
          half_yearly_amount?: number | null
          half_yearly_currency?: string | null
          id?: string
          is_user_created?: boolean | null
          monthly_amount?: number | null
          monthly_currency?: string | null
          organization_type?: string
          quarterly_amount?: number | null
          quarterly_currency?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_solution_statuses: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          name: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_user_created?: boolean | null
          name?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      master_sub_departments: {
        Row: {
          created_at: string
          created_by: string | null
          department_id: string
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department_id: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department_id?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_sub_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "master_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      master_team_units: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          sub_department_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          sub_department_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          sub_department_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_team_units_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "master_sub_departments"
            referencedColumns: ["id"]
          },
        ]
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
      get_table_schema: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: string
          column_default: string
          ordinal_position: number
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
