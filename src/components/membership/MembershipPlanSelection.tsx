import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency, getAnnualMembershipFee } from '@/utils/membershipPricingUtils';

interface MembershipPlanSelectionProps {
  membershipType: string;
  membershipFees: any[];
  onMembershipTypeChange: (value: string) => void;
  onMembershipSubmit: (selectedType: string) => void;
}

export const MembershipPlanSelection: React.FC<MembershipPlanSelectionProps> = ({
  membershipType,
  membershipFees,
  onMembershipTypeChange,
  onMembershipSubmit
}) => {
  const [selectedType, setSelectedType] = useState(membershipType);
  const annualFee = getAnnualMembershipFee(membershipFees);

  const handleSelectionChange = (value: string) => {
    setSelectedType(value);
    onMembershipTypeChange(value);
  };

  const handleSubmit = () => {
    if (selectedType) {
      onMembershipSubmit(selectedType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          Membership Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup 
            value={selectedType || ''} 
            onValueChange={handleSelectionChange}
          >
            <div className="space-y-4">
              <Label htmlFor="not-a-member" className="cursor-pointer">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="not-a-member" id="not-a-member" />
                  <div>
                    <div className="font-medium">Not a Member</div>
                    <div className="text-sm text-muted-foreground">Standard rates apply</div>
                  </div>
                </div>
              </Label>

              <Label htmlFor="annual" className="cursor-pointer">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="annual" id="annual" />
                  <div className="flex-1">
                    <div className="font-medium">Annual Membership</div>
                    <div className="text-sm text-muted-foreground">Get member pricing benefits</div>
                    {annualFee && (
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(annualFee.amount, annualFee.currency)}
                      </div>
                    )}
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          {selectedType && (
            <Button 
              onClick={handleSubmit}
              className="w-full"
              variant="default"
            >
              Submit Selection
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};