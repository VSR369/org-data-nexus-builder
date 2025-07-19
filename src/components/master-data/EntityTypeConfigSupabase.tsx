
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const EntityTypeConfigSupabase: React.FC = () => {
  const [newEntityType, setNewEntityType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entityTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['entity-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_entity_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('master_entity_types')
        .insert([{ name: name.trim() }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-types'] });
      setNewEntityType('');
      setIsAdding(false);
      toast({ title: "Success", description: "Entity type added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add entity type", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('master_entity_types')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-types'] });
      setEditingId(null);
      setEditingValue('');
      toast({ title: "Success", description: "Entity type updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update entity type", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_entity_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-types'] });
      toast({ title: "Success", description: "Entity type deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete entity type", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newEntityType.trim()) {
      addMutation.mutate(newEntityType);
    }
  };

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.trim()) {
      updateMutation.mutate({ id: editingId, name: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entity type?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Entity Types Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entity Type
            </Button>
          </div>

          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newEntityType}
                onChange={(e) => setNewEntityType(e.target.value)}
                placeholder="Enter entity type name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  else if (e.key === 'Escape') {
                    setIsAdding(false);
                    setNewEntityType('');
                  }
                }}
                autoFocus
              />
              <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={() => { setIsAdding(false); setNewEntityType(''); }} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : entityTypes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No entity types configured. Add some entity types to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {entityTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === type.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          else if (e.key === 'Escape') {
                            setEditingId(null);
                            setEditingValue('');
                          }
                        }}
                        autoFocus
                      />
                      <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={updateMutation.isPending}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => { setEditingId(null); setEditingValue(''); }} size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{type.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(type.id, type.name)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(type.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
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

export default EntityTypeConfigSupabase;
