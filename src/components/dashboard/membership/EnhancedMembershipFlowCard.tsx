
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Target, Zap, CheckCircle, Edit, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MembershipDataService } from '@/services/MembershipDataService';
import { TierEditModal } from './TierEditModal';
import { EngagementModelEditModal } from './EngagementModelEditModal';

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

  // Normalized profile context
  const profileContext = {
    country: profile?.country || 'India',
    organization_type: profile?.organization_type || '',
    entity_type: profile?.entity_type || '',
    original_profile: profile
  };

  useEffect(() => {
    if (userId && profile) {
      initializeComponent();
    }
  }, [userId, profile]);

  const initializeComponent = async () => {
    try {
      setLoading(true);
      
      // Load saved data first
      await loadSavedData();
      
      // Load master data
      await loadMasterData();
      
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
        
        // Map database workflow_step to component currentStep
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
      } else {
        console.log('📝 No saved data found, starting fresh');
        setCurrentStep('membership_decision');
      }
    } catch (error) {
      console.error('❌ Error loading saved data:', error);
      setCurrentStep('membership_decision');
    }
  };

  const loadMasterData = async () => {
    try {
      // Load membership fees
      const fees = await MembershipDataService.getMembershipFees(
        profileContext.country,
        profileContext.organization_type,
        profileContext.entity_type
      );
      setMembershipFees(Array.isArray(fees) ? fees : [fees].filter(Boolean));

      // Load available tiers
      const { data: tierConfigs } = await supabase
        .from('master_tier_configurations')
        .select(`
          *,
          master_pricing_tiers!inner(name, level_order, description),
          master_currencies(code, symbol)
        `)
        .eq('is_active', true)
        .order('master_pricing_tiers(level_order)');

      setAvailableTiers(tierConfigs || []);

      // Load available engagement models
      const { data: models } = await supabase
        .from('master_engagement_models')
        .select('*')
        .order('name');

      setAvailableModels(models || []);

      console.log('✅ Loaded master data - Tiers:', tierConfigs?.length, 'Models:', models?.length);
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
          country: profileContext.country,
          organization_type: profileContext.organization_type,
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

  const handleTierEdit = (newTier: string) => {
    setSelectedTier(newTier);
    saveCurrentState({ pricing_tier: newTier });
  };

  const handleModelEdit = (newModel: string) => {
    setSelectedEngagementModel(newModel);
    saveCurrentState({ engagement_model: newModel });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
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

  // Step 1: Membership Decision
  if (currentStep === 'membership_decision') {
    const annualFee = membershipFees[0]?.annual_amount || 0;
    const currency = membershipFees[0]?.annual_currency || 'USD';

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Choose Your Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Active Membership Option */}
            <Card className="cursor-pointer border-2 hover:border-green-500 transition-colors"
                  onClick={() => handleMembershipDecision('active')}>
              <CardHeader>
                <CardTitle className="text-green-600">Become a Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(annualFee, currency)} / year
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Up to 20% discount on engagement fees
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority support and faster response times
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Access to exclusive member resources
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Non-Member Option */}
            <Card className="cursor-pointer border-2 hover:border-blue-500 transition-colors"
                  onClick={() => handleMembershipDecision('inactive')}>
              <CardHeader>
                <CardTitle className="text-blue-600">Continue Without Membership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-blue-600">
                    No Annual Fee
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Standard engagement model pricing</li>
                    <li>• Regular support response times</li>
                    <li>• Access to basic platform features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Tier Selection
  if (currentStep === 'tier_selection') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Select Your Pricing Tier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTiers.map((tierConfig) => (
              <Card 
                key={tierConfig.id}
                className="cursor-pointer border-2 hover:border-purple-500 transition-colors"
                onClick={() => handleTierSelection(tierConfig.master_pricing_tiers?.name)}
              >
                <CardHeader>
                  <CardTitle>{tierConfig.master_pricing_tiers?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Challenges:</span>
                        <span className="font-medium">
                          {tierConfig.monthly_challenge_limit || 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixed Charge:</span>
                        <span className="font-medium">
                          {formatCurrency(tierConfig.fixed_charge_per_challenge || 0, tierConfig.master_currencies?.code)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Solutions per Challenge:</span>
                        <span className="font-medium">
                          {tierConfig.solutions_per_challenge || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Engagement Model Selection
  if (currentStep === 'engagement_model_selection') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Select Your Engagement Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {availableModels.map((model) => (
              <Card 
                key={model.id}
                className="cursor-pointer border-2 hover:border-orange-500 transition-colors"
                onClick={() => handleEngagementModelSelection(model.name)}
              >
                <CardHeader>
                  <CardTitle>{model.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {model.description || 'Engagement model for your innovation challenges'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Membership: </span>
                    <Badge variant={membershipStatus === 'active' ? "default" : "outline"}>
                      {membershipStatus === 'active' ? 'Active Member' : 'Non-Member'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Pricing Tier: {selectedTier}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTierModal(true)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Engagement Model: {selectedEngagementModel}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModelModal(true)}
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

  return (
    <>
      {/* Main component content above */}
      
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
    </>
  );
};
