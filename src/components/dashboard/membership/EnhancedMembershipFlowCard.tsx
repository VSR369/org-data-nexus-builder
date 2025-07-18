
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';

// Import components
import { PaymentSimulationCard } from './PaymentSimulationCard';
import { EngagementModelDetailCard } from './EngagementModelDetailCard';
import { ActivationSummaryCard } from './ActivationSummaryCard';
import { SimpleEngagementModelSelection } from './SimpleEngagementModelSelection';
import { MembershipSummaryOnlyCard } from './MembershipSummaryOnlyCard';
import { TierSelectionCard } from './TierSelectionCard';

interface EnhancedMembershipFlowCardProps {
  profile: any;
  userId: string;
}

type WorkflowStep = 'membership_decision' | 'payment' | 'membership_summary' | 'tier_selection' | 'engagement_model' | 'details_review' | 'activation_complete';
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

  // Validate workflow step consistency
  const validateWorkflowStep = (dbStep: WorkflowStep, dbMembershipStatus: string | null, dbPaymentStatus: string | null): WorkflowStep => {
    console.log('Validating workflow step:', { dbStep, dbMembershipStatus, dbPaymentStatus });
    
    // If no membership status is set, start from beginning
    if (!dbMembershipStatus) {
      return 'membership_decision';
    }
    
    // If membership status is active but no payment processed, go to payment
    if (dbMembershipStatus === 'active' && (!dbPaymentStatus || dbPaymentStatus === 'pending')) {
      return 'payment';
    }
    
    // If membership status is active and payment is successful, go to summary
    if (dbMembershipStatus === 'active' && dbPaymentStatus === 'success') {
      return 'membership_summary';
    }
    
    // If membership status is inactive, go directly to summary
    if (dbMembershipStatus === 'inactive') {
      return 'membership_summary';
    }
    
    // For other cases, validate the step progression
    const stepOrder: WorkflowStep[] = ['membership_decision', 'payment', 'membership_summary', 'tier_selection', 'engagement_model', 'details_review', 'activation_complete'];
    const currentIndex = stepOrder.indexOf(dbStep);
    
    // If step is valid and conditions are met, return it
    if (currentIndex >= 0) {
      return dbStep;
    }
    
    // Default fallback
    return 'membership_decision';
  };

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      
      // Check existing workflow status
      const { data: existingActivation } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('Existing activation data:', existingActivation);

      if (existingActivation) {
        const dbStep = (existingActivation.workflow_step as WorkflowStep) || 'membership_decision';
        const dbMembershipStatus = existingActivation.membership_status;
        const dbPaymentStatus = existingActivation.payment_simulation_status;
        
        // Validate and potentially correct the workflow step
        const validatedStep = validateWorkflowStep(dbStep, dbMembershipStatus, dbPaymentStatus);
        
        console.log('Setting workflow state:', {
          validatedStep,
          membershipStatus: dbMembershipStatus,
          paymentStatus: dbPaymentStatus
        });
        
        setCurrentStep(validatedStep);
        setMembershipStatus(dbMembershipStatus === 'active' ? 'active' : 'inactive');
        setPaymentStatus((dbPaymentStatus as PaymentStatus) || 'pending');
        setSelectedTier(existingActivation.pricing_tier);
        
        if (existingActivation.engagement_model) {
          setSelectedEngagementModel(
            existingActivation.engagement_model.toLowerCase().includes('marketplace') ? 'marketplace' : 'aggregator'
          );
        }
        
        // If the validated step is different from database step, update it
        if (validatedStep !== dbStep) {
          console.log('Correcting workflow step from', dbStep, 'to', validatedStep);
          await updateWorkflowStep(validatedStep, { 
            workflow_step_corrected: true,
            previous_step: dbStep 
          });
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

  const validateRequiredFields = (step: WorkflowStep, additionalData: any = {}) => {
    console.log('Validating required fields for step:', step, 'with data:', additionalData);
    
    // Ensure we have required base values
    const finalMembershipStatus = additionalData.membership_status || membershipStatus || 'inactive';
    const finalEngagementModel = additionalData.engagement_model || selectedEngagementModel || 'marketplace';
    
    console.log('Final values for validation:', {
      finalMembershipStatus,
      finalEngagementModel,
      userId,
      step
    });

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!finalMembershipStatus) {
      throw new Error('Membership status is required');
    }

    if (!finalEngagementModel) {
      throw new Error('Engagement model is required');
    }

    return {
      finalMembershipStatus,
      finalEngagementModel
    };
  };

  const updateWorkflowStep = async (step: WorkflowStep, additionalData: any = {}) => {
    try {
      console.log('Updating workflow step to:', step, 'with data:', additionalData);
      
      // Validate required fields first
      const { finalMembershipStatus, finalEngagementModel } = validateRequiredFields(step, additionalData);
      
      const updateData = {
        user_id: userId,
        workflow_step: step,
        country: profile?.country || 'Unknown',
        organization_type: profile?.organization_type || 'Unknown',
        membership_status: finalMembershipStatus,
        engagement_model: finalEngagementModel,
        ...additionalData,
        updated_at: new Date().toISOString()
      };

      console.log('Final update data being sent to database:', updateData);

      const { error, data } = await supabase
        .from('engagement_activations')
        .upsert(updateData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Database upsert error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database operation failed: ${error.message}`);
      }
      
      console.log('Database operation successful:', data);
      setCurrentStep(step);
      console.log('Workflow step updated successfully to:', step);
    } catch (error) {
      console.error('Error updating workflow step:', error);
      
      // Enhanced error message for user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Workflow Update Failed",
        description: `Failed to update workflow step: ${errorMessage}`,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const handleMembershipDecision = async (status: 'active' | 'inactive') => {
    try {
      console.log('Membership decision:', status);
      setMembershipStatus(status);
      
      if (status === 'active') {
        await updateWorkflowStep('payment', { membership_status: 'active' });
      } else {
        // For inactive membership, go directly to summary
        await updateWorkflowStep('membership_summary', { membership_status: 'inactive' });
      }
    } catch (error) {
      console.error('Error in handleMembershipDecision:', error);
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

      await updateWorkflowStep('membership_summary', {
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
      console.error('Error in handlePaymentSubmit:', error);
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

  const handleProceedToTierSelection = async () => {
    try {
      console.log('Proceeding to tier selection');
      console.log('Current state before tier selection:', {
        membershipStatus,
        selectedEngagementModel,
        userId,
        profileData: profile
      });
      
      await updateWorkflowStep('tier_selection', {
        membership_summary_completed: true
      });
      
      toast({
        title: "Success",
        description: "Proceeding to tier selection.",
      });
    } catch (error) {
      console.error('Error in handleProceedToTierSelection:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to tier selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTierSelection = async (tier: string) => {
    try {
      console.log('Tier selected:', tier);
      setSelectedTier(tier);
      await updateWorkflowStep('engagement_model', {
        pricing_tier: tier,
        tier_selected_at: new Date().toISOString()
      });
      
      toast({
        title: "Tier Selected",
        description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} tier has been selected.`,
      });
    } catch (error) {
      console.error('Error in handleTierSelection:', error);
      toast({
        title: "Error",
        description: "Failed to save tier selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProceedToEngagementModel = async () => {
    try {
      await updateWorkflowStep('engagement_model', {
        pricing_tier: selectedTier,
        tier_confirmed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in handleProceedToEngagementModel:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to engagement model selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEngagementModelSelection = async (model: 'marketplace' | 'aggregator') => {
    try {
      setSelectedEngagementModel(model);
      await updateWorkflowStep('details_review', {
        engagement_model: model.charAt(0).toUpperCase() + model.slice(1),
        engagement_model_selected_at: new Date().toISOString()
      });
      
      toast({
        title: "Engagement Model Selected",
        description: `${model.charAt(0).toUpperCase() + model.slice(1)} model has been selected.`,
      });
    } catch (error) {
      console.error('Error in handleEngagementModelSelection:', error);
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
      const selectedTierData = { basic: 990, standard: 2990, premium: 6990 };
      const finalPrice = selectedTierData[selectedTier as keyof typeof selectedTierData] || 990;
      
      await updateWorkflowStep('activation_complete', {
        workflow_completed: true,
        activation_status: 'Activated',
        final_calculated_price: finalPrice,
        currency: membershipFees[0]?.annual_currency || 'USD'
      });

      toast({
        title: "Membership Activated!",
        description: "Your membership has been successfully activated. Welcome to CoInnovator Platform!",
      });

      await loadWorkflowData();
    } catch (error) {
      console.error('Error in handleFinalActivation:', error);
      toast({
        title: "Activation Failed",
        description: "There was an error activating your membership. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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

  // Render workflow steps
  const renderCurrentStep = () => {
    console.log('Rendering step:', currentStep, 'with membership status:', membershipStatus);
    
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

      case 'membership_summary':
        console.log('Rendering membership summary with status:', membershipStatus);
        if (membershipStatus) {
          return (
            <div className="max-w-4xl mx-auto">
              <MembershipSummaryOnlyCard
                membershipStatus={membershipStatus}
                membershipFees={membershipFees}
                onProceedToTierSelection={handleProceedToTierSelection}
                currency={membershipFees[0]?.annual_currency || 'USD'}
              />
            </div>
          );
        }
        return null;

      case 'tier_selection':
        return (
          <div className="max-w-4xl mx-auto">
            <TierSelectionCard
              selectedTier={selectedTier}
              onTierSelect={handleTierSelection}
              countryName={profile?.country}
            />
          </div>
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
