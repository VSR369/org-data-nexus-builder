
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

// Utility function to convert tier names to proper case for database queries
const normalizeTierName = (tierName: string): string => {
  if (!tierName) return '';
  
  // Convert to proper case (first letter uppercase, rest lowercase)
  return tierName.charAt(0).toUpperCase() + tierName.slice(1).toLowerCase();
};

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

        // Since all engagement models are available to all tiers, 
        // we can directly fetch all active engagement models
        console.log('🔄 Loading all engagement models (tier-agnostic)');

        // Fetch all active engagement models
        const { data: allModels, error: modelsError } = await supabase
          .from('master_engagement_models')
          .select('*')
          .eq('is_user_created', false) // Only get system models
          .order('name');

        if (modelsError) {
          console.error('❌ Error fetching engagement models:', modelsError);
          throw new Error(`Failed to load engagement models: ${modelsError.message}`);
        }

        if (!allModels || allModels.length === 0) {
          console.log('ℹ️ No engagement models found');
          setEngagementModels([]);
          setLoading(false);
          return;
        }

        console.log('✅ Found engagement models:', allModels);

        // Get engagement model IDs
        const engagementModelIds = allModels.map(model => model.id);

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
            engagement_model_id
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
        const modelsWithPricing: EngagementModelWithPricing[] = allModels
          .map(model => {
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
