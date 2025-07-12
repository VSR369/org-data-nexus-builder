import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isPaaSModel, isMarketplaceModel } from '@/utils/membershipPricingUtils';

interface EngagementDataStorageProps {
  selectedEngagementModel: string;
  selectedFrequency: string | null;
  membershipStatus: string;
  pricingConfigs: any[];
  country: string;
  organizationType: string;
  currentPricing: any;
  currentAmount: any;
  membershipFees: any[];
}

export const useEngagementDataStorage = (props: EngagementDataStorageProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const activateEngagement = async () => {
    if (!isMarketplaceModel(props.selectedEngagementModel)) {
      toast({
        title: "Error",
        description: "This action is only available for marketplace models.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const platformFeePercentage = props.currentPricing?.platform_fee_percentage || 0;
      
      const activationData = {
        user_id: user.id,
        engagement_model: props.selectedEngagementModel,
        membership_status: props.membershipStatus,
        organization_type: props.organizationType,
        country: props.country,
        platform_fee_percentage: platformFeePercentage,
        currency: 'INR',
        activation_status: 'Activated',
        terms_accepted: true,
        membership_type: props.membershipStatus === 'member_paid' ? 'annual' : 'not-a-member',
        payment_status: 'idle',
        pricing_locked: false,
        engagement_locked: true,
        lock_date: new Date().toISOString(),
        current_frequency: props.selectedFrequency,
        last_payment_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('engagement_activations')
        .insert(activationData);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${props.selectedEngagementModel} engagement activated successfully!`,
      });

      return true;
    } catch (error) {
      console.error('Error activating engagement:', error);
      toast({
        title: "Error",
        description: "Failed to activate engagement. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const payEngagementFee = async (isFrequencyChange = false) => {
    if (!isPaaSModel(props.selectedEngagementModel)) {
      toast({
        title: "Error",
        description: "This action is only available for PaaS model.",
        variant: "destructive"
      });
      return;
    }

    if (!props.selectedFrequency) {
      toast({
        title: "Error",
        description: "Please select a payment frequency for PaaS engagement.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const paymentAmount = props.currentAmount || 0;
      const now = new Date().toISOString();

      if (isFrequencyChange) {
        // Update existing record with frequency change
        const { data: existingData } = await supabase
          .from('engagement_activations')
          .select('frequency_payments, frequency_change_history, total_payments_made')
          .eq('user_id', user.id)
          .eq('engagement_model', props.selectedEngagementModel)
          .single();

        const frequencyPayments = Array.isArray(existingData?.frequency_payments) ? existingData.frequency_payments : [];
        const changeHistory = Array.isArray(existingData?.frequency_change_history) ? existingData.frequency_change_history : [];
        const totalPaid = (existingData?.total_payments_made || 0) + paymentAmount;

        // Add new payment to history
        frequencyPayments.push({
          frequency: props.selectedFrequency,
          amount: paymentAmount,
          date: now
        });

        changeHistory.push({
          to_frequency: props.selectedFrequency,
          amount: paymentAmount,
          date: now
        });

        const { error: updateError } = await supabase
          .from('engagement_activations')
          .update({
            selected_frequency: props.selectedFrequency,
            current_frequency: props.selectedFrequency,
            frequency_payments: frequencyPayments,
            frequency_change_history: changeHistory,
            total_payments_made: totalPaid,
            last_payment_date: now,
            payment_amount: paymentAmount,
            payment_date: now
          })
          .eq('user_id', user.id)
          .eq('engagement_model', props.selectedEngagementModel);

        if (updateError) throw updateError;
      } else {
        // Initial payment - insert new record with lock
        const initialPayment = [{
          frequency: props.selectedFrequency,
          amount: paymentAmount,
          date: now
        }];

        const activationData = {
          user_id: user.id,
          engagement_model: props.selectedEngagementModel,
          membership_status: props.membershipStatus,
          organization_type: props.organizationType,
          country: props.country,
          currency: 'INR',
          activation_status: 'Engagement Payment Paid',
          terms_accepted: true,
          selected_frequency: props.selectedFrequency,
          current_frequency: props.selectedFrequency,
          payment_amount: paymentAmount,
          payment_date: now,
          payment_status: 'paid',
          membership_type: props.membershipStatus === 'member_paid' ? 'annual' : 'not-a-member',
          pricing_locked: false,
          engagement_locked: true,
          lock_date: now,
          frequency_payments: initialPayment,
          total_payments_made: paymentAmount,
          last_payment_date: now
        };

        const { error: insertError } = await supabase
          .from('engagement_activations')
          .insert(activationData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: `PaaS engagement fee payment successful! Amount: ₹${paymentAmount}`,
      });

      return true;
    } catch (error) {
      console.error('Error processing PaaS payment:', error);
      toast({
        title: "Error",
        description: "Failed to process PaaS payment. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const upgradeMembership = async () => {
    if (props.membershipStatus === 'member_paid') {
      toast({
        title: "Info",
        description: "You are already an annual member.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get annual membership fee from master data
      const annualFee = props.membershipFees.find(fee => fee.membership_type === 'annual')?.fee || 25000;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update engagement activation with membership upgrade
      const { error: updateError } = await supabase
        .from('engagement_activations')
        .update({
          membership_status: 'member_paid',
          membership_type: 'annual',
          payment_status: 'paid',
          payment_date: new Date().toISOString(),
          pricing_locked: true,
          updated_platform_fee_percentage: props.currentPricing?.discount_percentage 
            ? props.currentPricing.platform_fee_percentage * (1 - props.currentPricing.discount_percentage / 100)
            : props.currentPricing?.platform_fee_percentage
        })
        .eq('user_id', user.id)
        .eq('engagement_model', props.selectedEngagementModel);

      if (updateError) throw updateError;

      toast({
        title: "Membership Upgraded!",
        description: `Successfully upgraded to Annual Membership. Fee: ₹${annualFee}`,
      });

      return true;
    } catch (error) {
      console.error('Error upgrading membership:', error);
      toast({
        title: "Error",
        description: "Failed to upgrade membership. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    activateEngagement,
    payEngagementFee,
    upgradeMembership,
    isMarketplaceModel: isMarketplaceModel(props.selectedEngagementModel),
    isPaaSModel: isPaaSModel(props.selectedEngagementModel)
  };
};