
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Check, Users, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface PricingData {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface MembershipConfig {
  organizationType: string;
  marketplaceFee: number;
  aggregatorFee: number;
  marketplacePlusAggregatorFee: number;
  internalPaasPricing: PricingData[];
}

interface MembershipPricingSectionProps {
  membershipData: MembershipConfig;
  countryPricing: PricingData;
  selectedPlan?: string;
  onPlanSelect: (plan: string) => void;
}

export const MembershipPricingSection = ({ 
  membershipData, 
  countryPricing,
  selectedPlan,
  onPlanSelect
}: MembershipPricingSectionProps) => {
  const [membershipType, setMembershipType] = useState<'member' | 'non-member'>('member');

  // Calculate pricing based on membership type
  const getPricing = (basePrice: number) => {
    // Members get a 20% discount, non-members pay full price
    return membershipType === 'member' ? Math.round(basePrice * 0.8) : basePrice;
  };

  const pricingPlans = [
    {
      id: 'quarterly',
      name: 'Quarterly',
      duration: '3 months',
      price: getPricing(countryPricing.quarterlyPrice),
      originalPrice: countryPricing.quarterlyPrice,
      badge: null,
      popular: false
    },
    {
      id: 'halfyearly',
      name: 'Half-Yearly',
      duration: '6 months',
      price: getPricing(countryPricing.halfYearlyPrice),
      originalPrice: countryPricing.halfYearlyPrice,
      badge: 'Popular',
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual',
      duration: '12 months',
      price: getPricing(countryPricing.annualPrice),
      originalPrice: countryPricing.annualPrice,
      badge: 'Best Value',
      popular: false
    }
  ];

  return (
    <div className="border-t pt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-green-600" />
        Select Membership Plan
      </h2>

      {/* Membership Type Selection */}
      <Card className="mb-6 bg-blue-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membership Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={membershipType}
            onValueChange={(value: 'member' | 'non-member') => setMembershipType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select membership type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span>Member (20% Discount)</span>
                </div>
              </SelectItem>
              <SelectItem value="non-member">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span>Non-Member (Standard Pricing)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {membershipType === 'member' && (
            <p className="text-sm text-green-700 mt-2 flex items-center gap-1">
              <Check className="h-4 w-4" />
              You're getting a 20% discount on all plans!
            </p>
          )}
        </CardContent>
      </Card>
      
      <RadioGroup value={selectedPlan} onValueChange={onPlanSelect} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="relative">
              <Label htmlFor={plan.id} className="cursor-pointer">
                <Card className={`border-2 transition-all hover:shadow-md ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : plan.popular 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200'
                }`}>
                  <CardHeader className="text-center relative">
                    {plan.badge && (
                      <span className={`absolute -top-3 left-1/2 transform -translate-x-1/2 inline-block text-xs px-3 py-1 rounded-full ${
                        plan.popular ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <RadioGroupItem value={plan.id} id={plan.id} />
                      <CardTitle className={`text-lg ${
                        plan.popular ? 'text-green-600' : selectedPlan === plan.id ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {plan.name}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-gray-600">{plan.duration}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {countryPricing.currency} {plan.price.toLocaleString()}
                    </div>
                    
                    {/* Show original price with strikethrough for members */}
                    {membershipType === 'member' && plan.price !== plan.originalPrice && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="line-through">
                          {countryPricing.currency} {plan.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-green-600 ml-2 font-medium">
                          Save {countryPricing.currency} {(plan.originalPrice - plan.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600">
                      per {plan.id === 'quarterly' ? 'quarter' : plan.id === 'halfyearly' ? '6 months' : 'year'}
                    </p>
                    {selectedPlan === plan.id && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-blue-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {/* Additional Fees Information */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Marketplace Fee</p>
              <p className="text-blue-700 font-semibold">{membershipData.marketplaceFee}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Aggregator Fee</p>
              <p className="text-blue-700 font-semibold">{membershipData.aggregatorFee}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Combined Fee</p>
              <p className="text-blue-700 font-semibold">{membershipData.marketplacePlusAggregatorFee}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
