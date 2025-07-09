import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { getEngagementModelName } from '@/utils/membershipPricingUtils';

interface PaymentButtonProps {
  selectedEngagementModel: string;
  engagementPaymentLoading: boolean;
  onEngagementPayment: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  selectedEngagementModel,
  engagementPaymentLoading,
  onEngagementPayment
}) => {
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