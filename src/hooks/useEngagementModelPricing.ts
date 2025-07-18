
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
  // Store both subtypes for consolidated display
  subtypes?: {
    general?: {
      formula: any;
      complexityPricing: any[];
    };
    programManaged?: {
      formula: any;
      complexityPricing: any[];
    };
  };
  // Challenge complexity pricing
  complexityPricing?: {
    complexity: string;
    level_order: number;
    management_fee_multiplier: number;
    consulting_fee_multiplier: number;
    management_fee: number;
    consulting_fee: number;
  }[];
}

export const useEngagementModelPricing = (
  selectedTier: string | null, 
  profile: any, 
  membershipStatus: 'active' | 'inactive' = 'inactive'
) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModelWithPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagementModelsWithPricing = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading engagement models with consolidated marketplace');
        console.log('🔄 User membership status:', membershipStatus);

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

        // Fetch challenge complexity data
        const { data: complexityData, error: complexityError } = await supabase
          .from('master_challenge_complexity')
          .select('*')
          .eq('is_active', true)
          .order('level_order');

        if (complexityError) {
          console.error('❌ Error loading challenge complexity:', complexityError);
        }

        console.log('📊 Loaded formulas:', formulas?.length || 0);
        console.log('📊 Loaded complexity levels:', complexityData?.length || 0);

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

        // Create engagement models array with consolidated marketplace
        const modelsWithPricing: EngagementModelWithPricing[] = [];

        allModels.forEach(model => {
          // Special handling for Market Place - consolidate into single card
          if (model.name === 'Market Place') {
            const generalFormula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              f.master_engagement_model_subtypes?.name === 'General'
            );
            
            const programManagedFormula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              f.master_engagement_model_subtypes?.name === 'Program Managed'
            );

            // Calculate complexity pricing for both subtypes
            const calculateComplexityPricing = (formula: any, includeConsulting: boolean = false) => {
              if (!formula || !complexityData) return [];
              
              return complexityData.map(complexity => ({
                complexity: complexity.name,
                level_order: complexity.level_order,
                management_fee_multiplier: complexity.management_fee_multiplier,
                consulting_fee_multiplier: complexity.consulting_fee_multiplier,
                management_fee: formula.base_management_fee * complexity.management_fee_multiplier,
                consulting_fee: includeConsulting ? formula.base_consulting_fee * complexity.consulting_fee_multiplier : 0
              }));
            };

            // Create consolidated Marketplace entry
            if (generalFormula || programManagedFormula) {
              const primaryFormula = generalFormula || programManagedFormula;
              
              modelsWithPricing.push({
                id: model.id,
                name: 'Market Place',
                displayName: 'Market Place',
                description: 'Complete marketplace access with flexible engagement options',
                formula: primaryFormula ? {
                  id: primaryFormula.id,
                  formula_name: primaryFormula.formula_name,
                  formula_expression: primaryFormula.formula_expression,
                  platform_usage_fee_percentage: primaryFormula.platform_usage_fee_percentage,
                  base_management_fee: primaryFormula.base_management_fee,
                  base_consulting_fee: primaryFormula.base_consulting_fee,
                  advance_payment_percentage: primaryFormula.advance_payment_percentage,
                  membership_discount_percentage: primaryFormula.membership_discount_percentage,
                } : null,
                currency,
                subtypes: {
                  general: generalFormula ? {
                    formula: {
                      id: generalFormula.id,
                      formula_name: generalFormula.formula_name,
                      formula_expression: generalFormula.formula_expression,
                      platform_usage_fee_percentage: generalFormula.platform_usage_fee_percentage,
                      base_management_fee: generalFormula.base_management_fee,
                      base_consulting_fee: generalFormula.base_consulting_fee,
                      advance_payment_percentage: generalFormula.advance_payment_percentage,
                      membership_discount_percentage: generalFormula.membership_discount_percentage,
                    },
                    complexityPricing: calculateComplexityPricing(generalFormula, false)
                  } : undefined,
                  programManaged: programManagedFormula ? {
                    formula: {
                      id: programManagedFormula.id,
                      formula_name: programManagedFormula.formula_name,
                      formula_expression: programManagedFormula.formula_expression,
                      platform_usage_fee_percentage: programManagedFormula.platform_usage_fee_percentage,
                      base_management_fee: programManagedFormula.base_management_fee,
                      base_consulting_fee: programManagedFormula.base_consulting_fee,
                      advance_payment_percentage: programManagedFormula.advance_payment_percentage,
                      membership_discount_percentage: programManagedFormula.membership_discount_percentage,
                    },
                    complexityPricing: calculateComplexityPricing(programManagedFormula, true)
                  } : undefined
                }
              });
            }
          } 
          // Handle other models including Aggregator
          else {
            const formula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              !f.engagement_model_subtype_id
            );
            
            console.log(`🔍 Processing ${model.name}:`, {
              modelId: model.id,
              formulaFound: !!formula,
              formulaDetails: formula ? {
                platform_fee: formula.platform_usage_fee_percentage,
                management_fee: formula.base_management_fee,
                consulting_fee: formula.base_consulting_fee
              } : null
            });

            // Calculate complexity pricing for single models
            const calculateComplexityPricing = (formula: any) => {
              if (!formula || !complexityData) return [];
              
              return complexityData.map(complexity => ({
                complexity: complexity.name,
                level_order: complexity.level_order,
                management_fee_multiplier: complexity.management_fee_multiplier,
                consulting_fee_multiplier: complexity.consulting_fee_multiplier,
                management_fee: formula.base_management_fee * complexity.management_fee_multiplier,
                consulting_fee: formula.base_consulting_fee * complexity.consulting_fee_multiplier
              }));
            };

            modelsWithPricing.push({
              id: model.id,
              name: model.name,
              displayName: model.name,
              description: model.description,
              formula: formula ? {
                id: formula.id,
                formula_name: formula.formula_name,
                formula_expression: formula.formula_expression,
                platform_usage_fee_percentage: formula.platform_usage_fee_percentage,
                base_management_fee: formula.base_management_fee,
                base_consulting_fee: formula.base_consulting_fee,
                advance_payment_percentage: formula.advance_payment_percentage,
                membership_discount_percentage: formula.membership_discount_percentage,
              } : null,
              currency,
              complexityPricing: calculateComplexityPricing(formula)
            });
          }
        });

        console.log('✅ Loaded consolidated engagement models:', modelsWithPricing.length);
        console.log('📋 Models loaded:', modelsWithPricing.map(m => ({
          name: m.name,
          hasFormula: !!m.formula,
          hasSubtypes: !!m.subtypes,
          complexityLevels: m.complexityPricing?.length || 0
        })));
        
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
  }, [selectedTier, profile?.country, membershipStatus]);

  return {
    engagementModels,
    loading,
    error,
  };
};
