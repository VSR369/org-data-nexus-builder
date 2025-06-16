import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

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
          Manage solution statuses for the evaluation workflow
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
            <Button
              onClick={resetToDefault}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addStatus()}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addStatus}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {solutionStatuses.map((status, index) => {
              const phase = getStatusPhase(status);
              const phaseColor = getPhaseColor(phase);
              
              return (
                <div key={index} className={`flex items-center justify-between py-3 px-4 border rounded-lg ${phaseColor}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{status}</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeStatus(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionStatusConfig;
