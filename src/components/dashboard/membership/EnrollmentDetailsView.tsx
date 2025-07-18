import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, CreditCard, Calendar, Clock, DollarSign, Users, Zap, Settings, Trophy, Shield, Edit } from 'lucide-react';
import { EditTierModal } from './EditTierModal';
import { EditEngagementModelModal } from './EditEngagementModelModal';
import { MembershipActivationModal } from './MembershipActivationModal';

interface EnrollmentDetailsViewProps {
  membershipStatus: string;
  selectedTier: string;
  selectedEngagementModel: string;
  membershipFees: any[];
  engagementModelPricing: any[];
  tierConfiguration: any;
  engagementModelDetails: any;
  activationRecord: any;
  profile: any;
  userId: string;
  onBack: () => void;
  onTierChange?: (tier: string) => void;
  onEngagementModelChange?: (model: string) => void;
  onMembershipActivate?: () => void;
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
  profile,
  userId,
  onBack,
  onTierChange,
  onEngagementModelChange,
  onMembershipActivate
}) => {
  const [showEditTierModal, setShowEditTierModal] = useState(false);
  const [showEditModelModal, setShowEditModelModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    // Handle null, undefined, or empty currency codes
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString();
  };

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

  const getEngagementModelFeatures = () => {
    if (!engagementModelDetails?.description) {
      return ['Model details not available'];
    }
    
    const description = engagementModelDetails.description;
    const features = description.includes('.') 
      ? description.split('.').filter(f => f.trim().length > 0).map(f => f.trim() + '.')
      : [description];
    
    return features;
  };

  const handleTierChange = (tier: string) => {
    if (onTierChange) {
      onTierChange(tier);
    }
  };

  const handleModelChange = (model: string) => {
    if (onEngagementModelChange) {
      onEngagementModelChange(model);
    }
  };

  const handleMembershipActivation = async () => {
    setIsProcessing(true);
    try {
      if (onMembershipActivate) {
        await onMembershipActivate();
      }
      setShowActivationModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const canEditTier = () => {
    // Always allow tier editing - validation will be done in the modal
    return true;
  };

  const canEditEngagementModel = () => {
    // Allow editing if we have tier and user info
    return selectedTier && userId;
  };

  const canActivateMembership = () => {
    // Allow activation if membership is inactive
    return membershipStatus !== 'active';
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Options */}
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

      {/* Edit Actions Bar */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Quick Actions</h3>
              <p className="text-sm text-blue-600">Edit your enrollment settings</p>
            </div>
            <div className="flex gap-2">
              {canActivateMembership() && (
                <Button 
                  onClick={() => setShowActivationModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Activate Membership
                </Button>
              )}
              {canEditTier() && (
                <Button 
                  onClick={() => setShowEditTierModal(true)}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Tier
                </Button>
              )}
              {canEditEngagementModel() && (
                <Button 
                  onClick={() => setShowEditModelModal(true)}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Model
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Edit Modals */}
      <EditTierModal
        isOpen={showEditTierModal}
        onClose={() => setShowEditTierModal(false)}
        currentTier={selectedTier}
        countryName={profile?.country || ''}
        onTierChange={handleTierChange}
      />

      <EditEngagementModelModal
        isOpen={showEditModelModal}
        onClose={() => setShowEditModelModal(false)}
        currentModel={selectedEngagementModel}
        selectedTier={selectedTier}
        userId={userId}
        membershipStatus={membershipStatus}
        profile={profile}
        onModelChange={handleModelChange}
      />

      <MembershipActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        membershipFees={membershipFees}
        currentEngagementPricing={engagementModelPricing}
        onActivate={handleMembershipActivation}
        isProcessing={isProcessing}
      />
    </div>
  );
};
