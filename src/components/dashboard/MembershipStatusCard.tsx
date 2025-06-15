
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

interface MembershipStatus {
  status: 'active' | 'inactive';
  plan: string;
  message: string;
  badgeVariant: 'default' | 'secondary';
  icon: typeof CheckCircle | typeof Clock;
  iconColor: string;
}

interface MembershipStatusCardProps {
  membershipStatus: MembershipStatus;
}

const MembershipStatusCard: React.FC<MembershipStatusCardProps> = ({ membershipStatus }) => {
  const IconComponent = membershipStatus.icon;

  return (
    <Card className="shadow-xl border-0 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Membership Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <IconComponent className={`h-6 w-6 ${membershipStatus.iconColor}`} />
            <div>
              <p className="font-medium text-gray-900">{membershipStatus.message}</p>
              {membershipStatus.status === 'active' && (
                <p className="text-sm text-gray-600">
                  Plan: {membershipStatus.plan.charAt(0).toUpperCase() + membershipStatus.plan.slice(1)}
                </p>
              )}
              {membershipStatus.status === 'active' && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Testing Mode: Membership active without payment
                </p>
              )}
            </div>
          </div>
          <Badge variant={membershipStatus.badgeVariant}>
            {membershipStatus.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipStatusCard;
