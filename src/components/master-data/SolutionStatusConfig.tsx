import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager, GlobalCacheManager } from '@/utils/dataManager';

const defaultStatuses = [
  'Solution Submission Phase',
  'Solution Shortlisting / Screening',
  'Solution Selected for Full Assessment',
  'Partial Payment Done by Client (if applicable to model)',
  'Solution Voting (if applicable)',
  'Solution Evaluation / Assessment',
  'Finalized – Investment Approved',
  'Finalized – Pilot / Proof-of-Concept (PoC)',
  'Finalized – Ready for Full-Scale Implementation',
  'Finalized – Suspended',
  'Selection & Reward Declaration'
];

const dataManager = new DataManager<string[]>({
  key: 'master_data_solution_statuses',
  defaultData: defaultStatuses,
  version: 1
});

GlobalCacheManager.registerKey('master_data_solution_statuses');

const SolutionStatusConfig = () => {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load statuses from DataManager on component mount
  useEffect(() => {
    const loadedStatuses = dataManager.loadData();
    setStatuses(loadedStatuses);
    console.log('Loaded solution statuses from DataManager:', loadedStatuses);
  }, []);

  // Save statuses to DataManager whenever statuses change
  useEffect(() => {
    dataManager.saveData(statuses);
    console.log('Saved solution statuses to DataManager:', statuses);
  }, [statuses]);

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      setStatuses([...statuses, newStatus.trim()]);
      setNewStatus('');
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Solution status added successfully",
      });
    }
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditingValue(statuses[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const updatedStatuses = [...statuses];
      updatedStatuses[editingIndex] = editingValue.trim();
      setStatuses(updatedStatuses);
      setEditingIndex(null);
      setEditingValue('');
      toast({
        title: "Success",
        description: "Solution status updated successfully",
      });
    }
  };

  const handleDeleteStatus = (index: number) => {
    const updatedStatuses = statuses.filter((_, i) => i !== index);
    setStatuses(updatedStatuses);
    toast({
      title: "Success",
      description: "Solution status deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStatus('');
  };

  const handleResetToDefault = () => {
    const resetData = dataManager.resetToDefault();
    setStatuses(resetData);
    toast({
      title: "Success",
      description: "Solution statuses reset to default values",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Solution Statuses</CardTitle>
            <CardDescription>
              Configure available statuses for solutions throughout their evaluation process
            </CardDescription>
          </div>
          <Button
            onClick={handleResetToDefault}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Solution Statuses</h3>
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

        <div className="grid gap-2">
          {statuses.map((status, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
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
                    <span className="font-medium">{status}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditStatus(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteStatus(index)}
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

        {statuses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No solution statuses found. Add one to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionStatusConfig;
