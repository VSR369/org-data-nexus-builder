
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';

interface ModelWithPricing {
  model: EngagementModel;
  pricing: PricingConfig | null;
  originalPrice?: number;
  discountedPrice?: number;
}

interface ModelSelectionSummaryProps {
  selectedModel: ModelWithPricing | undefined;
  selectedPricingPlan: string;
  membershipStatus: 'active' | 'inactive';
}

export const ModelSelectionSummary: React.FC<ModelSelectionSummaryProps> = ({
  selectedModel,
  selectedPricingPlan,
  membershipStatus
}) => {
  if (!selectedModel || !selectedPricingPlan) return null;

  const getCurrentPrice = () => {
    if (!selectedModel.pricing || !selectedPricingPlan) return 0;

    let price = 0;
    switch (selectedPricingPlan) {
      case 'quarterly':
        price = selectedModel.pricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        price = selectedModel.pricing.halfYearlyFee || 0;
        break;
      case 'annual':
        price = selectedModel.pricing.annualFee || 0;
        break;
      default:
        return 0;
    }

    // Database already contains the correct price for member/non-member
    // No additional discount calculation needed
    return price;
  };

  const getOriginalPrice = () => {
    if (!selectedModel.pricing || !selectedPricingPlan) return 0;

    switch (selectedPricingPlan) {
      case 'quarterly':
        return selectedModel.pricing.quarterlyFee || 0;
      case 'halfyearly':
        return selectedModel.pricing.halfYearlyFee || 0;
      case 'annual':
        return selectedModel.pricing.annualFee || 0;
      default:
        return 0;
    }
  };

  const isFeeBasedModel = (modelName: string) => {
    const feeBasedModels = ['Market Place', 'Aggregator', 'Market Place & Aggregator'];
    return feeBasedModels.includes(modelName);
  };

  const currentPrice = getCurrentPrice();
  const originalPrice = getOriginalPrice();

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <h4 className="font-medium text-green-900 mb-2">Selection Summary</h4>
        <div className="space-y-2 text-sm">
          <div><strong>Model:</strong> {selectedModel.model.name}</div>
          <div><strong>Duration:</strong> {selectedPricingPlan}</div>
          <div className="flex items-center gap-2">
            <strong>Price:</strong>
            {isFeeBasedModel(selectedModel.model.name) ? (
              <span className="font-bold">Fee-based model</span>
            ) : (
              membershipStatus === 'active' && currentPrice < originalPrice ? (
                <>
                  <span className="text-green-600 font-bold">${currentPrice}</span>
                  <span className="text-gray-500 line-through text-xs">${originalPrice}</span>
                  <span className="text-xs text-green-600">(Member Price)</span>
                </>
              ) : (
                <span className="font-bold">${currentPrice}</span>
              )
            )}
            {!isFeeBasedModel(selectedModel.model.name) && (
              <span>/quarterly</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
