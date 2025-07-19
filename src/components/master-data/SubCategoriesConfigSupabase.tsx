
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

const SubCategoriesConfigSupabase: React.FC = () => {
  const [newSubCategory, setNewSubCategory] = useState({ name: '', description: '', category_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', category_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subCategories = [], isLoading, refetch } = useQuery({
    queryKey: ['sub-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_sub_categories')
        .select(`
          *,
          category:master_categories(name)
        `)
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-for-subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_categories')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (subCategory: { name: string; description: string; category_id: string }) => {
      const { data, error } = await supabase
        .from('master_sub_categories')
        .insert([{ 
          name: subCategory.name.trim(), 
          description: subCategory.description.trim() || null,
          category_id: subCategory.category_id
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
      setNewSubCategory({ name: '', description: '', category_id: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Sub-category added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add sub-category", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, subCategory }: { id: string; subCategory: { name: string; description: string; category_id: string } }) => {
      const { data, error } = await supabase
        .from('master_sub_categories')
        .update({ 
          name: subCategory.name.trim(), 
          description: subCategory.description.trim() || null,
          category_id: subCategory.category_id
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', category_id: '' });
      toast({ title: "Success", description: "Sub-category updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update sub-category", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_sub_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
      toast({ title: "Success", description: "Sub-category deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete sub-category", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newSubCategory.name.trim() && newSubCategory.category_id) {
      addMutation.mutate(newSubCategory);
    }
  };

  const handleEdit = (id: string, name: string, description: string, category_id: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', category_id });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim() && editingValue.category_id) {
      updateMutation.mutate({ id: editingId, subCategory: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sub-Categories Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Category
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newSubCategory.name}
                onChange={(e) => setNewSubCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter sub-category name"
                autoFocus
              />
              <Select value={newSubCategory.category_id} onValueChange={(value) => setNewSubCategory(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category *" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newSubCategory.description}
                onChange={(e) => setNewSubCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending || !newSubCategory.category_id}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewSubCategory({ name: '', description: '', category_id: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : subCategories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No sub-categories configured. Add some sub-categories to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {subCategories.map((subCategory) => (
                <div key={subCategory.id} className="p-4 border rounded-lg">
                  {editingId === subCategory.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Sub-category name"
                        autoFocus
                      />
                      <Select value={editingValue.category_id} onValueChange={(value) => setEditingValue(prev => ({ ...prev, category_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category *" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
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
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending || !editingValue.category_id}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', category_id: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{subCategory.name}</h4>
                        {subCategory.category?.name && (
                          <p className="text-sm text-blue-600 mt-1">Category: {subCategory.category.name}</p>
                        )}
                        {subCategory.description && (
                          <p className="text-sm text-muted-foreground mt-1">{subCategory.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(subCategory.id, subCategory.name, subCategory.description || '', subCategory.category_id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(subCategory.id)} 
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

export default SubCategoriesConfigSupabase;
