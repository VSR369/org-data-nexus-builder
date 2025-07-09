import React, { useState, useEffect } from 'react';
import { Users, Code, Headphones, Server } from 'lucide-react';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { MembershipFeeFixer } from '@/utils/membershipFeeFixer';
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
        const configs = await getPricingConfigsAsync();
        console.log('🔍 Raw configs from Supabase:', configs.length);
        
        setPricingConfigs(configs);
        console.log('✅ Set pricing configs in state:', configs.length);
        
        // Force initialization if no configs loaded or configs have undefined values
        if (!configs || configs.length === 0 || configs.some(c => !c.quarterlyFee && !c.halfYearlyFee && !c.annualFee)) {
          console.log('🔧 No valid pricing configs found, forcing default data load...');
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
        }

        // Load membership fees
        const fees = MembershipFeeFixer.getMembershipFees().filter(fee => 
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
        toast({
          variant: "destructive",
          title: "Data Loading Error",
          description: "Failed to load pricing data. Please refresh the page."
        });
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