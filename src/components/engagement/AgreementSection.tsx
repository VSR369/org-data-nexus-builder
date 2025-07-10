import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";

interface AgreementSectionProps {
  agreementAccepted: boolean;
  onAgreementChange: (accepted: boolean) => void;
  engagementModel: string;
}

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreementAccepted,
  onAgreementChange,
  engagementModel
}) => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded border">
      <Checkbox
        id="agreement-checkbox"
        checked={agreementAccepted}
        onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
      />
      <label 
        htmlFor="agreement-checkbox" 
        className="text-sm cursor-pointer"
      >
        I agree to the Terms and Conditions
      </label>
    </div>
  );
};