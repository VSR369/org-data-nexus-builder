
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Settings, AlertCircle, ArrowRight, Tag, Users, Briefcase, Zap } from 'lucide-react';
import { useEngagementModelPricing } from '@/hooks/useEngagementModelPricing';
import { formatCurrency } from '@/utils/formatting';

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

  const renderMarketplaceCard = (model: any) => {
    const isSelected = selectedModel === model.displayName;
    
    return (
      <div
        key={model.id}
        className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
        onClick={() => onModelSelect(model.displayName)}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold">{model.displayName}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Complete marketplace access with flexible engagement options
            </p>
            {membershipStatus === 'active' && (
              <Badge className="bg-green-100 text-green-800">
                <Tag className="h-3 w-3 mr-1" />
                Member Pricing Applied
              </Badge>
            )}
          </div>

          {/* Platform Fee Highlight */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-900">
                {model.formula?.platform_usage_fee_percentage || 15}% Platform Fee
              </span>
            </div>
            <p className="text-sm text-blue-700">Applied to all challenge values</p>
          </div>

          {/* Subtypes */}
          <div className="space-y-4">
            {/* General Marketplace */}
            {model.subtypes?.general && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-gray-800">Marketplace General</span>
                  {membershipStatus === 'active' && model.subtypes.general.formula.membership_discount_percentage > 0 && (
                    <Badge className="bg-green-100 text-green-800 ml-auto">
                      <Tag className="h-3 w-3 mr-1" />
                      {model.subtypes.general.formula.membership_discount_percentage}% Member Discount
                    </Badge>
                  )}
                </div>

                {/* Platform Fee */}
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Platform Usage Fee</span>
                    <span className="text-lg font-bold text-blue-600">
                      {model.subtypes.general.formula.platform_usage_fee_percentage}%
                    </span>
                  </div>
                </div>

                {/* Complexity Pricing */}
                <div className="grid grid-cols-2 gap-2">
                  {model.subtypes.general.complexityPricing.map((complexity: any) => (
                    <div key={complexity.complexity} className="bg-white rounded p-3 border border-gray-200">
                      <div className="font-medium text-sm text-gray-700 mb-1">
                        {complexity.complexity}
                      </div>
                      <div className="text-sm">
                        <span className="text-xs text-gray-500">Management:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {formatCurrency(complexity.management_fee, model.currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Managed */}
            {model.subtypes?.programManaged && (
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-gray-800">Marketplace Program Managed</span>
                  {membershipStatus === 'active' && model.subtypes.programManaged.formula.membership_discount_percentage > 0 && (
                    <Badge className="bg-green-100 text-green-800 ml-auto">
                      <Tag className="h-3 w-3 mr-1" />
                      {model.subtypes.programManaged.formula.membership_discount_percentage}% Member Discount
                    </Badge>
                  )}
                </div>

                {/* Platform Fee */}
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Platform Usage Fee</span>
                    <span className="text-lg font-bold text-green-600">
                      {model.subtypes.programManaged.formula.platform_usage_fee_percentage}%
                    </span>
                  </div>
                </div>

                {/* Complexity Pricing */}
                <div className="grid grid-cols-2 gap-2">
                  {model.subtypes.programManaged.complexityPricing.map((complexity: any) => (
                    <div key={complexity.complexity} className="bg-white rounded p-3 border border-gray-200">
                      <div className="font-medium text-sm text-gray-700 mb-1">
                        {complexity.complexity}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-xs text-gray-500">Management:</span>
                          <span className="font-semibold text-gray-900 ml-1">
                            {formatCurrency(complexity.management_fee, model.currency)}
                          </span>
                        </div>
                        {complexity.consulting_fee > 0 && (
                          <div className="text-sm">
                            <span className="text-xs text-gray-500">Consulting:</span>
                            <span className="font-semibold text-gray-900 ml-1">
                              {formatCurrency(complexity.consulting_fee, model.currency)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selection Button */}
          <Button
            variant={isSelected ? "default" : "outline"}
            className="w-full"
            onClick={() => onModelSelect(model.displayName)}
          >
            {isSelected ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Selected: Marketplace
              </>
            ) : (
              <>
                Select Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Info Note */}
          <div className="text-center text-xs text-gray-500">
            Choose between General and Program Managed when creating challenges
          </div>
        </div>
      </div>
    );
  };

  const renderAggregatorCard = (model: any) => {
    const isSelected = selectedModel === model.displayName;
    
    return (
      <div
        key={model.id}
        className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
        onClick={() => onModelSelect(model.displayName)}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold">{model.displayName}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Curated solution providers with managed relationships and standardized processes
            </p>
            {membershipStatus === 'active' && model.formula?.membership_discount_percentage === 0 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                0% Member Discount
              </Badge>
            )}
          </div>

          {/* Platform Fee */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-bold text-orange-900">
                {model.formula?.platform_usage_fee_percentage || 15}% Platform Fee
              </span>
            </div>
            <p className="text-sm text-orange-700">Applied to all challenge values</p>
          </div>

          {/* Complexity Pricing */}
          {model.complexityPricing && model.complexityPricing.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-gray-800">Complexity Pricing</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {model.complexityPricing.map((complexity: any) => (
                  <div key={complexity.complexity} className="bg-white rounded p-3 border border-gray-200">
                    <div className="font-medium text-sm text-gray-700 mb-1">
                      {complexity.complexity}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-xs text-gray-500">Management:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {formatCurrency(complexity.management_fee, model.currency)}
                        </span>
                      </div>
                      {complexity.consulting_fee > 0 && (
                        <div className="text-sm">
                          <span className="text-xs text-gray-500">Consulting:</span>
                          <span className="font-semibold text-gray-900 ml-1">
                            {formatCurrency(complexity.consulting_fee, model.currency)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Services */}
          {model.additionalServices && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-800">Additional Services</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="text-xs text-gray-500">Analytics</div>
                  <div className="text-sm font-medium">{model.additionalServices.analytics}</div>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="text-xs text-gray-500">Support</div>
                  <div className="text-sm font-medium">{model.additionalServices.support}</div>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="text-xs text-gray-500">Onboarding</div>
                  <div className="text-sm font-medium">{model.additionalServices.onboarding}</div>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="text-xs text-gray-500">Workflow</div>
                  <div className="text-sm font-medium">{model.additionalServices.workflow}</div>
                </div>
              </div>
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
                Selected: Aggregator
              </>
            ) : (
              <>
                Select Aggregator
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {engagementModels.map((model) => {
            if (model.name === 'Market Place') {
              return renderMarketplaceCard(model);
            }
            
            if (model.name === 'Aggregator') {
              return renderAggregatorCard(model);
            }
            
            return null;
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
