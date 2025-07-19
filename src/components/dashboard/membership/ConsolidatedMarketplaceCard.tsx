
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Building, Zap } from 'lucide-react';

interface ConsolidatedMarketplaceCardProps {
  model: any;
  isSelected: boolean;
  onModelSelect: (modelName: string) => void;
  membershipStatus: 'active' | 'inactive';
}

export const ConsolidatedMarketplaceCard: React.FC<ConsolidatedMarketplaceCardProps> = ({
  model,
  isSelected,
  onModelSelect,
  membershipStatus
}) => {
  console.log('⚡ ConsolidatedMarketplaceCard props:', { 
    modelName: model.name, 
    isSelected, 
    membershipStatus,
    subtypes: model.subtypes?.length || 0
  });

  const handleCardClick = () => {
    console.log('⚡ ConsolidatedMarketplaceCard clicked, selecting:', model.name);
    onModelSelect(model.name);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSubtypeIcon = (subtypeName: string) => {
    switch (subtypeName?.toLowerCase()) {
      case 'freelancer':
        return <Users className="h-4 w-4" />;
      case 'agency':
        return <Building className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
          : 'hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span>{model.name}</span>
          </div>
          {isSelected && (
            <CheckCircle className="h-5 w-5 text-purple-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {model.description || 'Connect with skilled professionals for your projects'}
        </p>
        
        {/* Subtypes */}
        {model.subtypes && model.subtypes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Available Options:</h4>
            <div className="space-y-2">
              {model.subtypes.map((subtype: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {getSubtypeIcon(subtype.name)}
                    <span className="text-sm font-medium">{subtype.name}</span>
                  </div>
                  <Badge variant="outline">{subtype.category || 'Professional'}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Information */}
        {model.pricing && model.pricing.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Pricing:</h4>
            {model.pricing.map((pricing: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{pricing.config_name}:</span>
                <span className="font-medium">
                  {formatCurrency(pricing.calculated_value, pricing.currency_code)}
                </span>
              </div>
            ))}
            {membershipStatus === 'active' && (
              <div className="text-xs text-green-600 mt-1">
                ✓ Member pricing applied
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Features:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Access to verified professionals</li>
            <li>• Secure payment processing</li>
            <li>• Project management tools</li>
            <li>• Quality assurance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
