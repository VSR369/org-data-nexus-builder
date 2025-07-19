import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Check, X, RefreshCw, Plus, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id?: string;
  name: string;
  description?: string;
  domain_group_id?: string;
  created_at?: string;
  updated_at?: string;
  is_user_created?: boolean;
}

interface DomainGroup {
  id: string;
  name: string;
}

const CategoriesConfigSupabase: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', domain_group_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', domain_group_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load domain groups
      const { data: domainGroupsData, error: domainGroupsError } = await supabase
        .from('master_domain_groups')
        .select('id, name')
        .order('name');
      
      if (domainGroupsError) throw domainGroupsError;
      setDomainGroups(domainGroupsData || []);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('master_categories')
        .select('*')
        .order('name');
      
      if (categoriesError) throw categoriesError;
      console.log('✅ CRUD TEST - Categories loaded from Supabase:', categoriesData);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_categories')
        .insert([{ 
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || undefined,
          domain_group_id: newCategory.domain_group_id || undefined,
          is_user_created: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Category created in Supabase:', data);
      setCategories(prev => [...prev, data]);
      setNewCategory({ name: '', description: '', domain_group_id: '' });
      setIsAdding(false);
      toast({
        title: "Success",
        description: `${newCategory.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (id: string, category: Category) => {
    setEditingId(id);
    setEditingValue({ 
      name: category.name,
      description: category.description || '',
      domain_group_id: category.domain_group_id || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_categories')
        .update({ 
          name: editingValue.name.trim(),
          description: editingValue.description.trim() || undefined,
          domain_group_id: editingValue.domain_group_id || undefined
        })
        .eq('id', editingId)
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Category updated in Supabase:', data);
      setCategories(prev => prev.map(cat => cat.id === editingId ? data : cat));
      setEditingId(null);
      setEditingValue({ name: '', description: '', domain_group_id: '' });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Category deleted from Supabase');
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue({ name: '', description: '', domain_group_id: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCategory({ name: '', description: '', domain_group_id: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categories Configuration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={loadData} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <SelectValue placeholder="Select domain group (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {domainGroups.map((dg) => (
                    <SelectItem key={dg.id} value={dg.id}>{dg.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} size="sm" disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={handleCancelAdd} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No categories configured. Add some categories to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="p-3 border rounded-lg">
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
                          <SelectValue placeholder="Select domain group (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {domainGroups.map((dg) => (
                            <SelectItem key={dg.id} value={dg.id}>{dg.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editingValue.description}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description (optional)"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEditCategory(category.id!, category)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteCategory(category.id!)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
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
