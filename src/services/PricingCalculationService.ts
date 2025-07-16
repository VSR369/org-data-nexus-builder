import { supabase } from '@/integrations/supabase/client';

export class PricingCalculationService {
  static async calculatePricing(context: any) {
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