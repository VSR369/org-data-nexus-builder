import { supabase } from '@/integrations/supabase/client';

interface CalculationContext {
  solutionFee: number;
  challengeComplexity: string;
  engagementModel: string;
  country: string;
  organizationType: string;
  entityType: string;
  membershipStatus: string;
}

interface FeeParameter {
  id: string;
  component_type: string;
  name: string;
  amount: number;
  rate_type: 'currency' | 'percentage';
  complexity_applicable: boolean;
  currency_code?: string;
  unit_symbol?: string;
}

interface CalculationResult {
  fees: {
    platformUsageFee: number;
    managementFee: number;
    consultingFee: number;
    advancePayment: number;
  };
  totalFee: number;
  breakdown: {
    solutionFee: number;
    complexity: string;
    complexityMultiplier: number;
    engagementModel: string;
    currency: string;
    details: Array<{
      name: string;
      baseAmount: number;
      multiplier: number;
      finalAmount: number;
      type: 'currency' | 'percentage';
    }>;
  };
}

export class EngagementFeeCalculator {
  static async calculateTotalFees(context: CalculationContext): Promise<CalculationResult> {
    try {
      // 1. Fetch base rates from database
      const feeParameters = await this.getFeeParametersByContext(context);
      
      // 2. Get complexity multipliers
      const complexityData = await this.getComplexityMultiplier(context.challengeComplexity);
      
      // 3. Calculate individual fees based on engagement model
      const fees = await this.calculateEngagementModelFees(context, feeParameters, complexityData);
      
      // 4. Sum up total based on engagement model rules
      const totalFee = this.sumFeesForEngagementModel(fees, context.engagementModel);
      
      // 5. Calculate advance payment
      const advancePaymentRate = feeParameters.find(p => p.component_type === 'advance_payment')?.amount || 25;
      const advancePayment = totalFee * (advancePaymentRate / 100);
      
      // 6. Create breakdown
      const breakdown = this.createBreakdown(context, feeParameters, complexityData, fees);
      
      return {
        fees: {
          platformUsageFee: fees.platformUsageFee,
          managementFee: fees.managementFee,
          consultingFee: fees.consultingFee,
          advancePayment
        },
        totalFee,
        breakdown
      };
    } catch (error) {
      console.error('Error calculating fees:', error);
      throw new Error('Failed to calculate engagement fees');
    }
  }

  private static async getFeeParametersByContext(context: CalculationContext): Promise<FeeParameter[]> {
    const { data, error } = await supabase
      .from('master_pricing_parameters')
      .select(`
        id,
        amount,
        rate_type,
        complexity_applicable,
        master_fee_components!inner (
          name,
          component_type
        ),
        master_countries!inner (
          name
        ),
        master_organization_types!inner (
          name
        ),
        master_entity_types!inner (
          name
        ),
        master_currencies (
          code,
          symbol
        )
      `)
      .eq('master_countries.name', context.country)
      .eq('master_organization_types.name', context.organizationType)
      .eq('master_entity_types.name', context.entityType)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching fee parameters:', error);
      throw error;
    }

