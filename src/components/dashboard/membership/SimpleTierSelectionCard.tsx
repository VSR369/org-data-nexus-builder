
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Star, Zap, ArrowRight } from 'lucide-react';

interface SimpleTierSelectionCardProps {
  selectedTier: string | null;
  onTierSelect: (tier: string) => void;
  countryName?: string;
}

const TIER_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small organizations getting started',
    icon: CheckCircle,
    color: 'text-green-600',
    annualPrice: 990,
    features: [
      'Up to 5 challenges per month',
      'Basic analytics dashboard',
      'Email support',
      'Standard engagement models'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Best value for growing organizations',
    icon: Star,
    color: 'text-blue-600',
    annualPrice: 2990,
    recommended: true,
    features: [
      'Up to 20 challenges per month',
      'Advanced analytics & reporting',
      'Priority email & chat support',
      'All engagement models available',
      'Custom branding options'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Ultimate solution for enterprise organizations',
    icon: Crown,
    color: 'text-purple-600',
    annualPrice: 6990,
    features: [
      'Unlimited challenges',
      'Real-time analytics & insights',
      'Dedicated account manager',
      'Custom engagement models',
      'White-label solutions',
      'API access & integrations'
    ]
  }
];

export const SimpleTierSelectionCard: React.FC<SimpleTierSelectionCardProps> = ({
  selectedTier,
  onTierSelect,
  countryName
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Select Your Pricing Tier
        </CardTitle>
        <CardDescription>
          Choose the tier that best fits your organization's needs • Annual billing only
          {countryName && <span className="block mt-1 text-sm">Available in {countryName}</span>}
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
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      USD {tier.annualPrice}
                    </div>
                    <div className="text-sm text-gray-500">
                      per year • Annual billing
                    </div>
                  </div>
                  
                  <ul className="text-sm space-y-2 mb-6 text-left">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
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
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {TIER_OPTIONS.find(t => t.id === selectedTier)?.name} tier selected
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Annual billing • You can proceed to select your engagement model
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
