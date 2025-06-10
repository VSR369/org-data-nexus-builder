
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DomainGroup } from '../types';
import { Plus } from 'lucide-react';

interface CategoryCreationProps {
  selectedIndustrySegment: string;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onAddCategory: (category: { name: string; description?: string; domainGroupId: string; isActive: boolean }) => void;
  showMessage: (message: string) => void;
}

export const CategoryCreation: React.FC<CategoryCreationProps> = ({
  selectedIndustrySegment,
  domainGroups,
  selectedDomainGroup,
  onAddCategory,
  showMessage
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const filteredDomainGroups = domainGroups.filter(dg => dg.industrySegmentId === selectedIndustrySegment);

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

  if (!selectedIndustrySegment || filteredDomainGroups.length === 0) {
    return null;
  }

  return (
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
  );
};
