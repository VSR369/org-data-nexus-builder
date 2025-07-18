import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Network } from 'lucide-react';

interface SimpleEngagementModelSelectionProps {
  selectedModel: 'marketplace' | 'aggregator' | null;
  onModelSelect: (model: 'marketplace' | 'aggregator') => void;
  selectedTier: string | null;
  pricingData: any[];
}

export const SimpleEngagementModelSelection: React.FC<SimpleEngagementModelSelectionProps> = ({
  selectedModel,
  onModelSelect,
  selectedTier,
  pricingData
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Engagement Model</CardTitle>
        <CardDescription>
          Choose how you want to engage with our innovation platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedModel === 'marketplace'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onModelSelect('marketplace')}
          >
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Marketplace</h3>
              <p className="text-sm text-gray-600 mb-4">
                Direct access to our innovation marketplace with challenge posting and solution review
              </p>
              <Button
                variant={selectedModel === 'marketplace' ? "default" : "outline"}
                className="w-full"
              >
                Select Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedModel === 'aggregator'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onModelSelect('aggregator')}
          >
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Network className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aggregator</h3>
              <p className="text-sm text-gray-600 mb-4">
                Access multiple innovation platforms through a unified aggregated interface
              </p>
              <Button
                variant={selectedModel === 'aggregator' ? "default" : "outline"}
                className="w-full"
              >
                Select Aggregator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};