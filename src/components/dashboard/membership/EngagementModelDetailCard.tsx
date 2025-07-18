import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  Network, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  Shield,
  Clock,
  Globe
} from 'lucide-react';

interface EngagementModelDetailCardProps {
  selectedModel: 'marketplace' | 'aggregator' | null;
  selectedTier: 'basic' | 'standard' | 'premium' | null;
  pricingData: any[];
  currency?: string;
}

const MARKETPLACE_FEATURES = {
  general: [
    'Direct access to innovation marketplace',
    'Post challenges to global talent pool',
    'Real-time solution submissions',
    'Automated matching algorithms',
    'Basic analytics and reporting',
    'Standard communication tools'
  ],
  program_managed: [
    'Dedicated program manager',
    'Custom challenge design and curation',
    'Enhanced screening and validation',
    'Advanced project management tools',
    'Priority support and consultation',
    'Detailed progress tracking and reporting'
  ]
};

const AGGREGATOR_FEATURES = [
  'Multi-platform challenge distribution',
  'Aggregated talent pool from multiple sources',
  'Advanced filtering and ranking systems',
  'Cross-platform analytics and insights',
  'Unified communication interface',
  'Enhanced quality assurance processes'
];

const TIER_SPECIFIC_FEATURES = {
  basic: {
    marketplace: ['Up to 5 challenges/month', 'Basic matching', 'Email support'],
    aggregator: ['2 platform integrations', 'Basic aggregation', 'Standard reporting']
  },
  standard: {
    marketplace: ['Up to 20 challenges/month', 'Advanced matching', 'Priority support', 'Custom branding'],
    aggregator: ['5 platform integrations', 'Advanced aggregation', 'Real-time analytics', 'Custom workflows']
  },
  premium: {
    marketplace: ['Unlimited challenges', 'AI-powered matching', 'Dedicated support', 'White-label solution'],
    aggregator: ['Unlimited integrations', 'Enterprise aggregation', 'Advanced AI insights', 'Full customization']
  }
};

export const EngagementModelDetailCard: React.FC<EngagementModelDetailCardProps> = ({
  selectedModel,
  selectedTier,
  pricingData,
  currency = 'USD'
}) => {
  if (!selectedModel) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Engagement Model Details</CardTitle>
          <CardDescription>
            Select an engagement model to view detailed features and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Please select an engagement model to continue
          </div>
        </CardContent>
      </Card>
    );
  }

  const getModelIcon = () => {
    return selectedModel === 'marketplace' ? Store : Network;
  };

  const getModelTitle = () => {
    return selectedModel === 'marketplace' ? 'Marketplace' : 'Aggregator';
  };

  const getModelDescription = () => {
    return selectedModel === 'marketplace' 
      ? 'Connect directly with innovators through our marketplace platform'
      : 'Access multiple innovation platforms through a single aggregated interface';
  };

  const ModelIcon = getModelIcon();

  const renderMarketplaceDetails = () => (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">Marketplace General</TabsTrigger>
        <TabsTrigger value="program_managed">Program Managed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Store className="h-4 w-4 text-blue-600" />
            Marketplace General Features
          </h3>
          <ul className="space-y-2">
            {MARKETPLACE_FEATURES.general.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {selectedTier && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">
              {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier Benefits:
            </h4>
            <ul className="space-y-1">
              {TIER_SPECIFIC_FEATURES[selectedTier].marketplace.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-blue-700">
                  <Star className="h-3 w-3" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="program_managed" className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            Program Managed Features
          </h3>
          <ul className="space-y-2">
            {MARKETPLACE_FEATURES.program_managed.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium mb-2 text-purple-800 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Premium Service Included:
          </h4>
          <p className="text-sm text-purple-700">
            Program Managed services include dedicated support, enhanced quality assurance, 
            and personalized consultation to maximize your innovation outcomes.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderAggregatorDetails = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Network className="h-4 w-4 text-orange-600" />
          Aggregator Features
        </h3>
        <ul className="space-y-2">
          {AGGREGATOR_FEATURES.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {selectedTier && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium mb-2 text-orange-800">
            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier Benefits:
          </h4>
          <ul className="space-y-1">
            {TIER_SPECIFIC_FEATURES[selectedTier].aggregator.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-orange-700">
                <Star className="h-3 w-3" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
        <h4 className="font-medium mb-2 text-orange-800 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Multi-Platform Access:
        </h4>
        <p className="text-sm text-orange-700">
          Access talent and solutions from multiple innovation platforms through a single, 
          unified interface with advanced aggregation and filtering capabilities.
        </p>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ModelIcon className="h-5 w-5 text-primary" />
          {getModelTitle()} Engagement Model
        </CardTitle>
        <CardDescription>
          {getModelDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Model Selection Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              Selected Model: {getModelTitle()}
            </Badge>
            {selectedTier && (
              <Badge variant="outline" className="text-sm">
                {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier
              </Badge>
            )}
          </div>

          {/* Model-specific Details */}
          {selectedModel === 'marketplace' ? renderMarketplaceDetails() : renderAggregatorDetails()}

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="font-semibold text-sm">Success Rate</div>
              <div className="text-xs text-gray-600">
                {selectedModel === 'marketplace' ? '85%' : '78%'} avg completion
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="font-semibold text-sm">Response Time</div>
              <div className="text-xs text-gray-600">
                {selectedModel === 'marketplace' ? '2-3 days' : '1-2 days'} avg
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="font-semibold text-sm">Quality Score</div>
              <div className="text-xs text-gray-600">
                {selectedModel === 'marketplace' ? '4.7/5' : '4.5/5'} average rating
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};