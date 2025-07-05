import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Crown, AlertCircle } from 'lucide-react';

interface CountryPricing {
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface MembershipPlansSectionProps {
  membershipLoading: boolean;
  countryPricing: CountryPricing | null;
  hasActiveMembership: boolean;
  selectedMembershipFrequency: 'quarterly' | 'half-yearly' | 'annually';
  onMembershipFrequencyChange: (frequency: 'quarterly' | 'half-yearly' | 'annually') => void;
  onMembershipActivation: () => void;
}

const MembershipPlansSection: React.FC<MembershipPlansSectionProps> = ({
  membershipLoading,
  countryPricing,
  hasActiveMembership,
  selectedMembershipFrequency,
  onMembershipFrequencyChange,
  onMembershipActivation
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-lg">Membership Plans</CardTitle>
        </div>
        {hasActiveMembership && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
        <p className="text-xs text-muted-foreground">Choose your plan to get discounts</p>
      </CardHeader>
      
      <CardContent>
        {membershipLoading ? (
          <div className="text-center py-6">
            <Crown className="h-6 w-6 animate-pulse text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        ) : countryPricing ? (
          <div className="space-y-3">
            <RadioGroup 
              value={selectedMembershipFrequency} 
              onValueChange={(value: string) => onMembershipFrequencyChange(value as 'quarterly' | 'half-yearly' | 'annually')}
              className="space-y-3"
            >
              {/* Quarterly Plan */}
              <div className="p-3 border rounded-lg hover:border-yellow-300 transition-colors bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quarterly" id="membership-quarterly" />
                  <Label htmlFor="membership-quarterly" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-yellow-700 text-sm">Quarterly</div>
                        <div className="text-xs text-muted-foreground">3 months</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-700">{countryPricing.currency} {countryPricing.quarterlyPrice}</div>
                        <div className="text-xs text-muted-foreground">~{countryPricing.currency} {Math.round(countryPricing.quarterlyPrice / 3)}/mo</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
              
              {/* Half-Yearly Plan */}
              <div className="p-3 border rounded-lg hover:border-yellow-300 transition-colors bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="half-yearly" id="membership-half-yearly" />
                  <Label htmlFor="membership-half-yearly" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-yellow-700 text-sm">Half-Yearly</div>
                        <div className="text-xs text-muted-foreground">6 months</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-700">{countryPricing.currency} {countryPricing.halfYearlyPrice}</div>
                        <div className="text-xs text-muted-foreground">~{countryPricing.currency} {Math.round(countryPricing.halfYearlyPrice / 6)}/mo</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
              
              {/* Annual Plan - Best Value */}
              <div className="relative p-3 border-2 border-green-300 bg-gradient-to-r from-green-50 to-white rounded-lg hover:border-green-400 transition-colors">
                <Badge className="absolute -top-1 left-2 bg-green-600 text-white px-2 py-0 text-xs">Best</Badge>
                <div className="flex items-center space-x-2 mt-1">
                  <RadioGroupItem value="annually" id="membership-annually" />
                  <Label htmlFor="membership-annually" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-green-700 text-sm">Annual</div>
                        <div className="text-xs text-muted-foreground">12 months</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-700">{countryPricing.currency} {countryPricing.annualPrice}</div>
                        <div className="text-xs text-green-600 font-medium">~{countryPricing.currency} {Math.round(countryPricing.annualPrice / 12)}/mo</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            
            {selectedMembershipFrequency && !hasActiveMembership && (
              <Button onClick={onMembershipActivation} className="w-full bg-yellow-600 hover:bg-yellow-700 text-sm py-2">
                <Crown className="h-3 w-3 mr-1" />
                Activate {selectedMembershipFrequency}
              </Button>
            )}
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">No membership plans found for your location.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipPlansSection;