
import { useState, useEffect } from 'react';
import { MasterDataSeeder } from '@/utils/masterDataSeeder';

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
      console.log('🔍 === MEMBERSHIP DATA LOADING START ===');
      console.log('🔍 Looking for:', { entityType, country });
      
      setLoading(true);
      setError(null);
      const debug: string[] = [];

      try {
        // Validate master data integrity first
        const integrity = MasterDataSeeder.validateMasterDataIntegrity();
        debug.push(`Master data integrity: ${integrity.isValid ? 'VALID' : 'INVALID'}`);
        
        if (!integrity.isValid) {
          debug.push(`Integrity issues: ${integrity.issues.join(', ')}`);
        }

        // Load membership fees data
        const membershipFeesData = localStorage.getItem('master_data_seeker_membership_fees');
        debug.push(`Raw membership data exists: ${!!membershipFeesData}`);
        
        if (!membershipFeesData) {
          const errorMsg = 'No membership fee configuration found. Please configure membership fees in the Master Data Portal.';
          debug.push('ERROR: No membership fees data in localStorage');
          setError(errorMsg);
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        let membershipFees;
        try {
          membershipFees = JSON.parse(membershipFeesData);
          debug.push(`Parsed membership fees count: ${Array.isArray(membershipFees) ? membershipFees.length : 'Not an array'}`);
        } catch (parseError) {
          debug.push(`Parse error: ${parseError}`);
          setError('Invalid membership fee configuration data.');
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        if (!Array.isArray(membershipFees) || membershipFees.length === 0) {
          debug.push('ERROR: Membership fees is empty or not an array');
          setError('No membership fee configurations available. Please add configurations in the Master Data Portal.');
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        debug.push(`Available configs: ${membershipFees.map(f => `${f.entityType}/${f.country}`).join(', ')}`);

        // Enhanced matching logic
        let matchingFee = membershipFees.find(fee => 
          fee.entityType === entityType && fee.country === country
        );

        if (!matchingFee) {
          debug.push('No exact match found, trying fuzzy matching...');
          
          // Try case-insensitive matching
          matchingFee = membershipFees.find(fee => 
            fee.entityType?.toLowerCase() === entityType?.toLowerCase() && 
            fee.country?.toLowerCase() === country?.toLowerCase()
          );
          
          if (matchingFee) {
            debug.push('Found case-insensitive match');
          }
        }

        if (!matchingFee) {
          // Try entity type only match
          const entityMatches = membershipFees.filter(fee => 
            fee.entityType?.toLowerCase() === entityType?.toLowerCase()
          );
          
          if (entityMatches.length > 0) {
            debug.push(`Found ${entityMatches.length} entity type matches for different countries`);
            matchingFee = entityMatches[0]; // Use first available
            debug.push(`Using fallback config for ${matchingFee.country}`);
          }
        }

        if (!matchingFee) {
          const availableConfigs = membershipFees.map(fee => `${fee.entityType} (${fee.country})`).join(', ');
          const errorMsg = `No membership fee configuration found for ${entityType} in ${country}. Available configurations: ${availableConfigs}`;
          debug.push(`ERROR: ${errorMsg}`);
          setError(errorMsg);
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        debug.push(`Using config: ${matchingFee.entityType}/${matchingFee.country}`);

        // Convert the membership fee data to the expected format
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

        debug.push('Successfully created membership config');
        
        setMembershipData(membershipConfig);
        setCountryPricing(membershipConfig.internalPaasPricing[0]);
        setDebugInfo(debug);

      } catch (error) {
        debug.push(`Unexpected error: ${error}`);
        console.error('Failed to load membership information:', error);
        setError('Failed to load membership information. Please try again.');
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
