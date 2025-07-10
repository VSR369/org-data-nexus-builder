import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useSimpleEngagementState } from '@/hooks/useSimpleEngagementState';
import { useMembershipPricingData } from '@/hooks/useMembershipPricingData';
import { MembershipPlanSelection } from './MembershipPlanSelection';
import { EngagementModelSelection } from './EngagementModelSelection';
import { MembershipPaymentCard } from './MembershipPaymentCard';
import { EngagementPaymentCard } from './EngagementPaymentCard';
import { 
  getEngagementPricing, 
  getEngagementModelName,
  getDisplayAmount,
  getAnnualMembershipFee
} from '@/utils/membershipPricingUtils';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthContext";

interface MembershipPricingSystemProps {
  organizationType: string;
  entityType: string;
  country: string;
  organizationId?: string;
  organizationName?: string;
}

const MembershipPricingSystem: React.FC<MembershipPricingSystemProps> = ({
  organizationType,
  entityType,
  country,
  organizationId,
  organizationName
}) => {
  const {
    state,
    updateMembershipStatus,
    updateMembershipType,
    updateEngagementModel,
    updateFrequency
  } = useSimpleEngagementState();

  const { pricingConfigs, membershipFees, engagementModels, loading: dataLoading } = useMembershipPricingData(
    organizationType,
    entityType,
    country
  );

  const [engagementPaymentLoading, setEngagementPaymentLoading] = useState(false);
  const [submittedMembershipType, setSubmittedMembershipType] = useState<string | null>(null);
  const [membershipPaymentLoading, setMembershipPaymentLoading] = useState(false);
  const [paymentDate, setPaymentDate] = useState<string | undefined>(undefined);
  const [membershipAmount, setMembershipAmount] = useState<number | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Membership payment handler
  const handleMembershipPayment = async () => {
    if (!submittedMembershipType) return;
    
    setMembershipPaymentLoading(true);
    
    try {
      // Get the annual membership fee
      const annualFee = getAnnualMembershipFee(membershipFees);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status
      const currentDate = new Date().toISOString();
      setPaymentDate(currentDate);
      setMembershipAmount(annualFee?.amount || 0);
      
      // Update membership status to paid
      updateMembershipStatus('member_paid');
      
      toast({
        title: "Payment Successful",
        description: `Your ${submittedMembershipType} membership has been activated!`
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setMembershipPaymentLoading(false);
    }
  };

  // Reset payment status
  const onResetPaymentStatus = () => {
    setPaymentDate(undefined);
    setMembershipAmount(undefined);
    updateMembershipStatus('inactive');
    setSubmittedMembershipType(null);
  };

  // Enhanced engagement activation handler
  const handleEngagementActivation = async (termsAccepted: boolean, calculatedPrice: number, originalPrice: number, selectedFrequency?: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to activate an engagement model."
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Terms Not Accepted",
        description: "Please accept the terms and conditions to continue."
      });
      return;
    }

    const pricing = getEngagementPricing(
      state.selected_engagement_model,
      state.membership_status,
      pricingConfigs,
      country,
      organizationType
    );
    if (!pricing) return;

    setEngagementPaymentLoading(true);
    
    try {
      console.log('🚀 Starting engagement activation:', {
        user_id: user.id,
        engagement_model: state.selected_engagement_model,
        membership_status: state.membership_status,
        calculated_price: calculatedPrice,
        original_price: originalPrice,
        selected_frequency: selectedFrequency || state.selected_frequency
      });

      // Insert activation record into Supabase
      const { error } = await supabase
        .from('engagement_activations')
        .insert({
          user_id: user.id,
          engagement_model: state.selected_engagement_model,
          membership_status: state.membership_status === 'member_paid' ? 'member' : 'not-a-member',
          organization_type: organizationType,
          country: country,
          currency: pricing.currency || 'INR',
          platform_fee_percentage: pricing.platformFeePercentage,
          discount_percentage: pricing.discountPercentage,
          final_calculated_price: calculatedPrice,
          billing_frequency: selectedFrequency || state.selected_frequency,
          terms_accepted: termsAccepted,
          activation_status: 'Activated'
        });

      if (error) {
        console.error('❌ Supabase insertion error:', error);
        throw error;
      }

      console.log('✅ Engagement activation saved to database');
      
      toast({
        title: "✅ Activation Successful",
        description: `${getEngagementModelName(state.selected_engagement_model || '')} has been activated successfully!${
          state.membership_status === 'member_paid' ? ' (Member discount applied)' : ''
        }`
      });

      // Navigate to validation dashboard after successful activation
      setTimeout(() => {
        window.location.href = '/master-data?section=solution-seekers-validation';
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Activation failed:', error);
      toast({
        variant: "destructive",
        title: "Activation Failed",
        description: error.message || "There was an error activating your engagement model. Please try again."
      });
    } finally {
      setEngagementPaymentLoading(false);
    }
  };

  // Simple engagement payment handler (for backward compatibility)
  const handleEngagementPayment = async () => {
    await handleEngagementActivation(true, 0, 0, state.selected_frequency);
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading your preferences...</span>
      </div>
    );
  }

  const engagementPricing = getEngagementPricing(
    state.selected_engagement_model,
    state.membership_status,
    pricingConfigs,
    country,
    organizationType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Membership & Engagement System</h1>
        <p className="text-muted-foreground">Select your membership plan and engagement model</p>
      </div>

      {/* Current Status */}
      {(state.membership_status !== 'inactive' || state.selected_engagement_model) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={state.membership_status === 'member_paid' ? 'default' : 'secondary'}>
                  {state.membership_status === 'member_paid' ? 'Premium Member' : 
                   state.membership_type === 'not-a-member' ? 'Not a Member' : 'Basic'}
                </Badge>
                {state.membership_type && (
                  <Badge variant="outline">{state.membership_type === 'annual' ? 'Annual Plan' : 'Not a Member'}</Badge>
                )}
              </div>
              {state.selected_engagement_model && (
                <div className="text-sm text-muted-foreground">
                  Engagement Model: {state.selected_engagement_model}
                  {state.selected_frequency && ` (${state.selected_frequency})`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <MembershipPlanSelection
          membershipType={state.membership_type}
          membershipStatus={state.membership_status}
          membershipFees={membershipFees}
          onMembershipTypeChange={(value) => updateMembershipType(value as any)}
          onMembershipSubmit={(selectedType) => {
            setSubmittedMembershipType(selectedType);
          }}
        />

        <MembershipPaymentCard
          membershipType={state.membership_type}
          membershipStatus={state.membership_status}
          membershipFees={membershipFees}
          membershipPaymentLoading={membershipPaymentLoading}
          submittedMembershipType={submittedMembershipType}
          paymentDate={paymentDate}
          membershipAmount={membershipAmount}
          onMembershipPayment={handleMembershipPayment}
          onResetPaymentStatus={onResetPaymentStatus}
        />

        <EngagementModelSelection
          membershipType={state.membership_type}
          selectedEngagementModel={state.selected_engagement_model}
          engagementModels={engagementModels}
          onEngagementModelChange={updateEngagementModel}
        />

        <EngagementPaymentCard
          selectedEngagementModel={state.selected_engagement_model}
          selectedFrequency={state.selected_frequency}
          membershipStatus={state.membership_status}
          engagementPricing={engagementPricing}
          organizationType={organizationType}
          country={country}
          pricingConfigs={pricingConfigs}
          engagementPaymentLoading={engagementPaymentLoading}
          onFrequencyChange={(value) => updateFrequency(value as any)}
          onEngagementPayment={handleEngagementPayment}
          onEngagementActivation={handleEngagementActivation}
        />
      </div>
    </div>
  );
};

export default MembershipPricingSystem;