
export interface CountryPricing {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
  membershipStatus?: 'active' | 'inactive' | 'not-a-member';
  discountPercentage?: number;
}

export interface PricingConfig {
  id: string;
  organizationType: string;
  marketplaceFee: number;
  aggregatorFee: number;
  marketplacePlusAggregatorFee: number;
  membershipStatus?: 'active' | 'inactive' | 'not-a-member';
  discountPercentage?: number;
  internalPaasPricing: CountryPricing[];
  version: number;
  createdAt: string;
}
