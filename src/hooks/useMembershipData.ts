
import { useState, useEffect } from 'react';
import { useMembershipFeeDataSupabase } from '@/components/master-data/seeker-membership/useMembershipFeeDataSupabase';

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
  internalPricing: PricingData[];
}

export const useMembershipData = (entityType?: string, country?: string, organizationType?: string) => {
  const [membershipData, setMembershipData] = useState<MembershipConfig | null>(null);
  const [countryPricing, setCountryPricing] = useState<PricingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Use Supabase as the single source of truth
  const { membershipFees, isLoading, isInitialized } = useMembershipFeeDataSupabase();

  useEffect(() => {
    if (!isInitialized || isLoading) {
      return;
    }

    console.log('🔍 === MEMBERSHIP DATA LOADING FROM SUPABASE ===');
    console.log('🔍 Looking for:', { entityType, country, organizationType });
    
    setError(null);
    const debug: string[] = [];

    try {
      if (!membershipFees || membershipFees.length === 0) {
        const errorMsg = 'No membership fee configurations found. Please configure membership fees in the Master Data Portal first.';
        debug.push('ERROR: No membership fees data found');
        setError(errorMsg);
        setDebugInfo(debug);
        return;
      }

      debug.push(`Available configs: ${membershipFees.map(f => `${f.country}/${f.organizationType}/${f.entityType}`).join(', ')}`);
      console.log('🔍 Searching for exact match:', { country, organizationType, entityType });

      // Find exact match first
      let matchingFee = membershipFees.find(fee => 
        (fee.country === country || fee.country === 'IN' && country === 'India') &&
        fee.entityType === entityType && 
        fee.organizationType === organizationType
      );

      if (!matchingFee) {
        debug.push('No exact country match, trying case-insensitive matching...');
        
        // Try case-insensitive matching
        matchingFee = membershipFees.find(fee => 
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
        const entityOrgMatches = membershipFees.filter(fee => 
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
        const orgTypeMatches = membershipFees.filter(fee => 
          fee.organizationType?.toLowerCase() === organizationType?.toLowerCase()
        );
        
        if (orgTypeMatches.length > 0) {
          matchingFee = orgTypeMatches[0];
          debug.push(`Using organization type fallback: ${matchingFee.organizationType}`);
          console.log('✅ Using org type fallback:', matchingFee);
        }
      }

      if (!matchingFee) {
        const availableConfigs = membershipFees
          .map(fee => `${fee.country || 'Unknown'} - ${fee.organizationType} - ${fee.entityType}`)
          .join(', ');
        const errorMsg = `No membership fee configuration found for ${entityType} - ${organizationType} in ${country}. Available configurations: ${availableConfigs}`;
        debug.push(`ERROR: ${errorMsg}`);
        setError(errorMsg);
        setDebugInfo(debug);
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
        internalPricing: [{
          id: matchingFee.id,
          country: matchingFee.country,
          currency: matchingFee.quarterlyCurrency || 'USD',
          quarterlyPrice: matchingFee.quarterlyAmount || 0,
          halfYearlyPrice: matchingFee.halfYearlyAmount || 0,
          annualPrice: matchingFee.annualAmount || 0
        }]
      };

      debug.push('Successfully created membership config from Supabase data');
      
      setMembershipData(membershipConfig);
      setCountryPricing(membershipConfig.internalPricing[0]);
      setDebugInfo(debug);

    } catch (error) {
      debug.push(`Unexpected error: ${error}`);
      console.error('Failed to load membership information:', error);
      setError('Failed to load membership information. Please ensure configurations are created properly.');
      setDebugInfo(debug);
    }
  }, [entityType, country, organizationType, membershipFees, isLoading, isInitialized]);

  return {
    membershipData,
    countryPricing,
    loading: isLoading,
    error,
    debugInfo
  };
};
