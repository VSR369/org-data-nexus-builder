
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Users, CreditCard, Target, Zap } from 'lucide-react';

interface PreviewConfirmationCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  selectedTier: string | null;
  selectedEngagementModel: string | null;
  membershipFees: any[];
  onEdit: (step: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const PreviewConfirmationCard: React.FC<PreviewConfirmationCardProps> = ({
  membershipStatus,
  selectedTier,
  selectedEngagementModel,
  membershipFees,
  onEdit,
  onConfirm,
  isProcessing
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="h-5 w-5" />
            Review Your Selections
          </CardTitle>
          <CardDescription className="text-blue-700">
            Please review all your selections before final activation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Selection Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Membership Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Membership</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit('membership_decision')}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={membershipStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {membershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
              </Badge>
              {membershipStatus === 'active' && (
                <div className="text-sm text-green-700">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    <span>Annual: {membershipFees[0]?.annual_currency || 'USD'} {membershipFees[0]?.annual_amount || 990}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tier */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Pricing Tier</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit('tier_selection')}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-100 text-blue-800">
              {selectedTier || 'Not Selected'}
            </Badge>
          </CardContent>
        </Card>

        {/* Engagement Model */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Engagement Model</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit('engagement_model')}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800">
                {selectedEngagementModel || 'Not Selected'}
              </Badge>
              {selectedEngagementModel === 'Marketplace' && (
                <p className="text-xs text-gray-600">
                  Choose General vs Program Managed when creating challenges
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Confirmation */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Ready to Activate Your Enrollment?
              </h3>
            </div>
            <p className="text-sm text-green-700 max-w-md mx-auto">
              Once activated, you'll have full access to the platform with your selected configuration.
            </p>
            <Button 
              onClick={onConfirm}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? 'Activating...' : 'Confirm & Activate Enrollment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
