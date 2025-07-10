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
    <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg border">
      <Checkbox
        id="agreement-checkbox"
        checked={agreementAccepted}
        onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
        className="mt-1"
      />
      <div className="flex-1">
        <label 
          htmlFor="agreement-checkbox" 
          className="text-sm font-medium leading-relaxed cursor-pointer"
        >
          I agree to the Terms and Conditions for {engagementModel} engagement model
        </label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <CheckSquare className="w-3 h-3" />
          <span>Agreement required to activate engagement</span>
        </div>
      </div>
    </div>
  );
};