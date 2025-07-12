
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AgreementSection } from '../AgreementSection';

interface ActionButtonsProps {
  isPaaS: boolean;
  isMarketplace: boolean;
  selectedFrequency: string | null;
  selectedEngagementModel: string;
  paasAgreementAccepted: boolean;
  setPaasAgreementAccepted: (accepted: boolean) => void;
  agreementAccepted: boolean;
  setAgreementAccepted: (accepted: boolean) => void;
  onEngagementPayment?: () => void;
  loading: boolean;
  engagementPaymentStatus: 'idle' | 'loading' | 'success' | 'error';
  currentPricing: any;
  currentAmount: any;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isPaaS,
  isMarketplace,
  selectedFrequency,
  selectedEngagementModel,
  paasAgreementAccepted,
  setPaasAgreementAccepted,
  agreementAccepted,
  setAgreementAccepted,
  onEngagementPayment,
  loading,
  engagementPaymentStatus,
  currentPricing,
  currentAmount
}) => {

  return (
    <div className="space-y-2">
      {isPaaS && (
        <div className="space-y-2">
          <AgreementSection
            agreementAccepted={paasAgreementAccepted}
            onAgreementChange={setPaasAgreementAccepted}
            engagementModel={selectedEngagementModel}
          />
          <Button
            onClick={onEngagementPayment}
            disabled={
              !selectedFrequency || 
              !paasAgreementAccepted ||
              loading || 
              engagementPaymentStatus === 'loading' ||
              !currentPricing ||
              !currentAmount
            }
            className="w-full"
            size="sm"
          >
            {engagementPaymentStatus === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay ${selectedFrequency ? selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1) : ''} Fee`
            )}
          </Button>
        </div>
      )}

      {isMarketplace && (
        <AgreementSection
          agreementAccepted={agreementAccepted}
          onAgreementChange={setAgreementAccepted}
          engagementModel={selectedEngagementModel}
        />
      )}

      {engagementPaymentStatus === 'error' && (
        <div className="text-center text-red-600 text-xs bg-red-50 p-2 rounded">
          Payment failed. Please try again.
        </div>
      )}

    </div>
  );
};
