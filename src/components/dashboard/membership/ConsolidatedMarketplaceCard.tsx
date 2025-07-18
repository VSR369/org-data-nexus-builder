
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, ArrowRight, Tag, Users, Zap } from 'lucide-react';

interface ConsolidatedMarketplaceCardProps {
  model: any;
  isSelected: boolean;
  onModelSelect: (modelName: string) => void;
  membershipStatus?: 'active' | 'inactive';
}

export const ConsolidatedMarketplaceCard: React.FC<ConsolidatedMarketplaceCardProps> = ({
  model,
  isSelected,
  onModelSelect,
  membershipStatus = 'inactive'
}) => {
  const handleSelection = () => {
    onModelSelect('Marketplace');
  };

  const renderPricingSection = (title: string, subtype: 'general' | 'programManaged', icon: React.ReactNode, bgColor: string) => {
    const subtypeData = model.subtypes?.[subtype];
    if (!subtypeData) return null;

    const { formula, complexityPricing } = subtypeData;

    return (
      <div className={`${bgColor} rounded-lg p-4 space-y-3`}>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="font-semibold text-gray-800">{title}</span>
          {membershipStatus === 'active' && (
            <Badge className="bg-green-100 text-green-800 ml-auto">
              <Tag className="h-3 w-3 mr-1" />
              Member Rate
            </Badge>
          )}
        </div>

        {/* Platform Fee */}
        <div className="bg-white rounded p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Platform Usage Fee</span>
            <span className="text-lg font-bold text-blue-600">
              {formula.platform_usage_fee_percentage}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Applied to total challenge value</p>
        </div>

        {/* Complexity Pricing Grid */}
        <div className="grid grid-cols-2 gap-2">
          {complexityPricing.map((complexity: any) => (
            <div key={complexity.complexity} className="bg-white rounded p-3 border border-gray-200">
              <div className="font-medium text-sm text-gray-700 mb-1">
                {complexity.complexity}
              </div>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-xs text-gray-500">Mgmt:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {model.currency} {complexity.management_fee.toLocaleString()}
                  </span>
                </div>
                {complexity.consulting_fee > 0 && (
                  <div className="text-sm">
                    <span className="text-xs text-gray-500">Consulting:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {model.currency} {complexity.consulting_fee.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Advance Payment */}
        <div className="bg-white rounded p-2 border border-gray-200">
          <div className="text-xs text-gray-600">
            <strong>Advance Payment:</strong> {formula.advance_payment_percentage}% of total fees
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{model.displayName}</h3>
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
              {model.subtypes?.general?.formula?.platform_usage_fee_percentage || 15}% Platform Fee
            </span>
          </div>
          <p className="text-sm text-blue-700">Applied to all challenge values</p>
        </div>

        {/* Pricing Sections */}
        <div className="space-y-4">
          {/* General Marketplace */}
          {renderPricingSection(
            'General Marketplace',
            'general',
            <Users className="h-4 w-4 text-blue-600" />,
            'bg-blue-50'
          )}

          {/* Program Managed */}
          {renderPricingSection(
            'Program Managed',
            'programManaged',
            <Zap className="h-4 w-4 text-green-600" />,
            'bg-green-50'
          )}
        </div>

        {/* Selection Button */}
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          onClick={handleSelection}
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
        <div className="text-center text-xs text-gray-500 mt-2">
          Choose between General and Program Managed when creating challenges
        </div>
      </div>
    </div>
  );
};
