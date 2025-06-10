
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { DomainGroup } from './types';

interface DomainGroupTabProps {
  selectedIndustrySegment: string;
  domainGroups: DomainGroup[];
  selectedDomainGroup: string;
  onSelectDomainGroup: (id: string) => void;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt'>) => void;
  onUpdateDomainGroup: (id: string, updates: Partial<DomainGroup>) => void;
  onDeleteDomainGroup: (id: string) => void;
  showMessage: (message: string) => void;
}

export const DomainGroupTab: React.FC<DomainGroupTabProps> = ({
  selectedIndustrySegment,
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

  if (!selectedIndustrySegment) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select an industry segment first to manage domain groups.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Domain Groups</CardTitle>
          <CardDescription>
            Manage domain groups for the selected industry segment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Domain Groups</h3>
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
                            <Badge variant="default" size="sm">Selected</Badge>
                          )}
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                        )}
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
    </div>
  );
};
