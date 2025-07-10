
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
    // Step 6: Enhanced Error Handling - Add null checking
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
    
    // Enhanced validation to prevent undefined errors
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

    // Validate price
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

    // Database already contains the correct price for member/non-member
    // No additional discount calculation needed
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

    // Validate original price
    if (typeof originalPrice !== 'number' || isNaN(originalPrice)) {
      console.warn('⚠️ getOriginalPrice: Invalid original price:', originalPrice, 'for plan:', selectedPricingPlan);
      return 0;
    }

    return originalPrice;
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
