import { supabase } from '@/integrations/supabase/client';
import { EngagementFeeCalculator } from './EngagementFeeCalculator';

export class PricingCalculationService {
  /**
   * Enhanced calculation method using the new engagement-based fee system
   */
  static async calculateEngagementPricing(context: {
    solutionFee: number;
    challengeComplexity: string;
    engagementModel: string;
    country: string;
    organizationType: string;
    entityType: string;
    membershipStatus?: string;
  }) {
    try {
      // Use the new EngagementFeeCalculator
      const result = await EngagementFeeCalculator.calculateTotalFees({
        ...context,
        membershipStatus: context.membershipStatus || 'Not Active'
      });
      
      return {
        solutionFee: context.solutionFee,
        platformUsageFee: result.fees.platformUsageFee,
        managementFee: result.fees.managementFee,
        consultingFee: result.fees.consultingFee,
        totalFee: result.totalFee,
        advancePayment: result.fees.advancePayment,
        breakdown: result.breakdown,
        // Legacy compatibility
        baseValue: context.solutionFee,
        totalValue: result.totalFee,
        complexityMultiplier: result.breakdown.complexityMultiplier,
        adjustedManagementFee: result.fees.managementFee,
        adjustedConsultingFee: result.fees.consultingFee
      };
    } catch (error) {
      console.error('Error calculating engagement pricing:', error);
      throw error;
    }
  }

  /**
   * @deprecated Use calculateEngagementPricing instead
   * Legacy method for backward compatibility
   */
  static async calculatePricing(context: any) {
    console.warn('PricingCalculationService.calculatePricing is deprecated. Use calculateEngagementPricing instead.');
    
    // Basic implementation for immediate functionality
    const baseValue = context.baseValue || 0;
    const discount = context.membershipDiscount || 0;
    const discountedValue = baseValue * (1 - discount / 100);
    
    // Get complexity multipliers from database if complexity is specified
    let complexityMultiplier = 1.0;
    if (context.complexityLevel) {
      const complexityData = await this.getComplexityMultiplier(context.complexityLevel);
      if (complexityData) {
        complexityMultiplier = complexityData.management_fee_multiplier || 1.0;
      }
    }
    
    return {
      baseValue,
      discountedValue,
      platformFee: discountedValue * 0.15,
      advancePayment: (discountedValue * 0.15) * 0.25,
      totalValue: discountedValue + (discountedValue * 0.15),
      complexityMultiplier,
      adjustedManagementFee: context.managementFee ? context.managementFee * complexityMultiplier : 0,
      adjustedConsultingFee: context.consultingFee ? context.consultingFee * complexityMultiplier : 0
    };
  }

  static async getComplexityMultiplier(complexityLevel: string) {
    try {
      const { data, error } = await supabase
        .from('master_challenge_complexity')
        .select('*')
        .eq('name', complexityLevel)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching complexity multiplier:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getComplexityMultiplier:', error);
      return null;
    }
  }

  static async getAvailableComplexityLevels() {
    try {
      const { data, error } = await supabase
        .from('master_challenge_complexity')
        .select('*')
        .eq('is_active', true)
        .order('level_order');

      if (error) {
        console.error('Error fetching complexity levels:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAvailableComplexityLevels:', error);
      return [];
    }
  }

  static async calculateComplexityAdjustedFees(baseManagementFee: number, baseConsultingFee: number, complexityLevel: string) {
    const complexityData = await this.getComplexityMultiplier(complexityLevel);
    
    if (!complexityData) {
      return {
        managementFee: baseManagementFee,
        consultingFee: baseConsultingFee,
        complexityMultiplier: 1.0
      };
    }

    return {
      managementFee: baseManagementFee * complexityData.management_fee_multiplier,
      consultingFee: baseConsultingFee * complexityData.consulting_fee_multiplier,
      complexityMultiplier: complexityData.management_fee_multiplier,
      complexityData
    };
  }
}