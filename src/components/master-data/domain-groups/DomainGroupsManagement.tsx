
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Edit, Trash2, Save, X, ChevronRight, ChevronDown, FolderOpen, Folder, FileText } from 'lucide-react';
import { DomainGroup, IndustrySegment } from './types';

interface DomainGroupsManagementProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (segmentId: string) => void;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onSelectDomainGroup: (groupId: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt'>) => void;
  onUpdateDomainGroup: (id: string, updates: Partial<DomainGroup>) => void;
  onDeleteDomainGroup: (id: string) => void;
  showMessage: (message: string) => void;
}

export const DomainGroupsManagement: React.FC<DomainGroupsManagementProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment,
  domainGroups,
  selectedDomainGroup,
  onSelectDomainGroup,
  onAddDomainGroup,
  onUpdateDomainGroup,
  onDeleteDomainGroup,
  showMessage
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
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

  const handleAdd = () => {
    if (formData.name.trim() && selectedIndustrySegment) {
      onAddDomainGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
        industrySegmentId: selectedIndustrySegment,
        isActive: true,
        categories: []
      });
      setFormData({ name: '', description: '' });
      setIsAdding(false);
      showMessage('Domain group added successfully');
    }
  };

  const handleEdit = (group: DomainGroup) => {
    setEditingId(group.id);
    setFormData({ name: group.name, description: group.description || '' });
  };

  const handleSaveEdit = () => {
    if (formData.name.trim() && editingId) {
      onUpdateDomainGroup(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      setEditingId(null);
      setFormData({ name: '', description: '' });
      showMessage('Domain group updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const selectedSegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);

  return (
    <div className="space-y-6">
      {/* Industry Segment Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Segment Selection</CardTitle>
          <CardDescription>
            Select an industry segment to view and manage its domain groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry-segment-select">Industry Segment</Label>
              <Select value={selectedIndustrySegment} onValueChange={onSelectIndustrySegment}>
                <SelectTrigger id="industry-segment-select" className="mt-1">
                  <SelectValue placeholder="Select an industry segment" />
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
          </div>
        </CardContent>
      </Card>

      {selectedIndustrySegment && (
        <>
          {/* Complete Domain Structure Tree View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Domain Groups Structure - {selectedSegmentInfo?.name}
                  </CardTitle>
                  <CardDescription>
                    Complete hierarchical view with expandable groups, categories, and sub-categories
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAdding(true)} 
                  disabled={isAdding}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Domain Group
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdding && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4 mb-4">
                  <div>
                    <Label htmlFor="new-domain-group-name">Domain Group Name</Label>
                    <Input
                      id="new-domain-group-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter domain group name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-domain-group-description">Description (Optional)</Label>
                    <Textarea
                      id="new-domain-group-description"
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

              {/* Domain Groups Tree Structure */}
              <div className="space-y-3">
                {domainGroups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No domain groups found. Add one to get started.</p>
                  </div>
                ) : (
                  domainGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg">
                      {editingId === group.id ? (
                        <div className="p-4 space-y-4">
                          <div>
                            <Label>Group Name</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Domain group name"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Description"
                            />
                          </div>
                          <div className="flex gap-2">
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
                          {/* Domain Group Header */}
                          <Collapsible
                            open={expandedGroups.has(group.id)}
                            onOpenChange={() => toggleGroupExpansion(group.id)}
                          >
                            <div className="flex items-center justify-between p-4">
                              <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1 hover:bg-muted/50 p-2 rounded">
                                {expandedGroups.has(group.id) ? (
                                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                )}
                                <FolderOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="font-semibold text-lg">{group.name}</div>
                                  {group.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {group.categories?.length || 0} categories
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {group.categories?.reduce((total, cat) => total + (cat.subCategories?.length || 0), 0)} sub-categories
                                    </Badge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleEdit(group)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => {
                                    onDeleteDomainGroup(group.id);
                                    showMessage('Domain group deleted successfully');
                                  }}
                                  variant="destructive"
                                  size="sm"
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </div>

                            {/* Categories and Sub-Categories */}
                            <CollapsibleContent>
                              <div className="pl-8 pr-4 pb-4 space-y-2">
                                {group.categories?.length === 0 ? (
                                  <div className="text-sm text-muted-foreground italic py-2">
                                    No categories found in this domain group.
                                  </div>
                                ) : (
                                  group.categories?.map((category) => (
                                    <Collapsible
                                      key={category.id}
                                      open={expandedCategories.has(category.id)}
                                      onOpenChange={() => toggleCategoryExpansion(category.id)}
                                    >
                                      <div className="border rounded-md bg-muted/30">
                                        <CollapsibleTrigger className="flex items-center gap-2 p-3 hover:bg-muted/50 rounded-md w-full text-left">
                                          {expandedCategories.has(category.id) ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                          <Folder className="h-4 w-4 text-green-600" />
                                          <div className="flex-1">
                                            <div className="font-medium">{category.name}</div>
                                            {category.description && (
                                              <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                                            )}
                                          </div>
                                          <Badge variant="outline" className="text-xs">
                                            {category.subCategories?.length || 0} sub-categories
                                          </Badge>
                                        </CollapsibleTrigger>
                                        
                                        <CollapsibleContent>
                                          <div className="pl-6 pr-3 pb-3 space-y-1">
                                            {category.subCategories?.length === 0 ? (
                                              <div className="text-xs text-muted-foreground italic py-1">
                                                No sub-categories found in this category.
                                              </div>
                                            ) : (
                                              category.subCategories?.map((subCategory) => (
                                                <div key={subCategory.id} className="flex items-start gap-2 p-2 bg-background rounded border">
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
                                        </CollapsibleContent>
                                      </div>
                                    </Collapsible>
                                  ))
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
