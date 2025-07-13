
import { useState, useEffect } from 'react';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { PricingConfig } from '@/types/pricing';

export const usePricingData = (organizationType?: string, country?: string) => {
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPricingData = async () => {
      console.log('🔄 usePricingData: Loading pricing configurations...');
      setLoading(true);
      setError(null);

      try {
        const configs = await PricingDataManager.getAllConfigurations();
        setPricingConfigs(configs);
        console.log('✅ usePricingData: Loaded configurations:', configs.length);
      } catch (err) {
        console.error('❌ usePricingData: Error loading pricing data:', err);
        setError('Failed to load pricing configurations');
      } finally {
        setLoading(false);
      }
    };

    loadPricingData();
  }, []);

  // Get specific pricing for organization type and country
  const getSpecificPricing = () => {
    if (!organizationType || !country) return null;
    
    return PricingDataManager.getPricingForCountryOrgTypeAndEngagement(country, organizationType, '');
  };

  // Get configuration by organization type and engagement model
  const getConfigByOrgTypeAndEngagement = (orgType: string, engagementModel: string) => {
    return PricingDataManager.getConfigurationByOrgTypeAndEngagement(orgType, engagementModel);
  };

  return {
    pricingConfigs,
    loading,
    error,
    getSpecificPricing,
    getConfigByOrgTypeAndEngagement,
    refetch: async () => {
      const configs = await PricingDataManager.getAllConfigurations();
      setPricingConfigs(configs);
    }
  };
};
