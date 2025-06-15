
import React from 'react';
import { Button } from "@/components/ui/button";
import { PricingConfig } from '../types';

interface ConfigurationActionsProps {
  currentConfig: Partial<PricingConfig>;
  onSave: () => void;
  onClear: () => void;
}

const ConfigurationActions: React.FC<ConfigurationActionsProps> = ({
  currentConfig,
  onSave,
  onClear
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onSave}>
        {currentConfig.id ? 'Update' : 'Save'} Configuration
      </Button>
      <Button variant="outline" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
};

export default ConfigurationActions;
