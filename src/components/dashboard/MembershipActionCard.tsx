
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';

interface MembershipStatus {
  status: 'active' | 'inactive';
}

interface MembershipActionCardProps {
  membershipStatus: MembershipStatus;
  onJoinAsMember: () => void;
  showLoginWarning: boolean;
}

const MembershipActionCard: React.FC<MembershipActionCardProps> = ({
  membershipStatus,
  onJoinAsMember,
  showLoginWarning
}) => {
  return (
    <Card className="shadow-xl border-0 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-green-600" />
          Membership
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onJoinAsMember}
          className="w-full h-16 flex items-center justify-center gap-3 text-lg"
          disabled={showLoginWarning}
          variant={membershipStatus.status === 'active' ? 'outline' : 'default'}
        >
          <CreditCard className="h-6 w-6" />
          {membershipStatus.status === 'active' ? 'Manage Membership' : 'Join as Member'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembershipActionCard;
