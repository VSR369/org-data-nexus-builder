// New Pricing Data Manager - Template-based system
import { PricingConfig } from '@/types/pricing';
import { supabase } from '@/integrations/supabase/client';

export interface CalculatedPricing {
  platformFeePercentage?: number;
  quarterlyFee?: number;
  halfYearlyFee?: number;
  annualFee?: number;
  currency: string;
  internalPaasPricing: any[];
  template: string;
  memberDiscount?: number;
  orgDiscount?: number;
}

export class NewPricingDataManager {
  private static templates: any[] = [];
  private static rules: any[] = [];
  private static overrides: any[] = [];
  private static isLoaded = false;

  static async loadPricingSystem(): Promise<void> {
    try {
      console.log('🔄 Loading new pricing system...');
      
      const [templatesResult, rulesResult, overridesResult] = await Promise.all([
        supabase.from('pricing_templates').select('*').eq('is_active', true),
        supabase.from('pricing_rules').select('*').eq('is_active', true).order('priority'),
        supabase.from('pricing_overrides').select('*').eq('is_active', true)
      ]);

      if (templatesResult.error) throw templatesResult.error;
      if (rulesResult.error) throw rulesResult.error;
      if (overridesResult.error) throw overridesResult.error;

      this.templates = templatesResult.data || [];
      this.rules = rulesResult.data || [];
      this.overrides = overridesResult.data || [];
      this.isLoaded = true;

      console.log('✅ New pricing system loaded:', {
        templates: this.templates.length,
        rules: this.rules.length,
        overrides: this.overrides.length
      });
    } catch (error) {
      console.error('❌ Error loading pricing system:', error);
      throw error;
    }
  }

  static async calculatePricing(
    country: string,
    organizationType: string,
    entityType: string,
    engagementModel: string,
    membershipStatus: 'Member' | 'Non-Member'
  ): Promise<CalculatedPricing | null> {
    if (!this.isLoaded) {
      await this.loadPricingSystem();
    }

    // Find the appropriate template
    const template = this.templates.find(t => 
      t.engagement_model === engagementModel && t.is_active
    );

    if (!template) {
      console.warn(`No template found for engagement model: ${engagementModel}`);
      return null;
    }

    // Start with base values from template
    let calculatedPricing: CalculatedPricing = {
      platformFeePercentage: template.base_platform_fee_percentage || 0,
      quarterlyFee: template.base_quarterly_fee || 0,
      halfYearlyFee: template.base_half_yearly_fee || 0,
      annualFee: template.base_annual_fee || 0,
      currency: template.base_currency || 'INR',
      internalPaasPricing: template.internal_paas_pricing || [],
      template: template.template_name
    };

    // Apply business rules
    const applicableRules = this.rules.filter(rule => {
      if (!rule.is_active) return false;
      
      switch (rule.condition_type) {
        case 'organization_type':
          return rule.condition_value === organizationType;
        case 'membership_status':
          return rule.condition_value === membershipStatus;
        case 'country':
          return rule.condition_value === country;
        default:
          return false;
      }
    }).sort((a, b) => a.priority - b.priority);

    // Apply rules in priority order
    applicableRules.forEach(rule => {
      if (rule.rule_type === 'member_discount' && rule.target_field === 'all_fees' && membershipStatus === 'Member') {
        // Apply member discount to all applicable fees
        const discountMultiplier = 1 - (rule.adjustment_value / 100);
        calculatedPricing.memberDiscount = rule.adjustment_value;
        
        if (calculatedPricing.platformFeePercentage && calculatedPricing.platformFeePercentage > 0) {
          calculatedPricing.platformFeePercentage *= discountMultiplier;
        }
        if (calculatedPricing.quarterlyFee && calculatedPricing.quarterlyFee > 0) {
          calculatedPricing.quarterlyFee *= discountMultiplier;
        }
        if (calculatedPricing.halfYearlyFee && calculatedPricing.halfYearlyFee > 0) {
          calculatedPricing.halfYearlyFee *= discountMultiplier;
        }
        if (calculatedPricing.annualFee && calculatedPricing.annualFee > 0) {
          calculatedPricing.annualFee *= discountMultiplier;
        }
      } else if (rule.rule_type === 'org_multiplier') {
        // Apply organization-specific multipliers
        calculatedPricing.orgDiscount = (1 - rule.adjustment_value) * 100;
        
        const targetValue = (calculatedPricing as any)[rule.target_field];
        if (typeof targetValue === 'number' && targetValue > 0) {
          (calculatedPricing as any)[rule.target_field] = targetValue * rule.adjustment_value;
        }
      }
    });

    // Round values to 2 decimal places
    if (calculatedPricing.platformFeePercentage) {
      calculatedPricing.platformFeePercentage = Math.round(calculatedPricing.platformFeePercentage * 100) / 100;
    }
    if (calculatedPricing.quarterlyFee) {
      calculatedPricing.quarterlyFee = Math.round(calculatedPricing.quarterlyFee * 100) / 100;
    }
    if (calculatedPricing.halfYearlyFee) {
      calculatedPricing.halfYearlyFee = Math.round(calculatedPricing.halfYearlyFee * 100) / 100;
    }
    if (calculatedPricing.annualFee) {
      calculatedPricing.annualFee = Math.round(calculatedPricing.annualFee * 100) / 100;
    }

    console.log('🎯 Calculated pricing:', {
      country,
      organizationType,
      entityType,
      engagementModel,
      membershipStatus,
      result: calculatedPricing
    });

    return calculatedPricing;
  }

