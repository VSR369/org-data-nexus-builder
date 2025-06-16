
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

const solutionStatusDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_solution_status',
  defaultData: [
    'Draft',
    'Under Review',
    'Approved',
    'Rejected',
    'Published',
    'Archived'
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

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Solution Status Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage solution statuses for projects and initiatives
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Solution Statuses</CardTitle>
          <CardDescription>
            Add, remove, or modify solution statuses.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addStatus}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <ul className="list-none pl-0">
            {solutionStatuses.map((status, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{status}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeStatus(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
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
