
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
  );
};

export default ConfigurationCard;
