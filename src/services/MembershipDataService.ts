
import { supabase } from '@/integrations/supabase/client';

export class MembershipDataService {
  /**
   * Get membership fees for a specific organization context
   */
  static async getMembershipFees(country: string, organizationType: string, entityType: string) {
    try {
      const { data, error } = await supabase
        .from('master_seeker_membership_fees')
        .select('*')
        .eq('country', country)
        .eq('organization_type', organizationType)
        .eq('entity_type', entityType);

      if (error) {
        console.error('Error fetching membership fees:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMembershipFees:', error);
      return [];
    }
  }

  /**
   * Get pricing configuration for specific context (returns pre-discounted pricing)
   */
  static async getPricingConfiguration(
    country: string,
    organizationType: string,
    entityType: string,
    engagementModel: string,
    membershipStatus: 'Active' | 'Not Active'
  ) {
    try {
      const { data, error } = await supabase.rpc('get_pricing_configuration', {
        p_country_name: country,
        p_organization_type: organizationType,
        p_entity_type: entityType,
        p_engagement_model: engagementModel,
        p_membership_status: membershipStatus
      });

      if (error) {
        console.error('Error fetching pricing configuration:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPricingConfiguration:', error);
      return [];
    }
  }

  /**
   * Get available pricing tiers
   */
  static async getAvailableTiers() {
    try {
      const { data, error } = await supabase
        .from('master_pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('level_order');

      if (error) {
        console.error('Error fetching pricing tiers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAvailableTiers:', error);
      return [];
    }
  }

  /**
   * Get tier configuration for specific context
   */
  static async getTierConfiguration(tierName: string, country: string) {
    try {
      // Get country ID first
      const { data: countryData } = await supabase
        .from('master_countries')
        .select('id')
        .ilike('name', tierName)
        .single();

      if (!countryData) return null;

      // Get pricing tier ID
      const { data: tierData } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .ilike('name', tierName)
        .single();

      if (!tierData) return null;

      // Get tier configuration
      const { data: tierConfig } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          master_pricing_tiers (
            name,
            level_order,
            description
          ),
          master_analytics_access_types (
            name,
            description,
            features_included
          ),
          master_support_types (
            name,
            service_level,
            response_time,
            availability
          ),
          master_onboarding_types (
            name,
            service_type,
            resources_included
          ),
          master_workflow_templates (
            name,
            template_type,
            customization_level,
            template_count
          ),
          master_currencies (
            code,
            symbol
          )
        `)
        .eq('country_id', countryData.id)
        .eq('pricing_tier_id', tierData.id)
        .eq('is_active', true)
        .single();

      return tierConfig?.data || null;
    } catch (error) {
      console.error('Error in getTierConfiguration:', error);
      return null;
    }
  }

  /**
   * Get available engagement models
   */
  static async getAvailableEngagementModels() {
    try {
      const { data, error } = await supabase
        .from('master_engagement_models')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching engagement models:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAvailableEngagementModels:', error);
      return [];
    }
  }

  /**
   * Normalize tier name for case-insensitive matching
   */
  static normalizeTierName(tierName: string): string {
    if (!tierName) return '';
    return tierName.toLowerCase().trim();
  }

  /**
   * Get user's current activation record
   */
  static async getUserActivationRecord(userId: string) {
    try {
      const { data, error } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching activation record:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserActivationRecord:', error);
      return null;
    }
  }
}
