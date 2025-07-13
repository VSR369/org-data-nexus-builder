
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { PricingConfig } from '@/types/pricing';

interface ExistingConfigsListProps {
  configs: PricingConfig[];
  setConfigs: React.Dispatch<React.SetStateAction<PricingConfig[]>>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
}

const ExistingConfigsList: React.FC<ExistingConfigsListProps> = ({
  configs,
  setConfigs,
  setCurrentConfig
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleEdit = (config: PricingConfig) => {
    setCurrentConfig(config);
  };

  const handleDelete = (id: string) => {
    setConfigs(prev => prev.filter(config => config.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Pricing Configurations</CardTitle>
      </CardHeader>
      <CardContent>
        {configs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No pricing configurations found</p>
            <p className="text-sm text-muted-foreground mt-2">Add a new configuration using the General Config tab</p>
          </div>
        ) : (
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(config)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(config.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Platform as a Service Pricing</h4>
                  {config.internalPaasPricing && config.internalPaasPricing.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Country</th>
                            <th className="text-left p-2">Currency</th>
                            <th className="text-left p-2">Quarterly</th>
                            <th className="text-left p-2">Half-Yearly</th>
                            <th className="text-left p-2">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {config.internalPaasPricing.map((pricing) => (
                            <tr key={pricing.id} className="border-b">
                              <td className="p-2">{pricing.country}</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-xs">{pricing.currency}</Badge>
                              </td>
                              <td className="p-2">{formatCurrency(pricing.quarterlyPrice, pricing.currency)}</td>
                              <td className="p-2">{formatCurrency(pricing.halfYearlyPrice, pricing.currency)}</td>
                              <td className="p-2">{formatCurrency(pricing.annualPrice, pricing.currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Platform as a Service pricing configured</p>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExistingConfigsList;
