
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TierConfiguration {
  id: string;
  pricing_tier_name: string;
  level_order: number;
  analytics_access_name: string;
  analytics_access_description?: string;
  analytics_features_included?: string[];
  analytics_dashboard_access?: boolean;
  support_type_name: string;
  support_type_description?: string;
  support_service_level?: string;
  support_response_time?: string;
  support_availability?: string;
  onboarding_type_name: string;
  onboarding_type_description?: string;
  onboarding_service_type?: string;
  onboarding_resources_included?: string[];
  workflow_template_name: string;
  workflow_template_description?: string;
  workflow_template_type?: string;
  workflow_customization_level?: string;
  workflow_template_count?: number;
  workflow_fields_config?: Record<string, any>;
  monthly_challenge_limit: number | null;
  solutions_per_challenge: number;
  allows_overage: boolean;
  fixed_charge_per_challenge: number;
  currency_symbol: string;
  currency_code: string;
}

export const useTierConfigurations = (countryName?: string) => {
  const [tierConfigurations, setTierConfigurations] = useState<TierConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTierConfigurations = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading enhanced tier configurations for country:', countryName);

        // Get country ID first if country name is provided
        let countryId = null;
        if (countryName) {
          const { data: countryData } = await supabase
            .from('master_countries')
            .select('id')
            .eq('name', countryName)
            .single();
          
          countryId = countryData?.id;
        }

        // Build enhanced query for tier configurations with all master data
        let query = supabase
          .from('master_tier_configurations')
          .select(`
            id,
            pricing_tier_id,
            monthly_challenge_limit,
            solutions_per_challenge,
            allows_overage,
            fixed_charge_per_challenge,
            analytics_access_id,
            support_type_id,
            onboarding_type_id,
            workflow_template_id,
            currency_id,
            master_pricing_tiers (
              name,
              level_order,
              description
            ),
            master_analytics_access_types (
              name,
              description,
              dashboard_access,
              features_included
            ),
            master_support_types (
              name,
              description,
              service_level,
              response_time,
              availability
            ),
            master_onboarding_types (
              name,
              description,
              service_type,
              resources_included
            ),
            master_workflow_templates (
              name,
              description,
              template_type,
              customization_level,
              template_count,
              fields_config
            ),
            master_currencies (
              code,
              symbol
            )
          `)
          .eq('is_active', true);

        // Filter by country if provided
        if (countryId) {
          query = query.eq('country_id', countryId);
        }

        const { data, error: queryError } = await query.order('pricing_tier_id');

        if (queryError) {
          throw new Error(`Failed to load tier configurations: ${queryError.message}`);
        }

        if (!data || data.length === 0) {
          console.log('ℹ️ No tier configurations found for country:', countryName);
          setTierConfigurations([]);
          setLoading(false);
          return;
        }

        // Transform the data with all detailed fields
        const configurations: TierConfiguration[] = data
          .map(config => {
            const tier = config.master_pricing_tiers;
            const analytics = config.master_analytics_access_types;
            const support = config.master_support_types;
            const onboarding = config.master_onboarding_types;
            const workflow = config.master_workflow_templates;
            const currency = config.master_currencies;

            if (!tier) return null;

            return {
              id: config.id,
              pricing_tier_name: tier.name,
              level_order: tier.level_order,
              // Analytics details
              analytics_access_name: analytics?.name || 'Basic',
              analytics_access_description: analytics?.description,
              analytics_features_included: analytics?.features_included || [],
              analytics_dashboard_access: analytics?.dashboard_access || false,
              // Support details
              support_type_name: support?.name || 'Standard',
              support_type_description: support?.description,
              support_service_level: support?.service_level,
              support_response_time: support?.response_time,
              support_availability: support?.availability,
              // Onboarding details
              onboarding_type_name: onboarding?.name || 'Self-Service',
              onboarding_type_description: onboarding?.description,
              onboarding_service_type: onboarding?.service_type,
              onboarding_resources_included: onboarding?.resources_included || [],
              // Workflow details
              workflow_template_name: workflow?.name || 'Standard',
              workflow_template_description: workflow?.description,
              workflow_template_type: workflow?.template_type,
              workflow_customization_level: workflow?.customization_level,
              workflow_template_count: workflow?.template_count,
              workflow_fields_config: workflow?.fields_config,
              // Pricing details
              monthly_challenge_limit: config.monthly_challenge_limit,
              solutions_per_challenge: config.solutions_per_challenge,
              allows_overage: config.allows_overage,
              fixed_charge_per_challenge: config.fixed_charge_per_challenge,
              currency_symbol: currency?.symbol || '$',
              currency_code: currency?.code || 'USD'
            };
          })
          .filter(Boolean) as TierConfiguration[];

        // Sort by level order
        configurations.sort((a, b) => a.level_order - b.level_order);

        console.log('✅ Loaded enhanced tier configurations:', configurations.length);
        setTierConfigurations(configurations);

      } catch (err) {
        console.error('❌ Error loading tier configurations:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load tier configurations';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTierConfigurations();
  }, [countryName]);

  return {
    tierConfigurations,
    loading,
    error,
  };
};
