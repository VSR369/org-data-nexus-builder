
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, X, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PricingData {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface MembershipSelectionModalProps {
  countryPricing: PricingData | null;
  userData: {
    userId: string;
    organizationName: string;
    entityType: string;
    country: string;
  };
  onClose: () => void;
  onProceed: (membershipData: any) => void;
}

const MembershipSelectionModal: React.FC<MembershipSelectionModalProps> = ({
  countryPricing,
  userData,
  onClose,
  onProceed
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const { toast } = useToast();

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

  const handlePayMembershipFee = () => {
    if (!selectedPlan || !countryPricing) return;

    const membershipData = {
      userId: userData.userId,
      organizationName: userData.organizationName,
      entityType: userData.entityType,
      country: userData.country,
      selectedPlan,
      pricing: countryPricing,
      selectedAt: new Date().toISOString(),
      paymentStatus: 'paid',
      membershipStatus: 'active',
      paidAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('completed_membership_payment', JSON.stringify(membershipData));
    localStorage.removeItem('pending_membership_registration');
    
    console.log('Membership payment completed:', membershipData);
    
    toast({
      title: "Membership Payment Successful",
      description: `Your ${selectedPlan} membership has been activated successfully!`,
    });
    
    onProceed(membershipData);
  };

  if (!countryPricing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Membership Not Available</CardTitle>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Membership pricing is not available for your organization type and country. 
              Please contact support for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pricingPlans = [
    {
      id: 'quarterly',
      name: 'Quarterly',
      duration: '3 months',
      price: countryPricing.quarterlyPrice,
      badge: null,
      popular: false
    },
    {
      id: 'halfyearly',
      name: 'Half-Yearly',
      duration: '6 months',
      price: countryPricing.halfYearlyPrice,
      badge: 'Most Popular',
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual',
      duration: '12 months',
      price: countryPricing.annualPrice,
      badge: 'Best Value',
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-bold">
                Select Membership Plan
              </CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Organization Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-blue-600">Organization:</span>
                <span className="ml-2 font-medium">{userData.organizationName}</span>
              </div>
              <div>
                <span className="text-blue-600">Country:</span>
                <span className="ml-2 font-medium">{userData.country}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
                              plan.popular ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {plan.badge}
                            </Badge>
                          )}
                          <div className="flex items-center justify-center gap-2">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                          </div>
                          <p className="text-sm text-gray-600">{plan.duration}</p>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            {formatCurrency(plan.price, countryPricing.currency)}
                          </div>
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
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handlePayMembershipFee}
              disabled={!selectedPlan}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Pay Membership Fee
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipSelectionModal;
