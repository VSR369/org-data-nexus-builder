import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, X, ChevronRight, ChevronDown, ChevronUp, FolderOpen, Folder, FileText, ArrowLeft } from 'lucide-react';
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
  });

  const [viewMode, setViewMode] = useState<'add' | 'explore'>('add');
  const [selectedGroupForExplore, setSelectedGroupForExplore] = useState<DomainGroup | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showExistingGroups, setShowExistingGroups] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add ref for the form section
  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleAddDomainGroupClick = () => {
    setShowAddForm(true);
    // Scroll to form section after a brief delay to ensure it's rendered
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const resetForm = () => {
    setFormData({
      groupName: '',
      groupDescription: '',
      categoryName: '',
      categoryDescription: '',
      subCategoryName: '',
      subCategoryDescription: '',
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
    setShowAddForm(false);
  };

  // Explore view for a selected domain group
  if (viewMode === 'explore' && selectedGroupForExplore) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {
                  setViewMode('add');
                  setSelectedGroupForExplore(null);
                  setExpandedCategories(new Set());
                }}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Quick Add
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  {selectedGroupForExplore.name}
                </CardTitle>
                <CardDescription>{selectedGroupForExplore.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedGroupForExplore.categories?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No categories found in this domain group.</p>
                </div>
              ) : (
                selectedGroupForExplore.categories?.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      onClick={() => toggleCategoryExpansion(category.id)}
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Folder className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {category.subCategories?.length || 0} sub-categories
                      </Badge>
                    </div>
                    
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2 ml-8">{category.description}</p>
                    )}
                    
                    {expandedCategories.has(category.id) && (
                      <div className="ml-8 mt-3 space-y-2">
                        {category.subCategories?.length === 0 ? (
                          <div className="text-sm text-muted-foreground italic">
                            No sub-categories found in this category.
                          </div>
                        ) : (
                          category.subCategories?.map((subCategory) => (
                            <div key={subCategory.id} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                              <FileText className="h-3 w-3 text-purple-600 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{subCategory.name}</div>
                                {subCategory.description && (
                                  <div className="text-xs text-muted-foreground mt-1">{subCategory.description}</div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <>
          {/* Add Domain Group Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Domain Groups</CardTitle>
                  <CardDescription>Add new domain groups or explore existing ones</CardDescription>
                </div>
                <Button 
                  onClick={handleAddDomainGroupClick}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Domain Group
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Toggle for Existing Groups */}
              {domainGroups.length > 0 && (
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Existing Domain Groups ({domainGroups.length})</h3>
                  <Button
                    onClick={() => setShowExistingGroups(!showExistingGroups)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {showExistingGroups ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Groups
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show Groups
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Existing Domain Groups */}
              {domainGroups.length > 0 && showExistingGroups && (
                <div className="grid gap-3">
                  {domainGroups.map((group) => (
                    <div 
                      key={group.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedGroupForExplore(group);
                        setViewMode('explore');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{group.name}</div>
                          {group.description && (
                            <div className="text-sm text-muted-foreground">{group.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {group.categories?.length || 0} categories
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {domainGroups.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No domain groups found. Click "Add Domain Group" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Domain Group Hierarchy Creation Form */}
          {showAddForm && (
            <div ref={formSectionRef}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Domain Group Hierarchy Creation</CardTitle>
                      <CardDescription>Create a complete domain group hierarchy with categories and sub-categories</CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Domain Group Section */}
                  <div className="p-4 border rounded-lg bg-blue-50 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <h4 className="font-medium">Domain Group *</h4>
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

                  {/* Category Section */}
                  <div className="p-4 border rounded-lg bg-green-50 space-y-4">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <h4 className="font-medium">Category (Optional)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category-name">Category Name</Label>
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

                  {/* Sub-Category Section */}
                  <div className="p-4 border rounded-lg bg-purple-50 space-y-4">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <ChevronRight className="w-4 h-4" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <h4 className="font-medium">Sub-Category (Optional)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subcategory-name">Sub-Category Name</Label>
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleCompleteAdd}
                      className="flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      Create Hierarchy
                    </Button>
                    <Button onClick={resetForm} variant="outline">
                      <X className="w-4 h-4" />
                      Clear Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};
