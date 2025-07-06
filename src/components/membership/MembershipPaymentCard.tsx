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

  return (
    <Card className={membershipType === 'annual' && membershipStatus !== 'member_paid' ? '' : 'opacity-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Membership Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {membershipType === 'annual' && membershipStatus !== 'member_paid' ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-bold mb-2">Annual Membership</div>
              {annualFee && (
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(annualFee.amount, annualFee.currency)}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                Unlock member pricing for all engagement models
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
                `Pay Membership Fee`
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              {membershipStatus === 'member_paid' ? 'Membership already paid' : 'Select Annual membership to pay'}
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