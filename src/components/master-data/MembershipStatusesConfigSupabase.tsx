
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const MembershipStatusesConfigSupabase: React.FC = () => {
  const [newStatus, setNewStatus] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statuses = [], isLoading, refetch } = useQuery({
    queryKey: ['membership-statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_membership_statuses')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (status: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('master_membership_statuses')
        .insert([{ 
          name: status.name.trim(), 
          description: status.description.trim() || null
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-statuses'] });
      setNewStatus({ name: '', description: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Membership status added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add membership status", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: { name: string; description: string } }) => {
      const { data, error } = await supabase
        .from('master_membership_statuses')
        .update({ 
          name: status.name.trim(), 
          description: status.description.trim() || null
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-statuses'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '' });
      toast({ title: "Success", description: "Membership status updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update membership status", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_membership_statuses')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-statuses'] });
      toast({ title: "Success", description: "Membership status deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete membership status", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newStatus.name.trim()) {
      addMutation.mutate(newStatus);
    }
  };

  const handleEdit = (id: string, name: string, description: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, status: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this membership status?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Membership Statuses Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Membership Status
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newStatus.name}
                onChange={(e) => setNewStatus(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter status name (e.g., Active, Inactive, Pending)"
                autoFocus
              />
              <Textarea
                value={newStatus.description}
                onChange={(e) => setNewStatus(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewStatus({ name: '', description: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : statuses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No membership statuses configured. Add some statuses to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {statuses.map((status) => (
                <div key={status.id} className="p-4 border rounded-lg">
                  {editingId === status.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Status name"
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
                        <h4 className="font-medium">{status.name}</h4>
                        {status.description && (
                          <p className="text-sm text-muted-foreground mt-1">{status.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(status.id, status.name, status.description || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(status.id)} 
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

export default MembershipStatusesConfigSupabase;
