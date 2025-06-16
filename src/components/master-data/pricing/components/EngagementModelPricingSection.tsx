
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PricingConfig } from '@/types/pricing';
import { EngagementModel } from '../../engagement-models/types';

interface EngagementModelPricingSectionProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
  engagementModels: EngagementModel[];
}

const EngagementModelPricingSection: React.FC<EngagementModelPricingSectionProps> = ({
  currentConfig,
  setCurrentConfig,
  engagementModels
}) => {
  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value);
    setCurrentConfig(prev => ({ 
      ...prev, 
      [field]: isNaN(numericValue) ? undefined : numericValue 
    }));
  };

  // Check if engagement model is Platform as a Service (PaaS)
  const isPaaSModel = (engagementModel: string) => {
    return engagementModel?.toLowerCase().includes('platform as a service') || 
           engagementModel?.toLowerCase().includes('paas');
  };

  const isCurrentModelPaaS = isPaaSModel(currentConfig.engagementModel || '');

  // Filter to only show active engagement models and remove any potential duplicates
  const uniqueEngagementModels = engagementModels.filter(model => model.isActive);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Engagement Model Pricing Configuration</h3>
      
      {/* Row 1: Engagement Model Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="engagementModel">Engagement Model *</Label>
          <Select
            value={currentConfig.engagementModel || ''}
            onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, engagementModel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select engagement model" />
            </SelectTrigger>
            <SelectContent>
              {uniqueEngagementModels.map((model) => (
                <SelectItem key={model.id} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {uniqueEngagementModels.length === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              No engagement models found. Please configure them first.
            </p>
          )}
        </div>
      </div>

      {/* Row 2: All Three Fee Inputs in One Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="quarterlyFee">
            Quarterly Fee {isCurrentModelPaaS && currentConfig.currency ? `(${currentConfig.currency})` : '(%)'} *
          </Label>
          <Input
            id="quarterlyFee"
            type="number"
            min="0"
            step={isCurrentModelPaaS ? "0.01" : "0.1"}
            max={isCurrentModelPaaS ? undefined : "100"}
            value={currentConfig.quarterlyFee !== undefined ? currentConfig.quarterlyFee.toString() : ''}
            onChange={(e) => handleInputChange('quarterlyFee', e.target.value)}
            placeholder={isCurrentModelPaaS ? "1000" : "15"}
          />
        </div>

        <div>
          <Label htmlFor="halfYearlyFee">
            Half Yearly Fee {isCurrentModelPaaS && currentConfig.currency ? `(${currentConfig.currency})` : '(%)'} *
          </Label>
          <Input
            id="halfYearlyFee"
            type="number"
            min="0"
            step={isCurrentModelPaaS ? "0.01" : "0.1"}
            max={isCurrentModelPaaS ? undefined : "100"}
            value={currentConfig.halfYearlyFee !== undefined ? currentConfig.halfYearlyFee.toString() : ''}
            onChange={(e) => handleInputChange('halfYearlyFee', e.target.value)}
            placeholder={isCurrentModelPaaS ? "1800" : "12"}
          />
        </div>

        <div>
          <Label htmlFor="annualFee">
            Annual Fee {isCurrentModelPaaS && currentConfig.currency ? `(${currentConfig.currency})` : '(%)'} *
          </Label>
          <Input
            id="annualFee"
            type="number"
            min="0"
            step={isCurrentModelPaaS ? "0.01" : "0.1"}
            max={isCurrentModelPaaS ? undefined : "100"}
            value={currentConfig.annualFee !== undefined ? currentConfig.annualFee.toString() : ''}
            onChange={(e) => handleInputChange('annualFee', e.target.value)}
            placeholder={isCurrentModelPaaS ? "3000" : "10"}
          />
        </div>
      </div>
    </div>
  );
};

export default EngagementModelPricingSection;
