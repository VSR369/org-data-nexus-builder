
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';
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
    if (typeof amount !== 'number' || isNaN(amount)) {
      console.warn('⚠️ formatCurrency: Invalid amount:', amount);
      return 'Contact for pricing';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(amount);
    } catch (error) {
      console.error('❌ formatCurrency error:', error);
      return `${currency || 'USD'} ${amount}`;
    }
  };

  const isFeeBasedModel = (modelName: string) => {
    const feeBasedModels = ['Market Place', 'Aggregator', 'Market Place & Aggregator'];
    return feeBasedModels.includes(modelName);
  };

  const getEngagementModelFeePercentage = (pricing: PricingConfig | null) => {
    if (!pricing) return 0;
    
    const fee = pricing.engagementModelFee || pricing.quarterlyFee || 0;
    
    if (typeof fee !== 'number' || isNaN(fee)) {
      console.warn('⚠️ getEngagementModelFeePercentage: Invalid fee value:', fee, 'for model:', pricing.engagementModel);
      return 0;
    }
    
    return fee;
  };

  const formatPricing = (amount: number, currency: string = 'USD', modelName: string, pricing: PricingConfig | null = null) => {
    if (isFeeBasedModel(modelName)) {
      const feePercentage = getEngagementModelFeePercentage(pricing);
      return `${feePercentage}% of Solution Fee`;
    }
    return formatCurrency(amount, currency);
  };

  const getCurrentPrice = () => {
    if (!item.pricing || !selectedPricingPlan) {
      console.warn('⚠️ getCurrentPrice: Missing pricing data or plan:', { 
        hasPricing: !!item.pricing, 
        selectedPlan: selectedPricingPlan,
        modelName: item.model.name 
      });
      return 0;
    }

    let price = 0;
    switch (selectedPricingPlan) {
      case 'quarterly':
        price = item.pricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        price = item.pricing.halfYearlyFee || 0;
        break;
      case 'annual':
        price = item.pricing.annualFee || 0;
        break;
      default:
        console.warn('⚠️ getCurrentPrice: Unknown pricing plan:', selectedPricingPlan);
        return 0;
    }

    if (typeof price !== 'number' || isNaN(price)) {
      console.warn('⚠️ getCurrentPrice: Invalid price:', price, 'for plan:', selectedPricingPlan);
      return 0;
    }

    console.log('💰 getCurrentPrice calculation:', {
      modelName: item.model.name,
      selectedPlan: selectedPricingPlan,
      price,
      membershipStatus: item.pricing.membershipStatus,
      note: 'Database already contains correct member/non-member pricing'
    });

    return price;
  };

  const getOriginalPrice = () => {
    if (!item.pricing || !selectedPricingPlan) {
      console.warn('⚠️ getOriginalPrice: Missing pricing data or plan:', { 
        hasPricing: !!item.pricing, 
        selectedPlan: selectedPricingPlan,
        modelName: item.model.name 
      });
      return 0;
    }

    let originalPrice = 0;
    switch (selectedPricingPlan) {
      case 'quarterly':
        originalPrice = item.pricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        originalPrice = item.pricing.halfYearlyFee || 0;
        break;
      case 'annual':
        originalPrice = item.pricing.annualFee || 0;
        break;
      default:
        console.warn('⚠️ getOriginalPrice: Unknown pricing plan:', selectedPricingPlan);
        return 0;
    }

    if (typeof originalPrice !== 'number' || isNaN(originalPrice)) {
      console.warn('⚠️ getOriginalPrice: Invalid original price:', originalPrice, 'for plan:', selectedPricingPlan);
      return 0;
    }

    return originalPrice;
  };

  // Simple inline pricing display component
  const PricingDisplay = () => {
    if (!item.pricing || !selectedPricingPlan) {
      return (
        <div className="text-right min-w-[200px]">
          <div className="text-sm text-gray-500">No pricing available</div>
        </div>
      );
    }

    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();

    if (isFeeBasedModel(item.model.name)) {
      return (
        <div className="text-right min-w-[200px]">
          <div className="text-lg font-bold text-primary">
            {formatPricing(0, item.pricing.currency || 'USD', item.model.name, item.pricing)}
          </div>
        </div>
      );
    }

    const hasDiscount = membershipStatus === 'active' && 
                       item.pricing.discountPercentage && 
                       currentPrice < originalPrice;

    return (
      <div className="text-right min-w-[200px]">
        {hasDiscount ? (
          <div>
            <div className="text-lg font-bold text-green-600">
              {formatPricing(currentPrice, item.pricing.currency, item.model.name, item.pricing)}
            </div>
            <div className="text-sm text-gray-500 line-through">
              {formatPricing(originalPrice, item.pricing.currency, item.model.name, item.pricing)}
            </div>
            <div className="text-xs text-green-600">
              {item.pricing.discountPercentage}% member discount
            </div>
          </div>
        ) : (
          <div className="text-lg font-bold text-gray-900">
            {formatPricing(currentPrice, item.pricing.currency || 'USD', item.model.name, item.pricing)}
          </div>
        )}
      </div>
    );
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
                  
                  <PricingDisplay />
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
