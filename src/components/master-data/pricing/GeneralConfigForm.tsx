
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleSaveConfig = () => {
    if (!currentConfig.organizationType || 
        currentConfig.marketplaceFee === undefined || 
        currentConfig.aggregatorFee === undefined || 
        currentConfig.marketplacePlusAggregatorFee === undefined) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "General configuration saved successfully.",
    });

    // Clear form after saving
    setCurrentConfig({});
  };

  return (
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
  );
};

export default GeneralConfigForm;
