import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Crown, ArrowRight } from 'lucide-react';

interface TierOption {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  badgeColor: string;
  features: string[];
  pricing: {
    monthly: number;
    annual: number;
    currency: string;
  };
  recommended?: boolean;
}

interface TierSelectionCardProps {
  selectedTier: string | null;
  onTierSelect: (tier: string) => void;
  currency?: string;
}

const TIER_OPTIONS: TierOption[] = [
  {
    id: 'basic',
    name: 'Basic Tier',
    description: 'Perfect for small organizations getting started',
    icon: CheckCircle,
    color: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-800',
    features: [
      'Up to 5 challenges per month',
      'Basic analytics dashboard',
      'Email support',
      'Standard engagement models',
      'Basic marketplace access'
    ],
    pricing: {
      monthly: 99,
      annual: 990,
      currency: 'USD'
    }
  },
  {
    id: 'standard',
    name: 'Standard Tier',
    description: 'Best value for growing organizations',
    icon: Star,
    color: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    features: [
      'Up to 20 challenges per month',
      'Advanced analytics & reporting',
      'Priority email & chat support',
      'All engagement models available',
      'Full marketplace & aggregator access',
      'Custom branding options'
    ],
    pricing: {
      monthly: 299,
      annual: 2990,
      currency: 'USD'
    },
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium Tier',
    description: 'Ultimate solution for enterprise organizations',
    icon: Crown,
    color: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
    features: [
      'Unlimited challenges',
      'Real-time analytics & insights',
      'Dedicated account manager',
      'Custom engagement models',
      'White-label solutions',
      'API access & integrations',
      'Advanced security features'
    ],
    pricing: {
      monthly: 699,
      annual: 6990,
      currency: 'USD'
    }
  }
];

export const TierSelectionCard: React.FC<TierSelectionCardProps> = ({
  selectedTier,
  onTierSelect,
  currency = 'USD'
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Select Your Pricing Tier
        </CardTitle>
        <CardDescription>
          Choose the tier that best fits your organization's needs and scale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIER_OPTIONS.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${tier.recommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => onTierSelect(tier.id)}
              >
                {tier.recommended && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Recommended
                  </Badge>
                )}
                
                <div className="text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${tier.color}`} />
                  <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {currency} {tier.pricing.monthly}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      or {currency} {tier.pricing.annual}/year (2 months free)
                    </div>
                  </div>
                  
                  <ul className="text-sm space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onTierSelect(tier.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        Select {tier.name}
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
                {TIER_OPTIONS.find(t => t.id === selectedTier)?.name} selected
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
