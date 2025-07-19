
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, X, AlertTriangle, Users, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EngagementModelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string | null;
  selectedTier: string | null;
  userId: string;
  membershipStatus: string;
  profileContext: any;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profileContext) {
      loadAvailableModels();
      setSelectedModel(currentModel);
    }
  }, [isOpen, currentModel, selectedTier, profileContext]);

  const loadAvailableModels = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading engagement models for tier:', selectedTier);
      
      if (!selectedTier) {
        // If no tier selected, show all models
        const { data: allModels } = await supabase
          .from('master_engagement_models')
          .select('*')
          .order('name');
        
        setAvailableModels(allModels || []);
        console.log('✅ Loaded all models (no tier restriction):', allModels?.length);
        return;
      }

      // Get tier ID
      const { data: tierData } = await supabase
        .from('master_pricing_tiers')
        .select('id')
        .ilike('name', selectedTier)
        .single();

      if (!tierData) {
        console.log('❌ No tier found with name:', selectedTier);
        return;
      }

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
      console.log('✅ Found available models for tier:', tierModelAccess?.length);
    } catch (error) {
      console.error('❌ Error loading models:', error);
      toast({
        title: "Error",
        description: "Failed to load available engagement models.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedModel && selectedModel !== currentModel) {
      onModelChange(selectedModel);
    }
    onClose();
  };

  const getModelIcon = (modelName: string) => {
    const name = modelName?.toLowerCase() || '';
    if (name.includes('aggregator')) return <Briefcase className="h-5 w-5 text-orange-600" />;
    if (name.includes('market')) return <Users className="h-5 w-5 text-blue-600" />;
    return <Users className="h-5 w-5 text-purple-600" />;
  };

  const getModelDescription = (modelName: string) => {
    const name = modelName?.toLowerCase() || '';
    if (name.includes('aggregator')) {
      return "Direct engagement with curated solution providers through our aggregation platform";
    }
    if (name.includes('market')) {
      return "Open marketplace where multiple solution providers compete for your challenges";
    }
    return "Customized engagement model for your specific needs";
  };

  const isModelSelected = (modelName: string) => {
    return modelName?.toLowerCase() === selectedModel?.toLowerCase();
  };

  const isModelCurrent = (modelName: string) => {
    return modelName?.toLowerCase() === currentModel?.toLowerCase();
  };

  if (!profileContext) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
        ) : availableModels.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Models Available</h3>
            <p className="text-gray-600">
              No engagement models are available for your current configuration.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableModels.map((modelData) => {
              // Handle both direct models and tier-access models
              const model = modelData.engagement_model || modelData;
              const modelName = model.name;
              const modelAccess = modelData.engagement_model ? modelData : null;
              const isCurrent = isModelCurrent(modelName);
              const isSelected = isModelSelected(modelName);
              
              return (
                <Card 
                  key={model.id}
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
                      {model.description || getModelDescription(modelName)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Model Configuration (if available from tier access) */}
                    {modelAccess && (
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
                    )}

                    {/* Switch Requirements */}
                    {modelAccess?.switch_requirements && modelAccess.switch_requirements !== 'none' && (
                      <div className="bg-amber-50 p-2 rounded text-xs">
                        <div className="font-medium text-amber-800">Switch Requirements:</div>
                        <div className="text-amber-700">
                          {modelAccess.switch_requirements.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </div>
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
            disabled={!selectedModel || isModelCurrent(selectedModel)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Change
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
