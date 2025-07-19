
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Users, CreditCard, Target, Zap, ArrowLeft, ChevronRight } from 'lucide-react';

interface PreviewConfirmationCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  selectedTier: string | null;
  selectedEngagementModel: string | null;
  membershipFees: any[];
  tierDetails?: any;
  engagementDetails?: any;
  onEdit: (step: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export const PreviewConfirmationCard: React.FC<PreviewConfirmationCardProps> = ({
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  membershipFees,
  tierDetails,
  engagementDetails,
  onEdit,
  onConfirm,
  onBack,
  isProcessing
}) => {
  const getMembershipFeeDisplay = () => {
    if (membershipStatus !== 'active' || !membershipFees.length) return null;
    const fee = membershipFees[0];
    return {
      amount: fee?.annual_amount || 0,
      currency: fee?.annual_currency || 'USD',
      frequency: 'Annual'
    };
  };

  const membershipFee = getMembershipFeeDisplay();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="h-5 w-5" />
                Review Your Configuration
              </CardTitle>
              <CardDescription className="text-blue-700">
                Please review all your selections before completing the setup
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Terms
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Section 1: Membership Details */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-600" />
              Selected Membership Details
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit('membership_decision')}
              className="flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Membership Status</label>
                <div className="mt-1">
                  <Badge className={membershipStatus === 'active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-300'}>
                    {membershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
                  </Badge>
                </div>
              </div>
              
              {membershipStatus === 'active' && membershipFee && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Membership Fee</label>
                  <div className="mt-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700">
                      {membershipFee.currency} {membershipFee.amount} / {membershipFee.frequency}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Benefits Included</label>
                <div className="mt-1">
                  {membershipStatus === 'active' ? (
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Exclusive member discounts</li>
                      <li>• Priority support access</li>
                      <li>• Premium analytics features</li>
                      <li>• Advanced workflow templates</li>
                    </ul>
                  ) : (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Standard platform access</li>
                      <li>• Basic support (business hours)</li>
                      <li>• Limited analytics features</li>
                      <li>• Standard workflow templates</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Tier Details */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-purple-600" />
              Selected Tier Details
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit('tier_selection')}
              className="flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Pricing Tier</label>
                <div className="mt-1">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                    {selectedTier || 'Not Selected'}
                  </Badge>
                </div>
              </div>
              
              {tierDetails && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cost per Challenge</label>
                    <div className="mt-1 font-semibold text-purple-700">
                      {tierDetails.currency_symbol || '$'}{tierDetails.fixed_charge_per_challenge || 0}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly Challenge Limit</label>
                    <div className="mt-1 font-medium">
                      {tierDetails.monthly_challenge_limit || 'Unlimited'}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-3">
              {tierDetails && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Solutions per Challenge</label>
                    <div className="mt-1 font-medium">
                      {tierDetails.solutions_per_challenge || 1}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Analytics Access</label>
                    <div className="mt-1 font-medium">
                      {tierDetails.analytics_access_name || 'Standard'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Support Level</label>
                    <div className="mt-1 font-medium">
                      {tierDetails.support_service_level || 'Standard'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Engagement Model Details */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-orange-600" />
              Selected Engagement Details
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit('engagement_model_selection')}
              className="flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Engagement Model</label>
                <div className="mt-1">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                    {selectedEngagementModel || 'Not Selected'}
                  </Badge>
                </div>
              </div>
              
              {selectedEngagementModel === 'Marketplace' && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Model Type</label>
                  <div className="mt-1 text-sm text-gray-700">
                    Choose General vs Program Managed when creating challenges
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Key Features</label>
                <div className="mt-1">
                  {selectedEngagementModel === 'Marketplace' ? (
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Access to solution provider network</li>
                      <li>• Flexible engagement options</li>
                      <li>• Competitive bidding process</li>
                      <li>• Quality assurance protocols</li>
                    </ul>
                  ) : selectedEngagementModel === 'Aggregator' ? (
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Curated provider matching</li>
                      <li>• Streamlined engagement process</li>
                      <li>• Quality pre-screening</li>
                      <li>• Dedicated support</li>
                    </ul>
                  ) : (
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Standard engagement features</li>
                      <li>• Basic provider access</li>
                      <li>• Standard support</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Ready to Complete Your Setup?
              </h3>
            </div>
            <p className="text-sm text-green-700 max-w-md mx-auto">
              Once confirmed, your platform will be configured with the selected membership, tier, and engagement model. You can modify these settings later from your dashboard.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button 
                variant="outline"
                onClick={onBack}
                disabled={isProcessing}
              >
                Back to Terms
              </Button>
              <Button 
                onClick={onConfirm}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                size="lg"
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    Confirm & Complete Setup
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
