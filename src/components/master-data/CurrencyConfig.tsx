
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, DollarSign, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { Country } from '@/types/seekerRegistration';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
}

const defaultCurrencies: Currency[] = [
  { id: '1', code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
  { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States of America' },
  { id: '3', code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
  { id: '4', code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
];

const dataManager = new LegacyDataManager<Currency[]>({
  key: 'master_data_currencies',
  defaultData: defaultCurrencies,
  version: 1
});

const CurrencyConfig = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<Partial<Currency>>({});
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load countries from master data
  useEffect(() => {
    const loadedCountries = countriesDataManager.loadData();
    console.log('🌍 CurrencyConfig - Loading countries from master data:', loadedCountries);
    setCountries(loadedCountries);
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadedCurrencies = dataManager.loadData();
    // Ensure we always have an array
    const safeCurrencies = Array.isArray(loadedCurrencies) ? loadedCurrencies : defaultCurrencies;
    console.log('🔍 CurrencyConfig - Loaded currencies:', safeCurrencies);
    setCurrencies(safeCurrencies);
    setIsInitialized(true);
  }, []);

  // Save data whenever currencies change
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    console.log('💾 CurrencyConfig - Saving currencies:', currencies.length);
    dataManager.saveData(currencies);
  }, [currencies, isInitialized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCurrency.code || !currentCurrency.name || !currentCurrency.symbol || !currentCurrency.country) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && currentCurrency.id) {
      setCurrencies(prev => prev.map(item => 
        item.id === currentCurrency.id ? { ...currentCurrency as Currency } : item
      ));
      toast({
        title: "Success",
        description: "Currency updated successfully.",
      });
    } else {
      const newCurrency = {
        ...currentCurrency,
        id: Date.now().toString(),
      } as Currency;
      setCurrencies(prev => [...prev, newCurrency]);
      toast({
        title: "Success",
        description: "Currency created successfully.",
      });
    }

    setCurrentCurrency({});
    setIsEditing(false);
  };

  const handleEdit = (currency: Currency) => {
    setCurrentCurrency(currency);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setCurrencies(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Currency deleted successfully.",
    });
  };

  const resetForm = () => {
    setCurrentCurrency({});
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    const defaultData = dataManager.resetToDefault();
    setCurrencies(defaultData);
    toast({
      title: "Success",
      description: "Currencies reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {isEditing ? 'Edit Currency' : 'Add New Currency'}
            </CardTitle>
            <Button
              onClick={handleResetToDefault}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={currentCurrency.country || ''}
                  onValueChange={(value) => setCurrentCurrency(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {countries.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No countries found in master data. Please add countries first.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="code">Currency Code *</Label>
                <Input
                  id="code"
                  value={currentCurrency.code || ''}
                  onChange={(e) => setCurrentCurrency(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., USD"
                  maxLength={3}
                />
              </div>
              <div>
                <Label htmlFor="name">Currency Name *</Label>
                <Input
                  id="name"
                  value={currentCurrency.name || ''}
                  onChange={(e) => setCurrentCurrency(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., US Dollar"
                />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  value={currentCurrency.symbol || ''}
                  onChange={(e) => setCurrentCurrency(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="e.g., $"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Currency
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Currencies ({currencies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currencies.map((currency) => (
              <div key={currency.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{currency.code}</Badge>
                  <div>
                    <h3 className="font-medium">{currency.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Symbol: {currency.symbol} • Country: {currency.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(currency)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(currency.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConfig;
