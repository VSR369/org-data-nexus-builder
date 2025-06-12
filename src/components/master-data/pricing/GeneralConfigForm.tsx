
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [savedConfigs, setSavedConfigs] = useState<PricingConfig[]>([]);

  // Load saved configurations on component mount
  useEffect(() => {
    loadSavedConfigs();
  }, []);

  const loadSavedConfigs = () => {
    const existingConfigs = JSON.parse(localStorage.getItem('pricing_general_configs') || '[]');
    setSavedConfigs(existingConfigs);
  };

  const handleSaveConfig = () => {
    console.log('🔍 Current config before validation:', currentConfig);
    
    // Check if all required fields are filled
    const isOrgTypeValid = currentConfig.organizationType && currentConfig.organizationType.trim() !== '';
    const isMarketplaceFeeValid = currentConfig.marketplaceFee !== undefined && 
                                   currentConfig.marketplaceFee !== null && 
                                   !isNaN(currentConfig.marketplaceFee) &&
                                   currentConfig.marketplaceFee >= 0;
    const isAggregatorFeeValid = currentConfig.aggregatorFee !== undefined && 
                                 currentConfig.aggregatorFee !== null && 
                                 !isNaN(currentConfig.aggregatorFee) &&
                                 currentConfig.aggregatorFee >= 0;
    const isMarketplacePlusAggregatorFeeValid = currentConfig.marketplacePlusAggregatorFee !== undefined && 
                                                currentConfig.marketplacePlusAggregatorFee !== null && 
                                                !isNaN(currentConfig.marketplacePlusAggregatorFee) &&
                                                currentConfig.marketplacePlusAggregatorFee >= 0;

    console.log('🔍 Validation checks:', {
      isOrgTypeValid,
      isMarketplaceFeeValid,
      isAggregatorFeeValid,
      isMarketplacePlusAggregatorFeeValid
    });

    if (!isOrgTypeValid || !isMarketplaceFeeValid || !isAggregatorFeeValid || !isMarketplacePlusAggregatorFeeValid) {
      toast({
        title: "Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    // Save configuration to localStorage
    const configToSave = {
      id: Date.now().toString(),
      organizationType: currentConfig.organizationType,
      marketplaceFee: currentConfig.marketplaceFee,
      aggregatorFee: currentConfig.aggregatorFee,
      marketplacePlusAggregatorFee: currentConfig.marketplacePlusAggregatorFee,
      internalPaasPricing: [],
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save to localStorage
    const existingConfigs = JSON.parse(localStorage.getItem('pricing_general_configs') || '[]');
    const updatedConfigs = [...existingConfigs, configToSave];
    localStorage.setItem('pricing_general_configs', JSON.stringify(updatedConfigs));

    console.log('✅ Configuration saved:', configToSave);

    toast({
      title: "Success",
      description: "General configuration saved successfully.",
    });

    // Clear form after saving and reload saved configs
    setCurrentConfig({});
    loadSavedConfigs();
  };

  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value);
    setCurrentConfig(prev => ({ 
      ...prev, 
      [field]: isNaN(numericValue) ? undefined : numericValue 
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select
                  value={currentConfig.organizationType || ''}
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
                  value={currentConfig.marketplaceFee !== undefined ? currentConfig.marketplaceFee.toString() : ''}
                  onChange={(e) => handleInputChange('marketplaceFee', e.target.value)}
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
                  value={currentConfig.aggregatorFee !== undefined ? currentConfig.aggregatorFee.toString() : ''}
                  onChange={(e) => handleInputChange('aggregatorFee', e.target.value)}
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
                  value={currentConfig.marketplacePlusAggregatorFee !== undefined ? currentConfig.marketplacePlusAggregatorFee.toString() : ''}
                  onChange={(e) => handleInputChange('marketplacePlusAggregatorFee', e.target.value)}
                  placeholder="45"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveConfig}>
                Save Configuration
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentConfig({})}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Configurations Display */}
      {savedConfigs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved General Configurations ({savedConfigs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedConfigs.map((config) => (
                <div key={config.id} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{config.organizationType}</h3>
                      <p className="text-sm text-muted-foreground">
                        Version {config.version} • Created: {config.createdAt}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ID: {config.id}
                    </Badge>
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneralConfigForm;
