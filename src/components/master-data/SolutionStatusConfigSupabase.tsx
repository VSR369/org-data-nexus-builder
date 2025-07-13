import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save, RotateCcw, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface SolutionStatus {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

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

const SolutionStatusConfigSupabase = () => {
  const [solutionStatuses, setSolutionStatuses] = useState<SolutionStatus[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_solution_statuses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Solution Statuses loaded from Supabase:', data);
      
      // If no data exists, insert default data
      if (!data || data.length === 0) {
        await insertDefaultData();
      } else {
        setSolutionStatuses(data);
      }
    } catch (error) {
      console.error('Error loading solution statuses:', error);
      toast({
        title: "Error",
        description: "Failed to load solution statuses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultData = async () => {
    try {
      const defaultData = defaultStatuses.map(name => ({ name }));
      const { error } = await supabase
        .from('master_solution_statuses')
        .insert(defaultData);
      
      if (error) throw error;
      loadStatuses();
    } catch (error) {
      console.error('Error inserting default data:', error);
    }
  };

  const addStatus = async () => {
    if (newStatus.trim() !== '') {
      if (solutionStatuses.some(status => status.name === newStatus.trim())) {
        toast({
          title: "Error",
          description: "This status already exists.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        const { error } = await supabase
          .from('master_solution_statuses')
          .insert({ name: newStatus.trim() });

        if (error) throw error;
        
        setNewStatus('');
        setIsAdding(false);
        loadStatuses();
        toast({
          title: "Status Added",
          description: `${newStatus.trim()} has been added to the list.`,
        });
      } catch (error) {
        console.error('Error adding status:', error);
        toast({
          title: "Error",
          description: "Failed to add status",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Status cannot be empty.",
        variant: "destructive",
      });
    }
  };

  const removeStatus = async (index: number) => {
    try {
      const statusToDelete = solutionStatuses[index];
      const { error } = await supabase
        .from('master_solution_statuses')
        .delete()
        .eq('id', statusToDelete.id);

      if (error) throw error;
      
      loadStatuses();
      toast({
        title: "Status Removed",
        description: `${statusToDelete.name} has been removed from the list.`,
      });
    } catch (error) {
      console.error('Error removing status:', error);
      toast({
        title: "Error",
        description: "Failed to remove status",
        variant: "destructive",
      });
    }
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditingValue(solutionStatuses[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingIndex !== null) {
      try {
        const statusToUpdate = solutionStatuses[editingIndex];
        const { error } = await supabase
          .from('master_solution_statuses')
          .update({ name: editingValue.trim() })
          .eq('id', statusToUpdate.id);

        if (error) throw error;
        
        setEditingIndex(null);
        setEditingValue('');
        loadStatuses();
        toast({
          title: "Success",
          description: "Solution status updated successfully",
        });
      } catch (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      }
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

  const resetToDefault = async () => {
    try {
      // Clear existing data
      const { error: deleteError } = await supabase
        .from('master_solution_statuses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      // Insert default data
      await insertDefaultData();
      
      toast({
        title: "Reset Complete",
        description: "Solution statuses have been reset to the default workflow.",
      });
    } catch (error) {
      console.error('Error resetting to default:', error);
      toast({
        title: "Error",
        description: "Failed to reset to default",
        variant: "destructive",
      });
    }
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
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
              <Button 
                onClick={() => setIsAdding(true)} 
                disabled={isAdding || loading}
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
                <Button onClick={addStatus} size="sm" className="flex items-center gap-1" disabled={loading}>
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
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : solutionStatuses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No solution statuses configured.</p>
                <p className="text-sm mt-1">Click "Reset to Default" to load the standard workflow statuses.</p>
              </div>
            ) : (
              solutionStatuses.map((status, index) => {
                const phase = getStatusPhase(status.name);
                const phaseColor = getPhaseColor(phase);
                
                return (
                  <div key={status.id} className={`flex items-center justify-between py-3 px-4 border rounded-lg ${phaseColor} hover:bg-muted/50 transition-colors`}>
                    {editingIndex === index ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1" disabled={loading}>
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
                            onClick={() => handleEditStatus(index)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            disabled={loading}
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => removeStatus(index)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          <Button onClick={() => toast({ title: "All Changes Saved", description: "Changes are automatically saved to the database." })} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionStatusConfigSupabase;