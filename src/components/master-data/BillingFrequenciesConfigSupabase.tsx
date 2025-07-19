
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const BillingFrequenciesConfigSupabase: React.FC = () => {
  const [newFreq, setNewFreq] = useState({ name: '', description: '', months: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', months: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: frequencies = [], isLoading, refetch } = useQuery({
    queryKey: ['billing-frequencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_billing_frequencies')
        .select('*')
        .order('months', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (freq: { name: string; description: string; months: string }) => {
      const { data, error } = await supabase
        .from('master_billing_frequencies')
        .insert([{ 
          name: freq.name.trim(), 
          description: freq.description.trim() || null,
          months: freq.months ? parseInt(freq.months) : null
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-frequencies'] });
      setNewFreq({ name: '', description: '', months: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Billing frequency added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add billing frequency", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, freq }: { id: string; freq: { name: string; description: string; months: string } }) => {
      const { data, error } = await supabase
        .from('master_billing_frequencies')
        .update({ 
          name: freq.name.trim(), 
          description: freq.description.trim() || null,
          months: freq.months ? parseInt(freq.months) : null
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-frequencies'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', months: '' });
      toast({ title: "Success", description: "Billing frequency updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update billing frequency", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_billing_frequencies')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-frequencies'] });
      toast({ title: "Success", description: "Billing frequency deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete billing frequency", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newFreq.name.trim()) {
      addMutation.mutate(newFreq);
    }
  };

  const handleEdit = (id: string, name: string, description: string, months: number) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', months: months?.toString() || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, freq: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this billing frequency?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing Frequencies Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Billing Frequency
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newFreq.name}
                onChange={(e) => setNewFreq(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter frequency name (e.g., Monthly, Quarterly)"
                autoFocus
              />
              <Input
                type="number"
                value={newFreq.months}
                onChange={(e) => setNewFreq(prev => ({ ...prev, months: e.target.value }))}
                placeholder="Number of months (e.g., 1 for monthly, 3 for quarterly)"
              />
              <Textarea
                value={newFreq.description}
                onChange={(e) => setNewFreq(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewFreq({ name: '', description: '', months: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : frequencies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No billing frequencies configured. Add some frequencies to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {frequencies.map((freq) => (
                <div key={freq.id} className="p-4 border rounded-lg">
                  {editingId === freq.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Frequency name"
                        autoFocus
                      />
                      <Input
                        type="number"
                        value={editingValue.months}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, months: e.target.value }))}
                        placeholder="Number of months"
                      />
                      <Textarea
                        value={editingValue.description}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', months: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{freq.name}</h4>
                          {freq.months && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {freq.months} months
                            </span>
                          )}
                        </div>
                        {freq.description && (
                          <p className="text-sm text-muted-foreground">{freq.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(freq.id, freq.name, freq.description || '', freq.months)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(freq.id)} 
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

export default BillingFrequenciesConfigSupabase;
