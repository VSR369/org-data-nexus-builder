import React, { useState, useEffect } from 'react';
import { Users, Code, Headphones, Server } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PricingConfig } from '@/types/pricing';

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const useMembershipPricingData = (
  organizationType: string,
  entityType: string,
  country: string,
  userId?: string
) => {
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading data from Supabase for organization context:', { organizationType, entityType, country, userId });
        
        // Get organization context if userId provided
        let orgContext = null;
        if (userId) {
          const { data } = await supabase.from('organization_context').select('*').eq('user_id', userId).single();
          orgContext = data;
        }

        // Use organization context or lookup IDs by names
        let countryId, orgTypeId, entityTypeId;
        if (orgContext) {
          countryId = orgContext.country_id;
          orgTypeId = orgContext.organization_type_id;
          entityTypeId = orgContext.entity_type_id;
        } else {
          const [countryResult, orgTypeResult, entityTypeResult] = await Promise.all([
            supabase.from('master_countries').select('id').eq('name', country).single(),
            supabase.from('master_organization_types').select('id').eq('name', organizationType).single(),
            supabase.from('master_entity_types').select('id').eq('name', entityType).single()
          ]);
          
          if (!countryResult.error && !orgTypeResult.error && !entityTypeResult.error) {
            countryId = countryResult.data.id;
            orgTypeId = orgTypeResult.data.id;
            entityTypeId = entityTypeResult.data.id;
          }
        }

        // Load data using database functions
        const [membershipFeesData, pricingConfigsData, engagementModelsData] = await Promise.all([
          countryId ? supabase.rpc('get_membership_fees_for_organization', {
            org_country_id: countryId,
            org_type_id: orgTypeId,
            org_entity_type_id: entityTypeId
          }) : { data: [], error: null },
          countryId ? supabase.rpc('get_pricing_configs_for_organization', {
            org_country_id: countryId,
            org_type_id: orgTypeId,
            org_entity_type_id: entityTypeId
          }) : { data: [], error: null },
          supabase.from('master_engagement_models').select('*').order('name')
        ]);

        if (!membershipFeesData.error) {
          setMembershipFees(membershipFeesData.data || []);
        }

        if (!pricingConfigsData.error && pricingConfigsData.data) {
          const configs: PricingConfig[] = pricingConfigsData.data.map((config: any) => ({
            id: config.id,
            country: config.country || country,
            currency: config.currency,
            organizationType: config.organization_type || organizationType,
            entityType: config.entity_type || entityType,
            engagementModel: config.engagement_model_name,
            membershipStatus: config.membership_status,
            quarterlyFee: config.quarterly_fee,
            halfYearlyFee: config.half_yearly_fee,
            annualFee: config.annual_fee,
            platformFeePercentage: config.platform_fee_percentage,
            discountPercentage: config.discount_percentage,
            internalPaasPricing: config.internal_paas_pricing || [],
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          setPricingConfigs(configs);
        }

        if (!engagementModelsData.error) {
          const models: EngagementModel[] = engagementModelsData.data?.map((model: any) => ({
            id: model.id,
            name: model.name,
            description: model.description || '',
            icon: getEngagementModelIcon(model.name)
          })) || [];
          setEngagementModels(models);
        }

        console.log('✅ Loaded all data from Supabase');
      } catch (error) {
        console.error('❌ Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (organizationType && entityType && country) {
      loadMasterData();
    }
  }, [country, organizationType, entityType, userId]);

  return {
    pricingConfigs,
    membershipFees,
    engagementModels,
    loading
  };
};

const getEngagementModelIcon = (modelName: string): React.ReactNode => {
  const name = modelName.toLowerCase();
  if (name.includes('consulting')) return <Users className="w-5 h-5" />;
  if (name.includes('development')) return <Code className="w-5 h-5" />;
  if (name.includes('support')) return <Headphones className="w-5 h-5" />;
  if (name.includes('platform') || name.includes('paas')) return <Server className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};