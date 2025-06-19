
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DollarSign, AlertTriangle } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  currency: string;
  badge: string | null;
  popular: boolean;
  savings: number | null;
}

interface MembershipPricingPlansProps {
  pricingPlans: PricingPlan[];
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
}

const MembershipPricingPlans: React.FC<MembershipPricingPlansProps> = ({
  pricingPlans,
  selectedPlan,
  onPlanSelect
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  const validPricingPlans = pricingPlans.filter(plan => plan.price > 0);

  if (validPricingPlans.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="font-medium text-yellow-800">No Valid Pricing Plans</span>
        </div>
        <p className="text-sm text-yellow-700">
          All pricing plans have invalid amounts (0 or negative). Please check your master data configuration.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        Select Your Membership Plan
      </h4>
      
      <RadioGroup value={selectedPlan} onValueChange={onPlanSelect} className="space-y-4">
        {validPricingPlans.map((plan) => (
          <div key={plan.id} className="relative">
            <Label htmlFor={plan.id} className="cursor-pointer">
              <Card className={`border-2 transition-all hover:shadow-md ${
                selectedPlan === plan.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : plan.popular 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">{plan.name}</span>
                          {plan.badge && (
                            <Badge variant={plan.popular ? "default" : "outline"} className="text-xs">
                              {plan.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{plan.duration}</p>
                        {plan.savings && (
                          <p className="text-xs text-green-600 font-medium">
                            Save {plan.savings}% compared to quarterly
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(plan.price, plan.currency)}
                      </div>
                      <p className="text-xs text-gray-500">
                        for {plan.duration}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatCurrency(plan.price / (plan.id === 'quarterly' ? 3 : plan.id === 'halfyearly' ? 6 : 12), plan.currency)}/month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MembershipPricingPlans;
