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
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Platform Fee:</span>
                <span className="font-bold text-lg text-green-600">
                  {engagementPricing.platformFeePercentage || 0}% of solution fee
                </span>
              </div>
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