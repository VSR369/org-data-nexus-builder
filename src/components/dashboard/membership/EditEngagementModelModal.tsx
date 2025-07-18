
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { GlobalEngagementModelService } from '@/services/globalEngagementModelService';

interface EditEngagementModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string | null;
  selectedTier: string | null;
  userId: string;
  membershipStatus: string;
  profile: any;
  onModelChange: (model: string) => void;
}

export const EditEngagementModelModal: React.FC<EditEngagementModelModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  selectedTier,
  userId,
  membershipStatus,
  profile,
  onModelChange
}) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(currentModel);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [modelPricing, setModelPricing] = useState<any[]>([]);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableModels();
      setSelectedModel(currentModel);
    }
  }, [isOpen, currentModel, selectedTier]);

  useEffect(() => {
    if (selectedModel && selectedModel !== currentModel) {
      validateModelSwitch();
    }
  }, [selectedModel, currentModel]);

  const loadAvailableModels = async () => {
    try {
      setLoading(true);
      
      if (!selectedTier) return;

      // Get tier ID
      const { data: tierData } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .eq('name', selectedTier)
        .single();

      if (!tierData) return;

      // Get available models for this tier
      const { data: tierModelAccess } = await supabase
        .from('master_tier_engagement_model_access')
        .select(`
          *,
          engagement_model:master_engagement_models(*)
        `)
        .eq('pricing_tier_id', tierData.id)
        .eq('is_active', true)
        .eq('is_allowed', true);

      setAvailableModels(tierModelAccess || []);

      // Load pricing for all models
      await loadModelPricing();
    } catch (error) {
      console.error('Error loading models:', error);
      toast({
        title: "Error",
        description: "Failed to load available engagement models.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadModelPricing = async () => {
    try {
      if (!profile) return;

      const { data: pricingData, error } = await supabase
        .rpc('get_pricing_configuration', {
          p_country_name: profile.country,
          p_organization_type: profile.organization_type,
          p_entity_type: profile.entity_type,
          p_engagement_model: selectedModel || currentModel || 'Market Place',
          p_membership_status: membershipStatus === 'active' ? 'Active' : 'Not Active'
        });

      if (error) {
        console.error('Error loading pricing:', error);
        return;
      }

      setModelPricing(pricingData || []);
    } catch (error) {
      console.error('Error loading model pricing:', error);
    }
  };

  const validateModelSwitch = async () => {
    try {
      if (!selectedModel || !selectedTier) return;

      // Get tier and model IDs for validation
      const { data: tierData } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .eq('name', selectedTier)
        .single();

      const { data: modelData } = await supabase
        .from('master_engagement_models')
        .select('id')
        .eq('name', selectedModel)
        .single();

      if (!tierData || !modelData) return;

      const validation = await GlobalEngagementModelService.validateModelSwitch(
        userId,
        tierData.id,
        modelData.id
      );

      setValidationResult(validation);
    } catch (error) {
      console.error('Error validating model switch:', error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedModel || selectedModel === currentModel) {
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

    onModelChange(selectedModel);
    onClose();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    // Handle null, undefined, or empty currency codes
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Change Engagement Model
          </DialogTitle>
          <DialogDescription>
            Select a new engagement model. Your current model is <strong>{currentModel}</strong>.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModels.map((modelAccess) => (
                <Card 
                  key={modelAccess.id}
                  className={`cursor-pointer transition-all ${
                    selectedModel === modelAccess.engagement_model?.name
                      ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModel(modelAccess.engagement_model?.name)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{modelAccess.engagement_model?.name}</span>
                      {selectedModel === modelAccess.engagement_model?.name && (
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {modelAccess.engagement_model?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Selection Scope:</span>
                        <Badge variant="outline">
                          {modelAccess.selection_scope === 'global' ? 'Global' : 'Per Challenge'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Concurrent:</span>
                        <span className="font-medium">{modelAccess.max_concurrent_models}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Multiple Challenges:</span>
                        <Badge variant={modelAccess.allows_multiple_challenges ? "default" : "secondary"}>
                          {modelAccess.allows_multiple_challenges ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>

                    {modelPricing.length > 0 && selectedModel === modelAccess.engagement_model?.name && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-2">Pricing:</p>
                        {modelPricing.map((pricing, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between">
                              <span>{pricing.config_name}:</span>
                              <span className="font-medium">
                                {formatCurrency(pricing.calculated_value, pricing.currency_code)}
                              </span>
                            </div>
                            {pricing.membership_discount > 0 && (
                              <p className="text-green-600 text-xs">
                                {pricing.membership_discount}% member discount applied
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={
                  !selectedModel || 
                  selectedModel === currentModel || 
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
