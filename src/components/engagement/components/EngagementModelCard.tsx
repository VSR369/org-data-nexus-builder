
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';
import { PricingDisplaySection } from './PricingDisplaySection';
import { ModelInfoSection } from './ModelInfoSection';
import { ModelSelectionIndicator } from './ModelSelectionIndicator';

interface ModelWithPricing {
  model: EngagementModel;
  pricing: PricingConfig | null;
  originalPrice?: number;
  discountedPrice?: number;
}

interface EngagementModelCardProps {
  item: ModelWithPricing;
  selectedModelId: string;
  selectedPricingPlan: string;
  membershipStatus: 'active' | 'inactive';
  currentSelectedModel?: EngagementModel | null;
}

export const EngagementModelCard: React.FC<EngagementModelCardProps> = ({
  item,
  selectedModelId,
  selectedPricingPlan,
  membershipStatus,
  currentSelectedModel
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const isFeeBasedModel = (modelName: string) => {
    const feeBasedModels = ['Market Place', 'Aggregator', 'Market Place & Aggregator'];
    return feeBasedModels.includes(modelName);
  };

  const getEngagementModelFeePercentage = (pricing: PricingConfig | null) => {
    if (!pricing) return 0;
    return pricing.engagementModelFee || pricing.quarterlyFee || 0;
  };

  const formatPricing = (amount: number, currency: string = 'USD', modelName: string, pricing: PricingConfig | null = null) => {
    if (isFeeBasedModel(modelName)) {
      const feePercentage = getEngagementModelFeePercentage(pricing);
      return `${feePercentage}% of Solution Fee`;
    }
    return formatCurrency(amount, currency);
  };

  const getCurrentPrice = () => {
    if (!item.pricing || !selectedPricingPlan) return 0;

    let basePrice = 0;
    switch (selectedPricingPlan) {
      case 'quarterly':
        basePrice = item.pricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        basePrice = item.pricing.halfYearlyFee || 0;
        break;
      case 'annual':
        basePrice = item.pricing.annualFee || 0;
        break;
      default:
        return 0;
    }

    if (membershipStatus === 'active' && item.pricing.discountPercentage) {
      return basePrice * (1 - item.pricing.discountPercentage / 100);
    }

    return basePrice;
  };

  const getOriginalPrice = () => {
    if (!item.pricing || !selectedPricingPlan) return 0;

    switch (selectedPricingPlan) {
      case 'quarterly':
        return item.pricing.quarterlyFee || 0;
      case 'halfyearly':
        return item.pricing.halfYearlyFee || 0;
      case 'annual':
        return item.pricing.annualFee || 0;
      default:
        return 0;
    }
  };

  const isSelected = selectedModelId === item.model.id;

  return (
    <div className="relative">
      <Label htmlFor={item.model.id} className="cursor-pointer">
        <Card className={`border-2 transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <RadioGroupItem value={item.model.id} id={item.model.id} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <ModelInfoSection 
                    model={item.model}
                    currentSelectedModel={currentSelectedModel}
                  />
                  
                  <div className="text-right min-w-[200px]">
                    <PricingDisplaySection
                      pricing={item.pricing}
                      selectedPricingPlan={selectedPricingPlan}
                      modelName={item.model.name}
                      membershipStatus={membershipStatus}
                      getCurrentPrice={getCurrentPrice}
                      getOriginalPrice={getOriginalPrice}
                      formatPricing={(amount, currency, modelName) => formatPricing(amount, currency, modelName, item.pricing)}
                      isFeeBasedModel={isFeeBasedModel}
                    />
                  </div>
                </div>
                
                <ModelSelectionIndicator isSelected={isSelected} />
              </div>
            </div>
          </CardHeader>
        </Card>
      </Label>
    </div>
  );
};
