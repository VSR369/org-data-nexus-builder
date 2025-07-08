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
  submittedMembershipType: string | null;
  onMembershipPayment: () => void;
  onResetPaymentStatus: () => void;
}

export const MembershipPaymentCard: React.FC<MembershipPaymentCardProps> = ({
  membershipType,
  membershipStatus,
  membershipFees,
  membershipPaymentLoading,
  submittedMembershipType,
  onMembershipPayment,
  onResetPaymentStatus
}) => {
  const annualFee = getAnnualMembershipFee(membershipFees);
  
  // Show payment content only when user has submitted their selection
  if (!submittedMembershipType) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Membership Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Please select and submit a membership plan first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle "Not a Member" submission
  if (submittedMembershipType === 'not-a-member') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Membership Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-lg font-semibold mb-2 text-yellow-800">
                You have preferred not to be a member
              </div>
              <div className="text-sm text-yellow-700">
                Standard rates will apply to all engagement models
              </div>
            </div>
            
            {membershipStatus !== 'member_paid' && (
              <div className="space-y-3">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    Change your mind? Upgrade to Annual Membership
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
                    Pay this fee to become a member and unlock member pricing
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
                    `Upgrade to Membership${annualFee ? ` - ${formatCurrency(annualFee.amount, annualFee.currency)}` : ''}`
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle "Annual Membership" submission
  if (submittedMembershipType === 'annual') {
    if (membershipStatus === 'member_paid') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Membership Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-3">
              <div className="text-green-600 font-semibold">
                ✅ Annual Membership Already Active
              </div>
              <p className="text-sm text-muted-foreground">
                You are already a premium member with member pricing benefits
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Membership Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-lg font-bold mb-2">Annual Membership</div>
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
                Unlock member pricing for all engagement models
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
        </CardContent>
      </Card>
    );
  }

  // Fallback
  return (
    <Card className="opacity-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Membership Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Please select a membership option
          </p>
        </div>
      </CardContent>
    </Card>
  );
};