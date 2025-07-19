
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const CurrencyConfigSupabase: React.FC = () => {
  const [newCurrency, setNewCurrency] = useState({ name: '', code: '', symbol: '', country: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '', symbol: '', country: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currencies = [], isLoading, refetch } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_currencies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (currency: { name: string; code: string; symbol: string; country: string }) => {
      const { data, error } = await supabase
        .from('master_currencies')
        .insert([{ 
          name: currency.name.trim(), 
          code: currency.code.trim().toUpperCase() || null,
          symbol: currency.symbol.trim() || null,
          country: currency.country.trim() || null
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      setNewCurrency({ name: '', code: '', symbol: '', country: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Currency added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add currency", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, currency }: { id: string; currency: { name: string; code: string; symbol: string; country: string } }) => {
      const { data, error } = await supabase
        .from('master_currencies')
        .update({ 
          name: currency.name.trim(), 
          code: currency.code.trim().toUpperCase() || null,
          symbol: currency.symbol.trim() || null,
          country: currency.country.trim() || null
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      setEditingId(null);
      setEditingValue({ name: '', code: '', symbol: '', country: '' });
      toast({ title: "Success", description: "Currency updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update currency", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_currencies')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast({ title: "Success", description: "Currency deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete currency", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newCurrency.name.trim()) {
      addMutation.mutate(newCurrency);
    }
  };

  const handleEdit = (id: string, name: string, code: string, symbol: string, country: string) => {
    setEditingId(id);
    setEditingValue({ name, code: code || '', symbol: symbol || '', country: country || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, currency: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Currencies Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Currency
            </Button>
          </div>

          {isAdding && (
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newCurrency.name}
                onChange={(e) => setNewCurrency(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Currency name (e.g., US Dollar)"
                autoFocus
              />
              <Input
                value={newCurrency.code}
                onChange={(e) => setNewCurrency(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Code (e.g., USD)"
                maxLength={3}
              />
              <Input
                value={newCurrency.symbol}
                onChange={(e) => setNewCurrency(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="Symbol (e.g., $)"
                maxLength={5}
              />
              <Input
                value={newCurrency.country}
                onChange={(e) => setNewCurrency(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Country (e.g., United States)"
              />
              <div className="col-span-2 flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewCurrency({ name: '', code: '', symbol: '', country: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : currencies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No currencies configured. Add some currencies to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {currencies.map((currency) => (
                <div key={currency.id} className="p-3 border rounded-lg">
                  {editingId === currency.id ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Currency name"
                        autoFocus
                      />
                      <Input
                        value={editingValue.code}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="Code"
                        maxLength={3}
                      />
                      <Input
                        value={editingValue.symbol}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, symbol: e.target.value }))}
                        placeholder="Symbol"
                        maxLength={5}
                      />
                      <Input
                        value={editingValue.country}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Country"
                      />
                      <div className="col-span-2 flex items-center gap-2">
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', code: '', symbol: '', country: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.name}</span>
                            {currency.symbol && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{currency.symbol}</span>
                            )}
                            {currency.code && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{currency.code}</span>
                            )}
                          </div>
                          {currency.country && (
                            <p className="text-sm text-muted-foreground mt-1">{currency.country}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(currency.id, currency.name, currency.code || '', currency.symbol || '', currency.country || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(currency.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
