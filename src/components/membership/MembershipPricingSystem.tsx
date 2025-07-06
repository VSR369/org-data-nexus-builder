import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Users, Code, Headphones, Server, CreditCard, Wallet } from "lucide-react";
import { useLocalStoragePersistence } from '@/hooks/useLocalStoragePersistence';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { MembershipFeeFixer } from '@/utils/membershipFeeFixer';
import { engagementModelsDataManager } from '@/components/master-data/engagement-models/engagementModelsDataManager';
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
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
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
        console.log('📊 Raw pricing configs:', configs);
        console.log('📊 Pricing configs details:', configs.map(c => ({
          id: c.id,
          country: c.country,
          orgType: c.organizationType,
          engagementModel: c.engagementModel,
          membershipStatus: c.membershipStatus,
          quarterly: c.quarterlyFee,
          halfYearly: c.halfYearlyFee,
          annual: c.annualFee,
          fullObject: c
        })));
        
        // Force initialization if no configs loaded or configs have undefined values
        if (!configs || configs.length === 0 || configs.some(c => !c.quarterlyFee && !c.halfYearlyFee && !c.annualFee)) {
          console.log('🔧 No valid pricing configs found, forcing default data load...');
          const currentMode = localStorage.getItem('master_data_mode');
          console.log('📋 Current master data mode:', currentMode);
          
          // Temporarily force mixed mode to get defaults
          console.log('⚠️ Loading default pricing configurations...');
          localStorage.setItem('master_data_mode', 'mixed');
          
          // Clear any existing invalid data
          localStorage.removeItem('master_data_pricing_configs');
          localStorage.removeItem('custom_pricing');
          
          const defaultConfigs = PricingDataManager.getAllConfigurations();
          localStorage.setItem('master_data_mode', currentMode || 'custom_only'); // Restore mode
          
          setPricingConfigs(defaultConfigs);
          console.log('✅ Loaded default pricing configs:', defaultConfigs.length);
          console.log('🔍 Default config sample:', defaultConfigs[0]);
        }

        // Load membership fees
        const fees = MembershipFeeFixer.getMembershipFees().filter(fee => 
          fee.country === country && 
          fee.organizationType === organizationType && 
          fee.entityType === entityType
        );
        setMembershipFees(fees);
        console.log('✅ Loaded membership fees:', fees.length);

        // Load engagement models from master data
        const loadedEngagementModels = engagementModelsDataManager.loadData();
        const modelsWithIcons: EngagementModel[] = loadedEngagementModels.map(model => ({
          id: model.id,
          name: model.name,
          description: model.description || `${model.name} services`,
          icon: getEngagementModelIcon(model.name)
        }));
        setEngagementModels(modelsWithIcons);
        console.log('✅ Loaded engagement models:', modelsWithIcons.length);
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

  // Get icon for engagement model
  const getEngagementModelIcon = (modelName: string): React.ReactNode => {
    const name = modelName.toLowerCase();
    if (name.includes('consulting')) return <Users className="w-5 h-5" />;
    if (name.includes('development')) return <Code className="w-5 h-5" />;
    if (name.includes('support')) return <Headphones className="w-5 h-5" />;
    if (name.includes('platform') || name.includes('paas')) return <Server className="w-5 h-5" />;
    return <Users className="w-5 h-5" />;
  };

  // Get membership fee for annual plan
  const getAnnualMembershipFee = () => {
    if (membershipFees.length === 0) return null;
    const fee = membershipFees[0];
    return {
      amount: fee.annualAmount,
      currency: fee.annualCurrency || 'INR'
    };
  };

  // Map engagement model IDs to display names used in pricing configs
  const getEngagementModelName = (modelId: string): string => {
    const modelMap: Record<string, string> = {
      'marketplace': 'Market Place',
      'aggregator': 'Aggregator', 
      'marketplace-aggregator': 'Market Place & Aggregator',
      'platform-service': 'Platform as a Service'
    };
    return modelMap[modelId] || modelId;
  };

  // Get pricing for selected engagement model with proper discount handling
  const getEngagementPricing = () => {
    if (!state.selected_engagement_model) return null;

    // Check if membership payment is actually paid
    const isMembershipPaid = state.membership_status === 'member_paid';
    const membershipStatusForConfig = isMembershipPaid ? 'member' : 'not-a-member';
    
    // Get the proper engagement model name for pricing lookup
    const engagementModelName = getEngagementModelName(state.selected_engagement_model);
    
    console.log('🔍 Looking for pricing config:', {
      country,
      organizationType, 
      engagementModel: engagementModelName,
      membershipStatus: membershipStatusForConfig,
      membershipPaid: isMembershipPaid,
      selectedModelId: state.selected_engagement_model
    });

    // First find the base config for this engagement model
    let baseConfig = pricingConfigs.find(config => 
      config.country === country &&
      config.organizationType === organizationType &&
      config.engagementModel === engagementModelName
    );

    if (!baseConfig) {
      // Try with normalized country names
      const normalizedCountry = country === 'United States' ? 'IN' : country;
      baseConfig = pricingConfigs.find(config => 
        config.country === normalizedCountry &&
        config.organizationType === organizationType &&
        config.engagementModel === engagementModelName
      );
    }

    if (!baseConfig) {
      // Try global config without country restriction
      baseConfig = pricingConfigs.find(config => 
        (!config.country || config.country === 'Global' || config.country === 'IN') &&
        config.organizationType === organizationType &&
        config.engagementModel === engagementModelName
      );
    }

    if (!baseConfig) {
      // Final fallback - any config with matching engagement model
      baseConfig = pricingConfigs.find(config => 
        config.engagementModel === engagementModelName
      );
    }

    if (!baseConfig) {
      console.log('❌ No base config found for engagement model:', engagementModelName);
      return null;
    }

    // Create the final config based on membership payment status
    let finalConfig;
    if (isMembershipPaid) {
      // Membership is paid - apply member pricing with discount
      finalConfig = {
        ...baseConfig,
        membershipStatus: 'member',
        // Keep the discount percentage from base config for members
        discountPercentage: baseConfig.discountPercentage || 0
      };
      console.log('✅ Using member pricing with discount:', finalConfig.discountPercentage + '%');
    } else {
      // Membership not paid - use regular pricing without discount
      finalConfig = {
        ...baseConfig,
        membershipStatus: 'not-a-member',
        discountPercentage: 0 // No discount for non-members
      };
      console.log('✅ Using regular pricing without discount');
    }

    console.log('✅ Final pricing config:', finalConfig);
    return finalConfig;
  };

  // Calculate discounted price for members
  const calculateDiscountedPrice = (baseAmount: number, discountPercentage: number): number => {
    if (!discountPercentage || discountPercentage === 0) return baseAmount;
    return Math.round(baseAmount * (1 - discountPercentage / 100));
  };

  // Get display amount with proper discount application
  const getDisplayAmount = (frequency: string, pricing: PricingConfig): { amount: number; originalAmount?: number; discountApplied: boolean } => {
    const feeKey = frequency === 'half-yearly' ? 'halfYearlyFee' : `${frequency}Fee` as keyof PricingConfig;
    const baseAmount = pricing[feeKey] as number;
    
    if (state.membership_status === 'member_paid' && pricing.discountPercentage) {
      const discountedAmount = calculateDiscountedPrice(baseAmount, pricing.discountPercentage);
      return {
        amount: discountedAmount,
        originalAmount: baseAmount,
        discountApplied: true
      };
    }
    
    return {
      amount: baseAmount,
      discountApplied: false
    };
  };
  const formatCurrency = (amount: number | undefined, currency: string = 'INR'): string => {
    // Handle undefined or null amounts
    if (amount === undefined || amount === null || isNaN(amount)) {
      console.warn('⚠️ formatCurrency: Invalid amount:', amount);
      return 'Contact for pricing';
    }
    
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
      const paymentRecord = addPaymentRecord({
        type: 'membership',
        amount: fee.amount,
        currency: fee.currency,
        status: 'pending'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment record to completed
      updatePaymentRecord(paymentRecord.id, { status: 'completed' });
      
      // Update membership status to paid
      updateMembershipStatus('member_paid');
      
      toast({
        title: "Payment Successful",
        description: "Your annual membership has been activated! You can now see member pricing for engagement models."
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

  // Get currently paid engagement model from payment records
  const getPaidEngagementModel = () => {
    if (!state.payment_records) return null;
    
    const paidEngagement = state.payment_records.find(record => 
      record.type === 'engagement' && record.status === 'completed'
    );
    
    // For now, we'll check if there's any completed engagement payment
    // In a real system, you'd store the engagement model ID in the payment record
    return paidEngagement ? 'existing' : null;
  };

  // Handle engagement model payment
  const handleEngagementPayment = async () => {
    const pricing = getEngagementPricing();
    if (!pricing || !state.selected_frequency) return;

    setEngagementPaymentLoading(true);
    
    try {
      // Get the actual display amount (which includes discount calculation)
      const displayInfo = getDisplayAmount(state.selected_frequency, pricing);
      const paymentAmount = displayInfo.amount; // Use the calculated amount (discounted if applicable)
      
      // Create comprehensive payment information for logging
      const paymentDetails = {
        engagementModel: state.selected_engagement_model,
        engagementModelName: getEngagementModelName(state.selected_engagement_model),
        billingFrequency: state.selected_frequency,
        amount: paymentAmount,
        currency: pricing.currency || 'INR',
        originalAmount: displayInfo.originalAmount,
        discountApplied: displayInfo.discountApplied,
        discountPercentage: displayInfo.discountApplied ? pricing.discountPercentage : 0,
        membershipStatus: state.membership_status,
        organizationType: organizationType,
        entityType: entityType,
        country: country,
        isPaaSModel: isPaaSModel,
        pricingConfig: {
          id: pricing.id,
          quarterlyFee: pricing.quarterlyFee,
          halfYearlyFee: pricing.halfYearlyFee,
          annualFee: pricing.annualFee
        },
        timestamp: new Date().toISOString()
      };
      
      // Log comprehensive payment information before processing
      console.log('💳 Starting Engagement Payment:', paymentDetails);
      
      // Create basic payment record (only supported fields)
      const paymentRecord = addPaymentRecord({
        type: 'engagement',
        amount: paymentAmount,
        currency: pricing.currency || 'INR',
        status: 'pending'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment record to completed
      updatePaymentRecord(paymentRecord.id, { 
        status: 'completed'
      });
      
      // Log successful payment completion with all details
      console.log('✅ Engagement Payment Completed Successfully:', {
        ...paymentDetails,
        paymentId: paymentRecord.id,
        completedAt: new Date().toISOString(),
        paymentMethod: 'simulated'
      });
      
      toast({
        title: "Payment Successful",
        description: `Your ${getEngagementModelName(state.selected_engagement_model)} plan has been activated!${displayInfo.discountApplied ? ' (Member discount applied)' : ''}`
      });
      
    } catch (error) {
      console.error('❌ Engagement payment error:', error);
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
  const isPaaSModel = state.selected_engagement_model?.toLowerCase().includes('platform') || 
                     state.selected_engagement_model?.toLowerCase().includes('paas');

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
                   state.membership_type === 'not-a-member' ? 'Not a Member' : 'Basic'}
                </Badge>
                {state.membership_type && (
                  <Badge variant="outline">{state.membership_type === 'annual' ? 'Annual Plan' : 'Not a Member'}</Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

        {/* Membership Payment */}
        <Card className={state.membership_type === 'annual' && state.membership_status !== 'member_paid' ? '' : 'opacity-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Membership Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.membership_type === 'annual' && state.membership_status !== 'member_paid' ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-lg font-bold mb-2">Annual Membership</div>
                  {annualFee && (
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(annualFee.amount, annualFee.currency)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">
                    Unlock member pricing for all engagement models
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleMembershipPayment}
                  disabled={membershipPaymentLoading || !annualFee}
                >
                  {membershipPaymentLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Pay Membership Fee`
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {state.membership_status === 'member_paid' ? 'Membership already paid' : 'Select Annual membership to pay'}
                </p>
                {state.membership_status === 'member_paid' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateMembershipStatus('inactive')}
                  >
                    Reset Payment Status
                  </Button>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  Debug: Status = {state.membership_status}, Type = {state.membership_type}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagement Payment */}
        <Card className={state.selected_engagement_model ? '' : 'opacity-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Engagement Payment
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
                      const displayInfo = getDisplayAmount(frequency, engagementPricing);
                      
                      return (
                        <Label key={frequency} htmlFor={frequency} className="cursor-pointer">
                          <div className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent ${
                            state.selected_frequency === frequency ? 'border-primary bg-primary/5' : ''
                          }`}>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={frequency} id={frequency} />
                              <span className="capitalize">{frequency.replace('-', ' ')}</span>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="font-bold">
                                {isPaaSModel ? (
                                  <div className="space-y-1">
                                    <div className="text-green-600">
                                      {formatCurrency(displayInfo.amount, engagementPricing.currency)}
                                    </div>
                                    {displayInfo.discountApplied && displayInfo.originalAmount && (
                                      <div className="text-xs text-gray-500 line-through">
                                        {formatCurrency(displayInfo.originalAmount, engagementPricing.currency)}
                                      </div>
                                    )}
                                    {displayInfo.discountApplied && (
                                      <div className="text-xs text-green-600 font-medium">
                                        {engagementPricing.discountPercentage}% member discount
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  `${displayInfo.amount}%`
                                )}
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
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">Payment Summary</div>
                      {(() => {
                        const displayInfo = getDisplayAmount(state.selected_frequency, engagementPricing);
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Engagement Model:</span>
                              <span className="font-medium">{getEngagementModelName(state.selected_engagement_model)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Billing Frequency:</span>
                              <span className="font-medium capitalize">{state.selected_frequency.replace('-', ' ')}</span>
                            </div>
                            {displayInfo.discountApplied && displayInfo.originalAmount && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Original Price:</span>
                                <span className="text-gray-500 line-through">
                                  {formatCurrency(displayInfo.originalAmount, engagementPricing.currency)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {displayInfo.discountApplied ? 'Discounted Price:' : 'Total Amount:'}
                              </span>
                              <span className="font-bold text-lg text-green-600">
                                {isPaaSModel 
                                  ? formatCurrency(displayInfo.amount, engagementPricing.currency)
                                  : `${displayInfo.amount}% of solution fee`
                                }
                              </span>
                            </div>
                            {displayInfo.discountApplied && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Member Discount:</span>
                                <span className="text-green-600 font-medium">
                                  -{engagementPricing.discountPercentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    
                    {getPaidEngagementModel() ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            size="lg"
                            disabled={engagementPaymentLoading}
                          >
                            {engagementPaymentLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pay & Activate {getEngagementModelName(state.selected_engagement_model)}
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Change Engagement Model?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You have already subscribed to an engagement model. Do you want to subscribe to a new engagement model: <strong>{getEngagementModelName(state.selected_engagement_model)}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEngagementPayment}>
                              Yes, Subscribe to New Model
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleEngagementPayment}
                        disabled={engagementPaymentLoading}
                      >
                        {engagementPaymentLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay & Activate {getEngagementModelName(state.selected_engagement_model)}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : state.selected_engagement_model ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-muted-foreground">Loading pricing for {getEngagementModelName(state.selected_engagement_model)}...</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Selected Model ID: {state.selected_engagement_model}</div>
                  <div>Mapped Name: {getEngagementModelName(state.selected_engagement_model)}</div>
                  <div>Membership Status: {state.membership_status === 'member_paid' ? 'member' : 'not-a-member'}</div>
                  <div>Pricing Configs Available: {pricingConfigs.length}</div>
                  <div>Organization Type: {organizationType}</div>
                  <div>Country: {country}</div>
                </div>
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