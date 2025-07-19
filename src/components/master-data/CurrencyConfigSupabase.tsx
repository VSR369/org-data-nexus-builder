import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Currency {
  id?: string;
  name: string;
  code?: string;
  symbol?: string;
}

const defaultCurrencies = [
  { name: 'US Dollar', code: 'USD', symbol: '$' },
  { name: 'Euro', code: 'EUR', symbol: '€' },
  { name: 'Indian Rupee', code: 'INR', symbol: '₹' },
  { name: 'British Pound', code: 'GBP', symbol: '£' },
  { name: 'Japanese Yen', code: 'JPY', symbol: '¥' }
];

const CurrencyConfigSupabase = () => {
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [newCurrency, setNewCurrency] = useState({ name: '', code: '', symbol: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '', symbol: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_currencies')
        .select('*')
        .order('name');

      if (error) throw error;

      setCurrencies(data || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast({
        title: "Error",
        description: "Failed to load currencies.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCurrency = async () => {
    if (newCurrency.name.trim()) {
      try {
        // Check for duplicates
        const duplicate = currencies.find(c => 
          c.name.toLowerCase() === newCurrency.name.trim().toLowerCase() ||
          (newCurrency.code && c.code?.toLowerCase() === newCurrency.code.trim().toLowerCase())
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A currency with this name or code already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_currencies')
          .insert([{
            name: newCurrency.name.trim(),
            code: newCurrency.code.trim() || null,
            symbol: newCurrency.symbol.trim() || null
          }]);

        if (error) throw error;

        setNewCurrency({ name: '', code: '', symbol: '' });
        setIsAdding(false);
        fetchCurrencies();
        toast({
          title: "Success",
          description: "Currency added successfully",
        });
      } catch (error) {
        console.error('Error adding currency:', error);
        toast({
          title: "Error",
          description: "Failed to add currency.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditCurrency = (index: number) => {
    setEditingIndex(index);
    setEditingValue({
      name: currencies[index].name,
      code: currencies[index].code || '',
      symbol: currencies[index].symbol || ''
    });
  };

  const handleSaveEdit = async () => {
    if (editingValue.name.trim() && editingIndex !== null) {
      try {
        const currencyToUpdate = currencies[editingIndex];
        
        const { error } = await supabase
          .from('master_currencies')
          .update({
            name: editingValue.name.trim(),
            code: editingValue.code.trim() || null,
            symbol: editingValue.symbol.trim() || null
          })
          .eq('id', currencyToUpdate.id);

        if (error) throw error;

        setEditingIndex(null);
        setEditingValue({ name: '', code: '', symbol: '' });
        fetchCurrencies();
        toast({
          title: "Success",
          description: "Currency updated successfully",
        });
      } catch (error) {
        console.error('Error updating currency:', error);
        toast({
          title: "Error",
          description: "Failed to update currency.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCurrency = async (index: number) => {
    try {
      const currencyToDelete = currencies[index];
      
      const { error } = await supabase
        .from('master_currencies')
        .delete()
        .eq('id', currencyToDelete.id);

      if (error) throw error;

      fetchCurrencies();
      toast({
        title: "Success",
        description: "Currency deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting currency:', error);
      toast({
        title: "Error",
        description: "Failed to delete currency.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue({ name: '', code: '', symbol: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCurrency({ name: '', code: '', symbol: '' });
  };

  const handleResetToDefault = async () => {
    try {
      // Clear existing data
      await supabase.from('master_currencies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default data
      const { error } = await supabase
        .from('master_currencies')
        .insert(defaultCurrencies);

      if (error) throw error;

      fetchCurrencies();
      setEditingIndex(null);
      setEditingValue({ name: '', code: '', symbol: '' });
      setIsAdding(false);
      setNewCurrency({ name: '', code: '', symbol: '' });
      toast({
        title: "Success",
        description: "Currencies reset to default values",
      });
    } catch (error) {
      console.error('Error resetting currencies:', error);
      toast({
        title: "Error",
        description: "Failed to reset currencies.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading currencies...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Currencies</CardTitle>
            <CardDescription>
              Configure currencies for financial transactions and pricing
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchCurrencies}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Currencies ({currencies.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Currency
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-currency-name">Currency Name</Label>
                <Input
                  id="new-currency-name"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                  placeholder="Enter currency name"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="new-currency-code">Code</Label>
                  <Input
                    id="new-currency-code"
                    value={newCurrency.code}
                    onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value})}
                    placeholder="USD"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-currency-symbol">Symbol</Label>
                  <Input
                    id="new-currency-symbol"
                    value={newCurrency.symbol}
                    onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                    placeholder="$"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddCurrency} size="sm" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex items-center gap-1">
                <X className="w-3 h-3" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          {currencies.map((currency, index) => (
            <div key={currency.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingValue.name}
                      onChange={(e) => setEditingValue({...editingValue, name: e.target.value})}
                      placeholder="Currency name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editingValue.code}
                        onChange={(e) => setEditingValue({...editingValue, code: e.target.value})}
                        placeholder="Code"
                      />
                      <Input
                        value={editingValue.symbol}
                        onChange={(e) => setEditingValue({...editingValue, symbol: e.target.value})}
                        placeholder="Symbol"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <span className="font-medium">{currency.name}</span>
                      {currency.code && <span className="text-sm text-muted-foreground ml-2">({currency.code})</span>}
                      {currency.symbol && <span className="text-sm text-muted-foreground ml-2">{currency.symbol}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditCurrency(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteCurrency(index)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConfigSupabase;