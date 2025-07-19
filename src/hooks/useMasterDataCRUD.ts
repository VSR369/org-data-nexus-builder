
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MasterDataItem {
  id?: string;
  name?: string;
  config_key?: string;
  [key: string]: any;
}

type TableName = 
  | 'master_countries'
  | 'master_currencies'
  | 'master_organization_types'
  | 'master_entity_types'
  | 'master_industry_segments'
  | 'master_engagement_models'
  | 'master_pricing_tiers'
  | 'master_billing_frequencies'
  | 'master_membership_statuses'
  | 'master_units_of_measure'
  | 'master_fee_components'
  | 'master_pricing_parameters'
  | 'master_platform_fee_formulas'
  | 'master_tier_configurations'
  | 'master_tier_engagement_model_access'
  | 'master_seeker_membership_fees'
  | 'master_support_types'
  | 'master_workflow_templates'
  | 'master_system_configurations'
  | 'master_capability_levels'
  | 'master_competency_capabilities'
  | 'master_communication_types'
  | 'master_reward_types'
  | 'master_organization_categories'
  | 'pricing_configurations'
  | 'master_domain_groups'
  | 'master_categories'
  | 'master_sub_categories'
  | 'master_departments'
  | 'master_sub_departments'
  | 'master_team_units'
  | 'master_engagement_model_subtypes'
  | 'master_challenge_complexity'
  | 'master_challenge_overage_fees'
  | 'master_advance_payment_types'
  | 'master_analytics_access_types'
  | 'master_onboarding_types'
  | 'master_system_feature_access'
  | 'tier_engagement_model_restrictions';

// Special hooks for tables with joins or custom logic
export function useOrganizationTypes() {
  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_organization_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading organization types:', error);
      toast({
        title: "Error",
        description: "Failed to load organization types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async (item: Omit<MasterDataItem, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_organization_types')
        .insert([item] as any)
        .select()
        .single();
      
      if (error) throw error;
      setItems(prev => [...prev, data as MasterDataItem]);
      toast({
        title: "Success",
        description: `${item.name} added successfully`,
      });
      return true;
    } catch (error) {
      console.error('Error adding organization type:', error);
      toast({
        title: "Error",
        description: `Failed to add ${item.name}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, item: Partial<MasterDataItem>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_organization_types')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setItems(prev => prev.map(orgType => orgType.id === id ? data as MasterDataItem : orgType));
      toast({
        title: "Success",
        description: "Organization type updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating organization type:', error);
      toast({
        title: "Error",
        description: "Failed to update organization type",
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
        .from('master_organization_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setItems(prev => prev.filter(orgType => orgType.id !== id));
      toast({
        title: "Success",
        description: "Organization type deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting organization type:', error);
      toast({
        title: "Error",
        description: "Failed to delete organization type",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = () => {
    loadItems();
  };

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems,
  };
}

export function usePricingTiers() {
  return useMasterDataCRUD('master_pricing_tiers');
}

export function useEntityTypes() {
  return useMasterDataCRUD('master_entity_types');
}

export function useIndustrySegments() {
  return useMasterDataCRUD('master_industry_segments');
}

export function useDepartments() {
  return useMasterDataCRUD('master_departments');
}

export function useCommunicationTypes() {
  return useMasterDataCRUD('master_communication_types');
}

export function useRewardTypes() {
  return useMasterDataCRUD('master_reward_types');
}

export function useOrganizationCategories() {
  return useMasterDataCRUD('master_organization_categories');
}

export function useSystemConfigurations() {
  return useMasterDataCRUD('master_system_configurations');
}

export function useMasterDataCRUD(tableName: TableName) {
  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from(tableName).select('*');
      
      // Add joins for specific tables that need them
      if (tableName === 'master_challenge_overage_fees') {
        query = supabase.from(tableName).select(`
          *,
          pricing_tier_name:master_pricing_tiers(name),
          country_name:master_countries(name),
          currency_name:master_currencies(name),
          currency_symbol:master_currencies(symbol)
        `) as any;
      } else if (tableName === 'master_tier_engagement_model_access') {
        query = supabase.from(tableName).select(`
          *,
          pricing_tier_name:master_pricing_tiers(name),
          engagement_model_name:master_engagement_models(name)
        `) as any;
      } else if (tableName === 'master_tier_configurations') {
        query = supabase.from(tableName).select(`
          *,
          pricing_tier_name:master_pricing_tiers(name),
          country_name:master_countries(name),
          currency_name:master_currencies(name),
          currency_symbol:master_currencies(symbol)
        `) as any;
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error loading ${tableName}:`, error);
        throw error;
      }
      
      console.log(`✅ CRUD TEST - ${tableName} loaded from Supabase:`, data);
      setItems(data || []);
      
      // If no data exists, optionally insert some default data for certain tables
      if ((!data || data.length === 0) && tableName === 'master_entity_types') {
        console.log('No entity types found, attempting to insert default data...');
        await insertDefaultData(tableName);
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

  const insertDefaultData = async (table: string) => {
    try {
      if (table === 'master_entity_types') {
        const defaultEntityTypes = [
          { name: 'Corporation' },
          { name: 'LLC' },
          { name: 'Partnership' },
          { name: 'Sole Proprietorship' },
          { name: 'Non-Profit' }
        ];
        
        const { error } = await supabase
          .from('master_entity_types')
          .insert(defaultEntityTypes as any);
          
        if (error) throw error;
        console.log('✅ Default entity types inserted successfully');
        // Refresh the data
        await loadItems();
      }
    } catch (error) {
      console.error('Error inserting default data:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [tableName]);

  const addItem = async (item: Omit<MasterDataItem, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .insert([item] as any)
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

  const updateItem = async (id: string, item: Partial<MasterDataItem>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .update(item)
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

  const refreshItems = () => {
    loadItems();
  };

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems,
  };
}
