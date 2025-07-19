
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Target, Shield, TrendingUp, CheckCircle, Info, Star } from 'lucide-react';
import { useEngagementModelPricing } from '@/hooks/useEngagementModelPricing';
import { formatCurrency } from '@/utils/formatting';

interface DetailedEngagementModelCardProps {
  selectedTier: string | null;
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
  profile: any;
  membershipStatus: 'active' | 'inactive' | null;
  showCurrentBadge?: boolean;
  currentModel?: string | null;
}

export const DetailedEngagementModelCard: React.FC<DetailedEngagementModelCardProps> = ({
  selectedTier,
  selectedModel,
  onModelSelect,
  profile,
  membershipStatus,
  showCurrentBadge = false,
  currentModel = null
}) => {
  const { engagementModels, loading, error } = useEngagementModelPricing(
    selectedTier,
    profile,
    membershipStatus || 'inactive'
  );

  const renderComplexityPricing = (complexityPricing: any[], currency: string, isGeneralModel: boolean = false) => {
    if (!complexityPricing || complexityPricing.length === 0) return null;

    return (
      <div className="space-y-2">
        <h5 className="font-medium text-sm text-muted-foreground">Challenge Complexity Pricing:</h5>
        <div className="grid grid-cols-1 gap-2">
          {complexityPricing.map((pricing, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
              <span className="font-medium">{pricing.complexity}:</span>
              <div className="text-right">
                <div>Management: {formatCurrency(pricing.management_fee, currency)}</div>
                {!isGeneralModel && pricing.consulting_fee > 0 && (
                  <div>Consulting: {formatCurrency(pricing.consulting_fee, currency)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const isCurrentModel = (modelName: string) => {
    return currentModel?.toLowerCase() === modelName?.toLowerCase();
  };

  const isSelectedModel = (modelName: string) => {
    return selectedModel?.toLowerCase() === modelName?.toLowerCase();
  };

  const renderMarketplaceCard = (model: any) => {
    const generalSubtype = model.subtypes?.general;
    const programManagedSubtype = model.subtypes?.programManaged;
    const isMember = membershipStatus === 'active';
    const isSelected = isSelectedModel(model.name);
    const isCurrent = isCurrentModel(model.name);

    return (
      <Card 
        key={model.id}
        className={`relative cursor-pointer transition-all border-2 ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg' 
            : isCurrent
              ? 'border-green-500 bg-green-50'
              : 'border-border hover:border-primary/50 hover:shadow-md'
        }`}
        onClick={() => onModelSelect(model.name)}
      >
        {isSelected && (
          <div className="absolute -top-2 -right-2">
            <CheckCircle className="h-6 w-6 text-primary bg-white rounded-full" />
          </div>
        )}
        
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-orange-600" />
            {model.displayName}
            <div className="flex items-center gap-2 ml-auto">
              {isCurrent && showCurrentBadge && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Current
                </Badge>
              )}
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{model.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* General Model Section */}
          {generalSubtype && (
            <div className="p-3 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800">General Model</h4>
                <Badge variant="secondary" className="text-xs">
                  Platform Fee: {generalSubtype.formula.platform_usage_fee_percentage}%
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Management Fee:</span>
                  <span className="font-medium">
                    {formatCurrency(generalSubtype.formula.base_management_fee, model.currency)}
                  </span>
                </div>
                
                {isMember && (
                  <div className="flex justify-between text-green-700">
                    <span>Member Discount:</span>
                    <span className="font-medium">
                      -{generalSubtype.formula.membership_discount_percentage}%
                    </span>
                  </div>
                )}
              </div>

              {renderComplexityPricing(generalSubtype.complexityPricing, model.currency, true)}
            </div>
          )}

          {/* Program Managed Model Section */}
          {programManagedSubtype && (
            <div className="p-3 border rounded-lg bg-purple-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-800">Program Managed</h4>
                <Badge variant="secondary" className="text-xs">
                  Platform Fee: {programManagedSubtype.formula.platform_usage_fee_percentage}%
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Management Fee:</span>
                  <span className="font-medium">
                    {formatCurrency(programManagedSubtype.formula.base_management_fee, model.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Base Consulting Fee:</span>
                  <span className="font-medium">
                    {formatCurrency(programManagedSubtype.formula.base_consulting_fee, model.currency)}
                  </span>
                </div>
                
                {isMember && (
                  <div className="flex justify-between text-green-700">
                    <span>Member Discount:</span>
                    <span className="font-medium">
                      -{programManagedSubtype.formula.membership_discount_percentage}%
                    </span>
                  </div>
                )}
              </div>

              {renderComplexityPricing(programManagedSubtype.complexityPricing, model.currency, false)}
            </div>
          )}

          {/* Additional Features */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm mb-2">Included Features:</h5>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Full marketplace access</div>
              <div>• Solution seeker & solver matching</div>
              <div>• Challenge management tools</div>
              <div>• Payment processing</div>
              {isMember && <div className="text-green-700">• Priority support (Member benefit)</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAggregatorCard = (model: any) => {
    const isMember = membershipStatus === 'active';
    const isSelected = isSelectedModel(model.name);
    const isCurrent = isCurrentModel(model.name);

    return (
      <Card 
        key={model.id}
        className={`relative cursor-pointer transition-all border-2 ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg' 
            : isCurrent
              ? 'border-green-500 bg-green-50'
              : 'border-border hover:border-primary/50 hover:shadow-md'
        }`}
        onClick={() => onModelSelect(model.name)}
      >
        {isSelected && (
          <div className="absolute -top-2 -right-2">
            <CheckCircle className="h-6 w-6 text-primary bg-white rounded-full" />
          </div>
        )}
        
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600" />
            {model.displayName}
            <div className="flex items-center gap-2 ml-auto">
              {isCurrent && showCurrentBadge && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Current
                </Badge>
              )}
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{model.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {model.formula && (
            <>
              {/* Platform Fee Section */}
              <div className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-800">Platform Fees</h4>
                  <Badge variant="secondary" className="text-xs">
                    {model.formula.platform_usage_fee_percentage}%
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Management Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(model.formula.base_management_fee, model.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Base Consulting Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(model.formula.base_consulting_fee, model.currency)}
                    </span>
                  </div>
                  
                  {isMember && (
                    <div className="flex justify-between text-green-700">
                      <span>Member Discount:</span>
                      <span className="font-medium">
                        -{model.formula.membership_discount_percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Complexity Pricing */}
              {model.complexityPricing && model.complexityPricing.length > 0 && (
                <div className="p-3 border rounded-lg">
                  {renderComplexityPricing(model.complexityPricing, model.currency, false)}
                </div>
              )}
            </>
          )}

          {/* Additional Services */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm mb-2">Additional Services:</h5>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Solution aggregation & curation</div>
              <div>• Multi-vendor coordination</div>
              <div>• Quality assessment & ranking</div>
              <div>• Integrated delivery management</div>
              {isMember && <div className="text-green-700">• Premium aggregation tools (Member benefit)</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-center py-8">
          <p className="text-red-700 mb-4">Error loading engagement models: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Select Your Engagement Model
        </CardTitle>
        <p className="text-muted-foreground">
          Choose how you want to engage with solution providers and manage your innovation challenges.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {membershipStatus === 'inactive' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium">Member Benefits Available</p>
                <p className="text-amber-700 text-sm mt-1">
                  Members get discounted rates and priority support on all engagement models.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {engagementModels.map((model) => {
            if (model.name === 'Market Place') {
              return renderMarketplaceCard(model);
            } else {
              return renderAggregatorCard(model);
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
};
