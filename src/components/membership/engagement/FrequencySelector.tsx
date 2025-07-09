import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PricingConfig } from '@/types/pricing';
import { getDisplayAmount, formatCurrency } from '@/utils/membershipPricingUtils';

interface FrequencySelectorProps {
  selectedFrequency: string;
  engagementPricing: PricingConfig;
  membershipStatus: string;
  onFrequencyChange: (value: string) => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  selectedFrequency,
  engagementPricing,
  membershipStatus,
  onFrequencyChange
}) => {
  return (
    <RadioGroup 
      value={selectedFrequency || ''} 
      onValueChange={onFrequencyChange}
    >
      <div className="space-y-3">
        {['quarterly', 'half-yearly', 'annual'].map((frequency) => {
          const displayInfo = getDisplayAmount(frequency, engagementPricing, membershipStatus);
          
          return (
            <Label key={frequency} htmlFor={frequency} className="cursor-pointer">
              <div className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent ${
                selectedFrequency === frequency ? 'border-primary bg-primary/5' : ''
              }`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={frequency} id={frequency} />
                  <span className="capitalize">{frequency.replace('-', ' ')}</span>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold">
                    <div className="space-y-1">
                      <div className="text-green-600">
                        {formatCurrency(displayInfo.amount, engagementPricing.currency)}
                      </div>
                      {displayInfo.discountApplied && displayInfo.originalAmount && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatCurrency(displayInfo.originalAmount, engagementPricing.currency)}
                        </div>
                      )}
                      {displayInfo.discountApplied && (
                        <div className="text-xs text-green-600 font-medium">
                          {engagementPricing.discountPercentage}% member discount
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {frequency.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </Label>
          );
        })}
      </div>
    </RadioGroup>
  );
};