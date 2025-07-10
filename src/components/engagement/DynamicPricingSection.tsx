import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Percent, Loader2 } from 'lucide-react';
import { PricingConfig } from '@/types/pricing';

interface DynamicPricingSectionProps {
  selectedEngagementModel: string;
  engagementModelName: string;
  selectedPricingPlan?: string;
  onPricingPlanChange: (plan: string) => void;
  pricingConfig: PricingConfig | null;
  membershipStatus: 'member' | 'not-a-member';
  onSelectPlatformFee: (termsAccepted: boolean) => void;
  isSubmitted?: boolean;
  isLoading?: boolean;
}

export const DynamicPricingSection: React.FC<DynamicPricingSectionProps> = ({
  selectedEngagementModel,
  engagementModelName,
  selectedPricingPlan,
  onPricingPlanChange,
  pricingConfig,
  membershipStatus,
  onSelectPlatformFee,
  isSubmitted = false,
  isLoading = false
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  // Check if engagement model is marketplace-based (fee-based)
  const isMarketplaceBased = (modelName: string) => {
    return ['Market Place', 'Aggregator', 'Market Place & Aggregator'].includes(modelName);
  };

  // Check if engagement model is Platform as a Service
  const isPlatformService = (modelName: string) => {
    return modelName === 'Platform as a Service';
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Get platform fee percentage from master data
  const getPlatformFeePercentage = () => {
    if (!pricingConfig) return 0;
    return pricingConfig.platformFeePercentage || 0;
  };

  // Get discounted platform fee percentage
  const getDiscountedPlatformFee = () => {
    const baseFee = getPlatformFeePercentage();
    if (membershipStatus === 'member' && pricingConfig?.discountPercentage) {
      return baseFee * (1 - pricingConfig.discountPercentage / 100);
    }
    return baseFee;
  };

  // Get pricing for specific frequency
  const getFrequencyPrice = (frequency: string) => {
    if (!pricingConfig) return 0;
    switch (frequency) {
      case 'quarterly':
        return pricingConfig.quarterlyFee || 0;
      case 'halfyearly':
        return pricingConfig.halfYearlyFee || 0;
      case 'annual':
        return pricingConfig.annualFee || 0;
      default:
        return 0;
    }
  };

  // Get discounted price for subscription
  const getDiscountedSubscriptionPrice = (frequency: string) => {
    const basePrice = getFrequencyPrice(frequency);
    if (membershipStatus === 'member' && pricingConfig?.discountPercentage) {
      return basePrice * (1 - pricingConfig.discountPercentage / 100);
    }
    return basePrice;
  };

  // Get frequency display name
  const getFrequencyDisplayName = (frequency: string) => {
    switch (frequency) {
      case 'quarterly':
        return 'Quarterly';
      case 'halfyearly':
        return 'Half-Yearly';
      case 'annual':
        return 'Annual';
      default:
        return '';
    }
  };

  // Don't render if no engagement model selected
  if (!selectedEngagementModel) {
    return null;
  }

  // Render Platform Fee section for marketplace-based models
  if (isMarketplaceBased(engagementModelName)) {
    const platformFee = getPlatformFeePercentage();
    const discountedFee = getDiscountedPlatformFee();
    const hasDiscount = membershipStatus === 'member' && pricingConfig?.discountPercentage && discountedFee < platformFee;

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Platform Fee Based on Selected Engagement Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pricingConfig ? (
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">Platform Fee</div>
                  
                  {hasDiscount ? (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">
                        {discountedFee.toFixed(1)}% of Solution Fee
                      </div>
                      <div className="text-lg text-muted-foreground line-through">
                        {platformFee.toFixed(1)}% of Solution Fee
                      </div>
                      <div className="text-sm text-green-600">
                        {pricingConfig.discountPercentage}% member discount applied
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-foreground">
                      {platformFee.toFixed(1)}% of Solution Fee
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Applied per solution transaction
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mt-4 flex items-center space-x-2">
                <Checkbox 
                  id="terms-marketplace" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <label htmlFor="terms-marketplace" className="text-sm text-gray-600 cursor-pointer">
                  I accept the terms and conditions for platform fee activation
                </label>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => onSelectPlatformFee(termsAccepted)}
                  className="bg-primary hover:bg-primary/90 px-8 py-3"
                  size="lg"
                  disabled={!pricingConfig || isSubmitted || isLoading || !termsAccepted}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Activating...
                    </>
                  ) : (
                    "Select Platform Fee"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No pricing configuration available</div>
              <div className="text-sm text-muted-foreground mt-1">Contact administrator for pricing details</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render Subscription Fee section for Platform as a Service
  if (isPlatformService(engagementModelName)) {
    const frequencies = ['quarterly', 'halfyearly', 'annual'];

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Subscription Fee
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pricingConfig ? (
            <div className="space-y-4">
              <div className="grid gap-3">
                {frequencies.map((frequency) => {
                  const basePrice = getFrequencyPrice(frequency);
                  const discountedPrice = getDiscountedSubscriptionPrice(frequency);
                  const hasDiscount = membershipStatus === 'member' && pricingConfig?.discountPercentage && discountedPrice < basePrice;
                  
                  if (basePrice <= 0) return null;

                  return (
                    <div
                      key={frequency}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPricingPlan === frequency 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => onPricingPlanChange(frequency)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{getFrequencyDisplayName(frequency)}</div>
                          <div className="text-sm text-muted-foreground">
                            {frequency === 'quarterly' ? '3 months' : 
                             frequency === 'halfyearly' ? '6 months' : '12 months'}
                          </div>
                        </div>
                        <div className="text-right">
                          {hasDiscount ? (
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(discountedPrice, pricingConfig.currency || 'INR')}
                              </div>
                              <div className="text-sm text-muted-foreground line-through">
                                {formatCurrency(basePrice, pricingConfig.currency || 'INR')}
                              </div>
                              <div className="text-xs text-green-600">
                                {pricingConfig.discountPercentage}% discount
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-foreground">
                              {formatCurrency(basePrice, pricingConfig.currency || 'INR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {membershipStatus === 'member' && pricingConfig?.discountPercentage && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800 text-center">
                    🎉 You're saving {pricingConfig.discountPercentage}% with your membership!
                  </div>
                </div>
              )}

              {selectedPricingPlan && (
                <div className="space-y-4">
                  {/* Terms & Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms-paas" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    />
                    <label htmlFor="terms-paas" className="text-sm text-gray-600 cursor-pointer">
                      I accept the terms and conditions for subscription activation
                    </label>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => onSelectPlatformFee(termsAccepted)}
                      className="bg-primary hover:bg-primary/90 px-8 py-3"
                      size="lg"
                      disabled={!selectedPricingPlan || isSubmitted || isLoading || !termsAccepted}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Activating...
                        </>
                      ) : (
                        "Select Subscription Fee"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No pricing configuration available</div>
              <div className="text-sm text-muted-foreground mt-1">Contact administrator for pricing details</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Fallback for other engagement models
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Pricing Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="text-muted-foreground">Pricing configuration not available for this engagement model</div>
          <div className="text-sm text-muted-foreground mt-1">Contact administrator for pricing details</div>
        </div>
      </CardContent>
    </Card>
  );
};