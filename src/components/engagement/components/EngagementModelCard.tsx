
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, DollarSign } from 'lucide-react';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';

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

  const getCurrentPrice = (modelWithPricing: ModelWithPricing) => {
    if (!modelWithPricing.pricing || !selectedPricingPlan) return 0;

    let basePrice = 0;
    switch (selectedPricingPlan) {
      case 'quarterly':
        basePrice = modelWithPricing.pricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        basePrice = modelWithPricing.pricing.halfYearlyFee || 0;
        break;
      case 'annual':
        basePrice = modelWithPricing.pricing.annualFee || 0;
        break;
      default:
        return 0;
    }

    if (membershipStatus === 'active' && modelWithPricing.pricing.discountPercentage) {
      return basePrice * (1 - modelWithPricing.pricing.discountPercentage / 100);
    }

    return basePrice;
  };

  const getOriginalPrice = (modelWithPricing: ModelWithPricing) => {
    if (!modelWithPricing.pricing || !selectedPricingPlan) return 0;

    switch (selectedPricingPlan) {
      case 'quarterly':
        return modelWithPricing.pricing.quarterlyFee || 0;
      case 'halfyearly':
        return modelWithPricing.pricing.halfYearlyFee || 0;
      case 'annual':
        return modelWithPricing.pricing.annualFee || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="relative">
      <Label htmlFor={item.model.id} className="cursor-pointer">
        <Card className={`border-2 transition-all hover:shadow-md ${
          selectedModelId === item.model.id 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <RadioGroupItem value={item.model.id} id={item.model.id} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{item.model.name}</h4>
                      <Badge variant="default">Active</Badge>
                      {currentSelectedModel?.id === item.model.id && (
                        <Badge variant="secondary">Currently Selected</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {item.model.description}
                    </p>
                  </div>
                  
                  {/* Pricing Information */}
                  <div className="text-right min-w-[200px]">
                    {item.pricing && selectedPricingPlan ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 justify-end">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {selectedPricingPlan === 'quarterly' ? 'Quarterly' : 
                             selectedPricingPlan === 'halfyearly' ? 'Half-Yearly' : 'Annual'} 
                            {isFeeBasedModel(item.model.name) ? ' Fee Rate' : ' Pricing'}
                          </span>
                        </div>
                        
                        {isFeeBasedModel(item.model.name) ? (
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPricing(0, item.pricing.currency || 'USD', item.model.name, item.pricing)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Applied per solution transaction
                            </div>
                          </div>
                        ) : (
                          membershipStatus === 'active' && item.pricing.discountPercentage && getCurrentPrice(item) < getOriginalPrice(item) ? (
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-green-600">
                                {formatPricing(getCurrentPrice(item), item.pricing.currency, item.model.name)}
                              </div>
                              <div className="text-sm text-gray-500 line-through">
                                {formatPricing(getOriginalPrice(item), item.pricing.currency, item.model.name)}
                              </div>
                              <div className="text-xs text-green-600">
                                {item.pricing.discountPercentage}% member discount
                              </div>
                              <div className="text-xs text-gray-500">
                                per {selectedPricingPlan === 'quarterly' ? 'quarter' : 
                                     selectedPricingPlan === 'halfyearly' ? '6 months' : 'year'}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-gray-900">
                                {getCurrentPrice(item) > 0 ? formatPricing(getCurrentPrice(item), item.pricing.currency || 'USD', item.model.name) : 'Contact for pricing'}
                              </div>
                              <div className="text-xs text-gray-500">
                                per {selectedPricingPlan === 'quarterly' ? 'quarter' : 
                                     selectedPricingPlan === 'halfyearly' ? '6 months' : 'year'}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : selectedPricingPlan ? (
                      <div className="text-center">
                        <div className="text-sm text-gray-500">No pricing configured</div>
                        <div className="text-xs text-gray-400">Contact administrator</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Select pricing plan first</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedModelId === item.model.id && (
                  <div className="flex items-center gap-2 text-blue-600 mt-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </Label>
    </div>
  );
};
