
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "@/components/ui/radio-group";
import { Handshake, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { getCleanEngagementModels } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { PricingConfig } from '@/types/pricing';
import { EngagementModelCard } from '@/components/engagement/components/EngagementModelCard';
import { PricingPlanSelector } from '@/components/engagement/components/PricingPlanSelector';
import { ModelSelectionSummary } from '@/components/engagement/components/ModelSelectionSummary';
import { EngagementModelLoadingState } from '@/components/engagement/components/EngagementModelLoadingState';
import { EngagementModelEmptyState } from '@/components/engagement/components/EngagementModelEmptyState';

interface EngagementModelSelectorProps {
  onClose: () => void;
  onSelect: (model: EngagementModel, pricing?: PricingConfig | null, selectedPlan?: string) => void;
  userCountry?: string;
  userOrgType?: string;
  membershipStatus?: 'active' | 'inactive';
  currentSelectedModel?: EngagementModel | null;
  currentSelectedPricingPlan?: string;
}

interface ModelWithPricing {
  model: EngagementModel;
  pricing: PricingConfig | null;
  originalPrice?: number;
  discountedPrice?: number;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  onClose,
  onSelect,
  userCountry = '',
  userOrgType = '',
  membershipStatus = 'inactive',
  currentSelectedModel = null,
  currentSelectedPricingPlan = ''
}) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [modelsWithPricing, setModelsWithPricing] = useState<ModelWithPricing[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>(currentSelectedModel?.id || '');
  const [selectedPricingPlan, setSelectedPricingPlan] = useState<string>(currentSelectedPricingPlan || '');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEngagementModelsWithPricing = () => {
      try {
        console.log('🔄 EngagementModelSelector: Loading engagement models with pricing...');
        
        const models = getCleanEngagementModels();
        console.log('✅ EngagementModelSelector: Loaded engagement models:', models.length, models.map(m => m.name));
        
        if (!Array.isArray(models) || models.length === 0) {
          console.error('❌ EngagementModelSelector: No valid engagement models found');
          toast({
            title: "Error",
            description: "No engagement models are configured. Please check master data configuration.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        const pricingConfigs = PricingDataManager.getAllConfigurations();
        console.log('✅ EngagementModelSelector: Loaded pricing configs:', pricingConfigs.length);
        
        const modelsWithPricingData: ModelWithPricing[] = models.map(model => {
          console.log(`🔄 Processing model: ${model.name}`);
          
          const pricingConfig = PricingDataManager.getPricingForEngagementModel(model.name);
          
          console.log(`💰 Pricing config for ${model.name}:`, pricingConfig ? 'Found' : 'Not found');
          
          let originalPrice = 0;
          let discountedPrice = 0;
          
          if (pricingConfig) {
            originalPrice = pricingConfig.quarterlyFee || 0;
            
            if (membershipStatus === 'active' && pricingConfig.discountPercentage) {
              discountedPrice = originalPrice * (1 - pricingConfig.discountPercentage / 100);
            }
            
            console.log(`💰 Pricing for ${model.name}: Original: ${originalPrice}, Discounted: ${discountedPrice}`);
          }
          
          return {
            model,
            pricing: pricingConfig || null,
            originalPrice,
            discountedPrice
          };
        });
        
        setEngagementModels(models);
        setModelsWithPricing(modelsWithPricingData);
        console.log('✅ EngagementModelSelector: Models with pricing data prepared:', modelsWithPricingData.length);
        
      } catch (error) {
        console.error('❌ EngagementModelSelector: Error loading engagement models with pricing:', error);
        toast({
          title: "Error",
          description: "Failed to load engagement models and pricing. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEngagementModelsWithPricing();
  }, [toast, membershipStatus]);

  useEffect(() => {
    if (currentSelectedModel) {
      setSelectedModelId(currentSelectedModel.id);
      console.log('🔄 Setting initial model selection:', currentSelectedModel.name);
    }
    if (currentSelectedPricingPlan) {
      setSelectedPricingPlan(currentSelectedPricingPlan);
      console.log('🔄 Setting initial pricing plan:', currentSelectedPricingPlan);
    }
  }, [currentSelectedModel, currentSelectedPricingPlan]);

  const handleSelectModel = () => {
    if (!selectedModelId) {
      toast({
        title: "Selection Required",
        description: "Please select an engagement model.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPricingPlan) {
      toast({
        title: "Pricing Plan Required",
        description: "Please select a pricing plan.",
        variant: "destructive",
      });
      return;
    }

    const selectedModelWithPricing = modelsWithPricing.find(item => item.model.id === selectedModelId);
    if (selectedModelWithPricing) {
      console.log('✅ Selecting engagement model:', selectedModelWithPricing.model.name, 'with plan:', selectedPricingPlan);
      onSelect(selectedModelWithPricing.model, selectedModelWithPricing.pricing, selectedPricingPlan);
      toast({
        title: "Engagement Model Selected",
        description: `You have selected: ${selectedModelWithPricing.model.name} with ${selectedPricingPlan} pricing`,
      });
    }
  };

  if (loading) {
    return <EngagementModelLoadingState />;
  }

  const selectedModelWithPricing = modelsWithPricing.find(item => item.model.id === selectedModelId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Handshake className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-bold">
                {currentSelectedModel ? 'Modify Engagement Model Selection' : 'Select Engagement Model with Pricing'}
              </CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {modelsWithPricing.length === 0 ? (
            <EngagementModelEmptyState />
          ) : (
            <>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Available Engagement Models with Pricing ({modelsWithPricing.length})
                </h3>
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <span>Membership Status: <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'}>{membershipStatus}</Badge></span>
                  {membershipStatus === 'active' && (
                    <span className="text-green-600">✓ Eligible for member discounts</span>
                  )}
                  {currentSelectedModel && (
                    <span className="text-purple-600">✓ Modifying existing selection</span>
                  )}
                </div>
              </div>

              <PricingPlanSelector 
                selectedPricingPlan={selectedPricingPlan}
                onPricingPlanChange={setSelectedPricingPlan}
              />

              <RadioGroup value={selectedModelId} onValueChange={setSelectedModelId}>
                <div className="grid grid-cols-1 gap-4">
                  {modelsWithPricing.map((item) => (
                    <EngagementModelCard
                      key={item.model.id}
                      item={item}
                      selectedModelId={selectedModelId}
                      selectedPricingPlan={selectedPricingPlan}
                      membershipStatus={membershipStatus}
                      currentSelectedModel={currentSelectedModel}
                    />
                  ))}
                </div>
              </RadioGroup>

              <ModelSelectionSummary
                selectedModel={selectedModelWithPricing}
                selectedPricingPlan={selectedPricingPlan}
                membershipStatus={membershipStatus}
              />

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSelectModel}
                  disabled={!selectedModelId || !selectedPricingPlan}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Handshake className="mr-2 h-4 w-4" />
                  {currentSelectedModel ? 'Update Selection' : 'Select Engagement Model'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementModelSelector;
