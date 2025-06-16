
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Country } from '@/types/seekerRegistration';
import { PricingConfig } from '@/types/pricing';

const currenciesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_currencies',
  defaultData: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
  version: 1
});

const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: [],
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
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadedCurrencies = currenciesDataManager.loadData();
    setCurrencies(loadedCurrencies);
    
    const loadedCountries = countriesDataManager.loadData();
    setCountries(loadedCountries);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Configuration</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="organizationType">Organization Type</Label>
          <div className="col-span-2">
            <Select 
              value={currentConfig.organizationType || ""} 
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
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="country">Country</Label>
          <div className="col-span-2">
            <Select 
              value={currentConfig.country || ""} 
              onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, country: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="currency">Currency</Label>
          <div className="col-span-2">
            <Select 
              value={currentConfig.currency || ""} 
              onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, currency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="engagementModel">Engagement Model</Label>
          <div className="col-span-2">
            <Select 
              value={currentConfig.engagementModel || ""} 
              onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, engagementModel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an engagement model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketplace">Marketplace</SelectItem>
                <SelectItem value="Aggregator">Aggregator</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
