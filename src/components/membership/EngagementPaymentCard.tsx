import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { PricingConfig } from '@/types/pricing';
import { isPaaSModel, isMarketplaceModel, getEngagementModelName, getBothMemberAndNonMemberPricing } from '@/utils/membershipPricingUtils';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const isPaaS = isPaaSModel(selectedEngagementModel);
  const isMarketplace = isMarketplaceModel(selectedEngagementModel);

  const handleActivateEngagement = async () => {
    try {
      if (!engagementPricing) {
        toast({
          title: "Error",
          description: "Pricing information not available",
          variant: "destructive",
        });
        return;
      }

      // Get both member and non-member pricing for accurate calculations
      const { memberConfig, nonMemberConfig } = getBothMemberAndNonMemberPricing(
        selectedEngagementModel,
        pricingConfigs,
        country,
        organizationType
      );

      // Calculate platform fee details
      const isMembershipPaid = membershipStatus === 'member_paid';
      const originalPlatformFee = nonMemberConfig?.platformFeePercentage || engagementPricing.platformFeePercentage || 0;
      const discountPercentage = memberConfig?.discountPercentage || 0;
      const finalPlatformFee = isMembershipPaid && discountPercentage > 0 
        ? originalPlatformFee * (1 - discountPercentage / 100)
        : originalPlatformFee;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to activate an engagement model",
          variant: "destructive",
        });
        return;
      }

      // Save engagement activation to database
      const { error } = await supabase
        .from('engagement_activations')
        .insert({
          user_id: user.id,
          engagement_model: getEngagementModelName(selectedEngagementModel),
          membership_status: membershipStatus,
          platform_fee_percentage: finalPlatformFee,
          discount_percentage: isMembershipPaid ? discountPercentage : 0,
          final_calculated_price: finalPlatformFee,
          currency: engagementPricing.currency || 'USD',
          activation_status: 'Activated',
          terms_accepted: true,
          organization_type: organizationType,
          country: country
        });

      if (error) {
        console.error('Error saving engagement activation:', error);
        toast({
          title: "Error",
          description: "Failed to activate engagement model. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${getEngagementModelName(selectedEngagementModel)} has been activated successfully!`,
      });

    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during activation",
        variant: "destructive",
      });
    }
  };

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
                  pricingConfigs={pricingConfigs}
                  country={country}
                  organizationType={organizationType}
                />
                
            <PaymentButton
              selectedEngagementModel={selectedEngagementModel}
              engagementPaymentLoading={engagementPaymentLoading}
              onEngagementPayment={onEngagementPayment}
              onActivateEngagement={handleActivateEngagement}
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