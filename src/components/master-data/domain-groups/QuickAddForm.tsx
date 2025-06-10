
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, X } from 'lucide-react';
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
  selectedDomainGroup,
  selectedCategory,
  onSelectIndustrySegment,
  onAddDomainGroup,
  onAddCategory,
  onAddSubCategory,
  showMessage
}) => {
  const [activeForm, setActiveForm] = useState<'group' | 'category' | 'subcategory' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domainGroupId: '',
    categoryId: ''
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', domainGroupId: '', categoryId: '' });
    setActiveForm(null);
  };

  const handleAddGroup = () => {
    if (formData.name.trim() && selectedIndustrySegment) {
      onAddDomainGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
        industrySegmentId: selectedIndustrySegment,
        isActive: true,
        categories: []
      });
      showMessage('Domain group added successfully');
      resetForm();
    }
  };

  const handleAddCategory = () => {
    if (formData.name.trim() && formData.domainGroupId) {
      onAddCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        domainGroupId: formData.domainGroupId,
        isActive: true
      });
      showMessage('Category added successfully');
      resetForm();
    }
  };

  const handleAddSubCategory = () => {
    if (formData.name.trim() && formData.categoryId) {
      onAddSubCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        isActive: true
      });
      showMessage('Sub-category added successfully');
      resetForm();
    }
  };

  const categories = selectedDomainGroup 
    ? domainGroups.find(group => group.id === selectedDomainGroup)?.categories || []
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add</CardTitle>
        <CardDescription>
          Quickly add new domain groups, categories, or sub-categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Industry Segment Selection */}
        <div>
          <Label htmlFor="industry-segment">Industry Segment</Label>
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
        </div>

        {/* Quick Add Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setActiveForm('group')}
            disabled={!selectedIndustrySegment || activeForm !== null}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Group
          </Button>
          <Button
            onClick={() => setActiveForm('category')}
            disabled={!selectedIndustrySegment || activeForm !== null}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Category
          </Button>
          <Button
            onClick={() => setActiveForm('subcategory')}
            disabled={!selectedIndustrySegment || activeForm !== null}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Sub-Category
          </Button>
        </div>

        {/* Active Form */}
        {activeForm && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Add New {activeForm === 'group' ? 'Domain Group' : 
                          activeForm === 'category' ? 'Category' : 'Sub-Category'}
              </h4>
              <Button onClick={resetForm} variant="ghost" size="sm">
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Domain Group Selection for Category */}
            {activeForm === 'category' && (
              <div>
                <Label htmlFor="domain-group-select">Domain Group</Label>
                <Select value={formData.domainGroupId} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, domainGroupId: value }))}>
                  <SelectTrigger>
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
            )}

            {/* Category Selection for Sub-Category */}
            {activeForm === 'subcategory' && (
              <>
                <div>
                  <Label htmlFor="domain-group-select-sub">Domain Group</Label>
                  <Select value={formData.domainGroupId} onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, domainGroupId: value, categoryId: '' }));
                  }}>
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="category-select">Category</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.domainGroupId && domainGroups
                        .find(group => group.id === formData.domainGroupId)?.categories
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={`Enter ${activeForm === 'group' ? 'domain group' : 
                              activeForm === 'category' ? 'category' : 'sub-category'} name`}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={activeForm === 'group' ? handleAddGroup : 
                         activeForm === 'category' ? handleAddCategory : handleAddSubCategory}
                size="sm"
                className="flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
