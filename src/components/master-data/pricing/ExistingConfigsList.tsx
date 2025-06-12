
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
                  <h4 className="font-medium text-sm mb-2">Fee Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{config.marketplaceFee}%</div>
                        <div className="text-xs text-muted-foreground">Marketplace Fee</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{config.aggregatorFee}%</div>
                        <div className="text-xs text-muted-foreground">Aggregator Fee</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{config.marketplacePlusAggregatorFee}%</div>
                        <div className="text-xs text-muted-foreground">Marketplace + Aggregator</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Platform as a Service Countries</h4>
                  {config.internalPaasPricing && config.internalPaasPricing.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {config.internalPaasPricing.map((pricing) => (
                        <Badge key={pricing.id} variant="outline" className="text-xs">
                          {pricing.country} ({pricing.currency})
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Platform as a Service countries configured</p>
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
