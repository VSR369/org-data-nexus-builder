import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Zap, FileText, AlertCircle, Edit } from 'lucide-react';

// Import components
import { PaymentSimulationCard } from './PaymentSimulationCard';
import { MembershipSummaryOnlyCard } from './MembershipSummaryOnlyCard';
import { SimpleTierSelectionCard } from './SimpleTierSelectionCard';
import { EngagementModelSelectionCard } from './EngagementModelSelectionCard';
import { SelectedTierSummaryCard } from './SelectedTierSummaryCard';
import { MembershipDetailsModal } from './MembershipDetailsModal';
import { PreviewConfirmationCard } from './PreviewConfirmationCard';


interface EnhancedMembershipFlowCardProps {
  profile: any;
  userId: string;
}

type WorkflowStep = 'membership_decision' | 'payment' | 'membership_summary' | 'tier_selection' | 'engagement_model' | 'preview_confirmation' | 'activation_complete';
type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

export const EnhancedMembershipFlowCard: React.FC<EnhancedMembershipFlowCardProps> = ({ profile, userId }) => {
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('membership_decision');
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string | null>(null);
  
  const [showTierSelection, setShowTierSelection] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data from database
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [engagementModelPricing, setEngagementModelPricing] = useState<any[]>([]);
  const [tierConfiguration, setTierConfiguration] = useState<any>(null);
  const [engagementModelDetails, setEngagementModelDetails] = useState<any>(null);
  const [activationRecord, setActivationRecord] = useState<any>(null);
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
      setActivationRecord(existingActivation);

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
        
        // Show tier selection if a tier has been selected or if on tier_selection step
        setShowTierSelection(!!existingActivation.pricing_tier || dbStep === 'tier_selection');

        // Load tier configuration if tier is selected
        if (existingActivation.pricing_tier) {
          await loadTierConfiguration(existingActivation.pricing_tier);
        }

        // Load engagement model details if model is selected
        if (existingActivation.engagement_model) {
          await loadEngagementModelDetails(existingActivation.engagement_model);
        }

        // Load engagement model pricing if both tier and model are selected
        if (existingActivation.pricing_tier && existingActivation.engagement_model) {
          await loadEngagementModelPricing(existingActivation.pricing_tier, existingActivation.engagement_model);
        }
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

  const loadTierConfiguration = async (tierName: string) => {
    try {
      console.log('🏷️ Loading tier configuration for:', tierName);
      
      // Get country ID first
      const { data: countryData } = await supabase
        .from('master_countries')
        .select('id')
        .eq('name', profile.country)
        .single();

      if (!countryData) {
        console.error('❌ Country not found:', profile.country);
        return;
      }

      // Get pricing tier ID
      const { data: tierData } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .eq('name', tierName)
        .single();

      if (!tierData) {
        console.error('❌ Pricing tier not found:', tierName);
        return;
      }

      // Get tier configuration with related data
      const { data: tierConfig } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          master_pricing_tiers (
            name,
            level_order,
            description
          ),
          master_analytics_access_types (
            name,
            description,
            features_included
          ),
          master_support_types (
            name,
            service_level,
            response_time,
            availability
          ),
          master_onboarding_types (
            name,
            service_type,
            resources_included
          ),
          master_workflow_templates (
            name,
            template_type,
            customization_level,
            template_count
          ),
          master_currencies (
            code,
            symbol
          )
        `)
        .eq('country_id', countryData.id)
        .eq('pricing_tier_id', tierData.id)
        .eq('is_active', true)
        .single();

      if (tierConfig) {
        setTierConfiguration(tierConfig);
        console.log('✅ Loaded tier configuration:', tierConfig);
      }
    } catch (error) {
      console.error('❌ Error loading tier configuration:', error);
    }
  };

  const loadEngagementModelDetails = async (modelName: string) => {
    try {
      console.log('🤝 Loading engagement model details for:', modelName);
      
      const { data: modelDetails } = await supabase
        .from('master_engagement_models')
        .select('*')
        .eq('name', modelName)
        .single();

      if (modelDetails) {
        setEngagementModelDetails(modelDetails);
        console.log('✅ Loaded engagement model details:', modelDetails);
      }
    } catch (error) {
      console.error('❌ Error loading engagement model details:', error);
    }
  };

  const loadEngagementModelPricing = async (tier: string, model: string) => {
    try {
      console.log('💰 Loading engagement model pricing for:', { tier, model });
      
      // Use the pricing configuration function to get real pricing data
      const { data: pricingData, error } = await supabase
        .rpc('get_pricing_configuration', {
          p_country_name: profile.country,
          p_organization_type: profile.organization_type,
          p_entity_type: profile.entity_type,
          p_engagement_model: model,
          p_membership_status: membershipStatus === 'active' ? 'Active' : 'Not Active'
        });

      if (error) {
        console.error('❌ Error loading pricing configuration:', error);
        return;
      }
      
      setEngagementModelPricing(pricingData || []);
      console.log('💰 Loaded engagement model pricing:', pricingData?.length || 0);
    } catch (error) {
      console.error('❌ Error loading engagement model pricing:', error);
    }
  };

  const updateWorkflowStep = async (step: WorkflowStep, additionalData: any = {}) => {
    try {
      console.log('🔄 Updating workflow step to:', step, 'with data:', additionalData);
      
      // Validate required fields
      const { finalUserId, finalMembershipStatus } = validateRequiredFields(additionalData);
      
      // Ensure we have a valid user ID
      if (!finalUserId) {
        throw new Error('User ID is required for database operations');
      }
      
      const updateData = {
        user_id: finalUserId,
        workflow_step: step,
        country: profile?.country || 'Unknown',
        organization_type: profile?.organization_type || 'Unknown',
        membership_status: finalMembershipStatus,
        ...additionalData,
        updated_at: new Date().toISOString()
      };

      // Only set engagement_model if it's explicitly provided
      if (selectedEngagementModel || additionalData.engagement_model) {
        updateData.engagement_model = additionalData.engagement_model || selectedEngagementModel;
      }

      // Only set pricing_tier if it's explicitly provided
      if (selectedTier || additionalData.pricing_tier) {
        updateData.pricing_tier = additionalData.pricing_tier || selectedTier;
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

  // New handlers for edit functionality
  const handleTierChange = async (newTier: string) => {
    try {
      setIsProcessing(true);
      console.log('🏷️ Handling tier change from', selectedTier, 'to', newTier);

      // Update tier in database
      await updateWorkflowStep(currentStep, {
        pricing_tier: newTier.toLowerCase(),
        tier_selected_at: new Date().toISOString()
      });

      // Update local state
      setSelectedTier(newTier);

      // Reload tier configuration
      await loadTierConfiguration(newTier);

      // If engagement model is selected, reload its pricing with new tier context
      if (selectedEngagementModel) {
        await loadEngagementModelPricing(newTier, selectedEngagementModel);
      }

      // Reload workflow data to ensure consistency
      await loadWorkflowData();

      toast({
        title: "Tier Updated",
        description: `Your pricing tier has been changed to ${newTier}.`,
      });
    } catch (error) {
      console.error('❌ Error updating tier:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update pricing tier. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEngagementModelChange = async (newModel: string) => {
    try {
      setIsProcessing(true);
      console.log('🤝 Handling engagement model change from', selectedEngagementModel, 'to', newModel);

      // Update engagement model in database
      await updateWorkflowStep(currentStep, {
        engagement_model: newModel,
        engagement_model_selected_at: new Date().toISOString()
      });

      // Update local state
      setSelectedEngagementModel(newModel);

      // Reload engagement model details
      await loadEngagementModelDetails(newModel);

      // Reload pricing with new model
      if (selectedTier) {
        await loadEngagementModelPricing(selectedTier, newModel);
      }

      // Reload workflow data to ensure consistency
      await loadWorkflowData();

      toast({
        title: "Engagement Model Updated",
        description: `Your engagement model has been changed to ${newModel}.`,
      });
    } catch (error) {
      console.error('❌ Error updating engagement model:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update engagement model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMembershipActivation = async () => {
    try {
      setIsProcessing(true);
      console.log('💳 Handling membership activation');

      // Set membership status to active
      setMembershipStatus('active');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const annualFee = membershipFees[0]?.annual_amount || 990;
      const currency = membershipFees[0]?.annual_currency || 'USD';

      // Update workflow with membership activation
      await updateWorkflowStep(currentStep, {
        membership_status: 'active',
        payment_simulation_status: 'success',
        mem_payment_status: 'paid',
        mem_payment_amount: annualFee,
        mem_payment_currency: currency,
        mem_payment_date: new Date().toISOString(),
        mem_payment_method: 'credit_card',
        mem_receipt_number: `RCP-${Date.now()}`,
        mem_terms: true
      });

      // Reload engagement model pricing with membership discount
      if (selectedTier && selectedEngagementModel) {
        await loadEngagementModelPricing(selectedTier, selectedEngagementModel);
      }

      // Reload workflow data to ensure consistency
      await loadWorkflowData();

      toast({
        title: "Membership Activated!",
        description: `Annual membership fee of ${currency} ${annualFee} has been processed. Your engagement model pricing has been updated with member discounts.`,
      });
    } catch (error) {
      console.error('❌ Error activating membership:', error);
      toast({
        title: "Activation Failed",
        description: "Failed to activate membership. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMembershipDecision = async (status: 'active' | 'inactive') => {
    try {
      console.log('👤 Membership decision:', status);
      setMembershipStatus(status);
      
      if (status === 'active') {
        // For active membership, MUST go to payment step first
        await updateWorkflowStep('payment', { membership_status: 'active' });
      } else {
        // For inactive membership, skip payment and go directly to summary
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

  const handleActivateMembership = async () => {
    try {
      console.log('👤 Activating membership for inactive user');
      setMembershipStatus('active');
      await updateWorkflowStep('payment', { membership_status: 'active' });
    } catch (error) {
      console.error('❌ Error in handleActivateMembership:', error);
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

      // Keep the existing pricing tier and engagement model
      const updateData = {
        payment_simulation_status: 'success',
        mem_payment_status: 'paid',
        mem_payment_amount: annualFee,
        mem_payment_currency: currency,
        mem_payment_date: new Date().toISOString(),
        mem_payment_method: 'credit_card',
        mem_receipt_number: `RCP-${Date.now()}`,
        mem_terms: true,
        // Don't change pricing_tier or engagement_model if they're already set
        ...(selectedTier && { pricing_tier: selectedTier }),
        ...(selectedEngagementModel && { engagement_model: selectedEngagementModel })
      };

      await updateWorkflowStep('membership_summary', updateData);

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
      console.log('🎯 Smart navigation - checking current selections');
      
      // Check if payment is required and completed for active membership
      if (membershipStatus === 'active' && paymentStatus !== 'success') {
        toast({
          title: "Payment Required",
          description: "Please complete your membership payment before proceeding.",
          variant: "destructive"
        });
        return;
      }
      
      // Smart navigation based on current selections
      if (!selectedTier) {
        console.log('📍 No tier selected - proceeding to tier selection');
        setShowTierSelection(true);
        await updateWorkflowStep('tier_selection');
      } else if (selectedTier && !selectedEngagementModel) {
        console.log('📍 Tier selected but no engagement model - proceeding to engagement model selection');
        await updateWorkflowStep('engagement_model');
      } else if (selectedTier && selectedEngagementModel) {
        console.log('📍 Both tier and engagement model selected - proceeding to preview');
        await updateWorkflowStep('preview_confirmation');
      }
      
      toast({
        title: "Success",
        description: "Navigating to next step.",
      });
    } catch (error) {
      console.error('❌ Error in handleProceedToTierSelection:', error);
      toast({
        title: "Error",
        description: "Failed to proceed. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReviewAndFinalize = async () => {
    try {
      console.log('✅ Proceeding to review and finalize');
      await updateWorkflowStep('preview_confirmation');
      toast({
        title: "Success",
        description: "Proceeding to final review.",
      });
    } catch (error) {
      console.error('❌ Error in handleReviewAndFinalize:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChangeSelections = async () => {
    try {
      console.log('🔄 Allowing user to change selections');
      setShowTierSelection(true);
      await updateWorkflowStep('tier_selection');
      toast({
        title: "Edit Mode",
        description: "You can now modify your selections.",
      });
    } catch (error) {
      console.error('❌ Error in handleChangeSelections:', error);
      toast({
        title: "Error",
        description: "Failed to enter edit mode. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTierSelection = async (tier: string) => {
    try {
      console.log('🏷️ Tier selected:', tier);
      
      // Validate that we have the required data
      if (!userId) {
        throw new Error('User ID is required for tier selection');
      }
      
      if (!tier || tier.trim() === '') {
        throw new Error('Valid tier selection is required');
      }
      
      setSelectedTier(tier);
      setShowTierSelection(true);
      
      // Convert tier to lowercase for database storage (constraint requirement)
      const tierForDatabase = tier.toLowerCase();
      console.log('🔽 Converting tier for database:', { original: tier, database: tierForDatabase });
      
      // Update workflow with proper error handling - using 'engagement_model' instead of 'engagement_model_selection'
      await updateWorkflowStep('engagement_model', {
        pricing_tier: tierForDatabase, // Use lowercase for database
        tier_selected_at: new Date().toISOString(),
        membership_status: membershipStatus || 'active' // Ensure membership status is set
      });
      
      toast({
        title: "Tier Selected",
        description: `${tier} tier has been selected successfully.`,
      });
    } catch (error) {
      console.error('❌ Error in handleTierSelection:', error);
      
      // Reset selected tier on error
      setSelectedTier(null);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Tier Selection Failed",
        description: `Failed to save tier selection: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const handleEditTier = () => {
    setShowTierSelection(true);
    updateWorkflowStep('tier_selection');
  };

  const handleEngagementModelSelection = async (modelName: string) => {
    try {
      console.log('🤝 Engagement model selected (preview only):', modelName);
      setSelectedEngagementModel(modelName);
      
      // Move to preview step instead of saving immediately
      setCurrentStep('preview_confirmation');
      
      toast({
        title: "Model Selected",
        description: `${modelName} selected. Please review your selections below.`,
      });
    } catch (error) {
      console.error('❌ Error in handleEngagementModelSelection:', error);
      toast({
        title: "Error",
        description: "Failed to select engagement model. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFinalConfirmation = async () => {
    try {
      setIsProcessing(true);
      console.log('✅ Final confirmation and save');
      
      await updateWorkflowStep('activation_complete', {
        engagement_model: selectedEngagementModel,
        engagement_model_selected_at: new Date().toISOString(),
        workflow_completed: true,
        activation_status: 'Activated'
      });
      
      toast({
        title: "Enrollment Activated!",
        description: "Your enrollment as Solution Seeking Organization has been successfully activated with all selected options.",
      });
    } catch (error) {
      console.error('❌ Error in handleFinalConfirmation:', error);
      toast({
        title: "Error",
        description: "Failed to activate membership. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditStep = (step: string) => {
    setCurrentStep(step as WorkflowStep);
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

  // If workflow is complete, show summary with edit functionality
  if (currentStep === 'activation_complete') {
    return (
      <div className="w-full space-y-6">
        <Card className="w-full border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              Enrollment Activated Successfully!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your enrollment is now active and you have full access to the platform upon payment verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <Badge className="mb-2 bg-green-600">Membership</Badge>
                <div className="font-medium">{membershipStatus === 'active' ? 'Active' : 'Inactive'}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200 relative">
                <Badge className="mb-2 bg-blue-600">Tier</Badge>
                <div className="font-medium">{selectedTier || 'Not Selected'}</div>
                {selectedTier && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTierSelection(true)}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200 relative">
                <Badge className="mb-2 bg-purple-600">Model</Badge>
                <div className="font-medium">{selectedEngagementModel || 'Not Selected'}</div>
                {selectedEngagementModel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep('engagement_model')}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add the full membership summary card with edit functionality */}
        <div className="max-w-4xl mx-auto">
          <MembershipSummaryOnlyCard
            membershipStatus={membershipStatus}
            membershipFees={membershipFees}
            onProceedToTierSelection={handleProceedToTierSelection}
            currency={membershipFees[0]?.annual_currency || 'USD'}
            onActivateMembership={membershipStatus === 'inactive' ? handleActivateMembership : undefined}
            selectedTier={selectedTier}
            selectedEngagementModel={selectedEngagementModel}
            onReviewAndFinalize={handleReviewAndFinalize}
            onChangeSelections={handleChangeSelections}
            profile={profile}
            onTierChange={handleTierChange}
            onEngagementModelChange={handleEngagementModelChange}
          />
        </div>
      </div>
    );
  }

  // Check if we should show the persistent membership summary
  const shouldShowMembershipSummary = membershipStatus && currentStep !== 'membership_decision' && currentStep !== 'preview_confirmation';

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
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="h-5 w-5" />
                    Payment Required
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Complete your membership payment to continue with tier selection and platform access.
                  </CardDescription>
                </CardHeader>
              </Card>
              
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

      case 'preview_confirmation':
        return (
          <PreviewConfirmationCard
            membershipStatus={membershipStatus}
            selectedTier={selectedTier}
            selectedEngagementModel={selectedEngagementModel}
            membershipFees={membershipFees}
            onEdit={handleEditStep}
            onConfirm={handleFinalConfirmation}
            isProcessing={isProcessing}
          />
        );

      case 'engagement_model':
        return null; // This will be rendered separately

      case 'membership_summary':
        return null; // This step is handled by the persistent summary

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Persistent Membership Summary - Enhanced with Review Card functionality */}
      {shouldShowMembershipSummary && (
        <div className="max-w-4xl mx-auto">
          <MembershipSummaryOnlyCard
            membershipStatus={membershipStatus}
            membershipFees={membershipFees}
            onProceedToTierSelection={handleProceedToTierSelection}
            currency={membershipFees[0]?.annual_currency || 'USD'}
            onActivateMembership={membershipStatus === 'inactive' ? handleActivateMembership : undefined}
            selectedTier={selectedTier}
            selectedEngagementModel={selectedEngagementModel}
            onReviewAndFinalize={handleReviewAndFinalize}
            onChangeSelections={handleChangeSelections}
            profile={profile}
            onTierChange={handleTierChange}
            onEngagementModelChange={handleEngagementModelChange}
          />
        </div>
      )}
      
      {/* Persistent Tier Selection Summary - only show if tier is selected but we're not in review mode */}
      {selectedTier && currentStep !== 'tier_selection' && currentStep !== 'preview_confirmation' && !(selectedTier && selectedEngagementModel) && (
        <div className="max-w-4xl mx-auto">
          <SelectedTierSummaryCard 
            selectedTier={selectedTier}
            onEditTier={handleEditTier}
          />
        </div>
      )}
      
      {/* Current Step Content */}
      {renderCurrentStepContent()}

      {/* Always show tier selection if it should be visible */}
      {showTierSelection && currentStep === 'tier_selection' && (
        <div className="max-w-4xl mx-auto">
          <SimpleTierSelectionCard
            selectedTier={selectedTier}
            onTierSelect={handleTierSelection}
            countryName={profile?.country}
          />
        </div>
      )}
      
      {/* Always show engagement model selection if we're on that step */}
      {currentStep === 'engagement_model' && (
        <div className="max-w-4xl mx-auto">
          <EngagementModelSelectionCard
            selectedTier={selectedTier}
            selectedModel={selectedEngagementModel}
            onModelSelect={handleEngagementModelSelection}
            profile={profile}
            membershipStatus={membershipStatus || 'inactive'}
          />
        </div>
      )}
      
      {/* Membership Details Modal */}
      <MembershipDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        membershipStatus={membershipStatus}
        selectedTier={selectedTier}
        selectedEngagementModel={selectedEngagementModel}
        membershipFees={membershipFees}
        profile={profile}
      />
    </div>
  );
};
