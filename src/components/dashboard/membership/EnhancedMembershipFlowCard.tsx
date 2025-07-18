import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';

// Import new components
import { TierSelectionCard } from './TierSelectionCard';
import { PaymentSimulationCard } from './PaymentSimulationCard';
import { EngagementModelDetailCard } from './EngagementModelDetailCard';
import { ActivationSummaryCard } from './ActivationSummaryCard';
import { SimpleEngagementModelSelection } from './SimpleEngagementModelSelection';

interface EnhancedMembershipFlowCardProps {
  profile: any;
  userId: string;
}

type WorkflowStep = 'membership_decision' | 'payment' | 'tier_selection' | 'engagement_model' | 'details_review' | 'activation_complete';
type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

export const EnhancedMembershipFlowCard: React.FC<EnhancedMembershipFlowCardProps> = ({ profile, userId }) => {
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('membership_decision');
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<'marketplace' | 'aggregator' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data from database
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadWorkflowData();
    }
  }, [profile]);

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      
      // Check existing workflow status
      const { data: existingActivation } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingActivation) {
        setCurrentStep((existingActivation.workflow_step as WorkflowStep) || 'membership_decision');
        setMembershipStatus(existingActivation.membership_status === 'active' ? 'active' : 'inactive');
        setPaymentStatus((existingActivation.payment_simulation_status as PaymentStatus) || 'pending');
        setSelectedTier(existingActivation.pricing_tier);
        if (existingActivation.engagement_model) {
          setSelectedEngagementModel(
            existingActivation.engagement_model.toLowerCase().includes('marketplace') ? 'marketplace' : 'aggregator'
          );
        }
      }

      // Load membership fees
      const { data: membershipFeesData } = await supabase
        .from('master_seeker_membership_fees')
        .select('*')
        .eq('country', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type);

      // Load pricing configurations
      const { data: pricingConfigData } = await supabase
        .from('pricing_configurations_detailed')
        .select('*')
        .eq('country_name', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type)
        .eq('is_active', true);

      setMembershipFees(membershipFeesData || []);
      setPricingData(pricingConfigData || []);
    } catch (error) {
      console.error('Error loading workflow data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load membership workflow data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWorkflowStep = async (step: WorkflowStep, additionalData: any = {}) => {
    try {
      const updateData = {
        user_id: userId,
        workflow_step: step,
        country: profile.country,
        organization_type: profile.organization_type,
        membership_status: membershipStatus || 'inactive',
        engagement_model: selectedEngagementModel || 'marketplace',
        ...additionalData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('engagement_activations')
        .upsert(updateData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Upsert error:', error);
        throw error;
      }
      
      setCurrentStep(step);
    } catch (error) {
      console.error('Error updating workflow step:', error);
      throw error;
    }
  };

  const handleMembershipDecision = async (status: 'active' | 'inactive') => {
    try {
      setMembershipStatus(status);
      if (status === 'active') {
        await updateWorkflowStep('payment', { membership_status: 'active' });
      } else {
        await updateWorkflowStep('tier_selection', { membership_status: 'inactive' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update membership status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const annualFee = membershipFees[0]?.annual_amount || 990;
      const currency = membershipFees[0]?.annual_currency || 'USD';

      await updateWorkflowStep('tier_selection', {
        payment_simulation_status: 'success',
        mem_payment_status: 'paid',
        mem_payment_amount: annualFee,
        mem_payment_currency: currency,
        mem_payment_date: new Date().toISOString(),
        mem_payment_method: 'credit_card',
        mem_receipt_number: `RCP-${Date.now()}`,
        mem_terms: true
      });

      setPaymentStatus('success');
      
      toast({
        title: "Payment Successful",
        description: `Annual membership fee of ${currency} ${annualFee} has been processed successfully.`,
      });

    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTierSelection = async (tier: string) => {
    try {
      setSelectedTier(tier);
      await updateWorkflowStep('engagement_model', {
        pricing_tier: tier,
        tier_selected_at: new Date().toISOString(),
        tier_features: getTierFeatures(tier)
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tier selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEngagementModelSelection = async (model: 'marketplace' | 'aggregator') => {
    try {
      setSelectedEngagementModel(model);
      await updateWorkflowStep('details_review', {
        engagement_model: model.charAt(0).toUpperCase() + model.slice(1),
        engagement_model_selected_at: new Date().toISOString(),
        engagement_model_details: getEngagementModelDetails(model)
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save engagement model selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFinalActivation = async () => {
    setIsProcessing(true);
    try {
      await updateWorkflowStep('activation_complete', {
        workflow_completed: true,
        activation_status: 'Activated',
        final_calculated_price: getTierPrice(selectedTier || 'basic'),
        currency: membershipFees[0]?.annual_currency || 'USD'
      });

      toast({
        title: "Membership Activated!",
        description: "Your membership has been successfully activated. Welcome to CoInnovator Platform!",
      });

      // Refresh data to show new state
      await loadWorkflowData();
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "There was an error activating your membership. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierFeatures = (tier: string) => {
    const features = {
      basic: ['5 challenges/month', 'Basic analytics', 'Email support'],
      standard: ['20 challenges/month', 'Advanced analytics', 'Priority support', 'Custom branding'],
      premium: ['Unlimited challenges', 'Real-time analytics', 'Dedicated manager', 'White-label']
    };
    return features[tier as keyof typeof features] || [];
  };

  const getEngagementModelDetails = (model: string) => {
    return {
      type: model,
      features: model === 'marketplace' ? 
        ['Direct marketplace access', 'Challenge posting', 'Solution review'] :
        ['Multi-platform aggregation', 'Unified interface', 'Cross-platform analytics']
    };
  };

  const getTierPrice = (tier: string) => {
    const prices = { basic: 99, standard: 299, premium: 699 };
    return prices[tier as keyof typeof prices] || 99;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  // If workflow is complete, show summary
  if (currentStep === 'activation_complete') {
    return (
      <Card className="w-full border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-6 w-6" />
            Membership Activated Successfully!
          </CardTitle>
          <CardDescription className="text-green-700">
            Your membership is now active and you have full access to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <Badge className="mb-2 bg-green-600">Membership</Badge>
              <div className="font-medium">{membershipStatus === 'active' ? 'Active' : 'Inactive'}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Badge className="mb-2 bg-blue-600">Tier</Badge>
              <div className="font-medium">{selectedTier?.charAt(0).toUpperCase() + selectedTier?.slice(1)}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <Badge className="mb-2 bg-purple-600">Model</Badge>
              <div className="font-medium">{selectedEngagementModel?.charAt(0).toUpperCase() + selectedEngagementModel?.slice(1)}</div>
            </div>
          </div>
          <div className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render workflow steps with improved layout and spacing
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'membership_decision':
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Membership Activation
                </CardTitle>
                <CardDescription>
                  Do you want to activate your membership to access premium features?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleMembershipDecision('active')}
                  >
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span>Activate Membership</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleMembershipDecision('inactive')}
                  >
                    <Zap className="h-6 w-6 text-gray-600" />
                    <span>Continue without Membership</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'payment':
        if (membershipStatus === 'active') {
          return (
            <div className="max-w-2xl mx-auto">
              <PaymentSimulationCard
                membershipFees={membershipFees}
                isProcessing={isProcessing}
                paymentStatus={paymentStatus}
                onPaymentSubmit={handlePaymentSubmit}
                selectedTier={selectedTier || 'basic'}
              />
            </div>
          );
        }
        return null;

      case 'tier_selection':
        return (
          <TierSelectionCard
            selectedTier={selectedTier}
            onTierSelect={handleTierSelection}
            currency={membershipFees[0]?.annual_currency || 'USD'}
          />
        );

      case 'engagement_model':
        if (selectedTier) {
          return (
            <SimpleEngagementModelSelection
              selectedModel={selectedEngagementModel}
              onModelSelect={handleEngagementModelSelection}
              selectedTier={selectedTier}
              pricingData={pricingData}
            />
          );
        }
        return null;

      case 'details_review':
        if (selectedEngagementModel) {
          return (
            <div className="space-y-8">
              <EngagementModelDetailCard
                selectedModel={selectedEngagementModel}
                selectedTier={selectedTier as any}
                pricingData={pricingData}
                currency={membershipFees[0]?.annual_currency || 'USD'}
              />
              <div className="max-w-4xl mx-auto">
                <ActivationSummaryCard
                  membershipStatus={membershipStatus}
                  selectedTier={selectedTier}
                  selectedEngagementModel={selectedEngagementModel}
                  membershipFees={membershipFees}
                  pricingData={pricingData}
                  paymentStatus={paymentStatus}
                  isProcessing={isProcessing}
                  onActivate={handleFinalActivation}
                  canActivate={Boolean(membershipStatus && selectedTier && selectedEngagementModel)}
                />
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderCurrentStep()}
    </div>
  );
};