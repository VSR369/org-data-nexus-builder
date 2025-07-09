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

  // Handle "Not a Member" submission - Show warning message with upgrade option
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
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-lg font-semibold mb-3 text-yellow-800">
              ⚠️ You have selected not to be a member. You will miss the discounts.
            </div>
            <div className="text-sm text-yellow-700">
              Pay annual membership and avail discounts while getting solutions using CoInnovator platform.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle "Annual Membership" submission
  if (submittedMembershipType === 'annual') {
    // Always show payment form when user submits selection
    // "Already Active" state will be handled by parent component after payment completion
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
            {/* Success message for selecting annual membership */}
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-lg font-semibold mb-2 text-green-800">
                ✅ You have selected to be a member. Thank you, you will avail discounts.
              </div>
            </div>
            
            {/* Payment details */}
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
            
            {/* Payment button */}
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

  // Default state - no selection submitted yet
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
};