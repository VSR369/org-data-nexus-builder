import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { formatCurrency, getAnnualMembershipFee } from '@/utils/membershipPricingUtils';

interface MembershipPaymentCardProps {
  membershipType: string;
  membershipStatus: string;
  membershipFees: any[];
  membershipPaymentLoading: boolean;
  onMembershipPayment: () => void;
  onResetPaymentStatus: () => void;
}

export const MembershipPaymentCard: React.FC<MembershipPaymentCardProps> = ({
  membershipType,
  membershipStatus,
  membershipFees,
  membershipPaymentLoading,
  onMembershipPayment,
  onResetPaymentStatus
}) => {
  const annualFee = getAnnualMembershipFee(membershipFees);
  
  // Show payment option when:
  // 1. User selects "Annual Membership" OR "Not a Member" (so they can upgrade)
  // 2. AND they haven't already paid for membership
  const shouldShowPayment = (membershipType === 'annual' || membershipType === 'not-a-member') && membershipStatus !== 'member_paid';
  
  return (
    <Card className={shouldShowPayment ? '' : 'opacity-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Membership Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shouldShowPayment ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-bold mb-2">
                {membershipType === 'not-a-member' ? 'Upgrade to Annual Membership' : 'Annual Membership'}
              </div>
              {annualFee ? (
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(annualFee.amount, annualFee.currency)}
                </div>
              ) : (
                <div className="text-2xl font-bold text-red-600">
                  Fee not loaded from master data
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                {membershipType === 'not-a-member' 
                  ? 'Pay this fee to become a member and unlock member pricing for all engagement models'
                  : 'Unlock member pricing for all engagement models'
                }
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Amount from master data: {annualFee ? `${annualFee.currency} ${annualFee.amount}` : 'Not loaded'}
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={onMembershipPayment}
              disabled={membershipPaymentLoading || !annualFee}
            >
              {membershipPaymentLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay Membership Fee${annualFee ? ` - ${formatCurrency(annualFee.amount, annualFee.currency)}` : ''}`
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              {membershipStatus === 'member_paid' ? 'Membership already paid' : 'Select a membership option to pay'}
            </p>
            {membershipStatus === 'member_paid' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onResetPaymentStatus}
              >
                Reset Payment Status
              </Button>
            )}
            <div className="text-xs text-gray-400 mt-2">
              Debug: Status = {membershipStatus}, Type = {membershipType}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};