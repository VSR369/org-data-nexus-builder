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

  // Simple engagement payment handler
  const handleEngagementPayment = async () => {
    const pricing = getEngagementPricing(
      state.selected_engagement_model,
      state.membership_status,
      pricingConfigs,
      country,
      organizationType
    );
    if (!pricing || !state.selected_frequency) return;

    setEngagementPaymentLoading(true);
    
    try {
      const displayInfo = getDisplayAmount(state.selected_frequency, pricing, state.membership_status);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: `Your ${getEngagementModelName(state.selected_engagement_model || '')} plan has been activated!${displayInfo.discountApplied ? ' (Member discount applied)' : ''}`
      });

      // Navigate to validation dashboard after successful payment
      setTimeout(() => {
        window.location.href = '/master-data?section=solution-seekers-validation';
      }, 2000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setEngagementPaymentLoading(false);
    }
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

        <EngagementModelSelection
          membershipType={state.membership_type}
          selectedEngagementModel={state.selected_engagement_model}
          engagementModels={engagementModels}
          onEngagementModelChange={updateEngagementModel}
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
        />
      </div>
    </div>
  );
};

export default MembershipPricingSystem;