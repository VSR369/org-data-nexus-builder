
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Category } from './types';

interface CategoryTabProps {
  selectedDomainGroup: string;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  showMessage: (message: string) => void;
  selectedIndustrySegment?: { id: string; name: string; code: string };
  selectedDomainGroupInfo?: { id: string; name: string };
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  selectedDomainGroup,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  showMessage,
  selectedIndustrySegment,
  selectedDomainGroupInfo
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (formData.name.trim() && selectedDomainGroup) {
      onAddCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        domainGroupId: selectedDomainGroup,
        isActive: true,
        subCategories: []
      });
      setFormData({ name: '', description: '' });
      setIsAdding(false);
      showMessage('Category added successfully');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description || '' });
  };

  const handleSaveEdit = () => {
    if (formData.name.trim() && editingId) {
      onUpdateCategory(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      setEditingId(null);
      setFormData({ name: '', description: '' });
      showMessage('Category updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  if (!selectedDomainGroup) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select a domain group first to manage categories.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hierarchical Context Display */}
      {selectedIndustrySegment && selectedDomainGroupInfo && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{selectedIndustrySegment.code}</Badge>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{selectedIndustrySegment.name}</span>
              <span className="text-muted-foreground">→</span>
              <Badge variant="default">{selectedDomainGroupInfo.name}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage categories for the selected domain group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Categories</h3>
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
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
              <div>
                <Label htmlFor="new-category-name">Category Name</Label>
                <Input
                  id="new-category-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-category-description">Description (Optional)</Label>
                <Textarea
                  id="new-category-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} size="sm" className="flex items-center gap-1">
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
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                {editingId === category.id ? (
                  <div className="flex gap-2 flex-1 space-y-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Category name"
                      />
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex gap-2 items-start">
                      <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => {
                        onSelectCategory(category.id);
                        showMessage(`Selected category: ${category.name}`);
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          {selectedCategory === category.id && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(category)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          onDeleteCategory(category.id);
                          showMessage('Category deleted successfully');
                        }}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No categories found. Add one to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
