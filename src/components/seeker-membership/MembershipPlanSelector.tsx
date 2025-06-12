
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface MembershipOptions {
  quarterly: { amount: number; currency: string; label: string };
  halfYearly: { amount: number; currency: string; label: string };
  annual: { amount: number; currency: string; label: string };
}

interface MembershipPlanSelectorProps {
  membershipOptions: MembershipOptions | null;
  selectedPlan: string;
  onPlanChange: (value: string) => void;
  selectedEntityType: string;
  membershipFeesLength: number;
}

const MembershipPlanSelector = ({ 
  membershipOptions, 
  selectedPlan, 
  onPlanChange, 
  selectedEntityType,
  membershipFeesLength 
}: MembershipPlanSelectorProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  if (!membershipOptions && selectedEntityType) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          ⚠️ No membership fee configuration found for "{selectedEntityType}". 
          Please contact administrator to set up pricing for this entity type.
        </p>
        <p className="text-sm text-yellow-700 mt-2">
          You may need to configure membership fees in the Master Data Portal first.
        </p>
      </div>
    );
  }

  if (membershipFeesLength === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">
          ❌ No membership fee configurations found in master data. 
          Please set up membership fees in the Master Data Portal before proceeding.
        </p>
        <Link to="/master-data" className="inline-block mt-2">
          <Button variant="outline" size="sm">
            Go to Master Data Portal
          </Button>
        </Link>
      </div>
    );
  }

  if (!membershipOptions) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Membership Plan *</Label>
      <RadioGroup value={selectedPlan} onValueChange={onPlanChange}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(membershipOptions).map(([key, option]) => (
            <div key={key} className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === key 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <RadioGroupItem value={key} id={key} />
                  <Badge variant="outline">{option.label}</Badge>
                </div>
                <div className="text-center">
                  <Label htmlFor={key} className="cursor-pointer">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(option.amount, option.currency)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      per {option.label.toLowerCase()}
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default MembershipPlanSelector;
