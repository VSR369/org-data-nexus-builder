
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PricingConfig } from './types';

interface GeneralConfigFormProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
  organizationTypes: string[];
}

const GeneralConfigForm: React.FC<GeneralConfigFormProps> = ({
  currentConfig,
  setCurrentConfig,
  organizationTypes
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="organizationType">Organization Type *</Label>
          <Select
            value={currentConfig.organizationType}
            onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, organizationType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="marketplaceFee">Marketplace Fee (%) *</Label>
          <Input
            id="marketplaceFee"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={currentConfig.marketplaceFee || ''}
            onChange={(e) => setCurrentConfig(prev => ({ ...prev, marketplaceFee: parseFloat(e.target.value) }))}
            placeholder="30"
          />
        </div>
        <div>
          <Label htmlFor="aggregatorFee">Aggregator Fee (%) *</Label>
          <Input
            id="aggregatorFee"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={currentConfig.aggregatorFee || ''}
            onChange={(e) => setCurrentConfig(prev => ({ ...prev, aggregatorFee: parseFloat(e.target.value) }))}
            placeholder="15"
          />
        </div>
        <div>
          <Label htmlFor="marketplacePlusAggregatorFee">Marketplace Plus Aggregator (%) *</Label>
          <Input
            id="marketplacePlusAggregatorFee"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={currentConfig.marketplacePlusAggregatorFee || ''}
            onChange={(e) => setCurrentConfig(prev => ({ ...prev, marketplacePlusAggregatorFee: parseFloat(e.target.value) }))}
            placeholder="45"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralConfigForm;
