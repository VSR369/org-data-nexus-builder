
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, X, Check, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { getCleanEngagementModels } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { PricingConfig } from '@/types/pricing';

interface EngagementModelSelectorProps {
  onClose: () => void;
  onSelect: (model: EngagementModel, pricing?: PricingConfig | null, selectedPlan?: string) => void;
  userCountry?: string;
  userOrgType?: string;
  membershipStatus?: 'active' | 'inactive';
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
  membershipStatus = 'inactive'
}) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [modelsWithPricing, setModelsWithPricing] = useState<ModelWithPricing[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedPricingPlan, setSelectedPricingPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEngagementModelsWithPricing = () => {
      try {
        console.log('🔄 EngagementModelSelector: Loading engagement models with pricing...');
        
        // Load engagement models with improved error handling
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
        
        // Load pricing configurations using the improved manager
        const pricingConfigs = PricingDataManager.getAllConfigurations();
        console.log('✅ EngagementModelSelector: Loaded pricing configs:', pricingConfigs.length);
        
        // Map models with their pricing configurations
        const modelsWithPricingData: ModelWithPricing[] = models.map(model => {
          console.log(`🔄 Processing model: ${model.name}`);
          
          // Find pricing config that matches the engagement model using the new method
          const pricingConfig = PricingDataManager.getPricingForEngagementModel(model.name);
          
          console.log(`💰 Pricing config for ${model.name}:`, pricingConfig ? 'Found' : 'Not found');
          
          let originalPrice = 0;
          let discountedPrice = 0;
          
          if (pricingConfig) {
            // Use quarterly fee as base price (you can modify this logic)
            originalPrice = pricingConfig.quarterlyFee || 0;
            
            // Apply discount if membership is active and discount is available
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
      onSelect(selectedModelWithPricing.model, selectedModelWithPricing.pricing, selectedPricingPlan);
      toast({
        title: "Engagement Model Selected",
        description: `You have selected: ${selectedModelWithPricing.model.name} with ${selectedPricingPlan} pricing`,
      });
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Check if engagement model is fee-based (percentage) or fixed pricing
  const isFeeBasedModel = (modelName: string) => {
    const feeBasedModels = ['Market Place', 'Aggregator', 'Market Place & Aggregator'];
    return feeBasedModels.includes(modelName);
  };

  // Get the actual percentage fee from master data configuration
  const getEngagementModelFeePercentage = (pricing: PricingConfig | null) => {
    if (!pricing) return 0;
    
    // Use engagementModelFee if available, otherwise use quarterlyFee as fallback
    return pricing.engagementModelFee || pricing.quarterlyFee || 0;
  };

  const formatPricing = (amount: number, currency: string = 'USD', modelName: string, pricing: PricingConfig | null = null) => {
    if (isFeeBasedModel(modelName)) {
      // For fee-based models, show the actual percentage from master data
      const feePercentage = getEngagementModelFeePercentage(pricing);
      return `${feePercentage}% of Solution Fee`;
    }
    return formatCurrency(amount, currency);
  };

  const getCurrentPrice = (modelWithPricing: ModelWithPricing) => {
    if (!modelWithPricing.pricing || !selectedPricingPlan) return 0;

    let basePrice = 0;
    switch (selectedPricingPlan) {
      case 'quarterly':
        basePrice = modelWithPricing.pricing.quarterlyFee || 0;
        break;
      case 'halfyearly':
        basePrice = modelWithPricing.pricing.halfYearlyFee || 0;
        break;
      case 'annual':
        basePrice = modelWithPricing.pricing.annualFee || 0;
        break;
      default:
        return 0;
    }

    // Apply discount if membership is active
    if (membershipStatus === 'active' && modelWithPricing.pricing.discountPercentage) {
      return basePrice * (1 - modelWithPricing.pricing.discountPercentage / 100);
    }

    return basePrice;
  };

  const getOriginalPrice = (modelWithPricing: ModelWithPricing) => {
    if (!modelWithPricing.pricing || !selectedPricingPlan) return 0;

    switch (selectedPricingPlan) {
      case 'quarterly':
        return modelWithPricing.pricing.quarterlyFee || 0;
      case 'halfyearly':
        return modelWithPricing.pricing.halfYearlyFee || 0;
      case 'annual':
        return modelWithPricing.pricing.annualFee || 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading engagement models and pricing...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Handshake className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-bold">
                Select Engagement Model with Pricing
              </CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {modelsWithPricing.length === 0 ? (
            <div className="p-6 text-center">
              <Handshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Engagement Models Found
              </h3>
              <p className="text-gray-600">
                No engagement models are currently configured. Please contact your administrator 
                to set up engagement models in the master data.
              </p>
            </div>
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
                </div>
              </div>

              {/* Pricing Plan Selection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Select Pricing Plan</h3>
                <Select value={selectedPricingPlan} onValueChange={setSelectedPricingPlan}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Choose your pricing plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-md z-50">
                    <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                    <SelectItem value="halfyearly">Half-Yearly (6 months)</SelectItem>
                    <SelectItem value="annual">Annual (12 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <RadioGroup value={selectedModelId} onValueChange={setSelectedModelId}>
                <div className="grid grid-cols-1 gap-4">
                  {modelsWithPricing.map((item) => (
                    <div key={item.model.id} className="relative">
                      <Label htmlFor={item.model.id} className="cursor-pointer">
                        <Card className={`border-2 transition-all hover:shadow-md ${
                          selectedModelId === item.model.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200'
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={item.model.id} id={item.model.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-lg">{item.model.name}</h4>
                                      <Badge variant="default">Active</Badge>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                      {item.model.description}
                                    </p>
                                  </div>
                                  
                                  {/* Pricing Information */}
                                  <div className="text-right min-w-[200px]">
                                    {item.pricing && selectedPricingPlan ? (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 justify-end">
                                          <DollarSign className="h-4 w-4 text-green-600" />
                                          <span className="text-sm font-medium">
                                            {selectedPricingPlan === 'quarterly' ? 'Quarterly' : 
                                             selectedPricingPlan === 'halfyearly' ? 'Half-Yearly' : 'Annual'} 
                                            {isFeeBasedModel(item.model.name) ? ' Fee Rate' : ' Pricing'}
                                          </span>
                                        </div>
                                        
                                        {isFeeBasedModel(item.model.name) ? (
                                          // For fee-based models, show percentage from master data
                                          <div className="space-y-1">
                                            <div className="text-lg font-bold text-gray-900">
                                              {formatPricing(0, item.pricing.currency || 'USD', item.model.name, item.pricing)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Applied per solution transaction
                                            </div>
                                          </div>
                                        ) : (
                                          // For fixed pricing models, show discounted price
                                          membershipStatus === 'active' && item.pricing.discountPercentage && getCurrentPrice(item) < getOriginalPrice(item) ? (
                                            <div className="space-y-1">
                                              <div className="text-lg font-bold text-green-600">
                                                {formatPricing(getCurrentPrice(item), item.pricing.currency, item.model.name)}
                                              </div>
                                              <div className="text-sm text-gray-500 line-through">
                                                {formatPricing(getOriginalPrice(item), item.pricing.currency, item.model.name)}
                                              </div>
                                              <div className="text-xs text-green-600">
                                                {item.pricing.discountPercentage}% member discount
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                per {selectedPricingPlan === 'quarterly' ? 'quarter' : 
                                                     selectedPricingPlan === 'halfyearly' ? '6 months' : 'year'}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              <div className="text-lg font-bold text-gray-900">
                                                {getCurrentPrice(item) > 0 ? formatPricing(getCurrentPrice(item), item.pricing.currency || 'USD', item.model.name) : 'Contact for pricing'}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                per {selectedPricingPlan === 'quarterly' ? 'quarter' : 
                                                     selectedPricingPlan === 'halfyearly' ? '6 months' : 'year'}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : selectedPricingPlan ? (
                                      <div className="text-center">
                                        <div className="text-sm text-gray-500">No pricing configured</div>
                                        <div className="text-xs text-gray-400">Contact administrator</div>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <div className="text-sm text-gray-500">Select pricing plan first</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {selectedModelId === item.model.id && (
                                  <div className="flex items-center gap-2 text-blue-600 mt-2">
                                    <Check className="h-4 w-4" />
                                    <span className="text-sm font-medium">Selected</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSelectModel}
                  disabled={!selectedModelId || !selectedPricingPlan}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Handshake className="mr-2 h-4 w-4" />
                  Select Engagement Model
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
