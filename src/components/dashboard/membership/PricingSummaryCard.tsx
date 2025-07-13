import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Percent, Crown, ArrowRight } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

interface PricingSummaryCardProps {
  membershipStatus: 'active' | 'inactive' | null;
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

  const isPaasModel = selectedEngagementModel === 'Platform as a Service';
  const needsFrequencySelection = isPaasModel && !selectedFrequency;

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
            <p>Please select membership status and engagement model to see pricing summary</p>
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
          Pricing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Membership Fee Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-medium">Annual Membership Fee</span>
            </div>
            <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'} className="text-xs">
              {membershipStatus === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-lg">
            <span className="text-muted-foreground">Membership Cost</span>
            <span className="font-bold">
              {membershipStatus === 'active' 
                ? formatCurrency(annualFee, currency)
                : '₹0 (Free)'
              }
            </span>
          </div>

          {membershipStatus === 'active' && (
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="text-xs text-primary">
                ✓ Includes exclusive benefits, discounts, and priority support
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Engagement Model Fee Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Engagement Model Fee</span>
            <Badge variant="outline" className="text-xs">
              {selectedEngagementModel}
            </Badge>
          </div>

          {engagementPricing && (
            <div className="space-y-2">
              {engagementPricing.is_percentage ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    <span className="text-muted-foreground">Platform Fee</span>
                  </div>
                  <span className="font-bold text-primary">
                    {formatPercentage(engagementPricing.calculated_value)} of Solution Fee
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-muted-foreground">
                        {selectedFrequency || 'Fixed Fee'}
                      </span>
                    </div>
                    <span className="font-bold text-primary">
                      {formatCurrency(engagementPricing.calculated_value, engagementPricing.currency_code)}
                    </span>
                  </div>
                </div>
              )}

              {membershipStatus === 'active' && engagementPricing.membership_discount_percentage > 0 && (
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Member discount of {formatPercentage(engagementPricing.membership_discount_percentage)} applied
                  </p>
                </div>
              )}
            </div>
          )}

          {needsFrequencySelection && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Please select a billing frequency for Platform as a Service
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Terms Status */}
        <div className="space-y-2">
          <span className="font-medium text-sm">Terms & Conditions</span>
          
          {membershipStatus === 'active' && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${membershipTermsAccepted ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={membershipTermsAccepted ? 'text-green-600' : 'text-red-600'}>
                Membership Terms {membershipTermsAccepted ? 'Accepted' : 'Required'}
              </span>
            </div>
          )}
          
          {selectedEngagementModel && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${engagementTermsAccepted ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={engagementTermsAccepted ? 'text-green-600' : 'text-red-600'}>
                Engagement Model Terms {engagementTermsAccepted ? 'Accepted' : 'Required'}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          {membershipStatus === 'active' && annualFee > 0 && (
            <Button
              size="lg"
              className="w-full"
              onClick={onProceedToPayment}
              disabled={!membershipTermsAccepted || isProcessing || needsFrequencySelection}
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
            disabled={!canProceedToPayment() || isProcessing || needsFrequencySelection}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Activating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Activate Engagement Model
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>

        {/* Final Notice */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            All fees are as per the master pricing configuration and may be subject to applicable taxes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};