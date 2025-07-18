
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Settings, AlertCircle, ArrowRight, Tag, Users } from 'lucide-react';
import { useEngagementModelPricing } from '@/hooks/useEngagementModelPricing';
import { ConsolidatedMarketplaceCard } from './ConsolidatedMarketplaceCard';

interface EngagementModelSelectionCardProps {
  selectedTier: string | null;
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
  profile: any;
  membershipStatus?: 'active' | 'inactive';
}

export const EngagementModelSelectionCard: React.FC<EngagementModelSelectionCardProps> = ({
  selectedTier,
  selectedModel,
  onModelSelect,
  profile,
  membershipStatus = 'inactive'
}) => {
  const { engagementModels, loading, error } = useEngagementModelPricing(selectedTier, profile, membershipStatus);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading engagement models and pricing...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Engagement Models
          </CardTitle>
          <CardDescription className="text-red-600">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (engagementModels.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            No Engagement Models Available
          </CardTitle>
          <CardDescription>
            No engagement models are available for {profile?.country || 'your country'}.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderStandardEngagementModel = (model: any) => {
    const isSelected = selectedModel === model.displayName;
    
    return (
      <div
        key={model.id}
        className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
        onClick={() => onModelSelect(model.displayName)}
      >
        <div className="space-y-4">
          {/* Model Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{model.displayName}</h3>
            {model.description && (
              <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
            )}
            {membershipStatus === 'active' && model.formula && (
              <Badge className="bg-green-100 text-green-800">
                <Tag className="h-3 w-3 mr-1" />
                Member Pricing Applied
              </Badge>
            )}
          </div>

          {/* Pricing Information */}
          {model.formula && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Pricing Structure
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {/* Platform Usage Fee */}
                {model.formula.platform_usage_fee_percentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Platform Usage Fee:</span>
                    <span className="font-medium">
                      {model.formula.platform_usage_fee_percentage}%
                    </span>
                  </div>
                )}
                
                {/* Management Fee */}
                {model.formula.base_management_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Base Management Fee:</span>
                    <span className="font-medium">
                      {model.currency} {model.formula.base_management_fee}
                    </span>
                  </div>
                )}
                
                {/* Consulting Fee */}
                {model.formula.base_consulting_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Base Consulting Fee:</span>
                    <span className="font-medium">
                      {model.currency} {model.formula.base_consulting_fee}
                    </span>
                  </div>
                )}
                
                {/* Advance Payment */}
                {model.formula.advance_payment_percentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Advance Payment:</span>
                    <span className="font-medium">{model.formula.advance_payment_percentage}% of total</span>
                  </div>
                )}
              </div>

              {/* Challenge Complexity Breakdown */}
              {model.complexityPricing && model.complexityPricing.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Complexity-Based Pricing
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {model.complexityPricing.map((complexity: any) => (
                        <div key={complexity.complexity} className="text-xs">
                          <div className="font-medium">{complexity.complexity}</div>
                          <div className="text-blue-700">
                            Mgmt: {model.currency} {complexity.management_fee.toLocaleString()}
                            {complexity.consulting_fee > 0 && (
                              <span className="ml-1">
                                | Consulting: {model.currency} {complexity.consulting_fee.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Formula Expression */}
              {model.formula.formula_expression && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Settings className="h-4 w-4" />
                    Formula
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <code className="text-xs text-blue-800 break-all">
                      {model.formula.formula_expression}
                    </code>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selection Button */}
          <Button
            variant={isSelected ? "default" : "outline"}
            className="w-full"
            onClick={() => onModelSelect(model.displayName)}
          >
            {isSelected ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Selected
              </>
            ) : (
              <>
                Select {model.displayName}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Engagement Model</CardTitle>
        <CardDescription>
          Choose the engagement model that best fits your organization's needs
          {membershipStatus === 'active' && (
            <span className="text-green-700 ml-1 font-medium">
              (Member pricing applied)
            </span>
          )}
          {membershipStatus === 'inactive' && (
            <span className="text-gray-500 ml-1">
              (Standard pricing)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {engagementModels.map((model) => {
            // Special handling for consolidated Marketplace
            if (model.name === 'Market Place' && model.subtypes) {
              return (
                <ConsolidatedMarketplaceCard
                  key={model.id}
                  model={model}
                  isSelected={selectedModel?.includes('Market Place')}
                  onModelSelect={onModelSelect}
                  membershipStatus={membershipStatus}
                />
              );
            }
            
            // Standard rendering for other models (including Aggregator)
            return renderStandardEngagementModel(model);
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
              Your membership will be activated with this engagement model and pricing structure.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
