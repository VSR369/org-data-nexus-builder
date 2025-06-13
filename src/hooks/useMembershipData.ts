
import { useState, useEffect } from 'react';

interface PricingData {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface MembershipConfig {
  organizationType: string;
  marketplaceFee: number;
  aggregatorFee: number;
  marketplacePlusAggregatorFee: number;
  internalPaasPricing: PricingData[];
}

export const useMembershipData = (entityType?: string, country?: string) => {
  const [membershipData, setMembershipData] = useState<MembershipConfig | null>(null);
  const [countryPricing, setCountryPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const loadMembershipData = () => {
      console.log('🔍 Loading membership data for:', { entityType, country });
      setLoading(true);
      setError(null);
      const debug: string[] = [];

      try {
        // First, let's see all localStorage keys to understand what's available
        const allKeys = Object.keys(localStorage);
        console.log('🔍 All localStorage keys:', allKeys);
        debug.push(`All localStorage keys: ${allKeys.join(', ')}`);

        // Look for any pricing or membership related keys
        const pricingKeys = allKeys.filter(key => 
          key.toLowerCase().includes('pricing') || 
          key.toLowerCase().includes('membership') || 
          key.toLowerCase().includes('fee')
        );
        console.log('🔍 Pricing-related keys found:', pricingKeys);
        debug.push(`Pricing-related keys: ${pricingKeys.join(', ')}`);

        // Try multiple possible keys for pricing configuration
        const possibleKeys = [
          'master_data_pricing_configs',
          'pricing_configs',
          'membership_configs',
          'membership_pricing',
          'seeker_membership_fee',
          'master_data_seeker_membership_fee'
        ];

        let pricingConfigs: MembershipConfig[] | null = null;
        let usedKey = '';

        for (const key of possibleKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              console.log(`📋 Found data in ${key}:`, parsed);
              debug.push(`Found data in ${key}: ${JSON.stringify(parsed, null, 2)}`);
              
              // Try to adapt the data structure if needed
              if (Array.isArray(parsed)) {
                pricingConfigs = parsed;
              } else if (parsed.configs && Array.isArray(parsed.configs)) {
                pricingConfigs = parsed.configs;
              } else if (parsed.data && Array.isArray(parsed.data)) {
                pricingConfigs = parsed.data;
              } else {
                // Single config object
                pricingConfigs = [parsed];
              }
              
              usedKey = key;
              break;
            } catch (parseError) {
              console.log(`❌ Failed to parse data from ${key}:`, parseError);
              debug.push(`Failed to parse ${key}: ${parseError}`);
            }
          }
        }

        setDebugInfo(debug);

        if (!pricingConfigs || pricingConfigs.length === 0) {
          console.log('⚠️ No pricing configs found in any expected location');
          setError('No pricing configuration found in master data. Please ensure pricing data is configured in the Master Data Portal.');
          setLoading(false);
          return;
        }

        console.log('📋 Loaded pricing configs from', usedKey, ':', pricingConfigs);

        // Find configuration for the entity type or fallback to "All Organizations"
        let matchingConfig = pricingConfigs.find(config => 
          config.organizationType === entityType
        );

        if (!matchingConfig) {
          matchingConfig = pricingConfigs.find(config => 
            config.organizationType === 'All Organizations'
          );
        }

        if (!matchingConfig) {
          console.log('❌ No matching pricing configuration found');
          setError(`No pricing configuration available for entity type: ${entityType}. Available types: ${pricingConfigs.map(c => c.organizationType).join(', ')}`);
          setLoading(false);
          return;
        }

        console.log('✅ Found matching config:', matchingConfig);
        setMembershipData(matchingConfig);

        // Find pricing for the specific country
        const countrySpecificPricing = matchingConfig.internalPaasPricing?.find(
          pricing => pricing.country === country
        );

        if (!countrySpecificPricing) {
          console.log('⚠️ No country-specific pricing found for:', country);
          const availableCountries = matchingConfig.internalPaasPricing?.map(p => p.country).join(', ') || 'none';
          setError(`No pricing available for ${country}. Available countries: ${availableCountries}`);
        } else {
          console.log('✅ Found country pricing:', countrySpecificPricing);
          setCountryPricing(countrySpecificPricing);
        }

      } catch (error) {
        console.error('❌ Error loading membership data:', error);
        setError('Failed to load membership information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (entityType && country) {
      loadMembershipData();
    } else {
      setError('Missing entity type or country information.');
      setLoading(false);
    }
  }, [entityType, country]);

  return {
    membershipData,
    countryPricing,
    loading,
    error,
    debugInfo
  };
};
