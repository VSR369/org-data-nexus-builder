
import { useState, useEffect } from 'react';
import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';

interface MembershipFeeEntry {
  id: string;
  country: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
  isUserCreated: boolean;
}

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

const membershipFeeConfig = {
  key: 'master_data_seeker_membership_fees',
  version: 2,
  preserveUserData: true
};

export const useMembershipData = (entityType?: string, country?: string) => {
  const [membershipData, setMembershipData] = useState<MembershipConfig | null>(null);
  const [countryPricing, setCountryPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const loadMembershipData = () => {
      console.log('🔍 === MEMBERSHIP DATA LOADING START (User Data Priority) ===');
      console.log('🔍 Looking for:', { entityType, country });
      
      setLoading(true);
      setError(null);
      const debug: string[] = [];

      try {
        // Load user-created membership fees using the new persistence system
        const membershipFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig);
        
        debug.push(`User membership data exists: ${!!membershipFees}`);
        debug.push(`User membership fees count: ${membershipFees?.length || 0}`);
        
        if (!membershipFees || membershipFees.length === 0) {
          const errorMsg = 'No user-created membership fee configurations found. Please configure membership fees in the Master Data Portal first.';
          debug.push('ERROR: No user-created membership fees data');
          setError(errorMsg);
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        debug.push(`Available user configs: ${membershipFees.map(f => `${f.entityType}/${f.country}`).join(', ')}`);

        // Find exact match for user data
        let matchingFee = membershipFees.find(fee => 
          fee.entityType === entityType && fee.country === country
        );

        if (!matchingFee) {
          debug.push('No exact match found, trying case-insensitive matching...');
          
          // Try case-insensitive matching
          matchingFee = membershipFees.find(fee => 
            fee.entityType?.toLowerCase() === entityType?.toLowerCase() && 
            fee.country?.toLowerCase() === country?.toLowerCase()
          );
          
          if (matchingFee) {
            debug.push('Found case-insensitive match in user data');
          }
        }

        if (!matchingFee) {
          // Try entity type only match from user data
          const entityMatches = membershipFees.filter(fee => 
            fee.entityType?.toLowerCase() === entityType?.toLowerCase()
          );
          
          if (entityMatches.length > 0) {
            debug.push(`Found ${entityMatches.length} user entity type matches for different countries`);
            matchingFee = entityMatches[0]; // Use first available user config
            debug.push(`Using user fallback config for ${matchingFee.country}`);
          }
        }

        if (!matchingFee) {
          const availableConfigs = membershipFees
            .filter(fee => fee.isUserCreated)
            .map(fee => `${fee.entityType} (${fee.country})`)
            .join(', ');
          const errorMsg = `No user-created membership fee configuration found for ${entityType} in ${country}. Available user configurations: ${availableConfigs}`;
          debug.push(`ERROR: ${errorMsg}`);
          setError(errorMsg);
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        debug.push(`Using user config: ${matchingFee.entityType}/${matchingFee.country}`);
        debug.push(`User config created: ${matchingFee.createdAt}`);

        // Convert the user membership fee data to the expected format
        const membershipConfig: MembershipConfig = {
          organizationType: entityType || '',
          marketplaceFee: 0,
          aggregatorFee: 0,
          marketplacePlusAggregatorFee: 0,
          internalPaasPricing: [{
            id: matchingFee.id,
            country: matchingFee.country,
            currency: matchingFee.quarterlyCurrency,
            quarterlyPrice: matchingFee.quarterlyAmount,
            halfYearlyPrice: matchingFee.halfYearlyAmount,
            annualPrice: matchingFee.annualAmount
          }]
        };

        debug.push('Successfully created membership config from user data');
        
        setMembershipData(membershipConfig);
        setCountryPricing(membershipConfig.internalPaasPricing[0]);
        setDebugInfo(debug);

      } catch (error) {
        debug.push(`Unexpected error: ${error}`);
        console.error('Failed to load user membership information:', error);
        setError('Failed to load user membership information. Please ensure configurations are created properly.');
        setDebugInfo(debug);
      } finally {
        setLoading(false);
        console.log('🔍 === MEMBERSHIP DATA LOADING END ===');
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
