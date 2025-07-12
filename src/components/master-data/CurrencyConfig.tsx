import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, DollarSign, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CurrencyService } from '@/utils/masterData/currencyService';
import { Currency } from '@/utils/masterData/interfaces';
import { Country } from '@/types/seekerRegistration';
import { countriesDataManager } from '@/utils/sharedDataManagers';

const CurrencyConfig = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<Partial<Currency>>({});
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load countries from master data
  useEffect(() => {
    fetchCountries();
    fetchCurrencies();
    setIsInitialized(true);
  }, []);

  const fetchCurrencies = async () => {
    try {
      const currenciesData = CurrencyService.getCurrencies();
      console.log("Currencies from local storage:", currenciesData);
      setCurrencies(currenciesData || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      setCurrencies([]);
    }
  };

  const fetchCountries = async () => {
    try {
      const countriesData = countriesDataManager.loadData();
      console.log("Countries from local storage:", countriesData);
      setCountries(countriesData || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    }
  };

  const saveCurrencyData = async (currencyData: Currency) => {
    try {
      const currentCurrencies = CurrencyService.getCurrencies() || [];
      const newCurrency = { ...currencyData, id: Date.now().toString() };
      currentCurrencies.push(newCurrency);
      CurrencyService.saveCurrencies(currentCurrencies);
      console.log('💾 CurrencyConfig - Saved currency to local storage:', newCurrency);
    } catch (error) {
      console.error('❌ Error saving currency to local storage:', error);
    }
  };

  const updateCurrencyData = async(currencyData: Currency) => {
    try {
      const currentCurrencies = CurrencyService.getCurrencies() || [];
      const updatedCurrencies = currentCurrencies.map(c => c.id === currencyData.id ? currencyData : c);
      CurrencyService.saveCurrencies(updatedCurrencies);
      console.log('💾 CurrencyConfig - updated currency in local storage:', currencyData);
    } catch (error) {
      console.error('❌ Error updating currency in local storage:', error);
    }
  };

  const deleteCurrency = async (currencyID: string) => {
    try {
      const currentCurrencies = CurrencyService.getCurrencies() || [];
      const updatedCurrencies = currentCurrencies.filter(c => c.id !== currencyID);
      CurrencyService.saveCurrencies(updatedCurrencies);
      console.log('💾 CurrencyConfig - deleted currency from local storage:', currencyID);
    } catch (error) {
      console.error('❌ Error deleting currency from local storage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!currentCurrency.code || !currentCurrency.name || !currentCurrency.symbol || !currentCurrency.country_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();

    if (isEditing && currentCurrency.id) {
      setCurrencies(prev => prev.map(item => 
        item.id === currentCurrency.id ? { 
          ...currentCurrency as Currency,
          updatedAt: now,
          isUserCreated: true
        } : item
      ));
      console.log("Update");
      console.log(currentCurrency)
      await updateCurrencyData({
        ...currentCurrency as Currency,
        updatedAt: now,
        isUserCreated: true
      });
      toast({
        title: "Success",
        description: "Currency updated successfully.",
      });
    } else {
      const newCurrency: Currency = {
        ...currentCurrency as Omit<Currency, 'id' | 'createdAt' | 'updatedAt' | 'isUserCreated'>,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
        isUserCreated: true
      };
      setCurrencies(prev => [...prev, newCurrency]);
      console.log("++++++++++++++");
      console.log(newCurrency);
      await saveCurrencyData(newCurrency);
      toast({
        title: "Success",
        description: "Currency created successfully.",
      });
    }
    await fetchCurrencies();
    setCurrentCurrency({});
    setIsEditing(false);
  };

  const handleEdit = (currency: Currency) => {
    setCurrentCurrency(currency);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    setCurrencies(prev => prev.filter(item => item.id !== id));

    await deleteCurrency(id);
    await fetchCurrencies();
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
    // Reset to emergency fallback currencies through the service
    const emergencyFallback = CurrencyService.getCurrencies();
    setCurrencies(emergencyFallback);
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
                  value={currentCurrency.country_id || ''}
                  onValueChange={(value) => setCurrentCurrency(prev => ({ ...prev, country_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
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
                      Symbol: {currency.symbol} • Country: {currency.countryName || 'Unknown'}
                    </p>
                    {currency.isUserCreated && (
                      <p className="text-xs text-blue-600 mt-1">User Created</p>
                    )}
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