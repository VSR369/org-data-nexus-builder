
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const EngagementModelsConfigSupabase: React.FC = () => {
  const [newModel, setNewModel] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: models = [], isLoading, refetch } = useQuery({
    queryKey: ['engagement-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_engagement_models')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (model: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('master_engagement_models')
        .insert([{ 
          name: model.name.trim(), 
          description: model.description.trim() || null
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement-models'] });
      setNewModel({ name: '', description: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Engagement model added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add engagement model", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, model }: { id: string; model: { name: string; description: string } }) => {
      const { data, error } = await supabase
        .from('master_engagement_models')
        .update({ 
          name: model.name.trim(), 
          description: model.description.trim() || null
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement-models'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '' });
      toast({ title: "Success", description: "Engagement model updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update engagement model", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_engagement_models')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement-models'] });
      toast({ title: "Success", description: "Engagement model deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete engagement model", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newModel.name.trim()) {
      addMutation.mutate(newModel);
    }
  };

  const handleEdit = (id: string, name: string, description: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, model: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this engagement model?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Models Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Engagement Model
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newModel.name}
                onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter engagement model name"
                autoFocus
              />
              <Textarea
                value={newModel.description}
                onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewModel({ name: '', description: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : models.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No engagement models configured. Add some models to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {models.map((model) => (
                <div key={model.id} className="p-4 border rounded-lg">
                  {editingId === model.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Model name"
                        autoFocus
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
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{model.name}</h4>
                        {model.description && (
                          <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(model.id, model.name, model.description || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(model.id)} 
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

export default EngagementModelsConfigSupabase;
