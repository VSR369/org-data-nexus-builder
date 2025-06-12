
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { PricingConfig } from './types';

interface ExistingConfigsListProps {
  configs: PricingConfig[];
  onEdit: (config: PricingConfig) => void;
  onDelete: (id: string) => void;
}

const ExistingConfigsList: React.FC<ExistingConfigsListProps> = ({
  configs,
  onEdit,
  onDelete
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Pricing Configurations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">{config.organizationType}</h3>
                  <p className="text-sm text-muted-foreground">
                    Version {config.version} • Created: {config.createdAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(config)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(config.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Platform as a Service Pricing</h4>
                  {config.internalPaasPricing && config.internalPaasPricing.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {config.internalPaasPricing.map((pricing) => (
                        <div key={pricing.id} className="border rounded-lg p-3 bg-muted/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{pricing.country}</span>
                            <Badge variant="outline" className="text-xs">{pricing.currency}</Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Quarterly:</span>
                              <span>{formatCurrency(pricing.quarterlyPrice, pricing.currency)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Half-Yearly:</span>
                              <span>{formatCurrency(pricing.halfYearlyPrice, pricing.currency)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual:</span>
                              <span>{formatCurrency(pricing.annualPrice, pricing.currency)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Platform as a Service pricing configured</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExistingConfigsList;
