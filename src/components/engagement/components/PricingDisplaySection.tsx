
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { DollarSign } from 'lucide-react';
import { PricingConfig } from '@/types/pricing';

interface PricingDisplaySectionProps {
  pricing: PricingConfig | null;
  selectedPricingPlan: string;
  modelName: string;
  membershipStatus: string;
  getCurrentPrice: () => number;
  getOriginalPrice: () => number;
  formatPricing: (amount: number, currency: string, modelName: string) => string;
  isFeeBasedModel: (modelName: string) => boolean;
}

export const PricingDisplaySection: React.FC<PricingDisplaySectionProps> = ({
  pricing,
  selectedPricingPlan,
  modelName,
  membershipStatus,
  getCurrentPrice,
  getOriginalPrice,
  formatPricing,
  isFeeBasedModel
}) => {
  if (!pricing || !selectedPricingPlan) {
    return selectedPricingPlan ? (
      <div className="text-center">
        <div className="text-sm text-gray-500">No pricing configured</div>
        <div className="text-xs text-gray-400">Contact administrator</div>
      </div>
    ) : (
      <div className="text-center">
        <div className="text-sm text-gray-500">Select pricing plan first</div>
      </div>
    );
  }

  const currentPrice = getCurrentPrice();
  const originalPrice = getOriginalPrice();

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 justify-end">
        <DollarSign className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium">
          {selectedPricingPlan === 'quarterly' ? 'Quarterly' : 
           selectedPricingPlan === 'halfyearly' ? 'Half-Yearly' : 'Annual'} 
          {isFeeBasedModel(modelName) ? ' Fee Rate' : ' Pricing'}
        </span>
      </div>
      
      {isFeeBasedModel(modelName) ? (
        <div className="space-y-1">
          <div className="text-lg font-bold text-gray-900">
            {formatPricing(0, pricing.currency || 'USD', modelName)}
          </div>
          <div className="text-xs text-gray-500">
            Applied per solution transaction
          </div>
        </div>
      ) : (
        membershipStatus === 'member_paid' && pricing.discountPercentage && currentPrice < originalPrice ? (
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Member discount:</div>
            <div className="text-sm text-gray-500 line-through">
              {formatPricing(originalPrice, pricing.currency, modelName)}
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatPricing(currentPrice, pricing.currency, modelName)}
            </div>
            <div className="text-xs text-gray-500">
              per {selectedPricingPlan === 'quarterly' ? 'quarter' : 
                   selectedPricingPlan === 'halfyearly' ? '6 months' : 'year'}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-900">
              {currentPrice > 0 ? formatPricing(currentPrice, pricing.currency || 'USD', modelName) : 'Contact for pricing'}
            </div>
            <div className="text-xs text-gray-500">
              per {selectedPricingPlan === 'quarterly' ? 'quarter' : 
                   selectedPricingPlan === 'halfyearly' ? '6 months' : 'year'}
            </div>
          </div>
        )
      )}
    </div>
  );
};
