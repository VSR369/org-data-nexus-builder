
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProviderTypeSelectionProps {
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  invalidFields?: Set<string>;
}

const ProviderTypeSelection: React.FC<ProviderTypeSelectionProps> = ({
  providerType,
  onProviderTypeChange,
  invalidFields = new Set()
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Representation *</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Select whether you are registering as an individual or organization
        </p>
      </div>
      
      <RadioGroup 
        value={providerType} 
        onValueChange={onProviderTypeChange}
        className={invalidFields.has('providerType') ? 'border border-destructive rounded-md p-2' : ''}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="font-normal">Individual</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="organization" id="organization" />
          <Label htmlFor="organization" className="font-normal">Organization</Label>
        </div>
      </RadioGroup>
      
      {invalidFields.has('providerType') && (
        <p className="text-sm text-destructive">Please select a representation type</p>
      )}
    </div>
  );
};

export default ProviderTypeSelection;
