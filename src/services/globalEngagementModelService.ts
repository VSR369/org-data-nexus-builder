import { supabase } from '@/integrations/supabase/client';

export interface TierEngagementRules {
  selection_scope: 'global' | 'per_challenge';
  max_concurrent_models: number;
  switch_requirements: 'no_active_challenges' | 'pause_all' | 'complete_all' | 'none';
  allows_multiple_challenges: boolean;
  business_rules?: Record<string, any>;
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  error_code?: string;
  active_challenges_count?: number;
  tier_rules?: TierEngagementRules;
}

export interface GlobalModelInfo {
  has_global_model: boolean;
  current_model: string | null;
  model_info?: {
    id: string;
    name: string;
    description: string;
  };
}

export class GlobalEngagementModelService {
  /**
   * Get user's current global engagement model
   */
  static async getCurrentGlobalModel(userId: string): Promise<GlobalModelInfo | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_current_global_model', {
        user_id_param: userId
      });

      if (error) {
        console.error('Error getting current global model:', error);
        return null;
      }

      return data as unknown as GlobalModelInfo;
    } catch (error) {
      console.error('Error in getCurrentGlobalModel:', error);
      return null;
    }
  }

  /**
   * Validate if user can switch to a new engagement model
   */
  static async validateModelSwitch(
    userId: string,
    tierId: string,
    newModelId: string
  ): Promise<ValidationResult> {
    try {
      const { data, error } = await supabase.rpc('validate_engagement_model_switch', {
        user_id_param: userId,
        tier_id_param: tierId,
        new_model_id: newModelId
      });

      if (error) {
        console.error('Error validating model switch:', error);
        return {
          allowed: false,
          reason: 'Validation service error',
          error_code: 'VALIDATION_ERROR'
        };
      }

      return data as unknown as ValidationResult;
    } catch (error) {
      console.error('Error in validateModelSwitch:', error);
      return {
        allowed: false,
        reason: 'Service error',
        error_code: 'SERVICE_ERROR'
      };
    }
  }

  /**
   * Get available engagement models for a specific tier
   */
  static async getAvailableModels(tierId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('master_tier_engagement_model_access')
        .select(`
          *,
          engagement_model:master_engagement_models(id, name, description)
        `)
        .eq('pricing_tier_id', tierId)
        .eq('is_active', true)
        .eq('is_allowed', true);

      if (error) {
        console.error('Error getting available models:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAvailableModels:', error);
      return [];
    }
  }

  /**
   * Check active challenges count for user
   */
  static async checkActivechallenges(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('check_active_challenges_for_user', {
        user_id_param: userId
      });

      if (error) {
        console.error('Error checking active challenges:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error in checkActiveChildren:', error);
      return 0;
    }
  }

  /**
   * Get tier rules for a specific tier and engagement model
   */
  static async getTierRules(tierId: string, modelId: string): Promise<TierEngagementRules | null> {
    try {
      const { data, error } = await supabase
        .from('master_tier_engagement_model_access')
        .select('selection_scope, max_concurrent_models, switch_requirements, allows_multiple_challenges, business_rules')
        .eq('pricing_tier_id', tierId)
        .eq('engagement_model_id', modelId)
        .eq('is_active', true)
        .eq('is_allowed', true)
        .single();

      if (error) {
        console.error('Error getting tier rules:', error);
        return null;
      }

      return data as unknown as TierEngagementRules;
    } catch (error) {
      console.error('Error in getTierRules:', error);
      return null;
    }
  }

  /**
   * Switch user's global engagement model (for Basic tier)
   */
  static async switchGlobalModel(
    userId: string,
    tierId: string,
    newModelId: string,
    newModelName: string
  ): Promise<{ success: boolean; message: string; validation?: ValidationResult }> {
    try {
      // First validate the switch
      const validation = await this.validateModelSwitch(userId, tierId, newModelId);
      
      if (!validation.allowed) {
        return {
          success: false,
          message: validation.reason || 'Switch not allowed',
          validation
        };
      }

      // For Basic tier (global scope), we need to update all active challenges
      // to use the new engagement model
      const { error } = await supabase
        .from('engagement_activations')
        .update({
          engagement_model: newModelName,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('activation_status', 'Activated');

      if (error) {
        console.error('Error switching global model:', error);
        return {
          success: false,
          message: 'Failed to switch global engagement model',
          validation
        };
      }

      return {
        success: true,
        message: 'Global engagement model switched successfully',
        validation
      };
    } catch (error) {
      console.error('Error in switchGlobalModel:', error);
      return {
        success: false,
        message: 'Service error during model switch'
      };
    }
  }

  /**
   * Get user's tier information
   */
  static async getUserTierInfo(userId: string): Promise<any> {
    try {
      // This would need to be implemented based on how user tier information is stored
      // For now, returning a placeholder
      const { data, error } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .eq('activation_status', 'Activated')
        .limit(1)
        .single();

      if (error) {
        console.error('Error getting user tier info:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserTierInfo:', error);
      return null;
    }
  }
}