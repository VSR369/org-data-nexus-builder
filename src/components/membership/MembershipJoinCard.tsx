
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
      let planDuration = '';
      
      switch (selectedPlan) {
        case 'quarterly':
          amount = countryPricing.quarterlyPrice;
          planDuration = '3 months';
          break;
        case 'halfyearly':
          amount = countryPricing.halfYearlyPrice;
          planDuration = '6 months';
          break;
        case 'annual':
          amount = countryPricing.annualPrice;
          planDuration = '12 months';
          break;
      }

      const membershipPricing = {
        currency: countryPricing.currency,
        amount: amount,
        frequency: selectedPlan,
        duration: planDuration
      };
      
      const success = MembershipService.activateMembership(userId, 'Premium', membershipPricing);
      
      if (success) {
        // Save the complete selected plan details
        const membershipDetails = {
          userId,
          selectedPlan,
          planDuration,
          pricing: {
            ...countryPricing,
            selectedAmount: amount,
            selectedFrequency: selectedPlan
          },
          activatedAt: new Date().toISOString(),
          membershipStatus: 'active',
          country: userData.country,
          organizationType: userData.organizationType,
          entityType: userData.entityType
        };
        
        localStorage.setItem('completed_membership_payment', JSON.stringify(membershipDetails));
        
        console.log('💾 Saved membership details:', membershipDetails);
        
        onMembershipChange('active');
        toast({
          title: "Membership Activated!",
          description: `Welcome to our premium membership. Your ${planDuration} plan is now active.`,
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
      name: 'Quarterly Plan',
      duration: '3 months',
      price: countryPricing.quarterlyPrice,
      badge: null,
      popular: false,
      savings: null
    },
    {
      id: 'halfyearly',
      name: 'Half-Yearly Plan',
      duration: '6 months',
      price: countryPricing.halfYearlyPrice,
      badge: 'Most Popular',
      popular: true,
      savings: countryPricing.quarterlyPrice ? 
        Math.round(((countryPricing.quarterlyPrice * 2) - countryPricing.halfYearlyPrice) / (countryPricing.quarterlyPrice * 2) * 100) : null
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      duration: '12 months',
      price: countryPricing.annualPrice,
      badge: 'Best Value',
      popular: false,
      savings: countryPricing.quarterlyPrice ? 
        Math.round(((countryPricing.quarterlyPrice * 4) - countryPricing.annualPrice) / (countryPricing.quarterlyPrice * 4) * 100) : null
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
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Membership Benefits:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 20% discount on all engagement models</li>
              <li>• Priority support</li>
              <li>• Exclusive member features</li>
              <li>• Access to premium resources</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Select Your Membership Plan
            </h4>
            
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
              {pricingPlans.map((plan) => (
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
                              {formatCurrency(plan.price, countryPricing.currency)}
                            </div>
                            <p className="text-xs text-gray-500">
                              for {plan.duration}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatCurrency(plan.price / (plan.id === 'quarterly' ? 3 : plan.id === 'halfyearly' ? 6 : 12), countryPricing.currency)}/month
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

          {selectedPlan && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Selected Plan Summary:</h5>
              <div className="text-sm text-gray-700">
                <p>Plan: <span className="font-medium">{pricingPlans.find(p => p.id === selectedPlan)?.name}</span></p>
                <p>Duration: <span className="font-medium">{pricingPlans.find(p => p.id === selectedPlan)?.duration}</span></p>
                <p>Total: <span className="font-medium text-lg">{formatCurrency(pricingPlans.find(p => p.id === selectedPlan)?.price || 0, countryPricing.currency)}</span></p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleJoinMembership}
            disabled={isProcessing || !selectedPlan}
            className="w-full py-3 text-lg"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Join as Member
                {selectedPlan && ` - ${formatCurrency(pricingPlans.find(p => p.id === selectedPlan)?.price || 0, countryPricing.currency)}`}
              </>
            )}
          </Button>

          {!selectedPlan && (
            <p className="text-sm text-gray-500 text-center">
              Please select a membership plan to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipJoinCard;
