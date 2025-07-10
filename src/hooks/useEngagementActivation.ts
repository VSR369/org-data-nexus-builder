
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    console.log('🚀 Starting engagement activation with data:', data);
    setIsActivating(true);
    
    try {
      // Test toast functionality first
      console.log('📋 Testing toast functionality...');
      
      // Validate required fields
      console.log('✅ Validating required fields...');
      if (!data.engagementModel) {
        console.error('❌ Validation failed: Engagement model is required');
        throw new Error('Engagement model is required');
      }
      
      if (!data.membershipStatus) {
        console.error('❌ Validation failed: Membership status is required');
        throw new Error('Membership status is required');
      }
      
      if (!data.termsAccepted) {
        console.error('❌ Validation failed: Terms and conditions must be accepted');
        throw new Error('Terms and conditions must be accepted');
      }
      
      if (data.platformFeePercentage === undefined || data.platformFeePercentage === null) {
        console.error('❌ Validation failed: Platform fee not configured');
        throw new Error('Platform fee not configured');
      }

      console.log('✅ All validations passed');

      // Get current user
      console.log('👤 Getting current user...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ User not authenticated');
        throw new Error('User not authenticated');
      }
      console.log('✅ User authenticated:', user.id);

      // Prepare data for insertion
      const insertData = {
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
      };

      console.log('💾 Inserting activation record with data:', insertData);

      // Insert activation record
      const { data: activation, error } = await supabase
        .from('engagement_activations')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Database insertion error:', error);
        throw new Error(`Failed to activate engagement: ${error.message}`);
      }

      console.log('✅ Activation record created successfully:', activation);

      // Show success message
      console.log('📢 Showing success toast...');
      toast({
        title: "✅ Engagement Model Activated Successfully",
        description: `${data.engagementModel} has been activated. You can now proceed.`,
        duration: 5000,
      });

      console.log('🎉 Engagement activation completed successfully');
      return activation;
      
    } catch (error) {
      console.error('💥 Activation failed with error:', error);
      
      // Show contextual error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      console.log('📢 Showing error toast...');
      toast({
        title: "Activation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    } finally {
      console.log('🔄 Cleaning up - setting isActivating to false');
      setIsActivating(false);
    }
  };

  return {
    activateEngagement,
    isActivating
  };
};
