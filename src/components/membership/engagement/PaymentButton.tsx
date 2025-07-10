import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { getEngagementModelName, isMarketplaceModel } from '@/utils/membershipPricingUtils';

interface PaymentButtonProps {
  selectedEngagementModel: string;
  engagementPaymentLoading: boolean;
  onEngagementPayment: () => void;
  onActivateEngagement?: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  selectedEngagementModel,
  engagementPaymentLoading,
  onEngagementPayment,
  onActivateEngagement
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isMarketplace = isMarketplaceModel(selectedEngagementModel);
  
  const handleAction = () => {
    if (isMarketplace && onActivateEngagement) {
      onActivateEngagement();
    } else {
      onEngagementPayment();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms-checkbox"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <label 
          htmlFor="terms-checkbox" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the Terms and Conditions
        </label>
      </div>
      
      <Button 
        className="w-full" 
        size="lg"
        onClick={handleAction}
        disabled={engagementPaymentLoading || !termsAccepted}
      >
        {engagementPaymentLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {isMarketplace ? 'Activating...' : 'Processing Payment...'}
          </>
        ) : (
          <>
            {isMarketplace ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate {getEngagementModelName(selectedEngagementModel)}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay & Activate {getEngagementModelName(selectedEngagementModel)}
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};