// Engagement Model Validation Utility
// Validates if engagement model details are complete before allowing seeker approval/rejection

export interface EngagementValidationResult {
  isValid: boolean;
  hasEngagementModel: boolean;
  hasPricing: boolean;
  hasMembership: boolean;
  missingDetails: string[];
  engagementData?: any;
  membershipData?: any;
}

export class EngagementValidator {
  
  /**
   * Validate engagement model completion for a specific seeker
   */
  static validateSeekerEngagement(seekerId: string, organizationId?: string, organizationName?: string): EngagementValidationResult {
    console.log('🔍 Validating engagement details for seeker:', seekerId, organizationName);
    
    const result: EngagementValidationResult = {
      isValid: false,
      hasEngagementModel: false,
      hasPricing: false,
      hasMembership: false,
      missingDetails: [],
      engagementData: null,
      membershipData: null
    };

    try {
      // Check for engagement model selection
      const engagementKeys = [
        'engagement_model_selection',
        'selected_engagement_model',
        `engagement_${seekerId}`,
        `engagement_${organizationId}`,
        'current_engagement_model'
      ];

      let engagementData = null;
      for (const key of engagementKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.model)) {
              engagementData = parsed;
              result.engagementData = engagementData;
              result.hasEngagementModel = true;
              console.log('✅ Found engagement model:', key, parsed);
              break;
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse engagement data for key:', key);
          }
        }
      }

      // Check for pricing details
      const pricingKeys = [
        `pricing_${seekerId}`,
        `selected_pricing_${organizationId}`,
        'engagement_pricing',
        'current_pricing_model'
      ];

      for (const key of pricingKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.currency || parsed.amount || parsed.pricing)) {
              result.hasPricing = true;
              console.log('✅ Found pricing details:', key);
              break;
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse pricing data for key:', key);
          }
        }
      }

      // Check for membership status (optional but good to have)
      const membershipKeys = [
        `membership_${seekerId}`,
        `membership_${organizationId}`,
        `${organizationName}_membership`,
        'selected_membership_plan',
        'completed_membership_payment'
      ];

      for (const key of membershipKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.status || parsed.plan || parsed.membershipStatus)) {
              result.membershipData = parsed;
              result.hasMembership = true;
              console.log('✅ Found membership data:', key);
              break;
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse membership data for key:', key);
          }
        }
      }

      // Build missing details list
      if (!result.hasEngagementModel) {
        result.missingDetails.push('Engagement Model Selection');
      }
      if (!result.hasPricing) {
        result.missingDetails.push('Pricing Configuration');
      }

      // Validation is successful if engagement model is selected
      // Pricing is recommended but not mandatory for basic validation
      result.isValid = result.hasEngagementModel;

      console.log('📊 Engagement validation result:', {
        seekerId,
        organizationName,
        isValid: result.isValid,
        hasEngagementModel: result.hasEngagementModel,
        hasPricing: result.hasPricing,
        hasMembership: result.hasMembership,
        missingCount: result.missingDetails.length
      });

      return result;

    } catch (error) {
      console.error('❌ Error during engagement validation:', error);
      result.missingDetails.push('Validation Error - Please try again');
      return result;
    }
  }

  /**
   * Global engagement validation check
   */
  static validateGlobalEngagement(): EngagementValidationResult {
    console.log('🌐 Performing global engagement validation...');
    
    // Check if any engagement model selection exists in the system
    const globalKeys = [
      'engagement_model_selection',
      'selected_engagement_model',
      'current_engagement_model',
      'global_engagement_config'
    ];

    for (const key of globalKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.model)) {
            console.log('✅ Global engagement configuration found');
            return {
              isValid: true,
              hasEngagementModel: true,
              hasPricing: false,
              hasMembership: false,
              missingDetails: [],
              engagementData: parsed
            };
          }
        } catch (e) {
          console.warn('⚠️ Failed to parse global engagement data for key:', key);
        }
      }
    }

    console.log('❌ No global engagement configuration found');
    return {
      isValid: false,
      hasEngagementModel: false,
      hasPricing: false,
      hasMembership: false,
      missingDetails: ['Global Engagement Model Configuration'],
      engagementData: null
    };
  }

  /**
   * Get user-friendly error message
   */
  static getValidationMessage(validation: EngagementValidationResult): string {
    if (validation.isValid) {
      return 'Engagement details are complete. You can approve or reject this seeker.';
    }

    const missing = validation.missingDetails.join(', ');
    return `Please login to the Solution Seeking Organization dashboard and complete your ${missing.toLowerCase()} before validating seekers.`;
  }
}