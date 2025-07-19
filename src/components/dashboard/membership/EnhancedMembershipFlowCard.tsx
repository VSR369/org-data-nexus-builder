import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Target, Zap, CheckCircle, Edit, AlertTriangle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MembershipDataService } from '@/services/MembershipDataService';
import { OrganizationDataService } from '@/services/OrganizationDataService';
import { DetailedTierCard } from './DetailedTierCard';
import { EnhancedEngagementModelCard } from './EnhancedEngagementModelCard';
import { EnhancedMembershipCard } from './EnhancedMembershipCard';
import { TierEditModal } from './TierEditModal';
import { EngagementModelEditModal } from './EngagementModelEditModal';
import { MembershipViewModal } from './MembershipViewModal';
import { MembershipEditModal } from './MembershipEditModal';

interface EnhancedMembershipFlowCardProps {
  profile: any;
  userId: string;
}

export const EnhancedMembershipFlowCard: React.FC<EnhancedMembershipFlowCardProps> = ({
  profile,
  userId
}) => {
  // Core state
  const [currentStep, setCurrentStep] = useState<string>('membership_decision');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection state
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'inactive' | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Master data
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  const [availableTiers, setAvailableTiers] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // Modal state
  const [showTierModal, setShowTierModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  // Enhanced profile context with fallback data
  const [profileContext, setProfileContext] = useState<any>(null);

  useEffect(() => {
    if (userId && profile) {
      initializeComponent();
    }
  }, [userId, profile]);

  const constructProfileContext = async (savedData: any = null) => {
    try {
      console.log('🔧 Constructing profile context with:', { profile, savedData });
      
      // Start with profile data
      let contextData = {
        country: profile?.country || 'India',
        organization_type: profile?.organization_type || '',
        entity_type: profile?.entity_type || '',
        original_profile: profile
      };

      // If profile data is incomplete, use saved data as fallback
      if (savedData) {
        if (!contextData.country && savedData.country) {
          contextData.country = savedData.country;
        }
        if (!contextData.organization_type && savedData.organization_type) {
          contextData.organization_type = savedData.organization_type;
        }
        if (!contextData.entity_type && savedData.entity_type) {
          contextData.entity_type = savedData.entity_type;
        }
      }

      // If still missing critical data, try to get from organizations table
      if (!contextData.organization_type || !contextData.entity_type) {
        console.log('📋 Missing org data, fetching from organizations table...');
        
        const { data: orgData } = await supabase
          .from('organizations')
          .select(`
            organization_type_id,
            entity_type_id,
            master_organization_types(name),
            master_entity_types(name)
          `)
          .eq('user_id', userId)
          .single();

        if (orgData) {
          if (!contextData.organization_type && orgData.master_organization_types?.name) {
            contextData.organization_type = orgData.master_organization_types.name;
          }
          if (!contextData.entity_type && orgData.master_entity_types?.name) {
            contextData.entity_type = orgData.master_entity_types.name;
          }
        }
      }

      console.log('✅ Final profile context:', contextData);
      setProfileContext(contextData);
      return contextData;
    } catch (error) {
      console.error('❌ Error constructing profile context:', error);
      // Fallback to basic context
      const fallbackContext = {
        country: profile?.country || 'India',
        organization_type: profile?.organization_type || 'Corporate',
        entity_type: profile?.entity_type || 'Private Limited',
        original_profile: profile
      };
      setProfileContext(fallbackContext);
      return fallbackContext;
    }
  };

  const initializeComponent = async () => {
    try {
      setLoading(true);
      
      // Load saved data first
      const savedData = await loadSavedData();
      
      // Construct profile context with saved data as fallback
      const context = await constructProfileContext(savedData);
      
      // Load master data with proper context
      await loadMasterData(context);
      
    } catch (error) {
      console.error('❌ Error initializing component:', error);
      toast({
        title: "Error",
        description: "Failed to load membership data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedData = async () => {
    try {
      const { data: savedData } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (savedData) {
        console.log('✅ Loaded saved data:', savedData);
        
        const workflowStep = savedData.workflow_step || 'membership_decision';
        let mappedStep = workflowStep;
        
        if (workflowStep === 'activation_complete') {
          mappedStep = 'completed';
        }
        
        setCurrentStep(mappedStep);
        setMembershipStatus(savedData.membership_status === 'active' ? 'active' : 'inactive');
        setSelectedTier(savedData.pricing_tier);
        setSelectedEngagementModel(savedData.engagement_model);
        setTermsAccepted(savedData.terms_accepted || false);
        
        return savedData;
      } else {
        console.log('📝 No saved data found, starting fresh');
        setCurrentStep('membership_decision');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading saved data:', error);
      setCurrentStep('membership_decision');
      return null;
    }
  };

  const loadMasterData = async (context: any) => {
    try {
      console.log('🔄 Loading master data with context:', context);

      // Load membership fees
      const fees = await MembershipDataService.getMembershipFees(
        context.country,
        context.organization_type,
        context.entity_type
      );
      setMembershipFees(Array.isArray(fees) ? fees : [fees].filter(Boolean));

      // Load available tiers with country filter
      const { data: countryData } = await supabase
        .from('master_countries')
        .select('id')
        .eq('name', context.country)
        .single();

      if (countryData) {
        const { data: tierConfigs } = await supabase
          .from('master_tier_configurations')
          .select(`
            *,
            master_pricing_tiers!inner(name, level_order, description),
            master_currencies(code, symbol)
          `)
          .eq('country_id', countryData.id)
          .eq('is_active', true)
          .order('master_pricing_tiers(level_order)');

        setAvailableTiers(tierConfigs || []);
        console.log('✅ Loaded tiers:', tierConfigs?.length);
      }

      // Load available engagement models
      const { data: models } = await supabase
        .from('master_engagement_models')
        .select('*')
        .order('name');

      setAvailableModels(models || []);
      console.log('✅ Loaded models:', models?.length);

    } catch (error) {
      console.error('❌ Error loading master data:', error);
    }
  };

  const saveCurrentState = async (updateData: any) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          membership_status: membershipStatus || 'inactive',
          pricing_tier: selectedTier,
          engagement_model: selectedEngagementModel,
          terms_accepted: termsAccepted,
          workflow_step: currentStep,
          country: profileContext?.country,
          organization_type: profileContext?.organization_type,
          updated_at: new Date().toISOString(),
          ...updateData
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      console.log('✅ Saved state:', { currentStep, membershipStatus, selectedTier, selectedEngagementModel });
    } catch (error) {
      console.error('❌ Error saving state:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleMembershipDecision = async (status: 'active' | 'inactive') => {
    try {
      setMembershipStatus(status);
      const nextStep = 'tier_selection';
      setCurrentStep(nextStep);
      
      await saveCurrentState({
        membership_status: status,
        workflow_step: nextStep
      });

      toast({
        title: "Membership Status Updated",
        description: `You have chosen to ${status === 'active' ? 'activate' : 'proceed without'} membership.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save membership decision.",
        variant: "destructive"
      });
    }
  };

  const handleTierSelection = async (tierName: string) => {
    try {
      setSelectedTier(tierName);
      const nextStep = 'engagement_model_selection';
      setCurrentStep(nextStep);
      
      await saveCurrentState({
        pricing_tier: tierName,
        workflow_step: nextStep
      });

      toast({
        title: "Pricing Tier Selected",
        description: `You have selected the ${tierName} tier.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tier selection.",
        variant: "destructive"
      });
    }
  };

  const handleEngagementModelSelection = async (modelName: string) => {
    try {
      setSelectedEngagementModel(modelName);
      const nextStep = 'terms_acceptance';
      setCurrentStep(nextStep);
      
      await saveCurrentState({
        engagement_model: modelName,
        workflow_step: nextStep
      });

      toast({
        title: "Engagement Model Selected",
        description: `You have selected the ${modelName} model.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save engagement model selection.",
        variant: "destructive"
      });
    }
  };

  const handleTermsAcceptance = async () => {
    try {
      setTermsAccepted(true);
      const nextStep = 'completed';
      setCurrentStep(nextStep);
      
      await saveCurrentState({
        terms_accepted: true,
        workflow_step: 'activation_complete'
      });

      toast({
        title: "Setup Complete",
        description: "Your membership and engagement model setup is complete!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete setup.",
        variant: "destructive"
      });
    }
  };

  const handleTierEdit = async (newTier: string) => {
    console.log('🎯 Tier changed to:', newTier);
    setSelectedTier(newTier);
    await saveCurrentState({ pricing_tier: newTier });
    toast({
      title: "Tier Updated",
      description: `Pricing tier changed to ${newTier}.`,
    });
  };

  const handleModelEdit = async (newModel: string) => {
    console.log('⚡ Model changed to:', newModel);
    setSelectedEngagementModel(newModel);
    await saveCurrentState({ engagement_model: newModel });
    toast({
      title: "Model Updated",
      description: `Engagement model changed to ${newModel}.`,
    });
  };

  const handleMembershipUpdate = async () => {
    // Refresh component data after membership update
    await initializeComponent();
    toast({
      title: "Membership Updated",
      description: "Your membership status has been updated successfully.",
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const isMembershipActive = () => {
    return membershipStatus === 'active';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading membership configuration...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profileContext) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-medium text-red-800 mb-2">Profile Context Missing</h3>
          <p className="text-red-700 mb-4">
            Unable to load profile context. Please ensure your profile is complete.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Step 1: Membership Decision
  if (currentStep === 'membership_decision') {
    return (
      <EnhancedMembershipCard
        membershipStatus={membershipStatus || 'inactive'}
        membershipFees={membershipFees[0] || null}
        onJoinMembership={() => handleMembershipDecision('active')}
        onManageMembership={() => handleMembershipDecision('inactive')}
        loading={false}
      />
    );
  }

  // Step 2: Tier Selection
  if (currentStep === 'tier_selection') {
    // Transform available tiers to detailed tier card format
    const tierCardConfigs = availableTiers.map(tierConfig => ({
      ...tierConfig,
      pricing_tier_name: tierConfig.master_pricing_tiers?.name || 'Unknown',
      currency_symbol: tierConfig.master_currencies?.symbol || '$',
      currency_code: tierConfig.master_currencies?.code || 'USD',
      // Add default analytics access data
      analytics_access_name: 'Standard Analytics',
      analytics_access_description: 'Basic analytics and reporting features',
      analytics_dashboard_access: true,
      analytics_features_included: ['Basic Reports', 'Challenge Metrics'],
      // Add default support data
      support_type_name: 'Standard Support',
      support_type_description: 'Standard customer support services',
      support_service_level: 'Standard',
      support_response_time: '24-48 hours',
      support_availability: 'Business Hours',
      // Add default onboarding data
      onboarding_type_name: 'Standard Onboarding',
      onboarding_type_description: 'Standard onboarding process',
      onboarding_service_type: 'Self-Service',
      onboarding_resources_included: ['Documentation', 'Video Tutorials'],
      // Add default workflow data
      workflow_template_name: 'Standard Templates',
      workflow_template_description: 'Standard workflow templates',
      workflow_template_type: 'Standard',
      workflow_customization_level: 'Basic',
      workflow_template_count: 5
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Select Your Pricing Tier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierCardConfigs.map((config, index) => (
              <DetailedTierCard
                key={config.id}
                config={config}
                isSelected={selectedTier === config.pricing_tier_name}
                isCurrent={false}
                isRecommended={index === 1} // Recommend the second tier (usually Standard)
                onSelect={() => handleTierSelection(config.pricing_tier_name)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Engagement Model Selection
  if (currentStep === 'engagement_model_selection') {
    return (
      <EnhancedEngagementModelCard
        selectedModel={selectedEngagementModel}
        onModelSelect={(modelName, modelDetails) => {
          handleEngagementModelSelection(modelName);
        }}
        selectedTier={selectedTier}
        countryName={profileContext?.country}
      />
    );
  }

  // Step 4: Terms Acceptance
  if (currentStep === 'terms_acceptance') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review and Accept Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Your Configuration Summary:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Membership Status:</span>
                  <Badge variant={membershipStatus === 'active' ? "default" : "outline"}>
                    {membershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pricing Tier:</span>
                  <span className="font-medium">{selectedTier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement Model:</span>
                  <span className="font-medium">{selectedEngagementModel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="terms" className="text-sm">
              I accept the terms and conditions for this configuration
            </label>
          </div>

          <Button 
            onClick={handleTermsAcceptance}
            disabled={!termsAccepted || saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Completing Setup...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Step 5: Completed
  if (currentStep === 'completed') {
    return (
      <>
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Setup Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-medium mb-3">Your Current Configuration:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Membership: </span>
                      <Badge variant={membershipStatus === 'active' ? "default" : "outline"}>
                        {membershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('👤 Opening membership modal with status:', membershipStatus);
                        setShowMembershipModal(true);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      {isMembershipActive() ? 'View' : 'Edit'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Pricing Tier: {selectedTier}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🎯 Opening tier modal with context:', profileContext);
                        setShowTierModal(true);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Engagement Model: {selectedEngagementModel}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('⚡ Opening model modal with context:', profileContext);
                        setShowModelModal(true);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center text-green-700">
                <p>🎉 Your membership and engagement model setup is complete!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You can now start creating innovation challenges on the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modals */}
        <TierEditModal
          isOpen={showTierModal}
          onClose={() => setShowTierModal(false)}
          currentTier={selectedTier}
          userId={userId}
          membershipStatus={membershipStatus || 'inactive'}
          profileContext={profileContext}
          onTierChange={handleTierEdit}
        />

        <EngagementModelEditModal
          isOpen={showModelModal}
          onClose={() => setShowModelModal(false)}
          currentModel={selectedEngagementModel}
          selectedTier={selectedTier}
          userId={userId}
          membershipStatus={membershipStatus || 'inactive'}
          profileContext={profileContext}
          onModelChange={handleModelEdit}
        />

        {/* Membership Modal - View or Edit based on status */}
        {isMembershipActive() ? (
          <MembershipViewModal
            isOpen={showMembershipModal}
            onClose={() => setShowMembershipModal(false)}
            membershipData={{
              status: membershipStatus,
              type: 'Premium',
              createdAt: new Date().toISOString(),
              pricingTier: selectedTier,
              paymentAmount: membershipFees[0]?.annual_amount,
              paymentCurrency: membershipFees[0]?.annual_currency,
              paymentStatus: 'paid'
            }}
            engagementData={{
              model: selectedEngagementModel,
              features: ['Premium Support', 'Analytics Access', 'Priority Processing'],
              supportLevel: 'Premium',
              analyticsAccess: true
            }}
          />
        ) : (
          <MembershipEditModal
            isOpen={showMembershipModal}
            onClose={() => setShowMembershipModal(false)}
            userId={userId}
            organizationData={profileContext}
            onPaymentSuccess={handleMembershipUpdate}
          />
        )}
      </>
    );
  }

  // Fallback for unknown steps
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-medium text-red-800 mb-2">Unknown Step</h3>
        <p className="text-red-700 mb-4">
          Current step: {currentStep}. This step is not recognized.
        </p>
        <Button 
          onClick={() => {
            setCurrentStep('membership_decision');
            saveCurrentState({ workflow_step: 'membership_decision' });
          }}
          variant="outline"
        >
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
};
