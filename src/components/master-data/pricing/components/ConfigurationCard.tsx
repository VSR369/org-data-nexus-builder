import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingConfig } from '@/types/pricing';

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

  // Check if engagement model is Platform as a Service (PaaS)
  const isPaaSModel = (engagementModel: string) => {
    return engagementModel.toLowerCase().includes('platform as a service') || 
           engagementModel.toLowerCase().includes('paas');
  };

  // Format fee display based on engagement model
  const formatFeeDisplay = (fee: number, currency: string, engagementModel: string) => {
    if (isPaaSModel(engagementModel)) {
      return `${currency} ${fee.toLocaleString()}`;
    }
    return `${fee}%`;
  };

  const discount = config.discountPercentage || 0;
  const isPaaS = isPaaSModel(config.engagementModel);

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-lg">{config.organizationType}</h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge variant="outline">{config.country}</Badge>
            <Badge variant="outline">{config.currency}</Badge>
            {config.entityType && (
              <Badge variant="outline">{config.entityType}</Badge>
            )}
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
      
      {/* Engagement Model Configuration */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 text-gray-600">Engagement Model: {config.engagementModel}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.quarterlyFee !== undefined && (
            <div className="flex items-center justify-between p-3 bg-background rounded-md border">
              <span className="text-sm font-medium">Quarterly Fee</span>
              <Badge variant="secondary">
                {formatFeeDisplay(config.quarterlyFee, config.currency, config.engagementModel)}
              </Badge>
            </div>
          )}
          
          {config.halfYearlyFee !== undefined && (
            <div className="flex items-center justify-between p-3 bg-background rounded-md border">
              <span className="text-sm font-medium">Half Yearly Fee</span>
              <Badge variant="secondary">
                {formatFeeDisplay(config.halfYearlyFee, config.currency, config.engagementModel)}
              </Badge>
            </div>
          )}

          {config.annualFee !== undefined && (
            <div className="flex items-center justify-between p-3 bg-background rounded-md border">
              <span className="text-sm font-medium">Annual Fee</span>
              <Badge variant="secondary">
                {formatFeeDisplay(config.annualFee, config.currency, config.engagementModel)}
              </Badge>
            </div>
          )}

          {/* Legacy support for old engagementModelFee */}
          {config.engagementModelFee !== undefined && !config.quarterlyFee && !config.halfYearlyFee && !config.annualFee && (
            <div className="flex items-center justify-between p-3 bg-background rounded-md border">
              <span className="text-sm font-medium">Legacy Fee</span>
              <Badge variant="secondary">
                {formatFeeDisplay(config.engagementModelFee, config.currency, config.engagementModel)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Active Member Pricing (if discount exists) */}
      {config.membershipStatus === 'active' && discount > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-green-600">Active Member Pricing (After {discount}% Discount)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.quarterlyFee !== undefined && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                <span className="text-sm font-medium">Quarterly Fee</span>
                <Badge variant="default" className="bg-green-600">
                  {isPaaS ? 
                    `${config.currency} ${calculateActiveMemberPrice(config.quarterlyFee, discount).toLocaleString()}` : 
                    `${calculateActiveMemberPrice(config.quarterlyFee, discount)}%`}
                </Badge>
              </div>
            )}

            {config.halfYearlyFee !== undefined && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                <span className="text-sm font-medium">Half Yearly Fee</span>
                <Badge variant="default" className="bg-green-600">
                  {isPaaS ? 
                    `${config.currency} ${calculateActiveMemberPrice(config.halfYearlyFee, discount).toLocaleString()}` : 
                    `${calculateActiveMemberPrice(config.halfYearlyFee, discount)}%`}
                </Badge>
              </div>
            )}

            {config.annualFee !== undefined && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                <span className="text-sm font-medium">Annual Fee</span>
                <Badge variant="default" className="bg-green-600">
                  {isPaaS ? 
                    `${config.currency} ${calculateActiveMemberPrice(config.annualFee, discount).toLocaleString()}` : 
                    `${calculateActiveMemberPrice(config.annualFee, discount)}%`}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationCard;
