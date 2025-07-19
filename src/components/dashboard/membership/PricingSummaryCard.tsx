
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Percent, Crown, ArrowRight, DollarSign, Info } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

interface PricingSummaryCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  selectedTier: string | null;
  selectedEngagementModel: string | null;
  selectedFrequency: string | null;
  membershipFees: any[];
  pricingData: any[];
  membershipTermsAccepted: boolean;
  engagementTermsAccepted: boolean;
  onProceedToPayment: () => void;
  onActivateEngagement: () => void;
  isProcessing: boolean;
}

export const PricingSummaryCard: React.FC<PricingSummaryCardProps> = ({
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  selectedFrequency,
  membershipFees,
  pricingData,
  membershipTermsAccepted,
  engagementTermsAccepted,
  onProceedToPayment,
  onActivateEngagement,
  isProcessing
}) => {
  const annualFee = membershipFees.find(fee => fee.annual_amount)?.annual_amount || 0;
  const currency = membershipFees.find(fee => fee.annual_currency)?.annual_currency || 'USD';

  const getEngagementModelPricing = () => {
    if (!selectedEngagementModel) return null;
    
    const pricing = pricingData.find(p => 
      p.engagement_model === selectedEngagementModel &&
      (!selectedFrequency || p.billing_frequency === selectedFrequency)
    );
    
    return pricing;
  };

  const engagementPricing = getEngagementModelPricing();

  const canProceedToPayment = () => {
    const membershipTermsRequired = membershipStatus === 'active';
    const engagementTermsRequired = selectedEngagementModel !== null;
    
    const membershipTermsOk = !membershipTermsRequired || membershipTermsAccepted;
    const engagementTermsOk = !engagementTermsRequired || engagementTermsAccepted;
    
    return membershipTermsOk && engagementTermsOk && selectedEngagementModel;
  };

  if (!membershipStatus || !selectedEngagementModel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Pricing Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete your selections to see pricing summary</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Complete Pricing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
          <h4 className="font-medium mb-3">Your Selected Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-blue-700 dark:text-blue-300">Membership</div>
              <Badge variant={membershipStatus === 'active' ? "default" : "outline"} className="mt-1">
                {membershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
              </Badge>
            </div>
            {selectedTier && (
              <div className="text-center">
                <div className="font-medium text-purple-700 dark:text-purple-300">Tier</div>
                <Badge variant="secondary" className="mt-1">{selectedTier}</Badge>
              </div>
            )}
            <div className="text-center">
              <div className="font-medium text-orange-700 dark:text-orange-300">Model</div>
              <Badge variant="outline" className="mt-1">{selectedEngagementModel}</Badge>
            </div>
          </div>
        </div>

        {/* Membership Fee Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">Annual Membership</span>
            </div>
            <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'}>
              {membershipStatus === 'active' ? 'Premium' : 'Free'}
            </Badge>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Annual Membership Fee</span>
              <span className="text-2xl font-bold text-primary">
                {membershipStatus === 'active' 
                  ? formatCurrency(annualFee, currency)
                  : '₹0'
                }
              </span>
            </div>
            
            {membershipStatus === 'active' && annualFee > 0 && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200">
                <div className="text-xs text-green-800 dark:text-green-200 space-y-1">
                  <div className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    <span className="font-medium">Member Benefits Included:</span>
                  </div>
                  <ul className="ml-4 list-disc space-y-0.5">
                    <li>Exclusive platform fee discounts</li>
                    <li>Priority customer support</li>
                    <li>Advanced analytics access</li>
                    <li>Early feature previews</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Engagement Model Pricing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-lg">Platform Usage Fees</span>
            </div>
            <Badge variant="outline">{selectedEngagementModel}</Badge>
          </div>

          {engagementPricing ? (
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-4 space-y-3">
              {engagementPricing.is_percentage ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-orange-600" />
                    <span>Platform Usage Fee</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600">
                      {formatPercentage(engagementPricing.calculated_value)}
                    </div>
                    <div className="text-xs text-muted-foreground">of solution value</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span>{selectedFrequency || 'Fixed Fee'}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(engagementPricing.calculated_value, engagementPricing.currency_code)}
                    </div>
                    <div className="text-xs text-muted-foreground">per billing cycle</div>
                  </div>
                </div>
              )}

              {membershipStatus === 'active' && engagementPricing.membership_discount_percentage > 0 && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      🎉 Member Discount Applied
                    </span>
                    <span className="text-green-700 dark:text-green-300 font-bold">
                      -{formatPercentage(engagementPricing.membership_discount_percentage)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Info className="h-4 w-4" />
                <span className="text-sm">Pricing will be calculated when you create challenges</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Terms Status */}
        <div className="space-y-3">
          <span className="font-semibold">Terms & Conditions Status</span>
          
          <div className="space-y-2">
            {membershipStatus === 'active' && (
              <div className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-900">
                <span className="text-sm">Membership Terms</span>
                <div className={`flex items-center gap-2 ${membershipTermsAccepted ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${membershipTermsAccepted ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    {membershipTermsAccepted ? 'Accepted' : 'Required'}
                  </span>
                </div>
              </div>
            )}
            
            {selectedEngagementModel && (
              <div className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-900">
                <span className="text-sm">Engagement Model Terms</span>
                <div className={`flex items-center gap-2 ${engagementTermsAccepted ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${engagementTermsAccepted ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    {engagementTermsAccepted ? 'Accepted' : 'Required'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          {membershipStatus === 'active' && annualFee > 0 && (
            <Button
              size="lg"
              className="w-full"
              onClick={onProceedToPayment}
              disabled={!membershipTermsAccepted || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pay Annual Membership - {formatCurrency(annualFee, currency)}
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          )}

          <Button
            size="lg"
            variant={membershipStatus === 'active' && annualFee > 0 ? 'outline' : 'default'}
            className="w-full"
            onClick={onActivateEngagement}
            disabled={!canProceedToPayment() || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Activating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                🚀 Activate Complete Configuration
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>

        {/* Final Notice */}
        <div className="p-3 bg-muted/30 rounded-lg border">
          <p className="text-xs text-muted-foreground text-center">
            💡 All fees are as per master pricing configuration and may be subject to applicable taxes.
            Platform usage fees will be calculated per challenge based on your selected model.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
