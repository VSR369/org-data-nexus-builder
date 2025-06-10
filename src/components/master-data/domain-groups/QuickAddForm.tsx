import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IndustrySegment, DomainGroup } from './types';
import { Plus, Building2 } from 'lucide-react';

interface QuickAddFormProps {
  industrySegments: IndustrySegment[];
  domainGroups: DomainGroup[];
  selectedIndustrySegment: string;
  selectedDomainGroup: string;
  selectedCategory: string;
  onSelectIndustrySegment: (segmentId: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => void;
  onAddCategory: (category: { name: string; description?: string; domainGroupId: string; isActive: boolean }) => void;
  onAddSubCategory: (subCategory: { name: string; description?: string; categoryId: string; isActive: boolean }) => void;
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
  const [domainGroupName, setDomainGroupName] = useState('');
  const [domainGroupDescription, setDomainGroupDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryDescription, setSubCategoryDescription] = useState('');

  const selectedSegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);
  const filteredDomainGroups = domainGroups.filter(dg => dg.industrySegmentId === selectedIndustrySegment);

  const handleAddDomainGroup = () => {
    if (!selectedIndustrySegment) {
      showMessage('Please select an industry segment first');
      return;
    }
    if (!domainGroupName.trim()) {
      showMessage('Please enter a domain group name');
      return;
    }

    onAddDomainGroup({
      name: domainGroupName.trim(),
      description: domainGroupDescription.trim() || undefined,
      industrySegmentId: selectedIndustrySegment,
      isActive: true
    });

    setDomainGroupName('');
    setDomainGroupDescription('');
    showMessage(`Domain group "${domainGroupName}" added successfully`);
  };

  const handleAddCategory = () => {
    if (!selectedDomainGroup) {
      showMessage('Please select a domain group first');
      return;
    }
    if (!categoryName.trim()) {
      showMessage('Please enter a category name');
      return;
    }

    onAddCategory({
      name: categoryName.trim(),
      description: categoryDescription.trim() || undefined,
      domainGroupId: selectedDomainGroup,
      isActive: true
    });

    setCategoryName('');
    setCategoryDescription('');
    showMessage(`Category "${categoryName}" added successfully`);
  };

  const handleAddSubCategory = () => {
    if (!selectedCategory) {
      showMessage('Please select a category first');
      return;
    }
    if (!subCategoryName.trim()) {
      showMessage('Please enter a sub-category name');
      return;
    }

    onAddSubCategory({
      name: subCategoryName.trim(),
      description: subCategoryDescription.trim() || undefined,
      categoryId: selectedCategory,
      isActive: true
    });

    setSubCategoryName('');
    setSubCategoryDescription('');
    showMessage(`Sub-category "${subCategoryName}" added successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Industry Segment Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Industry Segment Selection
          </CardTitle>
          <CardDescription>
            Choose an industry segment to create domain groups for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry-segment">Industry Segment *</Label>
              <Select value={selectedIndustrySegment} onValueChange={onSelectIndustrySegment}>
                <SelectTrigger id="industry-segment" className="mt-1">
                  <SelectValue placeholder="Select an industry segment" />
                </SelectTrigger>
                <SelectContent>
                  {industrySegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {segment.code}
                        </Badge>
                        {segment.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSegmentInfo && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{selectedSegmentInfo.name}</p>
                {selectedSegmentInfo.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedSegmentInfo.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Domain Group Creation */}
      {selectedIndustrySegment && (
        <Card>
          <CardHeader>
            <CardTitle>Add Domain Group</CardTitle>
            <CardDescription>
              Create a new domain group for {selectedSegmentInfo?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain-group-name">Domain Group Name *</Label>
                <Input
                  id="domain-group-name"
                  value={domainGroupName}
                  onChange={(e) => setDomainGroupName(e.target.value)}
                  placeholder="Enter domain group name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="domain-group-description">Description</Label>
                <Textarea
                  id="domain-group-description"
                  value={domainGroupDescription}
                  onChange={(e) => setDomainGroupDescription(e.target.value)}
                  placeholder="Enter domain group description (optional)"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <Button 
                onClick={handleAddDomainGroup}
                disabled={!domainGroupName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Domain Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain Group Selection for Categories */}
      {selectedIndustrySegment && filteredDomainGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
            <CardDescription>
              Select a domain group and add a category to it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain-group-select">Domain Group *</Label>
                <Select value={selectedDomainGroup} onValueChange={(value) => {
                  // This will be handled by the parent component
                }}>
                  <SelectTrigger id="domain-group-select" className="mt-1">
                    <SelectValue placeholder="Select a domain group" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDomainGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDomainGroup && (
                <>
                  <div>
                    <Label htmlFor="category-name">Category Name *</Label>
                    <Input
                      id="category-name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-description">Description</Label>
                    <Textarea
                      id="category-description"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="Enter category description (optional)"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <Button 
                    onClick={handleAddCategory}
                    disabled={!categoryName.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
