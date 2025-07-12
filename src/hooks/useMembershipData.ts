
import { useState, useEffect } from 'react';
import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';

interface MembershipFeeEntry {
  id: string;
  country: string;
  organizationType: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
  updatedAt: string;
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

export const useMembershipData = (entityType?: string, country?: string, organizationType?: string) => {
  const [membershipData, setMembershipData] = useState<MembershipConfig | null>(null);
  const [countryPricing, setCountryPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const loadMembershipData = () => {
      console.log('🔍 === MEMBERSHIP DATA LOADING START (User Data Priority) ===');
      console.log('🔍 Looking for:', { entityType, country, organizationType });
      
      setLoading(true);
      setError(null);
      const debug: string[] = [];

      try {
        // First check raw localStorage data to see what's available
        const rawData = localStorage.getItem('master_data_seeker_membership_fees');
        console.log('🗂️ Raw membership data in localStorage:', rawData);
        
        // Load user-created membership fees using the new persistence system
        const membershipFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig);
        
        debug.push(`User membership data exists: ${!!membershipFees}`);
        debug.push(`User membership fees count: ${membershipFees?.length || 0}`);
        
        // If no user data, try loading from raw localStorage
        let allMembershipFees = membershipFees;
        if (!membershipFees || membershipFees.length === 0) {
          try {
            const rawDataParsed = rawData ? JSON.parse(rawData) : null;
            if (rawDataParsed && Array.isArray(rawDataParsed)) {
              allMembershipFees = rawDataParsed;
              debug.push(`Loaded ${rawDataParsed.length} membership fees from raw storage`);
              console.log('📊 Available membership configs from raw data:', rawDataParsed.map(f => `${f.country}/${f.organizationType}/${f.entityType}`));
            }
          } catch (parseError) {
            console.error('❌ Error parsing raw membership data:', parseError);
          }
        }
        
        if (!allMembershipFees || allMembershipFees.length === 0) {
          const errorMsg = 'No membership fee configurations found. Please configure membership fees in the Master Data Portal first.';
          debug.push('ERROR: No membership fees data found');
          setError(errorMsg);
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        debug.push(`Available configs: ${allMembershipFees.map(f => `${f.country || f.organizationType}/${f.organizationType}/${f.entityType}`).join(', ')}`);
        console.log('🔍 Searching for exact match:', { country, organizationType, entityType });

        // Find exact match first
        let matchingFee = allMembershipFees.find(fee => 
          (fee.country === country || fee.country === 'IN' && country === 'India') &&
          fee.entityType === entityType && 
          fee.organizationType === organizationType
        );

        if (!matchingFee) {
          debug.push('No exact country match, trying case-insensitive matching...');
          
          // Try case-insensitive matching
          matchingFee = allMembershipFees.find(fee => 
            (fee.country?.toLowerCase() === country?.toLowerCase() || 
             (fee.country === 'IN' && country?.toLowerCase() === 'india')) &&
            fee.entityType?.toLowerCase() === entityType?.toLowerCase() &&
            fee.organizationType?.toLowerCase() === organizationType?.toLowerCase()
          );
          
          if (matchingFee) {
            debug.push('Found case-insensitive match');
            console.log('✅ Found case-insensitive match:', matchingFee);
          }
        }

        if (!matchingFee) {
          // Try entity type and organization type match from any country
          const entityOrgMatches = allMembershipFees.filter(fee => 
            fee.entityType?.toLowerCase() === entityType?.toLowerCase() &&
            fee.organizationType?.toLowerCase() === organizationType?.toLowerCase()
          );
          
          if (entityOrgMatches.length > 0) {
            debug.push(`Found ${entityOrgMatches.length} entity/org type matches for different countries`);
            matchingFee = entityOrgMatches[0]; // Use first available config
            debug.push(`Using fallback config for ${matchingFee.country}`);
            console.log('✅ Using fallback config:', matchingFee);
          }
        }

        if (!matchingFee) {
          // Final fallback - use any matching organization type
          const orgTypeMatches = allMembershipFees.filter(fee => 
            fee.organizationType?.toLowerCase() === organizationType?.toLowerCase()
          );
          
          if (orgTypeMatches.length > 0) {
            matchingFee = orgTypeMatches[0];
            debug.push(`Using organization type fallback: ${matchingFee.organizationType}`);
            console.log('✅ Using org type fallback:', matchingFee);
          }
        }

        if (!matchingFee) {
          const availableConfigs = allMembershipFees
            .map(fee => `${fee.country || 'Unknown'} - ${fee.organizationType} - ${fee.entityType}`)
            .join(', ');
          const errorMsg = `No membership fee configuration found for ${entityType} - ${organizationType} in ${country}. Available configurations: ${availableConfigs}`;
          debug.push(`ERROR: ${errorMsg}`);
          setError(errorMsg);
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        debug.push(`Using config: ${matchingFee.country}/${matchingFee.organizationType}/${matchingFee.entityType}`);
        debug.push(`Config created: ${matchingFee.createdAt}`);
        console.log('✅ Final membership config selected:', matchingFee);

        // Convert the membership fee data to the expected format
        const membershipConfig: MembershipConfig = {
          organizationType: organizationType || '',
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

        debug.push('Successfully created membership config from data');
        
        setMembershipData(membershipConfig);
        setCountryPricing(membershipConfig.internalPaasPricing[0]);
        setDebugInfo(debug);

      } catch (error) {
        debug.push(`Unexpected error: ${error}`);
        console.error('Failed to load membership information:', error);
        setError('Failed to load membership information. Please ensure configurations are created properly.');
        setDebugInfo(debug);
      } finally {
        setLoading(false);
        console.log('🔍 === MEMBERSHIP DATA LOADING END ===');
      }
    };

    if (entityType && country && organizationType) {
      loadMembershipData();
    } else {
      setError('Missing entity type, organization type, or country information.');
      setLoading(false);
    }
  }, [entityType, country, organizationType]);

  return {
    membershipData,
    countryPricing,
    loading,
    error,
    debugInfo
  };
};
