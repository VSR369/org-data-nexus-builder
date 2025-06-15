
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingConfig } from '../types';

interface GeneralConfigInputProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
  organizationTypes: string[];
  onSave: () => void;
  onClear: () => void;
}

const GeneralConfigInput: React.FC<GeneralConfigInputProps> = ({
  currentConfig,
  setCurrentConfig,
  organizationTypes,
  onSave,
  onClear
}) => {
  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value);
    setCurrentConfig(prev => ({ 
      ...prev, 
      [field]: isNaN(numericValue) ? undefined : numericValue 
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Pricing Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Label htmlFor="membershipStatus">Membership Status *</Label>
              <Select
                value={currentConfig.membershipStatus || ''}
                onValueChange={(value: 'active' | 'inactive' | 'not-a-member') => {
                  setCurrentConfig(prev => ({ 
                    ...prev, 
                    membershipStatus: value,
                    discountPercentage: value === 'active' ? prev.discountPercentage : undefined
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select membership status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="not-a-member">Not a Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentConfig.membershipStatus === 'active' && (
              <div>
                <Label htmlFor="discountPercentage">Discount (%) *</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentConfig.discountPercentage !== undefined ? currentConfig.discountPercentage.toString() : ''}
                  onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Button onClick={onSave}>
              {currentConfig.id ? 'Update' : 'Save'} Configuration
            </Button>
            <Button variant="outline" onClick={onClear}>
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralConfigInput;
