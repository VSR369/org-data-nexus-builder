import { PricingConfig } from '@/types/pricing';

// Map engagement model IDs to display names used in pricing configs
export const getEngagementModelName = (modelId: string): string => {
  const modelMap: Record<string, string> = {
    'marketplace': 'Market Place',
    'aggregator': 'Aggregator', 
    'marketplace-aggregator': 'Market Place & Aggregator',
    'platform-service': 'Platform as a Service'
  };
  return modelMap[modelId] || modelId;
};

// Get pricing for selected engagement model with proper discount handling
export const getEngagementPricing = (
  selectedEngagementModel: string | null,
  membershipStatus: string,
  pricingConfigs: PricingConfig[],
  country: string,
  organizationType: string
): PricingConfig | null => {
  if (!selectedEngagementModel) return null;

  // Check if membership payment is actually paid
  const isMembershipPaid = membershipStatus === 'member_paid';
  const membershipStatusForConfig = isMembershipPaid ? 'member' : 'not-a-member';
  
  // Get the proper engagement model name for pricing lookup
  const engagementModelName = getEngagementModelName(selectedEngagementModel);
  
  console.log('🔍 Looking for pricing config:', {
    country,
    organizationType, 
    engagementModel: engagementModelName,
    membershipStatus: membershipStatusForConfig,
    membershipPaid: isMembershipPaid,
    selectedModelId: selectedEngagementModel
  });

  // First find the base config for this engagement model
  let baseConfig = pricingConfigs.find(config => 
    config.country === country &&
    config.organizationType === organizationType &&
    config.engagementModel === engagementModelName
  );

  if (!baseConfig) {
    // Try with normalized country names
    const normalizedCountry = country === 'United States' ? 'IN' : country;
    baseConfig = pricingConfigs.find(config => 
      config.country === normalizedCountry &&
      config.organizationType === organizationType &&
      config.engagementModel === engagementModelName
    );
  }

  if (!baseConfig) {
    // Try global config without country restriction
    baseConfig = pricingConfigs.find(config => 
      (!config.country || config.country === 'Global' || config.country === 'IN') &&
      config.organizationType === organizationType &&
      config.engagementModel === engagementModelName
    );
  }

  if (!baseConfig) {
    // Final fallback - any config with matching engagement model
    baseConfig = pricingConfigs.find(config => 
      config.engagementModel === engagementModelName
    );
  }

  if (!baseConfig) {
    console.log('❌ No base config found for engagement model:', engagementModelName);
    return null;
  }

  // Create the final config based on membership payment status
  let finalConfig;
  if (isMembershipPaid) {
    // Membership is paid - apply member pricing with discount
    finalConfig = {
      ...baseConfig,
      membershipStatus: 'member',
      // Keep the discount percentage from base config for members
      discountPercentage: baseConfig.discountPercentage || 0
    };
    console.log('✅ Using member pricing with discount:', finalConfig.discountPercentage + '%');
  } else {
    // Membership not paid - use regular pricing without discount
    finalConfig = {
      ...baseConfig,
      membershipStatus: 'not-a-member',
      discountPercentage: 0 // No discount for non-members
    };
    console.log('✅ Using regular pricing without discount');
  }

  console.log('✅ Final pricing config:', finalConfig);
  return finalConfig;
};

// Calculate discounted price for members
export const calculateDiscountedPrice = (baseAmount: number, discountPercentage: number): number => {
  if (!discountPercentage || discountPercentage === 0) return baseAmount;
  return Math.round(baseAmount * (1 - discountPercentage / 100));
};

// Get display amount with proper discount application
export const getDisplayAmount = (
  frequency: string, 
  pricing: PricingConfig, 
  membershipStatus: string
): { amount: number; originalAmount?: number; discountApplied: boolean } => {
  const feeKey = frequency === 'half-yearly' ? 'halfYearlyFee' : `${frequency}Fee` as keyof PricingConfig;
  const baseAmount = pricing[feeKey] as number;
  
  if (membershipStatus === 'member_paid' && pricing.discountPercentage) {
    const discountedAmount = calculateDiscountedPrice(baseAmount, pricing.discountPercentage);
    return {
      amount: discountedAmount,
      originalAmount: baseAmount,
      discountApplied: true
    };
  }
  
  return {
    amount: baseAmount,
    discountApplied: false
  };
};

// Format currency display
export const formatCurrency = (amount: number | undefined, currency: string = 'INR'): string => {
  // Handle undefined or null amounts
  if (amount === undefined || amount === null || isNaN(amount)) {
    console.warn('⚠️ formatCurrency: Invalid amount:', amount);
    return 'Contact for pricing';
  }
  
  if (currency === 'INR') {
    return `₹${amount.toLocaleString()}`;
  }
  return `${currency} ${amount}`;
};

// Get annual membership fee
export const getAnnualMembershipFee = (membershipFees: any[]) => {
  if (membershipFees.length === 0) return null;
  const fee = membershipFees[0];
  return {
    amount: fee.annualAmount,
    currency: fee.annualCurrency || 'INR'
  };
};

// Check if current engagement model is Platform as a Service
export const isPaaSModel = (selectedEngagementModel: string | null): boolean => {
  return selectedEngagementModel?.toLowerCase().includes('platform') || 
         selectedEngagementModel?.toLowerCase().includes('paas') || false;
};
