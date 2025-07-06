import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Users, Code, Headphones, Server } from "lucide-react";
import { useLocalStoragePersistence } from '@/hooks/useLocalStoragePersistence';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { MembershipFeeFixer } from '@/utils/membershipFeeFixer';
import { PricingConfig } from '@/types/pricing';
import { useToast } from "@/hooks/use-toast";

interface MembershipPricingSystemProps {
  organizationType: string;
  entityType: string;
  country: string;
}

interface EngagementModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const MembershipPricingSystem: React.FC<MembershipPricingSystemProps> = ({
  organizationType,
  entityType,
  country
}) => {
  const {
    state,
    loading: stateLoading,
    error: stateError,
    updateMembershipStatus,
    updateMembershipType,
    updateEngagementModel,
    updateFrequency,
    addPaymentRecord,
    updatePaymentRecord
  } = useLocalStoragePersistence();

  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [membershipPaymentLoading, setMembershipPaymentLoading] = useState(false);
  const [engagementPaymentLoading, setEngagementPaymentLoading] = useState(false);
  const { toast } = useToast();

  // Load master data on mount
  useEffect(() => {
    const loadMasterData = () => {
      try {
        // Load pricing configurations
        const configs = PricingDataManager.getAllConfigurations();
        setPricingConfigs(configs);
        console.log('✅ Loaded pricing configs:', configs.length);

        // Load membership fees
        const fees = MembershipFeeFixer.getMembershipFees().filter(fee => 
          fee.country === country && 
          fee.organizationType === organizationType && 
          fee.entityType === entityType
        );
        setMembershipFees(fees);
        console.log('✅ Loaded membership fees:', fees.length);
      } catch (error) {
        console.error('❌ Error loading master data:', error);
        toast({
          variant: "destructive",
          title: "Data Loading Error",
          description: "Failed to load pricing data. Please refresh the page."
        });
      }
    };

    loadMasterData();
  }, [country, organizationType, entityType, toast]);

  // Engagement models with icons
  const engagementModels: EngagementModel[] = [
    {
      id: 'Consulting',
      name: 'Consulting',
      description: 'Expert consultation and advisory services',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'Development',
      name: 'Development',
      description: 'Custom development and implementation services',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'Support',
      name: 'Support',
      description: 'Technical support and maintenance services',
      icon: <Headphones className="w-5 h-5" />
    },
    {
      id: 'Platform as a Service',
      name: 'Platform as a Service',
      description: 'Complete platform infrastructure and services',
      icon: <Server className="w-5 h-5" />
    }
  ];

  // Get membership fee for annual plan
  const getAnnualMembershipFee = () => {
    if (membershipFees.length === 0) return null;
    const fee = membershipFees[0];
    return {
      amount: fee.annualAmount,
      currency: fee.annualCurrency || 'INR'
    };
  };

  // Get pricing for selected engagement model
  const getEngagementPricing = () => {
    if (!state.selected_engagement_model) return null;

    const membershipStatusForConfig = state.membership_status === 'member_paid' ? 'member' : 'not-a-member';
    
    const config = pricingConfigs.find(config => 
      config.country === country &&
      config.organizationType === organizationType &&
      config.engagementModel === state.selected_engagement_model &&
      config.membershipStatus === membershipStatusForConfig
    );

    if (!config) {
      // Try global config
      return pricingConfigs.find(config => 
        (!config.country || config.country === 'Global') &&
        config.organizationType === organizationType &&
        config.engagementModel === state.selected_engagement_model &&
        config.membershipStatus === membershipStatusForConfig
      );
    }

    return config;
  };

  // Format currency display
  const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString()}`;
    }
    return `${currency} ${amount}`;
  };

  // Handle membership payment
  const handleMembershipPayment = async () => {
    const fee = getAnnualMembershipFee();
    if (!fee) return;

    setMembershipPaymentLoading(true);
    
    try {
      // Add payment record
      const paymentId = addPaymentRecord({
        type: 'membership',
        amount: fee.amount,
        currency: fee.currency,
        status: 'pending'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status and membership
      updatePaymentRecord(paymentId as any, { status: 'completed' });
      updateMembershipStatus('member_paid');
      
      toast({
        title: "Payment Successful",
        description: "Your annual membership has been activated!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setMembershipPaymentLoading(false);
    }
  };

  // Handle engagement model payment
  const handleEngagementPayment = async () => {
    const pricing = getEngagementPricing();
    if (!pricing || !state.selected_frequency) return;

    setEngagementPaymentLoading(true);
    
    try {
      const amount = pricing[`${state.selected_frequency}Fee` as keyof PricingConfig] as number;
      
      // Add payment record
      const paymentId = addPaymentRecord({
        type: 'engagement',
        amount,
        currency: pricing.currency || 'INR',
        status: 'pending'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status
      updatePaymentRecord(paymentId as any, { status: 'completed' });
      
      toast({
        title: "Payment Successful",
        description: `Your ${state.selected_engagement_model} plan has been activated!`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again."
      });
    } finally {
      setEngagementPaymentLoading(false);
    }
  };

  if (stateLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading your preferences...</span>
      </div>
    );
  }

  if (stateError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{stateError}</AlertDescription>
      </Alert>
    );
  }

  const annualFee = getAnnualMembershipFee();
  const engagementPricing = getEngagementPricing();
  const isPaaSModel = state.selected_engagement_model === 'Platform as a Service';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Membership & Engagement System</h1>
        <p className="text-muted-foreground">Select your membership plan and engagement model</p>
      </div>

      {/* Current Status */}
      {(state.membership_status !== 'inactive' || state.selected_engagement_model) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={state.membership_status === 'member_paid' ? 'default' : 'secondary'}>
                  {state.membership_status === 'member_paid' ? 'Premium Member' : 
                   state.membership_status === 'active' ? 'Active' : 'Basic'}
                </Badge>
                {state.membership_type && (
                  <Badge variant="outline">{state.membership_type} Plan</Badge>
                )}
              </div>
              {state.selected_engagement_model && (
                <div className="text-sm text-muted-foreground">
                  Engagement Model: {state.selected_engagement_model}
                  {state.selected_frequency && ` (${state.selected_frequency})`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Membership Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={state.membership_type || ''} 
              onValueChange={(value) => updateMembershipType(value as any)}
            >
              <div className="space-y-4">
                <Label htmlFor="monthly" className="cursor-pointer">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <div>
                      <div className="font-medium">Monthly</div>
                      <div className="text-sm text-muted-foreground">Basic access - Month to month</div>
                    </div>
                  </div>
                </Label>

                <Label htmlFor="annual" className="cursor-pointer">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                    <RadioGroupItem value="annual" id="annual" />
                    <div className="flex-1">
                      <div className="font-medium">Annual</div>
                      <div className="text-sm text-muted-foreground">Premium membership - 12 months</div>
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

            {state.membership_type === 'annual' && state.membership_status !== 'member_paid' && (
              <Button 
                className="w-full mt-4" 
                onClick={handleMembershipPayment}
                disabled={membershipPaymentLoading || !annualFee}
              >
                {membershipPaymentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay ${annualFee ? formatCurrency(annualFee.amount, annualFee.currency) : ''}`
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Engagement Models */}
        <Card className={state.membership_type ? '' : 'opacity-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Engagement Models
              {!state.membership_type && (
                <Badge variant="outline" className="text-xs">Select Plan First</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.membership_type ? (
              <RadioGroup 
                value={state.selected_engagement_model || ''} 
                onValueChange={updateEngagementModel}
              >
                <div className="space-y-3">
                  {engagementModels.map((model) => (
                    <Label key={model.id} htmlFor={`model-${model.id}`} className="cursor-pointer">
                      <div className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors ${
                        state.selected_engagement_model === model.id ? 'border-primary bg-primary/5' : ''
                      }`}>
                        <RadioGroupItem value={model.id} id={`model-${model.id}`} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {model.icon}
                            <span className="font-medium">{model.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Select a membership plan first</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing & Payment */}
        <Card className={state.selected_engagement_model ? '' : 'opacity-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Pricing & Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.selected_engagement_model && engagementPricing ? (
              <div className="space-y-4">
                <div className="text-sm text-center p-2 bg-muted rounded">
                  {state.membership_status === 'member_paid' ? 'Member Pricing' : 'Standard Pricing'}
                </div>

                <RadioGroup 
                  value={state.selected_frequency || ''} 
                  onValueChange={(value) => updateFrequency(value as any)}
                >
                  <div className="space-y-3">
                    {['quarterly', 'half-yearly', 'annual'].map((frequency) => {
                      const feeKey = `${frequency}Fee` as keyof PricingConfig;
                      const amount = engagementPricing[feeKey] as number;
                      
                      return (
                        <Label key={frequency} htmlFor={frequency} className="cursor-pointer">
                          <div className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent ${
                            state.selected_frequency === frequency ? 'border-primary bg-primary/5' : ''
                          }`}>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={frequency} id={frequency} />
                              <span className="capitalize">{frequency.replace('-', ' ')}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">
                                {isPaaSModel 
                                  ? formatCurrency(amount, engagementPricing.currency)
                                  : `${amount}%`
                                }
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {isPaaSModel ? frequency.replace('-', ' ') : 'of solution fee'}
                              </div>
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </div>
                </RadioGroup>

                {state.selected_frequency && (
                  <Button 
                    className="w-full" 
                    onClick={handleEngagementPayment}
                    disabled={engagementPaymentLoading}
                  >
                    {engagementPaymentLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      `Activate ${state.selected_engagement_model}`
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Select an engagement model to view pricing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipPricingSystem;