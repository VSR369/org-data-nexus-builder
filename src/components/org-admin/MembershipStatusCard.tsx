
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Users, TrendingUp } from 'lucide-react';

interface MembershipStatusCardProps {
  membershipStatus: string;
  pricingTier: string;
  engagementModel: string;
  paymentStatus: string;
}

const MembershipStatusCard: React.FC<MembershipStatusCardProps> = ({
  membershipStatus,
  pricingTier,
  engagementModel,
  paymentStatus
}) => {
  const getMembershipBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'default';
      case 'pending':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Membership & Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Membership Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Membership Status</div>
            <Badge variant={getMembershipBadgeVariant(membershipStatus)}>
              {membershipStatus || 'Not Set'}
            </Badge>
          </div>
        </div>

        {/* Pricing Tier */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Pricing Tier</div>
            <Badge variant="outline">
              <TrendingUp className="h-3 w-3 mr-1" />
              {pricingTier || 'Not Selected'}
            </Badge>
          </div>
        </div>

        {/* Engagement Model */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Engagement Model</div>
            <Badge variant="outline">
              {engagementModel || 'Not Selected'}
            </Badge>
          </div>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Payment Status</div>
            <Badge variant={getPaymentBadgeVariant(paymentStatus)}>
              <CreditCard className="h-3 w-3 mr-1" />
              {paymentStatus || 'Not Set'}
            </Badge>
          </div>
        </div>

        {/* Additional Info */}
        {membershipStatus === 'active' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              ✓ Your organization has an active membership with access to all platform features.
            </p>
          </div>
        )}
        
        {membershipStatus === 'inactive' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              ⚠ Your membership is currently inactive. Contact support for assistance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipStatusCard;
