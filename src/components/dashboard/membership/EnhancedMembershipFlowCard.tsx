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
import { TierEditModal } from './TierEditModal';
import { EngagementModelEditModal } from './EngagementModelEditModal';

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

  // Enhanced edit modal states
  const [showTierEditModal, setShowTierEditModal] = useState(false);
  const [showEngagementModelEditModal, setShowEngagementModelEditModal] = useState(false);

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

  // New handlers for edit functionality using enhanced modals
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

  // All missing workflow handlers
  const handleProceedToTierSelection = async () => {
    try {
      setIsProcessing(true);
      await updateWorkflowStep('tier_selection');
      setShowTierSelection(true);
    } catch (error) {
      console.error('❌ Error proceeding to tier selection:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivateMembership = async () => {
    try {
      setIsProcessing(true);
      setMembershipStatus('active');
      await updateWorkflowStep('payment', { membership_status: 'active' });
    } catch (error) {
      console.error('❌ Error activating membership:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewAndFinalize = async () => {
    try {
      setIsProcessing(true);
      await updateWorkflowStep('preview_confirmation');
    } catch (error) {
      console.error('❌ Error proceeding to review:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeSelections = async () => {
    try {
      setIsProcessing(true);
      await updateWorkflowStep('tier_selection');
      setShowTierSelection(true);
    } catch (error) {
      console.error('❌ Error changing selections:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMembershipDecision = async (decision: 'active' | 'inactive') => {
    try {
      setIsProcessing(true);
      setMembershipStatus(decision);
      
      if (decision === 'active') {
        await updateWorkflowStep('payment', { membership_status: 'active' });
      } else {
        await updateWorkflowStep('tier_selection', { membership_status: 'inactive' });
        setShowTierSelection(true);
      }
    } catch (error) {
      console.error('❌ Error handling membership decision:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      setIsProcessing(true);
      setPaymentStatus('processing');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('success');
      await updateWorkflowStep('tier_selection', { 
        mem_payment_status: 'paid',
        payment_simulation_status: 'success' 
      });
      setShowTierSelection(true);
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTierSelection = async (tier: string) => {
    try {
      setIsProcessing(true);
      setSelectedTier(tier);
      await loadTierConfiguration(tier);
      await updateWorkflowStep('engagement_model', { 
        pricing_tier: tier.toLowerCase(),
        tier_selected_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error selecting tier:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditStep = async (step: string) => {
    try {
      setIsProcessing(true);
      await updateWorkflowStep(step as WorkflowStep);
    } catch (error) {
      console.error('❌ Error editing step:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalConfirmation = async () => {
    try {
      setIsProcessing(true);
      await updateWorkflowStep('activation_complete', { 
        workflow_completed: true,
        activation_status: 'Activated'
      });
    } catch (error) {
      console.error('❌ Error finalizing confirmation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditTier = () => {
    setShowTierEditModal(true);
  };

  const handleEngagementModelSelection = async (model: string) => {
    try {
      setIsProcessing(true);
      setSelectedEngagementModel(model);
      await loadEngagementModelDetails(model);
      
      if (selectedTier) {
        await loadEngagementModelPricing(selectedTier, model);
      }
      
      await updateWorkflowStep('preview_confirmation', { 
        engagement_model: model,
        engagement_model_selected_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error selecting engagement model:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // If workflow is complete, show summary with enhanced edit functionality
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
                    onClick={() => setShowTierEditModal(true)}
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
                    onClick={() => setShowEngagementModelEditModal(true)}
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

        {/* Enhanced Edit Modals */}
        <TierEditModal
          isOpen={showTierEditModal}
          onClose={() => setShowTierEditModal(false)}
          currentTier={selectedTier}
          countryName={profile?.country || 'India'}
          onTierChange={handleTierChange}
        />

        <EngagementModelEditModal
          isOpen={showEngagementModelEditModal}
          onClose={() => setShowEngagementModelEditModal(false)}
          currentModel={selectedEngagementModel}
          selectedTier={selectedTier}
          userId={userId}
          membershipStatus={membershipStatus || 'inactive'}
          profile={profile}
          onModelChange={handleEngagementModelChange}
        />
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
