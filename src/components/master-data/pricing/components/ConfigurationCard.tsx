
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
  // Calculate active member pricing based on discount
  const calculateActiveMemberPrice = (originalPrice: number, discount: number) => {
    const discountedPrice = originalPrice - (originalPrice * discount / 100);
    return Math.round(discountedPrice * 10) / 10; // Round to 1 decimal place
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
      
      {/* Engagement Model Pricing */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 text-gray-600">Engagement Model Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-md border">
            <span className="text-sm font-medium">Engagement Model</span>
            <Badge variant="outline">{config.engagementModel}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-background rounded-md border">
            <span className="text-sm font-medium">Fee</span>
            <Badge variant="secondary">{config.engagementModelFee}%</Badge>
          </div>
        </div>
      </div>

      {/* Active Member Pricing (if discount exists) */}
      {config.membershipStatus === 'active' && discount > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-green-600">Active Member Pricing (After {discount}% Discount)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
              <span className="text-sm font-medium">Engagement Model</span>
              <Badge variant="outline">{config.engagementModel}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
              <span className="text-sm font-medium">Discounted Fee</span>
              <Badge variant="default" className="bg-green-600">
                {calculateActiveMemberPrice(config.engagementModelFee, discount)}%
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationCard;
