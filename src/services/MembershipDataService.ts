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
   * Get available pricing tiers with full configuration details
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
   * Get complexity levels with multipliers from master data
   */
  static async getComplexityLevels() {
    try {
      const { data, error } = await supabase
        .from('master_challenge_complexity')
        .select('*')
        .eq('is_active', true)
        .order('level_order');

      if (error) {
        console.error('Error fetching complexity levels:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getComplexityLevels:', error);
      return [];
    }
  }

  /**
   * Get marketplace pricing with complexity breakdown for specific engagement model
   */
  static async getMarketplacePricingWithComplexity(
    country: string,
    organizationType: string,
    entityType: string,
    engagementModel: string,
    membershipStatus: 'Active' | 'Not Active'
  ) {
    try {
      // Get base pricing configuration
      const pricingData = await this.getPricingConfiguration(
        country,
        organizationType,
        entityType,
        engagementModel,
        membershipStatus
      );

      // Get complexity levels
      const complexityLevels = await this.getComplexityLevels();

      // Get engagement model details for platform fee formulas
      const modelDetails = await this.getEngagementModelDetails(engagementModel, country);

      if (!pricingData.length || !complexityLevels.length || !modelDetails?.platform_fee_formulas?.length) {
        return { basePricing: pricingData, complexityPricing: [] };
      }

      // Calculate complexity-based pricing using master data multipliers
      const complexityPricing = complexityLevels.map(complexity => {
        const complexityData = {
          id: complexity.id,
          name: complexity.name,
          level_order: complexity.level_order,
          consulting_multiplier: complexity.consulting_fee_multiplier,
          management_multiplier: complexity.management_fee_multiplier,
          fees: []
        };

        // Calculate fees for each complexity level using platform fee formulas
        modelDetails.platform_fee_formulas.forEach(formula => {
          const baseConsultingFee = formula.base_consulting_fee || 0;
          const baseManagementFee = formula.base_management_fee || 0;
          
          const consultingFee = baseConsultingFee * complexity.consulting_fee_multiplier;
          const managementFee = baseManagementFee * complexity.management_fee_multiplier;
          
          // Apply membership discount if member is active
          const discountPercentage = membershipStatus === 'Active' ? (formula.membership_discount_percentage || 0) : 0;
          const discountMultiplier = 1 - (discountPercentage / 100);
          
          complexityData.fees.push({
            formula_name: formula.formula_name,
            base_consulting_fee: baseConsultingFee,
            base_management_fee: baseManagementFee,
            calculated_consulting_fee: consultingFee * discountMultiplier,
            calculated_management_fee: managementFee * discountMultiplier,
            platform_fee_percentage: formula.platform_usage_fee_percentage || 0,
            advance_payment_percentage: formula.advance_payment_percentage || 25,
            currency_code: formula.master_currencies?.code || 'USD',
            currency_symbol: formula.master_currencies?.symbol || '$',
            membership_discount: discountPercentage,
            original_consulting_fee: consultingFee,
            original_management_fee: managementFee
          });
        });

        return complexityData;
      });

      return {
        basePricing: pricingData,
        complexityPricing
      };
    } catch (error) {
      console.error('Error in getMarketplacePricingWithComplexity:', error);
      return { basePricing: [], complexityPricing: [] };
    }
  }

  /**
   * Get tier configurations by country with full details
   */
  static async getTierConfigurationsByCountry(country: string) {
    try {
      // Get country ID first
      const { data: countryData } = await supabase
        .from('master_countries')
        .select('id')
        .eq('name', country)
        .single();

      if (!countryData) {
        console.error('Country not found:', country);
        return [];
      }

      // Get tier configurations with all related data
      const { data: tierConfigs } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          master_pricing_tiers (
            id,
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
        .eq('is_active', true)
        .order('master_pricing_tiers(level_order)');

      return tierConfigs || [];
    } catch (error) {
      console.error('Error in getTierConfigurationsByCountry:', error);
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
        .ilike('name', country)
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

      return tierConfig || null;
    } catch (error) {
      console.error('Error in getTierConfiguration:', error);
      return null;
    }
  }

  /**
   * Get available engagement models with platform fee details
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
   * Get engagement model details with platform fee formulas and complexity pricing
   */
  static async getEngagementModelDetails(modelName: string, country?: string) {
    try {
      // Get basic model details
      const { data: modelData } = await supabase
        .from('master_engagement_models')
        .select('*')
        .eq('name', modelName)
        .single();

      if (!modelData) return null;

      // Get platform fee formulas for this model with country filter if provided
      let platformFeesQuery = supabase
        .from('master_platform_fee_formulas')
        .select(`
          *,
          master_currencies (
            code,
            symbol
          ),
          master_countries (
            name
          )
        `)
        .eq('engagement_model_id', modelData.id)
        .eq('is_active', true);

      // Filter by country if provided
      if (country) {
        const { data: countryData } = await supabase
          .from('master_countries')
          .select('id')
          .ilike('name', country)
          .single();
        
        if (countryData) {
          platformFeesQuery = platformFeesQuery.eq('country_id', countryData.id);
        }
      }

      const { data: platformFees } = await platformFeesQuery;

      return {
        ...modelData,
        platform_fee_formulas: platformFees || []
      };
    } catch (error) {
      console.error('Error in getEngagementModelDetails:', error);
      return null;
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

  /**
   * Format currency with proper symbol and formatting
   */
  static formatCurrency(amount: number, currencyCode: string = 'USD', symbol?: string): string {
    if (!amount && amount !== 0) return 'N/A';
    
    // Use provided symbol or fall back to Intl formatting
    if (symbol) {
      return `${symbol} ${amount.toLocaleString()}`;
    }
    
    const validCurrency = currencyCode && currencyCode.trim() !== '' ? currencyCode : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
