
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingConfig } from '../types';
import ConfigurationCard from './ConfigurationCard';

interface SavedConfigurationsListProps {
  configs: PricingConfig[];
  onEdit: (config: PricingConfig) => void;
  onDelete: (configId: string) => void;
}

const SavedConfigurationsList: React.FC<SavedConfigurationsListProps> = ({
  configs,
  onEdit,
  onDelete
}) => {
  if (configs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved General Configurations ({configs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {configs.map((config) => (
            <ConfigurationCard
              key={config.id}
              config={config}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedConfigurationsList;
