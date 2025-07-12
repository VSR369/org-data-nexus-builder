
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
  onActivateEngagement?: () => void;
  onPayEngagementFee?: () => void;
  activationLoading?: boolean;
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
  currentAmount,
  onActivateEngagement,
  onPayEngagementFee,
  activationLoading = false
}) => {

  return (
    <div className="space-y-4">
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

      {/* Marketplace Models Action Button */}
      {isMarketplace && (
        <Button
          onClick={onActivateEngagement}
          disabled={!agreementAccepted || activationLoading}
          className="w-full"
          size="lg"
        >
          {activationLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Activating...
            </>
          ) : (
            'Activate Engagement'
          )}
        </Button>
      )}

      {/* PaaS Model Action Button */}
      {isPaaS && (
        <Button
          onClick={onPayEngagementFee}
          disabled={!paasAgreementAccepted || !selectedFrequency || activationLoading}
          className="w-full"
          size="lg"
        >
          {activationLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay Fee - ₹${currentAmount?.amount || currentAmount || 0}`
          )}
        </Button>
      )}
    </div>
  );
};
