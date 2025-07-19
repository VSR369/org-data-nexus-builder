import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ShoppingCart, Building, Users, Zap, DollarSign, 
         Settings, ArrowRight, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EngagementModel {
  id: string;
  name: string;
  description: string | null;
}

interface ComplexityLevel {
  id: string;
  name: string;
  description: string;
  management_fee_multiplier: number;
  consulting_fee_multiplier: number;
  level_order: number;
}

interface PlatformFeeFormula {
  id: string;
  formula_name: string;
  description: string;
  base_consulting_fee: number;
  base_management_fee: number;
  platform_usage_fee_percentage: number;
  advance_payment_percentage: number;
  membership_discount_percentage: number;
}

interface EnhancedEngagementModelCardProps {
  selectedModel: string | null;
  onModelSelect: (modelName: string, modelDetails: any) => void;
  selectedTier?: string;
  countryName?: string;
}

const getModelIcon = (modelName: string) => {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('marketplace')) return ShoppingCart;
  if (lowerName.includes('aggregator')) return Building;
  return Users;
};

const getModelColor = (modelName: string) => {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('marketplace')) return 'text-blue-600';
  if (lowerName.includes('aggregator')) return 'text-green-600';
  return 'text-purple-600';
};

const getModelGradient = (modelName: string) => {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('marketplace')) return 'from-blue-500 to-blue-600';
  if (lowerName.includes('aggregator')) return 'from-green-500 to-green-600';
  return 'from-purple-500 to-purple-600';
};

export const EnhancedEngagementModelCard: React.FC<EnhancedEngagementModelCardProps> = ({
  selectedModel,
  onModelSelect,
  selectedTier,
  countryName
}) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [complexityLevels, setComplexityLevels] = useState<ComplexityLevel[]>([]);
  const [platformFees, setPlatformFees] = useState<Record<string, PlatformFeeFormula>>({});
  const [loading, setLoading] = useState(true);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEngagementData();
  }, []);

  const loadEngagementData = async () => {
    try {
      setLoading(true);
      
      // Load engagement models
      const { data: modelsData, error: modelsError } = await supabase
        .from('master_engagement_models')
        .select('id, name, description')
        .order('name');

      if (modelsError) throw modelsError;

      // Load complexity levels
      const { data: complexityData, error: complexityError } = await supabase
        .from('master_challenge_complexity')
        .select('*')
        .eq('is_active', true)
        .order('level_order');

      if (complexityError) throw complexityError;

      // Load platform fee formulas
      const { data: feesData, error: feesError } = await supabase
        .from('master_platform_fee_formulas')
        .select('*')
        .eq('is_active', true);

      if (feesError) throw feesError;

      setEngagementModels(modelsData || []);
      setComplexityLevels(complexityData || []);
      
      // Index fees by engagement model name
      const feesByModel: Record<string, PlatformFeeFormula> = {};
      feesData?.forEach(fee => {
        const modelData = modelsData?.find(m => m.id === fee.engagement_model_id);
        if (modelData) {
          feesByModel[modelData.name] = fee;
        }
      });
      setPlatformFees(feesByModel);
      
    } catch (error) {
      console.error('Error loading engagement data:', error);
      toast({
        title: "Error",
        description: "Failed to load engagement models",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model: EngagementModel) => {
    const modelDetails = {
      id: model.id,
      name: model.name,
      description: model.description,
      complexityLevels,
      platformFee: platformFees[model.name],
      features: getModelFeatures(model.name)
    };
    
    onModelSelect(model.name, modelDetails);
  };

  const getModelFeatures = (modelName: string) => {
    const lowerName = modelName.toLowerCase();
    
    if (lowerName.includes('marketplace')) {
      return [
        'Direct access to solution providers',
        'Open bidding system',
        'Transparent pricing',
        'Real-time communication',
        'Flexible project terms',
        'Community ratings & reviews'
      ];
    }
    
    if (lowerName.includes('aggregator')) {
      return [
        'Curated solution providers',
        'Pre-screened quality',
        'Managed relationships',
        'Standardized processes',
        'Guaranteed deliverables',
        'Professional mediation'
      ];
    }
    
    return [
      'Flexible engagement options',
      'Professional support',
      'Quality assurance',
      'Competitive pricing'
    ];
  };

  const renderComplexityLevels = (modelName: string) => {
    const platformFee = platformFees[modelName];
    if (!platformFee) return null;

    return (
      <div className="space-y-3">
        <h5 className="font-semibold text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Complexity Pricing
        </h5>
        <div className="grid grid-cols-1 gap-2">
          {complexityLevels.map(level => (
            <div key={level.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm font-medium">{level.name}</span>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {(level.management_fee_multiplier * 100).toFixed(0)}% multiplier
                </div>
                <div className="text-xs text-muted-foreground">
                  Base: {platformFee.base_management_fee}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPlatformFeeStructure = (modelName: string) => {
    const platformFee = platformFees[modelName];
    if (!platformFee) return null;

    return (
      <div className="space-y-3">
        <h5 className="font-semibold text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Fee Structure
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-sm font-semibold">{platformFee.base_management_fee}%</div>
            <div className="text-xs text-muted-foreground">Management Fee</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-sm font-semibold">{platformFee.base_consulting_fee}%</div>
            <div className="text-xs text-muted-foreground">Consulting Fee</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-sm font-semibold">{platformFee.platform_usage_fee_percentage}%</div>
            <div className="text-xs text-muted-foreground">Platform Usage</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-sm font-semibold">{platformFee.advance_payment_percentage}%</div>
            <div className="text-xs text-muted-foreground">Advance Payment</div>
          </div>
        </div>
        {platformFee.membership_discount_percentage > 0 && (
          <Badge variant="secondary" className="w-full justify-center">
            Member Discount: {platformFee.membership_discount_percentage}%
          </Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (engagementModels.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Engagement Models Available</CardTitle>
          <CardDescription>
            No engagement models found. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Select Your Engagement Model
        </CardTitle>
        <CardDescription>
          Choose how you want to engage with solution providers. Each model has different features and pricing structures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {engagementModels.map((model) => {
            const Icon = getModelIcon(model.name);
            const isSelected = selectedModel === model.name;
            const isExpanded = expandedModel === model.name;
            const features = getModelFeatures(model.name);
            
            return (
              <Card 
                key={model.id}
                className={`transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getModelGradient(model.name)}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.description || `Professional ${model.name.toLowerCase()} engagement`}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedModel(isExpanded ? null : model.name)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Features */}
                  <div>
                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Key Features
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {features.slice(0, isExpanded ? features.length : 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    {features.length > 4 && !isExpanded && (
                      <div className="text-xs text-muted-foreground mt-2">
                        +{features.length - 4} more features...
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-4 border-t pt-4">
                      {renderPlatformFeeStructure(model.name)}
                      {renderComplexityLevels(model.name)}
                    </div>
                  )}

                  {/* Selection Button */}
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleModelSelect(model)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        Select {model.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
              You can switch between engagement models based on your tier permissions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};