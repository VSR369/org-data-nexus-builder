import { FormulaCalculationEngine } from './FormulaCalculationEngine';

export interface PricingContext {
  baseValue: number;
  countryId: string;
  currencyId: string;
  organizationTypeId: string;
  entityTypeId: string;
  engagementModelId: string;
  engagementModelSubtypeId?: string;
  membershipStatusId: string;
  pricingTierId?: string;
  billingFrequencyId?: string;
}

export interface CalculatedPricing {
  baseValue: number;
  platformFee: number;
  advancePayment: number;
  managementFee: number;
  consultingFee: number;
  membershipDiscount: number;
  totalValue: number;
  calculatedValue: number;
  currency: string;
  breakdown: {
    platformFeeFormula?: string;
    platformFeeVariables?: Record<string, any>;
    advancePaymentPercentage?: number;
    countryMultiplier?: number;
    tierDiscount?: number;
  };
}

export class PricingCalculationService {
  /**
   * Calculates comprehensive pricing for a given context
   */
  static async calculatePricing(
    context: PricingContext,
    masterData: any,
    formulaData?: any
  ): Promise<CalculatedPricing> {
    try {
      // Get country-specific parameters
      const countryParams = await this.getCountrySpecificParameters(
        context.countryId,
        context.organizationTypeId,
        context.entityTypeId,
        masterData
      );

      // Calculate base fees
      const managementFee = countryParams.managementFee || 0;
      const consultingFee = countryParams.consultingFee || 0;

      // Get formula variables
      const formulaVariables = this.buildFormulaVariables(context, countryParams, masterData);

      // Calculate platform fee using formula or default
      const platformFee = formulaData?.formula 
        ? FormulaCalculationEngine.calculatePlatformFee(
            context.baseValue,
            formulaData.formula,
            { ...formulaVariables, ...formulaData.variables }
          )
        : context.baseValue * 0.1; // 10% default

      // Calculate advance payment
      const advancePaymentPercentage = formulaData?.advancePaymentPercentage || 0;
      const advancePayment = FormulaCalculationEngine.calculateAdvancePayment(
        platformFee,
        advancePaymentPercentage
      );

      // Get membership discount
      const membershipDiscount = this.getMembershipDiscount(
        context.membershipStatusId,
        masterData
      );

      // Calculate totals
      const totalBeforeDiscount = context.baseValue + platformFee + managementFee + consultingFee;
      const discountAmount = totalBeforeDiscount * (membershipDiscount / 100);
      const calculatedValue = totalBeforeDiscount - discountAmount;

      // Get currency info
      const currency = masterData.currencies?.find((c: any) => c.id === context.currencyId);

      return {
        baseValue: context.baseValue,
        platformFee,
        advancePayment,
        managementFee,
        consultingFee,
        membershipDiscount,
        totalValue: totalBeforeDiscount,
        calculatedValue,
        currency: currency?.code || 'USD',
        breakdown: {
          platformFeeFormula: formulaData?.formula,
          platformFeeVariables: formulaVariables,
          advancePaymentPercentage,
          countryMultiplier: formulaVariables.country_multiplier,
          tierDiscount: formulaVariables.tier_discount,
        },
      };
    } catch (error) {
      console.error('Pricing calculation error:', error);
      throw new Error(`Failed to calculate pricing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets country-specific pricing parameters
   */
  private static async getCountrySpecificParameters(
    countryId: string,
    organizationTypeId: string,
    entityTypeId: string,
    masterData: any
  ): Promise<Record<string, number>> {
    // This would typically query the master_pricing_parameters table
    // For now, return default values
    return {
      managementFee: 100, // Default management fee
      consultingFee: 50,  // Default consulting fee
      country_multiplier: 1, // Default country multiplier
    };
  }

  /**
   * Builds variables for formula calculation
   */
  private static buildFormulaVariables(
    context: PricingContext,
    countryParams: Record<string, number>,
    masterData: any
  ): Record<string, any> {
    // Get tier-specific discount
    const tier = masterData.pricingTiers?.find((t: any) => t.id === context.pricingTierId);
    const tierDiscount = tier?.discount_percentage || 0;

    // Get currency rate (assuming USD as base)
    const currency = masterData.currencies?.find((c: any) => c.id === context.currencyId);
    const currencyRate = currency?.exchange_rate || 1;

    return {
      base_value: context.baseValue,
      country_multiplier: countryParams.country_multiplier || 1,
      currency_rate: currencyRate,
      tier_discount: tierDiscount,
      management_fee: countryParams.managementFee || 0,
      consulting_fee: countryParams.consultingFee || 0,
      fixed_fee: 0,
      percentage_fee: 10, // Default 10%
      minimum_fee: 50,
      maximum_fee: 10000,
    };
  }

  /**
   * Gets membership discount based on status
   */
  private static getMembershipDiscount(
    membershipStatusId: string,
    masterData: any
  ): number {
    const status = masterData.membershipStatuses?.find((s: any) => s.id === membershipStatusId);
    // This would typically be stored in the membership status or a separate discount table
    const discountMap: Record<string, number> = {
      'Active': 10,      // 10% discount for active members
      'Premium': 15,     // 15% discount for premium members
      'VIP': 20,         // 20% discount for VIP members
      'Not Active': 0,   // No discount for inactive members
    };
    
    return discountMap[status?.name] || 0;
  }

  /**
   * Validates pricing configuration before calculation
   */
  static validatePricingContext(context: PricingContext): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!context.baseValue || context.baseValue <= 0) {
      errors.push('Base value must be greater than 0');
    }

    if (!context.countryId) {
      errors.push('Country is required');
    }

    if (!context.organizationTypeId) {
      errors.push('Organization type is required');
    }

    if (!context.entityTypeId) {
      errors.push('Entity type is required');
    }

    if (!context.engagementModelId) {
      errors.push('Engagement model is required');
    }

    if (!context.membershipStatusId) {
      errors.push('Membership status is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Formats pricing result for display
   */
  static formatPricingDisplay(pricing: CalculatedPricing): Record<string, string> {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing.currency,
      minimumFractionDigits: 2,
    });

    return {
      baseValue: formatter.format(pricing.baseValue),
      platformFee: formatter.format(pricing.platformFee),
      advancePayment: formatter.format(pricing.advancePayment),
      managementFee: formatter.format(pricing.managementFee),
      consultingFee: formatter.format(pricing.consultingFee),
      membershipDiscount: `${pricing.membershipDiscount}%`,
      totalValue: formatter.format(pricing.totalValue),
      calculatedValue: formatter.format(pricing.calculatedValue),
    };
  }
}