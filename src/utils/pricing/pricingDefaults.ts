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
    quarterlyFee: 12, // 12% for Members
    halfYearlyFee: 20, // 20% for Members  
    annualFee: 32, // 32% for Members
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
    quarterlyFee: 15, // 15% for Not a Member
    halfYearlyFee: 25, // 25% for Not a Member
    annualFee: 40, // 40% for Not a Member
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
    quarterlyFee: 10, // 10% for Members
    halfYearlyFee: 18, // 18% for Members
    annualFee: 28, // 28% for Members
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
    quarterlyFee: 13, // 13% for Not a Member
    halfYearlyFee: 22, // 22% for Not a Member
    annualFee: 35, // 35% for Not a Member
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
    quarterlyFee: 15, // 15% for Members
    halfYearlyFee: 25, // 25% for Members
    annualFee: 40, // 40% for Members
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
    quarterlyFee: 18, // 18% for Not a Member
    halfYearlyFee: 30, // 30% for Not a Member
    annualFee: 45, // 45% for Not a Member
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