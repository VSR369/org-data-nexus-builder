
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';

interface MembershipActionSectionProps {
  disabled: boolean;
  selectedPlan?: string;
  onProceed: () => void;
}

export const MembershipActionSection = ({ 
  disabled, 
  selectedPlan, 
  onProceed 
}: MembershipActionSectionProps) => {
  const isDisabled = disabled || !selectedPlan;

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
      <div className="bg-blue-50 rounded-lg p-6">
        {selectedPlan ? (
          <p className="text-sm text-gray-600 mb-4">
            You have selected the <span className="font-semibold capitalize">{selectedPlan}</span> membership plan. 
            Click below to proceed with your membership registration and payment.
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Please select a membership plan above to proceed with your registration.
          </p>
        )}
        
        <Button 
          className="w-full" 
          size="lg"
          disabled={isDisabled}
          onClick={onProceed}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          {selectedPlan ? 'Proceed with Payment' : 'Select a Plan to Continue'}
        </Button>
        
        {isDisabled && !selectedPlan && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Choose your preferred membership plan to continue
          </p>
        )}
      </div>
    </div>
  );
};
