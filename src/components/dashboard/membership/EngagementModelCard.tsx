
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Settings, ArrowRight, Tag, Users, Briefcase } from 'lucide-react';

interface EngagementModelCardProps {
  model: any;
  isSelected: boolean;
  onModelSelect: (modelName: string) => void;
  membershipStatus?: 'active' | 'inactive';
  showCurrentBadge?: boolean;
}

export const EngagementModelCard: React.FC<EngagementModelCardProps> = ({
  model,
  isSelected,
  onModelSelect,
  membershipStatus = 'inactive',
  showCurrentBadge = false
}) => {
  const handleSelection = () => {
    onModelSelect(model.displayName || model.name);
  };

  const getModelIcon = (modelName: string) => {
    const name = modelName?.toLowerCase() || '';
    if (name.includes('aggregator')) return <Briefcase className="h-5 w-5 text-orange-600" />;
    if (name.includes('market')) return <Users className="h-5 w-5 text-blue-600" />;
    return <Users className="h-5 w-5 text-purple-600" />;
  };

  const getModelDescription = (model: any) => {
    if (model.description) return model.description;
    
    const name = model.name?.toLowerCase() || '';
    if (name.includes('aggregator')) {
      return "Direct engagement with curated solution providers through our aggregation platform";
    }
    return "Customized engagement model for your specific needs";
  };

  return (
    <div
      className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : showCurrentBadge
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={handleSelection}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getModelIcon(model.name)}
            <h3 className="text-xl font-bold">{model.displayName || model.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {getModelDescription(model)}
          </p>
          <div className="flex items-center justify-center gap-2">
            {showCurrentBadge && (
              <Badge className="bg-green-100 text-green-800">
                Current Model
              </Badge>
            )}
            {membershipStatus === 'active' && model.formula && (
              <Badge className="bg-green-100 text-green-800">
                <Tag className="h-3 w-3 mr-1" />
                Member Pricing
              </Badge>
            )}
          </div>
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
          onClick={handleSelection}
        >
          {isSelected ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Selected
            </>
          ) : (
            <>
              Select {model.displayName || model.name}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
