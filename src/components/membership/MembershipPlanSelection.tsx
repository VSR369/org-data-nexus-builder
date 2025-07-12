import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency, getAnnualMembershipFee } from '@/utils/membershipPricingUtils';

interface MembershipPlanSelectionProps {
  membershipType: string;
  membershipStatus: string;
  membershipFees: any[];
  onMembershipTypeChange: (value: string) => void;
  onMembershipSubmit: (selectedType: string) => void;
}

export const MembershipPlanSelection: React.FC<MembershipPlanSelectionProps> = ({
  membershipType,
  membershipStatus,
  membershipFees,
  onMembershipTypeChange,
  onMembershipSubmit
}) => {
  const annualFee = getAnnualMembershipFee(membershipFees);
  const isPaid = membershipStatus === 'member_paid';

  const handleSelectionChange = (value: string) => {
    // Don't allow changing to "not-a-member" if membership is already paid
    if (isPaid && value === 'not-a-member') {
      return;
    }
    onMembershipTypeChange(value);
    onMembershipSubmit(value);
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
            value={membershipType || ''} 
            onValueChange={handleSelectionChange}
          >
            <div className="space-y-4">
              <Label htmlFor="not-a-member" className={`cursor-pointer ${isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className={`flex items-center space-x-3 p-3 border rounded-lg ${isPaid ? 'bg-gray-100' : 'hover:bg-accent'}`}>
                  <RadioGroupItem 
                    value="not-a-member" 
                    id="not-a-member" 
                    disabled={isPaid}
                  />
                  <div>
                    <div className="font-medium">Not a Member</div>
                    <div className="text-sm text-muted-foreground">
                      {isPaid ? 'Not available (Already a member)' : 'Standard rates apply'}
                    </div>
                  </div>
                </div>
              </Label>

              <Label htmlFor="annual" className="cursor-pointer">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="annual" id="annual" />
                  <div className="flex-1">
                    <div className="font-medium">
                      Annual Membership
                      {isPaid && <span className="ml-2 text-green-600 font-semibold">✅ Active</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isPaid ? 'Your membership is active with member pricing benefits' : 'Get member pricing benefits'}
                    </div>
                    {annualFee && !isPaid && (
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(annualFee.amount, annualFee.currency)}
                      </div>
                    )}
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          
          {/* Show status message if already paid */}
          {isPaid && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">
                Your annual membership is active
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};