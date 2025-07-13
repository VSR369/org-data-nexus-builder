import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChallengeStatus {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

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

const ChallengeStatusConfigSupabase = () => {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<ChallengeStatus[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_challenge_statuses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // If no data exists, insert default data
      if (!data || data.length === 0) {
        await insertDefaultData();
      } else {
        setStatuses(data);
      }
    } catch (error) {
      console.error('Error loading challenge statuses:', error);
      toast({
        title: "Error",
        description: "Failed to load challenge statuses",
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
        .from('master_challenge_statuses')
        .insert(defaultData);
      
      if (error) throw error;
      loadStatuses();
    } catch (error) {
      console.error('Error inserting default data:', error);
    }
  };

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
      
      try {
        const { error } = await supabase
          .from('master_challenge_statuses')
          .insert({ name: newStatus.trim() });

        if (error) throw error;
        
        setNewStatus('');
        setIsAdding(false);
        loadStatuses();
        toast({
          title: "Success",
          description: "Challenge status added successfully",
        });
      } catch (error) {
        console.error('Error adding status:', error);
        toast({
          title: "Error",
          description: "Failed to add status",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditingValue(statuses[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingIndex !== null) {
      try {
        const statusToUpdate = statuses[editingIndex];
        const { error } = await supabase
          .from('master_challenge_statuses')
          .update({ name: editingValue.trim() })
          .eq('id', statusToUpdate.id);

        if (error) throw error;
        
        setEditingIndex(null);
        setEditingValue('');
        loadStatuses();
        toast({
          title: "Success",
          description: "Challenge status updated successfully",
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

  const handleDeleteStatus = async (index: number) => {
    try {
      const statusToDelete = statuses[index];
      const { error } = await supabase
        .from('master_challenge_statuses')
        .delete()
        .eq('id', statusToDelete.id);

      if (error) throw error;
      
      loadStatuses();
      toast({
        title: "Success",
        description: `${statusToDelete.name} deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting status:', error);
      toast({
        title: "Error",
        description: "Failed to delete status",
        variant: "destructive",
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

  const resetToDefault = async () => {
    try {
      // Clear existing data
      const { error: deleteError } = await supabase
        .from('master_challenge_statuses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      // Insert default data
      await insertDefaultData();
      
      toast({
        title: "Reset Complete",
        description: "Challenge statuses have been reset to the default workflow.",
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
                <Button onClick={handleAddStatus} size="sm" className="flex items-center gap-1" disabled={loading}>
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
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : statuses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No challenge statuses configured.</p>
                <p className="text-sm mt-1">Click "Reset to Default" to load the standard workflow statuses.</p>
              </div>
            ) : (
              statuses.map((status, index) => {
                const phase = getStatusPhase(status.name);
                const phaseColor = getPhaseColor(phase);
                
                return (
                  <div key={status.id} className={`flex items-center justify-between p-3 border rounded-lg ${phaseColor} hover:bg-muted/50 transition-colors`}>
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
                            onClick={() => handleDeleteStatus(index)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            disabled={loading}
                          >
                            <Trash2 className="w-3 h-3" />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeStatusConfigSupabase;