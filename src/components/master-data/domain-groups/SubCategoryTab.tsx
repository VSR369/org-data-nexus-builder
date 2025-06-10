
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { SubCategory } from './types';

interface SubCategoryTabProps {
  selectedCategory: string;
  subCategories: SubCategory[];
  onAddSubCategory: (subCategory: Omit<SubCategory, 'id' | 'createdAt'>) => void;
  onUpdateSubCategory: (id: string, updates: Partial<SubCategory>) => void;
  onDeleteSubCategory: (id: string) => void;
  showMessage: (message: string) => void;
  selectedIndustrySegment?: { id: string; name: string; code: string };
  selectedDomainGroupInfo?: { id: string; name: string };
  selectedCategoryInfo?: { id: string; name: string };
}

export const SubCategoryTab: React.FC<SubCategoryTabProps> = ({
  selectedCategory,
  subCategories,
  onAddSubCategory,
  onUpdateSubCategory,
  onDeleteSubCategory,
  showMessage,
  selectedIndustrySegment,
  selectedDomainGroupInfo,
  selectedCategoryInfo
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (formData.name.trim() && selectedCategory) {
      onAddSubCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryId: selectedCategory,
        isActive: true
      });
      setFormData({ name: '', description: '' });
      setIsAdding(false);
      showMessage('Sub-category added successfully');
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingId(subCategory.id);
    setFormData({ name: subCategory.name, description: subCategory.description || '' });
  };

  const handleSaveEdit = () => {
    if (formData.name.trim() && editingId) {
      onUpdateSubCategory(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      setEditingId(null);
      setFormData({ name: '', description: '' });
      showMessage('Sub-category updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  if (!selectedCategory) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select a category first to manage sub-categories.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hierarchical Context Display */}
      {selectedIndustrySegment && selectedDomainGroupInfo && selectedCategoryInfo && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{selectedIndustrySegment.code}</Badge>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{selectedIndustrySegment.name}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{selectedDomainGroupInfo.name}</span>
              <span className="text-muted-foreground">→</span>
              <Badge variant="default">{selectedCategoryInfo.name}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sub-Categories</CardTitle>
          <CardDescription>
            Manage sub-categories for the selected category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Sub-Categories</h3>
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
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
              <div>
                <Label htmlFor="new-subcategory-name">Sub-Category Name</Label>
                <Input
                  id="new-subcategory-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter sub-category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-subcategory-description">Description (Optional)</Label>
                <Textarea
                  id="new-subcategory-description"
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
            {subCategories.map((subCategory) => (
              <div key={subCategory.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                {editingId === subCategory.id ? (
                  <div className="flex gap-2 flex-1 space-y-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Sub-category name"
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
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <span className="font-medium">{subCategory.name}</span>
                        {subCategory.description && (
                          <p className="text-sm text-muted-foreground mt-1">{subCategory.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(subCategory)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          onDeleteSubCategory(subCategory.id);
                          showMessage('Sub-category deleted successfully');
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

          {subCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sub-categories found. Add one to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
