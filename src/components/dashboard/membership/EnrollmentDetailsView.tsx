
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
  tierConfiguration: any;
  engagementModelDetails: any;
  activationRecord: any;
  onBack: () => void;
}

export const EnrollmentDetailsView: React.FC<EnrollmentDetailsViewProps> = ({
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  membershipFees,
  engagementModelPricing,
  tierConfiguration,
  engagementModelDetails,
  activationRecord,
  onBack
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString();
  };

  // Get real tier features from database
  const getTierFeatures = () => {
    if (!tierConfiguration) return [];
    
    const features = [];
    
    if (tierConfiguration.monthly_challenge_limit) {
      features.push(`Monthly challenge limit: ${tierConfiguration.monthly_challenge_limit}`);
    } else {
      features.push('Unlimited monthly challenges');
    }
    
    features.push(`Solutions per challenge: ${tierConfiguration.solutions_per_challenge || 'Not specified'}`);
    features.push(`Fixed charge per challenge: ${formatCurrency(tierConfiguration.fixed_charge_per_challenge || 0, tierConfiguration.master_currencies?.code || 'USD')}`);
    features.push(`Overage allowed: ${tierConfiguration.allows_overage ? 'Yes' : 'No'}`);
    
    if (tierConfiguration.master_analytics_access_types) {
      features.push(`Analytics: ${tierConfiguration.master_analytics_access_types.name}`);
    }
    
    if (tierConfiguration.master_support_types) {
      features.push(`Support: ${tierConfiguration.master_support_types.name} (${tierConfiguration.master_support_types.response_time})`);
    }
    
    if (tierConfiguration.master_onboarding_types) {
      features.push(`Onboarding: ${tierConfiguration.master_onboarding_types.name}`);
    }
    
    if (tierConfiguration.master_workflow_templates) {
      features.push(`Workflow templates: ${tierConfiguration.master_workflow_templates.template_count || 1} ${tierConfiguration.master_workflow_templates.name}`);
    }
    
    return features;
  };

  // Get real engagement model features from database
  const getEngagementModelFeatures = () => {
    if (!engagementModelDetails?.description) {
      return ['Model details not available'];
    }
    
    // Split description into feature points if it contains bullet points or multiple sentences
    const description = engagementModelDetails.description;
    const features = description.includes('.') 
      ? description.split('.').filter(f => f.trim().length > 0).map(f => f.trim() + '.')
      : [description];
    
    return features;
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
                <span className="text-sm text-gray-600">
                  {activationRecord?.selected_frequency || 'Annual'} Membership
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Activation Date</label>
              <p className="text-sm text-gray-800">
                {formatDate(activationRecord?.created_at)}
              </p>
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
                      {fee.monthly_amount && (
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(fee.monthly_amount, fee.monthly_currency)}
                          </div>
                          <div className="text-sm text-gray-600">Monthly</div>
                        </div>
                      )}
                      {fee.quarterly_amount && (
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(fee.quarterly_amount, fee.quarterly_currency)}
                          </div>
                          <div className="text-sm text-gray-600">Quarterly</div>
                        </div>
                      )}
                      {fee.half_yearly_amount && (
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(fee.half_yearly_amount, fee.half_yearly_currency)}
                          </div>
                          <div className="text-sm text-gray-600">Half-Yearly</div>
                        </div>
                      )}
                      {fee.annual_amount && (
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(fee.annual_amount, fee.annual_currency)}
                          </div>
                          <div className="text-sm text-gray-600">Annual</div>
                        </div>
                      )}
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
              <p className="text-sm text-gray-800">
                {formatDate(activationRecord?.tier_selected_at)}
              </p>
            </div>
          </div>

          {/* Real Tier Features from Database */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tier Features & Benefits</label>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 gap-2">
                {getTierFeatures().map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real Tier Pricing from Database */}
          {tierConfiguration && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tier Pricing Structure</label>
              <div className="bg-white p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fixed Charge per Challenge:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(tierConfiguration.fixed_charge_per_challenge || 0, tierConfiguration.master_currencies?.code || 'USD')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Challenge Limit:</span>
                      <span className="text-sm font-medium">
                        {tierConfiguration.monthly_challenge_limit || 'Unlimited'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Solutions per Challenge:</span>
                      <span className="text-sm font-medium">
                        {tierConfiguration.solutions_per_challenge || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overage Allowed:</span>
                      <span className="text-sm font-medium">
                        {tierConfiguration.allows_overage ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              <p className="text-sm text-gray-800">
                {formatDate(activationRecord?.engagement_model_selected_at)}
              </p>
            </div>
          </div>

          {/* Real Model Features from Database */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Model Features & Benefits</label>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 gap-2">
                {getEngagementModelFeatures().map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real Model Pricing from Database */}
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

      {/* Real Payment Information from Database */}
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
              <Badge className={activationRecord?.mem_payment_status === 'paid' ? "bg-green-600" : "bg-yellow-600"}>
                {activationRecord?.mem_payment_status === 'paid' ? 'Verified' : activationRecord?.mem_payment_status || 'Pending'}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <p className="text-sm text-gray-800">
                {activationRecord?.mem_payment_method === 'credit_card' ? 'Credit Card' : activationRecord?.mem_payment_method || 'Not specified'}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Amount</label>
              <p className="text-sm text-gray-800">
                {activationRecord?.mem_payment_amount 
                  ? formatCurrency(activationRecord.mem_payment_amount, activationRecord.mem_payment_currency || 'USD')
                  : 'Not available'
                }
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-800">
                  {formatDate(activationRecord?.mem_payment_date)}
                </p>
              </div>
            </div>
            {activationRecord?.mem_receipt_number && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Receipt Number</label>
                <p className="text-sm text-gray-800">{activationRecord.mem_receipt_number}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Billing Frequency</label>
              <p className="text-sm text-gray-800">
                {activationRecord?.selected_frequency || 'Annual'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
