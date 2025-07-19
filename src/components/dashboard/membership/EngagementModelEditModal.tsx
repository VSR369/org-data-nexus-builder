
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, X, AlertTriangle, DollarSign, TrendingUp, Users, Briefcase, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { GlobalEngagementModelService } from '@/services/globalEngagementModelService';
import { MembershipDataService } from '@/services/MembershipDataService';
import { DataSynchronizationService } from '@/services/DataSynchronizationService';

interface EngagementModelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string | null;
  selectedTier: string | null;
  userId: string;
  membershipStatus: string;
  profileContext: any; // Already normalized profile context
  onModelChange: (model: string) => void;
}

export const EngagementModelEditModal: React.FC<EngagementModelEditModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  selectedTier,
  userId,
  membershipStatus,
  profileContext,
  onModelChange
}) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(currentModel);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [modelDetails, setModelDetails] = useState<any[]>([]);
  const [modelPricing, setModelPricing] = useState<any[]>([]);
  const [complexityPricing, setComplexityPricing] = useState<any>({});
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedSelections, setSavedSelections] = useState<any>(null);

  useEffect(() => {
    if (isOpen && profileContext) {
      initializeModal();
      setSelectedModel(currentModel);
    }
  }, [isOpen, currentModel, selectedTier, profileContext]);

  useEffect(() => {
    if (selectedModel && selectedModel !== currentModel) {
      validateModelSwitch();
    }
  }, [selectedModel, currentModel]);

  const initializeModal = async () => {
    try {
      setLoading(true);
      console.log('🔄 Modal initialized with profile context:', profileContext);
      
      // First, load saved selections to use as single source of truth
      await loadSavedSelections();
      
      // Then load available models
      await loadAvailableModels();
    } catch (error) {
      console.error('❌ Error initializing modal:', error);
      toast({
        title: "Error",
        description: "Failed to load engagement model data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSelections = async () => {
    try {
      const selections = await DataSynchronizationService.getCurrentSelections(userId);
      setSavedSelections(selections);
      console.log('✅ Loaded saved selections:', selections);
    } catch (error) {
      console.error('❌ Error loading saved selections:', error);
    }
  };

  const loadAvailableModels = async () => {
    try {
      console.log('🔄 Loading available models for tier:', selectedTier, 'with context:', profileContext);
      
      if (!selectedTier || !profileContext) {
        console.log('❌ Missing required data - tier:', selectedTier, 'context:', profileContext);
        return;
      }

      // Get tier ID using case-insensitive matching
      const { data: tierData, error: tierError } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .ilike('name', DataSynchronizationService.normalizeName(selectedTier))
        .single();

      if (tierError) {
        console.error('❌ Error fetching tier data:', tierError);
        return;
      }

      if (!tierData) {
        console.log('❌ No tier found with name:', selectedTier);
        return;
      }

      console.log('✅ Found tier:', tierData);

      // Get available models for this tier
      const { data: tierModelAccess, error: accessError } = await supabase
        .from('master_tier_engagement_model_access')
        .select(`
          *,
          engagement_model:master_engagement_models(*)
        `)
        .eq('pricing_tier_id', tierData.id)
        .eq('is_active', true)
        .eq('is_allowed', true);

      if (accessError) {
        console.error('❌ Error fetching model access:', accessError);
        return;
      }

      console.log('✅ Found available models:', tierModelAccess);
      setAvailableModels(tierModelAccess || []);

      // Load detailed information for each model
      await loadModelDetails(tierModelAccess || []);
      
      // Load pricing for all models including complexity
      await loadModelPricingWithComplexity();
    } catch (error) {
      console.error('❌ Error loading models:', error);
      toast({
        title: "Error",
        description: "Failed to load available engagement models.",
        variant: "destructive"
      });
    }
  };

  const loadModelDetails = async (models: any[]) => {
    try {
      if (!profileContext?.country) {
        console.error('❌ No country in profile context for model details');
        return;
      }

      const detailsPromises = models.map(async (modelAccess) => {
        const modelName = modelAccess.engagement_model?.name;
        if (!modelName) return null;
        
        const details = await MembershipDataService.getEngagementModelDetails(modelName, profileContext.country);
        return {
          ...modelAccess,
          detailed_info: details
        };
      });

      const detailedModels = await Promise.all(detailsPromises);
      setModelDetails(detailedModels.filter(Boolean));
      console.log('✅ Loaded model details');
    } catch (error) {
      console.error('❌ Error loading model details:', error);
    }
  };

  const loadModelPricingWithComplexity = async () => {
    try {
      if (!profileContext) {
        console.error('❌ No profile context for pricing');
        return;
      }

      // Load standard pricing using profile context
      const { data: pricingData, error } = await supabase
        .rpc('get_pricing_configuration', {
          p_country_name: profileContext.country,
          p_organization_type: profileContext.organization_type,
          p_entity_type: profileContext.entity_type,
          p_engagement_model: selectedModel || currentModel || 'Market Place',
          p_membership_status: membershipStatus === 'active' ? 'Active' : 'Not Active'
        });

      if (error) {
        console.error('❌ Error loading pricing:', error);
        return;
      }

      setModelPricing(pricingData || []);
      console.log('✅ Loaded pricing with profile context');

      // Load complexity pricing for marketplace models
      const complexityData = {};
      const marketplaceModels = ['Market Place', 'Market Place & Aggregator', 'Aggregator'];
      
      for (const model of marketplaceModels) {
        const complexityPricingData = await MembershipDataService.getMarketplacePricingWithComplexity(
          profileContext.country,
          profileContext.organization_type,
          profileContext.entity_type,
          model,
          membershipStatus === 'active' ? 'Active' : 'Not Active'
        );
        complexityData[model] = complexityPricingData;
      }
      
      setComplexityPricing(complexityData);
    } catch (error) {
      console.error('❌ Error loading model pricing:', error);
    }
  };

  const validateModelSwitch = async () => {
    try {
      if (!selectedModel || !selectedTier) return;

      // Get tier and model IDs for validation using case-insensitive matching
      const { data: tierData } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .ilike('name', DataSynchronizationService.normalizeName(selectedTier))
        .single();

      const { data: modelData } = await supabase
        .from('master_engagement_models')
        .select('id')
        .ilike('name', DataSynchronizationService.normalizeName(selectedModel))
        .single();

      if (!tierData || !modelData) return;

      const validation = await GlobalEngagementModelService.validateModelSwitch(
        userId,
        tierData.id,
        modelData.id
      );

      setValidationResult(validation);
      console.log('✅ Model switch validation completed:', validation);
    } catch (error) {
      console.error('❌ Error validating model switch:', error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedModel || isModelCurrent(selectedModel)) {
      onClose();
      return;
    }

    if (validationResult && !validationResult.allowed) {
      toast({
        title: "Change Not Allowed",
        description: validationResult.reason || "Cannot change engagement model at this time.",
        variant: "destructive"
      });
      return;
    }

    console.log('🔄 Confirming model change:', currentModel, '->', selectedModel);
    onModelChange(selectedModel);
    onClose();
  };

  const getModelIcon = (modelName: string) => {
    const name = modelName?.toLowerCase() || '';
    if (name.includes('aggregator')) return <Briefcase className="h-5 w-5 text-orange-600" />;
    if (name.includes('market')) return <Users className="h-5 w-5 text-blue-600" />;
    return <Users className="h-5 w-5 text-purple-600" />;
  };

  const getModelDescription = (modelName: string, details: any) => {
    const name = modelName?.toLowerCase() || '';
    if (name.includes('aggregator')) {
      return "Direct engagement with curated solution providers through our aggregation platform";
    }
    if (name.includes('market')) {
      return "Open marketplace where multiple solution providers compete for your challenges";
    }
    return details?.description || "Customized engagement model for your specific needs";
  };

  const isMarketplaceModel = (modelName: string) => {
    const marketplaceModels = ['Market Place', 'Market Place & Aggregator', 'Aggregator'];
    return marketplaceModels.includes(modelName);
  };

  // Case-insensitive model comparison
  const isModelSelected = (modelName: string) => {
    return DataSynchronizationService.normalizeName(modelName) === DataSynchronizationService.normalizeName(selectedModel || '');
  };

  const isModelCurrent = (modelName: string) => {
    return DataSynchronizationService.normalizeName(modelName) === DataSynchronizationService.normalizeName(currentModel || '');
  };

  const renderComplexityPricing = (modelName: string) => {
    const complexityData = complexityPricing[modelName];
    if (!complexityData?.complexityPricing?.length) return null;

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
          <Calculator className="h-4 w-4" />
          Complexity-Based Pricing
        </div>
        <div className="grid grid-cols-2 gap-2">
          {complexityData.complexityPricing.map((complexity: any) => (
            <div key={complexity.id} className="bg-white p-3 rounded border space-y-2">
              <div className="font-medium text-xs text-gray-800">{complexity.name}</div>
              {complexity.fees.map((fee: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consulting:</span>
                      <div className="text-right">
                        {membershipStatus === 'active' && fee.membership_discount > 0 ? (
                          <>
                            <div className="line-through text-gray-400 text-xs">
                              {MembershipDataService.formatCurrency(fee.original_consulting_fee, fee.currency_code, fee.currency_symbol)}
                            </div>
                            <div className="font-medium text-green-600">
                              {MembershipDataService.formatCurrency(fee.calculated_consulting_fee, fee.currency_code, fee.currency_symbol)}
                            </div>
                          </>
                        ) : (
                          <div className="font-medium">
                            {MembershipDataService.formatCurrency(fee.calculated_consulting_fee, fee.currency_code, fee.currency_symbol)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Management:</span>
                      <div className="text-right">
                        {membershipStatus === 'active' && fee.membership_discount > 0 ? (
                          <>
                            <div className="line-through text-gray-400 text-xs">
                              {MembershipDataService.formatCurrency(fee.original_management_fee, fee.currency_code, fee.currency_symbol)}
                            </div>
                            <div className="font-medium text-green-600">
                              {MembershipDataService.formatCurrency(fee.calculated_management_fee, fee.currency_code, fee.currency_symbol)}
                            </div>
                          </>
                        ) : (
                          <div className="font-medium">
                            {MembershipDataService.formatCurrency(fee.calculated_management_fee, fee.currency_code, fee.currency_symbol)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee:</span>
                      <span className="font-medium">{fee.platform_fee_percentage}%</span>
                    </div>
                  </div>
                  {membershipStatus === 'active' && fee.membership_discount > 0 && (
                    <div className="bg-green-100 p-1 rounded text-green-800 text-xs flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {fee.membership_discount}% member savings
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-600 italic">
          * Complexity level is selected during challenge submission based on your specific requirements
        </div>
      </div>
    );
  };

  // Show error state if profile context is missing
  if (isOpen && !profileContext) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Configuration Error
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Unable to load engagement model data. Profile context is missing.
            </p>
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Change Engagement Model
          </DialogTitle>
          <DialogDescription>
            Select a new engagement model. Your current model is <strong>{currentModel}</strong>.
            {savedSelections && (
              <div className="text-xs text-gray-500 mt-1">
                Last saved: {savedSelections.engagement_model} (selected {new Date(savedSelections.engagement_model_selected_at || savedSelections.updated_at).toLocaleDateString()})
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {validationResult && !validationResult.allowed && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Change Blocked</span>
                </div>
                <p className="text-red-700 mt-1">{validationResult.reason}</p>
                {validationResult.active_challenges_count > 0 && (
                  <p className="text-red-600 text-sm mt-1">
                    Active challenges: {validationResult.active_challenges_count}
                  </p>
                )}
              </div>
            )}

            {availableModels.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Models Available</h3>
                <p className="text-gray-600">
                  No engagement models are configured for your current tier "{selectedTier}".
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please contact support to configure engagement models for your tier.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modelDetails.map((modelDetail) => {
                  const modelAccess = modelDetail;
                  const modelName = modelAccess.engagement_model?.name;
                  const details = modelDetail.detailed_info;
                  const isSelected = isModelSelected(modelName);
                  const isCurrent = isModelCurrent(modelName);
                  
                  return (
                    <Card 
                      key={modelAccess.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedModel(modelName)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getModelIcon(modelName)}
                            <span>{modelName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                Current
                              </Badge>
                            )}
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {getModelDescription(modelName, details)}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Model Configuration */}
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Zap className="h-4 w-4 text-purple-600" />
                            Model Configuration
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Selection:</span>
                              <Badge variant="outline" className="ml-1 text-xs">
                                {modelAccess.selection_scope === 'global' ? 'Global' : 'Per Challenge'}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-gray-600">Max Concurrent:</span>
                              <div className="font-medium">{modelAccess.max_concurrent_models}</div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">Multiple Challenges:</span>
                              <Badge variant={modelAccess.allows_multiple_challenges ? "default" : "secondary"} className="ml-1 text-xs">
                                {modelAccess.allows_multiple_challenges ? 'Allowed' : 'Single Only'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Complexity-Based Pricing for Marketplace Models */}
                        {isMarketplaceModel(modelName) && (
                          renderComplexityPricing(modelName)
                        )}

                        {/* Platform Fee Information */}
                        {details?.platform_fee_formulas && details.platform_fee_formulas.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                              <DollarSign className="h-4 w-4" />
                              Platform Fees
                            </div>
                            {details.platform_fee_formulas.slice(0, 2).map((formula: any, index: number) => (
                              <div key={index} className="space-y-1 text-xs">
                                <div className="font-medium">{formula.formula_name}</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-gray-600">Platform Fee:</span>
                                    <div className="font-medium">
                                      {formula.platform_usage_fee_percentage || 0}%
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Advance:</span>
                                    <div className="font-medium">
                                      {formula.advance_payment_percentage || 25}%
                                    </div>
                                  </div>
                                  {formula.base_consulting_fee > 0 && (
                                    <div>
                                      <span className="text-gray-600">Base Consulting:</span>
                                      <div className="font-medium">
                                        {MembershipDataService.formatCurrency(
                                          formula.base_consulting_fee,
                                          formula.master_currencies?.code,
                                          formula.master_currencies?.symbol
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {formula.base_management_fee > 0 && (
                                    <div>
                                      <span className="text-gray-600">Base Management:</span>
                                      <div className="font-medium">
                                        {MembershipDataService.formatCurrency(
                                          formula.base_management_fee,
                                          formula.master_currencies?.code,
                                          formula.master_currencies?.symbol
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {formula.membership_discount_percentage > 0 && membershipStatus === 'active' && (
                                  <div className="bg-green-100 p-1 rounded text-green-800">
                                    <TrendingUp className="h-3 w-3 inline mr-1" />
                                    {formula.membership_discount_percentage}% member discount applied
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Switch Requirements */}
                        {modelAccess.switch_requirements && modelAccess.switch_requirements !== 'none' && (
                          <div className="bg-amber-50 p-2 rounded text-xs">
                            <div className="font-medium text-amber-800">Switch Requirements:</div>
                            <div className="text-amber-700">
                              {modelAccess.switch_requirements.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </div>
                          </div>
                        )}

                        {/* Current Pricing Context */}
                        {isSelected && modelPricing.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-green-800 mb-2">Your Current Pricing:</div>
                            {modelPricing.slice(0, 3).map((pricing, index) => (
                              <div key={index} className="flex justify-between text-xs mb-1">
                                <span>{pricing.config_name}:</span>
                                <span className="font-medium">
                                  {MembershipDataService.formatCurrency(pricing.calculated_value, pricing.currency_code)}
                                </span>
                              </div>
                            ))}
                            {membershipStatus === 'active' && (
                              <div className="text-green-600 text-xs mt-1">
                                ✓ Member pricing applied
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={
                  !selectedModel || 
                  isModelCurrent(selectedModel) || 
                  (validationResult && !validationResult.allowed)
                }
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Change
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
