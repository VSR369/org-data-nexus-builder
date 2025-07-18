
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EnrollmentData {
  activationRecord: any;
  membershipStatus: 'active' | 'inactive';
  selectedTier: string | null;
  selectedEngagementModel: string | null;
  tierConfiguration: any;
  engagementModelDetails: any;
  membershipFees: any[];
  engagementModelPricing: any[];
  profile: any;
  loading: boolean;
  error: string | null;
}

export const useEnrollmentData = (userId: string) => {
  const [data, setData] = useState<EnrollmentData>({
    activationRecord: null,
    membershipStatus: 'inactive',
    selectedTier: null,
    selectedEngagementModel: null,
    tierConfiguration: null,
    engagementModelDetails: null,
    membershipFees: [],
    engagementModelPricing: [],
    profile: null,
    loading: true,
    error: null
  });

  const loadEnrollmentData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      console.log('🔄 Loading comprehensive enrollment data for user:', userId);

      // Get activation record
      const { data: activationData, error: activationError } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activationError) {
        throw new Error(`Failed to load activation data: ${activationError.message}`);
      }

      // Get organization context for user
      const { data: orgContext } = await supabase
        .from('organization_context')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!activationData || !orgContext) {
        console.log('ℹ️ No enrollment data found for user');
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      const membershipStatus = activationData.membership_status === 'Active' ? 'active' : 'inactive';
      const selectedTier = activationData.pricing_tier;
      const selectedEngagementModel = activationData.engagement_model;

      // Load tier configuration if tier is selected
      let tierConfiguration = null;
      if (selectedTier && orgContext.country_id) {
        const { data: tierConfig } = await supabase
          .from('master_tier_configurations')
          .select(`
            *,
            master_pricing_tiers (name, level_order, description),
            master_analytics_access_types (name),
            master_support_types (name, response_time),
            master_onboarding_types (name),
            master_workflow_templates (name, template_count),
            master_currencies (code, symbol)
          `)
          .eq('country_id', orgContext.country_id)
          .eq('pricing_tier_id', (await supabase
            .from('master_pricing_tiers')
            .select('id')
            .eq('name', selectedTier)
            .single()
          ).data?.id)
          .eq('is_active', true)
          .maybeSingle();

        tierConfiguration = tierConfig;
      }

      // Load engagement model details
      let engagementModelDetails = null;
      if (selectedEngagementModel) {
        const { data: modelData } = await supabase
          .from('master_engagement_models')
          .select('*')
          .eq('name', selectedEngagementModel)
          .maybeSingle();

        engagementModelDetails = modelData;
      }

      // Load membership fees
      let membershipFees = [];
      if (orgContext.country_id && orgContext.organization_type_id && orgContext.entity_type_id) {
        const { data: feesData } = await supabase
          .from('master_seeker_membership_fees')
          .select('*')
          .eq('country_id', orgContext.country_id)
          .eq('organization_type_id', orgContext.organization_type_id)
          .eq('entity_type_id', orgContext.entity_type_id);

        membershipFees = feesData || [];
      }

      // Load engagement model pricing
      const engagementModelPricing = [];
      if (selectedEngagementModel && orgContext.country_name && orgContext.organization_type_name && orgContext.entity_type_name) {
        try {
          const { data: pricingData } = await supabase.rpc('get_pricing_configuration', {
            p_country_name: orgContext.country_name,
            p_organization_type: orgContext.organization_type_name,
            p_entity_type: orgContext.entity_type_name,
            p_engagement_model: selectedEngagementModel,
            p_membership_status: membershipStatus === 'active' ? 'Active' : 'Not Active'
          });

          if (pricingData) {
            engagementModelPricing.push(...pricingData);
          }
        } catch (error) {
          console.error('Error loading engagement model pricing:', error);
        }
      }

      // Create profile from org context
      const profile = {
        country: orgContext.country_name,
        organization_type: orgContext.organization_type_name,
        entity_type: orgContext.entity_type_name,
        organization_name: orgContext.organization_name
      };

      setData({
        activationRecord: activationData,
        membershipStatus,
        selectedTier,
        selectedEngagementModel,
        tierConfiguration,
        engagementModelDetails,
        membershipFees,
        engagementModelPricing,
        profile,
        loading: false,
        error: null
      });

      console.log('✅ Loaded comprehensive enrollment data:', {
        membershipStatus,
        selectedTier,
        selectedEngagementModel,
        hasTierConfig: !!tierConfiguration,
        hasModelDetails: !!engagementModelDetails,
        membershipFeesCount: membershipFees.length,
        pricingCount: engagementModelPricing.length
      });

    } catch (error) {
      console.error('❌ Error loading enrollment data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load enrollment data'
      }));
    }
  };

  useEffect(() => {
    if (userId) {
      loadEnrollmentData();
    }
  }, [userId]);

  return {
    ...data,
    refetch: loadEnrollmentData
  };
};
