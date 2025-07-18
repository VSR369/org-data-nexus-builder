
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Crown, ArrowRight, AlertCircle } from 'lucide-react';
import { useTierConfigurations, TierConfiguration } from '@/hooks/useTierConfigurations';

interface TierSelectionCardProps {
  selectedTier: string | null;
  onTierSelect: (tier: string) => void;
  countryName?: string;
}

const getTierIcon = (tierName: string) => {
  const lowerName = tierName.toLowerCase();
  if (lowerName.includes('basic')) return CheckCircle;
  if (lowerName.includes('standard')) return Star;
  if (lowerName.includes('premium')) return Crown;
  return CheckCircle;
};

const getTierColor = (tierName: string) => {
  const lowerName = tierName.toLowerCase();
  if (lowerName.includes('basic')) return 'text-green-600';
  if (lowerName.includes('standard')) return 'text-blue-600';
  if (lowerName.includes('premium')) return 'text-purple-600';
  return 'text-green-600';
};

const getTierBadgeColor = (tierName: string) => {
  const lowerName = tierName.toLowerCase();
  if (lowerName.includes('basic')) return 'bg-green-100 text-green-800';
  if (lowerName.includes('standard')) return 'bg-blue-100 text-blue-800';
  if (lowerName.includes('premium')) return 'bg-purple-100 text-purple-800';
  return 'bg-green-100 text-green-800';
};

const formatCurrency = (amount: number, symbol: string, code: string) => {
  return `${symbol} ${amount.toFixed(2)} ${code}`;
};

const getTierFeatures = (config: TierConfiguration) => {
  const features = [];
  
  if (config.monthly_challenge_limit) {
    features.push(`Up to ${config.monthly_challenge_limit} challenges per month`);
  } else {
    features.push('Unlimited challenges per month');
  }
  
  features.push(`${config.solutions_per_challenge} solution${config.solutions_per_challenge > 1 ? 's' : ''} per challenge`);
  
  if (config.analytics_access_name) {
    features.push(`${config.analytics_access_name} analytics access`);
  }
  
  if (config.support_type_name) {
    features.push(`${config.support_type_name} support`);
  }
  
  if (config.onboarding_type_name) {
    features.push(`${config.onboarding_type_name} onboarding`);
  }
  
  if (config.allows_overage) {
    features.push('Challenge overage allowed');
  }
  
  if (config.workflow_template_name) {
    features.push(`${config.workflow_template_name} workflow templates`);
  }
  
  return features;
};

export const TierSelectionCard: React.FC<TierSelectionCardProps> = ({
  selectedTier,
  onTierSelect,
  countryName
}) => {
  const { tierConfigurations, loading } = useTierConfigurations(countryName);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading tier configurations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tierConfigurations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            No Tier Configurations Available
          </CardTitle>
          <CardDescription>
            No tier configurations found for your country. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Sort by level_order to ensure proper display order
  const sortedTiers = [...tierConfigurations].sort((a, b) => a.level_order - b.level_order);

  // Find recommended tier (usually the middle one or Standard)
  const recommendedTier = sortedTiers.find(tier => 
    tier.pricing_tier_name.toLowerCase().includes('standard')
  ) || sortedTiers[Math.floor(sortedTiers.length / 2)];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Select Your Pricing Tier
        </CardTitle>
        <CardDescription>
          Choose the tier that best fits your organization's needs and challenge requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedTiers.map((config) => {
            const Icon = getTierIcon(config.pricing_tier_name);
            const isSelected = selectedTier === config.pricing_tier_name.toLowerCase();
            const isRecommended = recommendedTier?.id === config.id;
            const features = getTierFeatures(config);
            
            // Calculate estimated monthly cost
            const estimatedMonthlyCost = config.monthly_challenge_limit 
              ? config.fixed_charge_per_challenge * config.monthly_challenge_limit
              : config.fixed_charge_per_challenge * 10; // Estimate 10 challenges for unlimited
            
            return (
              <div
                key={config.id}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${isRecommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => onTierSelect(config.pricing_tier_name.toLowerCase())}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Recommended
                  </Badge>
                )}
                
                <div className="text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${getTierColor(config.pricing_tier_name)}`} />
                  <h3 className="text-lg font-semibold mb-2">{config.pricing_tier_name}</h3>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(config.fixed_charge_per_challenge, config.currency_symbol, config.currency_code)}
                      <span className="text-sm font-normal text-gray-500">/challenge</span>
                    </div>
                    {config.monthly_challenge_limit && (
                      <div className="text-sm text-gray-500">
                        Est. {formatCurrency(estimatedMonthlyCost, config.currency_symbol, config.currency_code)}/month
                        <br />
                        (if you use all {config.monthly_challenge_limit} challenges)
                      </div>
                    )}
                    {!config.monthly_challenge_limit && (
                      <div className="text-sm text-gray-500">
                        Unlimited challenges
                      </div>
                    )}
                  </div>
                  
                  <ul className="text-sm space-y-2 mb-6">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onTierSelect(config.pricing_tier_name.toLowerCase())}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        Select {config.pricing_tier_name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedTier && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {sortedTiers.find(t => t.pricing_tier_name.toLowerCase() === selectedTier)?.pricing_tier_name} selected
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              You can change your tier at any time from your account settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
