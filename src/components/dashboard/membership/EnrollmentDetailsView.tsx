import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, CreditCard, Calendar, Clock, DollarSign, Users, Zap, Settings, Trophy, Shield } from 'lucide-react';

interface EnrollmentDetailsViewProps {
  membershipStatus: string;
  selectedTier: string;
  selectedEngagementModel: string;
  membershipFees: any[];
  engagementModelPricing: any[];
  onBack: () => void;
}

export const EnrollmentDetailsView: React.FC<EnrollmentDetailsViewProps> = ({
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  membershipFees,
  engagementModelPricing,
  onBack
}) => {
  const getTierFeatures = (tier: string) => {
    const features = {
      'standard': [
        'Up to 3 concurrent challenges',
        'Basic analytics dashboard',
        'Email support (24-48 hours)',
        'Standard onboarding process',
        'Basic workflow templates',
        'Monthly challenge limit: 10'
      ],
      'premium': [
        'Up to 8 concurrent challenges',
        'Advanced analytics dashboard',
        'Priority email support (12-24 hours)',
        'Enhanced onboarding with dedicated support',
        'Advanced workflow templates',
        'Monthly challenge limit: 25',
        'Custom reporting features'
      ],
      'enterprise': [
        'Unlimited concurrent challenges',
        'Full analytics suite with custom dashboards',
        'Phone & email support (4-8 hours)',
        'White-glove onboarding experience',
        'Custom workflow templates',
        'No monthly challenge limits',
        'Advanced reporting & analytics',
        'Dedicated account manager',
        'Custom integrations available'
      ]
    };
    return features[tier.toLowerCase()] || [];
  };

  const getEngagementModelFeatures = (model: string) => {
    const features = {
      'marketplace': [
        'Solution providers compete for your challenges',
        'Competitive pricing through bidding',
        'Quality assurance through provider ratings',
        'Flexible engagement terms',
        'Multi-provider comparison tools'
      ],
      'aggregator': [
        'Curated network of pre-vetted solution providers',
        'Bundled service packages',
        'Streamlined procurement process',
        'Volume discounts available',
        'Simplified vendor management'
      ],
      'platform as a service': [
        'Self-service platform access',
        'Direct provider collaboration tools',
        'Automated matching algorithms',
        'Real-time project tracking',
        'Integrated communication suite'
      ]
    };
    return features[model.toLowerCase()] || [];
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summary
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-green-800">Enrollment Details</h2>
            <p className="text-green-600">Complete overview of your activated enrollment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <Badge className="bg-green-600">Activated</Badge>
        </div>
      </div>

      {/* Membership Details */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Membership Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">{membershipStatus === 'active' ? 'Active' : 'Inactive'}</Badge>
                <span className="text-sm text-gray-600">Annual Membership</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Activation Date</label>
              <p className="text-sm text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Membership Benefits</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">Platform fee discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">Priority support access</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="text-sm">Premium features access</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-sm">Enhanced analytics</span>
              </div>
            </div>
          </div>

          {/* Membership Fees */}
          {membershipFees.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Membership Fees</label>
              <div className="bg-white p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {membershipFees.map((fee, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        {fee.monthly_amount && formatCurrency(fee.monthly_amount, fee.monthly_currency)}
                      </div>
                      <div className="text-sm text-gray-600">Monthly</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tier Details */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Pricing Tier: {selectedTier}
          </CardTitle>
          <CardDescription>
            Your selected pricing tier determines your platform access and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tier Level</label>
              <Badge className="bg-blue-600">{selectedTier}</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Selection Date</label>
              <p className="text-sm text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Tier Features */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tier Features & Benefits</label>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 gap-2">
                {getTierFeatures(selectedTier).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tier Pricing */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tier Pricing Structure</label>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fixed Charge per Challenge:</span>
                    <span className="text-sm font-medium">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Challenge Limit:</span>
                    <span className="text-sm font-medium">10</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Solutions per Challenge:</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overage Allowed:</span>
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Model Details */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Engagement Model: {selectedEngagementModel}
          </CardTitle>
          <CardDescription>
            Your selected engagement model defines how you interact with solution providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model Type</label>
              <Badge className="bg-purple-600">{selectedEngagementModel}</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Selection Date</label>
              <p className="text-sm text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Model Features */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Model Features & Benefits</label>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 gap-2">
                {getEngagementModelFeatures(selectedEngagementModel).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Pricing */}
          {engagementModelPricing.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model Pricing Structure</label>
              <div className="bg-white p-4 rounded-lg border">
                <div className="grid grid-cols-1 gap-4">
                  {engagementModelPricing.map((pricing, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{pricing.config_name}</span>
                        <span className="text-lg font-bold text-purple-600">
                          {formatCurrency(pricing.calculated_value, pricing.currency_code)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Base: {formatCurrency(pricing.base_value, pricing.currency_code)}
                        {pricing.membership_discount > 0 && (
                          <span className="text-green-600 ml-2">
                            ({pricing.membership_discount}% member discount applied)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Status</label>
              <Badge className="bg-green-600">Verified</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <p className="text-sm text-gray-800">Credit Card (**** 4567)</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Next Billing Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-800">
                  {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Billing Frequency</label>
              <p className="text-sm text-gray-800">Annual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};