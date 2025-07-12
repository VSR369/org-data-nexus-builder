import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isPaaSModel, isMarketplaceModel, getBothMemberAndNonMemberPricing, getDisplayAmount } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';
import { FrequencySelector } from './FrequencySelector';
import { NoEngagementSelected } from './components/NoEngagementSelected';
import { PricingSection } from './components/PricingSection';
import { ActionButtons } from './components/ActionButtons';
import { useEngagementDataStorage } from '@/hooks/useEngagementDataStorage';
import { EngagementDataConfirmation } from './EngagementDataConfirmation';

interface EngagementPaymentCardProps {
  selectedEngagementModel: string | null;
  selectedFrequency: string | null;
  membershipStatus: string;
  pricingConfigs: PricingConfig[];
  country: string;
  organizationType: string;
  onFrequencyChange: (frequency: string) => void;
  loading?: boolean;
  engagementActivationStatus?: 'idle' | 'loading' | 'success' | 'error';
  membershipFees: any[];
}

export const EngagementPaymentCard: React.FC<EngagementPaymentCardProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  membershipStatus,
  pricingConfigs,
  country,
  organizationType,
  onFrequencyChange,
  loading = false,
  engagementActivationStatus = 'idle',
  membershipFees
}) => {
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [paasAgreementAccepted, setPaasAgreementAccepted] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [activationData, setActivationData] = useState<any>(null);

  // Calculate values for hook parameters (safe defaults for null case)
  const engagementModel = selectedEngagementModel || '';
  const isPaaS = selectedEngagementModel ? isPaaSModel(selectedEngagementModel) : false;
  const isMarketplace = selectedEngagementModel ? isMarketplaceModel(selectedEngagementModel) : false;

  let currentPricing = null;
  let currentAmount = null;

  if (selectedEngagementModel) {
    // Get both member and non-member pricing for discount display
    const { memberConfig, nonMemberConfig } = getBothMemberAndNonMemberPricing(
      selectedEngagementModel,
      pricingConfigs,
      country,
      organizationType
    );

    // Determine which config to use based on membership status
    const isMembershipPaid = membershipStatus === 'member_paid';
    currentPricing = isMembershipPaid && memberConfig ? memberConfig : nonMemberConfig;

    // Calculate display amounts
    if (isMarketplace && currentPricing && currentPricing.platformFeePercentage) {
      currentAmount = { amount: currentPricing.platformFeePercentage, isPercentage: true };
    } else if (isPaaS && selectedFrequency && currentPricing) {
      const amount = getDisplayAmount(selectedFrequency, currentPricing, membershipStatus);
      currentAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
  }

  // Initialize engagement data storage hook with safe defaults
  const {
    loading: activationLoading,
    activateEngagement,
    payEngagementFee
  } = useEngagementDataStorage({
    selectedEngagementModel: engagementModel,
    selectedFrequency,
    membershipStatus,
    pricingConfigs,
    country,
    organizationType,
    currentPricing,
    currentAmount: currentAmount?.amount || 0,
    membershipFees
  });

  // NOW we can do conditional returns after all hooks are called
  if (!selectedEngagementModel) {
    return <NoEngagementSelected />;
  }

  console.log('🔍 EngagementPaymentCard Debug:', {
    selectedEngagementModel,
    isPaaS,
    isMarketplace,
    selectedFrequency,
    membershipStatus,
    availableConfigs: pricingConfigs.length
  });

  const handleActivateEngagement = async () => {
    const success = await activateEngagement();
    if (success) {
      setActivationSuccess(true);
      setActivationData({
        model: selectedEngagementModel,
        platformFee: currentPricing?.platformFeePercentage,
        membershipStatus,
        activationDate: new Date().toISOString()
      });
    }
  };

  const handlePayEngagementFee = async () => {
    const success = await payEngagementFee();
    if (success) {
      setActivationSuccess(true);
      setActivationData({
        model: selectedEngagementModel,
        frequency: selectedFrequency,
        platformFee: currentPricing?.platformFeePercentage,
        amount: currentAmount?.amount,
        membershipStatus,
        paymentDate: new Date().toISOString()
      });
    }
  };

  if (activationSuccess && activationData) {
    return (
      <EngagementDataConfirmation
        selectedEngagementModel={activationData.model}
        selectedFrequency={activationData.frequency}
        membershipStatus={membershipStatus}
        platformFeePercentage={activationData.platformFee}
        paymentAmount={activationData.amount}
        paymentDate={activationData.paymentDate || activationData.activationDate}
      />
    );
  }

  const isMembershipPaid = membershipStatus === 'member_paid';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight whitespace-nowrap">
          {isPaaS ? 'Engagement Payment' : 'Engagement Selection'}
        </CardTitle>
        <div className="flex items-center gap-1 mt-2">
          <Badge variant="outline" className="text-xs">{selectedEngagementModel}</Badge>
          {isMembershipPaid && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs">
              Member
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Frequency Selector - Only for PaaS models */}
        {isPaaS && (
          <FrequencySelector
            selectedFrequency={selectedFrequency}
            onFrequencyChange={onFrequencyChange}
            disabled={loading}
          />
        )}

        {/* Pricing Display */}
        <PricingSection
          selectedEngagementModel={selectedEngagementModel}
          selectedFrequency={selectedFrequency}
          membershipStatus={membershipStatus}
          pricingConfigs={pricingConfigs}
          country={country}
          organizationType={organizationType}
          isMarketplace={isMarketplace}
          isPaaS={isPaaS}
        />

        {/* Action Buttons */}
        <ActionButtons
          isPaaS={isPaaS}
          isMarketplace={isMarketplace}
          selectedFrequency={selectedFrequency}
          selectedEngagementModel={selectedEngagementModel}
          paasAgreementAccepted={paasAgreementAccepted}
          setPaasAgreementAccepted={setPaasAgreementAccepted}
          agreementAccepted={agreementAccepted}
          setAgreementAccepted={setAgreementAccepted}
          loading={loading}
          currentPricing={currentPricing}
          currentAmount={currentAmount}
          onActivateEngagement={handleActivateEngagement}
          onPayEngagementFee={handlePayEngagementFee}
          activationLoading={activationLoading}
        />
      </CardContent>
    </Card>
  );
};