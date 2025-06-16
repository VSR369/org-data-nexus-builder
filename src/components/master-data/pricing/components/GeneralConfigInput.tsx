
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

const currenciesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_currencies',
  defaultData: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
  version: 1
});

const countriesDataManager = new LegacyDataManager<Country[]>({
  key: 'master_data_countries',
  defaultData: [
    { id: '1', name: 'India', code: 'IN', region: 'Asia' },
    { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
    { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
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
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    console.log('🔄 GeneralConfigInput: Loading data...');
    
    const loadedCurrencies = currenciesDataManager.loadData();
    // Ensure we always have an array, fallback to default if needed
    const safeCurrencies = Array.isArray(loadedCurrencies) ? loadedCurrencies : ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
    console.log('💰 GeneralConfigInput: Loaded currencies:', safeCurrencies);
    setCurrencies(safeCurrencies);
    
    const loadedCountries = countriesDataManager.loadData();
    // Ensure we always have an array and filter out invalid entries
    const safeCountries = Array.isArray(loadedCountries) 
      ? loadedCountries.filter(country => country && country.code && country.name)
      : [
          { id: '1', name: 'India', code: 'IN', region: 'Asia' },
          { id: '2', name: 'United States of America', code: 'US', region: 'North America' },
          { id: '3', name: 'United Arab Emirates', code: 'AE', region: 'Middle East' }
        ];
    console.log('🌍 GeneralConfigInput: Loaded countries:', safeCountries);
    setCountries(safeCountries);
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
                {organizationTypes.filter(type => type && typeof type === 'string').map((type) => (
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
              onValueChange={handleCountryChange}
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
                {currencies.filter(currency => currency && typeof currency === 'string').map((currency) => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentConfig.country && currentConfig.currency && (
              <p className="text-xs text-muted-foreground mt-1">
                Currency auto-selected based on country selection
              </p>
            )}
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
