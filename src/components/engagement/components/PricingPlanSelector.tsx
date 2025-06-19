
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PricingPlanSelectorProps {
  selectedPricingPlan: string;
  onPricingPlanChange: (value: string) => void;
}

export const PricingPlanSelector: React.FC<PricingPlanSelectorProps> = ({
  selectedPricingPlan,
  onPricingPlanChange
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-3">Select Pricing Plan</h3>
      <Select value={selectedPricingPlan} onValueChange={onPricingPlanChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Choose your pricing plan" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-md z-50">
          <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
          <SelectItem value="halfyearly">Half-Yearly (6 months)</SelectItem>
          <SelectItem value="annual">Annual (12 months)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
