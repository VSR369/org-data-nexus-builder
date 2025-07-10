
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EngagementActivationData {
  engagementModel: string;
  membershipStatus: string;
  platformFeePercentage?: number;
  discountPercentage?: number;
  finalCalculatedPrice?: number;
  currency?: string;
  organizationType?: string;
  country?: string;
  termsAccepted: boolean;
}

export const useEngagementActivation = () => {
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const activateEngagement = async (data: EngagementActivationData) => {
    setIsActivating(true);
    
    try {
      // Validate required fields
      if (!data.engagementModel) {
        throw new Error('Engagement model is required');
      }
      
      if (!data.membershipStatus) {
        throw new Error('Membership status is required');
      }
      
      if (!data.termsAccepted) {
        throw new Error('Terms and conditions must be accepted');
      }
      
      if (data.platformFeePercentage === undefined || data.platformFeePercentage === null) {
        throw new Error('Platform fee not configured');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Insert activation record
      const { data: activation, error } = await supabase
        .from('engagement_activations')
        .insert({
          user_id: user.id,
          engagement_model: data.engagementModel,
          membership_status: data.membershipStatus,
          platform_fee_percentage: data.platformFeePercentage,
          discount_percentage: data.discountPercentage || 0,
          final_calculated_price: data.finalCalculatedPrice || 0,
          currency: data.currency || 'USD',
          organization_type: data.organizationType,
          country: data.country,
          terms_accepted: data.termsAccepted,
          activation_status: 'Activated'
        })
        .select()
        .single();

      if (error) {
        console.error('Activation error:', error);
        throw new Error(`Failed to activate engagement: ${error.message}`);
      }

      // Show success message
      toast({
        title: "✅ Engagement Model Activated Successfully",
        description: `${data.engagementModel} has been activated. You can now proceed.`,
        duration: 5000,
      });

      console.log('Engagement activated successfully:', activation);
      return activation;
      
    } catch (error) {
      console.error('Activation failed:', error);
      
      // Show contextual error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Activation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    } finally {
      setIsActivating(false);
    }
  };

  return {
    activateEngagement,
    isActivating
  };
};
