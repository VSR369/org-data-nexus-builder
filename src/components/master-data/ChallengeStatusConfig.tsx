
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

const challengeStatusDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_challenge_status',
  defaultData: [
    'Challenge Identification',
    'Challenge Creation',
    'Challenge Curation',
    'Challenge Review',
    'Challenge Modification / Refinement',
    'Challenge Rejection',
    'Challenge Approved for Publishing',
    'Challenge Published',
    'Solution Collection Phase',
    'Challenge Evaluation',
    'Challenge Closed'
  ],
  version: 1
});

const ChallengeStatusConfig = () => {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadedStatuses = challengeStatusDataManager.loadData();
    setStatuses(loadedStatuses);
  }, []);

  // Save data whenever statuses change
  useEffect(() => {
    if (statuses.length > 0) {
      challengeStatusDataManager.saveData(statuses);
    }
  }, [statuses]);

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      if (statuses.includes(newStatus.trim())) {
        toast({
          title: "Error",
          description: "This status already exists.",
          variant: "destructive",
        });
        return;
      }
      setStatuses([...statuses, newStatus.trim()]);
      setNewStatus('');
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Challenge status added successfully",
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
        description: "Challenge status updated successfully",
      });
    }
  };

  const handleDeleteStatus = (index: number) => {
    const statusToRemove = statuses[index];
    const updatedStatuses = statuses.filter((_, i) => i !== index);
    setStatuses(updatedStatuses);
    toast({
      title: "Success",
      description: `${statusToRemove} deleted successfully`,
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

  const resetToDefault = () => {
    const defaultStatuses = [
      'Challenge Identification',
      'Challenge Creation',
      'Challenge Curation',
      'Challenge Review',
      'Challenge Modification / Refinement',
      'Challenge Rejection',
      'Challenge Approved for Publishing',
      'Challenge Published',
      'Solution Collection Phase',
      'Challenge Evaluation',
      'Challenge Closed'
    ];
    setStatuses(defaultStatuses);
    toast({
      title: "Reset Complete",
      description: "Challenge statuses have been reset to the default workflow.",
    });
  };

  const getStatusPhase = (status: string) => {
    if (status.includes('Identification') || status.includes('Creation') || status.includes('Curation')) {
      return 'creation';
    }
    if (status.includes('Review') || status.includes('Modification') || status.includes('Rejection')) {
      return 'review';
    }
    if (status.includes('Approved') || status.includes('Published') || status.includes('Collection')) {
      return 'active';
    }
    if (status.includes('Evaluation') || status.includes('Closed')) {
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
        <h2 className="text-3xl font-bold text-foreground mb-2">Challenge Status Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage challenge statuses for the complete challenge lifecycle workflow
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Challenge Statuses</CardTitle>
              <CardDescription>
                Configure available statuses for challenges in their lifecycle workflow
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
                Reset to Default
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
                <Label htmlFor="new-status">New Challenge Status</Label>
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
            {statuses.map((status, index) => {
              const phase = getStatusPhase(status);
              const phaseColor = getPhaseColor(phase);
              
              return (
                <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${phaseColor} hover:bg-muted/50 transition-colors`}>
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
                        <Badge variant="outline" className="capitalize">{phase}</Badge>
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
              );
            })}
          </div>

          {statuses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No challenge statuses configured.</p>
              <p className="text-sm mt-1">Click "Reset to Default" to load the standard workflow statuses.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeStatusConfig;
