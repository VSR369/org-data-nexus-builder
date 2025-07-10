import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { isPaaSModel, isMarketplaceModel, formatCurrency, getBothMemberAndNonMemberPricing } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';
import { FrequencySelector } from './FrequencySelector';
import { PricingDisplaySection } from './PricingDisplaySection';
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

  // Get both member and non-member pricing for discount display
  const { memberConfig, nonMemberConfig } = getBothMemberAndNonMemberPricing(
    selectedEngagementModel,
    pricingConfigs,
    country,
    organizationType
  );

  // Determine which config to use based on membership status
  const isMembershipPaid = membershipStatus === 'member_paid';
  const currentPricing = isMembershipPaid && memberConfig ? memberConfig : nonMemberConfig;

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {isPaaS ? 'Engagement Payment' : 'Engagement Activation'}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedEngagementModel}</Badge>
          {isMembershipPaid && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              Member Discount Applied
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Frequency Selector - Only for PaaS models */}
        {isPaaS && (
          <FrequencySelector
            selectedFrequency={selectedFrequency}
            onFrequencyChange={onFrequencyChange}
            disabled={loading || engagementPaymentStatus === 'loading'}
          />
        )}

        {/* Pricing Display */}
        {currentPricing && (
          <PricingDisplaySection
            pricing={currentPricing}
            memberPricing={memberConfig}
            nonMemberPricing={nonMemberConfig}
            selectedFrequency={isPaaS ? selectedFrequency : 'annual'} // Default to annual for non-PaaS
            modelName={selectedEngagementModel}
            membershipStatus={membershipStatus}
            showFrequencyInTitle={isPaaS}
          />
        )}


        {/* Action Buttons */}
        <div className="space-y-3">
          {isPaaS && (
            <Button
              onClick={onEngagementPayment}
              disabled={
                !selectedFrequency || 
                loading || 
                engagementPaymentStatus === 'loading' ||
                !currentPricing
              }
              className="w-full"
              size="lg"
            >
              {engagementPaymentStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              {engagementPaymentStatus === 'loading' 
                ? 'Processing Payment...' 
                : `Pay ${selectedFrequency ? selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1) : ''} Fee`
              }
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
                  engagementActivationStatus === 'loading'
                }
                className="w-full"
                size="lg"
              >
                {engagementActivationStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {engagementActivationStatus === 'loading' 
                  ? 'Activating...' 
                  : 'Activate Engagement'
                }
              </Button>
            </div>
          )}

          {engagementPaymentStatus === 'error' && (
            <div className="text-center text-red-600 text-sm">
              Payment failed. Please try again.
            </div>
          )}

          {engagementActivationStatus === 'error' && (
            <div className="text-center text-red-600 text-sm">
              Activation failed. Please try again.
            </div>
          )}
        </div>

        {/* Information Note - Only for PaaS */}
        {isPaaS && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p>
              <strong>Platform as a Service:</strong> Payment is required to activate your engagement. 
              Select your preferred billing frequency and complete the payment to start using the platform.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};