import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Minus, Save, X, Target, FolderTree, Circle,
  ChevronDown, ChevronRight, Trash2
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SubCategory {
  id: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
  isExpanded: boolean;
}

interface DomainGroupData {
  name: string;
  description: string;
  industry_segment_id: string;
  categories: Category[];
}

interface IndustrySegment {
  id: string;
  name: string;
}

interface DomainGroupHierarchyFormProps {
  industrySegments: IndustrySegment[];
  onSave: (data: DomainGroupData) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

const DomainGroupHierarchyForm: React.FC<DomainGroupHierarchyFormProps> = ({
  industrySegments,
  onSave,
  onCancel,
  saving = false
}) => {
  const [domainGroup, setDomainGroup] = useState<DomainGroupData>({
    name: '',
    description: '',
    industry_segment_id: '',
    categories: []
  });

  const addCategory = () => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      subCategories: [],
      isExpanded: true
    };
    setDomainGroup(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const updateCategory = (categoryId: string, field: keyof Category, value: any) => {
    setDomainGroup(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const removeCategory = (categoryId: string) => {
    setDomainGroup(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    updateCategory(categoryId, 'isExpanded', !domainGroup.categories.find(cat => cat.id === categoryId)?.isExpanded);
  };

  const addSubCategory = (categoryId: string) => {
    const newSubCategory: SubCategory = {
      id: crypto.randomUUID(),
      name: '',
      description: ''
    };
    
    setDomainGroup(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId 
          ? { ...cat, subCategories: [...cat.subCategories, newSubCategory] }
          : cat
      )
    }));
  };

  const updateSubCategory = (categoryId: string, subCategoryId: string, field: keyof SubCategory, value: string) => {
    setDomainGroup(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId 
          ? {
              ...cat,
              subCategories: cat.subCategories.map(sub =>
                sub.id === subCategoryId ? { ...sub, [field]: value } : sub
              )
            }
          : cat
      )
    }));
  };

  const removeSubCategory = (categoryId: string, subCategoryId: string) => {
    setDomainGroup(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId 
          ? {
              ...cat,
              subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId)
            }
          : cat
      )
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!domainGroup.name.trim()) return;
    
    // Filter out empty categories and subcategories
    const cleanedData = {
      ...domainGroup,
      categories: domainGroup.categories
        .filter(cat => cat.name.trim())
        .map(cat => ({
          ...cat,
          subCategories: cat.subCategories.filter(sub => sub.name.trim())
        }))
    };

    await onSave(cleanedData);
  };

  const canSave = domainGroup.name.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Create Domain Group with Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domain Group Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="domain-group-name">Domain Group Name *</Label>
            <Input
              id="domain-group-name"
              value={domainGroup.name}
              onChange={(e) => setDomainGroup(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter domain group name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="industry-segment">Industry Segment (Optional)</Label>
            <Select
              value={domainGroup.industry_segment_id}
              onValueChange={(value) => setDomainGroup(prev => ({ 
                ...prev, 
                industry_segment_id: value === 'none' ? '' : value 
              }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select industry segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Industry Segment</SelectItem>
                {industrySegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="domain-group-description">Description</Label>
          <Textarea
            id="domain-group-description"
            value={domainGroup.description}
            onChange={(e) => setDomainGroup(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter description (optional)"
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Categories</h3>
              <Badge variant="secondary">{domainGroup.categories.length}</Badge>
            </div>
            <Button
              onClick={addCategory}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          {domainGroup.categories.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
              <FolderTree className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No categories added yet. Click "Add Category" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {domainGroup.categories.map((category, categoryIndex) => (
                <Card key={category.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Category {categoryIndex + 1}</Badge>
                          {category.subCategories.length > 0 && (
                            <Collapsible 
                              open={category.isExpanded} 
                              onOpenChange={() => toggleCategoryExpansion(category.id)}
                            >
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  {category.isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          )}
                        </div>
                        <Button
                          onClick={() => removeCategory(category.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Category Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Category Name *</Label>
                          <Input
                            value={category.name}
                            onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                            placeholder="Enter category name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Category Description</Label>
                          <Input
                            value={category.description}
                            onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                            placeholder="Enter category description"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Sub-Categories Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Circle className="w-4 h-4 text-orange-600" />
                            <span className="font-medium">Sub-Categories</span>
                            <Badge variant="secondary">{category.subCategories.length}</Badge>
                          </div>
                          <Button
                            onClick={() => addSubCategory(category.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-3 h-3" />
                            Add Sub-Category
                          </Button>
                        </div>

                        {category.subCategories.length === 0 ? (
                          <div className="text-sm text-muted-foreground ml-6 p-3 border-2 border-dashed border-muted/50 rounded">
                            No sub-categories yet. Click "Add Sub-Category" to add some.
                          </div>
                        ) : (
                          <Collapsible open={category.isExpanded}>
                            <CollapsibleContent className="ml-6 space-y-3">
                              {category.subCategories.map((subCategory, subIndex) => (
                                <div key={subCategory.id} className="p-3 border rounded bg-muted/20">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      Sub-Category {subIndex + 1}
                                    </Badge>
                                    <Button
                                      onClick={() => removeSubCategory(category.id, subCategory.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs">Sub-Category Name *</Label>
                                      <Input
                                        value={subCategory.name}
                                        onChange={(e) => updateSubCategory(category.id, subCategory.id, 'name', e.target.value)}
                                        placeholder="Enter sub-category name"
                                        className="mt-1 h-8"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Sub-Category Description</Label>
                                      <Input
                                        value={subCategory.description}
                                        onChange={(e) => updateSubCategory(category.id, subCategory.id, 'description', e.target.value)}
                                        placeholder="Enter sub-category description"
                                        className="mt-1 h-8"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={saving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Domain Group
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainGroupHierarchyForm;