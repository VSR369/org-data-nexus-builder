
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
      setLoading(true);
      setError(null);

      try {
        // Try to load seeker membership fees data
        const membershipFeesData = localStorage.getItem('master_data_seeker_membership_fees');
        
        if (!membershipFeesData) {
          setError('No membership fee configuration found. Please configure membership fees in the Master Data Portal.');
          setLoading(false);
          return;
        }

        let membershipFees;
        try {
          membershipFees = JSON.parse(membershipFeesData);
        } catch (parseError) {
          setError('Invalid membership fee configuration data.');
          setLoading(false);
          return;
        }

        if (!Array.isArray(membershipFees) || membershipFees.length === 0) {
          setError('No membership fee configurations available. Please add configurations in the Master Data Portal.');
          setLoading(false);
          return;
        }

        // Find matching configuration for the entity type and country
        const matchingFee = membershipFees.find(fee => 
          fee.entityType === entityType && fee.country === country
        );

        if (!matchingFee) {
          const availableConfigs = membershipFees.map(fee => `${fee.entityType} (${fee.country})`).join(', ');
          setError(`No membership fee configuration found for ${entityType} in ${country}. Available configurations: ${availableConfigs}`);
          setLoading(false);
          return;
        }

        // Convert the membership fee data to the expected format
        const membershipConfig: MembershipConfig = {
          organizationType: entityType,
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

        setMembershipData(membershipConfig);
        setCountryPricing(membershipConfig.internalPaasPricing[0]);

      } catch (error) {
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
