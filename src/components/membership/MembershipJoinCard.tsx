
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Loader2, DollarSign } from 'lucide-react';
import { MembershipService } from '@/services/MembershipService';
import { useToast } from "@/hooks/use-toast";
import { useUserData } from '@/components/dashboard/UserDataProvider';
import { useMembershipData } from '@/hooks/useMembershipData';

interface MembershipJoinCardProps {
  userId: string;
  membershipStatus: 'active' | 'inactive';
  onMembershipChange: (status: 'active' | 'inactive') => void;
}

const MembershipJoinCard: React.FC<MembershipJoinCardProps> = ({
  userId,
  membershipStatus,
  onMembershipChange
}) => {
  const { toast } = useToast();
  const { userData } = useUserData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  
  // Load membership data from master data
  const { 
    membershipData, 
    countryPricing, 
    loading: membershipLoading, 
    error: membershipError 
  } = useMembershipData(userData.entityType, userData.country, userData.organizationType);

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

  const handleJoinMembership = async () => {
    if (!selectedPlan || !countryPricing) {
      toast({
        title: "Selection Required",
        description: "Please select a membership plan to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      let amount = 0;
      switch (selectedPlan) {
        case 'quarterly':
          amount = countryPricing.quarterlyPrice;
          break;
        case 'halfyearly':
          amount = countryPricing.halfYearlyPrice;
          break;
        case 'annual':
          amount = countryPricing.annualPrice;
          break;
      }

      const membershipPricing = {
        currency: countryPricing.currency,
        amount: amount,
        frequency: selectedPlan
      };
      
      const success = MembershipService.activateMembership(userId, 'Premium', membershipPricing);
      
      if (success) {
        // Save the selected plan details
        const membershipDetails = {
          userId,
          selectedPlan,
          pricing: countryPricing,
          activatedAt: new Date().toISOString(),
          membershipStatus: 'active'
        };
        
        localStorage.setItem('completed_membership_payment', JSON.stringify(membershipDetails));
        
        onMembershipChange('active');
        toast({
          title: "Membership Activated!",
          description: `Welcome to our premium membership. Your ${selectedPlan} plan is now active.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to activate membership. Please try again.",
          variant: "destructive"
        });
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  if (membershipStatus === 'active') {
    return (
      <Card className="shadow-lg border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Membership Active
            <Badge variant="default" className="bg-green-600">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-800">
            Your premium membership is active. Enjoy discounted pricing on all engagement models!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (membershipLoading) {
    return (
      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Loading Membership Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading membership pricing...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (membershipError || !countryPricing) {
    return (
      <Card className="shadow-lg border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-red-600" />
            Membership Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800">
            {membershipError || "Membership pricing is not available for your organization type and country."}
          </p>
        </CardContent>
      </Card>
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
    <Card className="shadow-lg border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Join as Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">
            Become a premium member to unlock discounted pricing and exclusive benefits.
          </p>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Membership Benefits:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 20% discount on all engagement models</li>
              <li>• Priority support</li>
              <li>• Exclusive member features</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Select Membership Plan
            </h4>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
              <div className="grid grid-cols-1 gap-3">
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
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={plan.id} id={plan.id} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{plan.name}</span>
                                  {plan.badge && (
                                    <Badge variant="outline" className="text-xs">
                                      {plan.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{plan.duration}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {formatCurrency(plan.price, countryPricing.currency)}
                              </div>
                              <p className="text-xs text-gray-500">
                                per {plan.id === 'quarterly' ? 'quarter' : plan.id === 'halfyearly' ? '6 months' : 'year'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button 
            onClick={handleJoinMembership}
            disabled={isProcessing || !selectedPlan}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Join as Member
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipJoinCard;
