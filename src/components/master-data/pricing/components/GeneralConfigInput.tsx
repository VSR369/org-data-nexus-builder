
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingConfig } from '../types';
import { engagementModelsDataManager } from '../../engagement-models/engagementModelsDataManager';
import { EngagementModel } from '../../engagement-models/types';
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';
import { DataManager } from '@/utils/dataManager';

// Entity types data manager
const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society/ Trust'],
  version: 1
});

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
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [organizationTypesFromMaster, setOrganizationTypesFromMaster] = useState<string[]>([]);

  useEffect(() => {
    // Load engagement models from master data
    const loadedModels = engagementModelsDataManager.getEngagementModels();
    console.log('🔄 GeneralConfigInput: Loading engagement models:', loadedModels);
    setEngagementModels(loadedModels);

    // Load entity types from master data
    const loadedEntityTypes = entityTypeDataManager.loadData();
    console.log('🔄 GeneralConfigInput: Loading entity types:', loadedEntityTypes);
    setEntityTypes(loadedEntityTypes);

    // Load organization types from master data
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('🔄 GeneralConfigInput: Loading organization types:', loadedOrgTypes);
    setOrganizationTypesFromMaster(loadedOrgTypes);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value);
    setCurrentConfig(prev => ({ 
      ...prev, 
      [field]: isNaN(numericValue) ? undefined : numericValue 
    }));
  };

  const membershipStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'not-a-member', label: 'Not a Member' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Pricing Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Master Data Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {organizationTypesFromMaster.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {organizationTypesFromMaster.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No organization types found in master data.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="entityType">Entity Type *</Label>
              <Select
                value={currentConfig.entityType || ''}
                onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, entityType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {entityTypes.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No entity types found in master data.
                </p>
              )}
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
                  {membershipStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discount Section for Active Members */}
          {currentConfig.membershipStatus === 'active' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountPercentage">Member Discount (%) *</Label>
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
            </div>
          )}

          {/* Engagement Model Pricing Section - 4 Rows */}
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
              </div>
            </div>

            {/* Row 2: Quarterly Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quarterlyFee">Quarterly Engagement Model Fee (%) *</Label>
                <Input
                  id="quarterlyFee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentConfig.quarterlyFee !== undefined ? currentConfig.quarterlyFee.toString() : ''}
                  onChange={(e) => handleInputChange('quarterlyFee', e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>

            {/* Row 3: Half Yearly Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="halfYearlyFee">Half Yearly Engagement Model Fee (%) *</Label>
                <Input
                  id="halfYearlyFee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentConfig.halfYearlyFee !== undefined ? currentConfig.halfYearlyFee.toString() : ''}
                  onChange={(e) => handleInputChange('halfYearlyFee', e.target.value)}
                  placeholder="12"
                />
              </div>
            </div>

            {/* Row 4: Annual Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualFee">Annual Engagement Model Fee (%) *</Label>
                <Input
                  id="annualFee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentConfig.annualFee !== undefined ? currentConfig.annualFee.toString() : ''}
                  onChange={(e) => handleInputChange('annualFee', e.target.value)}
                  placeholder="10"
                />
              </div>
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
