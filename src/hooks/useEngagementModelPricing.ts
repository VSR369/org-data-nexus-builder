
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EngagementModelWithPricing {
  id: string;
  name: string;
  description: string | null;
  formula: {
    id: string;
    formula_name: string;
    formula_expression: string;
    platform_usage_fee_percentage: number;
    base_management_fee: number;
    base_consulting_fee: number;
    advance_payment_percentage: number;
    membership_discount_percentage: number;
  } | null;
  currency: string;
}

export const useEngagementModelPricing = (selectedTier: string | null, profile: any) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModelWithPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagementModelsWithPricing = async () => {
      if (!selectedTier) {
        setEngagementModels([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading engagement models for tier:', selectedTier);

        // Convert tier to lowercase for database queries (since we store it lowercase)
        const tierForQuery = selectedTier.toLowerCase();
        console.log('🔽 Using tier for database query:', tierForQuery);

        // First, get the tier ID using lowercase name
        const { data: tierData, error: tierError } = await supabase
          .from('master_pricing_tiers')
          .select('id')
          .eq('name', tierForQuery)
          .eq('is_active', true)
          .single();

        if (tierError) {
          console.error('❌ Tier query error:', tierError);
          throw new Error(`Failed to find tier: ${tierError.message}`);
        }

        if (!tierData) {
          throw new Error(`Tier "${selectedTier}" not found`);
        }

        console.log('✅ Found tier data:', tierData);

        // Get engagement models allowed for this tier
        const { data: tierModelAccess, error: accessError } = await supabase
          .from('master_tier_engagement_model_access')
          .select(`
            engagement_model_id,
            is_allowed,
            master_engagement_models (
              id,
              name,
              description
            )
          `)
          .eq('pricing_tier_id', tierData.id)
          .eq('is_active', true)
          .eq('is_allowed', true);

        if (accessError) {
          console.error('❌ Access query error:', accessError);
          throw new Error(`Failed to load tier access: ${accessError.message}`);
        }

        if (!tierModelAccess || tierModelAccess.length === 0) {
          console.log('ℹ️ No engagement models found for tier:', selectedTier);
          setEngagementModels([]);
          setLoading(false);
          return;
        }

        console.log('✅ Found tier model access:', tierModelAccess);

        // Get engagement model IDs
        const engagementModelIds = tierModelAccess
          .map(access => access.engagement_model_id)
          .filter(Boolean);

        // Fetch platform fee formulas for these engagement models
        const { data: formulas, error: formulaError } = await supabase
          .from('master_platform_fee_formulas')
          .select(`
            id,
            formula_name,
            formula_expression,
            platform_usage_fee_percentage,
            base_management_fee,
            base_consulting_fee,
            advance_payment_percentage,
            membership_discount_percentage,
            engagement_model_id,
            master_engagement_models (
              id,
              name,
              description
            )
          `)
          .in('engagement_model_id', engagementModelIds)
          .eq('is_active', true)
          .eq('formula_type', 'structured');

        if (formulaError) {
          console.error('❌ Error loading formulas:', formulaError);
          // Continue without formulas rather than failing completely
        }

        // Get currency for the country
        let currency = 'USD';
        if (profile?.country) {
          const { data: currencyData } = await supabase
            .from('master_currencies')
            .select('code')
            .eq('country', profile.country)
            .single();
          
          if (currencyData?.code) {
            currency = currencyData.code;
          }
        }

        // Combine the data
        const modelsWithPricing: EngagementModelWithPricing[] = tierModelAccess
          .map(access => {
            const model = access.master_engagement_models;
            if (!model) return null;

            const formula = formulas?.find(f => f.engagement_model_id === model.id);

            return {
              id: model.id,
              name: model.name,
              description: model.description,
              formula: formula ? {
                id: formula.id,
                formula_name: formula.formula_name,
                formula_expression: formula.formula_expression,
                platform_usage_fee_percentage: formula.platform_usage_fee_percentage || 0,
                base_management_fee: formula.base_management_fee || 0,
                base_consulting_fee: formula.base_consulting_fee || 0,
                advance_payment_percentage: formula.advance_payment_percentage || 0,
                membership_discount_percentage: formula.membership_discount_percentage || 0,
              } : null,
              currency
            };
          })
          .filter(Boolean) as EngagementModelWithPricing[];

        console.log('✅ Loaded engagement models with pricing:', modelsWithPricing.length);
        setEngagementModels(modelsWithPricing);

      } catch (err) {
        console.error('❌ Error loading engagement models with pricing:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load engagement models';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementModelsWithPricing();
  }, [selectedTier, profile?.country]);

  return {
    engagementModels,
    loading,
    error,
  };
};
