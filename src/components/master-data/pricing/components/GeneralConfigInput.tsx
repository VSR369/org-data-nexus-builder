
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Country } from '@/types/seekerRegistration';
import { PricingConfig } from '@/types/pricing';
import { getCurrencyByCountry } from '../utils/currencyUtils';
import { organizationTypesDataManager, countriesDataManager } from '@/utils/sharedDataManagers';
import { EntityTypeService } from '@/utils/masterData/entityTypeService';

// Engagement Models Data Manager
const engagementModelsDataManager = new LegacyDataManager<any[]>({
  key: 'master_data_engagement_models',
  defaultData: [
    { id: '1', name: 'Marketplace', isActive: true },
    { id: '2', name: 'Aggregator', isActive: true },
    { id: '3', name: 'Marketplace+Aggregator', isActive: true },
    { id: '4', name: 'Platform as a Service', isActive: true }
  ],
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [organizationTypesFromMaster, setOrganizationTypesFromMaster] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [engagementModels, setEngagementModels] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔄 GeneralConfigInput: Loading master data...');
    
    // Load countries
    const loadedCountries = countriesDataManager.loadData();
    const safeCountries = Array.isArray(loadedCountries) 
      ? loadedCountries.filter(country => country && country.code && country.name)
      : [
          { id: '1', name: 'India', code: 'IN', region: 'Asia' },
          { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
          { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
        ];
    console.log('🌍 GeneralConfigInput: Loaded countries:', safeCountries);
    setCountries(safeCountries);
    
    // Load organization types from master data
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    const safeOrgTypes = Array.isArray(loadedOrgTypes) ? loadedOrgTypes : [];
    console.log('🏢 GeneralConfigInput: Loaded organization types:', safeOrgTypes);
    setOrganizationTypesFromMaster(safeOrgTypes);
    
    // Load entity types from master data
    const loadedEntityTypes = EntityTypeService.getEntityTypes();
    console.log('🏛️ GeneralConfigInput: Loaded entity types:', loadedEntityTypes);
    setEntityTypes(loadedEntityTypes);
    
    // Load engagement models from master data
    const loadedEngagementModels = engagementModelsDataManager.loadData();
    const safeEngagementModels = Array.isArray(loadedEngagementModels) 
      ? loadedEngagementModels.filter(model => model && model.name && model.isActive)
      : [
          { id: '1', name: 'Marketplace', isActive: true },
          { id: '2', name: 'Aggregator', isActive: true },
          { id: '3', name: 'Marketplace+Aggregator', isActive: true },
          { id: '4', name: 'Platform as a Service', isActive: true }
        ];
    console.log('🤝 GeneralConfigInput: Loaded engagement models:', safeEngagementModels);
    setEngagementModels(safeEngagementModels);
  }, []);

  const handleCountryChange = (selectedCountryCode: string) => {
    console.log('🌍 Country selected:', selectedCountryCode);
    
    // Find the selected country to get its name
    const selectedCountry = countries.find(country => country.code === selectedCountryCode);
    const countryName = selectedCountry?.name || '';
    
    // Get the currency for this country
    const suggestedCurrency = getCurrencyByCountry(countryName);
    
    console.log('💰 Suggested currency for', countryName, ':', suggestedCurrency);
    
    // Update the configuration with both country and auto-selected currency
    setCurrentConfig(prev => ({
      ...prev,
      country: selectedCountryCode,
      currency: suggestedCurrency || prev.currency || ''
    }));
  };

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

  const membershipStatuses = [
    { value: 'member', label: 'Member' },
    { value: 'not-a-member', label: 'Not a Member' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pricing Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master Data Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="country">Country *</Label>
            <Select 
              value={currentConfig.country || ""} 
              onValueChange={handleCountryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={currentConfig.currency || ''}
              readOnly
              placeholder="Auto-populated from master data"
              className="bg-muted"
            />
            {currentConfig.country && currentConfig.currency && (
              <p className="text-xs text-muted-foreground mt-1">
                Currency auto-selected based on country selection
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="organizationType">Organization Type *</Label>
            <Select 
              value={currentConfig.organizationType || ""} 
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
          </div>

          <div>
            <Label htmlFor="entityType">Entity Type *</Label>
            <Select 
              value={currentConfig.entityType || ""} 
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
          </div>

          <div>
            <Label htmlFor="membershipStatus">Membership Status *</Label>
            <Select 
              value={currentConfig.membershipStatus || ""} 
              onValueChange={(value: 'member' | 'not-a-member') => {
                setCurrentConfig(prev => ({ 
                  ...prev, 
                  membershipStatus: value,
                  discountPercentage: value === 'member' ? prev.discountPercentage : undefined
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

        {/* Member Discount Section - Only show if membership status is member */}
        {currentConfig.membershipStatus === 'member' && (
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

        {/* Engagement Model Pricing Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Engagement Model Pricing Configuration</h3>
          
          {/* Engagement Model Selection */}
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
                    <SelectItem key={model.id} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fee Configuration - Show only if engagement model is selected */}
          {currentConfig.engagementModel && (
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
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={onSave} className="flex-1">
            Save Configuration
          </Button>
          <Button onClick={onClear} variant="outline">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralConfigInput;
