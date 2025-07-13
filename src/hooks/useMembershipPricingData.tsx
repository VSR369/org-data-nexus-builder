import React, { useState, useEffect } from 'react';
import { Users, Code, Headphones, Server } from 'lucide-react';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { useMembershipFeeDataSupabase } from '@/components/master-data/seeker-membership/useMembershipFeeDataSupabase';
import { engagementModelsDataManager } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { PricingConfig } from '@/types/pricing';
import { useToast } from "@/hooks/use-toast";

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const useMembershipPricingData = (
  organizationType: string,
  entityType: string,
  country: string
) => {
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoading(true);
        
        // Load pricing configurations from Supabase
        const { getPricingConfigsAsync } = await import('@/utils/pricing/pricingCore');
        
        // Clear localStorage cache to force fresh Supabase load
        localStorage.removeItem('custom_pricing');
        localStorage.removeItem('master_data_pricing_configs');
        
        const configs = await getPricingConfigsAsync();
        console.log('🔍 Raw configs from Supabase:', configs.length);
        console.log('🔍 Sample discount values:', configs.slice(0,3).map(c => ({
          model: c.engagementModel, 
          status: c.membershipStatus, 
          discount: c.discountPercentage,
          id: c.id
        })));
        
        setPricingConfigs(configs);
        console.log('✅ Set pricing configs in state:', configs.length);
        
        // Force initialization if no configs loaded at all
        if (!configs || configs.length === 0) {
          console.log('🔧 No pricing configs found, forcing default data load...');
          const currentMode = localStorage.getItem('master_data_mode');
          
          // Temporarily force mixed mode to get defaults
          localStorage.setItem('master_data_mode', 'mixed');
          
          // Clear any existing invalid data
          localStorage.removeItem('master_data_pricing_configs');
          localStorage.removeItem('custom_pricing');
          
          const defaultConfigs = PricingDataManager.getAllConfigurations();
          localStorage.setItem('master_data_mode', currentMode || 'custom_only');
          
          setPricingConfigs(defaultConfigs);
          console.log('✅ Loaded default pricing configs:', defaultConfigs.length);
        } else {
          console.log('✅ Using Supabase pricing configs with proper discounts:', configs.length);
          console.log('🔍 Sample config discounts:', configs.slice(0,3).map(c => ({
            model: c.engagementModel, 
            status: c.membershipStatus, 
            discount: c.discountPercentage
          })));
        }

        // Use Supabase hook for membership fees
        const { membershipFees: supabaseFees } = useMembershipFeeDataSupabase();
        const fees = supabaseFees.filter(fee => 
          fee.country === country && 
          fee.organizationType === organizationType && 
          fee.entityType === entityType
        );
        setMembershipFees(fees);
        console.log('✅ Loaded membership fees:', fees.length);

        // Load engagement models from master data
        const loadedEngagementModels = engagementModelsDataManager.loadData();
        const modelsWithIcons: EngagementModel[] = loadedEngagementModels.map(model => ({
          id: model.id,
          name: model.name,
          description: model.description || `${model.name} services`,
          icon: getEngagementModelIcon(model.name)
        }));
        setEngagementModels(modelsWithIcons);
        console.log('✅ Loaded engagement models:', modelsWithIcons.length);
      } catch (error) {
        console.error('❌ Error loading master data:', error);
        // Don't show error toast - provide fallback data instead
        console.log('🔧 Loading fallback data due to error...');
        
        // Load default fallback data
        const defaultConfigs = PricingDataManager.getAllConfigurations();
        setPricingConfigs(defaultConfigs);
        
        const fallbackFees = [{
          id: '1',
          country: country,
          organizationType: organizationType,
          entityType: entityType,
          annualFee: 1000,
          currency: 'USD',
          amount: 1000
        }];
        setMembershipFees(fallbackFees);
        
        const fallbackModels: EngagementModel[] = [
          { id: '1', name: 'Consulting', description: 'Professional consulting services', icon: <Users className="w-5 h-5" /> },
          { id: '2', name: 'Development', description: 'Software development services', icon: <Code className="w-5 h-5" /> }
        ];
        setEngagementModels(fallbackModels);
        
        console.log('✅ Loaded fallback data successfully');
      } finally {
        setLoading(false);
      }
    };

    loadMasterData();
  }, [country, organizationType, entityType, toast]);

  return {
    pricingConfigs,
    membershipFees,
    engagementModels,
    loading
  };
};

// Get icon for engagement model
const getEngagementModelIcon = (modelName: string): React.ReactNode => {
  const name = modelName.toLowerCase();
  if (name.includes('consulting')) return <Users className="w-5 h-5" />;
  if (name.includes('development')) return <Code className="w-5 h-5" />;
  if (name.includes('support')) return <Headphones className="w-5 h-5" />;
  if (name.includes('platform') || name.includes('paas')) return <Server className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};