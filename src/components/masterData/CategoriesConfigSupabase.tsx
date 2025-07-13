import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description?: string;
  domain_group_id: string;
  is_active: boolean;
}

interface DomainGroup {
  id: string;
  name: string;
}

const CategoriesConfigSupabase = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    description: '', 
    domain_group_id: '', 
    is_active: true 
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState({ 
    name: '', 
    description: '', 
    domain_group_id: '', 
    is_active: true 
  });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories and domain groups
      const [categoriesResult, domainGroupsResult] = await Promise.all([
        supabase.from('master_categories').select('*').order('name'),
        supabase.from('master_domain_groups').select('id, name').order('name')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (domainGroupsResult.error) throw domainGroupsResult.error;

      setCategories(categoriesResult.data || []);
      setDomainGroups(domainGroupsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load categories and domain groups.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name.trim() && newCategory.domain_group_id) {
      try {
        const { error } = await supabase
          .from('master_categories')
          .insert([{
            name: newCategory.name.trim(),
            description: newCategory.description.trim() || null,
            domain_group_id: newCategory.domain_group_id,
            is_active: newCategory.is_active
          }]);

        if (error) throw error;

        setNewCategory({ name: '', description: '', domain_group_id: '', is_active: true });
        setIsAdding(false);
        fetchData();
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      } catch (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Error",
          description: "Failed to add category.",
          variant: "destructive",
        });
      }
    }
  };

  const getDomainGroupName = (domainGroupId: string) => {
    const group = domainGroups.find(g => g.id === domainGroupId);
    return group ? group.name : 'Unknown';
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Configure categories linked to domain groups
            </CardDescription>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Categories ({categories.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-category-name">Category Name</Label>
                <Input
                  id="new-category-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-category-description">Description</Label>
                <Input
                  id="new-category-description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Enter description (optional)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-category-domain-group">Domain Group</Label>
                <Select
                  value={newCategory.domain_group_id}
                  onValueChange={(value) => setNewCategory({...newCategory, domain_group_id: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select domain group" />
                  </SelectTrigger>
                  <SelectContent>
                    {domainGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddCategory} size="sm" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" size="sm" className="flex items-center gap-1">
                <X className="w-3 h-3" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          {categories.map((category, index) => (
            <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{index + 1}</Badge>
                <div>
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-muted-foreground">{category.description}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Domain: {getDomainGroupName(category.domain_group_id)}
                  </div>
                </div>
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesConfigSupabase;