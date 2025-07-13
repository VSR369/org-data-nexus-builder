
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
            amount: activation.payment_amount || 0,
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
      // Get user's organization context
      const { data: orgContext } = await supabase
        .from('organization_context')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!orgContext) {
        console.error('❌ No organization context found for user:', userId);
        return false;
      }

      // Insert or update engagement activation
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          membership_status: 'active',
          membership_type: plan,
          country: orgContext.country_name,
          organization_type: orgContext.organization_type_name,
          currency: pricing.currency,
          payment_amount: pricing.amount,
          selected_frequency: pricing.frequency,
          payment_date: new Date().toISOString(),
          activation_status: 'Activated',
          engagement_model: 'Platform as a Service' // Default engagement model
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Error activating membership:', error);
        return false;
      }

      console.log('✅ Membership activated:', { userId, plan, pricing });
      return true;
    } catch (error) {
      console.error('❌ Error activating membership:', error);
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
          originalAmount: activation.payment_amount || 0,
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
      // Get user's organization context
      const { data: orgContext } = await supabase
        .from('organization_context')
        .select('*')
        .eq('user_id', userId)
        .single();

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

      // Insert or update engagement activation
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          engagement_model: selection.model,
          selected_frequency: selection.pricing.frequency,
          country: orgContext.country_name,
          organization_type: orgContext.organization_type_name,
          currency: selection.pricing.currency,
          payment_amount: selection.pricing.originalAmount,
          final_calculated_price: finalPrice,
          membership_status: membership.status === 'active' ? 'active' : 'inactive'
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('❌ Error saving engagement selection:', error);
        return false;
      }

      console.log('✅ Engagement selection saved for user', userId, ':', selection);
      return true;
    } catch (error) {
      console.error('❌ Error saving engagement selection:', error);
      return false;
    }
  }
}
