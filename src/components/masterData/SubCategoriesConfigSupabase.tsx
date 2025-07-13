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

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
}

const SubCategoriesConfigSupabase = () => {
  const { toast } = useToast();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newSubCategory, setNewSubCategory] = useState({ 
    name: '', 
    description: '', 
    category_id: '', 
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
      
      // Fetch sub-categories and categories
      const [subCategoriesResult, categoriesResult] = await Promise.all([
        supabase.from('master_sub_categories').select('*').order('name'),
        supabase.from('master_categories').select('id, name').order('name')
      ]);

      if (subCategoriesResult.error) throw subCategoriesResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setSubCategories(subCategoriesResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load sub-categories and categories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = async () => {
    if (newSubCategory.name.trim() && newSubCategory.category_id) {
      try {
        const { error } = await supabase
          .from('master_sub_categories')
          .insert([{
            name: newSubCategory.name.trim(),
            description: newSubCategory.description.trim() || null,
            category_id: newSubCategory.category_id,
            is_active: newSubCategory.is_active
          }]);

        if (error) throw error;

        setNewSubCategory({ name: '', description: '', category_id: '', is_active: true });
        setIsAdding(false);
        fetchData();
        toast({
          title: "Success",
          description: "Sub-category added successfully",
        });
      } catch (error) {
        console.error('Error adding sub-category:', error);
        toast({
          title: "Error",
          description: "Failed to add sub-category.",
          variant: "destructive",
        });
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  if (loading) {
    return <div>Loading sub-categories...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sub-Categories</CardTitle>
            <CardDescription>
              Configure sub-categories linked to categories
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
          <h3 className="text-lg font-medium">Current Sub-Categories ({subCategories.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Sub-Category
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-subcategory-name">Sub-Category Name</Label>
                <Input
                  id="new-subcategory-name"
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({...newSubCategory, name: e.target.value})}
                  placeholder="Enter sub-category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-subcategory-description">Description</Label>
                <Input
                  id="new-subcategory-description"
                  value={newSubCategory.description}
                  onChange={(e) => setNewSubCategory({...newSubCategory, description: e.target.value})}
                  placeholder="Enter description (optional)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-subcategory-category">Category</Label>
                <Select
                  value={newSubCategory.category_id}
                  onValueChange={(value) => setNewSubCategory({...newSubCategory, category_id: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddSubCategory} size="sm" className="flex items-center gap-1">
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
          {subCategories.map((subCategory, index) => (
            <div key={subCategory.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{index + 1}</Badge>
                <div>
                  <div className="font-medium">{subCategory.name}</div>
                  {subCategory.description && (
                    <div className="text-sm text-muted-foreground">{subCategory.description}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Category: {getCategoryName(subCategory.category_id)}
                  </div>
                </div>
                <Badge variant={subCategory.is_active ? "default" : "secondary"}>
                  {subCategory.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubCategoriesConfigSupabase;