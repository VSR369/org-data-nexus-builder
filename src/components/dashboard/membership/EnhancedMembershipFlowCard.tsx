import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Crown, 
  Zap, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MembershipDataService } from '@/services/MembershipDataService';
import { DataSynchronizationService } from '@/services/DataSynchronizationService';
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
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<string>('membership_decision');
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  const [savedSelections, setSavedSelections] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  
  // Configuration data
  const [tierConfigurations, setTierConfigurations] = useState<any[]>([]);
  const [membershipFees, setMembershipFees] = useState<any[]>([]);
  
  // User selections
  const [membershipDecision, setMembershipDecision] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [membershipStatus, setMembershipStatus] = useState<string>('inactive');
  
  // Modal states
  const [showTierEditModal, setShowTierEditModal] = useState(false);
  const [showModelEditModal, setShowModelEditModal] = useState(false);
  
  // Profile context
  const [profileContext, setProfileContext] = useState<any>(null);

  useEffect(() => {
    initializeComponent();
  }, [profile, userId]);

  const initializeComponent = async () => {
    try {
      setLoading(true);
      
      // Get normalized profile context first
      const normalizedContext = await DataSynchronizationService.getNormalizedProfileContext(profile);
      setProfileContext(normalizedContext);
      console.log('🔄 Component initialized with profile context:', normalizedContext);
      
      // Synchronize existing selections with current profile context
      const syncResult = await DataSynchronizationService.synchronizeSelections(userId, normalizedContext);
      if (syncResult) {
        console.log('✅ Selection synchronization result:', syncResult);
        setSavedSelections(syncResult.savedSelections);
        setValidationResult(syncResult.validation);
      }
      
      // Continue with existing initialization
      await Promise.all([
        loadWorkflowStatus(),
        loadTierConfigurations(),
        loadMembershipFees()
      ]);
    } catch (error) {
      console.error('❌ Error initializing component:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading workflow status:', error);
        return;
      }

      if (data) {
        setWorkflowStatus(data);
        setCurrentStep(data.workflow_step || 'membership_decision');
        setMembershipDecision(data.membership_status || '');
        setSelectedTier(data.pricing_tier || '');
        setSelectedModel(data.engagement_model || '');
        setSelectedFrequency(data.selected_frequency || '');
        setSelectedPaymentMethod(data.mem_payment_method || '');
        setTermsAccepted(data.terms_accepted || false);
        setMembershipStatus(data.activation_status === 'Activated' ? 'active' : 'inactive');
        
        console.log('✅ Loaded workflow status:', data);
      } else {
        console.log('📝 No existing workflow found, starting fresh');
      }
    } catch (error) {
      console.error('❌ Error loading workflow status:', error);
    }
  };

  const loadTierConfigurations = async () => {
    try {
      if (!profile?.country) {
        console.error('❌ No country in profile for tier configurations');
        return;
      }

      const configurations = await MembershipDataService.getMembershipFees(
        profile.country,
        profile.organization_type,
        profile.entity_type
      );
      setTierConfigurations(configurations);
      console.log('✅ Loaded tier configurations:', configurations.length);
    } catch (error) {
      console.error('❌ Error loading tier configurations:', error);
    }
  };

  const loadMembershipFees = async () => {
    try {
      if (!profile?.country || !profile?.organization_type || !profile?.entity_type) {
        console.error('❌ Incomplete profile data for membership fees');
        return;
      }

      const fees = await MembershipDataService.getMembershipFees(
        profile.country,
        profile.organization_type,
        profile.entity_type
      );
      setMembershipFees(fees);
      console.log('✅ Loaded membership fees:', fees.length);
    } catch (error) {
      console.error('❌ Error loading membership fees:', error);
    }
  };

  const handleMembershipDecision = async (decision: string) => {
    try {
      setMembershipDecision(decision);
      
      const { data, error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          membership_status: decision === 'yes' ? 'active' : 'inactive',
          workflow_step: decision === 'yes' ? 'tier_selection' : 'completed',
          country: profile.country,
          organization_type: profile.organization_type,
          entity_type: profile.entity_type,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving membership decision:', error);
        toast({
          title: "Error",
          description: "Failed to save membership decision.",
          variant: "destructive"
        });
        return;
      }

      setWorkflowStatus(data);
      setCurrentStep(decision === 'yes' ? 'tier_selection' : 'completed');
      
      toast({
        title: "Decision Saved",
        description: `Membership decision: ${decision === 'yes' ? 'Yes' : 'No'}`,
      });
    } catch (error) {
      console.error('Error handling membership decision:', error);
    }
  };

  const handleTierSelection = async (tier: string) => {
    try {
      setSelectedTier(tier);
      
      const { data, error } = await supabase
        .from('engagement_activations')
        .update({
          pricing_tier: tier,
          tier_selected_at: new Date().toISOString(),
          current_step: 'engagement_model_selection',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error saving tier selection:', error);
        toast({
          title: "Error",
          description: "Failed to save tier selection.",
          variant: "destructive"
        });
        return;
      }

      setWorkflowStatus(data);
      setCurrentStep('engagement_model_selection');
      
      toast({
        title: "Tier Selected",
        description: `Selected pricing tier: ${tier}`,
      });
    } catch (error) {
      console.error('Error handling tier selection:', error);
    }
  };

  const handleEngagementModelSelection = async (model: string) => {
    try {
      setSelectedModel(model);
      
      const { data, error } = await supabase
        .from('engagement_activations')
        .update({
          engagement_model: model,
          engagement_model_selected_at: new Date().toISOString(),
          current_step: 'frequency_selection',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error saving engagement model selection:', error);
        toast({
          title: "Error",
          description: "Failed to save engagement model selection.",
          variant: "destructive"
        });
        return;
      }

      setWorkflowStatus(data);
      setCurrentStep('frequency_selection');
      
      toast({
        title: "Model Selected",
        description: `Selected engagement model: ${model}`,
      });
    } catch (error) {
      console.error('Error handling engagement model selection:', error);
    }
  };

  const handleFrequencySelection = async (frequency: string) => {
    try {
      setSelectedFrequency(frequency);
      
      const { data, error } = await supabase
        .from('engagement_activations')
        .update({
          payment_frequency: frequency,
          frequency_selected_at: new Date().toISOString(),
          current_step: 'payment_simulation',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error saving frequency selection:', error);
        toast({
          title: "Error",
          description: "Failed to save frequency selection.",
          variant: "destructive"
        });
        return;
      }

      setWorkflowStatus(data);
      setCurrentStep('payment_simulation');
      
      toast({
        title: "Frequency Selected",
        description: `Selected payment frequency: ${frequency}`,
      });
    } catch (error) {
      console.error('Error handling frequency selection:', error);
    }
  };

  const handlePaymentSimulation = async () => {
    try {
      const { data, error } = await supabase
        .from('engagement_activations')
        .update({
          payment_simulated_at: new Date().toISOString(),
          current_step: 'terms_acceptance',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error saving payment simulation:', error);
        toast({
          title: "Error",
          description: "Failed to complete payment simulation.",
          variant: "destructive"
        });
        return;
      }

      setWorkflowStatus(data);
      setCurrentStep('terms_acceptance');
      
      toast({
        title: "Payment Simulated",
        description: "Payment simulation completed successfully.",
      });
    } catch (error) {
      console.error('Error handling payment simulation:', error);
    }
  };

  const handlePaymentMethodSelection = async (method: string) => {
    try {
      setSelectedPaymentMethod(method);
      
      const { data, error } = await supabase
        .from('engagement_activations')
        .update({
          payment_method: method,
          payment_method_selected_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error saving payment method:', error);
        return;
      }

      setWorkflowStatus(data);
      
      toast({
        title: "Payment Method Selected",
        description: `Selected payment method: ${method}`,
      });
    } catch (error) {
      console.error('Error handling payment method selection:', error);
    }
  };

  const handleTermsAcceptance = async () => {
    try {
      setTermsAccepted(true);
      
      const { data, error } = await supabase
        .from('engagement_activations')
        .update({
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
          current_step: 'completed',
          activation_status: 'Activated',
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error saving terms acceptance:', error);
        toast({
          title: "Error",
          description: "Failed to complete activation.",
          variant: "destructive"
        });
        return;
      }

      setWorkflowStatus(data);
      setCurrentStep('completed');
      setMembershipStatus('active');
      
      toast({
        title: "Activation Complete!",
        description: "Your membership has been successfully activated.",
      });
    } catch (error) {
      console.error('Error handling terms acceptance:', error);
    }
  };

  const handleTierEdit = async (newTier: string) => {
    try {
      await handleTierSelection(newTier);
      toast({
        title: "Tier Updated",
        description: `Pricing tier changed to: ${newTier}`,
      });
    } catch (error) {
      console.error('Error updating tier:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing tier.",
        variant: "destructive"
      });
    }
  };

  const handleModelEdit = async (newModel: string) => {
    try {
      await handleEngagementModelSelection(newModel);
      toast({
        title: "Model Updated",
        description: `Engagement model changed to: ${newModel}`,
      });
    } catch (error) {
      console.error('Error updating model:', error);
      toast({
        title: "Error",
        description: "Failed to update engagement model.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderMembershipDecision = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Join Our Membership Program?</h3>
        <p className="text-gray-600 mb-6">
          Unlock exclusive benefits, discounted rates, and priority access to our platform features.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Yes, I want membership
            </CardTitle>
            <CardDescription>
              Get access to discounted rates, priority support, and exclusive features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleMembershipDecision('yes')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue with Membership
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              No, continue without membership
            </CardTitle>
            <CardDescription>
              Use the platform with standard rates and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleMembershipDecision('no')}
              variant="outline"
              className="w-full"
            >
              Continue Without Membership
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTierSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Select Your Pricing Tier</h3>
          <p className="text-gray-600">
            Choose the tier that best fits your organization's needs
          </p>
        </div>
        {selectedTier && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTierEditModal(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Tier
          </Button>
        )}
      </div>
      
      {tierConfigurations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tiers Available</h3>
          <p className="text-gray-600">
            No pricing tiers are configured for your location: {profile?.country}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tierConfigurations.map((tier) => (
            <Card 
              key={tier.id}
              className={`cursor-pointer transition-all ${
                selectedTier === tier.name
                  ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleTierSelection(tier.name)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{tier.name}</span>
                  {selectedTier === tier.name && (
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  )}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Max Challenges:</span>
                    <span className="font-medium">{tier.max_challenges_per_month}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Support Level:</span>
                    <Badge variant="outline">{tier.support_level}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Priority Access:</span>
                    <Badge variant={tier.priority_access ? "default" : "secondary"}>
                      {tier.priority_access ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
                
                {membershipFees.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Membership Fees:</p>
                    {membershipFees
                      .filter(fee => fee.pricing_tier_name === tier.name)
                      .slice(0, 2)
                      .map((fee, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between">
                            <span>{fee.frequency}:</span>
                            <span className="font-medium">
                              {formatCurrency(fee.calculated_fee, fee.currency_code)}
                            </span>
                          </div>
                          {fee.membership_discount > 0 && (
                            <p className="text-green-600 text-xs">
                              {fee.membership_discount}% discount applied
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderEngagementModelSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Select Engagement Model</h3>
          <p className="text-gray-600">
            Choose how you want to engage with solution providers
          </p>
        </div>
        {selectedModel && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowModelEditModal(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Model
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Market Place', 'Aggregator', 'Market Place & Aggregator'].map((model) => (
          <Card 
            key={model}
            className={`cursor-pointer transition-all ${
              selectedModel === model
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleEngagementModelSelection(model)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>{model}</span>
                </div>
                {selectedModel === model && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </CardTitle>
              <CardDescription>
                {model === 'Market Place' && 'Open marketplace with multiple solution providers'}
                {model === 'Aggregator' && 'Curated solutions through our aggregation platform'}
                {model === 'Market Place & Aggregator' && 'Hybrid approach with both options'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Multiple solution providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span>Quality assurance included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Flexible timeline management</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFrequencySelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Select Payment Frequency</h3>
        <p className="text-gray-600">
          Choose how often you'd like to pay your membership fees
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Monthly', 'Quarterly', 'Annually'].map((frequency) => {
          const feeData = membershipFees.find(fee => 
            fee.frequency === frequency && fee.pricing_tier_name === selectedTier
          );
          
          return (
            <Card 
              key={frequency}
              className={`cursor-pointer transition-all ${
                selectedFrequency === frequency
                  ? 'border-green-500 ring-2 ring-green-200 bg-green-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleFrequencySelection(frequency)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>{frequency}</span>
                  </div>
                  {selectedFrequency === frequency && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feeData ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(feeData.calculated_fee, feeData.currency_code)}
                    </div>
                    {feeData.membership_discount > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(feeData.original_fee, feeData.currency_code)}
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {feeData.membership_discount}% savings
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      {frequency === 'Monthly' && 'Billed every month'}
                      {frequency === 'Quarterly' && 'Billed every 3 months'}
                      {frequency === 'Annually' && 'Billed once per year'}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Pricing information not available
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPaymentSimulation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Payment Summary</h3>
        <p className="text-gray-600">
          Review your selections and simulate payment processing
        </p>
      </div>
      
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Pricing Tier</label>
              <p className="font-semibold">{selectedTier}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Engagement Model</label>
              <p className="font-semibold">{selectedModel}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Payment Frequency</label>
              <p className="font-semibold">{selectedFrequency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              {(() => {
                const feeData = membershipFees.find(fee => 
                  fee.frequency === selectedFrequency && fee.pricing_tier_name === selectedTier
                );
                return (
                  <p className="font-semibold text-lg text-green-600">
                    {feeData ? formatCurrency(feeData.calculated_fee, feeData.currency_code) : 'N/A'}
                  </p>
                );
              })()}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium">Select Payment Method</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Credit Card', 'Bank Transfer', 'Digital Wallet'].map((method) => (
                <Button
                  key={method}
                  variant={selectedPaymentMethod === method ? "default" : "outline"}
                  onClick={() => handlePaymentMethodSelection(method)}
                  className="justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {method}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handlePaymentSimulation}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!selectedPaymentMethod}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Simulate Payment Processing
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderTermsAcceptance = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
        <p className="text-gray-600">
          Please review and accept our terms to complete your membership activation
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Membership Agreement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <h4 className="font-medium mb-2">Terms of Service</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>By accepting these terms, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Comply with all platform policies and guidelines</li>
                <li>Pay membership fees according to selected frequency</li>
                <li>Use the platform responsibly and ethically</li>
                <li>Respect intellectual property rights</li>
                <li>Maintain confidentiality of sensitive information</li>
              </ul>
              <p className="mt-4">
                Your membership provides access to exclusive features, discounted rates, 
                and priority support. Membership can be cancelled at any time with 30 days notice.
              </p>
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
              I have read and agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          
          <Button 
            onClick={handleTermsAcceptance}
            disabled={!termsAccepted}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept Terms & Activate Membership
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompletedWorkflow = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold text-green-800 mb-2">
          {membershipDecision === 'yes' ? 'Membership Activated!' : 'Setup Complete!'}
        </h3>
        <p className="text-gray-600">
          {membershipDecision === 'yes' 
            ? 'Your membership has been successfully activated. You now have access to all member benefits.'
            : 'Your account setup is complete. You can start using the platform with standard features.'
          }
        </p>
      </div>
      
      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Your Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Membership Status</label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${membershipStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="font-semibold capitalize">{membershipStatus}</p>
              </div>
            </div>
            {selectedTier && (
              <div>
                <label className="text-sm font-medium text-gray-600">Pricing Tier</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{selectedTier}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTierEditModal(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {selectedModel && (
              <div>
                <label className="text-sm font-medium text-gray-600">Engagement Model</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{selectedModel}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModelEditModal(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {selectedFrequency && (
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Frequency</label>
                <p className="font-semibold">{selectedFrequency}</p>
              </div>
            )}
          </div>
          
          {membershipStatus === 'active' && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-green-800 mb-2">Member Benefits Active:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Discounted rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-600" />
                  <span>Exclusive features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Faster processing</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-600" />
          Membership & Engagement Setup
        </CardTitle>
        <CardDescription>
          Complete your membership activation to access full platform capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <>
            {/* Workflow Status */}
            {workflowStatus && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-900">Current Step:</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {workflowStatus.current_step?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                </div>
                <div className="text-sm text-blue-700">
                  Progress: {workflowStatus.is_complete ? 'Complete' : 'In Progress'}
                </div>
              </div>
            )}

            {/* Validation Issues */}
            {validationResult && !validationResult.isValid && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Configuration Issues Detected</span>
                </div>
                <div className="space-y-1">
                  {validationResult.issues.map((issue: string, index: number) => (
                    <p key={index} className="text-sm text-amber-700">• {issue}</p>
                  ))}
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  Please review and update your selections to resolve these issues.
                </p>
              </div>
            )}

            {/* Render workflow steps */}
            {currentStep === 'membership_decision' && renderMembershipDecision()}
            {currentStep === 'tier_selection' && renderTierSelection()}
            {currentStep === 'engagement_model_selection' && renderEngagementModelSelection()}
            {currentStep === 'frequency_selection' && renderFrequencySelection()}
            {currentStep === 'payment_simulation' && renderPaymentSimulation()}
            {currentStep === 'terms_acceptance' && renderTermsAcceptance()}
            {currentStep === 'completed' && renderCompletedWorkflow()}
          </>
        )}

        {/* Edit Modals */}
        <TierEditModal
          isOpen={showTierEditModal}
          onClose={() => setShowTierEditModal(false)}
          currentTier={selectedTier}
          userId={userId}
          membershipStatus={membershipStatus}
          profileContext={profileContext}
          onTierChange={handleTierEdit}
        />

        <EngagementModelEditModal
          isOpen={showModelEditModal}
          onClose={() => setShowModelEditModal(false)}
          currentModel={selectedModel}
          selectedTier={selectedTier}
          userId={userId}
          membershipStatus={membershipStatus}
          profileContext={profileContext}
          onModelChange={handleModelEdit}
        />
      </CardContent>
    </Card>
  );
};
