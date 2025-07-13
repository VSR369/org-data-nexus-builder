import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MembershipStatusSelectionCard } from './MembershipStatusSelectionCard';
import { EngagementModelSelectionCard } from './EngagementModelSelectionCard';
import { TermsAndConditionsCard } from './TermsAndConditionsCard';
import { PricingSummaryCard } from './PricingSummaryCard';

interface MembershipFlowCardProps {
  profile: any;
  userId: string;
}

export const MembershipFlowCard: React.FC<MembershipFlowCardProps> = ({ profile, userId }) => {
  // State management
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive' | null>(null);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [membershipTermsAccepted, setMembershipTermsAccepted] = useState(false);
  const [engagementTermsAccepted, setEngagementTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data from database
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadMasterData();
    }
  }, [profile, membershipStatus]);

  const loadMasterData = async () => {
    try {
      setLoading(true);
      
      // Load membership fees
      const { data: membershipFeesData } = await supabase
        .from('master_seeker_membership_fees')
        .select('*')
        .eq('country', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type);

      // Load pricing configurations
      const membershipStatusValue = membershipStatus === 'active' ? 'Active' : 'Not Active';
      const { data: pricingConfigData } = await supabase
        .from('pricing_configurations_detailed')
        .select('*')
        .eq('country_name', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type)
        .eq('membership_status', membershipStatusValue)
        .eq('is_active', true);

      setMembershipFees(membershipFeesData || []);
      setPricingData(pricingConfigData || []);
    } catch (error) {
      console.error('Error loading master data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load pricing information. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipPayment = async () => {
    if (!membershipStatus || membershipStatus !== 'active') return;
    
    setIsProcessing(true);
    try {
      const annualFee = membershipFees.find(fee => fee.annual_amount)?.annual_amount || 0;
      const currency = membershipFees.find(fee => fee.annual_currency)?.annual_currency || 'USD';

      // Simulate payment processing (replace with actual payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update engagement_activations table with membership payment
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          engagement_model: 'Platform as a Service', // Default engagement model for membership payment
          membership_status: 'active',
          mem_payment_status: 'paid',
          mem_payment_amount: annualFee,
          mem_payment_currency: currency,
          mem_payment_date: new Date().toISOString(),
          mem_payment_method: 'credit_card',
          mem_receipt_number: `RCP-${Date.now()}`,
          mem_terms: membershipTermsAccepted,
          country: profile.country,
          organization_type: profile.organization_type,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: `Annual membership fee of ${currency} ${annualFee} has been processed successfully.`,
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEngagementActivation = async () => {
    if (!selectedEngagementModel) return;

    setIsProcessing(true);
    try {
      const selectedPricing = pricingData.find(p => 
        p.engagement_model === selectedEngagementModel &&
        (!selectedFrequency || p.billing_frequency === selectedFrequency)
      );

      // Update engagement_activations table
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          engagement_model: selectedEngagementModel,
          selected_frequency: selectedFrequency,
          final_calculated_price: selectedPricing?.calculated_value,
          currency: selectedPricing?.currency_code || 'USD',
          discount_percentage: selectedPricing?.membership_discount_percentage || 0,
          enm_terms: engagementTermsAccepted,
          membership_status: membershipStatus || 'inactive',
          country: profile.country,
          organization_type: profile.organization_type,
          activation_status: 'Activated',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Engagement Model Activated",
        description: `Your ${selectedEngagementModel} engagement model has been activated successfully.`,
      });

      // Reset form after successful activation
      setTimeout(() => {
        setMembershipStatus(null);
        setSelectedEngagementModel(null);
        setSelectedFrequency(null);
        setMembershipTermsAccepted(false);
        setEngagementTermsAccepted(false);
      }, 2000);

    } catch (error) {
      console.error('Error activating engagement model:', error);
      toast({
        title: "Activation Failed",
        description: "There was an error activating your engagement model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase 1: Membership Status Selection */}
      <MembershipStatusSelectionCard
        membershipFees={membershipFees}
        selectedStatus={membershipStatus}
        onStatusChange={setMembershipStatus}
        profile={profile}
      />

      {/* Phase 2: Engagement Model Selection (Always Visible) */}
      <EngagementModelSelectionCard
        profile={profile}
        selectedModel={selectedEngagementModel}
        selectedFrequency={selectedFrequency}
        onModelChange={setSelectedEngagementModel}
        onFrequencyChange={setSelectedFrequency}
        membershipStatus={membershipStatus}
      />

      {/* Phase 3: Terms and Conditions */}
      <TermsAndConditionsCard
        membershipTermsAccepted={membershipTermsAccepted}
        engagementTermsAccepted={engagementTermsAccepted}
        onMembershipTermsChange={setMembershipTermsAccepted}
        onEngagementTermsChange={setEngagementTermsAccepted}
        selectedMembershipStatus={membershipStatus}
        selectedEngagementModel={selectedEngagementModel}
        showMembershipTerms={membershipStatus === 'active'}
        showEngagementTerms={selectedEngagementModel !== null}
      />

      {/* Phase 4: Pricing Summary and Actions */}
      <PricingSummaryCard
        membershipStatus={membershipStatus}
        selectedEngagementModel={selectedEngagementModel}
        selectedFrequency={selectedFrequency}
        membershipFees={membershipFees}
        pricingData={pricingData}
        membershipTermsAccepted={membershipTermsAccepted}
        engagementTermsAccepted={engagementTermsAccepted}
        onProceedToPayment={handleMembershipPayment}
        onActivateEngagement={handleEngagementActivation}
        isProcessing={isProcessing}
      />
    </div>
  );
};