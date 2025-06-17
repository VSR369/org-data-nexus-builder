import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Handshake, CheckCircle, DollarSign, Send } from 'lucide-react';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';

interface EngagementModelCardProps {
  selectedEngagementModel: EngagementModel | null;
  selectedPricing?: PricingConfig | null;
  selectedPricingPlan?: string;
  onSelectEngagementModel: () => void;
  onSubmitSelection: () => void;
  onPricingPlanChange: (plan: string) => void;
  showLoginWarning: boolean;
  membershipStatus?: 'active' | 'inactive';
  isSubmitted?: boolean;
}

const EngagementModelCard: React.FC<EngagementModelCardProps> = ({
  selectedEngagementModel,
  selectedPricing,
  selectedPricingPlan,
  onSelectEngagementModel,
  onSubmitSelection,
  onPricingPlanChange,
  showLoginWarning,
  membershipStatus = 'inactive',
  isSubmitted = false
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getDiscountedPrice = (originalPrice: number, discountPercentage?: number) => {
    if (membershipStatus === 'active' && discountPercentage) {
      return originalPrice * (1 - discountPercentage / 100);
    }
    return originalPrice;
  };

  const getCurrentPriceForPlan = () => {
    if (!selectedPricing || !selectedPricingPlan) return 0;

    switch (selectedPricingPlan) {
      case 'quarterly':
        return selectedPricing.quarterlyFee || 0;
      case 'halfyearly':
        return selectedPricing.halfYearlyFee || 0;
      case 'annual':
        return selectedPricing.annualFee || 0;
      default:
        return 0;
    }
  };

  const getPlanDisplayName = () => {
    switch (selectedPricingPlan) {
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

  // Check if engagement model is fee-based (percentage) or fixed pricing
  const isFeeBasedModel = (modelName: string) => {
    const feeBasedModels = ['Market Place', 'Aggregator', 'Market Place & Aggregator'];
    return feeBasedModels.includes(modelName);
  };

  const formatPricing = (amount: number, currency: string = 'USD', modelName: string) => {
    if (isFeeBasedModel(modelName)) {
      return `${amount}% of Solution Fee`;
    }
    return formatCurrency(amount, currency);
  };

  // If selection is submitted, show final pricing summary
  if (isSubmitted && selectedEngagementModel && selectedPricing && selectedPricingPlan) {
    const originalPrice = getCurrentPriceForPlan();
    const finalPrice = getDiscountedPrice(originalPrice, selectedPricing.discountPercentage);
    
    return (
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Selection Submitted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-green-800">Final Selection</h2>
              </div>
              
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Engagement Model</p>
                    <p className="font-semibold text-lg">{selectedEngagementModel.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Billing Cycle</p>
                    <p className="font-semibold text-lg">{getPlanDisplayName()}</p>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {isFeeBasedModel(selectedEngagementModel.name) ? 'Fee Rate:' : 'Total Amount:'}
                    </span>
                    <div className="text-right">
                      {membershipStatus === 'active' && selectedPricing.discountPercentage && finalPrice < originalPrice ? (
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatPricing(finalPrice, selectedPricing.currency, selectedEngagementModel.name)}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            {formatPricing(originalPrice, selectedPricing.currency, selectedEngagementModel.name)}
                          </div>
                          <div className="text-xs text-green-600">
                            {selectedPricing.discountPercentage}% member discount applied
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPricing(finalPrice, selectedPricing.currency || 'USD', selectedEngagementModel.name)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded p-3 mt-4">
                  <p className="text-sm text-blue-800 text-center">
                    Your selection has been saved. You can proceed with the next steps or modify your selection if needed.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={onSelectEngagementModel}
                variant="outline"
                className="mt-4"
              >
                Modify Selection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Handshake className="h-6 w-6 text-purple-600" />
          Engagement Model & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedEngagementModel ? (
          <div className="space-y-6">
            {/* Selected Engagement Model */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Selected Engagement Model</p>
                    <p className="text-lg font-semibold text-green-700">
                      {selectedEngagementModel.name}
                    </p>
                    <p className="text-sm text-green-600">
                      {selectedEngagementModel.description}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={onSelectEngagementModel}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  size="sm"
                >
                  Change Model
                </Button>
              </div>
            </div>

            {/* Pricing Plan Selection */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Select Your Pricing Plan</h3>
                <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'}>
                  {membershipStatus}
                </Badge>
              </div>

              <RadioGroup 
                value={selectedPricingPlan || ''} 
                onValueChange={onPricingPlanChange}
                className="space-y-3"
              >
                {/* Quarterly Option */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-white">
                  <RadioGroupItem value="quarterly" id="quarterly" />
                  <Label htmlFor="quarterly" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Quarterly Plan</div>
                        <div className="text-sm text-gray-600">3 months billing cycle</div>
                      </div>
                      <div className="text-right">
                        {selectedPricing ? (
                          <>
                            {membershipStatus === 'active' && selectedPricing.discountPercentage ? (
                              <div>
                                <div className="text-lg font-bold text-green-600">
                                  {formatPricing(getDiscountedPrice(selectedPricing.quarterlyFee || 0, selectedPricing.discountPercentage), selectedPricing.currency, selectedEngagementModel.name)}
                                </div>
                                <div className="text-sm text-gray-500 line-through">
                                  {formatPricing(selectedPricing.quarterlyFee || 0, selectedPricing.currency, selectedEngagementModel.name)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-bold">
                                {formatPricing(selectedPricing.quarterlyFee || 0, selectedPricing.currency || 'USD', selectedEngagementModel.name)}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">No pricing available</div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Half-Yearly Option */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-white">
                  <RadioGroupItem value="halfyearly" id="halfyearly" />
                  <Label htmlFor="halfyearly" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Half-Yearly Plan</div>
                        <div className="text-sm text-gray-600">6 months billing cycle</div>
                      </div>
                      <div className="text-right">
                        {selectedPricing ? (
                          <>
                            {membershipStatus === 'active' && selectedPricing.discountPercentage ? (
                              <div>
                                <div className="text-lg font-bold text-green-600">
                                  {formatPricing(getDiscountedPrice(selectedPricing.halfYearlyFee || 0, selectedPricing.discountPercentage), selectedPricing.currency, selectedEngagementModel.name)}
                                </div>
                                <div className="text-sm text-gray-500 line-through">
                                  {formatPricing(selectedPricing.halfYearlyFee || 0, selectedPricing.currency, selectedEngagementModel.name)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-bold">
                                {formatPricing(selectedPricing.halfYearlyFee || 0, selectedPricing.currency || 'USD', selectedEngagementModel.name)}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">No pricing available</div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Annual Option */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-white">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Annual Plan</div>
                        <div className="text-sm text-gray-600">12 months billing cycle</div>
                      </div>
                      <div className="text-right">
                        {selectedPricing ? (
                          <>
                            {membershipStatus === 'active' && selectedPricing.discountPercentage ? (
                              <div>
                                <div className="text-lg font-bold text-green-600">
                                  {formatPricing(getDiscountedPrice(selectedPricing.annualFee || 0, selectedPricing.discountPercentage), selectedPricing.currency, selectedEngagementModel.name)}
                                </div>
                                <div className="text-sm text-gray-500 line-through">
                                  {formatPricing(selectedPricing.annualFee || 0, selectedPricing.currency, selectedEngagementModel.name)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-bold">
                                {formatPricing(selectedPricing.annualFee || 0, selectedPricing.currency || 'USD', selectedEngagementModel.name)}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">No pricing available</div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {membershipStatus === 'active' && selectedPricing?.discountPercentage && (
                <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                  🎉 You're saving {selectedPricing.discountPercentage}% with your active membership!
                </div>
              )}
            </div>

            {/* Submit Button */}
            {selectedPricingPlan && (
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={onSubmitSelection}
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg font-semibold"
                  size="lg"
                  disabled={showLoginWarning}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Submit Selection
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Your Engagement Model</h3>
              <p className="text-gray-600">
                Choose an engagement model that defines how services are delivered and managed 
                for your organization. Select your preferred pricing plan and view pricing based on your membership status.
              </p>
            </div>
            <Button 
              onClick={onSelectEngagementModel}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 text-lg font-semibold"
              size="lg"
              disabled={showLoginWarning}
            >
              <Handshake className="mr-2 h-5 w-5" />
              Select Model
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementModelCard;
