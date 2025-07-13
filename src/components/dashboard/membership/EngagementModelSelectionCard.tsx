import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Network, Layers, Server, Percent, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

interface EngagementModelSelectionCardProps {
  profile: any;
  selectedModel: string | null;
  selectedFrequency: string | null;
  onModelChange: (model: string) => void;
  onFrequencyChange: (frequency: string) => void;
  membershipStatus: 'active' | 'inactive' | null;
}

interface ModelPricing {
  id: string;
  engagement_model: string;
  calculated_value: number;
  currency_code?: string;
  billing_frequency?: string;
  is_percentage: boolean;
  membership_discount_percentage?: number;
}

export const EngagementModelSelectionCard: React.FC<EngagementModelSelectionCardProps> = ({
  profile,
  selectedModel,
  selectedFrequency,
  onModelChange,
  onFrequencyChange,
  membershipStatus
}) => {
  const [pricingData, setPricingData] = useState<ModelPricing[]>([]);
  const [loading, setLoading] = useState(true);

  const engagementModels = [
    { name: 'Market Place', icon: Store, description: 'Connect with solution seekers' },
    { name: 'Aggregator', icon: Network, description: 'Aggregate multiple solutions' },
    { name: 'Market Place & Aggregator', icon: Layers, description: 'Combined marketplace and aggregation' },
    { name: 'Platform as a Service', icon: Server, description: 'Provide platform services' }
  ];

  useEffect(() => {
    if (profile) {
      loadPricingData();
    }
  }, [profile, membershipStatus]);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      const membershipStatusValue = membershipStatus === 'active' ? 'Active' : 'Not Active';
      
      const { data, error } = await supabase
        .from('pricing_configurations_detailed')
        .select('*')
        .eq('country_name', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type)
        .eq('membership_status', membershipStatusValue)
        .eq('is_active', true);

      if (error) throw error;
      setPricingData(data || []);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModelPricing = (modelName: string) => {
    return pricingData.filter(p => p.engagement_model === modelName);
  };

  const renderPricingDisplay = (modelName: string) => {
    const pricing = getModelPricing(modelName);
    
    if (pricing.length === 0) {
      return <span className="text-muted-foreground text-sm">Pricing not available</span>;
    }

    const firstPrice = pricing[0];
    
    if (firstPrice.is_percentage) {
      // Marketplace models - show percentage
      return (
        <div className="flex items-center gap-1">
          <Percent className="h-4 w-4 text-primary" />
          <span className="font-bold text-primary">
            Platform Fee = {formatPercentage(firstPrice.calculated_value)} of Solution Fee
          </span>
        </div>
      );
    } else {
      // Platform as a Service - show currency options
      return (
        <div className="space-y-2">
          {pricing.map((price) => (
            <div key={price.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{price.billing_frequency}</span>
              </div>
              <span className="font-medium">
                {formatCurrency(price.calculated_value, price.currency_code)}
              </span>
            </div>
          ))}
        </div>
      );
    }
  };

  const isPaasModel = (modelName: string) => {
    return modelName === 'Platform as a Service';
  };

  const getPaasFrequencies = () => {
    const paasPricing = getModelPricing('Platform as a Service');
    return paasPricing.map(p => ({
      value: p.billing_frequency || '',
      label: `${p.billing_frequency} - ${formatCurrency(p.calculated_value, p.currency_code)}`
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Engagement Model Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Engagement Model Selection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose how you want to engage with the platform
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
          value={selectedModel || ''} 
          onValueChange={onModelChange}
        >
          {engagementModels.map((model) => {
            const Icon = model.icon;
            const hasPrice = getModelPricing(model.name).length > 0;
            
            return (
              <div key={model.name} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem 
                    value={model.name} 
                    id={model.name}
                    disabled={!hasPrice}
                  />
                  <Label htmlFor={model.name} className="flex-1 cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{model.name}</span>
                          {!hasPrice && (
                            <Badge variant="secondary" className="text-xs">
                              Not Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {model.description}
                      </p>
                      {hasPrice && (
                        <div className="pt-2">
                          {renderPricingDisplay(model.name)}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>

                {/* Frequency Selection for Platform as a Service */}
                {selectedModel === model.name && isPaasModel(model.name) && (
                  <div className="ml-8 p-3 bg-muted/30 rounded-lg">
                    <Label className="text-sm font-medium mb-2 block">
                      Select Billing Frequency
                    </Label>
                    <Select value={selectedFrequency || ''} onValueChange={onFrequencyChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose billing frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPaasFrequencies().map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>

        {/* Membership Status Impact */}
        {membershipStatus && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={membershipStatus === 'active' ? 'default' : 'secondary'} className="text-xs">
                {membershipStatus === 'active' ? 'Active Member' : 'Inactive Member'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {membershipStatus === 'active' 
                ? 'Member discounts applied to pricing above'
                : 'Upgrade to Active membership to unlock discounts'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};