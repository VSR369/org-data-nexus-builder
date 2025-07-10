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
  
  console.log('🔍 Membership status details:', {
    membershipStatus,
    isMembershipPaid,
    membershipStatusForConfig
  });
  
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

  // First try to find exact match with membership status
  let matchingConfig = pricingConfigs.find(config => 
    config.engagementModel === engagementModelName &&
    config.country === country &&
    config.organizationType === organizationType &&
    config.membershipStatus === membershipStatusForConfig
  );

  console.log('🎯 First attempt - exact match with membership status:', matchingConfig ? 'FOUND' : 'NOT FOUND');

  // If no exact match, try with fallback countries but keep membership status
  if (!matchingConfig) {
    matchingConfig = pricingConfigs.find(config => 
      config.engagementModel === engagementModelName &&
      (!config.country || config.country === 'Global' || config.country === 'All' || config.country === country) &&
      (config.organizationType === organizationType || config.organizationType === 'All') &&
      config.membershipStatus === membershipStatusForConfig
    );
    console.log('🎯 Second attempt - with fallbacks but specific membership status:', matchingConfig ? 'FOUND' : 'NOT FOUND');
  }

  // If still no match, try without membership status constraint (for backward compatibility)
  if (!matchingConfig) {
    matchingConfig = pricingConfigs.find(config => 
      config.engagementModel === engagementModelName &&
      config.country === country &&
      config.organizationType === organizationType
    );
    console.log('🎯 Third attempt - exact match without membership status:', matchingConfig ? 'FOUND' : 'NOT FOUND');
  }

  // Final fallback - just match engagement model and prefer not-a-member for non-members
  if (!matchingConfig) {
    // For non-members, prefer not-a-member configs
    if (membershipStatusForConfig === 'not-a-member') {
      matchingConfig = pricingConfigs.find(config => 
        config.engagementModel === engagementModelName &&
        config.membershipStatus === 'not-a-member'
      );
      console.log('🎯 Fourth attempt - engagement model with not-a-member preference:', matchingConfig ? 'FOUND' : 'NOT FOUND');
    }
    
    // If still no match, try any config for this engagement model
    if (!matchingConfig) {
      matchingConfig = pricingConfigs.find(config => 
        config.engagementModel === engagementModelName
      );
      console.log('🎯 Final attempt - engagement model only:', matchingConfig ? 'FOUND' : 'NOT FOUND');
    }
  }

  if (!matchingConfig) {
    console.log('❌ No pricing config found for engagement model:', engagementModelName);
    console.log('❌ Available engagement models:', [...new Set(pricingConfigs.map(c => c.engagementModel))]);
    console.log('❌ Available membership statuses:', [...new Set(pricingConfigs.map(c => c.membershipStatus))]);
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
    return 'Please configure pricing';
  }
  
  // Ensure amount is a valid number
  const validAmount = Number(amount);
  if (isNaN(validAmount) || validAmount < 0) {
    console.warn('⚠️ formatCurrency: Invalid amount after conversion:', validAmount);
    return 'Please configure pricing';
  }
  
  if (currency === 'INR') {
    return `₹${validAmount.toLocaleString()}`;
  }
  return `${currency} ${validAmount.toLocaleString()}`;
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
  if (!selectedEngagementModel) return false;
  return selectedEngagementModel === 'Platform as a Service' || 
         selectedEngagementModel.toLowerCase().includes('platform') || 
         selectedEngagementModel.toLowerCase().includes('paas');
};

export const isMarketplaceModel = (engagementModel: string): boolean => {
  return engagementModel === 'marketplace' || 
         engagementModel === 'market-place' || 
         engagementModel === 'Market Place' ||
         engagementModel === 'aggregator' ||
         engagementModel === 'Aggregator' ||
         engagementModel === 'marketplace-aggregator' ||
         engagementModel === 'market-place-aggregator' ||
         engagementModel === 'Market Place & Aggregator';
};

// Diagnostic function to check pricing configurations
// Get both member and non-member pricing configs for discount display
export const getBothMemberAndNonMemberPricing = (
  selectedEngagementModel: string | null,
  pricingConfigs: PricingConfig[],
  country: string,
  organizationType: string
): { memberConfig: PricingConfig | null; nonMemberConfig: PricingConfig | null } => {
  if (!selectedEngagementModel) return { memberConfig: null, nonMemberConfig: null };

  const engagementModelName = getEngagementModelName(selectedEngagementModel);

  // Get member config
  const memberConfig = pricingConfigs.find(config => 
    config.engagementModel === engagementModelName &&
    config.country === country &&
    config.organizationType === organizationType &&
    config.membershipStatus === 'member'
  ) || pricingConfigs.find(config => 
    config.engagementModel === engagementModelName &&
    config.membershipStatus === 'member'
  );

  // Get non-member config (this will be our "original" pricing)
  const nonMemberConfig = pricingConfigs.find(config => 
    config.engagementModel === engagementModelName &&
    config.country === country &&
    config.organizationType === organizationType &&
    config.membershipStatus === 'not-a-member'
  ) || pricingConfigs.find(config => 
    config.engagementModel === engagementModelName &&
    config.membershipStatus === 'not-a-member'
  );

  console.log('🔍 getBothMemberAndNonMemberPricing:', {
    engagementModelName,
    memberConfig: memberConfig ? {
      id: memberConfig.id,
      platformFee: memberConfig.platformFeePercentage,
      discount: memberConfig.discountPercentage
    } : null,
    nonMemberConfig: nonMemberConfig ? {
      id: nonMemberConfig.id,
      platformFee: nonMemberConfig.platformFeePercentage
    } : null
  });

  return { memberConfig, nonMemberConfig };
};

export const debugPricingConfigurations = (pricingConfigs: PricingConfig[]): void => {
  console.log('🔍 === PRICING CONFIGURATIONS DEBUG ===');
  console.log('📊 Total configurations:', pricingConfigs.length);
  
  // Group by engagement model
  const byEngagementModel = pricingConfigs.reduce((acc, config) => {
    if (!acc[config.engagementModel]) {
      acc[config.engagementModel] = [];
    }
    acc[config.engagementModel].push(config);
    return acc;
  }, {} as Record<string, PricingConfig[]>);
  
  console.log('📋 By Engagement Model:');
  Object.entries(byEngagementModel).forEach(([model, configs]) => {
    console.log(`  ${model}: ${configs.length} configs`);
    configs.forEach(config => {
      console.log(`    - ${config.membershipStatus} (${config.country}, ${config.organizationType})`);
      if (config.quarterlyFee) console.log(`      Quarterly: ${config.quarterlyFee}, Half-yearly: ${config.halfYearlyFee}, Annual: ${config.annualFee}`);
      if (config.platformFeePercentage) console.log(`      Platform Fee: ${config.platformFeePercentage}%`);
    });
  });
  
  // Check for missing not-a-member configs
  const engagementModels = [...new Set(pricingConfigs.map(c => c.engagementModel))];
  const missingNotMemberConfigs = engagementModels.filter(model => {
    return !pricingConfigs.some(config => 
      config.engagementModel === model && 
      config.membershipStatus === 'not-a-member'
    );
  });
  
  if (missingNotMemberConfigs.length > 0) {
    console.warn('⚠️ Missing "not-a-member" configurations for:', missingNotMemberConfigs);
  } else {
    console.log('✅ All engagement models have "not-a-member" configurations');
  }
  
  console.log('🔍 === END PRICING CONFIGURATIONS DEBUG ===');
};
