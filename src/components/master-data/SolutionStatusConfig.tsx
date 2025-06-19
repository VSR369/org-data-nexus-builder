
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save, RotateCcw, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const solutionStatusDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_solution_status',
  defaultData: [
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
  ],
  version: 1
});

const SolutionStatusConfig = () => {
  const [solutionStatuses, setSolutionStatuses] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedStatuses = solutionStatusDataManager.loadData();
    setSolutionStatuses(loadedStatuses);
  }, []);

  // Save data whenever solutionStatuses change
  useEffect(() => {
    if (solutionStatuses.length > 0) {
      solutionStatusDataManager.saveData(solutionStatuses);
    }
  }, [solutionStatuses]);

  const addStatus = () => {
    if (newStatus.trim() !== '') {
      if (solutionStatuses.includes(newStatus.trim())) {
        toast({
          title: "Error",
          description: "This status already exists.",
          variant: "destructive",
        });
        return;
      }
      setSolutionStatuses([...solutionStatuses, newStatus.trim()]);
      setNewStatus('');
      setIsAdding(false);
      toast({
        title: "Status Added",
        description: `${newStatus.trim()} has been added to the list.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Status cannot be empty.",
        variant: "destructive",
      });
    }
  };

  const removeStatus = (index: number) => {
    const statusToRemove = solutionStatuses[index];
    const updatedStatuses = [...solutionStatuses];
    updatedStatuses.splice(index, 1);
    setSolutionStatuses(updatedStatuses);
    toast({
      title: "Status Removed",
      description: `${statusToRemove} has been removed from the list.`,
    });
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditingValue(solutionStatuses[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const updatedStatuses = [...solutionStatuses];
      updatedStatuses[editingIndex] = editingValue.trim();
      setSolutionStatuses(updatedStatuses);
      setEditingIndex(null);
      setEditingValue('');
      toast({
        title: "Success",
        description: "Solution status updated successfully",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStatus('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    solutionStatusDataManager.saveData(solutionStatuses);
    toast({
      title: "Statuses Saved",
      description: "The solution statuses have been saved.",
    });
  };

  const resetToDefault = () => {
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
    setSolutionStatuses(defaultStatuses);
    toast({
      title: "Reset Complete",
      description: "Solution statuses have been reset to the default workflow.",
    });
  };

  const getStatusPhase = (status: string) => {
    if (status.includes('Submission') || status.includes('Shortlisting') || status.includes('Screening')) {
      return 'submission';
    }
    if (status.includes('Assessment') || status.includes('Voting') || status.includes('Evaluation') || status.includes('Payment')) {
      return 'evaluation';
    }
    if (status.includes('Finalized') || status.includes('Selection & Reward')) {
      return 'finalization';
    }
    return 'other';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'submission': return 'bg-blue-50 border-blue-200';
      case 'evaluation': return 'bg-orange-50 border-orange-200';
      case 'finalization': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Solution Status Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage solution statuses for the complete evaluation workflow and lifecycle
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Solution Statuses</CardTitle>
              <CardDescription>
                Add, remove, or modify solution statuses for your evaluation workflow.
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
        <CardContent className="grid gap-4">
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
                <Button onClick={addStatus} size="sm" className="flex items-center gap-1">
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
          
          <div className="space-y-2">
            {solutionStatuses.map((status, index) => {
              const phase = getStatusPhase(status);
              const phaseColor = getPhaseColor(phase);
              
              return (
                <div key={index} className={`flex items-center justify-between py-3 px-4 border rounded-lg ${phaseColor} hover:bg-muted/50 transition-colors`}>
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
                          onClick={() => removeStatus(index)}
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {solutionStatuses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No solution statuses configured.</p>
              <p className="text-sm mt-1">Click "Reset to Default" to load the standard workflow statuses.</p>
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionStatusConfig;
