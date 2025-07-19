
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const CommunicationTypesConfigSupabase: React.FC = () => {
  const [newType, setNewType] = useState({ name: '', description: '', link: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', link: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: types = [], isLoading, refetch } = useQuery({
    queryKey: ['communication-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_communication_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (type: { name: string; description: string; link: string }) => {
      const { data, error } = await supabase
        .from('master_communication_types')
        .insert([{ 
          name: type.name.trim(), 
          description: type.description.trim() || null,
          link: type.link.trim()
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-types'] });
      setNewType({ name: '', description: '', link: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Communication type added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add communication type", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: { name: string; description: string; link: string } }) => {
      const { data, error } = await supabase
        .from('master_communication_types')
        .update({ 
          name: type.name.trim(), 
          description: type.description.trim() || null,
          link: type.link.trim()
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-types'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', link: '' });
      toast({ title: "Success", description: "Communication type updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update communication type", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_communication_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-types'] });
      toast({ title: "Success", description: "Communication type deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete communication type", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newType.name.trim() && newType.link.trim()) {
      addMutation.mutate(newType);
    }
  };

  const handleEdit = (id: string, name: string, description: string, link: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', link });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim() && editingValue.link.trim()) {
      updateMutation.mutate({ id: editingId, type: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this communication type?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Types Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Communication Type
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newType.name}
                onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter communication type name (e.g., Email, Slack, Teams)"
                autoFocus
              />
              <Input
                value={newType.link}
                onChange={(e) => setNewType(prev => ({ ...prev, link: e.target.value }))}
                placeholder="Enter link/URL *"
              />
              <Textarea
                value={newType.description}
                onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending || !newType.link.trim()}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewType({ name: '', description: '', link: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : types.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No communication types configured. Add some types to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {types.map((type) => (
                <div key={type.id} className="p-4 border rounded-lg">
                  {editingId === type.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Type name"
                        autoFocus
                      />
                      <Input
                        value={editingValue.link}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="Link/URL *"
                      />
                      <Textarea
                        value={editingValue.description}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending || !editingValue.link.trim()}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', link: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-blue-600 mt-1">
                          <a href={type.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {type.link}
                          </a>
                        </p>
                        {type.description && (
                          <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(type.id, type.name, type.description || '', type.link)} 
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

export default CommunicationTypesConfigSupabase;
