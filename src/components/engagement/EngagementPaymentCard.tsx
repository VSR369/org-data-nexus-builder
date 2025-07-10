
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isPaaSModel, isMarketplaceModel, getBothMemberAndNonMemberPricing, getDisplayAmount } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';
import { FrequencySelector } from './FrequencySelector';
import { useEngagementActivation } from '@/hooks/useEngagementActivation';
import { sessionStorageManager } from '@/utils/storage/SessionStorageManager';
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
  onEngagementActivation?: () => void;
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
  onEngagementActivation,
  loading = false,
  engagementPaymentStatus = 'idle',
  engagementActivationStatus = 'idle'
}) => {
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [paasAgreementAccepted, setPaasAgreementAccepted] = useState(false);
  const { activateEngagement, isActivating } = useEngagementActivation();

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

  // Handle engagement activation for marketplace models
  const handleEngagementActivation = async () => {
    console.log('🎯 handleEngagementActivation called');
    
    if (!selectedEngagementModel || !isMarketplace) {
      console.error('❌ Validation failed: Missing engagement model or not marketplace');
      return;
    }

    if (!agreementAccepted) {
      console.error('❌ Validation failed: Terms not accepted');
      return;
    }

    if (!currentPricing) {
      console.error('❌ Validation failed: No pricing configuration found');
      return;
    }
    
    try {
      // Get user data from session storage - ensure we have a user ID
      const sessionData = sessionStorageManager.loadSession();
      const userId = sessionData?.seekerUserId;

      console.log('👤 Session data loaded:', { userId, sessionData });

      if (!userId) {
        console.error('❌ No user ID found in session');
        throw new Error('User session not found. Please refresh the page and try again.');
      }

      const activationData = {
        engagementModel: selectedEngagementModel,
        membershipStatus: membershipStatus,
        platformFeePercentage: currentPricing.platformFeePercentage,
        discountPercentage: currentPricing.discountPercentage,
        finalCalculatedPrice: currentAmount?.amount,
        currency: currentPricing.currency || 'USD',
        organizationType: organizationType,
        country: country,
        termsAccepted: agreementAccepted,
        userId: userId // Pass session-based user ID (required)
      };

      console.log('🚀 Calling activateEngagement with data:', activationData);
      
      const result = await activateEngagement(activationData);
      
      console.log('✅ Engagement activation completed successfully:', result);
      
      // Call the parent callback if provided (after successful activation)
      if (onEngagementActivation) {
        console.log('📞 Calling parent onEngagementActivation callback');
        onEngagementActivation();
      }
      
    } catch (error) {
      console.error('💥 Failed to activate engagement:', error);
      // Error handling is done in the hook, so we just log here
    }
  };

  // Check if engagement is already activated/paid
  const isEngagementActivated = engagementPaymentStatus === 'success' || engagementActivationStatus === 'success';

  if (isEngagementActivated) {
    return <EngagementSuccessCard selectedEngagementModel={selectedEngagementModel} />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight whitespace-nowrap">
          {isPaaS ? 'Engagement Payment' : 'Engagement Activation'}
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
          handleEngagementActivation={handleEngagementActivation}
          loading={loading}
          isActivating={isActivating}
          engagementPaymentStatus={engagementPaymentStatus}
          engagementActivationStatus={engagementActivationStatus}
          currentPricing={currentPricing}
          currentAmount={currentAmount}
        />
      </CardContent>
    </Card>
  );
};
