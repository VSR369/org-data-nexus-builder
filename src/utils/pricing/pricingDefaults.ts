// Default Pricing Configurations
import { PricingConfig } from '@/types/pricing';

export const defaultPricingConfigs: PricingConfig[] = [
  // Market Place - Member Configuration
  {
    id: 'marketplace-member-config',
    configName: 'Market Place Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place',
    membershipStatus: 'member',
    platformFeePercentage: 12, // 12% for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Market Place - Not a Member Configuration
  {
    id: 'marketplace-not-member-config',
    configName: 'Market Place Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place',
    membershipStatus: 'not-a-member',
    platformFeePercentage: 15, // 15% for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Aggregator - Member Configuration
  {
    id: 'aggregator-member-config',
    configName: 'Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Aggregator',
    membershipStatus: 'member',
    platformFeePercentage: 10, // 10% for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Aggregator - Not a Member Configuration
  {
    id: 'aggregator-not-member-config',
    configName: 'Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Aggregator',
    membershipStatus: 'not-a-member',
    platformFeePercentage: 13, // 13% for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Market Place & Aggregator - Member Configuration
  {
    id: 'marketplace-aggregator-member-config',
    configName: 'Market Place & Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place & Aggregator',
    membershipStatus: 'member',
    platformFeePercentage: 15, // 15% for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Market Place & Aggregator - Not a Member Configuration
  {
    id: 'marketplace-aggregator-not-member-config',
    configName: 'Market Place & Aggregator Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Market Place & Aggregator',
    membershipStatus: 'not-a-member',
    platformFeePercentage: 18, // 18% for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Platform as a Service - Member Configuration (Fixed pricing in INR)
  {
    id: 'platform-service-member-config',
    configName: 'Platform as a Service Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Platform as a Service',
    membershipStatus: 'member',
    quarterlyFee: 25000, // INR 25,000 for Members
    halfYearlyFee: 45000, // INR 45,000 for Members
    annualFee: 80000, // INR 80,000 for Members
    discountPercentage: 20,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  },
  // Platform as a Service - Not a Member Configuration (Fixed pricing in INR)
  {
    id: 'platform-service-not-member-config',
    configName: 'Platform as a Service Configuration',
    country: 'IN',
    currency: 'INR',
    organizationType: 'MSME',
    entityType: 'Commercial',
    engagementModel: 'Platform as a Service',
    membershipStatus: 'not-a-member',
    quarterlyFee: 30000, // INR 30,000 for Not a Member
    halfYearlyFee: 55000, // INR 55,000 for Not a Member
    annualFee: 100000, // INR 1,00,000 for Not a Member
    discountPercentage: 0,
    internalPaasPricing: [],
    version: 1,
    createdAt: new Date().toISOString()
  }
];