    return data.map(param => ({
      id: param.id,
      component_type: param.master_fee_components.component_type,
      name: param.master_fee_components.name,
      amount: param.amount,
      rate_type: param.rate_type as 'currency' | 'percentage',
      complexity_applicable: param.complexity_applicable,
      currency_code: param.master_currencies?.code,
      unit_symbol: param.master_currencies?.symbol
    }));
  }

  private static async getComplexityMultiplier(complexityLevel: string) {
    const { data, error } = await supabase
      .from('master_challenge_complexity')
      .select('*')
      .eq('name', complexityLevel)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching complexity multiplier:', error);
      return {
        name: 'Low',
        management_fee_multiplier: 1.0,
        consulting_fee_multiplier: 1.0
      };
    }

    return data;
  }

  private static async calculateEngagementModelFees(
    context: CalculationContext,
    feeParameters: FeeParameter[],
    complexityData: any
  ) {
    // Get engagement model specific fee mappings
    const { data: mappings, error } = await supabase
      .from('engagement_model_fee_mapping')
      .select(`
        fee_component_id,
        is_required,
        calculation_order,
        master_engagement_models!inner (
          name
        ),
        master_fee_components!inner (
          component_type
        )
      `)
      .eq('master_engagement_models.name', context.engagementModel)
      .eq('is_required', true);

    if (error) {
      console.error('Error fetching engagement model mappings:', error);
      throw error;
    }

    const fees = {
      platformUsageFee: 0,
      managementFee: 0,
      consultingFee: 0
    };

    // Calculate each required fee for this engagement model
    for (const mapping of mappings) {
      const componentType = mapping.master_fee_components.component_type;
      const feeParam = feeParameters.find(p => p.component_type === componentType);
      
      if (!feeParam) continue;

      switch (componentType) {
        case 'platform_usage_fee':
          fees.platformUsageFee = context.solutionFee * (feeParam.amount / 100);
          break;
        
        case 'management_fee':
          const managementMultiplier = feeParam.complexity_applicable ? complexityData.management_fee_multiplier : 1.0;
          fees.managementFee = feeParam.amount * managementMultiplier;
          break;
        
        case 'consulting_fee':
          const consultingMultiplier = feeParam.complexity_applicable ? complexityData.consulting_fee_multiplier : 1.0;
          fees.consultingFee = feeParam.amount * consultingMultiplier;
          break;
      }
    }

    return fees;
  }

  private static sumFeesForEngagementModel(fees: any, engagementModel: string): number {
    let total = fees.platformUsageFee;

    switch (engagementModel) {
      case 'Marketplace General':
        total += fees.managementFee;
        break;
      
      case 'Marketplace Program Managed':
        total += fees.managementFee + fees.consultingFee;
        break;
      
      case 'Aggregator':
        // Only platform usage fee
        break;
      
      default:
        console.warn(`Unknown engagement model: ${engagementModel}`);
        break;
    }

    return total;
  }

  private static createBreakdown(
    context: CalculationContext,
    feeParameters: FeeParameter[],
    complexityData: any,
    fees: any
  ) {
    const details = [];

    // Platform Usage Fee
    const platformFee = feeParameters.find(p => p.component_type === 'platform_usage_fee');
    if (platformFee) {
      details.push({
        name: platformFee.name,
        baseAmount: platformFee.amount,
        multiplier: 1.0,
        finalAmount: fees.platformUsageFee,
        type: platformFee.rate_type
      });
    }

    // Management Fee
    const managementFee = feeParameters.find(p => p.component_type === 'management_fee');
    if (managementFee && fees.managementFee > 0) {
      details.push({
        name: managementFee.name,
        baseAmount: managementFee.amount,
        multiplier: managementFee.complexity_applicable ? complexityData.management_fee_multiplier : 1.0,
        finalAmount: fees.managementFee,
        type: managementFee.rate_type
      });
    }

    // Consulting Fee
    const consultingFee = feeParameters.find(p => p.component_type === 'consulting_fee');
    if (consultingFee && fees.consultingFee > 0) {
      details.push({
        name: consultingFee.name,
        baseAmount: consultingFee.amount,
        multiplier: consultingFee.complexity_applicable ? complexityData.consulting_fee_multiplier : 1.0,
        finalAmount: fees.consultingFee,
        type: consultingFee.rate_type
      });
    }

    return {
      solutionFee: context.solutionFee,
      complexity: context.challengeComplexity,
      complexityMultiplier: complexityData.management_fee_multiplier,
      engagementModel: context.engagementModel,
      currency: feeParameters[0]?.currency_code || 'USD',
      details
    };
  }

  static async validateCalculationInputs(context: CalculationContext): Promise<boolean> {
    // Check if all required fields are present
    const requiredFields = ['solutionFee', 'challengeComplexity', 'engagementModel', 'country', 'organizationType', 'entityType'];
    
    for (const field of requiredFields) {
      if (!context[field as keyof CalculationContext]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate solution fee is positive
    if (context.solutionFee <= 0) {
      throw new Error('Solution fee must be a positive number');
    }

    // Validate complexity level exists
    const { data: complexityExists } = await supabase
      .from('master_challenge_complexity')
      .select('id')
      .eq('name', context.challengeComplexity)
      .eq('is_active', true)
      .single();

    if (!complexityExists) {
      throw new Error(`Invalid complexity level: ${context.challengeComplexity}`);
    }

    // Validate engagement model exists
    const { data: engagementExists } = await supabase
      .from('master_engagement_models')
      .select('id')
      .eq('name', context.engagementModel)
      .single();

    if (!engagementExists) {
      throw new Error(`Invalid engagement model: ${context.engagementModel}`);
    }

    return true;
  }
}