
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from 'lucide-react';

interface EngagementModelCardProps {
  model: any;
  isSelected: boolean;
  onModelSelect: (modelName: string) => void;
  membershipStatus: 'active' | 'inactive';
  showCurrentBadge?: boolean;
}

export const EngagementModelCard: React.FC<EngagementModelCardProps> = ({
  model,
  isSelected,
  onModelSelect,
  membershipStatus,
  showCurrentBadge = false
}) => {
  console.log('⚡ EngagementModelCard props:', { 
    modelName: model.displayName || model.name, 
    isSelected, 
    membershipStatus,
    showCurrentBadge
  });

  const handleCardClick = () => {
    const modelName = model.displayName || model.name;
    console.log('⚡ EngagementModelCard clicked, selecting:', modelName);
    onModelSelect(modelName);
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

  const modelName = model.displayName || model.name;

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
          <span>{modelName}</span>
          <div className="flex items-center gap-2">
            {showCurrentBadge && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Current
              </Badge>
            )}
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-purple-600" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {model.description || 'Professional engagement model with comprehensive features'}
        </p>

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
          <h4 className="text-sm font-medium">Features:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Professional service delivery</li>
            <li>• Dedicated project management</li>
            <li>• Quality assurance processes</li>
            <li>• Comprehensive reporting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
