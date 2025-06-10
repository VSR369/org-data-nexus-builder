
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
    <div className="space-y-4">
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
          {/* Complete Tree Structure View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Complete Domain Structure
              </CardTitle>
              <CardDescription>
                Full hierarchical view of the selected industry segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Folder className="h-4 w-4 text-blue-600" />
                  <span>{selectedSegmentInfo?.name}</span>
                </div>
                <div className="ml-6 space-y-1">
                  {domainGroups.map((group) => (
                    <Collapsible
                      key={group.id}
                      open={expandedGroups.has(group.id)}
                      onOpenChange={() => toggleGroupExpansion(group.id)}
                    >
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm hover:bg-muted/50 p-1 rounded w-full text-left">
                        {expandedGroups.has(group.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        <FolderOpen className="h-3 w-3 text-green-600" />
                        <span className={selectedDomainGroup === group.id ? "font-semibold text-primary" : ""}>{group.name}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {group.categories?.length || 0} categories
                        </Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-6 mt-1 space-y-1">
                        {group.categories?.map((category) => (
                          <Collapsible
                            key={category.id}
                            open={expandedCategories.has(category.id)}
                            onOpenChange={() => toggleCategoryExpansion(category.id)}
                          >
                            <CollapsibleTrigger className="flex items-center gap-2 text-xs hover:bg-muted/30 p-1 rounded w-full text-left">
                              {expandedCategories.has(category.id) ? (
                                <ChevronDown className="h-2 w-2" />
                              ) : (
                                <ChevronRight className="h-2 w-2" />
                              )}
                              <Folder className="h-2 w-2 text-orange-600" />
                              <span>{category.name}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {category.subCategories?.length || 0} sub-categories
                              </Badge>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="ml-6 mt-1 space-y-1">
                              {category.subCategories?.map((subCategory) => (
                                <div key={subCategory.id} className="flex items-center gap-2 text-xs text-muted-foreground p-1">
                                  <div className="w-2 h-2 border-l border-b border-muted-foreground/30 ml-1"></div>
                                  <FileText className="h-2 w-2 text-purple-600" />
                                  <span>{subCategory.name}</span>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Groups Management */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Groups Management</CardTitle>
              <CardDescription>
                Manage domain groups for {selectedSegmentInfo?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Current Domain Groups ({domainGroups.length})</h3>
                <Button 
                  onClick={() => setIsAdding(true)} 
                  disabled={isAdding}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Domain Group
                </Button>
              </div>

              {isAdding && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
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

              <div className="grid gap-2">
                {domainGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    {editingId === group.id ? (
                      <div className="flex gap-2 flex-1 space-y-2">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Domain group name"
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
                            onSelectDomainGroup(group.id);
                            showMessage(`Selected domain group: ${group.name}`);
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{group.name}</span>
                              {selectedDomainGroup === group.id && (
                                <Badge variant="default">Selected</Badge>
                              )}
                            </div>
                            {group.description && (
                              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Categories: {group.categories?.length || 0}
                            </p>
                          </div>
                        </div>
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
                      </>
                    )}
                  </div>
                ))}
              </div>

              {domainGroups.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No domain groups found. Add one to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
