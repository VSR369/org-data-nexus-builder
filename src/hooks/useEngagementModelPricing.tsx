
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Briefcase } from 'lucide-react';

interface ComplexityPricing {
  complexity: string;
  level_order: number;
  management_fee_multiplier: number;
  consulting_fee_multiplier: number;
  management_fee: number;
  consulting_fee: number;
}

interface SubtypeData {
  formula: {
    id: string;
    formula_name: string;
    formula_expression: string;
    platform_usage_fee_percentage: number;
    base_management_fee: number;
    base_consulting_fee: number;
    advance_payment_percentage: number;
    membership_discount_percentage: number;
  };
  complexityPricing: ComplexityPricing[];
}

interface EngagementModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  formula?: {
    id: string;
    formula_name: string;
    formula_expression: string;
    platform_usage_fee_percentage: number;
    base_management_fee: number;
    base_consulting_fee: number;
    advance_payment_percentage: number;
    membership_discount_percentage: number;
  };
  complexityPricing?: ComplexityPricing[];
  currency: string;
  subtypes?: {
    general?: SubtypeData;
    programManaged?: SubtypeData;
  };
  additionalServices?: {
    analytics: string;
    support: string;
    onboarding: string;
    workflow: string;
  };
}

export const useEngagementModelPricing = (
  selectedTier: string | null,
  profile: any,
  membershipStatus: 'active' | 'inactive' = 'inactive'
) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEngagementModelPricing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading engagement models with pricing details');
        console.log('📊 Membership status:', membershipStatus);

        // Get country ID for filtering formulas
        const { data: countryData } = await supabase
          .from('master_countries')
          .select('id, name')
          .eq('name', profile?.country || 'India')
          .single();

        if (!countryData) {
          throw new Error('Country not found');
        }

        // Load engagement models
        const { data: models, error: modelsError } = await supabase
          .from('master_engagement_models')
          .select('*')
          .eq('is_user_created', false)
          .order('name');

        if (modelsError) throw modelsError;

        // Load complexity levels
        const { data: complexityData, error: complexityError } = await supabase
          .from('master_challenge_complexity')
          .select('*')
          .eq('is_active', true)
          .order('level_order');

        if (complexityError) throw complexityError;

        // Load all platform fee formulas for the country
        const { data: formulas, error: formulasError } = await supabase
          .from('master_platform_fee_formulas')
          .select(`
            *,
            master_engagement_model_subtypes(
              id, name, description
            )
          `)
          .eq('country_id', countryData.id)
          .eq('is_active', true);

        if (formulasError) throw formulasError;

        console.log('📋 Loaded formulas:', formulas?.length || 0);
        console.log('🎯 Complexity levels:', complexityData?.length || 0);

        // Get currency for the country
        const { data: currencyData } = await supabase
          .from('master_currencies')
          .select('code, symbol')
          .eq('country', profile?.country || 'India')
          .single();

        const currency = currencyData?.code || 'INR';

        const enhancedModels: EngagementModel[] = [];

        if (models) {
          for (const model of models) {
            console.log(`🔧 Processing model: ${model.name}`);

            if (model.name === 'Market Place') {
              // Handle Marketplace with subtypes
              const generalFormula = formulas?.find(f => 
                f.engagement_model_id === model.id && 
                f.master_engagement_model_subtypes?.name === 'General'
              );
              
              const programManagedFormula = formulas?.find(f => 
                f.engagement_model_id === model.id && 
                f.master_engagement_model_subtypes?.name === 'Program Managed'
              );

              console.log('🏪 Marketplace formulas:', {
                general: !!generalFormula,
                programManaged: !!programManagedFormula
              });

              const calculateComplexityPricing = (formula: any, includeConsulting: boolean = false): ComplexityPricing[] => {
                if (!formula || !complexityData) return [];
                
                return complexityData.map(complexity => {
                  const managementFee = formula.base_management_fee * complexity.management_fee_multiplier;
                  const consultingFee = includeConsulting ? formula.base_consulting_fee * complexity.consulting_fee_multiplier : 0;
                  
                  return {
                    complexity: complexity.name,
                    level_order: complexity.level_order,
                    management_fee_multiplier: complexity.management_fee_multiplier,
                    consulting_fee_multiplier: complexity.consulting_fee_multiplier,
                    management_fee: managementFee,
                    consulting_fee: consultingFee
                  };
                });
              };

              if (generalFormula || programManagedFormula) {
                const primaryFormula = generalFormula || programManagedFormula;
                
                enhancedModels.push({
                  id: model.id,
                  name: 'Market Place',
                  displayName: 'Market Place',
                  description: 'Complete marketplace access with flexible engagement options',
                  icon: <Users className="w-5 h-5" />,
                  formula: primaryFormula ? {
                    id: primaryFormula.id,
                    formula_name: primaryFormula.formula_name,
                    formula_expression: primaryFormula.formula_expression,
                    platform_usage_fee_percentage: primaryFormula.platform_usage_fee_percentage,
                    base_management_fee: primaryFormula.base_management_fee,
                    base_consulting_fee: primaryFormula.base_consulting_fee,
                    advance_payment_percentage: primaryFormula.advance_payment_percentage,
                    membership_discount_percentage: membershipStatus === 'active' ? primaryFormula.membership_discount_percentage : 0,
                  } : undefined,
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
                        membership_discount_percentage: membershipStatus === 'active' ? generalFormula.membership_discount_percentage : 0,
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
                        membership_discount_percentage: membershipStatus === 'active' ? programManagedFormula.membership_discount_percentage : 0,
                      },
                      complexityPricing: calculateComplexityPricing(programManagedFormula, true)
                    } : undefined
                  }
                });
              }
            } else {
              // Handle Aggregator and other models
              const formula = formulas?.find(f => 
                f.engagement_model_id === model.id && 
                !f.engagement_model_subtype_id
              );

              console.log(`🔧 ${model.name} formula:`, !!formula);

              const calculateComplexityPricing = (formula: any): ComplexityPricing[] => {
                if (!formula || !complexityData) return [];
                
                return complexityData.map(complexity => {
                  const managementFee = formula.base_management_fee * complexity.management_fee_multiplier;
                  const consultingFee = formula.base_consulting_fee * complexity.consulting_fee_multiplier;
                  
                  return {
                    complexity: complexity.name,
                    level_order: complexity.level_order,
                    management_fee_multiplier: complexity.management_fee_multiplier,
                    consulting_fee_multiplier: complexity.consulting_fee_multiplier,
                    management_fee: managementFee,
                    consulting_fee: consultingFee
                  };
                });
              };

              // Add additional services for Aggregator
              const additionalServices = model.name === 'Aggregator' ? {
                analytics: 'No Analytics',
                support: 'Basic Support',
                onboarding: 'Self Service',
                workflow: 'Fixed Template'
              } : undefined;

              enhancedModels.push({
                id: model.id,
                name: model.name,
                displayName: model.name,
                description: model.description || `${model.name} engagement model for innovation challenges`,
                icon: getEngagementModelIcon(model.name),
                formula: formula ? {
                  id: formula.id,
                  formula_name: formula.formula_name,
                  formula_expression: formula.formula_expression,
                  platform_usage_fee_percentage: formula.platform_usage_fee_percentage,
                  base_management_fee: formula.base_management_fee,
                  base_consulting_fee: formula.base_consulting_fee,
                  advance_payment_percentage: formula.advance_payment_percentage,
                  membership_discount_percentage: membershipStatus === 'active' ? formula.membership_discount_percentage : 0,
                } : undefined,
                complexityPricing: calculateComplexityPricing(formula),
                currency,
                additionalServices
              });
            }
          }
        }

        console.log('✅ Enhanced models:', enhancedModels.length);
        console.log('📊 Models with pricing:', enhancedModels.map(m => ({
          name: m.name,
          hasFormula: !!m.formula,
          hasSubtypes: !!m.subtypes,
          complexityCount: m.complexityPricing?.length || 0,
          subtypeData: m.subtypes ? Object.keys(m.subtypes) : []
        })));

        setEngagementModels(enhancedModels);
      } catch (err) {
        console.error('❌ Error loading engagement model pricing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load engagement model pricing data');
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      loadEngagementModelPricing();
    }
  }, [selectedTier, profile, membershipStatus]);

  return { engagementModels, loading, error };
};

const getEngagementModelIcon = (modelName: string): React.ReactNode => {
  const name = modelName.toLowerCase();
  if (name.includes('aggregator')) return <Briefcase className="w-5 h-5" />;
  if (name.includes('market')) return <Users className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};
