
export interface CountryPricing {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
  membershipStatus?: 'member' | 'not-a-member';
  discountPercentage?: number;
}

export interface PricingConfig {
  id: string;
  configName?: string;
  country?: string;
  currency?: string;
  organizationType: string;
  entityType?: string;
  engagementModel: string;
  engagementModelFee?: number;
  quarterlyFee?: number;
  halfYearlyFee?: number;
  annualFee?: number;
  membershipStatus?: 'member' | 'not-a-member';
  discountPercentage?: number;
  generalConfig?: {
    marketPlaceFee: number;
    aggregatorFee: number;
    platformUsageFee: number;
    transactionFee: number;
  };
  paasPricing?: {
    basicTier: number;
    standardTier: number;
    premiumTier: number;
    enterpriseTier: number;
  };
  discounts?: {
    earlyBird: number;
    bulk: number;
    loyalty: number;
  };
  internalPaasPricing: CountryPricing[];
  version: number;
  createdAt: string;
  updatedAt?: string;
}
