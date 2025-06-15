
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingConfig } from '../types';
import { engagementModelsDataManager } from '../../engagement-models/engagementModelsDataManager';
import { EngagementModel } from '../../engagement-models/types';

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
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);

  useEffect(() => {
    // Load engagement models from master data
    const loadedModels = engagementModelsDataManager.getEngagementModels();
    console.log('🔄 GeneralConfigInput: Loading engagement models:', loadedModels);
    
    // Enhanced deduplication - normalize names and remove exact duplicates
    const uniqueModels = loadedModels.reduce((acc: EngagementModel[], current) => {
      const normalizedCurrentName = current.name.toLowerCase().trim();
      const exists = acc.find(model => 
        model.name.toLowerCase().trim() === normalizedCurrentName
      );
      
      if (!exists) {
        acc.push(current);
      } else {
        console.log('🔄 Duplicate engagement model found and skipped:', current.name);
      }
      return acc;
    }, []);
    
    // Sort alphabetically for consistent display
    uniqueModels.sort((a, b) => a.name.localeCompare(b.name));
    
    setEngagementModels(uniqueModels);
    console.log('✅ GeneralConfigInput: Set unique engagement models:', uniqueModels.length, uniqueModels.map(m => m.name));
  }, []);

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
              <Label htmlFor="engagementModel">Engagement Model *</Label>
              <Select
                value={currentConfig.engagementModel || ''}
                onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, engagementModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select engagement model" />
                </SelectTrigger>
                <SelectContent>
                  {engagementModels.map((model) => (
                    <SelectItem key={`${model.id}-${model.name}`} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {engagementModels.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No engagement models found. Please configure them first.
                </p>
              )}
              {engagementModels.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {engagementModels.length} unique models available
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="engagementModelFee">Engagement Model Fee (%) *</Label>
              <Input
                id="engagementModelFee"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={currentConfig.engagementModelFee !== undefined ? currentConfig.engagementModelFee.toString() : ''}
                onChange={(e) => handleInputChange('engagementModelFee', e.target.value)}
                placeholder="15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
