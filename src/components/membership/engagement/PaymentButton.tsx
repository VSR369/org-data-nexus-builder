import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { getEngagementModelName } from '@/utils/membershipPricingUtils';

interface PaymentButtonProps {
  selectedEngagementModel: string;
  hasPaidEngagement: boolean;
  engagementPaymentLoading: boolean;
  onEngagementPayment: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  selectedEngagementModel,
  hasPaidEngagement,
  engagementPaymentLoading,
  onEngagementPayment
}) => {
  if (hasPaidEngagement) {
    return (
      <div className="text-center py-4">
        <div className="text-green-600 font-semibold mb-2">
          ✅ Engagement Model Already Active
        </div>
        <p className="text-sm text-muted-foreground">
          You have already subscribed to an engagement model.
        </p>
      </div>
    );
  }

  return (
    <Button 
      className="w-full" 
      size="lg"
      onClick={onEngagementPayment}
      disabled={engagementPaymentLoading}
    >
      {engagementPaymentLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Pay & Activate {getEngagementModelName(selectedEngagementModel)}
        </>
      )}
    </Button>
  );
};