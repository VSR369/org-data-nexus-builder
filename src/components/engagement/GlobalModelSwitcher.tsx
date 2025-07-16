import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GlobalEngagementModelService, GlobalModelInfo, ValidationResult } from '@/services/globalEngagementModelService';

interface GlobalModelSwitcherProps {
  userId: string;
  tierId: string;
  onModelSwitched?: (newModel: string) => void;
}

export const GlobalModelSwitcher: React.FC<GlobalModelSwitcherProps> = ({
  userId,
  tierId,
  onModelSwitched
}) => {
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [currentModel, setCurrentModel] = useState<GlobalModelInfo | null>(null);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [activeChallenges, setActiveChallenges] = useState<number>(0);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [userId, tierId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [current, available, active] = await Promise.all([
        GlobalEngagementModelService.getCurrentGlobalModel(userId),
        GlobalEngagementModelService.getAvailableModels(tierId),
        GlobalEngagementModelService.checkActivechallenges(userId)
      ]);

      setCurrentModel(current);
      setAvailableModels(available);
      setActiveChallenges(active);
      
      if (current?.current_model) {
        const currentModelData = available.find(m => m.engagement_model.name === current.current_model);
        if (currentModelData) {
          setSelectedModel(currentModelData.engagement_model.id);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load engagement model data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    setSelectedModel(modelId);
    
    if (modelId) {
      try {
        const result = await GlobalEngagementModelService.validateModelSwitch(userId, tierId, modelId);
        setValidation(result);
      } catch (error) {
        console.error('Error validating model switch:', error);
      }
    } else {
      setValidation(null);
    }
  };

  const handleSwitchModel = async () => {
    if (!selectedModel) return;

    setSwitching(true);
    try {
      const selectedModelData = availableModels.find(m => m.engagement_model.id === selectedModel);
      if (!selectedModelData) {
        throw new Error('Selected model not found');
      }

      const result = await GlobalEngagementModelService.switchGlobalModel(
        userId,
        tierId,
        selectedModel,
        selectedModelData.engagement_model.name
      );

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        
        await loadData(); // Refresh data
        onModelSwitched?.(selectedModelData.engagement_model.name);
      } else {
        toast({
          title: 'Switch Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error switching model:', error);
      toast({
        title: 'Error',
        description: 'Failed to switch engagement model',
        variant: 'destructive'
      });
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading Global Engagement Model
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const isBasicTier = availableModels.some(m => m.selection_scope === 'global');
  const canSwitch = !validation || validation.allowed;
  const hasActiveChallenge = activeChallenges > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Global Engagement Model
          {isBasicTier && <Badge variant="secondary">Basic Tier</Badge>}
        </CardTitle>
        <CardDescription>
          {isBasicTier 
            ? 'Select your global engagement model. This applies to all your challenges.'
            : 'This tier allows per-challenge model selection.'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Model Display */}
        {currentModel?.has_global_model && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Current Model: {currentModel.current_model}</span>
            </div>
          </div>
        )}

        {/* Active Challenges Warning */}
        {hasActiveChallenge && isBasicTier && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {activeChallenges} active challenge{activeChallenges > 1 ? 's' : ''}. 
              Complete or pause all challenges before switching models.
            </AlertDescription>
          </Alert>
        )}

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Engagement Model</label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose engagement model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.engagement_model.id} value={model.engagement_model.id}>
                  {model.engagement_model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Validation Messages */}
        {validation && !validation.allowed && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {validation.reason}
            </AlertDescription>
          </Alert>
        )}

        {/* Switch Button */}
        <Button
          onClick={handleSwitchModel}
          disabled={!canSwitch || switching || !selectedModel}
          className="w-full"
        >
          {switching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Switching Model...
            </>
          ) : (
            'Switch Global Model'
          )}
        </Button>

        {/* Basic Tier Rules */}
        {isBasicTier && (
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">Basic Tier Rules:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Multiple challenges allowed</li>
              <li>Only one engagement model at a time</li>
              <li>Must complete/pause all challenges to switch</li>
              <li>Selected model applies to all challenges</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};