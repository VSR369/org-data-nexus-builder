import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Currency {
  id?: string;
  name: string;
  code?: string;
  symbol?: string;
  country?: string;
  country_code?: string;
  is_user_created?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Country {
  id: string;
  name: string;
  code?: string;
}

export default function CurrencyConfigSupabase() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    symbol: '',
    country: '',
    country_code: ''
  });

  const loadCurrencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_currencies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error loading currencies:', error);
      toast({
        title: "Error",
        description: "Failed to load currencies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('master_countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadCurrencies();
    loadCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Currency name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Find selected country details
      const selectedCountry = countries.find(c => c.name === formData.country);
      
      const currencyData = {
        name: formData.name.trim(),
        code: formData.code.trim() || null,
        symbol: formData.symbol.trim() || null,
        country: formData.country || null,
        country_code: selectedCountry?.code || formData.country_code || null,
        is_user_created: true
      };

      if (editingCurrency) {
        const { error } = await supabase
          .from('master_currencies')
          .update(currencyData)
          .eq('id', editingCurrency.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Currency updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('master_currencies')
          .insert([currencyData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Currency added successfully",
        });
      }
      
      resetForm();
      await loadCurrencies();
    } catch (error: any) {
      console.error('Error saving currency:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save currency",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setFormData({
      name: currency.name || '',
      code: currency.code || '',
      symbol: currency.symbol || '',
      country: currency.country || '',
      country_code: currency.country_code || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this currency?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_currencies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Currency deleted successfully",
      });
      
      await loadCurrencies();
    } catch (error) {
      console.error('Error deleting currency:', error);
      toast({
        title: "Error",
        description: "Failed to delete currency",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      symbol: '',
      country: '',
      country_code: ''
    });
    setEditingCurrency(null);
    setIsDialogOpen(false);
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      country: countryName,
      country_code: selectedCountry?.code || ''
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Currency Configuration</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Currency
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingCurrency ? 'Edit Currency' : 'Add New Currency'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Currency Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., US Dollar"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Currency Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., USD"
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Currency Symbol</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                    placeholder="e.g., $"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.name}>
                          {country.name} {country.code && `(${country.code})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingCurrency ? 'Update' : 'Add'} Currency
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-left p-4 font-medium">Symbol</th>
                <th className="text-left p-4 font-medium">Country</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">
                    {loading ? 'Loading currencies...' : 'No currencies found. Add your first currency above.'}
                  </td>
                </tr>
              ) : (
                currencies.map((currency) => (
                  <tr key={currency.id} className="border-b hover:bg-muted/25">
                    <td className="p-4">{currency.name}</td>
                    <td className="p-4">{currency.code || '-'}</td>
                    <td className="p-4">{currency.symbol || '-'}</td>
                    <td className="p-4">{currency.country || '-'}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(currency)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(currency.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}