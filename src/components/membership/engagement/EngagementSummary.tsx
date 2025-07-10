import React from 'react';
import { PricingConfig } from '@/types/pricing';
import { 
  getEngagementModelName, 
  getDisplayAmount, 
  formatCurrency, 
  isMarketplaceModel 
} from '@/utils/membershipPricingUtils';

interface EngagementSummaryProps {
  selectedEngagementModel: string;
  selectedFrequency: string;
  engagementPricing: PricingConfig;
  membershipStatus: string;
}

export const EngagementSummary: React.FC<EngagementSummaryProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  engagementPricing,
  membershipStatus
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
                // Calculate discounted platform fee if membership is paid
                const isMembershipPaid = membershipStatus === 'member_paid';
                const basePlatformFee = engagementPricing.platformFeePercentage || 0;
                const discountPercentage = engagementPricing.discountPercentage || 0;
                const hasDiscount = isMembershipPaid && discountPercentage > 0;
                const discountedPlatformFee = hasDiscount 
                  ? Math.round(basePlatformFee * (1 - discountPercentage / 100) * 100) / 100
                  : basePlatformFee;

                return (
                  <div className="space-y-2">
                    {hasDiscount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Original Platform Fee:</span>
                        <span className="text-gray-500 line-through">
                          {basePlatformFee}% of solution fee
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {hasDiscount ? 'Discounted Platform Fee:' : 'Platform Fee:'}
                      </span>
                      <span className="font-bold text-lg text-green-600">
                        {discountedPlatformFee}% of solution fee
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