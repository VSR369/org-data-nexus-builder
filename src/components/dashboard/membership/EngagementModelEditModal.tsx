
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, X, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useEngagementModelPricing } from '@/hooks/useEngagementModelPricing';
import { ConsolidatedMarketplaceCard } from './ConsolidatedMarketplaceCard';
import { EngagementModelCard } from './EngagementModelCard';

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
  
  console.log('⚡ EngagementModelEditModal props:', {
    isOpen,
    currentModel,
    selectedTier,
    userId,
    membershipStatus,
    profileContext: profileContext ? 'Available' : 'Missing'
  });

  // Use the same hook as sign-up process for consistency
  const { engagementModels, loading, error } = useEngagementModelPricing(
    selectedTier, 
    profileContext, 
    membershipStatus === 'Active' ? 'active' : 'inactive'
  );

  useEffect(() => {
    if (isOpen && profileContext) {
      console.log('⚡ EngagementModelEditModal opened with:', { 
        currentModel, 
        selectedTier, 
        profileContext, 
        membershipStatus,
        availableModels: engagementModels?.length 
      });
      setSelectedModel(currentModel);
    }
  }, [isOpen, currentModel, selectedTier, profileContext, engagementModels]);

  const handleModelSelect = (modelName: string) => {
    console.log('⚡ Model selected in edit modal:', modelName);
    setSelectedModel(modelName);
  };

  const handleConfirm = async () => {
    if (selectedModel && selectedModel !== currentModel) {
      console.log('⚡ Confirming model change:', currentModel, '->', selectedModel);
      
      try {
        // Call the parent's onModelChange handler
        await onModelChange(selectedModel);
        
        toast({
          title: "Engagement Model Updated",
          description: `Your engagement model has been changed to ${selectedModel}`,
        });
        
        onClose();
      } catch (error) {
        console.error('❌ Error updating engagement model:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update engagement model. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      onClose();
    }
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

  const renderEngagementModel = (model: any) => {
    console.log('⚡ Rendering engagement model:', model);
    
    // Handle consolidated Marketplace with same logic as sign-up
    if (model.name === 'Market Place' && model.subtypes) {
      return (
        <ConsolidatedMarketplaceCard
          key={model.id}
          model={model}
          isSelected={isModelSelected('Market Place')}
          onModelSelect={handleModelSelect}
          membershipStatus={membershipStatus === 'Active' ? 'active' : 'inactive'}
        />
      );
    }
    
    // Handle other models with same detailed pricing as sign-up
    return (
      <EngagementModelCard
        key={model.id}
        model={model}
        isSelected={isModelSelected(model.displayName || model.name)}
        onModelSelect={handleModelSelect}
        membershipStatus={membershipStatus === 'Active' ? 'active' : 'inactive'}
        showCurrentBadge={isModelCurrent(model.displayName || model.name)}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Change Engagement Model
          </DialogTitle>
          <DialogDescription>
            Select a new engagement model. Your current model is <strong>{currentModel || 'None'}</strong>.
            {selectedTier && <span> Available for tier: <strong>{selectedTier}</strong></span>}
            {membershipStatus === 'Active' && (
              <span className="text-green-700 ml-1 font-medium">
                (Member pricing applied)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading engagement models with pricing...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Models</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : engagementModels.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Models Available</h3>
            <p className="text-gray-600">
              No engagement models are available for your current configuration.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please contact support to configure engagement models.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engagementModels.map(renderEngagementModel)}
            </div>
            
            {selectedModel && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {selectedModel} engagement model selected
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your membership configuration will be updated with this engagement model and pricing structure.
                </p>
              </div>
            )}
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
