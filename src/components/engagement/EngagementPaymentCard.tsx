
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, CreditCard } from "lucide-react";
import { isPaaSModel, isMarketplaceModel, formatCurrency, getBothMemberAndNonMemberPricing, getDisplayAmount } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';
import { FrequencySelector } from './FrequencySelector';
import { AgreementSection } from './AgreementSection';

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

  // Check if no engagement model is selected
  if (!selectedEngagementModel) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Engagement Activation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Please select an engagement model to continue</p>
          </div>
        </CardContent>
      </Card>
    );
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

  // For Marketplace models, we don't need frequency - show platform fee percentage
  // For PaaS models, we need frequency to show the subscription fee
  let currentAmount = null;
  let nonMemberAmount = null;
  let memberAmount = null;

  if (isMarketplace) {
    // Marketplace models use platform fee percentage, no frequency needed
    if (currentPricing && currentPricing.platformFeePercentage) {
      currentAmount = { amount: currentPricing.platformFeePercentage, isPercentage: true };
    }
    if (nonMemberConfig && nonMemberConfig.platformFeePercentage) {
      nonMemberAmount = { amount: nonMemberConfig.platformFeePercentage, isPercentage: true };
    }
    if (memberConfig && memberConfig.platformFeePercentage) {
      memberAmount = { amount: memberConfig.platformFeePercentage, isPercentage: true };
    }
  } else if (isPaaS && selectedFrequency) {
    // PaaS models use frequency-based subscription fees
    if (currentPricing) {
      const amount = getDisplayAmount(selectedFrequency, currentPricing, membershipStatus);
      currentAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
    if (nonMemberConfig) {
      const amount = getDisplayAmount(selectedFrequency, nonMemberConfig, 'inactive');
      nonMemberAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
    if (memberConfig) {
      const amount = getDisplayAmount(selectedFrequency, memberConfig, 'member_paid');
      memberAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
  }

  console.log('💸 Display amounts:', {
    currentAmount,
    nonMemberAmount,
    memberAmount,
    isMembershipPaid,
    selectedFrequency
  });

  // Check if engagement is already activated/paid
  const isEngagementActivated = engagementPaymentStatus === 'success' || engagementActivationStatus === 'success';

  if (isEngagementActivated) {
    return (
      <Card className="w-full border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            {isPaaS ? 'Engagement Payment Completed' : 'Engagement Activated'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <p className="text-green-700 font-medium">
              {isPaaS 
                ? 'Your engagement payment has been processed successfully!' 
                : 'Your engagement has been activated successfully!'
              }
            </p>
            <Badge variant="outline" className="mt-2 border-green-600 text-green-700">
              {selectedEngagementModel} - Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {isPaaS ? 'Engagement Payment' : 'Engagement Activation'}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">{selectedEngagementModel}</Badge>
            {isMembershipPaid && (
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs">
                Member
              </Badge>
            )}
          </div>
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
        {currentPricing ? (
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            {/* Show pricing based on model type and availability */}
            {isMarketplace && currentAmount ? (
              <>
                <div className="text-xl font-bold text-primary">
                  {currentAmount.amount}% Platform Fee
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  of solution transaction amount
                </p>
              </>
            ) : isPaaS && selectedFrequency && currentAmount ? (
              <>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(currentAmount.amount, currentPricing?.currency || 'USD')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  per {selectedFrequency === 'half-yearly' ? 'half year' : selectedFrequency.replace('ly', '')}
                </p>
              </>
            ) : isPaaS && !selectedFrequency ? (
              <div className="text-sm text-muted-foreground">
                Select frequency to view pricing
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Loading pricing configuration...
              </div>
            )}
            
            {/* Show discount info for members when applicable */}
            {isMembershipPaid && memberAmount && nonMemberAmount && (
              isMarketplace ? (
                // Show percentage discount for marketplace
                memberAmount.amount < nonMemberAmount.amount && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground line-through">
                        {nonMemberAmount.amount}%
                      </span>
                      <span className="text-green-700 font-medium">
                        Save {(nonMemberAmount.amount - memberAmount.amount).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              ) : (
                // Show currency discount for PaaS
                memberAmount.amount < nonMemberAmount.amount && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground line-through">
                        {formatCurrency(nonMemberAmount.amount, currentPricing?.currency || 'USD')}
                      </span>
                      <span className="text-green-700 font-medium">
                        Save {formatCurrency(nonMemberAmount.amount - memberAmount.amount, currentPricing?.currency || 'USD')}
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-sm text-muted-foreground">
              No pricing configuration found for {selectedEngagementModel}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {isPaaS && (
            <Button
              onClick={onEngagementPayment}
              disabled={
                !selectedFrequency || 
                loading || 
                engagementPaymentStatus === 'loading' ||
                !currentPricing ||
                !currentAmount
              }
              className="w-full"
              size="sm"
            >
              {engagementPaymentStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay ${selectedFrequency ? selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1) : ''} Fee`
              )}
            </Button>
          )}

          {isMarketplace && (
            <div className="space-y-2">
              <AgreementSection
                agreementAccepted={agreementAccepted}
                onAgreementChange={setAgreementAccepted}
                engagementModel={selectedEngagementModel}
              />
              <Button
                onClick={onEngagementActivation}
                disabled={
                  !agreementAccepted || 
                  loading || 
                  engagementActivationStatus === 'loading' ||
                  !currentPricing
                }
                className="w-full"
                size="sm"
              >
                {engagementActivationStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Activating...
                  </>
                ) : (
                  'Activate Engagement'
                )}
              </Button>
            </div>
          )}

          {engagementPaymentStatus === 'error' && (
            <div className="text-center text-red-600 text-xs">
              Payment failed. Please try again.
            </div>
          )}

          {engagementActivationStatus === 'error' && (
            <div className="text-center text-red-600 text-xs">
              Activation failed. Please try again.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
