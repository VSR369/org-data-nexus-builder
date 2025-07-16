import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MasterDataItem {
  id?: string;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  is_user_created?: boolean;
  category_type?: string;
  workflow_config?: any;
  is_active?: boolean;
  organization_type_id?: string;
  organization_category_id?: string;
  department_id?: string;
  is_default?: boolean;
  // Pricing tiers specific
  level_order?: number;
  // System configurations specific
  config_key?: string;
  config_value?: string;
  data_type?: string;
  category?: string;
  is_system_config?: boolean;
  // Fee components specific
  component_type?: string;
  // Platform fee formulas specific
  engagement_model_id?: string;
  formula_name?: string;
  formula_expression?: string;
  variables?: any;
  // Advance payment types specific
  percentage_of_platform_fee?: number;
  // Pricing parameters specific
  country_id?: string;
  currency_id?: string;
  entity_type_id?: string;
  fee_component_id?: string;
  amount?: number;
  unit_of_measure_id?: string;
  effective_from?: string;
  effective_to?: string;
  // Engagement model subtypes specific
  required_fields?: any;
  optional_fields?: any;
  // Tier restrictions specific
  pricing_tier_id?: string;
  engagement_model_subtype_id?: string;
  is_allowed?: boolean;
  [key: string]: any;
}

type TableName = 
  | 'master_countries'
  | 'master_currencies'
  | 'master_organization_types'
  | 'master_entity_types'
  | 'master_engagement_models'
  | 'master_industry_segments'
  | 'master_capability_levels'
  | 'master_units_of_measure'
  | 'master_billing_frequencies'
  | 'master_membership_statuses'
  | 'master_departments'
  | 'master_sub_departments'
  | 'master_team_units'
  | 'master_categories'
  | 'master_sub_categories'
  | 'master_domain_groups'
  | 'master_competency_capabilities'
  | 'master_communication_types'
  | 'master_reward_types'
  | 'master_organization_categories'
  | 'master_seeker_membership_fees'
  | 'master_pricing_tiers'
  | 'master_engagement_model_subtypes'
  | 'master_fee_components'
  | 'master_platform_fee_formulas'
  | 'master_advance_payment_types'
  | 'tier_engagement_model_restrictions'
  
  | 'master_system_configurations'
  | 'master_challenge_complexity'
  | 'master_support_types'
  | 'master_analytics_access_types'
  | 'master_workflow_templates'
  | 'master_onboarding_types'
  | 'master_tier_configurations'
  | 'master_tier_engagement_model_access'
  | 'master_challenge_overage_fees'
  | 'master_system_feature_access';

