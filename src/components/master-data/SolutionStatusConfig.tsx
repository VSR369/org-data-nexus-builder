import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSolutionStatuses } from '@/hooks/useMasterDataCRUD';

const SolutionStatusConfig = () => {
  const { toast } = useToast();
  const { items: statuses, loading, addItem, updateItem, deleteItem, refreshItems } = useSolutionStatuses();
  const [newStatus, setNewStatus] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddStatus = async () => {
    if (newStatus.trim()) {
      if (statuses.some(status => status.name === newStatus.trim())) {
        toast({
          title: "Error",
          description: "This status already exists.",
          variant: "destructive",
        });
        return;
      }
      
      const success = await addItem({ name: newStatus.trim(), is_user_created: true });
      if (success) {
        setNewStatus('');
        setIsAdding(false);
        toast({
          title: "Success",
          description: "Solution status added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add solution status",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditStatus = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingId) {
      const success = await updateItem(editingId, { name: editingValue.trim() });
      if (success) {
        setEditingId(null);
        setEditingValue('');
        toast({
          title: "Success",
          description: "Solution status updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update solution status",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteStatus = async (id: string, name: string) => {
    const success = await deleteItem(id);
    if (success) {
      toast({
        title: "Success",
        description: `${name} deleted successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete solution status",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStatus('');
  };

  const resetToDefault = async () => {
    await refreshItems();
    toast({
      title: "Info",
      description: "Data refreshed. Please manually add default statuses if needed.",
    });
  };

  const getStatusPhase = (status: string) => {
    if (status.includes('Draft') || status.includes('Creation') || status.includes('Ideation')) {
      return 'creation';
    }
    if (status.includes('Review') || status.includes('Validation') || status.includes('Assessment')) {
      return 'review';
    }
    if (status.includes('Approved') || status.includes('Published') || status.includes('Active')) {
      return 'active';
    }
    if (status.includes('Completed') || status.includes('Implemented') || status.includes('Closed')) {
      return 'completion';
    }
    return 'other';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'creation': return 'bg-blue-50 border-blue-200';
      case 'review': return 'bg-orange-50 border-orange-200';
      case 'active': return 'bg-green-50 border-green-200';
      case 'completion': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Solution Status Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage solution statuses for the complete solution lifecycle workflow
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Solution Statuses</CardTitle>
              <CardDescription>
                Configure available statuses for solutions in their lifecycle workflow
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={resetToDefault}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh Data
              </Button>
              <Button 
                onClick={() => setIsAdding(true)} 
                disabled={isAdding}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Status
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1">
                <Label htmlFor="new-status">New Solution Status</Label>
                <Input
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="Enter status name"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleAddStatus} size="sm" className="flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Save
                </Button>
                <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Loading solution statuses...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                {statuses.map((status, index) => {
                  const phase = getStatusPhase(status.name);
                  const phaseColor = getPhaseColor(phase);
                  
                  return (
                    <div key={status.id} className={`flex items-center justify-between p-3 border rounded-lg ${phaseColor} hover:bg-muted/50 transition-colors`}>
                      {editingId === status.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                            <Save className="w-3 h-3" />
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                            <X className="w-3 h-3" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{index + 1}</Badge>
                            <span className="font-medium">{status.name}</span>
                            <Badge variant="outline" className="capitalize">{phase}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditStatus(status.id, status.name)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteStatus(status.id, status.name)}
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
                  );
                })}
              </div>

              {statuses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No solution statuses configured.</p>
                  <p className="text-sm mt-1">Add solution statuses using the form above.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionStatusConfig;