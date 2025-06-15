
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingConfig } from '../types';

interface ConfigurationCardProps {
  config: PricingConfig;
  onEdit: (config: PricingConfig) => void;
  onDelete: (configId: string) => void;
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  config,
  onEdit,
  onDelete
}) => {
  // Calculate active member pricing based on discount - fixed calculation
  const calculateActiveMemberPrice = (originalPrice: number, discount: number) => {
    // Apply discount as a simple percentage reduction
    return Math.round(originalPrice * (100 - discount) / 100);
  };

  const discount = config.discountPercentage || 0;

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-lg">{config.organizationType}</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant={config.membershipStatus === 'active' ? 'default' : 'secondary'}>
              {config.membershipStatus === 'active' ? 'Active Member' : 
               config.membershipStatus === 'inactive' ? 'Inactive Member' : 'Not a Member'}
            </Badge>
            {config.membershipStatus === 'active' && config.discountPercentage && (
              <Badge variant="outline">{config.discountPercentage}% Discount</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Version {config.version} • Created: {config.createdAt}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(config)}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(config.id)}>
            Delete
          </Button>
        </div>
      </div>
      
      {/* Non-Member Pricing */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 text-gray-600">Non-Member Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-md border">
            <span className="text-sm font-medium">Marketplace Fee</span>
            <Badge variant="secondary">{config.marketplaceFee}%</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-background rounded-md border">
            <span className="text-sm font-medium">Aggregator Fee</span>
            <Badge variant="secondary">{config.aggregatorFee}%</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-background rounded-md border">
            <span className="text-sm font-medium">Marketplace + Aggregator</span>
            <Badge variant="secondary">{config.marketplacePlusAggregatorFee}%</Badge>
          </div>
        </div>
      </div>

      {/* Active Member Pricing (if discount exists) */}
      {config.membershipStatus === 'active' && discount > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-green-600">Active Member Pricing (After {discount}% Discount)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
              <span className="text-sm font-medium">Marketplace Fee</span>
              <Badge variant="default" className="bg-green-600">
                {calculateActiveMemberPrice(config.marketplaceFee, discount)}%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
              <span className="text-sm font-medium">Aggregator Fee</span>
              <Badge variant="default" className="bg-green-600">
                {calculateActiveMemberPrice(config.aggregatorFee, discount)}%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
              <span className="text-sm font-medium">Marketplace + Aggregator</span>
              <Badge variant="default" className="bg-green-600">
                {calculateActiveMemberPrice(config.marketplacePlusAggregatorFee, discount)}%
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationCard;
