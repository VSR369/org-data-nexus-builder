import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PricingFilters {
  search: string;
  country: string[];
  engagementModel: string[];
  organizationType: string[];
  membershipStatus: string;
}

interface MasterData {
  countries: any[];
  engagementModels: any[];
  organizationTypes: any[];
  entityTypes: any[];
  membershipStatuses: any[];
  unitsOfMeasure: any[];
  currencies: any[];
  billingFrequencies: any[];
}

export const usePricingConfiguration = () => {
  const [configurations, setConfigurations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [masterData, setMasterData] = useState<MasterData>({
    countries: [],
    engagementModels: [],
    organizationTypes: [],
    entityTypes: [],
    membershipStatuses: [],
    unitsOfMeasure: [],
    currencies: [],
    billingFrequencies: []
  });
  
  const [filters, setFilters] = useState<PricingFilters>({
    search: '',
    country: [],
    engagementModel: [],
    organizationType: [],
    membershipStatus: 'all'
  });

  const { toast } = useToast();

  // Load master data
  const loadMasterData = async () => {
    try {
      const [
        countriesRes,
        engagementModelsRes,
        organizationTypesRes,
        entityTypesRes,
        membershipStatusesRes,
        unitsOfMeasureRes,
        currenciesRes,
        billingFrequenciesRes
      ] = await Promise.all([
        supabase.from('master_countries').select('*').order('name'),
        supabase.from('master_engagement_models').select('*').order('name'),
        supabase.from('master_organization_types').select('*').order('name'),
        supabase.from('master_entity_types').select('*').order('name'),
        supabase.from('master_membership_statuses').select('*').order('name'),
        supabase.from('master_units_of_measure').select('*').order('name'),
        supabase.from('master_currencies').select('*').order('name'),
        supabase.from('master_billing_frequencies').select('*').order('name')
      ]);

      setMasterData({
        countries: countriesRes.data || [],
        engagementModels: engagementModelsRes.data || [],
        organizationTypes: organizationTypesRes.data || [],
        entityTypes: entityTypesRes.data || [],
        membershipStatuses: membershipStatusesRes.data || [],
        unitsOfMeasure: unitsOfMeasureRes.data || [],
        currencies: currenciesRes.data || [],
        billingFrequencies: billingFrequenciesRes.data || []
      });
    } catch (error) {
      console.error('Error loading master data:', error);
      toast({
        title: "Error",
        description: "Failed to load master data",
        variant: "destructive",
      });
    }
  };

  // Load pricing configurations
  const loadConfigurations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('pricing_configurations_detailed')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Apply client-side filtering for now to avoid TypeScript issues
      let filteredData = data || [];

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter((config: any) => 
          config.config_name?.toLowerCase().includes(searchTerm) ||
          config.country_name?.toLowerCase().includes(searchTerm) ||
          config.organization_type?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.country.length > 0) {
        filteredData = filteredData.filter((config: any) => 
          filters.country.includes(config.country_id)
        );
      }

      if (filters.engagementModel.length > 0) {
        filteredData = filteredData.filter((config: any) => 
          filters.engagementModel.includes(config.engagement_model_id)
        );
      }

      if (filters.organizationType.length > 0) {
        filteredData = filteredData.filter((config: any) => 
          filters.organizationType.includes(config.organization_type_id)
        );
      }

      if (filters.membershipStatus && filters.membershipStatus !== 'all') {
        filteredData = filteredData.filter((config: any) => 
          config.membership_status === filters.membershipStatus
        );
      }

      setConfigurations(filteredData);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create configuration
  const createConfiguration = async (configData: any) => {
    try {
      const { data, error } = await supabase
        .from('pricing_configurations')
        .insert([configData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing configuration created successfully",
      });

      await loadConfigurations();
      return data;
    } catch (error) {
      console.error('Error creating configuration:', error);
      toast({
        title: "Error",
        description: "Failed to create pricing configuration",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update configuration
  const updateConfiguration = async (id: string, configData: any) => {
    try {
      const { data, error } = await supabase
        .from('pricing_configurations')
        .update(configData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing configuration updated successfully",
      });

      await loadConfigurations();
      return data;
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing configuration",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete configuration
  const deleteConfiguration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pricing_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing configuration deleted successfully",
      });

      await loadConfigurations();
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete pricing configuration",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    if (masterData.countries.length > 0) {
      loadConfigurations();
    }
  }, [filters, masterData.countries.length]);

  return {
    configurations,
    loading,
    filters,
    setFilters,
    masterData,
    loadConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration
  };
};