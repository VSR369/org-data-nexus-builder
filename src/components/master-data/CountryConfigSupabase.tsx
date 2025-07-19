
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const CountryConfigSupabase: React.FC = () => {
  const [newCountry, setNewCountry] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', code: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: countries = [], isLoading, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_countries')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (country: { name: string; code: string }) => {
      const { data, error } = await supabase
        .from('master_countries')
        .insert([{ 
          name: country.name.trim(), 
          code: country.code.trim().toUpperCase() || null 
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      setNewCountry({ name: '', code: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Country added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add country", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, country }: { id: string; country: { name: string; code: string } }) => {
      const { data, error } = await supabase
        .from('master_countries')
        .update({ 
          name: country.name.trim(), 
          code: country.code.trim().toUpperCase() || null 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      setEditingId(null);
      setEditingValue({ name: '', code: '' });
      toast({ title: "Success", description: "Country updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update country", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_countries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast({ title: "Success", description: "Country deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete country", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newCountry.name.trim()) {
      addMutation.mutate(newCountry);
    }
  };

  const handleEdit = (id: string, name: string, code: string) => {
    setEditingId(id);
    setEditingValue({ name, code: code || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, country: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Countries Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Country
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newCountry.name}
                onChange={(e) => setNewCountry(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter country name"
                autoFocus
              />
              <Input
                value={newCountry.code}
                onChange={(e) => setNewCountry(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter country code (e.g., US, UK)"
                maxLength={3}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewCountry({ name: '', code: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : countries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No countries configured. Add some countries to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {countries.map((country) => (
                <div key={country.id} className="p-3 border rounded-lg">
                  {editingId === country.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Country name"
                        autoFocus
                      />
                      <Input
                        value={editingValue.code}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="Country code"
                        maxLength={3}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', code: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{country.name}</span>
                        {country.code && (
                          <span className="px-2 py-1 bg-muted rounded text-sm">{country.code}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(country.id, country.name, country.code || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(country.id)} 
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

export default CountryConfigSupabase;
