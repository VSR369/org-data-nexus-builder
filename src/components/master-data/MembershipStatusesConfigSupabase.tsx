
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Search, 
  Users, Shield, AlertTriangle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MembershipStatus {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultMembershipStatuses = [
  { name: 'Active', description: 'Active membership with full access', is_active: true },
  { name: 'Inactive', description: 'Inactive membership with limited access', is_active: true },
  { name: 'Pending', description: 'Pending membership approval', is_active: true },
  { name: 'Suspended', description: 'Temporarily suspended membership', is_active: true },
  { name: 'Expired', description: 'Expired membership requiring renewal', is_active: true }
];

const MembershipStatusesConfigSupabase = () => {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<MembershipStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newStatus, setNewStatus] = useState({ 
    name: '', 
    description: '', 
    is_active: true 
  });
  const [editingItem, setEditingItem] = useState<MembershipStatus | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: MembershipStatus} | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
      console.log('✅ Membership Statuses loaded:', data);
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

  const handleResetToDefault = async () => {
    try {
      // Clear existing statuses
      await supabase.from('master_membership_statuses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default statuses
      const { error } = await supabase
        .from('master_membership_statuses')
        .insert(defaultMembershipStatuses);

      if (error) throw error;

      fetchStatuses();
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

  const handleEdit = (item: MembershipStatus) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('master_membership_statuses')
        .update({
          name: editingItem.name.trim(),
          description: editingItem.description?.trim() || null,
          is_active: editingItem.is_active
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
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
  };

  const handleDelete = async (item: MembershipStatus) => {
    try {
      const { error } = await supabase
        .from('master_membership_statuses')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setDeleteDialog(null);
      fetchStatuses();
      toast({
        title: "Deleted",
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

  const handleToggleStatus = async (item: MembershipStatus) => {
    try {
      const { error } = await supabase
        .from('master_membership_statuses')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      fetchStatuses();
      toast({
        title: "Status Updated",
        description: `Membership status ${!item.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  // Filter statuses based on search term
  const filteredStatuses = statuses.filter(status => 
    status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (status.description && status.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading membership statuses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Membership Statuses Manager
              </CardTitle>
              <CardDescription>
                Manage membership status types and levels for user access control
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search membership statuses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Membership Statuses Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{statuses.length}</div>
              <div className="text-sm text-muted-foreground">Total Statuses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {statuses.filter(s => s.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Statuses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {statuses.filter(s => !s.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Inactive Statuses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Membership Statuses</CardTitle>
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Status
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="new-status-active"
                      checked={newStatus.is_active}
                      onCheckedChange={(checked) => setNewStatus({...newStatus, is_active: checked})}
                    />
                    <Label htmlFor="new-status-active">Active</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-status-description">Description</Label>
                  <Textarea
                    id="new-status-description"
                    value={newStatus.description}
                    onChange={(e) => setNewStatus({...newStatus, description: e.target.value})}
                    placeholder="Enter description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleAddStatus} size="sm" className="flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Save
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline" size="sm" className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Statuses List */}
          <div className="space-y-4">
            {filteredStatuses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No membership statuses found. Add some statuses to get started.</p>
              </div>
            ) : (
              filteredStatuses.map((status) => (
                <div key={status.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{status.name}</span>
                        <Badge variant={status.is_active ? "default" : "secondary"}>
                          {status.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {status.description && (
                        <p className="text-sm text-muted-foreground mt-1">{status.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(status)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Switch checked={status.is_active} className="w-3 h-3" />
                      {status.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(status)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteDialog({ open: true, item: status })}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog?.open} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the membership status "{deleteDialog?.item?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog.item)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MembershipStatusesConfigSupabase;
