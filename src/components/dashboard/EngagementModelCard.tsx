
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, CheckCircle, DollarSign } from 'lucide-react';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';

interface EngagementModelCardProps {
  selectedEngagementModel: EngagementModel | null;
  selectedPricing?: PricingConfig | null;
  onSelectEngagementModel: () => void;
  showLoginWarning: boolean;
  membershipStatus?: 'active' | 'inactive';
}

const EngagementModelCard: React.FC<EngagementModelCardProps> = ({
  selectedEngagementModel,
  selectedPricing,
  onSelectEngagementModel,
  showLoginWarning,
  membershipStatus = 'inactive'
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

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Handshake className="h-6 w-6 text-purple-600" />
          Engagement Model Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedEngagementModel ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
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
              >
                Change Model
              </Button>
            </div>

            {/* Pricing Information */}
            {selectedPricing && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Pricing Information</h3>
                  <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'}>
                    {membershipStatus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quarterly Pricing */}
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-1">Quarterly</div>
                    {membershipStatus === 'active' && selectedPricing.discountPercentage && selectedPricing.quarterlyFee ? (
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(getDiscountedPrice(selectedPricing.quarterlyFee, selectedPricing.discountPercentage), selectedPricing.currency)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(selectedPricing.quarterlyFee, selectedPricing.currency)}
                        </div>
                        <div className="text-xs text-green-600">
                          {selectedPricing.discountPercentage}% off
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold">
                        {selectedPricing.quarterlyFee ? 
                          formatCurrency(selectedPricing.quarterlyFee, selectedPricing.currency) : 
                          'Contact for pricing'
                        }
                      </div>
                    )}
                  </div>

                  {/* Half-Yearly Pricing */}
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-1">Half-Yearly</div>
                    {membershipStatus === 'active' && selectedPricing.discountPercentage && selectedPricing.halfYearlyFee ? (
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(getDiscountedPrice(selectedPricing.halfYearlyFee, selectedPricing.discountPercentage), selectedPricing.currency)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(selectedPricing.halfYearlyFee, selectedPricing.currency)}
                        </div>
                        <div className="text-xs text-green-600">
                          {selectedPricing.discountPercentage}% off
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold">
                        {selectedPricing.halfYearlyFee ? 
                          formatCurrency(selectedPricing.halfYearlyFee, selectedPricing.currency) : 
                          'Contact for pricing'
                        }
                      </div>
                    )}
                  </div>

                  {/* Annual Pricing */}
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-1">Annual</div>
                    {membershipStatus === 'active' && selectedPricing.discountPercentage && selectedPricing.annualFee ? (
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(getDiscountedPrice(selectedPricing.annualFee, selectedPricing.discountPercentage), selectedPricing.currency)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(selectedPricing.annualFee, selectedPricing.currency)}
                        </div>
                        <div className="text-xs text-green-600">
                          {selectedPricing.discountPercentage}% off
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold">
                        {selectedPricing.annualFee ? 
                          formatCurrency(selectedPricing.annualFee, selectedPricing.currency) : 
                          'Contact for pricing'
                        }
                      </div>
                    )}
                  </div>
                </div>

                {membershipStatus === 'active' && selectedPricing.discountPercentage && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                    🎉 You're saving {selectedPricing.discountPercentage}% with your active membership!
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Your Engagement Model</h3>
              <p className="text-gray-600">
                Choose an engagement model that defines how services are delivered and managed 
                for your organization. View pricing based on your membership status.
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
