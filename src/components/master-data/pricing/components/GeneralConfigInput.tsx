
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Country } from '@/types/seekerRegistration';

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
  configName: string;
  setConfigName: (name: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  selectedEngagementModel: string;
  setSelectedEngagementModel: (model: string) => void;
}

const GeneralConfigInput: React.FC<GeneralConfigInputProps> = ({
  configName,
  setConfigName,
  selectedCountry,
  setSelectedCountry,
  selectedCurrency,
  setSelectedCurrency,
  selectedEngagementModel,
  setSelectedEngagementModel
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
          <Label htmlFor="configName">Config Name</Label>
          <Input id="configName" value={configName} onChange={(e) => setConfigName(e.target.value)} className="col-span-2" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="country">Country</Label>
          <div className="col-span-2">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full">
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
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-full">
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
            <Select value={selectedEngagementModel} onValueChange={setSelectedEngagementModel}>
              <SelectTrigger className="w-full">
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
      </CardContent>
    </Card>
  );
};

export default GeneralConfigInput;
