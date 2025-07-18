
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, DollarSign } from 'lucide-react';

interface MembershipSummaryOnlyCardProps {
  membershipStatus: 'active' | 'inactive' | null;
  membershipFees: any[];
  onProceedToTierSelection: () => void;
  currency: string;
  onActivateMembership?: () => void;
}

export const MembershipSummaryOnlyCard: React.FC<MembershipSummaryOnlyCardProps> = ({
  membershipStatus,
  membershipFees,
  onProceedToTierSelection,
  currency,
  onActivateMembership
}) => {
  const fee = membershipFees?.[0] || { annual_amount: 0 };
  
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
            <Button onClick={onProceedToTierSelection} className="w-full">
              Continue to Pricing Tier Selection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-md">
              <h4 className="text-sm font-medium text-orange-800">Member Benefits:</h4>
              <ul className="text-sm text-orange-700 mt-2 space-y-1 list-disc pl-5">
                <li>Save up to 20% on engagement model fees</li>
                <li>Priority support and faster turnaround times</li>
                <li>Access to exclusive member resources</li>
              </ul>
            </div>
            <Button onClick={onProceedToTierSelection} className="w-full">
              Continue without Membership
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
