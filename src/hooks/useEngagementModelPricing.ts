
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
  subtype?: string;
  displayName: string;
}

export const useEngagementModelPricing = (selectedTier: string | null, profile: any) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModelWithPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagementModelsWithPricing = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading engagement models with subtypes');

        // Fetch all active engagement models
        const { data: allModels, error: modelsError } = await supabase
          .from('master_engagement_models')
          .select('*')
          .eq('is_user_created', false)
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

        // Get country for filtering formulas
        const profileCountry = profile?.country || 'India';
        
        // Fetch platform fee formulas with subtype information
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
            engagement_model_subtype_id,
            country_id,
            master_engagement_model_subtypes!inner(
              id,
              name,
              description
            ),
            master_countries!inner(
              name
            )
          `)
          .eq('is_active', true)
          .eq('formula_type', 'structured')
          .eq('master_countries.name', profileCountry);

        if (formulaError) {
          console.error('❌ Error loading formulas:', formulaError);
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

        // Create engagement models array with subtypes
        const modelsWithPricing: EngagementModelWithPricing[] = [];

        allModels.forEach(model => {
          if (model.name === 'Market Place') {
            // For Market Place, create separate entries for General and Program Managed
            const generalFormula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              f.master_engagement_model_subtypes?.name === 'General'
            );
            
            const programManagedFormula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              f.master_engagement_model_subtypes?.name === 'Program Managed'
            );

            // Add Market Place General
            if (generalFormula) {
              modelsWithPricing.push({
                id: `${model.id}-general`,
                name: 'Market Place',
                displayName: 'Market Place General',
                description: 'Direct marketplace access with general support',
                subtype: 'General',
                formula: {
                  id: generalFormula.id,
                  formula_name: generalFormula.formula_name,
                  formula_expression: generalFormula.formula_expression,
                  platform_usage_fee_percentage: generalFormula.platform_usage_fee_percentage || 0,
                  base_management_fee: generalFormula.base_management_fee || 0,
                  base_consulting_fee: generalFormula.base_consulting_fee || 0,
                  advance_payment_percentage: generalFormula.advance_payment_percentage || 0,
                  membership_discount_percentage: generalFormula.membership_discount_percentage || 0,
                },
                currency
              });
            }

            // Add Market Place Program Managed
            if (programManagedFormula) {
              modelsWithPricing.push({
                id: `${model.id}-program-managed`,
                name: 'Market Place',
                displayName: 'Market Place Program Managed',
                description: 'Marketplace access with comprehensive program management',
                subtype: 'Program Managed',
                formula: {
                  id: programManagedFormula.id,
                  formula_name: programManagedFormula.formula_name,
                  formula_expression: programManagedFormula.formula_expression,
                  platform_usage_fee_percentage: programManagedFormula.platform_usage_fee_percentage || 0,
                  base_management_fee: programManagedFormula.base_management_fee || 0,
                  base_consulting_fee: programManagedFormula.base_consulting_fee || 0,
                  advance_payment_percentage: programManagedFormula.advance_payment_percentage || 0,
                  membership_discount_percentage: programManagedFormula.membership_discount_percentage || 0,
                },
                currency
              });
            }
          } else {
            // For other models, add them as single entries
            const formula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              !f.engagement_model_subtype_id // Models without subtypes
            );

            modelsWithPricing.push({
              id: model.id,
              name: model.name,
              displayName: model.name,
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
            });
          }
        });

        console.log('✅ Loaded engagement models with subtypes:', modelsWithPricing.length);
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
