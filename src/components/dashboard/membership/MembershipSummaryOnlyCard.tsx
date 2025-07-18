
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, DollarSign, CheckCircle, Edit, Target, Zap } from 'lucide-react';

interface MembershipSummaryOnlyCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  membershipFees: any[];
  onProceedToTierSelection: () => void;
  currency: string;
  onActivateMembership?: () => void;
  selectedTier?: string | null;
  selectedEngagementModel?: string | null;
  onReviewAndFinalize?: () => void;
  onChangeSelections?: () => void;
}

export const MembershipSummaryOnlyCard: React.FC<MembershipSummaryOnlyCardProps> = ({
  membershipStatus,
  membershipFees,
  onProceedToTierSelection,
  currency,
  onActivateMembership,
  selectedTier,
  selectedEngagementModel,
  onReviewAndFinalize,
  onChangeSelections
}) => {
  const fee = membershipFees?.[0] || { annual_amount: 0 };
  
  // Determine button text and action based on current selections
  const getButtonConfig = () => {
    if (!selectedTier) {
      return {
        text: "Continue to Pricing Tier Selection",
        action: onProceedToTierSelection
      };
    }
    
    if (selectedTier && !selectedEngagementModel) {
      return {
        text: "Continue to Engagement Model Selection",
        action: onProceedToTierSelection
      };
    }
    
    // Both tier and engagement model are selected - show review options
    return null;
  };

  const buttonConfig = getButtonConfig();
  
  return (
    <Card className={membershipStatus === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Membership Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {membershipStatus === 'active' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-green-600">Active Member</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  You are enjoying member benefits including discounts on engagement models
                </p>
              </div>
              <div className="text-right">
                <span className="block text-sm text-gray-500">Annual Membership Fee</span>
                <span className="text-lg font-bold">{currency} {fee.annual_amount}</span>
              </div>
            </div>

            {/* Show Review Card if both tier and engagement model are selected - NO EDIT OPTION for active members */}
            {selectedTier && selectedEngagementModel ? (
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-3">Your Selections Are Ready</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Pricing Tier: {selectedTier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Engagement Model: {selectedEngagementModel}</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Your pricing tier and engagement model are ready for activation.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={onReviewAndFinalize}
                    className="flex-1"
                  >
                    Review & Finalize
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Show navigation button if selections are not complete */
              buttonConfig && (
                <Button onClick={buttonConfig.action} className="w-full">
                  {buttonConfig.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="border-gray-300">Not a Member</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  You're currently not a member. Membership provides discounted pricing.
                </p>
              </div>
              {onActivateMembership && (
                <Button 
                  onClick={onActivateMembership}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <DollarSign className="h-4 w-4" />
                  Become a Member
                </Button>
              )}
            </div>

            {/* Show member benefits */}
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-md">
              <h4 className="text-sm font-medium text-orange-800">Member Benefits:</h4>
              <ul className="text-sm text-orange-700 mt-2 space-y-1 list-disc pl-5">
                <li>Save up to 20% on engagement model fees</li>
                <li>Priority support and faster turnaround times</li>
                <li>Access to exclusive member resources</li>
              </ul>
            </div>

            {/* Show Review Card for non-members with edit options */}
            {selectedTier && selectedEngagementModel ? (
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-3">Your Selections Are Ready</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Pricing Tier: {selectedTier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Engagement Model: {selectedEngagementModel}</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Your pricing tier and engagement model are ready. Consider becoming a member to save on fees, or review your selections.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={onReviewAndFinalize}
                    className="flex-1"
                  >
                    Review & Finalize
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={onChangeSelections}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Change Selections
                  </Button>
                </div>
              </div>
            ) : (
              /* Show navigation button if selections are not complete */
              buttonConfig && (
                <Button onClick={buttonConfig.action} className="w-full">
                  {buttonConfig.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
