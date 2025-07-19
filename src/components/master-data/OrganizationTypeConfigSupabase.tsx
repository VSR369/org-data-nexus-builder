
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const OrganizationTypeConfigSupabase: React.FC = () => {
  const [newOrgType, setNewOrgType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orgTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['organization-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_organization_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('master_organization_types')
        .insert([{ name: name.trim() }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-types'] });
      setNewOrgType('');
      setIsAdding(false);
      toast({ title: "Success", description: "Organization type added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add organization type", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('master_organization_types')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-types'] });
      setEditingId(null);
      setEditingValue('');
      toast({ title: "Success", description: "Organization type updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update organization type", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_organization_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-types'] });
      toast({ title: "Success", description: "Organization type deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete organization type", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newOrgType.trim()) {
      addMutation.mutate(newOrgType);
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
    if (window.confirm('Are you sure you want to delete this organization type?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewOrgType('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Types Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization Type
            </Button>
          </div>

          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newOrgType}
                onChange={(e) => setNewOrgType(e.target.value)}
                placeholder="Enter organization type name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAdd();
                  } else if (e.key === 'Escape') {
                    handleCancelAdd();
                  }
                }}
                autoFocus
              />
              <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={handleCancelAdd} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : orgTypes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No organization types configured. Add some organization types to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {orgTypes.map((orgType) => (
                <div key={orgType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === orgType.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                      />
                      <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={updateMutation.isPending}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{orgType.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEdit(orgType.id, orgType.name)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(orgType.id)} 
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

export default OrganizationTypeConfigSupabase;
