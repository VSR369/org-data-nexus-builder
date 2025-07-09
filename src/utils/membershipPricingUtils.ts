import { PricingConfig } from '@/types/pricing';

// Map engagement model IDs to display names used in pricing configs (match master data exactly)
export const getEngagementModelName = (modelId: string): string => {
  const modelMap: Record<string, string> = {
    'marketplace': 'Market Place',
    'aggregator': 'Aggregator', 
    'marketplace-aggregator': 'Market Place & Aggregator',
    'platform-service': 'Platform as a Service',
    // Handle exact matches from master data
    'Market Place': 'Market Place',
    'Aggregator': 'Aggregator',
    'Market Place & Aggregator': 'Market Place & Aggregator',
    'Platform as a Service': 'Platform as a Service'
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
    selectedModelId: selectedEngagementModel,
    allAvailableEngagementModels: [...new Set(pricingConfigs.map(c => c.engagementModel))]
  });

  console.log('📋 Available configs:', pricingConfigs.map(c => ({
    id: c.id,
    engagementModel: c.engagementModel,
    country: c.country,
    organizationType: c.organizationType,
    membershipStatus: c.membershipStatus
  })));

  // Simple direct lookup - exact match first
  let matchingConfig = pricingConfigs.find(config => 
    config.engagementModel === engagementModelName &&
    config.country === country &&
    config.organizationType === organizationType
  );

  console.log('🎯 First attempt - exact match result:', matchingConfig ? 'FOUND' : 'NOT FOUND');

  // If no exact match, try global/fallback configs
  if (!matchingConfig) {
    matchingConfig = pricingConfigs.find(config => 
      config.engagementModel === engagementModelName &&
      (!config.country || config.country === 'Global' || config.country === 'All' || config.country === country) &&
      (config.organizationType === organizationType || config.organizationType === 'All')
    );
    console.log('🎯 Second attempt - with fallbacks result:', matchingConfig ? 'FOUND' : 'NOT FOUND');
  }

  // Final fallback - just match engagement model
  if (!matchingConfig) {
    matchingConfig = pricingConfigs.find(config => 
      config.engagementModel === engagementModelName
    );
    console.log('🎯 Final attempt - engagement model only result:', matchingConfig ? 'FOUND' : 'NOT FOUND');
  }

  if (!matchingConfig) {
    console.log('❌ No pricing config found for engagement model:', engagementModelName);
    return null;
  }

  // Apply proper membership status and discount
  const finalConfig: PricingConfig = {
    ...matchingConfig,
    membershipStatus: membershipStatusForConfig as 'member' | 'not-a-member',
    discountPercentage: isMembershipPaid ? (matchingConfig.discountPercentage || 0) : 0
  };

  console.log('✅ Final pricing config found:', {
    id: finalConfig.id,
    engagementModel: finalConfig.engagementModel,
    membershipStatus: finalConfig.membershipStatus,
    discountPercentage: finalConfig.discountPercentage,
    platformFeePercentage: finalConfig.platformFeePercentage,
    quarterlyFee: finalConfig.quarterlyFee,
    halfYearlyFee: finalConfig.halfYearlyFee,
    annualFee: finalConfig.annualFee
  });

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
