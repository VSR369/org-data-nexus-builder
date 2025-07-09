import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { PricingConfig } from '@/types/pricing';
import { isPaaSModel, isMarketplaceModel } from '@/utils/membershipPricingUtils';
import { FrequencySelector } from './engagement/FrequencySelector';
import { PlatformFeeDisplay } from './engagement/PlatformFeeDisplay';
import { EngagementSummary } from './engagement/EngagementSummary';
import { PaymentButton } from './engagement/PaymentButton';
import { LoadingState } from './engagement/LoadingState';

interface EngagementPaymentCardProps {
  selectedEngagementModel: string;
  selectedFrequency: string;
  membershipStatus: string;
  engagementPricing: PricingConfig | null;
  organizationType: string;
  country: string;
  pricingConfigs: PricingConfig[];
  engagementPaymentLoading: boolean;
  onFrequencyChange: (value: string) => void;
  onEngagementPayment: () => void;
}

export const EngagementPaymentCard: React.FC<EngagementPaymentCardProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  membershipStatus,
  engagementPricing,
  organizationType,
  country,
  pricingConfigs,
  engagementPaymentLoading,
  onFrequencyChange,
  onEngagementPayment
}) => {
  // Debug logging for data flow
  console.log('🔍 EngagementPaymentCard - selectedEngagementModel:', selectedEngagementModel);
  console.log('🔍 EngagementPaymentCard - engagementPricing:', engagementPricing);
  console.log('🔍 EngagementPaymentCard - selectedFrequency:', selectedFrequency);
  
  const isPaaS = isPaaSModel(selectedEngagementModel);
  const isMarketplace = isMarketplaceModel(selectedEngagementModel);
  
  console.log('🔍 EngagementPaymentCard - isPaaS:', isPaaS);
  console.log('🔍 EngagementPaymentCard - isMarketplace:', isMarketplace);
  
  if (engagementPricing) {
    console.log('🔍 EngagementPaymentCard - platformFeePercentage:', engagementPricing.platformFeePercentage);
  }

  // Auto-select platform fee for marketplace models
  React.useEffect(() => {
    if (isMarketplace && selectedFrequency !== 'platform-fee') {
      onFrequencyChange('platform-fee');
    }
  }, [isMarketplace, selectedFrequency, onFrequencyChange]);

  // Prevent invalid states for marketplace models
  if (isMarketplace && selectedFrequency && selectedFrequency !== 'platform-fee') {
    onFrequencyChange('platform-fee');
  }

  return (
    <Card className={selectedEngagementModel ? '' : 'opacity-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Engagement Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedEngagementModel && engagementPricing ? (
          <div className="space-y-4">
            <div className="text-sm text-center p-2 bg-muted rounded">
              {membershipStatus === 'member_paid' ? 'Member Pricing' : 'Standard Pricing'}
            </div>

            {/* Show frequency options only for PaaS models */}
            {isPaaS ? (
              <FrequencySelector
                selectedFrequency={selectedFrequency}
                engagementPricing={engagementPricing}
                membershipStatus={membershipStatus}
                onFrequencyChange={onFrequencyChange}
              />
            ) : isMarketplace ? (
              /* Show single platform fee option for Marketplace models */
              <PlatformFeeDisplay
                engagementPricing={engagementPricing}
                onFrequencyChange={onFrequencyChange}
              />
            ) : null}

            {selectedFrequency && (
              <div className="space-y-4">
                <EngagementSummary
                  selectedEngagementModel={selectedEngagementModel}
                  selectedFrequency={selectedFrequency}
                  engagementPricing={engagementPricing}
                  membershipStatus={membershipStatus}
                />
                
            <PaymentButton
              selectedEngagementModel={selectedEngagementModel}
              engagementPaymentLoading={engagementPaymentLoading}
              onEngagementPayment={onEngagementPayment}
            />
              </div>
            )}
          </div>
        ) : selectedEngagementModel ? (
          <LoadingState
            selectedEngagementModel={selectedEngagementModel}
            membershipStatus={membershipStatus}
            pricingConfigs={pricingConfigs}
            organizationType={organizationType}
            country={country}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select an engagement model to view pricing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};