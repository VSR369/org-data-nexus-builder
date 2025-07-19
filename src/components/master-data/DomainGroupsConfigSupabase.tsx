
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

const DomainGroupsConfigSupabase: React.FC = () => {
  const [newDomain, setNewDomain] = useState({ name: '', description: '', industry_segment_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', industry_segment_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: domainGroups = [], isLoading, refetch } = useQuery({
    queryKey: ['domain-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_domain_groups')
        .select(`
          *,
          industry_segment:master_industry_segments(name)
        `)
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: industrySegments = [] } = useQuery({
    queryKey: ['industry-segments-for-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (domain: { name: string; description: string; industry_segment_id: string }) => {
      const { data, error } = await supabase
        .from('master_domain_groups')
        .insert([{ 
          name: domain.name.trim(), 
          description: domain.description.trim() || null,
          industry_segment_id: domain.industry_segment_id || null
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-groups'] });
      setNewDomain({ name: '', description: '', industry_segment_id: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Domain group added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add domain group", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, domain }: { id: string; domain: { name: string; description: string; industry_segment_id: string } }) => {
      const { data, error } = await supabase
        .from('master_domain_groups')
        .update({ 
          name: domain.name.trim(), 
          description: domain.description.trim() || null,
          industry_segment_id: domain.industry_segment_id || null
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-groups'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', industry_segment_id: '' });
      toast({ title: "Success", description: "Domain group updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update domain group", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_domain_groups')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-groups'] });
      toast({ title: "Success", description: "Domain group deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete domain group", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newDomain.name.trim()) {
      addMutation.mutate(newDomain);
    }
  };

  const handleEdit = (id: string, name: string, description: string, industry_segment_id: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', industry_segment_id: industry_segment_id || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, domain: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this domain group?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Domain Groups Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain Group
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newDomain.name}
                onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter domain group name"
                autoFocus
              />
              <Select value={newDomain.industry_segment_id} onValueChange={(value) => setNewDomain(prev => ({ ...prev, industry_segment_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry segment (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No industry segment</SelectItem>
                  {industrySegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>{segment.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newDomain.description}
                onChange={(e) => setNewDomain(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewDomain({ name: '', description: '', industry_segment_id: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : domainGroups.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No domain groups configured. Add some domain groups to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {domainGroups.map((domain) => (
                <div key={domain.id} className="p-4 border rounded-lg">
                  {editingId === domain.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Domain group name"
                        autoFocus
                      />
                      <Select value={editingValue.industry_segment_id} onValueChange={(value) => setEditingValue(prev => ({ ...prev, industry_segment_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry segment (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No industry segment</SelectItem>
                          {industrySegments.map((segment) => (
                            <SelectItem key={segment.id} value={segment.id}>{segment.name}</SelectItem>
                          ))}
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
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', industry_segment_id: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{domain.name}</h4>
                        {domain.industry_segment?.name && (
                          <p className="text-sm text-blue-600 mt-1">Industry: {domain.industry_segment.name}</p>
                        )}
                        {domain.description && (
                          <p className="text-sm text-muted-foreground mt-1">{domain.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(domain.id, domain.name, domain.description || '', domain.industry_segment_id || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(domain.id)} 
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

export default DomainGroupsConfigSupabase;
