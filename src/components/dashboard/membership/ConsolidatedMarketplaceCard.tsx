
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [selectedSubtype, setSelectedSubtype] = useState<'general' | 'programManaged'>('general');

  const handleSelection = () => {
    const selectedModelName = selectedSubtype === 'general' 
      ? 'Market Place General' 
      : 'Market Place Program Managed';
    onModelSelect(selectedModelName);
  };

  const renderPricingBreakdown = (subtype: 'general' | 'programManaged') => {
    const subtypeData = model.subtypes?.[subtype];
    if (!subtypeData) return null;

    const { formula, complexityPricing } = subtypeData;

    return (
      <div className="space-y-4">
        {/* Platform Fee */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Platform Usage Fee</span>
            {membershipStatus === 'active' && (
              <Badge className="bg-green-100 text-green-800 ml-auto">
                <Tag className="h-3 w-3 mr-1" />
                Member Rate
              </Badge>
            )}
          </div>
          <div className="text-xl font-bold text-blue-900">
            {formula.platform_usage_fee_percentage}%
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Applied to total challenge value
          </p>
        </div>

        {/* Management Fee by Complexity */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-800">Management Fee by Complexity</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {complexityPricing.map((complexity: any) => (
              <div key={complexity.complexity} className="bg-white rounded p-3 border">
                <div className="font-medium text-sm text-gray-700">
                  {complexity.complexity}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {model.currency} {complexity.management_fee.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {complexity.management_fee_multiplier}x multiplier
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consulting Fee by Complexity - Only for Program Managed */}
        {subtype === 'programManaged' && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Consulting Fee by Complexity</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {complexityPricing.map((complexity: any) => (
                <div key={complexity.complexity} className="bg-white rounded p-3 border">
                  <div className="font-medium text-sm text-green-700">
                    {complexity.complexity}
                  </div>
                  <div className="text-lg font-bold text-green-900">
                    {model.currency} {complexity.consulting_fee.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600">
                    {complexity.consulting_fee_multiplier}x multiplier
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advance Payment */}
        <div className="bg-amber-50 rounded-lg p-3">
          <div className="text-sm text-amber-800">
            <strong>Advance Payment:</strong> {formula.advance_payment_percentage}% of total fees
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={handleSelection}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{model.displayName}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {model.description}
          </p>
          {membershipStatus === 'active' && (
            <Badge className="bg-green-100 text-green-800">
              <Tag className="h-3 w-3 mr-1" />
              Member Pricing Applied
            </Badge>
          )}
        </div>

        {/* Tabs for General vs Program Managed */}
        <Tabs 
          value={selectedSubtype} 
          onValueChange={(value) => setSelectedSubtype(value as 'general' | 'programManaged')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="programManaged">Program Managed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">
                Direct marketplace access with standard support
              </p>
            </div>
            {renderPricingBreakdown('general')}
          </TabsContent>
          
          <TabsContent value="programManaged" className="space-y-4">
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">
                Comprehensive program management with consulting support
              </p>
            </div>
            {renderPricingBreakdown('programManaged')}
          </TabsContent>
        </Tabs>

        {/* Selection Button */}
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          onClick={handleSelection}
        >
          {isSelected ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Selected: {selectedSubtype === 'general' ? 'General' : 'Program Managed'}
            </>
          ) : (
            <>
              Select {selectedSubtype === 'general' ? 'General' : 'Program Managed'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
