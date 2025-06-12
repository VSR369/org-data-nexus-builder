
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CountryPricing, PricingConfig } from './types';
import { countriesDataManager, organizationTypesDataManager } from '@/utils/sharedDataManagers';

interface InternalPaasPricingManagerProps {
  configs: PricingConfig[];
  setConfigs: React.Dispatch<React.SetStateAction<PricingConfig[]>>;
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
  configs,
  setConfigs
}) => {
  const [newCountryPricing, setNewCountryPricing] = useState<Partial<CountryPricing & { organizationType: string }>>({});
  const [countries, setCountries] = useState<{ id: string; name: string; code: string; region?: string }[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const { toast } = useToast();

  // Load countries and organization types from master data
  useEffect(() => {
    console.log('🔄 InternalPaasPricingManager: Loading countries from master data...');
    const loadedCountries = countriesDataManager.loadData();
    console.log('✅ InternalPaasPricingManager: Loaded countries:', loadedCountries);
    setCountries(loadedCountries);

    console.log('🔄 InternalPaasPricingManager: Loading organization types from master data...');
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('✅ InternalPaasPricingManager: Loaded organization types:', loadedOrgTypes);
    setOrganizationTypes(loadedOrgTypes);
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

  const handleAddPricing = () => {
    if (!newCountryPricing.organizationType || !newCountryPricing.country || !newCountryPricing.currency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Find existing config for this organization type or create new one
    let existingConfig = configs.find(config => config.organizationType === newCountryPricing.organizationType);
    
    const pricingEntry = {
      id: Date.now().toString(),
      country: newCountryPricing.country!,
      currency: newCountryPricing.currency!,
      quarterlyPrice: newCountryPricing.quarterlyPrice || 0,
      halfYearlyPrice: newCountryPricing.halfYearlyPrice || 0,
      annualPrice: newCountryPricing.annualPrice || 0,
    } as CountryPricing;

    if (existingConfig) {
      // Update existing config
      const updatedConfig = {
        ...existingConfig,
        internalPaasPricing: [...existingConfig.internalPaasPricing, pricingEntry],
        version: existingConfig.version + 1
      };
      
      setConfigs(prev => prev.map(config => 
        config.id === existingConfig!.id ? updatedConfig : config
      ));
    } else {
      // Create new config
      const newConfig = {
        id: Date.now().toString(),
        organizationType: newCountryPricing.organizationType!,
        marketplaceFee: 0,
        aggregatorFee: 0,
        marketplacePlusAggregatorFee: 0,
        internalPaasPricing: [pricingEntry],
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
      } as PricingConfig;
      
      setConfigs(prev => [...prev, newConfig]);
    }

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

  // Get all pricing entries across all configs
  const allPricingEntries = configs.flatMap(config => 
    config.internalPaasPricing.map(pricing => ({
      ...pricing,
      organizationType: config.organizationType
    }))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform as a Service Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Data Entry Form */}
            <div className="p-6 border rounded-lg bg-muted/30">
              <h4 className="text-lg font-medium mb-4">Add New Pricing Entry</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Organization Type *</Label>
                  <Select
                    value={newCountryPricing.organizationType}
                    onValueChange={(value) => setNewCountryPricing(prev => ({ ...prev, organizationType: value }))}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  onClick={handleAddPricing}
                >
                  Add Pricing
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewCountryPricing({})}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Pricing Entries Table */}
            {allPricingEntries.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4">Current Pricing Entries ({allPricingEntries.length})</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization Type</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Quarterly</TableHead>
                        <TableHead>Half-Yearly</TableHead>
                        <TableHead>Annual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPricingEntries.map((pricing) => (
                        <TableRow key={`${pricing.organizationType}-${pricing.id}`}>
                          <TableCell className="font-medium">{pricing.organizationType}</TableCell>
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternalPaasPricingManager;
