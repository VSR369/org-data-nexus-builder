import { supabase } from '@/integrations/supabase/client';

export interface StructuredFormulaCalculation {
  solutionFee: number;
  platformUsageFee: number;
  managementFee: number;
  consultingFee: number;
  totalFee: number;
  advancePayment: number;
  complexityLevel: string;
  managementMultiplier: number;
  consultingMultiplier: number;
  engagementModel: string;
  breakdown: {
    platformPercentage: number;
    baseManagementFee: number;
    baseConsultingFee: number;
    advancePercentage: number;
  };
}

export class StructuredFormulaService {
  /**
   * Calculate fees using structured formula configuration
   */
  static async calculateStructuredFormula(
    formulaId: string,
    solutionFee: number,
    complexityLevel: string = 'Medium'
  ): Promise<StructuredFormulaCalculation> {
    try {
      // Call the database function using direct SQL query
      const { data, error } = await supabase
        .from('master_platform_fee_formulas')
        .select(`
          *,
          master_engagement_models (
            name
          )
        `)
        .eq('id', formulaId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching formula:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Formula not found');
      }

      // Get complexity multipliers
      const { data: complexityData, error: complexityError } = await supabase
        .from('master_challenge_complexity')
        .select('*')
        .eq('name', complexityLevel)
        .eq('is_active', true)
        .single();

      if (complexityError) {
        console.error('Error fetching complexity:', complexityError);
        throw complexityError;
      }

      // Calculate fees
      const platformUsageFee = solutionFee * (data.platform_usage_fee_percentage / 100);
      const managementFee = data.base_management_fee * (complexityData?.management_fee_multiplier || 1);
      const consultingFee = data.base_consulting_fee * (complexityData?.consulting_fee_multiplier || 1);

      // Calculate total based on engagement model
      let totalFee = platformUsageFee;
      const engagementModelName = data.master_engagement_models?.name || '';

      switch (engagementModelName) {
        case 'Market Place':
          totalFee = platformUsageFee + managementFee;
          break;
        case 'Market Place & Aggregator':
          totalFee = platformUsageFee + managementFee + consultingFee;
          break;
        case 'Platform as a Service':
          totalFee = platformUsageFee + consultingFee;
          break;
        default: // Aggregator
          totalFee = platformUsageFee;
      }

      const advancePayment = totalFee * (data.advance_payment_percentage / 100);

      return {
        solutionFee,
        platformUsageFee,
        managementFee,
        consultingFee,
        totalFee,
        advancePayment,
        complexityLevel,
        managementMultiplier: complexityData?.management_fee_multiplier || 1,
        consultingMultiplier: complexityData?.consulting_fee_multiplier || 1,
        engagementModel: engagementModelName,
        breakdown: {
          platformPercentage: data.platform_usage_fee_percentage,
          baseManagementFee: data.base_management_fee,
          baseConsultingFee: data.base_consulting_fee,
          advancePercentage: data.advance_payment_percentage
        }
      };
    } catch (error) {
      console.error('Error in calculateStructuredFormula:', error);
      throw error;
    }
  }

  /**
   * Get all structured formulas for a specific engagement model
   */
  static async getStructuredFormulasForEngagementModel(engagementModelId: string) {
    try {
      const { data, error } = await supabase
        .from('master_platform_fee_formulas')
        .select(`
          *,
          master_engagement_models!inner (
            id,
            name
          )
        `)
        .eq('engagement_model_id', engagementModelId)
        .eq('formula_type', 'structured')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching structured formulas:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getStructuredFormulasForEngagementModel:', error);
      throw error;
    }
  }

  /**
   * Get all structured formulas with engagement model names
   */
  static async getAllStructuredFormulas() {
    try {
      const { data, error } = await supabase
        .from('master_platform_fee_formulas')
        .select(`
          *,
          master_engagement_models (
            id,
            name
          )
        `)
        .eq('formula_type', 'structured')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all structured formulas:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getAllStructuredFormulas:', error);
      throw error;
    }
  }

  /**
   * Validate formula configuration
   */
  static validateFormulaConfiguration(formula: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formula.formula_name?.trim()) {
      errors.push('Formula name is required');
    }

    if (!formula.engagement_model_id) {
      errors.push('Engagement model is required');
    }

    if (formula.platform_usage_fee_percentage < 0 || formula.platform_usage_fee_percentage > 100) {
      errors.push('Platform usage fee percentage must be between 0 and 100');
    }

    if (formula.base_management_fee < 0) {
      errors.push('Base management fee cannot be negative');
    }

    if (formula.base_consulting_fee < 0) {
      errors.push('Base consulting fee cannot be negative');
    }

    if (formula.advance_payment_percentage < 0 || formula.advance_payment_percentage > 100) {
      errors.push('Advance payment percentage must be between 0 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get formula by engagement model name (for Challenge Management integration)
   */
  static async getFormulaByEngagementModel(engagementModelName: string) {
    try {
      const { data, error } = await supabase
        .from('master_platform_fee_formulas')
        .select(`
          *,
          master_engagement_models!inner (
            id,
            name
          )
        `)
        .eq('master_engagement_models.name', engagementModelName)
        .eq('formula_type', 'structured')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching formula by engagement model:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getFormulaByEngagementModel:', error);
      throw error;
    }
  }

  /**
   * Calculate fees for Challenge Management integration
   */
  static async calculateFeesForChallenge(
    engagementModelName: string,
    solutionFee: number,
    complexityLevel: string,
    additionalContext?: any
  ): Promise<StructuredFormulaCalculation> {
    try {
      // Get the formula for the engagement model
      const formula = await this.getFormulaByEngagementModel(engagementModelName);
      
      if (!formula) {
        throw new Error(`No structured formula found for engagement model: ${engagementModelName}`);
      }

      // Calculate using the formula
      const result = await this.calculateStructuredFormula(
        formula.id,
        solutionFee,
        complexityLevel
      );

      return result;
    } catch (error) {
      console.error('Error in calculateFeesForChallenge:', error);
      throw error;
    }
  }
}