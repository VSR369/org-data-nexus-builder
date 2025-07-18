import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, DollarSign, Crown, Star, Zap, ArrowRight, AlertCircle } from 'lucide-react';

interface MembershipSummaryCardProps {
  membershipStatus: 'active' | 'inactive';
  membershipFees: any[];
  selectedTier: string | null;
  onTierSelect: (tier: string) => void;
  onProceedToNext: () => void;
  currency?: string;
}

const TIER_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic Tier',
    description: 'Perfect for small organizations getting started',
    icon: CheckCircle,
    color: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-800',
    features: [
      'Up to 5 challenges per month',
      'Basic analytics dashboard',
      'Email support',
      'Standard engagement models'
    ],
    annualPrice: 990
  },
  {
    id: 'standard',
    name: 'Standard Tier',
    description: 'Best value for growing organizations',
    icon: Star,
    color: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    features: [
      'Up to 20 challenges per month',
      'Advanced analytics & reporting',
      'Priority email & chat support',
      'All engagement models available',
      'Custom branding options'
    ],
    annualPrice: 2990,
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium Tier',
    description: 'Ultimate solution for enterprise organizations',
    icon: Crown,
    color: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
    features: [
      'Unlimited challenges',
      'Real-time analytics & insights',
      'Dedicated account manager',
      'Custom engagement models',
      'White-label solutions',
      'API access & integrations'
    ],
    annualPrice: 6990
  }
];

export const MembershipSummaryCard: React.FC<MembershipSummaryCardProps> = ({
  membershipStatus,
  membershipFees,
  selectedTier,
  onTierSelect,
  onProceedToNext,
  currency = 'USD'
}) => {
  const membershipFee = membershipFees[0]?.annual_amount || 990;
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const selectedTierData = TIER_OPTIONS.find(tier => tier.id === selectedTier);
  const totalAnnualCost = membershipStatus === 'active' 
    ? membershipFee + (selectedTierData?.annualPrice || 0)
    : (selectedTierData?.annualPrice || 0);

  return (
    <div className="space-y-6">
      {/* Membership Summary Section */}
      <Card className={`w-full ${membershipStatus === 'active' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {membershipStatus === 'active' ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-green-800">Annual Membership Activated</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <span className="text-orange-800">Limited Access Mode</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {membershipStatus === 'active' 
              ? 'Your annual membership has been activated with full platform access'
              : 'You are continuing with limited access - upgrade anytime to unlock full features'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment Details */}
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <DollarSign className={`h-6 w-6 mx-auto mb-2 ${membershipStatus === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">
                {membershipStatus === 'active' ? `${currency} ${membershipFee}` : 'No Payment'}
              </div>
              <div className="text-sm text-gray-500">
                {membershipStatus === 'active' ? 'Annual Membership Fee' : 'Limited Access'}
              </div>
            </div>

            {/* Start Date */}
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <Calendar className={`h-6 w-6 mx-auto mb-2 ${membershipStatus === 'active' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">
                {startDate.toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {membershipStatus === 'active' ? 'Membership Start' : 'Access Start'}
              </div>
            </div>

            {/* End Date / Status */}
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <Calendar className={`h-6 w-6 mx-auto mb-2 ${membershipStatus === 'active' ? 'text-purple-600' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">
                {membershipStatus === 'active' ? endDate.toLocaleDateString() : 'Ongoing'}
              </div>
              <div className="text-sm text-gray-500">
                {membershipStatus === 'active' ? 'Membership Expires' : 'Limited Access'}
              </div>
            </div>
          </div>

          {membershipStatus === 'active' && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Receipt #RCP-{Date.now().toString().slice(-8)} | Payment Method: Credit Card
                </span>
              </div>
            </div>
          )}

          {membershipStatus === 'inactive' && (
            <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Limited to 2 challenges per month. Upgrade to unlock full features.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tier Selection */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Select Your Pricing Tier
          </CardTitle>
          <CardDescription>
            Choose the tier that best fits your organization's needs • Annual billing only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIER_OPTIONS.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  } ${tier.recommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                  onClick={() => onTierSelect(tier.id)}
                >
                  {tier.recommended && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      Recommended
                    </Badge>
                  )}
                  
                  <div className="text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${tier.color}`} />
                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                    
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {currency} {tier.annualPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        per year • Annual billing
                      </div>
                    </div>
                    
                    <ul className="text-sm space-y-2 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-left">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className="w-full"
                      onClick={() => onTierSelect(tier.id)}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        <>
                          Select {tier.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {selectedTier && (
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Annual Cost Summary</h4>
                <Badge variant="outline">Annual Billing</Badge>
              </div>
              
              <div className="space-y-3">
                {membershipStatus === 'active' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Membership Fee</span>
                    <span className="font-medium">{currency} {membershipFee}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedTierData?.name} (Annual)</span>
                  <span className="font-medium">{currency} {selectedTierData?.annualPrice}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Annual Cost</span>
                  <span className="text-lg font-bold text-primary">{currency} {totalAnnualCost}</span>
                </div>
              </div>
              
              <Button 
                onClick={onProceedToNext}
                className="w-full mt-4"
                disabled={!selectedTier}
              >
                Proceed to Engagement Model Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
