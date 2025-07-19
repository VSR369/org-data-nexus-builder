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
      admin_creation_audit: {
        Row: {
          action_type: string
          admin_email: string
          admin_name: string
          created_admin_id: string
          created_at: string | null
          created_by: string
          id: string
          notes: string | null
          organization_id: string
          organization_name: string
        }
        Insert: {
          action_type: string
          admin_email: string
          admin_name: string
          created_admin_id: string
          created_at?: string | null
          created_by: string
          id?: string
          notes?: string | null
          organization_id: string
          organization_name: string
        }
        Update: {
          action_type?: string
          admin_email?: string
          admin_name?: string
          created_admin_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          notes?: string | null
          organization_id?: string
          organization_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_creation_audit_created_admin_id_fkey"
            columns: ["created_admin_id"]
            isOneToOne: false
            referencedRelation: "organization_administrators"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_activations: {
        Row: {
          activation_status: string | null
          country: string | null
          created_at: string
          currency: string | null
          current_frequency: string | null
          discount_percentage: number | null
          engagement_locked: boolean | null
          engagement_model: string | null
          engagement_model_details: Json | null
          engagement_model_selected_at: string | null
          enm_terms: boolean | null
          final_calculated_price: number | null
          frequency_change_history: Json | null
          frequency_payments: Json | null
          id: string
          last_payment_date: string | null
          lock_date: string | null
          mem_payment_amount: number | null
          mem_payment_currency: string | null
          mem_payment_date: string | null
          mem_payment_method: string | null
          mem_payment_status: string | null
          mem_receipt_number: string | null
          mem_terms: boolean | null
          membership_status: string
          membership_type: string | null
          organization_type: string | null
          payment_simulation_status: string | null
          platform_fee_percentage: number | null
          pricing_locked: boolean | null
          pricing_tier: string | null
          selected_frequency: string | null
          terms_accepted: boolean | null
          tier_features: Json | null
          tier_selected_at: string | null
          total_payments_made: number | null
          updated_at: string
          updated_platform_fee_percentage: number | null
          user_id: string | null
          workflow_completed: boolean | null
          workflow_step: string | null
        }
        Insert: {
          activation_status?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          current_frequency?: string | null
          discount_percentage?: number | null
          engagement_locked?: boolean | null
          engagement_model?: string | null
          engagement_model_details?: Json | null
          engagement_model_selected_at?: string | null
          enm_terms?: boolean | null
          final_calculated_price?: number | null
          frequency_change_history?: Json | null
          frequency_payments?: Json | null
          id?: string
          last_payment_date?: string | null
          lock_date?: string | null
          mem_payment_amount?: number | null
          mem_payment_currency?: string | null
          mem_payment_date?: string | null
          mem_payment_method?: string | null
          mem_payment_status?: string | null
          mem_receipt_number?: string | null
          mem_terms?: boolean | null
          membership_status: string
          membership_type?: string | null
          organization_type?: string | null
          payment_simulation_status?: string | null
          platform_fee_percentage?: number | null
          pricing_locked?: boolean | null
          pricing_tier?: string | null
          selected_frequency?: string | null
          terms_accepted?: boolean | null
          tier_features?: Json | null
          tier_selected_at?: string | null
          total_payments_made?: number | null
          updated_at?: string
          updated_platform_fee_percentage?: number | null
          user_id?: string | null
          workflow_completed?: boolean | null
          workflow_step?: string | null
        }
        Update: {
          activation_status?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          current_frequency?: string | null
          discount_percentage?: number | null
          engagement_locked?: boolean | null
          engagement_model?: string | null
          engagement_model_details?: Json | null
          engagement_model_selected_at?: string | null
          enm_terms?: boolean | null
          final_calculated_price?: number | null
          frequency_change_history?: Json | null
          frequency_payments?: Json | null
          id?: string
          last_payment_date?: string | null
          lock_date?: string | null
          mem_payment_amount?: number | null
          mem_payment_currency?: string | null
          mem_payment_date?: string | null
          mem_payment_method?: string | null
          mem_payment_status?: string | null
          mem_receipt_number?: string | null
          mem_terms?: boolean | null
          membership_status?: string
          membership_type?: string | null
          organization_type?: string | null
          payment_simulation_status?: string | null
          platform_fee_percentage?: number | null
          pricing_locked?: boolean | null
          pricing_tier?: string | null
          selected_frequency?: string | null
          terms_accepted?: boolean | null
          tier_features?: Json | null
          tier_selected_at?: string | null
          total_payments_made?: number | null
          updated_at?: string
          updated_platform_fee_percentage?: number | null
          user_id?: string | null
          workflow_completed?: boolean | null
          workflow_step?: string | null
        }
        Relationships: []
      }
      engagement_model_fee_mapping: {
        Row: {
          calculation_order: number | null
          created_at: string | null
          engagement_model_id: string
          fee_component_id: string
          id: string
          is_required: boolean | null
          updated_at: string | null
        }
        Insert: {
          calculation_order?: number | null
          created_at?: string | null
          engagement_model_id: string
          fee_component_id: string
          id?: string
          is_required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          calculation_order?: number | null
          created_at?: string | null
          engagement_model_id?: string
          fee_component_id?: string
          id?: string
          is_required?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_model_fee_mapping_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_model_fee_mapping_fee_component_id_fkey"
            columns: ["fee_component_id"]
            isOneToOne: false
            referencedRelation: "master_fee_components"
            referencedColumns: ["id"]
          },
        ]
      }
      master_advance_payment_types: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          percentage_of_platform_fee: number
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
          percentage_of_platform_fee: number
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
          percentage_of_platform_fee?: number
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_analytics_access_types: {
        Row: {
          created_at: string
          created_by: string | null
          dashboard_access: boolean
          description: string | null
          features_included: Json | null
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
          dashboard_access?: boolean
          description?: string | null
          features_included?: Json | null
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
          dashboard_access?: boolean
          description?: string | null
          features_included?: Json | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_billing_frequencies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          months: number | null
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          months?: number | null
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          months?: number | null
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_capability_levels: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          max_score: number
          min_score: number
          name: string
          order_index: number
          updated_at: string
          version: number | null
        }
        Insert: {
          color: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          max_score: number
          min_score: number
          name: string
          order_index?: number
          updated_at?: string
          version?: number | null
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          max_score?: number
          min_score?: number
          name?: string
          order_index?: number
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          domain_group_id: string
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
          description?: string | null
          domain_group_id: string
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
          description?: string | null
          domain_group_id?: string
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_categories_domain_group"
            columns: ["domain_group_id"]
            isOneToOne: false
            referencedRelation: "master_domain_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      master_challenge_complexity: {
        Row: {
          consulting_fee_multiplier: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          level_order: number
          management_fee_multiplier: number
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          consulting_fee_multiplier?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          level_order?: number
          management_fee_multiplier?: number
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          consulting_fee_multiplier?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          level_order?: number
          management_fee_multiplier?: number
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_challenge_overage_fees: {
        Row: {
          country_id: string
          created_at: string
          created_by: string | null
          currency_id: string
          fee_per_additional_challenge: number
          id: string
          is_active: boolean
          is_user_created: boolean | null
          pricing_tier_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          country_id: string
          created_at?: string
          created_by?: string | null
          currency_id: string
          fee_per_additional_challenge: number
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          pricing_tier_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          country_id?: string
          created_at?: string
          created_by?: string | null
          currency_id?: string
          fee_per_additional_challenge?: number
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          pricing_tier_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_challenge_overage_fees_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_challenge_overage_fees_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "master_challenge_overage_fees_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "master_currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_challenge_overage_fees_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "master_pricing_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      master_communication_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_user_created: boolean | null
          link: string
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
          link: string
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
          link?: string
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
            foreignKeyName: "fk_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "fk_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_name"]
          },
          {
            foreignKeyName: "fk_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "pricing_configurations_detailed"
            referencedColumns: ["country_name"]
          },
          {
            foreignKeyName: "fk_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "pricing_parameters_management_consulting"
            referencedColumns: ["country_name"]
          },
          {
            foreignKeyName: "fk_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "solution_seekers_comprehensive_view"
            referencedColumns: ["country"]
          },
          {
            foreignKeyName: "fk_master_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "fk_master_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_name"]
          },
          {
            foreignKeyName: "fk_master_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "pricing_configurations_detailed"
            referencedColumns: ["country_name"]
          },
          {
            foreignKeyName: "fk_master_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "pricing_parameters_management_consulting"
            referencedColumns: ["country_name"]
          },
          {
            foreignKeyName: "fk_master_currencies_country"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "solution_seekers_comprehensive_view"
            referencedColumns: ["country"]
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
            foreignKeyName: "fk_domain_groups_industry_segment"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "master_industry_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_domain_groups_industry_segment"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["industry_segment_id"]
          },
          {
            foreignKeyName: "fk_master_domain_groups_industry_segment"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "master_industry_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_master_domain_groups_industry_segment"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["industry_segment_id"]
          },
          {
            foreignKeyName: "master_domain_groups_industry_segment_id_fkey"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "master_industry_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_domain_groups_industry_segment_id_fkey"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["industry_segment_id"]
          },
        ]
      }
      master_engagement_model_subtypes: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          engagement_model_id: string
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          optional_fields: Json | null
          required_fields: Json | null
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          engagement_model_id: string
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          optional_fields?: Json | null
          required_fields?: Json | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          engagement_model_id?: string
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          optional_fields?: Json | null
          required_fields?: Json | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_engagement_model_subtypes_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
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
      master_fee_components: {
        Row: {
          component_type: string
          created_at: string
          created_by: string | null
          default_rate_type: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          component_type: string
          created_at?: string
          created_by?: string | null
          default_rate_type?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          component_type?: string
          created_at?: string
          created_by?: string | null
          default_rate_type?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          updated_at?: string
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
      master_membership_statuses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_onboarding_types: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          resources_included: Json | null
          service_type: string
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
          resources_included?: Json | null
          service_type: string
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
          resources_included?: Json | null
          service_type?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_organization_categories: {
        Row: {
          category_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          updated_at: string
          version: number | null
          workflow_config: Json | null
        }
        Insert: {
          category_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          updated_at?: string
          version?: number | null
          workflow_config?: Json | null
        }
        Update: {
          category_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          updated_at?: string
          version?: number | null
          workflow_config?: Json | null
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
      master_platform_fee_formulas: {
        Row: {
          advance_payment_percentage: number | null
          base_consulting_fee: number | null
          base_management_fee: number | null
          configuration: Json | null
          country_id: string | null
          created_at: string
          created_by: string | null
          currency_id: string | null
          description: string | null
          engagement_model_id: string
          engagement_model_subtype_id: string | null
          formula_expression: string
          formula_name: string
          formula_type: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          membership_discount_percentage: number | null
          platform_usage_fee_percentage: number | null
          updated_at: string
          variables: Json | null
          version: number | null
        }
        Insert: {
          advance_payment_percentage?: number | null
          base_consulting_fee?: number | null
          base_management_fee?: number | null
          configuration?: Json | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          currency_id?: string | null
          description?: string | null
          engagement_model_id: string
          engagement_model_subtype_id?: string | null
          formula_expression: string
          formula_name: string
          formula_type?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          membership_discount_percentage?: number | null
          platform_usage_fee_percentage?: number | null
          updated_at?: string
          variables?: Json | null
          version?: number | null
        }
        Update: {
          advance_payment_percentage?: number | null
          base_consulting_fee?: number | null
          base_management_fee?: number | null
          configuration?: Json | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          currency_id?: string | null
          description?: string | null
          engagement_model_id?: string
          engagement_model_subtype_id?: string | null
          formula_expression?: string
          formula_name?: string
          formula_type?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          membership_discount_percentage?: number | null
          platform_usage_fee_percentage?: number | null
          updated_at?: string
          variables?: Json | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_platform_fee_formulas_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_platform_fee_formulas_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "master_platform_fee_formulas_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "master_currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_platform_fee_formulas_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_platform_fee_formulas_engagement_model_subtype_id_fkey"
            columns: ["engagement_model_subtype_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_model_subtypes"
            referencedColumns: ["id"]
          },
        ]
      }
      master_pricing_parameters: {
        Row: {
          amount: number
          complexity_applicable: boolean | null
          country_id: string
          created_at: string
          created_by: string | null
          currency_id: string
          effective_from: string | null
          effective_to: string | null
          engagement_model_context: Json | null
          entity_type_id: string
          fee_component_id: string
          id: string
          is_active: boolean
          is_user_created: boolean | null
          organization_type_id: string
          rate_type: string | null
          unit_of_measure_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          amount: number
          complexity_applicable?: boolean | null
          country_id: string
          created_at?: string
          created_by?: string | null
          currency_id: string
          effective_from?: string | null
          effective_to?: string | null
          engagement_model_context?: Json | null
          entity_type_id: string
          fee_component_id: string
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          organization_type_id: string
          rate_type?: string | null
          unit_of_measure_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          amount?: number
          complexity_applicable?: boolean | null
          country_id?: string
          created_at?: string
          created_by?: string | null
          currency_id?: string
          effective_from?: string | null
          effective_to?: string | null
          engagement_model_context?: Json | null
          entity_type_id?: string
          fee_component_id?: string
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          organization_type_id?: string
          rate_type?: string | null
          unit_of_measure_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_pricing_parameters_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "master_currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_fee_component_id_fkey"
            columns: ["fee_component_id"]
            isOneToOne: false
            referencedRelation: "master_fee_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_unit_of_measure_id_fkey"
            columns: ["unit_of_measure_id"]
            isOneToOne: false
            referencedRelation: "master_units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      master_pricing_tiers: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          level_order: number
          name: string
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
          level_order: number
          name: string
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
          level_order?: number
          name?: string
          updated_at?: string
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
          country_id: string
          created_at: string
          created_by: string | null
          description: string | null
          entity_type: string
          entity_type_id: string
          half_yearly_amount: number | null
          half_yearly_currency: string | null
          id: string
          is_user_created: boolean | null
          monthly_amount: number | null
          monthly_currency: string | null
          organization_type: string
          organization_type_id: string
          quarterly_amount: number | null
          quarterly_currency: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          annual_amount?: number | null
          annual_currency?: string | null
          country: string
          country_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type: string
          entity_type_id: string
          half_yearly_amount?: number | null
          half_yearly_currency?: string | null
          id?: string
          is_user_created?: boolean | null
          monthly_amount?: number | null
          monthly_currency?: string | null
          organization_type: string
          organization_type_id: string
          quarterly_amount?: number | null
          quarterly_currency?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          annual_amount?: number | null
          annual_currency?: string | null
          country?: string
          country_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type?: string
          entity_type_id?: string
          half_yearly_amount?: number | null
          half_yearly_currency?: string | null
          id?: string
          is_user_created?: boolean | null
          monthly_amount?: number | null
          monthly_currency?: string | null
          organization_type?: string
          organization_type_id?: string
          quarterly_amount?: number | null
          quarterly_currency?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_seeker_membership_fees_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_seeker_membership_fees_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "master_seeker_membership_fees_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_seeker_membership_fees_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "master_seeker_membership_fees_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_seeker_membership_fees_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
        ]
      }
      master_sub_categories: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          updated_at: string
          version: number | null
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
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
            foreignKeyName: "fk_sub_categories_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "master_categories"
            referencedColumns: ["id"]
          },
        ]
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
      master_support_types: {
        Row: {
          availability: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          response_time: string | null
          service_level: string
          updated_at: string
          version: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          response_time?: string | null
          service_level: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          response_time?: string | null
          service_level?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_system_configurations: {
        Row: {
          category: string | null
          config_key: string
          config_value: string
          created_at: string
          created_by: string | null
          data_type: string
          description: string | null
          id: string
          is_active: boolean
          is_system_config: boolean
          updated_at: string
          version: number | null
        }
        Insert: {
          category?: string | null
          config_key: string
          config_value: string
          created_at?: string
          created_by?: string | null
          data_type: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_config?: boolean
          updated_at?: string
          version?: number | null
        }
        Update: {
          category?: string | null
          config_key?: string
          config_value?: string
          created_at?: string
          created_by?: string | null
          data_type?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_config?: boolean
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_system_feature_access: {
        Row: {
          access_level: string
          created_at: string
          created_by: string | null
          feature_config: Json | null
          feature_name: string
          id: string
          is_active: boolean
          is_enabled: boolean
          is_user_created: boolean | null
          pricing_tier_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          access_level: string
          created_at?: string
          created_by?: string | null
          feature_config?: Json | null
          feature_name: string
          id?: string
          is_active?: boolean
          is_enabled?: boolean
          is_user_created?: boolean | null
          pricing_tier_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          access_level?: string
          created_at?: string
          created_by?: string | null
          feature_config?: Json | null
          feature_name?: string
          id?: string
          is_active?: boolean
          is_enabled?: boolean
          is_user_created?: boolean | null
          pricing_tier_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_system_feature_access_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "master_pricing_tiers"
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
      master_tier_configurations: {
        Row: {
          allows_overage: boolean
          analytics_access_id: string | null
          country_id: string
          created_at: string
          created_by: string | null
          currency_id: string | null
          fixed_charge_per_challenge: number
          id: string
          is_active: boolean
          is_user_created: boolean | null
          monthly_challenge_limit: number | null
          onboarding_type_id: string | null
          pricing_tier_id: string
          solutions_per_challenge: number
          support_type_id: string | null
          updated_at: string
          version: number | null
          workflow_template_id: string | null
        }
        Insert: {
          allows_overage?: boolean
          analytics_access_id?: string | null
          country_id: string
          created_at?: string
          created_by?: string | null
          currency_id?: string | null
          fixed_charge_per_challenge?: number
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          monthly_challenge_limit?: number | null
          onboarding_type_id?: string | null
          pricing_tier_id: string
          solutions_per_challenge?: number
          support_type_id?: string | null
          updated_at?: string
          version?: number | null
          workflow_template_id?: string | null
        }
        Update: {
          allows_overage?: boolean
          analytics_access_id?: string | null
          country_id?: string
          created_at?: string
          created_by?: string | null
          currency_id?: string | null
          fixed_charge_per_challenge?: number
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          monthly_challenge_limit?: number | null
          onboarding_type_id?: string | null
          pricing_tier_id?: string
          solutions_per_challenge?: number
          support_type_id?: string | null
          updated_at?: string
          version?: number | null
          workflow_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_tier_configurations_analytics_access_id_fkey"
            columns: ["analytics_access_id"]
            isOneToOne: false
            referencedRelation: "master_analytics_access_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_configurations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_configurations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "master_tier_configurations_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "master_currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_configurations_onboarding_type_id_fkey"
            columns: ["onboarding_type_id"]
            isOneToOne: false
            referencedRelation: "master_onboarding_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_configurations_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "master_pricing_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_configurations_support_type_id_fkey"
            columns: ["support_type_id"]
            isOneToOne: false
            referencedRelation: "master_support_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_configurations_workflow_template_id_fkey"
            columns: ["workflow_template_id"]
            isOneToOne: false
            referencedRelation: "master_workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      master_tier_engagement_model_access: {
        Row: {
          allows_multiple_challenges: boolean
          business_rules: Json | null
          created_at: string
          created_by: string | null
          engagement_model_id: string
          id: string
          is_active: boolean
          is_allowed: boolean
          is_default: boolean
          is_user_created: boolean | null
          max_concurrent_models: number
          pricing_tier_id: string
          selection_scope: string
          switch_requirements: string
          updated_at: string
          version: number | null
        }
        Insert: {
          allows_multiple_challenges?: boolean
          business_rules?: Json | null
          created_at?: string
          created_by?: string | null
          engagement_model_id: string
          id?: string
          is_active?: boolean
          is_allowed?: boolean
          is_default?: boolean
          is_user_created?: boolean | null
          max_concurrent_models?: number
          pricing_tier_id: string
          selection_scope?: string
          switch_requirements?: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          allows_multiple_challenges?: boolean
          business_rules?: Json | null
          created_at?: string
          created_by?: string | null
          engagement_model_id?: string
          id?: string
          is_active?: boolean
          is_allowed?: boolean
          is_default?: boolean
          is_user_created?: boolean | null
          max_concurrent_models?: number
          pricing_tier_id?: string
          selection_scope?: string
          switch_requirements?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_tier_engagement_model_access_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_tier_engagement_model_access_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "master_pricing_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      master_units_of_measure: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_percentage: boolean
          name: string
          symbol: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_percentage?: boolean
          name: string
          symbol?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_percentage?: boolean
          name?: string
          symbol?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      master_workflow_templates: {
        Row: {
          created_at: string
          created_by: string | null
          customization_level: string
          description: string | null
          fields_config: Json | null
          id: string
          is_active: boolean
          is_user_created: boolean | null
          name: string
          template_count: number | null
          template_type: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customization_level: string
          description?: string | null
          fields_config?: Json | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name: string
          template_count?: number | null
          template_type: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customization_level?: string
          description?: string | null
          fields_config?: Json | null
          id?: string
          is_active?: boolean
          is_user_created?: boolean | null
          name?: string
          template_count?: number | null
          template_type?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: []
      }
      organization_administrators: {
        Row: {
          account_locked_until: string | null
          admin_email: string
          admin_name: string
          admin_password_hash: string | null
          contact_number: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          login_attempts: number | null
          organization_id: string
          role_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_locked_until?: string | null
          admin_email: string
          admin_name: string
          admin_password_hash?: string | null
          contact_number?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          login_attempts?: number | null
          organization_id: string
          role_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_locked_until?: string | null
          admin_email?: string
          admin_name?: string
          admin_password_hash?: string | null
          contact_number?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          login_attempts?: number | null
          organization_id?: string
          role_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_administrators_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_administrators_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_administrators_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "solution_seekers_comprehensive_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          organization_id: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          organization_id: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          organization_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "solution_seekers_comprehensive_view"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string
          contact_person_name: string
          country_code: string | null
          country_id: string | null
          created_at: string
          email: string
          entity_type_id: string | null
          id: string
          industry_segment_id: string | null
          organization_category_id: string | null
          organization_id: string
          organization_name: string
          organization_type_id: string | null
          password_hash: string | null
          phone_number: string
          registration_status: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          contact_person_name: string
          country_code?: string | null
          country_id?: string | null
          created_at?: string
          email: string
          entity_type_id?: string | null
          id?: string
          industry_segment_id?: string | null
          organization_category_id?: string | null
          organization_id: string
          organization_name: string
          organization_type_id?: string | null
          password_hash?: string | null
          phone_number: string
          registration_status?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          contact_person_name?: string
          country_code?: string | null
          country_id?: string | null
          created_at?: string
          email?: string
          entity_type_id?: string | null
          id?: string
          industry_segment_id?: string | null
          organization_category_id?: string | null
          organization_id?: string
          organization_name?: string
          organization_type_id?: string | null
          password_hash?: string | null
          phone_number?: string
          registration_status?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "organizations_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "organizations_industry_segment_id_fkey"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "master_industry_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_industry_segment_id_fkey"
            columns: ["industry_segment_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["industry_segment_id"]
          },
          {
            foreignKeyName: "organizations_organization_category_id_fkey"
            columns: ["organization_category_id"]
            isOneToOne: false
            referencedRelation: "master_organization_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
        ]
      }
      pricing_configurations: {
        Row: {
          advance_payment_type_id: string | null
          base_value: number
          billing_frequency_id: string | null
          calculated_advance_payment: number | null
          calculated_platform_fee: number | null
          calculated_value: number | null
          config_name: string | null
          consulting_fee_amount: number | null
          country_id: string
          created_at: string
          created_by: string | null
          currency_id: string | null
          effective_from: string | null
          effective_to: string | null
          engagement_model_id: string
          engagement_model_subtype_id: string | null
          entity_type_id: string
          formula_variables: Json | null
          id: string
          is_active: boolean
          management_fee_amount: number | null
          membership_discount_percentage: number | null
          membership_status_id: string
          organization_type_id: string
          platform_fee_formula_id: string | null
          pricing_tier_id: string | null
          remarks: string | null
          unit_of_measure_id: string
          updated_at: string
          updated_by: string | null
          version: number | null
        }
        Insert: {
          advance_payment_type_id?: string | null
          base_value: number
          billing_frequency_id?: string | null
          calculated_advance_payment?: number | null
          calculated_platform_fee?: number | null
          calculated_value?: number | null
          config_name?: string | null
          consulting_fee_amount?: number | null
          country_id: string
          created_at?: string
          created_by?: string | null
          currency_id?: string | null
          effective_from?: string | null
          effective_to?: string | null
          engagement_model_id: string
          engagement_model_subtype_id?: string | null
          entity_type_id: string
          formula_variables?: Json | null
          id?: string
          is_active?: boolean
          management_fee_amount?: number | null
          membership_discount_percentage?: number | null
          membership_status_id: string
          organization_type_id: string
          platform_fee_formula_id?: string | null
          pricing_tier_id?: string | null
          remarks?: string | null
          unit_of_measure_id: string
          updated_at?: string
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          advance_payment_type_id?: string | null
          base_value?: number
          billing_frequency_id?: string | null
          calculated_advance_payment?: number | null
          calculated_platform_fee?: number | null
          calculated_value?: number | null
          config_name?: string | null
          consulting_fee_amount?: number | null
          country_id?: string
          created_at?: string
          created_by?: string | null
          currency_id?: string | null
          effective_from?: string | null
          effective_to?: string | null
          engagement_model_id?: string
          engagement_model_subtype_id?: string | null
          entity_type_id?: string
          formula_variables?: Json | null
          id?: string
          is_active?: boolean
          management_fee_amount?: number | null
          membership_discount_percentage?: number | null
          membership_status_id?: string
          organization_type_id?: string
          platform_fee_formula_id?: string | null
          pricing_tier_id?: string | null
          remarks?: string | null
          unit_of_measure_id?: string
          updated_at?: string
          updated_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_advance_payment_type"
            columns: ["advance_payment_type_id"]
            isOneToOne: false
            referencedRelation: "master_advance_payment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_engagement_model_subtype"
            columns: ["engagement_model_subtype_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_model_subtypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_platform_fee_formula"
            columns: ["platform_fee_formula_id"]
            isOneToOne: false
            referencedRelation: "master_platform_fee_formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pricing_tier"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "master_pricing_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_billing_frequency_fkey"
            columns: ["billing_frequency_id"]
            isOneToOne: false
            referencedRelation: "master_billing_frequencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_country_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_country_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "pricing_configurations_currency_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "master_currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_engagement_model_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_entity_type_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_entity_type_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "pricing_configurations_membership_status_fkey"
            columns: ["membership_status_id"]
            isOneToOne: false
            referencedRelation: "master_membership_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_org_type_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configurations_org_type_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
          {
            foreignKeyName: "pricing_configurations_unit_measure_fkey"
            columns: ["unit_of_measure_id"]
            isOneToOne: false
            referencedRelation: "master_units_of_measure"
            referencedColumns: ["id"]
          },
        ]
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
      tier_engagement_model_restrictions: {
        Row: {
          created_at: string
          created_by: string | null
          engagement_model_id: string
          engagement_model_subtype_id: string | null
          id: string
          is_allowed: boolean
          pricing_tier_id: string
          updated_at: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          engagement_model_id: string
          engagement_model_subtype_id?: string | null
          id?: string
          is_allowed?: boolean
          pricing_tier_id: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          engagement_model_id?: string
          engagement_model_subtype_id?: string | null
          id?: string
          is_allowed?: boolean
          pricing_tier_id?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tier_engagement_model_restrict_engagement_model_subtype_id_fkey"
            columns: ["engagement_model_subtype_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_model_subtypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tier_engagement_model_restrictions_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tier_engagement_model_restrictions_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "master_pricing_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      organization_context: {
        Row: {
          address: string | null
          contact_person_name: string | null
          country_id: string | null
          country_name: string | null
          email: string | null
          entity_type_id: string | null
          entity_type_name: string | null
          id: string | null
          industry_segment_id: string | null
          industry_segment_name: string | null
          organization_id: string | null
          organization_name: string | null
          organization_type_id: string | null
          organization_type_name: string | null
          phone_number: string | null
          user_id: string | null
          website: string | null
        }
        Relationships: []
      }
      pricing_configurations_detailed: {
        Row: {
          base_value: number | null
          billing_frequency: string | null
          billing_months: number | null
          calculated_value: number | null
          config_name: string | null
          country_code: string | null
          country_name: string | null
          created_at: string | null
          currency_code: string | null
          currency_name: string | null
          currency_symbol: string | null
          effective_from: string | null
          effective_to: string | null
          engagement_model: string | null
          entity_type: string | null
          id: string | null
          is_active: boolean | null
          is_percentage: boolean | null
          membership_discount_percentage: number | null
          membership_status: string | null
          organization_type: string | null
          remarks: string | null
          unit_of_measure: string | null
          unit_symbol: string | null
          updated_at: string | null
          version: number | null
        }
        Relationships: []
      }
      pricing_parameters_management_consulting: {
        Row: {
          amount: number | null
          complexity_applicable: boolean | null
          component_type: string | null
          country_id: string | null
          country_name: string | null
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          currency_name: string | null
          currency_symbol: string | null
          effective_from: string | null
          effective_to: string | null
          engagement_model_context: Json | null
          entity_type_id: string | null
          entity_type_name: string | null
          fee_component_id: string | null
          fee_component_name: string | null
          id: string | null
          is_active: boolean | null
          is_user_created: boolean | null
          organization_type_id: string | null
          organization_type_name: string | null
          rate_type: string | null
          unit_name: string | null
          unit_of_measure_id: string | null
          unit_symbol: string | null
          updated_at: string | null
          version: number | null
        }
        Relationships: [
          {
            foreignKeyName: "master_pricing_parameters_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "master_currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_fee_component_id_fkey"
            columns: ["fee_component_id"]
            isOneToOne: false
            referencedRelation: "master_fee_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
          {
            foreignKeyName: "master_pricing_parameters_unit_of_measure_id_fkey"
            columns: ["unit_of_measure_id"]
            isOneToOne: false
            referencedRelation: "master_units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_seekers_comprehensive_view: {
        Row: {
          activation_status: string | null
          address: string | null
          contact_person_name: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          current_frequency: string | null
          discount_percentage: number | null
          email: string | null
          engagement_locked: boolean | null
          engagement_model: string | null
          engagement_model_details: Json | null
          engagement_model_selected_at: string | null
          enm_terms: boolean | null
          entity_type: string | null
          final_calculated_price: number | null
          frequency_change_history: Json | null
          frequency_payments: Json | null
          has_engagement_record: boolean | null
          has_user_account: boolean | null
          id: string | null
          industry_segment: string | null
          last_activity: string | null
          last_payment_date: string | null
          lock_date: string | null
          mem_payment_amount: number | null
          mem_payment_currency: string | null
          mem_payment_date: string | null
          mem_payment_method: string | null
          mem_payment_status: string | null
          mem_receipt_number: string | null
          mem_terms: boolean | null
          membership_status: string | null
          organization_id: string | null
          organization_name: string | null
          organization_type: string | null
          overall_status: string | null
          payment_simulation_status: string | null
          phone_number: string | null
          platform_fee_percentage: number | null
          pricing_locked: boolean | null
          pricing_tier: string | null
          selected_frequency: string | null
          terms_accepted: boolean | null
          tier_features: Json | null
          tier_selected_at: string | null
          total_payments_made: number | null
          updated_at: string | null
          updated_platform_fee_percentage: number | null
          user_id: string | null
          website: string | null
          workflow_completed: boolean | null
          workflow_step: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      bulk_update_pricing_discount: {
        Args: {
          p_country_name: string
          p_organization_type: string
          p_new_discount: number
        }
        Returns: number
      }
      check_active_challenges_for_user: {
        Args: { user_id_param: string }
        Returns: number
      }
      check_fee_component_dependencies: {
        Args: { component_id: string }
        Returns: Json
      }
      generate_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_comprehensive_organization_data: {
        Args: { org_id: string }
        Returns: Json
      }
      get_membership_workflow_status: {
        Args: { user_id_param: string }
        Returns: Json
      }
      get_organization_admin_summary: {
        Args: { org_id: string }
        Returns: Json
      }
      get_pricing_configuration: {
        Args: {
          p_country_name: string
          p_organization_type: string
          p_entity_type: string
          p_engagement_model: string
          p_membership_status?: string
          p_billing_frequency?: string
        }
        Returns: {
          id: string
          config_name: string
          base_value: number
          calculated_value: number
          unit_symbol: string
          currency_code: string
          membership_discount: number
        }[]
      }
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
      get_user_current_global_model: {
        Args: { user_id_param: string }
        Returns: Json
      }
      safe_delete_fee_component: {
        Args: { component_id: string; cascade_delete?: boolean }
        Returns: Json
      }
      validate_engagement_model_switch: {
        Args: {
          user_id_param: string
          tier_id_param: string
          new_model_id: string
        }
        Returns: Json
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
