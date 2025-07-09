import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useLocalStoragePersistence } from '@/hooks/useLocalStoragePersistence';
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
  // Get organization ID from props or registration data
  const getOrganizationId = () => {
    if (organizationId) return organizationId;
    
    try {
      const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
      return orgData.organizationId || orgData.userId || 'default_org';
    } catch {
      return 'default_org';
    }
  };

  const currentOrgId = getOrganizationId();
  
  // Migrate global data to organization-specific storage if needed
  React.useEffect(() => {
    const migrateGlobalData = () => {
      const globalKey = 'membership_pricing_system_state';
      const orgSpecificKey = `membership_pricing_system_state_${currentOrgId}`;
      
      const globalData = localStorage.getItem(globalKey);
      const orgSpecificData = localStorage.getItem(orgSpecificKey);
      
      // Only migrate if global data exists and org-specific doesn't
      if (globalData && !orgSpecificData) {
        try {
          const parsed = JSON.parse(globalData);
          const enhancedData = {
            ...parsed,
            organization_id: currentOrgId,
            organization_name: organizationName,
            last_updated: new Date().toISOString(),
            migrated_from_global: true
          };
          
          // Enhance payment records with organization details
          if (enhancedData.payment_records) {
            enhancedData.payment_records = enhancedData.payment_records.map((record: any) => ({
              ...record,
              organizationId: currentOrgId,
              organizationName: organizationName
            }));
          }
          
          localStorage.setItem(orgSpecificKey, JSON.stringify(enhancedData));
          console.log(`✅ Migrated global membership data to organization-specific storage for: ${organizationName}`);
        } catch (error) {
          console.error('❌ Failed to migrate global data:', error);
        }
      }
    };
    
    if (currentOrgId && organizationName) {
      migrateGlobalData();
    }
  }, [currentOrgId, organizationName]);
  
  const {
    state,
    loading: stateLoading,
    error: stateError,
    updateMembershipStatus,
    updateMembershipType,
    updateEngagementModel,
    updateFrequency,
    addPaymentRecord,
    updatePaymentRecord
  } = useLocalStoragePersistence(currentOrgId);

  const { pricingConfigs, membershipFees, engagementModels, loading: dataLoading } = useMembershipPricingData(
    organizationType,
    entityType,
    country
  );
  const [membershipPaymentLoading, setMembershipPaymentLoading] = useState(false);
  const [engagementPaymentLoading, setEngagementPaymentLoading] = useState(false);
  const [submittedMembershipType, setSubmittedMembershipType] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<string | null>(null);
  const [membershipAmount, setMembershipAmount] = useState<number | null>(null);
  const { toast } = useToast();



  // Handle membership payment
  const handleMembershipPayment = async () => {
    const fee = getAnnualMembershipFee(membershipFees);
    if (!fee) return;

    setMembershipPaymentLoading(true);
    
    try {
      // Add payment record with organization details
      const paymentRecord = addPaymentRecord({
        type: 'membership',
        amount: fee.amount,
        currency: fee.currency,
        status: 'pending',
        organizationId: currentOrgId,
        organizationName: organizationName
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment record to completed
      updatePaymentRecord(paymentRecord.id, { status: 'completed' });
      
      // Update membership status to paid
      updateMembershipStatus('member_paid');
      
      // Set payment date and amount for display
      setPaymentDate(new Date().toISOString());
      setMembershipAmount(fee.amount);
      
      toast({
        title: "Payment Successful",
        description: "Your annual membership has been activated! You can now see member pricing for engagement models."
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

  // Get currently paid engagement model from payment records
  const getPaidEngagementModel = () => {
    if (!state.payment_records) return null;
    
    const paidEngagement = state.payment_records.find(record => 
      record.type === 'engagement' && record.status === 'completed'
    );
    
    // For now, we'll check if there's any completed engagement payment
    // In a real system, you'd store the engagement model ID in the payment record
    return paidEngagement ? 'existing' : null;
  };

  // Handle engagement model payment
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
      // Get the actual display amount (which includes discount calculation)
      const displayInfo = getDisplayAmount(state.selected_frequency, pricing, state.membership_status);
      const paymentAmount = displayInfo.amount; // Use the calculated amount (discounted if applicable)
      
      // Create comprehensive payment information for logging
      const paymentDetails = {
        engagementModel: state.selected_engagement_model,
        engagementModelName: getEngagementModelName(state.selected_engagement_model || ''),
        billingFrequency: state.selected_frequency,
        amount: paymentAmount,
        currency: pricing.currency || 'INR',
        originalAmount: displayInfo.originalAmount,
        discountApplied: displayInfo.discountApplied,
        discountPercentage: displayInfo.discountApplied ? pricing.discountPercentage : 0,
        membershipStatus: state.membership_status,
        organizationType: organizationType,
        entityType: entityType,
        country: country,
        isPaaSModel: state.selected_engagement_model?.toLowerCase().includes('platform') || 
                     state.selected_engagement_model?.toLowerCase().includes('paas'),
        pricingConfig: {
          id: pricing.id,
          quarterlyFee: pricing.quarterlyFee,
          halfYearlyFee: pricing.halfYearlyFee,
          annualFee: pricing.annualFee
        },
        timestamp: new Date().toISOString()
      };
      
      // Log comprehensive payment information before processing
      console.log('💳 Starting Engagement Payment:', paymentDetails);
      
      // Create engagement payment record with organization details
      const paymentRecord = addPaymentRecord({
        type: 'engagement',
        amount: paymentAmount,
        currency: pricing.currency || 'INR',
        status: 'pending',
        organizationId: currentOrgId,
        organizationName: organizationName,
        engagementModel: state.selected_engagement_model,
        billingFrequency: state.selected_frequency,
        pricingStructure: state.selected_engagement_model?.toLowerCase().includes('marketplace') ? 'percentage' : 'currency'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment record to completed
      updatePaymentRecord(paymentRecord.id, { 
        status: 'completed'
      });
      
      // Log successful payment completion with all details
      console.log('✅ Engagement Payment Completed Successfully:', {
        ...paymentDetails,
        paymentId: paymentRecord.id,
        completedAt: new Date().toISOString(),
        paymentMethod: 'simulated'
      });
      
      toast({
        title: "Payment Successful",
        description: `Your ${getEngagementModelName(state.selected_engagement_model || '')} plan has been activated!${displayInfo.discountApplied ? ' (Member discount applied)' : ''}`
      });

      // Navigate to validation dashboard after successful payment
      setTimeout(() => {
        window.location.href = '/master-data?section=solution-seekers-validation';
      }, 2000);
      
    } catch (error) {
      console.error('❌ Engagement payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setEngagementPaymentLoading(false);
    }
  };

  if (stateLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading your preferences...</span>
      </div>
    );
  }

  if (stateError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{stateError}</AlertDescription>
      </Alert>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          paymentDate={paymentDate || undefined}
          membershipAmount={membershipAmount || undefined}
          onMembershipPayment={handleMembershipPayment}
          onResetPaymentStatus={() => updateMembershipStatus('inactive')}
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
          hasPaidEngagement={getPaidEngagementModel() !== null}
          onFrequencyChange={(value) => updateFrequency(value as any)}
          onEngagementPayment={handleEngagementPayment}
        />
      </div>
    </div>
  );
};

export default MembershipPricingSystem;