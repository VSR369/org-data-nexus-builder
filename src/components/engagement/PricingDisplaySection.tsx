import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, DollarSign, Percent } from "lucide-react";
import { PricingConfig } from '@/types/pricing';
import { formatCurrency, getDisplayAmount } from '@/utils/membershipPricingUtils';

interface PricingDisplaySectionProps {
  pricing: PricingConfig;
  memberPricing?: PricingConfig | null;
  nonMemberPricing?: PricingConfig | null;
  selectedFrequency: string | null;
  modelName: string;
  membershipStatus: string;
  showFrequencyInTitle?: boolean;
}

export const PricingDisplaySection: React.FC<PricingDisplaySectionProps> = ({
  pricing,
  memberPricing,
  nonMemberPricing,
  selectedFrequency,
  modelName,
  membershipStatus,
  showFrequencyInTitle = true
}) => {
  if (!pricing || !selectedFrequency) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {!selectedFrequency ? 'Please select a billing frequency to view pricing' : 'Pricing information not available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const isMembershipPaid = membershipStatus === 'member_paid';
  
  // Get display amounts for both member and non-member pricing
  const nonMemberAmount = nonMemberPricing ? getDisplayAmount(selectedFrequency, nonMemberPricing, 'inactive') : null;
  const memberAmount = memberPricing ? getDisplayAmount(selectedFrequency, memberPricing, 'member_paid') : null;

  // Determine current pricing to display
  const currentAmount = isMembershipPaid && memberAmount ? memberAmount : nonMemberAmount;

  // Check if it's a percentage-based model
  const isPercentageModel = pricing.platformFeePercentage && !currentAmount?.amount;

  const frequencyLabel = selectedFrequency === 'half-yearly' ? 'Half-Yearly' : 
                        selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          {showFrequencyInTitle ? `${frequencyLabel} Pricing` : 'Pricing Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPercentageModel ? (
          // Percentage-based pricing display
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                {pricing.platformFeePercentage}%
                <Percent className="w-6 h-6" />
              </div>
              <p className="text-muted-foreground mt-1">of solution fee</p>
            </div>
            
            {/* Show discount information if applicable */}
            {isMembershipPaid && memberPricing && memberPricing.discountPercentage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingDown className="w-4 h-4" />
                  <span className="font-medium">Member Discount Applied</span>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Original Rate: {nonMemberPricing?.platformFeePercentage || pricing.platformFeePercentage}% 
                  → Discounted Rate: {memberPricing.platformFeePercentage}%
                  <div className="text-xs mt-1">
                    You save {memberPricing.discountPercentage}% on platform fees
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Fixed amount pricing display
          <div className="space-y-3">
            {/* Current Pricing */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {currentAmount ? formatCurrency(currentAmount.amount, pricing.currency) : 'Price not configured'}
              </div>
              {showFrequencyInTitle && (
                <p className="text-muted-foreground mt-1">per {selectedFrequency === 'half-yearly' ? 'half year' : selectedFrequency.replace('ly', '')}</p>
              )}
            </div>

            {/* Discount Information */}
            {isMembershipPaid && memberAmount && nonMemberAmount && memberAmount.amount < nonMemberAmount.amount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span className="font-medium">Member Discount Applied</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Original Price:</span>
                  <span className="line-through text-muted-foreground">
                    {formatCurrency(nonMemberAmount.amount, pricing.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700">Member Price:</span>
                  <span className="font-medium text-green-700">
                    {formatCurrency(memberAmount.amount, pricing.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1 pt-1 border-t border-green-200">
                  <span className="text-green-700">You Save:</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(nonMemberAmount.amount - memberAmount.amount, pricing.currency)}
                  </span>
                </div>
              </div>
            )}

            {/* Show both prices side by side if not a member but both configs exist */}
            {!isMembershipPaid && memberAmount && nonMemberAmount && (
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <Badge variant="outline" className="mb-2">Non-Member</Badge>
                    <div className="text-lg font-bold">
                      {formatCurrency(nonMemberAmount.amount, pricing.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground">Current Price</div>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-3 text-center">
                    <Badge variant="default" className="mb-2 bg-green-100 text-green-800">Member</Badge>
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(memberAmount.amount, pricing.currency)}
                    </div>
                    <div className="text-xs text-green-600">After Membership</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground text-center bg-muted/50 p-2 rounded">
          {isPercentageModel 
            ? 'Platform fee calculated as percentage of each solution transaction'
            : `Fixed ${frequencyLabel.toLowerCase()} fee for ${modelName} engagement`
          }
        </div>
      </CardContent>
    </Card>
  );
};