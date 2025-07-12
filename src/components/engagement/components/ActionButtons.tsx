
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
  loading: boolean;
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
  loading,
  currentPricing,
  currentAmount
}) => {

  return (
    <div className="space-y-2">
      {isPaaS && (
        <AgreementSection
          agreementAccepted={paasAgreementAccepted}
          onAgreementChange={setPaasAgreementAccepted}
          engagementModel={selectedEngagementModel}
        />
      )}

      {isMarketplace && (
        <AgreementSection
          agreementAccepted={agreementAccepted}
          onAgreementChange={setAgreementAccepted}
          engagementModel={selectedEngagementModel}
        />
      )}
    </div>
  );
};
