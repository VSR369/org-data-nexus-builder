
import { supabase } from '@/integrations/supabase/client';

export interface ComprehensiveMemberData {
  membershipData: {
    status: string;
    type: string;
    createdAt: string;
    pricingTier?: string;
    paymentAmount?: number;
    paymentCurrency?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    receiptNumber?: string;
    lastPaymentDate?: string;
    selectedFrequency?: string;
    totalPaymentsMade?: number;
    discountPercentage?: number;
    finalCalculatedPrice?: number;
    frequencyPayments?: any[];
    frequencyChangeHistory?: any[];
  };
  engagementData?: {
    model: string;
    features: string[];
    supportLevel: string;
    analyticsAccess: boolean;
  };
}

export class MemberDetailsService {
  static async getComprehensiveMemberData(userId: string): Promise<ComprehensiveMemberData | null> {
    try {
      console.log('🔍 Fetching comprehensive member data for user:', userId);

      // Get engagement activation data
      const { data: activationData, error: activationError } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .eq('membership_status', 'Active')
        .single();

      if (activationError) {
        console.error('❌ Error fetching activation data:', activationError);
        return null;
      }

      if (!activationData) {
        console.log('📊 No active membership found for user:', userId);
        return null;
      }

      // Get tier configuration details if pricing_tier exists
      let tierDetails = null;
      if (activationData.pricing_tier) {
        const { data: tierData } = await supabase
          .from('master_pricing_tiers')
          .select(`
            *,
            master_tier_configurations (
              *,
              master_support_types (name, service_level),
              master_analytics_access_types (name, dashboard_access),
              master_onboarding_types (name, service_type)
            )
          `)
          .eq('name', activationData.pricing_tier)
          .single();

        tierDetails = tierData;
      }

      // Get engagement model details
      let engagementModelDetails = null;
      if (activationData.engagement_model) {
        const { data: modelData } = await supabase
          .from('master_engagement_models')
          .select('*')
          .eq('name', activationData.engagement_model)
          .single();

        engagementModelDetails = modelData;
      }

      // Build comprehensive member data
      const membershipData = {
        status: activationData.membership_status,
        type: activationData.membership_type || 'Premium',
        createdAt: activationData.created_at,
        pricingTier: activationData.pricing_tier,
        paymentAmount: activationData.mem_payment_amount,
        paymentCurrency: activationData.mem_payment_currency || activationData.currency,
        paymentStatus: activationData.mem_payment_status,
        paymentMethod: activationData.mem_payment_method,
        receiptNumber: activationData.mem_receipt_number,
        lastPaymentDate: activationData.mem_payment_date || activationData.last_payment_date,
        selectedFrequency: activationData.selected_frequency,
        totalPaymentsMade: activationData.total_payments_made,
        discountPercentage: activationData.discount_percentage,
        finalCalculatedPrice: activationData.final_calculated_price,
        frequencyPayments: Array.isArray(activationData.frequency_payments) ? activationData.frequency_payments : [],
        frequencyChangeHistory: Array.isArray(activationData.frequency_change_history) ? activationData.frequency_change_history : [],
      };

      const engagementData = engagementModelDetails ? {
        model: engagementModelDetails.name,
        features: tierDetails?.master_tier_configurations?.[0]?.master_onboarding_types?.service_type?.split(',') || [],
        supportLevel: tierDetails?.master_tier_configurations?.[0]?.master_support_types?.service_level || 'Standard',
        analyticsAccess: tierDetails?.master_tier_configurations?.[0]?.master_analytics_access_types?.dashboard_access || false,
      } : undefined;

      console.log('✅ Successfully fetched comprehensive member data:', membershipData);

      return {
        membershipData,
        engagementData,
      };
    } catch (error) {
      console.error('❌ Error in getComprehensiveMemberData:', error);
      return null;
    }
  }
}