export function useMasterDataCRUD(tableName: TableName) {
  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      setLoading(true);
      
      let query;
      
      if (tableName === 'master_platform_fee_formulas') {
        // Special case for platform fee formulas - join with engagement models to get readable names
        query = supabase
          .from(tableName)
          .select(`
            *,
            engagement_model:master_engagement_models(name),
            country:master_countries(name),
            currency:master_currencies(name, code, symbol),
            engagement_model_subtype:master_engagement_model_subtypes(name)
          `)
          .order('created_at', { ascending: false });
      } else if (tableName === 'master_tier_configurations') {
        query = supabase
          .from(tableName)
          .select(`
            *,
            pricing_tier:master_pricing_tiers(name),
            country:master_countries(name),
            currency:master_currencies(name, code, symbol),
            analytics_access:master_analytics_access_types(name),
            onboarding_type:master_onboarding_types(name),
            support_type:master_support_types(name),
            workflow_template:master_workflow_templates(name)
          `)
          .order('created_at', { ascending: false });
      } else if (tableName === 'master_tier_engagement_model_access') {
        query = supabase
          .from(tableName)
          .select(`
            *,
            pricing_tier:master_pricing_tiers(name),
            engagement_model:master_engagement_models(name)
          `)
          .order('created_at', { ascending: false });
      } else if (tableName === 'master_challenge_overage_fees') {
        query = supabase
          .from(tableName)
          .select(`
            *,
            country:master_countries(name),
            currency:master_currencies(name, code, symbol),
            pricing_tier:master_pricing_tiers(name)
          `)
          .order('created_at', { ascending: false });
      } else {
        // Default case for other tables
        query = supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (tableName === 'master_platform_fee_formulas' && data) {
        // Debug: Log raw data structure
        console.log('Raw platform fee formula data:', data);
        
        // For platform fee formulas, flatten the joined data to include readable names
        const processedData = data.map((item: any) => {
          console.log('Processing item:', item);
          console.log('Engagement model:', item.engagement_model);
          console.log('Country:', item.country);
          console.log('Currency:', item.currency);
          
          const processed = {
            ...item,
            engagement_model_name: item.engagement_model?.name || 'Unknown Model',
            country_name: item.country?.name || 'Unknown Country',
            currency_name: item.currency?.name || 'Unknown Currency',
            currency_code: item.currency?.code || 'USD',
            currency_symbol: item.currency?.symbol || '$',
            engagement_model_subtype_name: item.engagement_model_subtype?.name || null
          };
          
          console.log('Processed item:', processed);
          return processed;
        });
        setItems(processedData || []);
      } else if (tableName === 'master_tier_configurations' && data) {
        const processedData = data.map((item: any) => ({
          ...item,
          pricing_tier_name: item.pricing_tier?.name || 'Unknown Tier',
          country_name: item.country?.name || 'Unknown Country',
          currency_name: item.currency?.name || 'Unknown Currency',
          currency_code: item.currency?.code || 'USD',
          currency_symbol: item.currency?.symbol || '$',
          analytics_access_name: item.analytics_access?.name || null,
          onboarding_type_name: item.onboarding_type?.name || null,
          support_type_name: item.support_type?.name || null,
          workflow_template_name: item.workflow_template?.name || null
        }));
        setItems(processedData || []);
      } else if (tableName === 'master_tier_engagement_model_access' && data) {
        const processedData = data.map((item: any) => ({
          ...item,
          pricing_tier_name: item.pricing_tier?.name || 'Unknown Tier',
          engagement_model_name: item.engagement_model?.name || 'Unknown Model'
        }));
        setItems(processedData || []);
      } else if (tableName === 'master_challenge_overage_fees' && data) {
        const processedData = data.map((item: any) => ({
          ...item,
          country_name: item.country?.name || 'Unknown Country',
          currency_name: item.currency?.name || 'Unknown Currency',
          currency_code: item.currency?.code || 'USD',
          currency_symbol: item.currency?.symbol || '$',
          pricing_tier_name: item.pricing_tier?.name || 'Unknown Tier'
        }));
        setItems(processedData || []);
      } else {
        setItems((data as MasterDataItem[]) || []);
      }
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${tableName}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .insert([{ ...item, is_user_created: item.is_user_created ?? true }])
        .select()
        .single();
      
      if (error) throw error;
      setItems(prev => [...prev, data as MasterDataItem]);
      toast({
        title: "Success",
        description: `${item.name || item.config_key || 'Item'} added successfully`,
      });
      return true;
    } catch (error) {
      console.error(`Error adding to ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to add ${item.name || item.config_key || 'item'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, updates: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data as MasterDataItem : item));
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [tableName]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems: loadItems,
  };
}

// Existing hooks for backward compatibility
export const useOrganizationTypes = () => useMasterDataCRUD('master_organization_types');
export const useEntityTypes = () => useMasterDataCRUD('master_entity_types');
export const useCountries = () => useMasterDataCRUD('master_countries');
export const useCurrencies = () => useMasterDataCRUD('master_currencies');
export const useEngagementModels = () => useMasterDataCRUD('master_engagement_models');
export const useIndustrySegments = () => useMasterDataCRUD('master_industry_segments');
export const useCapabilityLevels = () => useMasterDataCRUD('master_capability_levels');
export const useUnitsOfMeasure = () => useMasterDataCRUD('master_units_of_measure');
export const useBillingFrequencies = () => useMasterDataCRUD('master_billing_frequencies');
export const useMembershipStatuses = () => useMasterDataCRUD('master_membership_statuses');
export const useDepartments = () => useMasterDataCRUD('master_departments');
export const useSubDepartments = () => useMasterDataCRUD('master_sub_departments');
export const useTeamUnits = () => useMasterDataCRUD('master_team_units');
export const useCategories = () => useMasterDataCRUD('master_categories');
export const useSubCategories = () => useMasterDataCRUD('master_sub_categories');
export const useDomainGroups = () => useMasterDataCRUD('master_domain_groups');
export const useCompetencyCapabilities = () => useMasterDataCRUD('master_competency_capabilities');
export const useCommunicationTypes = () => useMasterDataCRUD('master_communication_types');
export const useRewardTypes = () => useMasterDataCRUD('master_reward_types');
export const useOrganizationCategories = () => useMasterDataCRUD('master_organization_categories');
export const useSeekerMembershipFees = () => useMasterDataCRUD('master_seeker_membership_fees');

// New hooks for pricing configuration tables
export const usePricingTiers = () => useMasterDataCRUD('master_pricing_tiers');
export const useEngagementModelSubtypes = () => useMasterDataCRUD('master_engagement_model_subtypes');
export const useFeeComponents = () => useMasterDataCRUD('master_fee_components');
export const usePlatformFeeFormulas = () => useMasterDataCRUD('master_platform_fee_formulas');
export const useAdvancePaymentTypes = () => useMasterDataCRUD('master_advance_payment_types');
export const useTierEngagementModelAccess = () => useMasterDataCRUD('master_tier_engagement_model_access');

export const useSystemConfigurations = () => useMasterDataCRUD('master_system_configurations');
export const useChallengeComplexity = () => useMasterDataCRUD('master_challenge_complexity');