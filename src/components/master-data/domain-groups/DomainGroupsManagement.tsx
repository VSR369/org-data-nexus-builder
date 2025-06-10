
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { IndustrySegment, DomainGroup } from './types';

interface DomainGroupsManagementProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (id: string) => void;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onSelectDomainGroup: (id: string) => void;
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

  const selectedSegment = industrySegments.find(segment => segment.id === selectedIndustrySegment);

  const handleAdd = () => {
    if (formData.name.trim() && selectedIndustrySegment) {
      onAddDomainGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
        industrySegmentId: selectedIndustrySegment,
        isActive: true
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Segment Selection</CardTitle>
          <CardDescription>
            Select an industry segment to manage its domain groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry-segment">Industry Segment</Label>
              <Select value={selectedIndustrySegment} onValueChange={(value) => {
                onSelectIndustrySegment(value);
                showMessage(`Selected industry segment: ${industrySegments.find(s => s.id === value)?.name}`);
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select an industry segment" />
                </SelectTrigger>
                <SelectContent>
                  {industrySegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{segment.code.toUpperCase()}</Badge>
                        <span>{segment.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedSegment && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{selectedSegment.code.toUpperCase()}</Badge>
                  <span className="font-medium">{selectedSegment.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Manage domain groups for this industry segment below.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedIndustrySegment && (
        <Card>
          <CardHeader>
            <CardTitle>Domain Groups</CardTitle>
            <CardDescription>
              Create and manage domain groups for {selectedSegment?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Domain Groups ({domainGroups.length})</h3>
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

            <div className="grid gap-3">
              {domainGroups.map((group) => (
                <div key={group.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  {editingId === group.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Domain Group Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Domain group name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description"
                          className="mt-1"
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
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          onSelectDomainGroup(group.id);
                          showMessage(`Selected domain group: ${group.name}`);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-lg">{group.name}</span>
                          {selectedDomainGroup === group.id && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(group.createdAt).toLocaleDateString()}
                        </p>
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
                    </div>
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
      )}
    </div>
  );
};
