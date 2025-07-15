import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MembershipStatus {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
}

const defaultMembershipStatuses = [
  { name: 'Active', description: 'Active membership with full access', is_active: true },
  { name: 'Inactive', description: 'Inactive membership with limited access', is_active: true },
  { name: 'Suspended', description: 'Temporarily suspended membership', is_active: true },
  { name: 'Pending', description: 'Pending membership approval', is_active: true },
  { name: 'Expired', description: 'Expired membership requiring renewal', is_active: true }
];

const MembershipStatusesConfig = () => {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<MembershipStatus[]>([]);
  const [newStatus, setNewStatus] = useState({ name: '', description: '', is_active: true });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', is_active: true });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_membership_statuses')
        .select('*')
        .order('name');

      if (error) throw error;

      setStatuses(data || []);
    } catch (error) {
      console.error('Error fetching membership statuses:', error);
      toast({
        title: "Error",
        description: "Failed to load membership statuses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStatus = async () => {
    if (newStatus.name.trim()) {
      try {
        const duplicate = statuses.find(s => 
          s.name.toLowerCase() === newStatus.name.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A membership status with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_membership_statuses')
          .insert([{
            name: newStatus.name.trim(),
            description: newStatus.description.trim() || null,
            is_active: newStatus.is_active
          }]);

        if (error) throw error;

        setNewStatus({ name: '', description: '', is_active: true });
        setIsAdding(false);
        fetchStatuses();
        toast({
          title: "Success",
          description: "Membership status added successfully",
        });
      } catch (error) {
        console.error('Error adding membership status:', error);
        toast({
          title: "Error",
          description: "Failed to add membership status.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditingValue({
      name: statuses[index].name,
      description: statuses[index].description || '',
      is_active: statuses[index].is_active
    });
  };

  const handleSaveEdit = async () => {
    if (editingValue.name.trim() && editingIndex !== null) {
      try {
        const statusToUpdate = statuses[editingIndex];
        
        const { error } = await supabase
          .from('master_membership_statuses')
          .update({
            name: editingValue.name.trim(),
            description: editingValue.description.trim() || null,
            is_active: editingValue.is_active
          })
          .eq('id', statusToUpdate.id);

        if (error) throw error;

        setEditingIndex(null);
        setEditingValue({ name: '', description: '', is_active: true });
        fetchStatuses();
        toast({
          title: "Success",
          description: "Membership status updated successfully",
        });
      } catch (error) {
        console.error('Error updating membership status:', error);
        toast({
          title: "Error",
          description: "Failed to update membership status.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteStatus = async (index: number) => {
    try {
      const statusToDelete = statuses[index];
      
      const { error } = await supabase
        .from('master_membership_statuses')
        .delete()
        .eq('id', statusToDelete.id);

      if (error) throw error;

      fetchStatuses();
      toast({
        title: "Success",
        description: "Membership status deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting membership status:', error);
      toast({
        title: "Error",
        description: "Failed to delete membership status.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue({ name: '', description: '', is_active: true });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStatus({ name: '', description: '', is_active: true });
  };

  const handleResetToDefault = async () => {
    try {
      await supabase.from('master_membership_statuses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error } = await supabase
        .from('master_membership_statuses')
        .insert(defaultMembershipStatuses);

      if (error) throw error;

      fetchStatuses();
      setEditingIndex(null);
      setEditingValue({ name: '', description: '', is_active: true });
      setIsAdding(false);
      setNewStatus({ name: '', description: '', is_active: true });
      toast({
        title: "Success",
        description: "Membership statuses reset to default values",
      });
    } catch (error) {
      console.error('Error resetting membership statuses:', error);
      toast({
        title: "Error",
        description: "Failed to reset membership statuses.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading membership statuses...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Membership Statuses</CardTitle>
            <CardDescription>
              Configure membership states for user account management
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchStatuses}
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
          <h3 className="text-lg font-medium">Current Statuses ({statuses.length})</h3>
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
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-status-name">Status Name</Label>
                <Input
                  id="new-status-name"
                  value={newStatus.name}
                  onChange={(e) => setNewStatus({...newStatus, name: e.target.value})}
                  placeholder="Enter status name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-status-description">Description</Label>
                <Input
                  id="new-status-description"
                  value={newStatus.description}
                  onChange={(e) => setNewStatus({...newStatus, description: e.target.value})}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-status-active"
                  checked={newStatus.is_active}
                  onCheckedChange={(checked) => setNewStatus({...newStatus, is_active: checked as boolean})}
                />
                <Label htmlFor="new-status-active">Active</Label>
              </div>
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
            <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingValue.name}
                      onChange={(e) => setEditingValue({...editingValue, name: e.target.value})}
                      placeholder="Status name"
                    />
                    <Input
                      value={editingValue.description}
                      onChange={(e) => setEditingValue({...editingValue, description: e.target.value})}
                      placeholder="Description"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={editingValue.is_active}
                        onCheckedChange={(checked) => setEditingValue({...editingValue, is_active: checked as boolean})}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <span className="font-medium">{status.name}</span>
                      {status.description && <p className="text-sm text-muted-foreground">{status.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={status.is_active ? "default" : "secondary"}>
                          {status.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
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

export default MembershipStatusesConfig;