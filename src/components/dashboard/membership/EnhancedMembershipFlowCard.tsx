import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';

// Import components
import { PaymentSimulationCard } from './PaymentSimulationCard';
import { ActivationSummaryCard } from './ActivationSummaryCard';
import { MembershipSummaryOnlyCard } from './MembershipSummaryOnlyCard';
import { SimpleTierSelectionCard } from './SimpleTierSelectionCard';
import { SimpleEngagementModelCard } from './SimpleEngagementModelCard';

interface EnhancedMembershipFlowCardProps {
  profile: any;
  userId: string;
}

type WorkflowStep = 'membership_decision' | 'payment' | 'membership_summary' | 'tier_selection' | 'engagement_model_selection' | 'activation_complete';
type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

export const EnhancedMembershipFlowCard: React.FC<EnhancedMembershipFlowCardProps> = ({ profile, userId }) => {
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('membership_decision');
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data from database
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadWorkflowData();
    }
  }, [profile]);

  const validateRequiredFields = (additionalData: any = {}) => {
    console.log('🔍 Validating required fields with data:', additionalData);
    
    const finalUserId = userId;
    const finalMembershipStatus = additionalData.membership_status || membershipStatus || 'inactive';
    
    if (!finalUserId) {
      throw new Error('User ID is required but not provided');
    }

    if (!finalMembershipStatus) {
      throw new Error('Membership status is required but not provided');
    }

    console.log('✅ Validation passed:', {
      userId: finalUserId,
      membershipStatus: finalMembershipStatus
    });

    return {
      finalUserId,
      finalMembershipStatus
    };
  };

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading workflow data for user:', userId);
      
      // Check existing workflow status
      const { data: existingActivation } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('📋 Existing activation data:', existingActivation);

      if (existingActivation) {
        const dbStep = (existingActivation.workflow_step as WorkflowStep) || 'membership_decision';
        const dbMembershipStatus = existingActivation.membership_status;
        const dbPaymentStatus = existingActivation.payment_simulation_status;
        
        console.log('🔄 Setting workflow state from database:', {
          step: dbStep,
          membershipStatus: dbMembershipStatus,
          paymentStatus: dbPaymentStatus,
          tier: existingActivation.pricing_tier,
          engagementModel: existingActivation.engagement_model
        });
        
        setCurrentStep(dbStep);
        setMembershipStatus(dbMembershipStatus === 'active' ? 'active' : 'inactive');
        setPaymentStatus((dbPaymentStatus as PaymentStatus) || 'pending');
        setSelectedTier(existingActivation.pricing_tier);
        setSelectedEngagementModel(existingActivation.engagement_model);
      }

      // Load membership fees
      const { data: membershipFeesData } = await supabase
        .from('master_seeker_membership_fees')
        .select('*')
        .eq('country', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type);

      setMembershipFees(membershipFeesData || []);
      console.log('💰 Loaded membership fees:', membershipFeesData?.length || 0);
      
    } catch (error) {
      console.error('❌ Error loading workflow data:', error);
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
      console.log('🔄 Updating workflow step to:', step, 'with data:', additionalData);
      
      // Validate required fields
      const { finalUserId, finalMembershipStatus } = validateRequiredFields(additionalData);
      
      const updateData = {
        user_id: finalUserId,
        workflow_step: step,
        country: profile?.country || 'Unknown',
        organization_type: profile?.organization_type || 'Unknown',
        membership_status: finalMembershipStatus,
        ...additionalData,
        updated_at: new Date().toISOString()
      };

      // Only set engagement_model if it's provided or already exists
      if (selectedEngagementModel || additionalData.engagement_model) {
        updateData.engagement_model = additionalData.engagement_model || selectedEngagementModel;
      }

      console.log('📤 Final update data being sent to database:', updateData);

      const { error, data } = await supabase
        .from('engagement_activations')
        .upsert(updateData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('❌ Database upsert error:', error);
        throw new Error(`Database operation failed: ${error.message}`);
      }
      
      console.log('✅ Database operation successful:', data);
      setCurrentStep(step);
      console.log('🎯 Workflow step updated successfully to:', step);
      
    } catch (error) {
      console.error('❌ Error updating workflow step:', error);
      
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
      console.log('👤 Membership decision:', status);
      setMembershipStatus(status);
      
      if (status === 'active') {
        await updateWorkflowStep('payment', { membership_status: 'active' });
      } else {
        await updateWorkflowStep('membership_summary', { membership_status: 'inactive' });
      }
    } catch (error) {
      console.error('❌ Error in handleMembershipDecision:', error);
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
      console.error('❌ Error in handlePaymentSubmit:', error);
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
      console.log('🎯 Proceeding to tier selection');
      await updateWorkflowStep('tier_selection');
      
      toast({
        title: "Success",
        description: "Proceeding to tier selection.",
      });
    } catch (error) {
      console.error('❌ Error in handleProceedToTierSelection:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to tier selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTierSelection = async (tier: string) => {
    try {
      console.log('🏷️ Tier selected:', tier);
      setSelectedTier(tier);
      await updateWorkflowStep('engagement_model_selection', {
        pricing_tier: tier,
        tier_selected_at: new Date().toISOString()
      });
      
      toast({
        title: "Tier Selected",
        description: `${tier} tier has been selected.`,
      });
    } catch (error) {
      console.error('❌ Error in handleTierSelection:', error);
      toast({
        title: "Error",
        description: "Failed to save tier selection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEngagementModelSelection = async (modelName: string) => {
    try {
      console.log('🤝 Engagement model selected:', modelName);
      setSelectedEngagementModel(modelName);
      await updateWorkflowStep('activation_complete', {
        engagement_model: modelName,
        engagement_model_selected_at: new Date().toISOString(),
        workflow_completed: true,
        activation_status: 'Activated'
      });
      
      toast({
        title: "Engagement Model Selected",
        description: `${modelName} engagement model has been selected and your membership is now active!`,
      });
    } catch (error) {
      console.error('❌ Error in handleEngagementModelSelection:', error);
      toast({
        title: "Error",
        description: "Failed to save engagement model selection. Please try again.",
        variant: "destructive"
      });
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
              <div className="font-medium">{selectedTier || 'Not Selected'}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <Badge className="mb-2 bg-purple-600">Model</Badge>
              <div className="font-medium">{selectedEngagementModel || 'Not Selected'}</div>
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

  // Check if we should show the persistent membership summary
  const shouldShowMembershipSummary = membershipStatus && currentStep !== 'membership_decision';

  // Render the current step content
  const renderCurrentStepContent = () => {
    console.log('🎨 Rendering step:', currentStep, 'with membership status:', membershipStatus);
    
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
          <div className="max-w-4xl mx-auto">
            <SimpleTierSelectionCard
              selectedTier={selectedTier}
              onTierSelect={handleTierSelection}
              countryName={profile?.country}
            />
          </div>
        );

      case 'engagement_model_selection':
        return (
          <div className="max-w-4xl mx-auto">
            <SimpleEngagementModelCard
              selectedModel={selectedEngagementModel}
              onModelSelect={handleEngagementModelSelection}
            />
          </div>
        );

      case 'membership_summary':
        // This step is now handled by the persistent summary, so we skip to tier selection
        return (
          <div className="max-w-4xl mx-auto">
            <SimpleTierSelectionCard
              selectedTier={selectedTier}
              onTierSelect={handleTierSelection}
              countryName={profile?.country}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Persistent Membership Summary - Show above current step when membership decision is made */}
      {shouldShowMembershipSummary && (
        <div className="max-w-4xl mx-auto">
          <MembershipSummaryOnlyCard
            membershipStatus={membershipStatus}
            membershipFees={membershipFees}
            onProceedToTierSelection={handleProceedToTierSelection}
            currency={membershipFees[0]?.annual_currency || 'USD'}
          />
        </div>
      )}
      
      {/* Current Step Content */}
      {renderCurrentStepContent()}
    </div>
  );
};
