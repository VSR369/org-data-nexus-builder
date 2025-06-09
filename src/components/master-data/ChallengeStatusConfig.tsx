
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ChallengeStatus {
  id: string;
  name: string;
  description: string;
  order: number;
}

const ChallengeStatusConfig = () => {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<ChallengeStatus[]>([
    {
      id: 'status-1',
      name: 'Challenge Identification',
      description: 'Initial identification and discovery of potential challenges',
      order: 1
    },
    {
      id: 'status-2',
      name: 'Challenge Creation',
      description: 'Formal creation and documentation of the challenge',
      order: 2
    },
    {
      id: 'status-3',
      name: 'Challenge Curation',
      description: 'Content review and organization of challenge materials',
      order: 3
    },
    {
      id: 'status-4',
      name: 'Challenge Review',
      description: 'Comprehensive review of challenge details and requirements',
      order: 4
    },
    {
      id: 'status-5',
      name: 'Challenge Modification / Refinement',
      description: 'Updates and improvements based on review feedback',
      order: 5
    },
    {
      id: 'status-6',
      name: 'Challenge Rejection',
      description: 'Challenge has been rejected and will not proceed',
      order: 6
    },
    {
      id: 'status-7',
      name: 'Challenge Approved for Publishing',
      description: 'Challenge has been approved and is ready for publication',
      order: 7
    }
  ]);

  const [newStatus, setNewStatus] = useState({ name: '', description: '' });
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  const generateId = () => `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddStatus = () => {
    if (newStatus.name.trim()) {
      const status: ChallengeStatus = {
        id: generateId(),
        name: newStatus.name.trim(),
        description: newStatus.description.trim(),
        order: statuses.length + 1
      };
      
      setStatuses(prev => [...prev, status]);
      setNewStatus({ name: '', description: '' });
      setIsAdding(false);
      
      toast({
        title: "Success",
        description: "Challenge status added successfully",
      });
    }
  };

  const handleEditStatus = (statusId: string) => {
    const status = statuses.find(s => s.id === statusId);
    if (status) {
      setEditingStatus(statusId);
      setEditValues({ name: status.name, description: status.description });
    }
  };

  const handleSaveEdit = () => {
    if (editingStatus && editValues.name.trim()) {
      setStatuses(prev => prev.map(status => 
        status.id === editingStatus 
          ? { ...status, name: editValues.name.trim(), description: editValues.description.trim() }
          : status
      ));
      
      setEditingStatus(null);
      setEditValues({ name: '', description: '' });
      
      toast({
        title: "Success",
        description: "Challenge status updated successfully",
      });
    }
  };

  const handleDeleteStatus = (statusId: string) => {
    setStatuses(prev => prev.filter(status => status.id !== statusId));
    
    toast({
      title: "Success",
      description: "Challenge status deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge Status Configuration</CardTitle>
        <CardDescription>
          Configure challenge lifecycle statuses for tracking challenge progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Challenge Statuses</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Status
          </Button>
        </div>

        {isAdding && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
            <div>
              <Label htmlFor="new-status-name">Status Name</Label>
              <Input
                id="new-status-name"
                value={newStatus.name}
                onChange={(e) => setNewStatus(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter status name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-status-description">Description</Label>
              <Input
                id="new-status-description"
                value={newStatus.description}
                onChange={(e) => setNewStatus(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter status description"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddStatus} size="sm" className="flex items-center gap-1">
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
          {statuses
            .sort((a, b) => a.order - b.order)
            .map((status) => (
            <Card key={status.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                {editingStatus === status.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Status Name</Label>
                      <Input
                        value={editValues.name}
                        onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={editValues.description}
                        onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} size="sm">
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button onClick={() => setEditingStatus(null)} variant="outline" size="sm">
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {status.order}
                        </Badge>
                        <h4 className="font-semibold">{status.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{status.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditStatus(status.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteStatus(status.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeStatusConfig;
