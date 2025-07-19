
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
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [membershipTermsAccepted, setMembershipTermsAccepted] = useState(false);
  const [engagementTermsAccepted, setEngagementTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data from database
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [tierConfigurations, setTierConfigurations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && userId) {
      loadInitialData();
    }
  }, [profile, userId]);

  useEffect(() => {
    if (membershipStatus) {
      loadPricingData();
    }
  }, [membershipStatus, selectedTier]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load saved engagement activation data
      const { data: savedData } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (savedData) {
        setMembershipStatus(savedData.membership_status === 'active' ? 'active' : 'inactive');
        setSelectedTier(savedData.pricing_tier);
        setSelectedEngagementModel(savedData.engagement_model);
        setSelectedFrequency(savedData.selected_frequency);
        setMembershipTermsAccepted(savedData.mem_terms || false);
        setEngagementTermsAccepted(savedData.enm_terms || false);
      }

      // Load membership fees
      const { data: membershipFeesData } = await supabase
        .from('master_seeker_membership_fees')
        .select('*')
        .eq('country', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type);

      setMembershipFees(membershipFeesData || []);

      // Load tier configurations
      const { data: countryData } = await supabase
        .from('master_countries')
        .select('id')
        .eq('name', profile.country)
        .single();

      if (countryData) {
        const { data: tierConfigs } = await supabase
          .from('master_tier_configurations')
          .select(`
            *,
            master_pricing_tiers!inner(name, level_order, description),
            master_currencies(code, symbol),
            master_analytics_access_types(name, description, dashboard_access, features_included),
            master_support_types(name, description, service_level, response_time, availability),
            master_onboarding_types(name, description, service_type, resources_included),
            master_workflow_templates(name, description, template_type, customization_level, template_count)
          `)
          .eq('country_id', countryData.id)
          .eq('is_active', true)
          .order('master_pricing_tiers(level_order)');

        setTierConfigurations(tierConfigs || []);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load membership information. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPricingData = async () => {
    try {
      // Load pricing configurations based on membership status
      const membershipStatusValue = membershipStatus === 'active' ? 'Active' : 'Not Active';
      const { data: pricingConfigData } = await supabase
        .from('pricing_configurations_detailed')
        .select('*')
        .eq('country_name', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type)
        .eq('membership_status', membershipStatusValue)
        .eq('is_active', true);

      setPricingData(pricingConfigData || []);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    }
  };

  const handleMembershipPayment = async () => {
    if (!membershipStatus || membershipStatus !== 'active') return;
    
    setIsProcessing(true);
    try {
      const annualFee = membershipFees.find(fee => fee.annual_amount)?.annual_amount || 0;
      const currency = membershipFees.find(fee => fee.annual_currency)?.annual_currency || 'USD';

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update engagement_activations table with membership payment
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          engagement_model: selectedEngagementModel || 'Marketplace',
          membership_status: 'active',
          pricing_tier: selectedTier,
          mem_payment_status: 'paid',
          mem_payment_amount: annualFee,
          mem_payment_currency: currency,
          mem_payment_date: new Date().toISOString(),
          mem_payment_method: 'credit_card',
          mem_receipt_number: `RCP-${Date.now()}`,
          mem_terms: membershipTermsAccepted,
          enm_terms: engagementTermsAccepted,
          country: profile.country,
          organization_type: profile.organization_type,
          workflow_step: 'completed',
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
          pricing_tier: selectedTier,
          selected_frequency: selectedFrequency,
          final_calculated_price: selectedPricing?.calculated_value,
          currency: selectedPricing?.currency_code || 'USD',
          discount_percentage: selectedPricing?.membership_discount_percentage || 0,
          enm_terms: engagementTermsAccepted,
          mem_terms: membershipTermsAccepted,
          membership_status: membershipStatus || 'inactive',
          country: profile.country,
          organization_type: profile.organization_type,
          activation_status: 'Activated',
          workflow_step: 'completed',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Engagement Model Activated",
        description: `Your ${selectedEngagementModel} engagement model has been activated successfully.`,
      });

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
        {[1, 2, 3, 4].map((i) => (
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

      {/* Phase 2: Tier Selection (shown when membership status is selected) */}
      {membershipStatus && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Your Pricing Tier</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierConfigurations.map((config, index) => (
              <div
                key={config.id}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTier === config.master_pricing_tiers?.name
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(config.master_pricing_tiers?.name)}
              >
                <div className="text-center space-y-4">
                  <div>
                    <h4 className="font-bold text-lg">{config.master_pricing_tiers?.name}</h4>
                    <p className="text-sm text-muted-foreground">{config.master_pricing_tiers?.description}</p>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    {config.master_currencies?.symbol || '$'}{config.fixed_charge_per_challenge}
                    <span className="text-sm font-normal text-muted-foreground">/challenge</span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Challenges:</span>
                      <span className="font-medium">{config.monthly_challenge_limit || '∞'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solutions per Challenge:</span>
                      <span className="font-medium">{config.solutions_per_challenge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analytics Access:</span>
                      <span className="font-medium">{config.master_analytics_access_types?.name || 'Basic'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support Level:</span>
                      <span className="font-medium">{config.master_support_types?.service_level || 'Standard'}</span>
                    </div>
                  </div>

                  {selectedTier === config.master_pricing_tiers?.name && (
                    <div className="text-green-600 font-medium">✓ Selected</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 3: Engagement Model Selection */}
      {selectedTier && (
        <EngagementModelSelectionCard
          selectedTier={selectedTier}
          selectedModel={selectedEngagementModel}
          onModelSelect={setSelectedEngagementModel}
          profile={profile}
          membershipStatus={membershipStatus}
        />
      )}

      {/* Phase 4: Terms and Conditions */}
      {selectedEngagementModel && (
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
      )}

      {/* Phase 5: Pricing Summary and Actions */}
      {(membershipTermsAccepted || engagementTermsAccepted) && (
        <PricingSummaryCard
          membershipStatus={membershipStatus}
          selectedTier={selectedTier}
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
      )}
    </div>
  );
};
