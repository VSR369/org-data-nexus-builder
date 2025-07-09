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
  const { toast } = useToast();

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

  console.log('🔍 MembershipPricingSystem Debug:', {
    organizationType,
    entityType,
    country,
    organizationId,
    organizationName,
    state,
    pricingConfigs: pricingConfigs?.length || 0,
    engagementModels: engagementModels?.length || 0,
    membershipFees: membershipFees?.length || 0,
    engagementPricing: engagementPricing ? 'FOUND' : 'NULL',
    dataLoading
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Membership & Engagement System</h1>
        <p className="text-muted-foreground">Select your membership plan and engagement model</p>
      </div>

      
      {/* Debug Info Card - Visible */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2">🔍 Debug Information</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <strong>Organization:</strong> {organizationName}<br/>
              <strong>Type:</strong> {organizationType}<br/>
              <strong>Country:</strong> {country}<br/>
              <strong>Entity:</strong> {entityType}
            </div>
            <div>
              <strong>Selected Model:</strong> {state.selected_engagement_model || 'None'}<br/>
              <strong>Selected Frequency:</strong> {state.selected_frequency || 'None'}<br/>
              <strong>Membership Status:</strong> {state.membership_status}<br/>
              <strong>Data Loading:</strong> {dataLoading ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-yellow-300">
            <strong>Pricing Configs:</strong> {pricingConfigs?.length || 0} found<br/>
            <strong>Engagement Models:</strong> {engagementModels?.length || 0} found<br/>
            <strong>Engagement Pricing:</strong> {engagementPricing ? 'Found' : 'Not Found'}<br/>
          </div>
        </CardContent>
      </Card>
      
      {/* Status Card */}
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

        <div className="text-center p-4 lg:col-span-2 xl:col-span-1">
          <p className="text-muted-foreground">
            Membership payment functionality will be implemented in the next phase
          </p>
        </div>

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