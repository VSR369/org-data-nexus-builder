
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface MembershipData {
  status: 'active' | 'inactive';
  plan: string;
  activatedAt?: string;
  pricing?: {
    currency: string;
    amount: number;
    frequency: string;
  };
}

interface EngagementSelection {
  model: string;
  duration: string;
  pricing: {
    currency: string;
    originalAmount: number;
    discountedAmount?: number;
    frequency: string;
  };
  selectedAt: string;
}

export class MembershipService {
  private static readonly MEMBER_DISCOUNT = 0.2; // 20% discount

  static async getMembershipData(userId: string): Promise<MembershipData> {
    try {
      // Get user's organization
      const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!organization) {
        return { status: 'inactive', plan: '' };
      }

      // Check if user has an active engagement activation
      const { data: activation } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .eq('membership_status', 'active')
        .single();

      if (activation) {
        return {
          status: 'active',
          plan: activation.membership_type || 'standard',
          activatedAt: activation.created_at,
          pricing: {
            currency: activation.currency || 'USD',
            amount: activation.mem_payment_amount || 0,
            frequency: activation.selected_frequency || 'monthly'
          }
        };
      }

      return { status: 'inactive', plan: '' };
    } catch (error) {
      console.error('❌ Error getting membership data:', error);
      return { status: 'inactive', plan: '' };
    }
  }

  static async activateMembership(userId: string, plan: string, pricing: any): Promise<boolean> {
    try {
      console.log('🔄 Activating membership for user:', userId, 'plan:', plan);
      
      // Validate required parameters
      if (!userId || !plan) {
        console.error('❌ Missing required parameters for membership activation');
        return false;
      }

      // Get user's organization context
      const { data: orgContext, error: orgError } = await supabase
        .from('organization_context')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (orgError) {
        console.error('❌ Error fetching organization context:', orgError);
        return false;
      }

      if (!orgContext) {
        console.error('❌ No organization context found for user:', userId);
        return false;
      }

      // Prepare activation data with proper workflow step
      const activationData = {
        user_id: userId,
        membership_status: 'Active',
        membership_type: plan,
        country: orgContext.country_name,
        organization_type: orgContext.organization_type_name,
        currency: pricing.currency || 'USD',
        mem_payment_amount: pricing.amount,
        selected_frequency: pricing.frequency || 'monthly',
        mem_payment_date: new Date().toISOString(),
        activation_status: 'Activated',
        engagement_model: 'Market Place', // Default engagement model
        workflow_step: 'activation_complete',
        workflow_completed: true,
        payment_simulation_status: 'completed',
        terms_accepted: true,
        updated_at: new Date().toISOString()
      };

      // Insert or update engagement activation
      const { error } = await supabase
        .from('engagement_activations')
        .upsert(activationData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Error activating membership:', error);
        
        // Provide specific error handling for constraint violations
        if (error.code === '23514') {
          console.error('❌ Database constraint violation - invalid workflow step or data values');
          if (error.message.includes('chk_workflow_step')) {
            console.error('❌ Invalid workflow step. Must be one of: membership_decision, payment, membership_summary, tier_selection, engagement_model, preview_confirmation, activation_complete');
          }
          if (error.message.includes('chk_engagement_model')) {
            console.error('❌ Invalid engagement model. Must be one of: Market Place, Marketplace, Aggregator, Platform as a Service, etc.');
          }
        }
        return false;
      }

      console.log('✅ Membership activated successfully:', { userId, plan, pricing });
      return true;
    } catch (error) {
      console.error('❌ Error in activateMembership:', error);
      return false;
    }
  }

  static async getEngagementSelection(userId: string): Promise<EngagementSelection | null> {
    try {
      const { data: activation } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!activation) {
        console.log('📊 No engagement selection found for user:', userId);
        return null;
      }

      const selection: EngagementSelection = {
        model: activation.engagement_model,
        duration: activation.selected_frequency || 'monthly',
        pricing: {
          currency: activation.currency || 'USD',
          originalAmount: activation.mem_payment_amount || 0,
          discountedAmount: activation.final_calculated_price || undefined,
          frequency: activation.selected_frequency || 'monthly'
        },
        selectedAt: activation.created_at
      };

      console.log('📊 Retrieved engagement selection for user', userId, ':', selection);
      return selection;
    } catch (error) {
      console.error('❌ Error getting engagement selection:', error);
      return null;
    }
  }

  static async saveEngagementSelection(userId: string, selection: EngagementSelection): Promise<boolean> {
    try {
      console.log('🔄 Saving engagement selection for user:', userId);
      
      // Get user's organization context
      const { data: orgContext, error: orgError } = await supabase
        .from('organization_context')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (orgError) {
        console.error('❌ Error fetching organization context:', orgError);
        return false;
      }

      if (!orgContext) {
        console.error('❌ No organization context found for user:', userId);
        return false;
      }

      // Apply member discount if user is a member
      const membership = await this.getMembershipData(userId);
      let finalPrice = selection.pricing.originalAmount;
      if (membership.status === 'active' && !selection.pricing.discountedAmount) {
        finalPrice = Math.round(selection.pricing.originalAmount * (1 - this.MEMBER_DISCOUNT));
      } else if (selection.pricing.discountedAmount) {
        finalPrice = selection.pricing.discountedAmount;
      }

      // Prepare engagement selection data with proper workflow step
      const engagementData = {
        user_id: userId,
        engagement_model: selection.model,
        selected_frequency: selection.pricing.frequency,
        country: orgContext.country_name,
        organization_type: orgContext.organization_type_name,
        currency: selection.pricing.currency,
        mem_payment_amount: selection.pricing.originalAmount,
        final_calculated_price: finalPrice,
        membership_status: membership.status === 'active' ? 'Active' : 'Not Active',
        workflow_step: 'engagement_model',
        activation_status: 'Activated',
        updated_at: new Date().toISOString()
      };

      // Insert or update engagement activation
      const { error } = await supabase
        .from('engagement_activations')
        .upsert(engagementData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Error saving engagement selection:', error);
        
        // Provide specific error handling for constraint violations
        if (error.code === '23514') {
          console.error('❌ Database constraint violation - invalid workflow step or data values');
          if (error.message.includes('chk_workflow_step')) {
            console.error('❌ Invalid workflow step. Must be one of: membership_decision, payment, membership_summary, tier_selection, engagement_model, preview_confirmation, activation_complete');
          }
          if (error.message.includes('chk_engagement_model')) {
            console.error('❌ Invalid engagement model. Must be one of: Market Place, Marketplace, Aggregator, Platform as a Service, etc.');
          }
        }
        return false;
      }

      console.log('✅ Engagement selection saved successfully for user', userId, ':', selection);
      return true;
    } catch (error) {
      console.error('❌ Error in saveEngagementSelection:', error);
      return false;
    }
  }

  static async continueWithoutMembership(userId: string): Promise<boolean> {
    try {
      console.log('🔄 Setting up user to continue without membership:', userId);
      
      // Validate required parameters
      if (!userId) {
        console.error('❌ Missing required userId for continue without membership');
        return false;
      }

      // Get user's organization context
      const { data: orgContext, error: orgError } = await supabase
        .from('organization_context')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (orgError) {
        console.error('❌ Error fetching organization context:', orgError);
        return false;
      }

      if (!orgContext) {
        console.error('❌ No organization context found for user:', userId);
        return false;
      }

      // Prepare activation data for non-member
      const activationData = {
        user_id: userId,
        membership_status: 'Not Active',
        membership_type: 'non-member',
        country: orgContext.country_name,
        organization_type: orgContext.organization_type_name,
        currency: 'USD',
        activation_status: 'Activated',
        engagement_model: 'Market Place', // Default engagement model
        workflow_step: 'membership_decision',
        workflow_completed: false,
        payment_simulation_status: 'not_required',
        terms_accepted: true,
        updated_at: new Date().toISOString()
      };

      // Insert or update engagement activation
      const { error } = await supabase
        .from('engagement_activations')
        .upsert(activationData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Error setting up non-member activation:', error);
        
        // Provide specific error handling for constraint violations
        if (error.code === '23514') {
          console.error('❌ Database constraint violation - invalid workflow step or data values');
          if (error.message.includes('chk_workflow_step')) {
            console.error('❌ Invalid workflow step. Must be one of: membership_decision, payment, membership_summary, tier_selection, engagement_model, preview_confirmation, activation_complete');
          }
          if (error.message.includes('chk_engagement_model')) {
            console.error('❌ Invalid engagement model. Must be one of: Market Place, Marketplace, Aggregator, Platform as a Service, etc.');
          }
        }
        return false;
      }

      console.log('✅ User set up to continue without membership successfully:', userId);
      return true;
    } catch (error) {
      console.error('❌ Error in continueWithoutMembership:', error);
      return false;
    }
  }
}
