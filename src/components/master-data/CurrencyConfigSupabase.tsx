
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Currency {
  id: string;
  name: string;
  code?: string;
  symbol?: string;
  country?: string;
}

const CurrencyConfigSupabase: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ name: '', code: '', symbol: '', country: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '', symbol: '', country: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching currencies from Supabase...');
      
      const { data, error } = await supabase
        .from('master_currencies')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching currencies:', error);
        throw error;
      }

      console.log('✅ CRUD TEST - Currencies loaded from Supabase:', data);
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

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleAddCurrency = async () => {
    if (!newCurrency.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_currencies')
        .insert([{ 
          name: newCurrency.name.trim(),
          code: newCurrency.code.trim() || null,
          symbol: newCurrency.symbol.trim() || null,
          country: newCurrency.country.trim() || null
        }])
        .select()
        .single();

      if (error) throw error;

      setCurrencies(prev => [...prev, data]);
      setNewCurrency({ name: '', code: '', symbol: '', country: '' });
      setIsAdding(false);
      
      toast({
        title: "Success",
        description: `${newCurrency.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding currency:', error);
      toast({
        title: "Error",
        description: "Failed to add currency",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (currency: Currency) => {
    setEditingId(currency.id);
    setEditingValue({ 
      name: currency.name, 
      code: currency.code || '', 
      symbol: currency.symbol || '',
      country: currency.country || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_currencies')
        .update({ 
          name: editingValue.name.trim(),
          code: editingValue.code.trim() || null,
          symbol: editingValue.symbol.trim() || null,
          country: editingValue.country.trim() || null
        })
        .eq('id', editingId)
        .select()
        .single();

      if (error) throw error;

      setCurrencies(prev => prev.map(currency => 
        currency.id === editingId ? data : currency
      ));
      setEditingId(null);
      setEditingValue({ name: '', code: '', symbol: '', country: '' });
      
      toast({
        title: "Success",
        description: "Currency updated successfully",
      });
    } catch (error) {
      console.error('Error updating currency:', error);
      toast({
        title: "Error",
        description: "Failed to update currency",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this currency?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_currencies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCurrencies(prev => prev.filter(currency => currency.id !== id));
      
      toast({
        title: "Success",
        description: "Currency deleted successfully",
      });
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Currencies Configuration (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={fetchCurrencies} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Currency
            </Button>
          </div>

          {isAdding && (
            <div className="grid grid-cols-4 gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newCurrency.name}
                onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                placeholder="Currency name"
              />
              <Input
                value={newCurrency.code}
                onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
                placeholder="Code (USD)"
              />
              <Input
                value={newCurrency.symbol}
                onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                placeholder="Symbol ($)"
              />
              <Input
                value={newCurrency.country}
                onChange={(e) => setNewCurrency({ ...newCurrency, country: e.target.value })}
                placeholder="Country"
              />
              <div className="col-span-4 flex gap-2">
                <Button onClick={handleAddCurrency} size="sm" disabled={loading}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : currencies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No currencies configured. Add some currencies to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {currencies.map((currency) => (
                <div key={currency.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === currency.id ? (
                    <div className="grid grid-cols-4 gap-2 flex-1 mr-4">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue({ ...editingValue, name: e.target.value })}
                        placeholder="Name"
                      />
                      <Input
                        value={editingValue.code}
                        onChange={(e) => setEditingValue({ ...editingValue, code: e.target.value })}
                        placeholder="Code"
                      />
                      <Input
                        value={editingValue.symbol}
                        onChange={(e) => setEditingValue({ ...editingValue, symbol: e.target.value })}
                        placeholder="Symbol"
                      />
                      <Input
                        value={editingValue.country}
                        onChange={(e) => setEditingValue({ ...editingValue, country: e.target.value })}
                        placeholder="Country"
                      />
                      <div className="col-span-4 flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{currency.name}</span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {currency.code} {currency.symbol}
                        </span>
                        {currency.country && (
                          <span className="text-sm text-muted-foreground">({currency.country})</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(currency)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(currency.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConfigSupabase;
