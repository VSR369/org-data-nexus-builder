
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

const CategoriesConfigSupabase: React.FC = () => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '', domain_group_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', domain_group_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_categories')
        .select(`
          *,
          domain_group:master_domain_groups(name)
        `)
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: domainGroups = [] } = useQuery({
    queryKey: ['domain-groups-for-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_domain_groups')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (category: { name: string; description: string; domain_group_id: string }) => {
      const { data, error } = await supabase
        .from('master_categories')
        .insert([{ 
          name: category.name.trim(), 
          description: category.description.trim() || null,
          domain_group_id: category.domain_group_id
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory({ name: '', description: '', domain_group_id: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Category added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, category }: { id: string; category: { name: string; description: string; domain_group_id: string } }) => {
      const { data, error } = await supabase
        .from('master_categories')
        .update({ 
          name: category.name.trim(), 
          description: category.description.trim() || null,
          domain_group_id: category.domain_group_id
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', domain_group_id: '' });
      toast({ title: "Success", description: "Category updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newCategory.name.trim() && newCategory.domain_group_id) {
      addMutation.mutate(newCategory);
    }
  };

  const handleEdit = (id: string, name: string, description: string, domain_group_id: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', domain_group_id });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim() && editingValue.domain_group_id) {
      updateMutation.mutate({ id: editingId, category: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
                autoFocus
              />
              <Select value={newCategory.domain_group_id} onValueChange={(value) => setNewCategory(prev => ({ ...prev, domain_group_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select domain group *" />
                </SelectTrigger>
                <SelectContent>
                  {domainGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending || !newCategory.domain_group_id}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewCategory({ name: '', description: '', domain_group_id: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No categories configured. Add some categories to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg">
                  {editingId === category.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Category name"
                        autoFocus
                      />
                      <Select value={editingValue.domain_group_id} onValueChange={(value) => setEditingValue(prev => ({ ...prev, domain_group_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain group *" />
                        </SelectTrigger>
                        <SelectContent>
                          {domainGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
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
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending || !editingValue.domain_group_id}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', domain_group_id: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.domain_group?.name && (
                          <p className="text-sm text-blue-600 mt-1">Domain: {category.domain_group.name}</p>
                        )}
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(category.id, category.name, category.description || '', category.domain_group_id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(category.id)} 
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

export default CategoriesConfigSupabase;
