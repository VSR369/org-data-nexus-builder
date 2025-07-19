
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Briefcase } from 'lucide-react';

interface EngagementModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  formula?: any;
  complexityPricing?: any[];
  currency?: string;
  subtypes?: any;
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

        // Get country ID
        const { data: countryData } = await supabase
          .from('master_countries')
          .select('id')
          .eq('name', profile?.country || 'India')
          .single();

        if (!countryData) {
          setError('Country not found');
          return;
        }

        // Load engagement models with their formulas
        const { data: models } = await supabase
          .from('master_engagement_models')
          .select('*')
          .order('name');

        if (!models) {
          setError('No engagement models found');
          return;
        }

        // Load platform fee formulas for each model
        const enhancedModels: EngagementModel[] = [];

        for (const model of models) {
          // Get formula for this model and country
          const { data: formulaData } = await supabase
            .from('master_platform_fee_formulas')
            .select(`
              *,
              master_currencies(code, symbol)
            `)
            .eq('engagement_model_id', model.id)
            .eq('country_id', countryData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get complexity pricing
          const { data: complexityData } = await supabase
            .from('master_challenge_complexity')
            .select('*')
            .eq('is_active', true)
            .order('level_order');

          let complexityPricing = [];
          if (formulaData && complexityData) {
            complexityPricing = complexityData.map(complexity => ({
              complexity: complexity.name,
              management_fee: (formulaData.base_management_fee || 0) * complexity.management_fee_multiplier,
              consulting_fee: (formulaData.base_consulting_fee || 0) * complexity.consulting_fee_multiplier
            }));
          }

          // Handle special case for Marketplace with subtypes
          let subtypes = null;
          if (model.name === 'Market Place') {
            // Get subtypes for marketplace
            const { data: subtypeData } = await supabase
              .from('master_engagement_model_subtypes')
              .select('*')
              .eq('engagement_model_id', model.id)
              .eq('is_active', true);

            if (subtypeData && subtypeData.length > 0) {
              subtypes = {};
              for (const subtype of subtypeData) {
                // Get formula for this subtype
                const { data: subtypeFormula } = await supabase
                  .from('master_platform_fee_formulas')
                  .select('*')
                  .eq('engagement_model_subtype_id', subtype.id)
                  .eq('country_id', countryData.id)
                  .eq('is_active', true)
                  .maybeSingle();

                if (subtypeFormula) {
                  const subtypeComplexityPricing = complexityData?.map(complexity => ({
                    complexity: complexity.name,
                    management_fee: (subtypeFormula.base_management_fee || 0) * complexity.management_fee_multiplier,
                    consulting_fee: (subtypeFormula.base_consulting_fee || 0) * complexity.consulting_fee_multiplier
                  })) || [];

                  subtypes[subtype.name.toLowerCase().replace(' ', '')] = {
                    formula: subtypeFormula,
                    complexityPricing: subtypeComplexityPricing
                  };
                }
              }
            }
          }

          enhancedModels.push({
            id: model.id,
            name: model.name,
            displayName: model.name,
            description: model.description || `${model.name} engagement model for innovation challenges`,
            icon: getEngagementModelIcon(model.name),
            formula: formulaData,
            complexityPricing,
            currency: formulaData?.master_currencies?.code || 'USD',
            subtypes
          });
        }

        setEngagementModels(enhancedModels);
      } catch (err) {
        console.error('Error loading engagement model pricing:', err);
        setError('Failed to load engagement model pricing data');
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
