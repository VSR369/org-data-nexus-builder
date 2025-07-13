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
      pricing_configs: {
        Row: {
          annual_fee: number | null
          config_id: string
          country: string
          country_id: string
          created_at: string | null
          currency: string | null
          discount_percentage: number | null
          engagement_model: string
          engagement_model_id: string
          entity_type: string
          entity_type_id: string
          half_yearly_fee: number | null
          id: string
          internal_paas_pricing: Json | null
          membership_status: string
          organization_type: string
          organization_type_id: string
          platform_fee_percentage: number | null
          quarterly_fee: number | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          annual_fee?: number | null
          config_id: string
          country: string
          country_id: string
          created_at?: string | null
          currency?: string | null
          discount_percentage?: number | null
          engagement_model: string
          engagement_model_id: string
          entity_type: string
          entity_type_id: string
          half_yearly_fee?: number | null
          id?: string
          internal_paas_pricing?: Json | null
          membership_status: string
          organization_type: string
          organization_type_id: string
          platform_fee_percentage?: number | null
          quarterly_fee?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          annual_fee?: number | null
          config_id?: string
          country?: string
          country_id?: string
          created_at?: string | null
          currency?: string | null
          discount_percentage?: number | null
          engagement_model?: string
          engagement_model_id?: string
          entity_type?: string
          entity_type_id?: string
          half_yearly_fee?: number | null
          id?: string
          internal_paas_pricing?: Json | null
          membership_status?: string
          organization_type?: string
          organization_type_id?: string
          platform_fee_percentage?: number | null
          quarterly_fee?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_configs_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configs_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "pricing_configs_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configs_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configs_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "pricing_configs_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_configs_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
        ]
      }
      pricing_overrides: {
        Row: {
          country_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          engagement_model_id: string | null
          entity_type_id: string | null
          id: string
          is_active: boolean | null
          membership_status: string | null
          organization_type_id: string | null
          override_currency: string | null
          override_field: string
          override_value: number
          updated_at: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          engagement_model_id?: string | null
          entity_type_id?: string | null
          id?: string
          is_active?: boolean | null
          membership_status?: string | null
          organization_type_id?: string | null
          override_currency?: string | null
          override_field: string
          override_value: number
          updated_at?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          engagement_model_id?: string | null
          entity_type_id?: string | null
          id?: string
          is_active?: boolean | null
          membership_status?: string | null
          organization_type_id?: string | null
          override_currency?: string | null
          override_field?: string
          override_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_overrides_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "master_countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_overrides_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "pricing_overrides_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_overrides_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "master_entity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_overrides_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "pricing_overrides_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "master_organization_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_overrides_organization_type_id_fkey"
            columns: ["organization_type_id"]
            isOneToOne: false
            referencedRelation: "organization_context"
            referencedColumns: ["organization_type_id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          adjustment_type: string
          adjustment_value: number
          condition_type: string
          condition_value: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          rule_name: string
          rule_type: string
          target_field: string
          updated_at: string | null
        }
        Insert: {
          adjustment_type: string
          adjustment_value: number
          condition_type: string
          condition_value: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name: string
          rule_type: string
          target_field: string
          updated_at?: string | null
        }
        Update: {
          adjustment_type?: string
          adjustment_value?: number
          condition_type?: string
          condition_value?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name?: string
          rule_type?: string
          target_field?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_templates: {
        Row: {
          base_annual_fee: number | null
          base_currency: string | null
          base_half_yearly_fee: number | null
          base_platform_fee_percentage: number | null
          base_quarterly_fee: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          engagement_model: string
          engagement_model_id: string
          id: string
          internal_paas_pricing: Json | null
          is_active: boolean | null
          template_name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          base_annual_fee?: number | null
          base_currency?: string | null
          base_half_yearly_fee?: number | null
          base_platform_fee_percentage?: number | null
          base_quarterly_fee?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          engagement_model: string
          engagement_model_id: string
          id?: string
          internal_paas_pricing?: Json | null
          is_active?: boolean | null
          template_name: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          base_annual_fee?: number | null
          base_currency?: string | null
          base_half_yearly_fee?: number | null
          base_platform_fee_percentage?: number | null
          base_quarterly_fee?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          engagement_model?: string
          engagement_model_id?: string
          id?: string
          internal_paas_pricing?: Json | null
          is_active?: boolean | null
          template_name?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_templates_engagement_model_id_fkey"
            columns: ["engagement_model_id"]
            isOneToOne: false
            referencedRelation: "master_engagement_models"
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
    }
    Functions: {
      generate_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_membership_fees_for_organization: {
        Args: {
          org_country_id: string
          org_type_id: string
          org_entity_type_id: string
        }
        Returns: {
          id: string
          monthly_amount: number
          monthly_currency: string
          quarterly_amount: number
          quarterly_currency: string
          half_yearly_amount: number
          half_yearly_currency: string
          annual_amount: number
          annual_currency: string
          description: string
        }[]
      }
      get_pricing_configs_for_organization: {
        Args: {
          org_country_id: string
          org_type_id: string
          org_entity_type_id: string
          engagement_model_id?: string
        }
        Returns: {
          id: string
          config_id: string
          engagement_model_name: string
          membership_status: string
          quarterly_fee: number
          half_yearly_fee: number
          annual_fee: number
          currency: string
          platform_fee_percentage: number
          discount_percentage: number
          internal_paas_pricing: Json
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
