
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const IndustrySegmentsConfigSupabase: React.FC = () => {
  const [newSegment, setNewSegment] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: segments = [], isLoading, refetch } = useQuery({
    queryKey: ['industry-segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (segment: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .insert([{ 
          name: segment.name.trim(), 
          description: segment.description.trim() || null 
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industry-segments'] });
      setNewSegment({ name: '', description: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Industry segment added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add industry segment", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, segment }: { id: string; segment: { name: string; description: string } }) => {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .update({ 
          name: segment.name.trim(), 
          description: segment.description.trim() || null 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industry-segments'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '' });
      toast({ title: "Success", description: "Industry segment updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update industry segment", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_industry_segments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industry-segments'] });
      toast({ title: "Success", description: "Industry segment deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete industry segment", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newSegment.name.trim()) {
      addMutation.mutate(newSegment);
    }
  };

  const handleEdit = (id: string, name: string, description: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '' });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim()) {
      updateMutation.mutate({ id: editingId, segment: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this industry segment?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Segments Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Industry Segment
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newSegment.name}
                onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter segment name"
                autoFocus
              />
              <Textarea
                value={newSegment.description}
                onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewSegment({ name: '', description: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : segments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No industry segments configured. Add some segments to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {segments.map((segment) => (
                <div key={segment.id} className="p-4 border rounded-lg">
                  {editingId === segment.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Segment name"
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
                        <h4 className="font-medium">{segment.name}</h4>
                        {segment.description && (
                          <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(segment.id, segment.name, segment.description || '')} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(segment.id)} 
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

export default IndustrySegmentsConfigSupabase;
