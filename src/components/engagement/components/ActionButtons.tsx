
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
  handleEngagementActivation: () => void;
  loading: boolean;
  isActivating: boolean;
  engagementPaymentStatus: 'idle' | 'loading' | 'success' | 'error';
  engagementActivationStatus: 'idle' | 'loading' | 'success' | 'error';
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
  handleEngagementActivation,
  loading,
  isActivating,
  engagementPaymentStatus,
  engagementActivationStatus,
  currentPricing,
  currentAmount
}) => {
  
  const handleActivationClick = () => {
    console.log('🎯 Activation button clicked');
    console.log('📊 Button state:', {
      agreementAccepted,
      loading,
      isActivating,
      engagementActivationStatus,
      currentPricing: !!currentPricing,
      selectedEngagementModel
    });
    
    if (!agreementAccepted) {
      console.warn('⚠️ Terms not accepted');
      return;
    }
    
    if (!currentPricing) {
      console.warn('⚠️ No pricing configuration');
      return;
    }
    
    console.log('✅ All checks passed, calling handleEngagementActivation');
    handleEngagementActivation();
  };

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
        <div className="space-y-2">
          <AgreementSection
            agreementAccepted={agreementAccepted}
            onAgreementChange={setAgreementAccepted}
            engagementModel={selectedEngagementModel}
          />
          <Button
            onClick={handleActivationClick}
            disabled={
              !agreementAccepted || 
              loading || 
              isActivating ||
              engagementActivationStatus === 'loading' ||
              !currentPricing
            }
            className={`w-full transition-all duration-200 ${
              isActivating ? 'bg-blue-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            size="sm"
          >
            {isActivating || engagementActivationStatus === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Activating...
              </>
            ) : (
              'Activate Engagement'
            )}
          </Button>
          
          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-500 mt-1">
            Debug: Agreement={agreementAccepted ? '✓' : '✗'} | 
            Pricing={currentPricing ? '✓' : '✗'} | 
            Loading={isActivating ? '✓' : '✗'}
          </div>
        </div>
      )}

      {engagementPaymentStatus === 'error' && (
        <div className="text-center text-red-600 text-xs bg-red-50 p-2 rounded">
          Payment failed. Please try again.
        </div>
      )}

      {engagementActivationStatus === 'error' && (
        <div className="text-center text-red-600 text-xs bg-red-50 p-2 rounded">
          Activation failed. Please try again.
        </div>
      )}
    </div>
  );
};
