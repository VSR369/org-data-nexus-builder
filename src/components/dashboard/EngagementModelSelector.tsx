import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Handshake, Check, AlertCircle } from 'lucide-react';
import { useEngagementModels } from '@/hooks/useEngagementModels';
import { usePricingData } from '@/hooks/usePricingData';

interface EngagementModelOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface PricingDetails {
  basePrice: number;
  currency: string;
  pricingTier: string;
  discountPercentage?: number;
}

interface EngagementModelSelectorProps {
  country: string;
  organizationType: string;
  entityType: string;
  onEngagementSelect: (engagement: EngagementModelOption, pricing: PricingDetails | null) => void;
  selectedEngagement?: EngagementModelOption | null;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  country,
  organizationType,
  entityType,
  onEngagementSelect,
  selectedEngagement
}) => {
  const [selectedModel, setSelectedModel] = useState<EngagementModelOption | null>(selectedEngagement || null);
  const { engagementModels, loading: modelsLoading, error: modelsError } = useEngagementModels();
  const { getConfigByOrgTypeAndEngagement } = usePricingData();

  const handleSelect = (model: EngagementModelOption) => {
    setSelectedModel(model);
    
    // Get pricing details based on country, org type, entity type, and engagement model
    const pricingConfig = getConfigByOrgTypeAndEngagement(organizationType, model.name);
    
    const pricingDetails: PricingDetails = {
      basePrice: 0,
      currency: pricingConfig?.currency || 'USD',
      pricingTier: 'Standard',
      discountPercentage: undefined
    };

    onEngagementSelect(model, pricingDetails);
  };

  if (modelsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Handshake className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (modelsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Engagement Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{modelsError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const activeModels = engagementModels.filter(model => model.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="h-5 w-5" />
          Select Engagement Model & Pricing
          <Badge variant="destructive" className="ml-2">Mandatory</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose how you want to engage with solution providers. Pricing is customized for {organizationType} in {country}. This selection is required to proceed.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeModels.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No active engagement models are available. Please contact support or configure engagement models in the Master Data Portal.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid gap-4">
              {activeModels.map((model) => {
                const isSelected = selectedModel?.id === model.id;

                return (
                  <div
                    key={model.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelect(model)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{model.name}</h3>
                          {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{organizationType}</Badge>
                          <Badge variant="outline">{entityType}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        {(() => {
                          const pricingConfig = getConfigByOrgTypeAndEngagement(organizationType, model.name);
                          return pricingConfig ? (
                            <div>
                              <div className="text-lg font-bold text-blue-600">
                                {pricingConfig.currency} Contact for Pricing
                              </div>
                              <div className="text-xs text-gray-500">Standard Rate</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-lg font-bold text-blue-600">
                                Contact for Pricing
                              </div>
                              <div className="text-xs text-gray-500">Custom Quote</div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!selectedModel && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select an engagement model to continue. This selection is mandatory.
                </AlertDescription>
              </Alert>
            )}

            {selectedModel && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Selected: {selectedModel.name}</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementModelSelector;