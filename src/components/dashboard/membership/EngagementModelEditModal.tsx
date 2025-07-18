
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Users, Briefcase } from 'lucide-react';
import { MembershipDataService } from '@/services/MembershipDataService';
import { toast } from '@/hooks/use-toast';

interface EngagementModelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string | null;
  onModelSelect: (model: string) => void;
  isLoading?: boolean;
}

export const EngagementModelEditModal: React.FC<EngagementModelEditModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onModelSelect,
  isLoading = false
}) => {
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(currentModel);

  useEffect(() => {
    if (isOpen) {
      loadAvailableModels();
      setSelectedModel(currentModel);
    }
  }, [isOpen, currentModel]);

  const loadAvailableModels = async () => {
    try {
      setLoading(true);
      const models = await MembershipDataService.getAvailableEngagementModels();
      setAvailableModels(models);
    } catch (error) {
      console.error('Error loading engagement models:', error);
      toast({
        title: "Error",
        description: "Failed to load available engagement models.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
  };

  const handleConfirm = () => {
    if (selectedModel && selectedModel !== currentModel) {
      onModelSelect(selectedModel);
      onClose();
    } else {
      onClose();
    }
  };

  const getModelIcon = (modelName: string) => {
    const name = modelName?.toLowerCase() || '';
    if (name.includes('aggregator')) return <Briefcase className="h-5 w-5" />;
    if (name.includes('market')) return <Users className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  const normalizeForComparison = (name: string) => {
    return name?.toLowerCase().trim() || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Engagement Model</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading available models...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableModels.map((model) => {
                const isSelected = normalizeForComparison(selectedModel) === normalizeForComparison(model.name);
                const isCurrent = normalizeForComparison(currentModel) === normalizeForComparison(model.name);
                
                return (
                  <Card 
                    key={model.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleModelSelect(model.name)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getModelIcon(model.name)}
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">Current</Badge>
                          )}
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {model.description || `${model.name} engagement model`}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {availableModels.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No engagement models available.
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!selectedModel || isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {selectedModel === currentModel ? 'Close' : 'Update Model'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