  // Convert calculated pricing to legacy PricingConfig format for compatibility
  static convertToLegacyConfig(
    calculated: CalculatedPricing,
    country: string,
    organizationType: string,
    entityType: string,
    engagementModel: string,
    membershipStatus: 'Member' | 'Non-Member'
  ): PricingConfig {
    const configId = `${country}-${organizationType}-${entityType}-${engagementModel}-${membershipStatus}`;
    
    return {
      id: configId,
      country,
      currency: calculated.currency,
      organizationType,
      entityType,
      engagementModel,
      membershipStatus: membershipStatus === 'Member' ? 'member' : 'not-a-member',
      platformFeePercentage: calculated.platformFeePercentage,
      quarterlyFee: calculated.quarterlyFee,
      halfYearlyFee: calculated.halfYearlyFee,
      annualFee: calculated.annualFee,
      discountPercentage: calculated.memberDiscount || 0,
      internalPaasPricing: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Generate all possible pricing configurations dynamically
  static async generateAllConfigurations(): Promise<PricingConfig[]> {
    try {
      // Get all master data
      const [countriesResult, orgTypesResult, entityTypesResult, engagementModelsResult] = await Promise.all([
        supabase.from('master_countries').select('name'),
        supabase.from('master_organization_types').select('name'),
        supabase.from('master_entity_types').select('name'),
        supabase.from('master_engagement_models').select('name')
      ]);

      const countries = countriesResult.data?.map(c => c.name) || [];
      const orgTypes = orgTypesResult.data?.map(o => o.name) || [];
      const entityTypes = entityTypesResult.data?.map(e => e.name) || [];
      const engagementModels = engagementModelsResult.data?.map(em => em.name) || [];
      const membershipStatuses: ('Member' | 'Non-Member')[] = ['Member', 'Non-Member'];

      const configurations: PricingConfig[] = [];

      // Generate all combinations
      const combinations = [];
      for (const country of countries) {
        for (const orgType of orgTypes) {
          for (const entityType of entityTypes) {
            for (const engagementModel of engagementModels) {
              for (const membershipStatus of membershipStatuses) {
                combinations.push({
                  country,
                  orgType,
                  entityType,
                  engagementModel,
                  membershipStatus
                });
              }
            }
          }
        }
      }

      // Process combinations
      for (const combo of combinations) {
        const calculated = await this.calculatePricing(
          combo.country,
          combo.orgType,
          combo.entityType,
          combo.engagementModel,
          combo.membershipStatus
        );

        if (calculated) {
          const config = this.convertToLegacyConfig(
            calculated,
            combo.country,
            combo.orgType,
            combo.entityType,
            combo.engagementModel,
            combo.membershipStatus
          );
          configurations.push(config);
        }
      }

      console.log(`✅ Generated ${configurations.length} pricing configurations dynamically`);
      return configurations;
    } catch (error) {
      console.error('❌ Error generating configurations:', error);
      return [];
    }
  }

  static async refreshCache(): Promise<void> {
    this.isLoaded = false;
    await this.loadPricingSystem();
  }
}