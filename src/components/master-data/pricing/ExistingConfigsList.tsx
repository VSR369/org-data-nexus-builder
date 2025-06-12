
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Marketplace Fee:</span>
                  <p>{config.marketplaceFee}%</p>
                </div>
                <div>
                  <span className="font-medium">Aggregator Fee:</span>
                  <p>{config.aggregatorFee}%</p>
                </div>
                <div>
                  <span className="font-medium">Marketplace Plus Aggregator:</span>
                  <p>{config.marketplacePlusAggregatorFee}%</p>
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
