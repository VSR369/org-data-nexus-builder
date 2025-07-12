
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isPaaSModel, isMarketplaceModel, getBothMemberAndNonMemberPricing, getDisplayAmount } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';
import { FrequencySelector } from './FrequencySelector';
import { NoEngagementSelected } from './components/NoEngagementSelected';
import { EngagementSuccessCard } from './components/EngagementSuccessCard';
import { PricingSection } from './components/PricingSection';
import { ActionButtons } from './components/ActionButtons';

interface EngagementPaymentCardProps {
  selectedEngagementModel: string | null;
  selectedFrequency: string | null;
  membershipStatus: string;
  pricingConfigs: PricingConfig[];
  country: string;
  organizationType: string;
  onFrequencyChange: (frequency: string) => void;
  onEngagementPayment?: () => void;
  loading?: boolean;
  engagementPaymentStatus?: 'idle' | 'loading' | 'success' | 'error';
  engagementActivationStatus?: 'idle' | 'loading' | 'success' | 'error';
}

export const EngagementPaymentCard: React.FC<EngagementPaymentCardProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  membershipStatus,
  pricingConfigs,
  country,
  organizationType,
  onFrequencyChange,
  onEngagementPayment,
  loading = false,
  engagementPaymentStatus = 'idle',
  engagementActivationStatus = 'idle'
}) => {
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [paasAgreementAccepted, setPaasAgreementAccepted] = useState(false);

  // Check if no engagement model is selected
  if (!selectedEngagementModel) {
    return <NoEngagementSelected />;
  }

  const isPaaS = isPaaSModel(selectedEngagementModel);
  const isMarketplace = isMarketplaceModel(selectedEngagementModel);

  console.log('🔍 EngagementPaymentCard Debug:', {
    selectedEngagementModel,
    isPaaS,
    isMarketplace,
    selectedFrequency,
    membershipStatus,
    availableConfigs: pricingConfigs.length
  });

  // Get both member and non-member pricing for discount display
  const { memberConfig, nonMemberConfig } = getBothMemberAndNonMemberPricing(
    selectedEngagementModel,
    pricingConfigs,
    country,
    organizationType
  );

  console.log('💰 Pricing configs found:', {
    memberConfig: memberConfig ? {
      id: memberConfig.id,
      platformFee: memberConfig.platformFeePercentage,
      quarterlyFee: memberConfig.quarterlyFee,
      membershipStatus: memberConfig.membershipStatus
    } : null,
    nonMemberConfig: nonMemberConfig ? {
      id: nonMemberConfig.id,
      platformFee: nonMemberConfig.platformFeePercentage,
      quarterlyFee: nonMemberConfig.quarterlyFee,
      membershipStatus: nonMemberConfig.membershipStatus
    } : null
  });

  // Determine which config to use based on membership status
  const isMembershipPaid = membershipStatus === 'member_paid';
  const currentPricing = isMembershipPaid && memberConfig ? memberConfig : nonMemberConfig;

  // Calculate display amounts
  let currentAmount = null;

  if (isMarketplace && currentPricing && currentPricing.platformFeePercentage) {
    currentAmount = { amount: currentPricing.platformFeePercentage, isPercentage: true };
  } else if (isPaaS && selectedFrequency && currentPricing) {
    const amount = getDisplayAmount(selectedFrequency, currentPricing, membershipStatus);
    currentAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
  }

  console.log('💸 Display amounts:', {
    currentAmount,
    isMembershipPaid,
    selectedFrequency
  });


  // Check if engagement is already activated/paid (only for PaaS models)
  const isEngagementActivated = engagementPaymentStatus === 'success';

  if (isEngagementActivated && isPaaS) {
    return <EngagementSuccessCard selectedEngagementModel={selectedEngagementModel} />;
  }

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
            disabled={loading || engagementPaymentStatus === 'loading'}
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
          onEngagementPayment={onEngagementPayment}
          loading={loading}
          engagementPaymentStatus={engagementPaymentStatus}
          currentPricing={currentPricing}
          currentAmount={currentAmount}
        />
      </CardContent>
    </Card>
  );
};
