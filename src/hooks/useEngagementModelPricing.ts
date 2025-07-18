
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
  // Added field to show original prices for comparison
  originalPrices?: {
    platform_usage_fee_percentage: number;
    base_management_fee: number;
    base_consulting_fee: number;
  };
}

export const useEngagementModelPricing = (
  selectedTier: string | null, 
  profile: any, 
  membershipStatus: 'active' | 'inactive' = 'inactive' // Added parameter to handle membership status
) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModelWithPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagementModelsWithPricing = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading engagement models with subtypes');
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

        console.log('📊 Loaded formulas:', formulas?.length || 0);

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
          // Special handling for Market Place with subtypes
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
              // Apply membership discount if user has active membership
              let platformFeePercentage = generalFormula.platform_usage_fee_percentage || 0;
              let baseManagementFee = generalFormula.base_management_fee || 0;
              let baseConsultingFee = generalFormula.base_consulting_fee || 0;
              
              // Store original prices for comparison
              const originalPrices = {
                platform_usage_fee_percentage: platformFeePercentage,
                base_management_fee: baseManagementFee,
                base_consulting_fee: baseConsultingFee
              };

              // Apply discount if membership is active
              if (membershipStatus === 'active' && generalFormula.membership_discount_percentage) {
                const discountMultiplier = 1 - (generalFormula.membership_discount_percentage / 100);
                platformFeePercentage *= discountMultiplier;
                baseManagementFee *= discountMultiplier;
                baseConsultingFee *= discountMultiplier;
              }

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
                  platform_usage_fee_percentage: platformFeePercentage,
                  base_management_fee: baseManagementFee,
                  base_consulting_fee: baseConsultingFee,
                  advance_payment_percentage: generalFormula.advance_payment_percentage || 0,
                  membership_discount_percentage: generalFormula.membership_discount_percentage || 0,
                },
                originalPrices: membershipStatus === 'active' ? originalPrices : undefined,
                currency
              });
            }

            // Add Market Place Program Managed
            if (programManagedFormula) {
              // Apply membership discount if user has active membership
              let platformFeePercentage = programManagedFormula.platform_usage_fee_percentage || 0;
              let baseManagementFee = programManagedFormula.base_management_fee || 0;
              let baseConsultingFee = programManagedFormula.base_consulting_fee || 0;
              
              // Store original prices for comparison
              const originalPrices = {
                platform_usage_fee_percentage: platformFeePercentage,
                base_management_fee: baseManagementFee,
                base_consulting_fee: baseConsultingFee
              };

              // Apply discount if membership is active
              if (membershipStatus === 'active' && programManagedFormula.membership_discount_percentage) {
                const discountMultiplier = 1 - (programManagedFormula.membership_discount_percentage / 100);
                platformFeePercentage *= discountMultiplier;
                baseManagementFee *= discountMultiplier;
                baseConsultingFee *= discountMultiplier;
              }

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
                  platform_usage_fee_percentage: platformFeePercentage,
                  base_management_fee: baseManagementFee,
                  base_consulting_fee: baseConsultingFee,
                  advance_payment_percentage: programManagedFormula.advance_payment_percentage || 0,
                  membership_discount_percentage: programManagedFormula.membership_discount_percentage || 0,
                },
                originalPrices: membershipStatus === 'active' ? originalPrices : undefined,
                currency
              });
            }
          } 
          // Special handling for Aggregator model
          else if (model.name === 'Aggregator') {
            // For Aggregator, find the formula without subtype
            const aggregatorFormula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              !f.engagement_model_subtype_id // Models without subtypes
            );
            
            console.log('🔍 Looking for Aggregator formula:', {
              modelId: model.id,
              formulaFound: !!aggregatorFormula,
              allFormulas: formulas?.length || 0
            });
            
            // Even if no formula is found, still add the model with empty pricing
            const formula = aggregatorFormula || null;
            
            // Apply membership discount if user has active membership
            let platformFeePercentage = formula?.platform_usage_fee_percentage || 0;
            let baseManagementFee = formula?.base_management_fee || 0;
            let baseConsultingFee = formula?.base_consulting_fee || 0;
            
            // Store original prices for comparison
            const originalPrices = formula ? {
              platform_usage_fee_percentage: platformFeePercentage,
              base_management_fee: baseManagementFee,
              base_consulting_fee: baseConsultingFee
            } : undefined;

            // Apply discount if membership is active
            if (membershipStatus === 'active' && formula?.membership_discount_percentage) {
              const discountMultiplier = 1 - (formula.membership_discount_percentage / 100);
              platformFeePercentage *= discountMultiplier;
              baseManagementFee *= discountMultiplier;
              baseConsultingFee *= discountMultiplier;
            }

            modelsWithPricing.push({
              id: model.id,
              name: model.name,
              displayName: model.name,
              description: model.description,
              formula: formula ? {
                id: formula.id,
                formula_name: formula.formula_name,
                formula_expression: formula.formula_expression,
                platform_usage_fee_percentage: platformFeePercentage,
                base_management_fee: baseManagementFee,
                base_consulting_fee: baseConsultingFee,
                advance_payment_percentage: formula.advance_payment_percentage || 0,
                membership_discount_percentage: formula.membership_discount_percentage || 0,
              } : null,
              originalPrices: membershipStatus === 'active' ? originalPrices : undefined,
              currency
            });
          }
          // For other models, add them as single entries
          else {
            const formula = formulas?.find(f => 
              f.engagement_model_id === model.id && 
              !f.engagement_model_subtype_id // Models without subtypes
            );

            // Apply membership discount if user has active membership
            let platformFeePercentage = formula?.platform_usage_fee_percentage || 0;
            let baseManagementFee = formula?.base_management_fee || 0;
            let baseConsultingFee = formula?.base_consulting_fee || 0;
            
            // Store original prices for comparison
            const originalPrices = formula ? {
              platform_usage_fee_percentage: platformFeePercentage,
              base_management_fee: baseManagementFee,
              base_consulting_fee: baseConsultingFee
            } : undefined;

            // Apply discount if membership is active
            if (membershipStatus === 'active' && formula?.membership_discount_percentage) {
              const discountMultiplier = 1 - (formula.membership_discount_percentage / 100);
              platformFeePercentage *= discountMultiplier;
              baseManagementFee *= discountMultiplier;
              baseConsultingFee *= discountMultiplier;
            }

            modelsWithPricing.push({
              id: model.id,
              name: model.name,
              displayName: model.name,
              description: model.description,
              formula: formula ? {
                id: formula.id,
                formula_name: formula.formula_name,
                formula_expression: formula.formula_expression,
                platform_usage_fee_percentage: platformFeePercentage,
                base_management_fee: baseManagementFee,
                base_consulting_fee: baseConsultingFee,
                advance_payment_percentage: formula.advance_payment_percentage || 0,
                membership_discount_percentage: formula.membership_discount_percentage || 0,
              } : null,
              originalPrices: membershipStatus === 'active' ? originalPrices : undefined,
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
  }, [selectedTier, profile?.country, membershipStatus]);

  return {
    engagementModels,
    loading,
    error,
  };
};
