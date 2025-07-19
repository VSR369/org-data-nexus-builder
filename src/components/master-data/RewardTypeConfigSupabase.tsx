
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const RewardTypeConfigSupabase: React.FC = () => {
  const [newReward, setNewReward] = useState({ name: '', description: '', type: 'monetary' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', type: 'monetary' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rewards = [], isLoading, refetch } = useQuery({
    queryKey: ['reward-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_reward_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (reward: { name: string; description: string; type: string }) => {
      const { data, error } = await supabase
        .from('master_reward_types')
        .insert([{ 
          name: reward.name.trim(), 
          description: reward.description.trim() || null,
          type: reward.type
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-types'] });
      setNewReward({ name: '', description: '', type: 'monetary' });
      setIsAdding(false);
      toast({ title: "Success", description: "Reward type added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add reward type", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, reward }: { id: string; reward: { name: string; description: string; type: string } }) => {
      const { data, error } = await supabase
        .from('master_reward_types')
        .update({ 
          name: reward.name.trim(), 
          description: reward.description.trim() || null,
          type: reward.type
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-types'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', type: 'monetary' });
      toast({ title: "Success", description: "Reward type updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update reward type", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_reward_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-types'] });
      toast({ title: "Success", description: "Reward type deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete reward type", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newReward.name.trim()) {
      addMutation.mutate(newReward);
    }
  };

  const handleEdit = (id: string, name: string, description: string, type: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', type: type || 'monetary' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, reward: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reward type?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reward Types Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reward Type
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newReward.name}
                onChange={(e) => setNewReward(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter reward type name"
                autoFocus
              />
              <Select value={newReward.type} onValueChange={(value) => setNewReward(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monetary">Monetary</SelectItem>
                  <SelectItem value="non-monetary">Non-Monetary</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                value={newReward.description}
                onChange={(e) => setNewReward(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewReward({ name: '', description: '', type: 'monetary' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : rewards.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reward types configured. Add some reward types to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.id} className="p-4 border rounded-lg">
                  {editingId === reward.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Reward type name"
                        autoFocus
                      />
                      <Select value={editingValue.type} onValueChange={(value) => setEditingValue(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monetary">Monetary</SelectItem>
                          <SelectItem value="non-monetary">Non-Monetary</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', type: 'monetary' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{reward.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reward.type === 'monetary' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {reward.type === 'monetary' ? 'Monetary' : 'Non-Monetary'}
                          </span>
                        </div>
                        {reward.description && (
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(reward.id, reward.name, reward.description || '', reward.type || 'monetary')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(reward.id)} 
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

export default RewardTypeConfigSupabase;
