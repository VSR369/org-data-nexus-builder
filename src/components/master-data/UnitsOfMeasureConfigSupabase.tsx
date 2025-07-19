
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const UnitsOfMeasureConfigSupabase: React.FC = () => {
  const [newUnit, setNewUnit] = useState({ name: '', symbol: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', symbol: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Using master_units_of_measure instead of master_unit_of_measure based on your existing tables
  const { data: units = [], isLoading, refetch } = useQuery({
    queryKey: ['units-of-measure'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_units_of_measure')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (unit: { name: string; symbol: string; description: string }) => {
      const { data, error } = await supabase
        .from('master_units_of_measure')
        .insert([{ 
          name: unit.name.trim(), 
          symbol: unit.symbol.trim() || null,
          description: unit.description.trim() || null
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units-of-measure'] });
      setNewUnit({ name: '', symbol: '', description: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Unit of measure added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add unit of measure", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, unit }: { id: string; unit: { name: string; symbol: string; description: string } }) => {
      const { data, error } = await supabase
        .from('master_units_of_measure')
        .update({ 
          name: unit.name.trim(), 
          symbol: unit.symbol.trim() || null,
          description: unit.description.trim() || null
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units-of-measure'] });
      setEditingId(null);
      setEditingValue({ name: '', symbol: '', description: '' });
      toast({ title: "Success", description: "Unit of measure updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update unit of measure", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_units_of_measure')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units-of-measure'] });
      toast({ title: "Success", description: "Unit of measure deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete unit of measure", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newUnit.name.trim()) {
      addMutation.mutate(newUnit);
    }
  };

  const handleEdit = (id: string, name: string, symbol: string, description: string) => {
    setEditingId(id);
    setEditingValue({ name, symbol: symbol || '', description: description || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, unit: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this unit of measure?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Units of Measure Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit of Measure
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newUnit.name}
                onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter unit name (e.g., Hours, Days, Pieces)"
                autoFocus
              />
              <Input
                value={newUnit.symbol}
                onChange={(e) => setNewUnit(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="Enter symbol (e.g., hrs, days, pcs)"
              />
              <Textarea
                value={newUnit.description}
                onChange={(e) => setNewUnit(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewUnit({ name: '', symbol: '', description: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : units.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No units of measure configured. Add some units to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {units.map((unit) => (
                <div key={unit.id} className="p-4 border rounded-lg">
                  {editingId === unit.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Unit name"
                        autoFocus
                      />
                      <Input
                        value={editingValue.symbol}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, symbol: e.target.value }))}
                        placeholder="Symbol"
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
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', symbol: '', description: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{unit.name}</h4>
                          {unit.symbol && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {unit.symbol}
                            </span>
                          )}
                        </div>
                        {unit.description && (
                          <p className="text-sm text-muted-foreground">{unit.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(unit.id, unit.name, unit.symbol || '', unit.description || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(unit.id)} 
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

export default UnitsOfMeasureConfigSupabase;
