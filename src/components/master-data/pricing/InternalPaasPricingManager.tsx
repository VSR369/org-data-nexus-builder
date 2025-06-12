
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CountryPricing, PricingConfig } from './types';
import { countriesDataManager } from '@/utils/sharedDataManagers';

interface InternalPaasPricingManagerProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
}

// Get currency from master data based on country
const getCurrencyByCountry = (countryName: string, countries: any[]): string => {
  const countryCurrencyMap: { [key: string]: string } = {
    'India': 'INR',
    'United States of America': 'USD',
    'United Arab Emirates': 'AED',
    'United Kingdom': 'GBP',
    'Germany': 'EUR',
    'France': 'EUR',
    'Japan': 'JPY',
    'Australia': 'AUD',
    'China': 'CNY',
    'Brazil': 'BRL',
    'Canada': 'CAD',
    'Mexico': 'MXN'
  };
  
  return countryCurrencyMap[countryName] || '';
};

const InternalPaasPricingManager: React.FC<InternalPaasPricingManagerProps> = ({
  currentConfig,
  setCurrentConfig
}) => {
  const [newCountryPricing, setNewCountryPricing] = useState<Partial<CountryPricing>>({});
  const [countries, setCountries] = useState<{ id: string; name: string; code: string; region?: string }[]>([]);
  const { toast } = useToast();

  // Load countries from master data
  useEffect(() => {
    console.log('🔄 InternalPaasPricingManager: Loading countries from master data...');
    const loadedCountries = countriesDataManager.loadData();
    console.log('✅ InternalPaasPricingManager: Loaded countries:', loadedCountries);
    setCountries(loadedCountries);
  }, []);

  const handleCountryChange = (countryName: string) => {
    console.log('🔄 Country selected:', countryName);
    const currency = getCurrencyByCountry(countryName, countries);
    console.log('💱 Auto-selected currency from master data:', currency);
    
    setNewCountryPricing(prev => ({ 
      ...prev, 
      country: countryName,
      currency: currency
    }));
    
    if (currency) {
      toast({
        title: "Currency Auto-Selected",
        description: `Currency ${currency} automatically selected for ${countryName} from master data`,
      });
    }
  };

  const handleCountryPricingSubmit = () => {
    if (!newCountryPricing.country || !newCountryPricing.currency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const pricingEntry = {
      ...newCountryPricing,
      id: Date.now().toString(),
    } as CountryPricing;

    setCurrentConfig(prev => ({
      ...prev,
      internalPaasPricing: [...(prev.internalPaasPricing || []), pricingEntry],
    }));

    setNewCountryPricing({});
    
    toast({
      title: "Success",
      description: "Platform as a Service pricing added successfully.",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Platform as a Service Pricing</h3>
        </div>

        <div className="mb-4 p-4 border rounded-lg bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <Label>Country *</Label>
              <Select
                value={newCountryPricing.country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Currency *</Label>
              <Input
                value={newCountryPricing.currency || ''}
                onChange={(e) => setNewCountryPricing(prev => ({ ...prev, currency: e.target.value }))}
                placeholder="Auto-populated from master data"
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Quarterly Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newCountryPricing.quarterlyPrice || ''}
                onChange={(e) => setNewCountryPricing(prev => ({ ...prev, quarterlyPrice: parseFloat(e.target.value) }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Half-Yearly Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newCountryPricing.halfYearlyPrice || ''}
                onChange={(e) => setNewCountryPricing(prev => ({ ...prev, halfYearlyPrice: parseFloat(e.target.value) }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Annual Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newCountryPricing.annualPrice || ''}
                onChange={(e) => setNewCountryPricing(prev => ({ ...prev, annualPrice: parseFloat(e.target.value) }))}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleCountryPricingSubmit}
              size="sm"
            >
              Add Pricing
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewCountryPricing({})}
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Quarterly</TableHead>
              <TableHead>Half-Yearly</TableHead>
              <TableHead>Annual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentConfig.internalPaasPricing?.map((pricing) => (
              <TableRow key={pricing.id}>
                <TableCell>{pricing.country}</TableCell>
                <TableCell>
                  <Badge variant="outline">{pricing.currency}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(pricing.quarterlyPrice, pricing.currency)}</TableCell>
                <TableCell>{formatCurrency(pricing.halfYearlyPrice, pricing.currency)}</TableCell>
                <TableCell>{formatCurrency(pricing.annualPrice, pricing.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InternalPaasPricingManager;
