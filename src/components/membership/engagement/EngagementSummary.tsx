import React from 'react';
import { PricingConfig } from '@/types/pricing';
import { 
  getEngagementModelName, 
  getDisplayAmount, 
  formatCurrency, 
  isMarketplaceModel,
  getBothMemberAndNonMemberPricing
} from '@/utils/membershipPricingUtils';

interface EngagementSummaryProps {
  selectedEngagementModel: string;
  selectedFrequency: string;
  engagementPricing: PricingConfig;
  membershipStatus: string;
  pricingConfigs?: PricingConfig[];
  country?: string;
  organizationType?: string;
}

export const EngagementSummary: React.FC<EngagementSummaryProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  engagementPricing,
  membershipStatus,
  pricingConfigs = [],
  country = 'India',
  organizationType = 'Private Limited'
}) => {
  const isMarketplace = isMarketplaceModel(selectedEngagementModel);
  
  // Debug logging for engagement summary
  console.log('🔍 EngagementSummary - selectedEngagementModel:', selectedEngagementModel);
  console.log('🔍 EngagementSummary - selectedFrequency:', selectedFrequency);
  console.log('🔍 EngagementSummary - engagementPricing:', engagementPricing);
  console.log('🔍 EngagementSummary - isMarketplace:', isMarketplace);
  console.log('🔍 EngagementSummary - platformFeePercentage:', engagementPricing.platformFeePercentage);

  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="text-sm font-medium mb-2">Summary of Selected Engagement Model</div>
      {(() => {
        if (isMarketplace) {
          return (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Engagement Model:</span>
                <span className="font-medium">{getEngagementModelName(selectedEngagementModel)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pricing Structure:</span>
                <span className="font-medium">Platform Fee</span>
              </div>
              {(() => {
                // Get both member and non-member configs to calculate proper original vs discounted fees
                const isMembershipPaid = membershipStatus === 'member_paid';
                const { memberConfig, nonMemberConfig } = getBothMemberAndNonMemberPricing(
                  selectedEngagementModel,
                  pricingConfigs,
                  country,
                  organizationType
                );

                // Use non-member config as the original fee, member config for discounted fee
                const originalPlatformFee = nonMemberConfig?.platformFeePercentage || engagementPricing.platformFeePercentage || 0;
                const memberPlatformFee = memberConfig?.platformFeePercentage || 0;
                const discountPercentage = memberConfig?.discountPercentage || 0;
                
                // Calculate discounted fee properly: original fee - (original fee × discount percentage)
                const calculatedDiscountedFee = originalPlatformFee * (1 - discountPercentage / 100);
                
                const hasDiscount = isMembershipPaid && discountPercentage > 0 && originalPlatformFee > 0;
                const displayedFee = hasDiscount ? calculatedDiscountedFee : originalPlatformFee;

                console.log('🔍 Platform Fee Calculation:', {
                  isMembershipPaid,
                  originalPlatformFee,
                  memberPlatformFee,
                  discountPercentage,
                  calculatedDiscountedFee,
                  hasDiscount,
                  displayedFee
                });

                return (
                  <div className="space-y-2">
                    {hasDiscount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Original Platform Fee:</span>
                        <span className="text-gray-500 line-through">
                          {originalPlatformFee}% of solution fee
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {hasDiscount ? 'Discounted Platform Fee:' : 'Platform Fee:'}
                      </span>
                      <span className={`font-bold text-lg ${hasDiscount ? 'text-green-600' : ''}`}>
                        {Math.round(displayedFee * 100) / 100}% of solution fee
                      </span>
                    </div>
                    {hasDiscount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Member Discount:</span>
                        <span className="text-green-600 font-medium">
                          -{discountPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        } else {
          const displayInfo = getDisplayAmount(selectedFrequency, engagementPricing, membershipStatus);
          return (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Engagement Model:</span>
                <span className="font-medium">{getEngagementModelName(selectedEngagementModel)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Billing Frequency:</span>
                <span className="font-medium capitalize">{selectedFrequency.replace('-', ' ')}</span>
              </div>
              {displayInfo.discountApplied && displayInfo.originalAmount && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Original Price:</span>
                  <span className="text-gray-500 line-through">
                    {formatCurrency(displayInfo.originalAmount, engagementPricing.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {displayInfo.discountApplied ? 'Discounted Price:' : 'Total Amount:'}
                </span>
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(displayInfo.amount, engagementPricing.currency)}
                </span>
              </div>
              {displayInfo.discountApplied && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">Member Discount:</span>
                  <span className="text-green-600 font-medium">
                    -{engagementPricing.discountPercentage}%
                  </span>
                </div>
              )}
            </div>
          );
        }
      })()}
    </div>
  );
};