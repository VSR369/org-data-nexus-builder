
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, ArrowRight, AlertCircle } from 'lucide-react';
import { useTierConfigurations, TierConfiguration } from '@/hooks/useTierConfigurations';
import { TierFeatureSection } from './TierFeatureSection';

interface SimpleTierSelectionCardProps {
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

const formatCurrency = (amount: number, symbol: string, code: string) => {
  // Handle the specific case where symbol might be currency code like "INR"
  if (symbol === code || symbol.length > 3) {
    return `${code} ${amount.toFixed(2)}`;
  }
  return `${symbol}${amount.toFixed(2)} ${code}`;
};

export const SimpleTierSelectionCard: React.FC<SimpleTierSelectionCardProps> = ({
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
            No tier configurations found for {countryName || 'your country'}. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Sort by level_order to ensure proper display order (should already be sorted from hook)
  const sortedTiers = [...tierConfigurations].sort((a, b) => a.level_order - b.level_order);

  // Find recommended tier (usually the middle one or Standard)
  const recommendedTier = sortedTiers.find(tier => 
    tier.pricing_tier_name.toLowerCase().includes('standard')
  ) || sortedTiers[Math.floor(sortedTiers.length / 2)];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Pricing Tier</CardTitle>
        <CardDescription>
          Choose the tier that best fits your organization's challenge requirements for {countryName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedTiers.map((config) => {
            const Icon = getTierIcon(config.pricing_tier_name);
            const isSelected = selectedTier === config.pricing_tier_name;
            const isRecommended = recommendedTier?.id === config.id;
            
            return (
              <div
                key={config.id}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${isRecommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => onTierSelect(config.pricing_tier_name)}
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
                        Up to {config.monthly_challenge_limit} challenges/month
                      </div>
                    )}
                    {!config.monthly_challenge_limit && (
                      <div className="text-sm text-gray-500">
                        Unlimited challenges
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <TierFeatureSection
                      analyticsAccess={config.analytics_access_name}
                      supportType={config.support_type_name}
                      onboardingType={config.onboarding_type_name}
                      workflowTemplate={config.workflow_template_name}
                      monthlyLimit={config.monthly_challenge_limit}
                      solutionsPerChallenge={config.solutions_per_challenge}
                      allowsOverage={config.allows_overage}
                    />
                  </div>
                  
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onTierSelect(config.pricing_tier_name)}
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
                {selectedTier} tier selected
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
