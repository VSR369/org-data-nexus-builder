
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TierConfiguration {
  id: string;
  pricing_tier_id: string;
  pricing_tier_name: string;
  level_order: number;
  country_id: string;
  country_name: string;
  currency_id: string;
  currency_name: string;
  currency_code: string;
  currency_symbol: string;
  fixed_charge_per_challenge: number;
  monthly_challenge_limit: number | null;
  solutions_per_challenge: number;
  allows_overage: boolean;
  analytics_access_name: string | null;
  support_type_name: string | null;
  onboarding_type_name: string | null;
  workflow_template_name: string | null;
  is_active: boolean;
}

export function useTierConfigurations(countryName?: string) {
  const [tierConfigurations, setTierConfigurations] = useState<TierConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadTierConfigurations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('master_tier_configurations')
        .select(`
          *,
          pricing_tier:master_pricing_tiers(name, level_order),
          country:master_countries(name),
          currency:master_currencies(name, code, symbol),
          analytics_access:master_analytics_access_types(name),
          onboarding_type:master_onboarding_types(name),
          support_type:master_support_types(name),
          workflow_template:master_workflow_templates(name)
        `)
        .eq('is_active', true);

      if (countryName) {
        // Join with countries table to filter by country name
        const { data: countryData } = await supabase
          .from('master_countries')
          .select('id')
          .eq('name', countryName)
          .single();

        if (countryData) {
          query = query.eq('country_id', countryData.id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      const processedData = (data || []).map((item: any) => ({
        id: item.id,
        pricing_tier_id: item.pricing_tier_id,
        pricing_tier_name: item.pricing_tier?.name || 'Unknown Tier',
        level_order: item.pricing_tier?.level_order || 0,
        country_id: item.country_id,
        country_name: item.country?.name || 'Unknown Country',
        currency_id: item.currency_id,
        currency_name: item.currency?.name || 'Unknown Currency',
        currency_code: item.currency?.code || 'USD',
        currency_symbol: item.currency?.symbol || '$',
        fixed_charge_per_challenge: item.fixed_charge_per_challenge || 0,
        monthly_challenge_limit: item.monthly_challenge_limit,
        solutions_per_challenge: item.solutions_per_challenge || 1,
        allows_overage: item.allows_overage || false,
        analytics_access_name: item.analytics_access?.name || null,
        support_type_name: item.support_type?.name || null,
        onboarding_type_name: item.onboarding_type?.name || null,
        workflow_template_name: item.workflow_template?.name || null,
        is_active: item.is_active
      }));

      // Sort by level_order after processing the data
      const sortedData = processedData.sort((a, b) => a.level_order - b.level_order);

      setTierConfigurations(sortedData);
    } catch (error) {
      console.error('Error loading tier configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load tier configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTierConfigurations();
  }, [countryName]);

  return {
    tierConfigurations,
    loading,
    refreshTierConfigurations: loadTierConfigurations,
  };
}
