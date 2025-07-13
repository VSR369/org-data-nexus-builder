import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MasterDataItem {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  is_user_created?: boolean;
}

type TableName = 'master_organization_types' | 'master_entity_types' | 'master_solution_statuses' | 
  'master_challenge_statuses' | 'master_reward_types' | 'master_communication_types' | 
  'master_departments' | 'master_industry_segments' | 'master_engagement_models' | 
  'master_competency_capabilities';

export function useMasterDataCRUD(tableName: TableName) {
  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('name');
      
      if (error) throw error;
      setItems((data as MasterDataItem[]) || []);
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

  const addItem = async (item: Omit<MasterDataItem, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .insert([{ ...item, is_user_created: true }])
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
      console.error(`Error adding to ${tableName}:`, error);
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

  const updateItem = async (id: string, updates: Partial<MasterDataItem>) => {
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

// Specific hooks for each master data type
export const useOrganizationTypes = () => useMasterDataCRUD('master_organization_types');
export const useEntityTypes = () => useMasterDataCRUD('master_entity_types');
export const useSolutionStatuses = () => useMasterDataCRUD('master_solution_statuses');
export const useChallengeStatuses = () => useMasterDataCRUD('master_challenge_statuses');
export const useRewardTypes = () => useMasterDataCRUD('master_reward_types');
export const useCommunicationTypes = () => useMasterDataCRUD('master_communication_types');
export const useDepartments = () => useMasterDataCRUD('master_departments');
export const useIndustrySegments = () => useMasterDataCRUD('master_industry_segments');
export const useEngagementModels = () => useMasterDataCRUD('master_engagement_models');
export const useCompetencyCapabilities = () => useMasterDataCRUD('master_competency_capabilities');
export const useCurrencies = () => useMasterDataCRUD('master_currencies');
export const useCountries = () => useMasterDataCRUD('master_countries');