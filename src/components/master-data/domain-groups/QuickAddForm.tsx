
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, X, ChevronRight } from 'lucide-react';
import { DomainGroup, Category, IndustrySegment } from './types';

interface QuickAddFormProps {
  industrySegments: IndustrySegment[];
  domainGroups: DomainGroup[];
  selectedIndustrySegment: string;
  selectedDomainGroup: string;
  selectedCategory: string;
  onSelectIndustrySegment: (id: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt'>) => void;
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt' | 'subCategories'>) => void;
  onAddSubCategory: (subCategory: any) => void;
  showMessage: (message: string) => void;
}

export const QuickAddForm: React.FC<QuickAddFormProps> = ({
  industrySegments,
  domainGroups,
  selectedIndustrySegment,
  onSelectIndustrySegment,
  onAddDomainGroup,
  onAddCategory,
  onAddSubCategory,
  showMessage
}) => {
  const [formData, setFormData] = useState({
    // Domain Group
    groupName: '',
    groupDescription: '',
    // Category
    categoryName: '',
    categoryDescription: '',
    // Sub-Category
    subCategoryName: '',
    subCategoryDescription: '',
    // Selection for existing items
    selectedDomainGroup: '',
    selectedCategory: ''
  });

  const [addMode, setAddMode] = useState<'complete' | 'group-only' | 'category-only' | 'subcategory-only'>('complete');

  const resetForm = () => {
    setFormData({
      groupName: '',
      groupDescription: '',
      categoryName: '',
      categoryDescription: '',
      subCategoryName: '',
      subCategoryDescription: '',
      selectedDomainGroup: '',
      selectedCategory: ''
    });
  };

  const handleCompleteAdd = () => {
    if (!selectedIndustrySegment) {
      showMessage('Please select an industry segment first');
      return;
    }

    if (!formData.groupName.trim()) {
      showMessage('Domain Group name is required');
      return;
    }

    // Add Domain Group first
    const domainGroupId = `${selectedIndustrySegment}-${Date.now()}`;
    onAddDomainGroup({
      name: formData.groupName.trim(),
      description: formData.groupDescription.trim(),
      industrySegmentId: selectedIndustrySegment,
      isActive: true,
      categories: []
    });

    // If category is provided, add it
    if (formData.categoryName.trim()) {
      setTimeout(() => {
        const categoryId = `${domainGroupId}-cat-${Date.now()}`;
        onAddCategory({
          name: formData.categoryName.trim(),
          description: formData.categoryDescription.trim(),
          domainGroupId: domainGroupId,
          isActive: true
        });

        // If sub-category is provided, add it
        if (formData.subCategoryName.trim()) {
          setTimeout(() => {
            onAddSubCategory({
              name: formData.subCategoryName.trim(),
              description: formData.subCategoryDescription.trim(),
              categoryId: categoryId,
              isActive: true
            });
            showMessage('Complete hierarchy added successfully!');
          }, 100);
        } else {
          showMessage('Domain Group and Category added successfully!');
        }
      }, 100);
    } else {
      showMessage('Domain Group added successfully!');
    }

    resetForm();
  };

  const handleGroupOnlyAdd = () => {
    if (!selectedIndustrySegment || !formData.groupName.trim()) {
      showMessage('Please select industry segment and enter group name');
      return;
    }

    onAddDomainGroup({
      name: formData.groupName.trim(),
      description: formData.groupDescription.trim(),
      industrySegmentId: selectedIndustrySegment,
      isActive: true,
      categories: []
    });

    showMessage('Domain Group added successfully');
    resetForm();
  };

  const handleCategoryOnlyAdd = () => {
    if (!formData.selectedDomainGroup || !formData.categoryName.trim()) {
      showMessage('Please select domain group and enter category name');
      return;
    }

    onAddCategory({
      name: formData.categoryName.trim(),
      description: formData.categoryDescription.trim(),
      domainGroupId: formData.selectedDomainGroup,
      isActive: true
    });

    showMessage('Category added successfully');
    resetForm();
  };

  const handleSubCategoryOnlyAdd = () => {
    if (!formData.selectedCategory || !formData.subCategoryName.trim()) {
      showMessage('Please select category and enter sub-category name');
      return;
    }

    onAddSubCategory({
      name: formData.subCategoryName.trim(),
      description: formData.subCategoryDescription.trim(),
      categoryId: formData.selectedCategory,
      isActive: true
    });

    showMessage('Sub-Category added successfully');
    resetForm();
  };

  const categories = formData.selectedDomainGroup 
    ? domainGroups.find(group => group.id === formData.selectedDomainGroup)?.categories || []
    : [];

  return (
    <div className="space-y-6">
      {/* Industry Segment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Segment</CardTitle>
          <CardDescription>Select the industry segment for your domain structure</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedIndustrySegment} onValueChange={onSelectIndustrySegment}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry segment" />
            </SelectTrigger>
            <SelectContent>
              {industrySegments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedIndustrySegment && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Add Options</CardTitle>
            <CardDescription>Choose what you want to add</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Mode Selection */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setAddMode('complete')}
                variant={addMode === 'complete' ? 'default' : 'outline'}
                size="sm"
              >
                Complete Hierarchy
              </Button>
              <Button
                onClick={() => setAddMode('group-only')}
                variant={addMode === 'group-only' ? 'default' : 'outline'}
                size="sm"
              >
                Domain Group Only
              </Button>
              <Button
                onClick={() => setAddMode('category-only')}
                variant={addMode === 'category-only' ? 'default' : 'outline'}
                size="sm"
              >
                Category Only
              </Button>
              <Button
                onClick={() => setAddMode('subcategory-only')}
                variant={addMode === 'subcategory-only' ? 'default' : 'outline'}
                size="sm"
              >
                Sub-Category Only
              </Button>
            </div>

            {/* Form Fields Based on Mode */}
            <div className="space-y-4">
              {/* Complete Hierarchy or Group Only */}
              {(addMode === 'complete' || addMode === 'group-only') && (
                <div className="p-4 border rounded-lg bg-blue-50 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <h4 className="font-medium">Domain Group</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="group-name">Group Name *</Label>
                      <Input
                        id="group-name"
                        value={formData.groupName}
                        onChange={(e) => setFormData(prev => ({ ...prev, groupName: e.target.value }))}
                        placeholder="e.g., Strategy, Innovation & Growth"
                      />
                    </div>
                    <div>
                      <Label htmlFor="group-description">Group Description</Label>
                      <Textarea
                        id="group-description"
                        value={formData.groupDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, groupDescription: e.target.value }))}
                        placeholder="Describe the domain group"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Category Selection for Category/Sub-Category Only */}
              {(addMode === 'category-only' || addMode === 'subcategory-only') && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="existing-domain-group">Select Domain Group</Label>
                    <Select value={formData.selectedDomainGroup} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, selectedDomainGroup: value, selectedCategory: '' }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select existing domain group" />
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
              )}

              {/* Category for Complete or Category Only */}
              {(addMode === 'complete' || addMode === 'category-only') && (
                <div className="p-4 border rounded-lg bg-green-50 space-y-4">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <h4 className="font-medium">Category</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category-name">Category Name {addMode === 'category-only' ? '*' : ''}</Label>
                      <Input
                        id="category-name"
                        value={formData.categoryName}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                        placeholder="e.g., Strategic Vision & Business Planning"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-description">Category Description</Label>
                      <Textarea
                        id="category-description"
                        value={formData.categoryDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryDescription: e.target.value }))}
                        placeholder="Describe the category"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Category Selection for Sub-Category Only */}
              {addMode === 'subcategory-only' && formData.selectedDomainGroup && (
                <div>
                  <Label htmlFor="existing-category">Select Category</Label>
                  <Select value={formData.selectedCategory} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, selectedCategory: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select existing category" />
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
              )}

              {/* Sub-Category for Complete or Sub-Category Only */}
              {(addMode === 'complete' || addMode === 'subcategory-only') && (
                <div className="p-4 border rounded-lg bg-purple-50 space-y-4">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <h4 className="font-medium">Sub-Category</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subcategory-name">Sub-Category Name {addMode === 'subcategory-only' ? '*' : ''}</Label>
                      <Input
                        id="subcategory-name"
                        value={formData.subCategoryName}
                        onChange={(e) => setFormData(prev => ({ ...prev, subCategoryName: e.target.value }))}
                        placeholder="e.g., Clinical & Scientific Mission Alignment"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subcategory-description">Sub-Category Description</Label>
                      <Textarea
                        id="subcategory-description"
                        value={formData.subCategoryDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, subCategoryDescription: e.target.value }))}
                        placeholder="Describe the sub-category"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={
                    addMode === 'complete' ? handleCompleteAdd :
                    addMode === 'group-only' ? handleGroupOnlyAdd :
                    addMode === 'category-only' ? handleCategoryOnlyAdd :
                    handleSubCategoryOnlyAdd
                  }
                  className="flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  {addMode === 'complete' ? 'Add Complete Hierarchy' :
                   addMode === 'group-only' ? 'Add Domain Group' :
                   addMode === 'category-only' ? 'Add Category' :
                   'Add Sub-Category'}
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <X className="w-4 h-4" />
                  Clear Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
