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
}

const defaultStatuses = [
  'Challenge Posted',
  'Challenge Published',
  'Challenge Under Review',
  'Challenge Active - Solutions Being Collected',
  'Challenge Closed for Submissions',
  'Challenge Under Evaluation',
  'Challenge Completed - Solutions Selected',
  'Challenge Archived'
];

const ChallengeStatusConfigSupabase = () => {
  const { toast } = useToast();
  const [challengeStatuses, setChallengeStatuses] = useState<ChallengeStatus[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    fetchChallengeStatuses();
  }, []);

  const fetchChallengeStatuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_challenge_statuses')
        .select('*')
        .order('name');

      if (error) throw error;

      setChallengeStatuses(data || []);
      
      // If no data exists, insert default data
      if (!data || data.length === 0) {
        await insertDefaultData();
      }
    } catch (error) {
      console.error('Error fetching challenge statuses:', error);
      toast({
        title: "Error",
        description: "Failed to load challenge statuses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultData = async () => {
    try {
      const { error } = await supabase
        .from('master_challenge_statuses')
        .insert(defaultStatuses.map(name => ({ name })));

      if (error) throw error;
      
      fetchChallengeStatuses();
    } catch (error) {
      console.error('Error inserting default challenge statuses:', error);
    }
  };

  const handleAddStatus = async () => {
    if (newStatus.trim()) {
      try {
        // Check for duplicates
        const duplicate = challengeStatuses.find(s => 
          s.name.toLowerCase() === newStatus.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A challenge status with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_challenge_statuses')
          .insert([{ name: newStatus.trim() }]);

        if (error) throw error;

        setNewStatus('');
        setIsAdding(false);
        fetchChallengeStatuses();
        toast({
          title: "Success",
          description: "Challenge status added successfully",
        });
      } catch (error) {
        console.error('Error adding challenge status:', error);
        toast({
          title: "Error",
          description: "Failed to add challenge status.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditingValue(challengeStatuses[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingIndex !== null) {
      try {
        const statusToUpdate = challengeStatuses[editingIndex];
        
        const { error } = await supabase
          .from('master_challenge_statuses')
          .update({ name: editingValue.trim() })
          .eq('id', statusToUpdate.id);

        if (error) throw error;

        setEditingIndex(null);
        setEditingValue('');
        fetchChallengeStatuses();
        toast({
          title: "Success",
          description: "Challenge status updated successfully",
        });
      } catch (error) {
        console.error('Error updating challenge status:', error);
        toast({
          title: "Error",
          description: "Failed to update challenge status.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteStatus = async (index: number) => {
    try {
      const statusToDelete = challengeStatuses[index];
      
      const { error } = await supabase
        .from('master_challenge_statuses')
        .delete()
        .eq('id', statusToDelete.id);

      if (error) throw error;

      fetchChallengeStatuses();
      toast({
        title: "Success",
        description: "Challenge status deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting challenge status:', error);
      toast({
        title: "Error",
        description: "Failed to delete challenge status.",
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

  const handleResetToDefault = async () => {
    try {
      // Clear existing data
      await supabase.from('master_challenge_statuses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default data
      const { error } = await supabase
        .from('master_challenge_statuses')
        .insert(defaultStatuses.map(name => ({ name })));

      if (error) throw error;

      fetchChallengeStatuses();
      setEditingIndex(null);
      setEditingValue('');
      setIsAdding(false);
      setNewStatus('');
      toast({
        title: "Success",
        description: "Challenge statuses reset to default values",
      });
    } catch (error) {
      console.error('Error resetting challenge statuses:', error);
      toast({
        title: "Error",
        description: "Failed to reset challenge statuses.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading challenge statuses...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Challenge Statuses</CardTitle>
            <CardDescription>
              Configure challenge statuses for the complete challenge lifecycle
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchChallengeStatuses}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Challenge Statuses ({challengeStatuses.length})</h3>
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
              <Label htmlFor="new-challenge-status">New Challenge Status</Label>
              <Input
                id="new-challenge-status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Enter challenge status name"
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
          {challengeStatuses.map((status, index) => (
            <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                    <span className="font-medium">{status.name}</span>
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
      </CardContent>
    </Card>
  );
};

export default ChallengeStatusConfigSupabase;