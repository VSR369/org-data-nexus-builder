import { z } from 'zod';

// Support Types Validation
export const supportTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  service_level: z.string().min(1, 'Service level is required'),
  availability: z.string().optional(),
  response_time: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type SupportTypeFormData = z.infer<typeof supportTypeSchema>;

// Analytics Access Types Validation
export const analyticsAccessTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  dashboard_access: z.boolean().default(false),
  features_included: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

export type AnalyticsAccessTypeFormData = z.infer<typeof analyticsAccessTypeSchema>;

// Workflow Templates Validation
export const workflowTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  template_type: z.string().min(1, 'Template type is required'),
  customization_level: z.string().min(1, 'Customization level is required'),
  template_count: z.number().min(1, 'Template count must be at least 1').default(1),
  fields_config: z.record(z.any()).default({}),
  is_active: z.boolean().default(true),
});

export type WorkflowTemplateFormData = z.infer<typeof workflowTemplateSchema>;

// Onboarding Types Validation
export const onboardingTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  service_type: z.string().min(1, 'Service type is required'),
  resources_included: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

export type OnboardingTypeFormData = z.infer<typeof onboardingTypeSchema>;

// Challenge Overage Fees Validation
export const challengeOverageFeeSchema = z.object({
  country_id: z.string().min(1, 'Country is required'),
  currency_id: z.string().min(1, 'Currency is required'),
  pricing_tier_id: z.string().min(1, 'Pricing tier is required'),
  fee_per_additional_challenge: z.number().min(0, 'Fee must be non-negative'),
  is_active: z.boolean().default(true),
});

export type ChallengeOverageFeeFormData = z.infer<typeof challengeOverageFeeSchema>;

// System Feature Access Validation
export const systemFeatureAccessSchema = z.object({
  feature_name: z.string().min(1, 'Feature name is required'),
  pricing_tier_id: z.string().min(1, 'Pricing tier is required'),
  access_level: z.string().min(1, 'Access level is required'),
  is_enabled: z.boolean().default(true),
  is_active: z.boolean().default(true),
  feature_config: z.record(z.any()).default({}),
});

export type SystemFeatureAccessFormData = z.infer<typeof systemFeatureAccessSchema>;

// Tier Engagement Access Validation
export const tierEngagementAccessSchema = z.object({
  pricing_tier_id: z.string().min(1, 'Pricing tier is required'),
  engagement_model_id: z.string().min(1, 'Engagement model is required'),
  is_allowed: z.boolean().default(true),
  is_default: z.boolean().default(false),
  selection_type: z.string().default('per_challenge'),
  is_active: z.boolean().default(true),
});

export type TierEngagementAccessFormData = z.infer<typeof tierEngagementAccessSchema>;

// Tier Configurations Validation
export const tierConfigurationSchema = z.object({
  pricing_tier_id: z.string().min(1, 'Pricing tier is required'),
  country_id: z.string().min(1, 'Country is required'),
  currency_id: z.string().optional(),
  monthly_challenge_limit: z.number().min(0, 'Challenge limit must be non-negative').optional(),
  solutions_per_challenge: z.number().min(1, 'Solutions per challenge must be at least 1').default(1),
  fixed_charge_per_challenge: z.number().min(0, 'Fixed charge must be non-negative').default(0),
  allows_overage: z.boolean().default(false),
  support_type_id: z.string().optional(),
  analytics_access_id: z.string().optional(),
  onboarding_type_id: z.string().optional(),
  workflow_template_id: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type TierConfigurationFormData = z.infer<typeof tierConfigurationSchema>;

// Common validation utilities
export const validateJsonField = (value: any) => {
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }
  return typeof value === 'object';
};

export const validateArrayField = (value: any) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }
  return Array.isArray(value);
};