import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Rocket, 
  Star, 
  CreditCard, 
  Users, 
  Clock,
  Award,
  Loader2
} from 'lucide-react';

interface ActivationSummaryCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  selectedTier: string | null;
  selectedEngagementModel: string | null;
  membershipFees: any[];
  pricingData: any[];
  paymentStatus: string;
  isProcessing: boolean;
  onActivate: () => void;
  canActivate: boolean;
}

export const ActivationSummaryCard: React.FC<ActivationSummaryCardProps> = ({
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  membershipFees,
  pricingData,
  paymentStatus,
  isProcessing,
  onActivate,
  canActivate
}) => {
  const membershipFee = membershipFees[0];
  const currency = membershipFee?.annual_currency || 'USD';
  const annualFee = membershipFee?.annual_amount || 990;

  const getTierDisplayName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1) + ' Tier';
  };

  const getEngagementDisplayName = (model: string) => {
    return model.charAt(0).toUpperCase() + model.slice(1);
  };

  const getTierPrice = (tier: string) => {
    const prices = {
      basic: 99,
      standard: 299,
      premium: 699
    };
    return prices[tier as keyof typeof prices] || 99;
  };

  if (!membershipStatus || !selectedTier || !selectedEngagementModel) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-gray-400" />
            Activation Summary
          </CardTitle>
          <CardDescription>
            Complete all steps above to see your activation summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Complete the previous steps to continue with activation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Ready for Activation
        </CardTitle>
        <CardDescription>
          Review your selections and activate your membership
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Selection Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Membership</span>
              </div>
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {membershipStatus === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <div className="text-xs text-gray-600">
                  Annual: {currency} {annualFee}
                </div>
                <div className="text-xs text-gray-600">
                  Status: {paymentStatus === 'success' ? 'Paid' : 'Pending'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Pricing Tier</span>
              </div>
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {getTierDisplayName(selectedTier)}
                </Badge>
                <div className="text-xs text-gray-600">
                  Monthly: {currency} {getTierPrice(selectedTier)}
                </div>
                <div className="text-xs text-gray-600">
                  Features included
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-sm">Engagement Model</span>
              </div>
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {getEngagementDisplayName(selectedEngagementModel)}
                </Badge>
                <div className="text-xs text-gray-600">
                  Full access enabled
                </div>
                <div className="text-xs text-gray-600">
                  All features included
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Your Benefits Include:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Full platform access',
                'Priority customer support',
                'Advanced analytics dashboard',
                'Custom branding options',
                'API access and integrations',
                'Dedicated account manager'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activation Status */}
          {paymentStatus === 'success' && canActivate ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">Ready to Activate</h3>
                <p className="text-sm text-green-700">
                  All requirements met. Click below to activate your membership.
                </p>
              </div>
              
              <Button
                onClick={onActivate}
                disabled={isProcessing}
                size="lg"
                className="w-full md:w-auto px-8 h-12 text-lg bg-gradient-to-r from-primary to-primary/80"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Activating Your Membership...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Activate Membership
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-medium text-yellow-800 mb-1">Waiting for Payment</h3>
              <p className="text-sm text-yellow-700">
                Complete your membership payment to proceed with activation.
              </p>
            </div>
          )}

          {/* Terms Note */}
          <div className="text-xs text-gray-500 text-center">
            By activating your membership, you agree to our Terms of Service and Privacy Policy.
            You can modify your plan or cancel at any time from your account settings.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};